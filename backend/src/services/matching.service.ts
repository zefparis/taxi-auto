import { Configuration, OpenAIApi } from 'openai';
import { prisma } from '../server';

interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  profileImageUrl?: string | null;
  [key: string]: any; // Allow additional properties
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
    
    // Calculate distance for each driver and filter by maxDistance
    const nearbyDrivers = availableDrivers
    .filter((driver: any) => {
      if (!driver.currentLatitude || !driver.currentLongitude) return false;
      const distance = calculateHaversineDistance(
        pickupLatitude,
        pickupLongitude,
        driver.currentLatitude,
        driver.currentLongitude
      );
      return distance <= maxDistance;
    })
    .map((driver: any) => ({
      ...driver,
      currentLatitude: driver.currentLatitude as number,
      currentLongitude: driver.currentLongitude as number,
      distance: calculateHaversineDistance(
        pickupLatitude,
        pickupLongitude,
        driver.currentLatitude as number,
        driver.currentLongitude as number
      ),
    }));
    if (nearbyDrivers.length === 0) {
      return [];
    }
    
    // If AI matching is enabled and we have drivers, use it to sort them
    if (process.env.ENABLE_AI_MATCHING === 'true' && openai && nearbyDrivers.length > 1) {
      try {
        return await aiSortDrivers(nearbyDrivers as DriverWithDistance[], pickupLatitude, pickupLongitude, limit);
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
    const driverInfo = drivers.map(driver => {
      const user = driver.user as any; // Cast user to any to avoid TypeScript errors
      return {
        id: driver.id,
        name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Chauffeur',
        rating: (driver as any).rating || 4.5,
        completedRides: (driver as any).completedRides || 0,
        isPreferred: !!(driver as any).isPreferred,
        distance: driver.distance,
        driver
      };
    });

    const prompt = `Rank these taxi drivers based on the following criteria:
    - Distance from pickup (shorter is better)
    - Driver rating (higher is better)
    - Number of completed rides (higher is better)
    - Preferred status (if applicable)

    Driver data (JSON format):
    ${JSON.stringify(driverInfo, null, 2)}

    Return a JSON array of driver IDs in order of best match to worst match.`;

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
        rankedIds = parsedContent.filter((id): id is string => typeof id === 'string');
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
      // Ensure id is treated as string
      const driverId = String(id);
      const driver = driverMap.get(driverId);
      if (driver && !usedIds.has(driverId)) {
        sortedDrivers.push(driver);
        usedIds.add(driverId);
      }
      if (sortedDrivers.length >= limit) break;
    }

    // Add any remaining drivers that weren't included in the AI response
    if (sortedDrivers.length < limit) {
      for (const driver of drivers) {
        const driverId = String(driver.id); // Ensure id is treated as string
        if (!usedIds.has(driverId)) {
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
