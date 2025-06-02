import { Configuration, OpenAIApi } from 'openai';
import { prisma } from '../server';

// Initialize OpenAI client
let openai: OpenAIApi | null = null;

if (process.env.OPENAI_API_KEY) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  openai = new OpenAIApi(configuration);
} else {
  console.warn('OPENAI_API_KEY is not set. Dynamic pricing will use default factors.');
}

/**
 * Calculate ride price based on distance, time, and market conditions
 * Uses a combination of base pricing and AI-powered dynamic pricing
 * 
 * @param distance Distance in kilometers
 * @param vehicleType Optional vehicle type (defaults to STANDARD)
 * @returns Calculated price in CDF (Congolese Francs)
 */
export const calculatePrice = async (
  distance: number, 
  vehicleType: 'STANDARD' | 'PREMIUM' | 'SUV' | 'MOTO' = 'STANDARD'
): Promise<number> => {
  try {
    // Get pricing configuration from database
    const pricingConfig = await getPricingConfig();
    
    // Base calculation
    let basePrice = calculateBasePrice(distance, vehicleType, pricingConfig);
    
    // Apply AI dynamic pricing if available
    if (process.env.ENABLE_AI_PRICING === 'true' && process.env.OPENAI_API_KEY) {
      try {
        let dynamicFactor = 1.0;
        if (openai) {
          try {
            dynamicFactor = await getDynamicPricingFactor(distance, vehicleType);
          } catch (error) {
            console.error('Error getting dynamic pricing factor:', error);
          }
        }
        basePrice = Math.round(basePrice * dynamicFactor);
      } catch (error) {
        console.error('Error in AI dynamic pricing:', error);
        // Continue with base price if AI pricing fails
      }
    }
    
    return basePrice;
  } catch (error) {
    console.error('Error calculating price:', error);
    // Fallback to simple calculation if anything fails
    return calculateFallbackPrice(distance, vehicleType);
  }
};

/**
 * Get pricing configuration from database or use defaults
 */
const getPricingConfig = async () => {
  // In a real implementation, this would fetch from database
  // For now, using hardcoded values
  return {
    baseRates: {
      STANDARD: {
        baseFare: 5000, // CDF
        perKm: 1000,    // CDF per kilometer
        perMinute: 100  // CDF per minute
      },
      PREMIUM: {
        baseFare: 8000,
        perKm: 1500,
        perMinute: 150
      },
      SUV: {
        baseFare: 10000,
        perKm: 2000,
        perMinute: 200
      },
      MOTO: {
        baseFare: 3000,
        perKm: 800,
        perMinute: 80
      }
    },
    minimumFare: {
      STANDARD: 5000,
      PREMIUM: 8000,
      SUV: 10000,
      MOTO: 3000
    },
    surgeMultiplier: 1.0, // Default no surge
    timeMultipliers: {
      // Higher rates during peak hours
      morning: 1.2,  // 7-9 AM
      evening: 1.3,  // 5-7 PM
      night: 1.5,    // 10 PM - 5 AM
      normal: 1.0    // Regular hours
    }
  };
};

/**
 * Calculate base price using standard formula
 */
const calculateBasePrice = (
  distance: number, 
  vehicleType: string,
  pricingConfig: any
): number => {
  const rates = pricingConfig.baseRates[vehicleType];
  const minimumFare = pricingConfig.minimumFare[vehicleType];
  
  // Estimate time based on distance (assuming average speed of 30 km/h)
  const estimatedMinutes = Math.round((distance / 30) * 60);
  
  // Apply time-based multiplier
  const hour = new Date().getHours();
  let timeMultiplier = pricingConfig.timeMultipliers.normal;
  
  if (hour >= 7 && hour < 9) {
    timeMultiplier = pricingConfig.timeMultipliers.morning;
  } else if (hour >= 17 && hour < 19) {
    timeMultiplier = pricingConfig.timeMultipliers.evening;
  } else if (hour >= 22 || hour < 5) {
    timeMultiplier = pricingConfig.timeMultipliers.night;
  }
  
  // Calculate price components
  const distanceCharge = rates.perKm * distance;
  const timeCharge = rates.perMinute * estimatedMinutes;
  const calculatedPrice = Math.round((rates.baseFare + distanceCharge + timeCharge) * timeMultiplier);
  
  // Apply surge multiplier if active
  const withSurge = Math.round(calculatedPrice * pricingConfig.surgeMultiplier);
  
  // Ensure minimum fare
  return Math.max(withSurge, minimumFare);
};

/**
 * Get dynamic pricing factor using AI
 */
const getDynamicPricingFactor = async (
  distance: number,
  vehicleType: string
): Promise<number> => {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Calculate dynamic pricing factor for a ${vehicleType} ride of ${distance}km. Consider time of day, demand, and other factors. Return only a number between 0.8 and 2.0.`,
      temperature: 0.3,
      max_tokens: 10
    });

    const content = response.data.choices[0]?.text?.trim();
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    const factor = parseFloat(content) || 1.0;
    return Math.min(Math.max(factor, 0.8), 2.0); // Clamp between 0.8 and 2.0
  } catch (error) {
    console.error('Error in dynamic pricing:', error);
    return 1.0; // Default to no adjustment
  }
};

/**
 * Fallback price calculation if main calculation fails
 */
const calculateFallbackPrice = (
  distance: number, 
  vehicleType: string
): number => {
  // Simple calculation based on vehicle type and distance
  const baseRates = {
    STANDARD: 1000,
    PREMIUM: 1500,
    SUV: 2000,
    MOTO: 800
  };
  
  const baseFare = {
    STANDARD: 5000,
    PREMIUM: 8000,
    SUV: 10000,
    MOTO: 3000
  };
  
  // @ts-ignore
  return baseFare[vehicleType] + Math.round(baseRates[vehicleType] * distance);
};
