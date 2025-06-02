import { Configuration, OpenAIApi } from 'openai';
import { prisma } from '../server';

interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  profileImageUrl: string | null;
}

interface Driver {
  id: string;
  isAvailable: boolean;
  isActive: boolean;
  currentLatitude: number | null;
  currentLongitude: number | null;
  rating?: number;
  completedRides?: number;
  isPreferred?: boolean;
  user: UserProfile;
  [key: string]: unknown;
}

interface DriverWithDistance extends Omit<Driver, 'currentLatitude' | 'currentLongitude'> {
  distance: number;
  currentLatitude: number;
  currentLongitude: number;
  score?: number;
}

// Initialize OpenAI client
let openai: OpenAIApi | null = null;

if (process.env.OPENAI_API_KEY) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  openai = new OpenAIApi(configuration);
} else {
  console.warn('OPENAI_API_KEY is not set. AI matching will be disabled.');
}

/**
 * Find nearest available drivers to a pickup location
 */
export const findNearestDrivers = async (
  pickupLatitude: number,
  pickupLongitude: number,
  maxDistance = 5,
  limit = 5
): Promise<DriverWithDistance[]> => {
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
    const driversWithDistance = availableDrivers.map((driver): DriverWithDistance => {
      if (driver.currentLatitude === null || driver.currentLongitude === null) {
        throw new Error('Driver location is required');
      }
      
      const distance = calculateHaversineDistance(
        pickupLatitude,
        pickupLongitude,
        driver.currentLatitude,
        driver.currentLongitude
      );
      
      return {
        ...driver,
        distance,
        currentLatitude: driver.currentLatitude,
        currentLongitude: driver.currentLongitude
      };
    });
    
    // Filter drivers within maxDistance
    const nearbyDrivers = driversWithDistance.filter(driver => driver.distance <= maxDistance);
    
    if (nearbyDrivers.length === 0) {
      return [];
    }
    
    // If AI matching is enabled and we have drivers, use it to sort them
    if (process.env.ENABLE_AI_MATCHING === 'true' && openai && nearbyDrivers.length > 1) {
      try {
        return await aiSortDrivers(nearbyDrivers, pickupLatitude, pickupLongitude, limit);
      } catch (error) {
        console.error('Error in AI driver matching, falling back to distance-based sorting:', error);
      }
    }
    
    // Sort by distance and return top results
    return [...nearbyDrivers]
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  } catch (error) {
    console.error('Error finding nearest drivers:', error);
    return [];
  }
};

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

/**
 * Use AI to sort drivers based on multiple factors
 */
async function aiSortDrivers(
  drivers: DriverWithDistance[],
  pickupLatitude: number,
  pickupLongitude: number,
  limit: number
): Promise<DriverWithDistance[]> {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  try {
    // Prepare driver data for the AI prompt
    const driverData = drivers.map(driver => ({
      id: driver.id,
      name: `${driver.user.firstName} ${driver.user.lastName}`.trim(),
      rating: driver.rating || 0,
      completedRides: driver.completedRides || 0,
      distance: parseFloat(driver.distance.toFixed(2)),
      isPreferred: Boolean(driver.isPreferred)
    }));

    const prompt = `Rank these taxi drivers based on the following criteria:
    - Distance from pickup (shorter is better)
    - Driver rating (higher is better, 0-5 scale)
    - Number of completed rides (more is better)
    - Preferred status (preferred is better)

Driver data (in no particular order):
${JSON.stringify(driverData, null, 2)}

Return a JSON array of driver IDs in order of best match first.
Format: ["driver_id1", "driver_id2", ...]`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = response.data.choices[0]?.text?.trim();
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Parse the response
    let rankedIds: string[] = [];
    try {
      const parsedContent = JSON.parse(content);
      if (Array.isArray(parsedContent)) {
        rankedIds = parsedContent.filter((id: unknown) => typeof id === 'string');
      }
      if (rankedIds.length === 0) {
        throw new Error('No valid driver IDs found in response');
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      throw new Error('Invalid response format from AI');
    }

    // Create a map for O(1) lookup of drivers
    const driverMap = new Map(drivers.map(driver => [driver.id, driver]));

    // Sort drivers based on AI ranking
    const sortedDrivers: DriverWithDistance[] = [];
    const usedIds = new Set<string>();

    // Add drivers in the order returned by AI
    for (const id of rankedIds) {
      const driver = driverMap.get(id);
      if (driver && !usedIds.has(id)) {
        sortedDrivers.push(driver);
        usedIds.add(id);
      }
      if (sortedDrivers.length >= limit) break;
    }

    // Add any remaining drivers that weren't included in the AI response
    if (sortedDrivers.length < limit) {
      for (const driver of drivers) {
        if (!usedIds.has(driver.id)) {
          sortedDrivers.push(driver);
          if (sortedDrivers.length >= limit) break;
        }
      }
    }

    return sortedDrivers;
  } catch (error) {
    console.error('Error in AI driver matching:', error);
    // Fall back to distance-based sorting
    return [...drivers]
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }
}
