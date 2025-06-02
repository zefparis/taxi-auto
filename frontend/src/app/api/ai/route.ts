import { NextResponse } from 'next/server';

// Configuration for OpenAI API
const apiKey = process.env.OPENAI_API_KEY;

// Ensure we're using exactly gpt-4-turbo as specified
const model = 'gpt-4-turbo';
const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

// Log configuration (without exposing the full API key)
const apiKeyPrefix = apiKey ? apiKey.substring(0, 10) + '...' : 'undefined';
console.log(`API Configuration - Model: ${model}, API Key prefix: ${apiKeyPrefix}`);


// Helper function to create a fetch request to OpenAI API directly
// This avoids TypeScript constructor issues with the OpenAI client
async function callOpenAI(messages: any[], maxTokens: number) {
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  // Log the model being used (but not the API key for security)
  console.log(`Using model: ${model}`);
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      
      if (errorData.error?.message) {
        throw new Error(errorData.error.message);
      } else {
        throw new Error(`OpenAI API error: ${response.status}`);
      }
    }

    return response.json();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { messages, maxTokens = 500 } = body;

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }

    try {
      // Call OpenAI API using our helper function
      const response = await callOpenAI(messages, maxTokens);
      
      // Ensure we have a valid response
      if (!response.choices || response.choices.length === 0 || !response.choices[0].message) {
        throw new Error('Invalid response from OpenAI API');
      }

      return NextResponse.json({ response: response.choices[0].message });
    } catch (apiError: any) {
      console.error('OpenAI API call error:', apiError);
      
      // Check for API key issues
      if (apiError.message?.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your OpenAI API key configuration.' },
          { status: 401 }
        );
      }
      
      // Check for rate limiting
      if (apiError.message?.includes('rate limit')) {
        return NextResponse.json(
          { error: 'OpenAI rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: apiError.message || 'Error communicating with OpenAI API' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Unexpected error in AI route handler:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
