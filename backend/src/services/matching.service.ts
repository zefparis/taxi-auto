import { OpenAI } from 'openai';
import { prisma } from '../server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Find nearest available drivers to a pickup location
 * 
 * @param pickupLatitude Pickup latitude
 * @param pickupLongitude Pickup longitude
 * @param maxDistance Maximum distance in kilometers (default: 5km)
 * @param limit Maximum number of drivers to return (default: 5)
 * @returns Array of nearest available drivers
 */
export const findNearestDrivers = async (
  pickupLatitude: number,
  pickupLongitude: number,
  maxDistance: number = 5,
  limit: number = 5
): Promise<any[]> => {
  try {
    // Find available drivers
    const availableDrivers = await prisma.driver.findMany({
      where: {
        isAvailable: true,
        isActive: true,
        user: {
          isActive: true,
          isVerified: true
        },
        // Only include drivers with location data
        currentLatitude: { not: null },
        currentLongitude: { not: null }
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            profileImageUrl: true
          }
        }
      }
    });
    
    if (availableDrivers.length === 0) {
      return [];
    }
    
    // Calculate distance for each driver
    const driversWithDistance = availableDrivers.map(driver => {
      const distance = calculateHaversineDistance(
        pickupLatitude,
        pickupLongitude,
        driver.currentLatitude as number,
        driver.currentLongitude as number
      );
      
      return {
        ...driver,
        distance
      };
    });
    
    // Filter drivers within maxDistance
    const nearbyDrivers = driversWithDistance.filter(driver => driver.distance <= maxDistance);
    
    if (nearbyDrivers.length === 0) {
      return [];
    }
    
    // If AI matching is enabled, use it to sort drivers
    if (process.env.ENABLE_AI_MATCHING === 'true' && process.env.OPENAI_API_KEY) {
      try {
        return await aiSortDrivers(nearbyDrivers, pickupLatitude, pickupLongitude, limit);
      } catch (error) {
        console.error('Error in AI driver matching:', error);
        // Fall back to distance-based sorting
      }
    }
    
    // Sort by distance and return top results
    return nearbyDrivers
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  } catch (error) {
    console.error('Error finding nearest drivers:', error);
    return [];
  }
};

/**
 * Calculate distance between two points using Haversine formula
 * 
 * @param lat1 First point latitude
 * @param lon1 First point longitude
 * @param lat2 Second point latitude
 * @param lon2 Second point longitude
 * @returns Distance in kilometers
 */
export const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Use AI to sort drivers based on multiple factors
 * 
 * @param drivers Array of drivers with distance
 * @param pickupLatitude Pickup latitude
 * @param pickupLongitude Pickup longitude
 * @param limit Maximum number of drivers to return
 * @returns Sorted array of drivers
 */
const aiSortDrivers = async (
  drivers: any[],
  pickupLatitude: number,
  pickupLongitude: number,
  limit: number
): Promise<any[]> => {
  try {
    // Get driver ride history and ratings
    const driverIds = drivers.map(d => d.id);
    
    // Get completed ride counts for each driver
    const driverRideCounts = await prisma.ride.groupBy({
      by: ['driverId'],
      where: {
        driverId: { in: driverIds },
        status: 'COMPLETED'
      },
      _count: {
        id: true
      }
    });
    
    // Create a map of driver ID to ride count
    const rideCountMap = driverRideCounts.reduce((map, item) => {
      map[item.driverId] = item._count.id;
      return map;
    }, {} as Record<string, number>);
    
    // Prepare driver data for AI
    const driverData = drivers.map(driver => ({
      id: driver.id,
      distance: driver.distance,
      rating: driver.averageRating || 0,
      completedRides: rideCountMap[driver.id] || 0,
      vehicleType: driver.vehicleType,
      // Add time since last activity (mock data)
      minutesSinceLastActivity: Math.floor(Math.random() * 60)
    }));
    
    // Current time context
    const currentHour = new Date().getHours();
    const isRushHour = (currentHour >= 7 && currentHour <= 9) || 
                       (currentHour >= 17 && currentHour <= 19);
    
    // Prepare prompt for OpenAI
    const prompt = `
      Rank these taxi drivers for a customer at location (${pickupLatitude}, ${pickupLongitude}) 
      based on the following factors:
      - Distance to pickup location
      - Driver rating
      - Number of completed rides
      - Time since last activity
      - Vehicle type suitability
      
      Current context:
      - Time: ${new Date().toLocaleTimeString()}
      - Is rush hour: ${isRushHour}
      
      Driver data:
      ${JSON.stringify(driverData, null, 2)}
      
      Return a JSON array of driver IDs in order of best match first.
      Format: ["driver_id1", "driver_id2", ...]
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a driver matching algorithm for a taxi service. Respond only with a JSON array of driver IDs." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 150
    });
    
    // Parse the response
    const content = response.choices[0].message.content?.trim() || "[]";
    const rankedIds = JSON.parse(content);
    
    // Create a map for O(1) lookup of drivers
    const driverMap = drivers.reduce((map, driver) => {
      map[driver.id] = driver;
      return map;
    }, {} as Record<string, any>);
    
    // Sort drivers based on AI ranking
    const sortedDrivers = rankedIds
      .filter(id => driverMap[id]) // Filter out any IDs not in our original list
      .map(id => driverMap[id])
      .slice(0, limit);
    
    // If AI didn't return enough results, add remaining drivers sorted by distance
    if (sortedDrivers.length < Math.min(limit, drivers.length)) {
      const remainingDrivers = drivers
        .filter(d => !sortedDrivers.some(sd => sd.id === d.id))
        .sort((a, b) => a.distance - b.distance);
      
      sortedDrivers.push(...remainingDrivers.slice(0, limit - sortedDrivers.length));
    }
    
    return sortedDrivers;
  } catch (error) {
    console.error('Error in AI driver sorting:', error);
    // Fall back to distance-based sorting
    return drivers
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }
};
