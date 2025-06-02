interface UserProfile {
    id: string;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    profileImageUrl?: string | null;
    [key: string]: any;
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
/**
 * Find nearest available drivers to a pickup location
 */
export declare const findNearestDrivers: (pickupLatitude: number, pickupLongitude: number, maxDistance?: number, limit?: number) => Promise<DriverWithDistance[]>;
export {};
