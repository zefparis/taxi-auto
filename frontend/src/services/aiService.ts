// OpenAI client is only used in API routes

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

// Client-side function to call the API route
async function callAIEndpoint(messages: any[], maxTokens: number = 500) {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error calling AI endpoint:', error);
    return 'Désolé, une erreur est survenue. Veuillez réessayer plus tard.';
  }
}

// Route optimization function
export async function optimizeRoute(request: RouteOptimizationRequest): Promise<string> {
  const messages = [
    {
      role: 'system' as const,
      content: 'You are a route optimization assistant. Provide the best route based on the given parameters.'
    },
    {
      role: 'user' as const,
      content: `Find the best route from ${request.startLocation} to ${request.endLocation}. Traffic: ${request.trafficConditions}. Time: ${request.timeOfDay}`
    }
  ];

  return callAIEndpoint(messages);
}

// Fare estimation function
export async function estimateFare(request: FareEstimationRequest): Promise<string> {
  const messages = [
    {
      role: 'system' as const,
      content: 'You are a fare estimation assistant. Provide an estimated fare based on the given parameters.'
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
