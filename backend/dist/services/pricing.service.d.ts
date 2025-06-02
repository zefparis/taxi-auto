/**
 * Calculate ride price based on distance, time, and market conditions
 * Uses a combination of base pricing and AI-powered dynamic pricing
 *
 * @param distance Distance in kilometers
 * @param vehicleType Optional vehicle type (defaults to STANDARD)
 * @returns Calculated price in CDF (Congolese Francs)
 */
export declare const calculatePrice: (distance: number, vehicleType?: "STANDARD" | "PREMIUM" | "SUV" | "MOTO") => Promise<number>;
