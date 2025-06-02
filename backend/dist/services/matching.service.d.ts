/**
 * Find nearest available drivers to a pickup location
 *
 * @param pickupLatitude Pickup latitude
 * @param pickupLongitude Pickup longitude
 * @param maxDistance Maximum distance in kilometers (default: 5km)
 * @param limit Maximum number of drivers to return (default: 5)
 * @returns Array of nearest available drivers
 */
export declare const findNearestDrivers: (pickupLatitude: number, pickupLongitude: number, maxDistance?: number, limit?: number) => Promise<any[]>;
/**
 * Calculate distance between two points using Haversine formula
 *
 * @param lat1 First point latitude
 * @param lon1 First point longitude
 * @param lat2 Second point latitude
 * @param lon2 Second point longitude
 * @returns Distance in kilometers
 */
export declare const calculateHaversineDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
