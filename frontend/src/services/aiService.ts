import OpenAI from 'openai';

// Types for the AI service
export type RouteOptimizationRequest = {
  startLocation: string;
  endLocation: string;
  trafficConditions?: 'light' | 'moderate' | 'heavy';
  timeOfDay?: string;
};

export type FareEstimationRequest = {
  distance: number; // in kilometers
  duration: number; // in minutes
  vehicleType: 'standard' | 'premium';
  timeOfDay: string;
};

export type CustomerServiceRequest = {
  query: string;
  userType: 'passenger' | 'driver';
  previousInteractions?: string[];
};

// Initialize OpenAI client (for server-side usage)
// Note: This is only used server-side in API routes
// For client-side, we use the /api/ai endpoint
const createOpenAIClient = () => {
  // This should only be used in API routes, not in client components
  if (typeof window !== 'undefined') {
    console.error('OpenAI client should not be initialized on the client side');
    return null;
  }
  
  // Import OpenAI dynamically to avoid client-side issues
  // The actual client creation happens in the API route
  return {
    chat: {
      completions: {
        create: async () => {
          throw new Error('Direct OpenAI calls should only be made from API routes');
        }
      }
    }
  };
};

// Client-side function to call the API route
async function callAIEndpoint(messages: any[], maxTokens: number = 500) {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, maxTokens }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to get AI response';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If response is not JSON, get text instead
        const errorText = await response.text();
        console.error('Non-JSON error response:', errorText);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.response.content;
  } catch (error) {
    console.error('AI service error:', error);
    throw new Error('Error communicating with AI service. Please try again later.');
  }
}

// Route optimization function
export async function optimizeRoute(request: RouteOptimizationRequest): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: `You are an AI route optimization assistant for Taxi Express RDC, a taxi service in the Democratic Republic of Congo. 
      Provide the most efficient route based on the given parameters, considering local roads, traffic patterns, and conditions in the DRC.
      Format your response as a JSON object with the following properties:
      - estimatedDistance (in km)
      - estimatedDuration (in minutes)
      - suggestedRoute (array of street/road names)
      - trafficNotes (any relevant traffic information)`,
    },
    {
      role: 'user',
      content: `Please optimize a route from ${request.startLocation} to ${request.endLocation}.
      Traffic conditions: ${request.trafficConditions || 'moderate'}
      Time of day: ${request.timeOfDay || 'current time'}`,
    },
  ];

  return callAIEndpoint(messages, 800);
}

// Fare estimation function
export async function estimateFare(request: FareEstimationRequest): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: `You are an AI fare estimation assistant for Taxi Express RDC, a taxi service in the Democratic Republic of Congo.
      Provide a fare estimate based on the given parameters, considering local pricing models and conditions in the DRC.
      Format your response as a JSON object with the following properties:
      - baseFare (in Congolese Francs)
      - distanceCost (in Congolese Francs)
      - timeCost (in Congolese Francs)
      - totalFare (in Congolese Francs)
      - currency (should be "FC" for Congolese Francs)`,
    },
    {
      role: 'user',
      content: `Please estimate the fare for a trip with the following details:
      Distance: ${request.distance} km
      Duration: ${request.duration} minutes
      Vehicle type: ${request.vehicleType}
      Time of day: ${request.timeOfDay}`,
    },
  ];

  return callAIEndpoint(messages, 500);
}

// Customer service function
export async function handleCustomerService(request: CustomerServiceRequest): Promise<string> {
  const previousContext = request.previousInteractions 
    ? `Previous interactions: ${request.previousInteractions.join('\n')}` 
    : '';

  const messages = [
    {
      role: 'system',
      content: `You are a helpful customer service assistant for Taxi Express RDC, a taxi service in the Democratic Republic of Congo.
      Provide friendly, concise, and helpful responses to ${request.userType} queries. 
      Use a professional tone and be knowledgeable about taxi services in the DRC.
      If you don't know the answer to a specific question, suggest contacting the support team directly.
      ${previousContext}`,
    },
    {
      role: 'user',
      content: request.query,
    },
  ];

  return callAIEndpoint(messages, 1000);
}

// Driver assistance function
export async function provideDriverAssistance(query: string): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: `You are an AI assistant for Taxi Express RDC drivers in the Democratic Republic of Congo.
      Provide helpful guidance on driving routes, passenger interactions, app usage, and other driver-related queries.
      Be concise, practical, and consider the local context of driving in DRC cities.`,
    },
    {
      role: 'user',
      content: query,
    },
  ];

  return callAIEndpoint(messages, 800);
}
