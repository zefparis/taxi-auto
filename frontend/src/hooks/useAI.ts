import { useState } from 'react';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type UseAIOptions = {
  initialMessages?: Message[];
  maxTokens?: number;
};

export function useAI(options: UseAIOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(options.initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string, systemMessage?: string) => {
    setIsLoading(true);
    setError(null);

    // Add system message if provided
    const updatedMessages = [...messages];
    if (systemMessage && !messages.some(m => m.role === 'system')) {
      updatedMessages.unshift({ role: 'system', content: systemMessage });
    }

    // Add user message
    const userMessage: Message = { role: 'user', content };
    updatedMessages.push(userMessage);
    setMessages(updatedMessages);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          maxTokens: options.maxTokens || 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      const assistantMessage = data.response;

      // Process the response for potential JSON content
      const processedContent = processJsonResponse(assistantMessage.content);
      if (processedContent !== assistantMessage.content) {
        assistantMessage.content = processedContent;
      }

      // Add assistant message to the state
      setMessages([...updatedMessages, assistantMessage]);
      setIsLoading(false);
      return assistantMessage.content;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsLoading(false);
      return null;
    }
  };

  // Helper function to process JSON responses
  const processJsonResponse = (response: string): string => {
    if (!response || typeof response !== 'string') return response;
    
    // Check if response is JSON and parse it if needed
    if (response.startsWith('{') && response.endsWith('}')) {
      try {
        const parsedResponse = JSON.parse(response);
        // Extract the content from the parsed JSON if it has a message or content field
        if (parsedResponse.message) {
          return parsedResponse.message;
        } else if (parsedResponse.content) {
          return parsedResponse.content;
        } else if (parsedResponse.response) {
          return parsedResponse.response;
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.log('Raw response:', response);
        // Continue with the original response if parsing fails
      }
    }
    return response;
  };

  // Function to update the last assistant message content
  const updateLastMessage = (content: string) => {
    const updatedMessages = [...messages];
    if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === 'assistant') {
      updatedMessages[updatedMessages.length - 1].content = content;
      setMessages(updatedMessages);
    }
  };

  const resetConversation = () => {
    setMessages(options.initialMessages || []);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation,
    updateLastMessage,
  };
}
