'use client';

import { useState, useRef, useEffect } from 'react';
import { provideDriverAssistance } from '@/services/aiService';
import { FiSend, FiUser, FiHelpCircle, FiTruck } from 'react-icons/fi';

type AIDriverAssistantProps = {
  driverName?: string;
  className?: string;
};

export default function AIDriverAssistant({ 
  driverName = '', 
  className = "" 
}: AIDriverAssistantProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample quick questions
  const quickQuestions = [
    "Comment puis-je améliorer ma note de chauffeur?",
    "Que faire en cas de problème avec un client?",
    "Comment naviguer dans les zones encombrées?",
    "Comment économiser du carburant?"
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    // Add user message to conversation
    const newUserMessage = { role: 'user' as const, content: userMessage };
    const updatedConversation = [...messages, newUserMessage];
    setMessages(updatedConversation);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Get response from AI
      const response = await provideDriverAssistance(userMessage);
      
      // Check if response is JSON and parse it if needed
      let processedResponse = response;
      if (response.startsWith('{') && response.endsWith('}')) {
        try {
          const parsedResponse = JSON.parse(response);
          // Extract the content from the parsed JSON if it has a message or content field
          if (parsedResponse.message) {
            processedResponse = parsedResponse.message;
          } else if (parsedResponse.content) {
            processedResponse = parsedResponse.content;
          } else if (parsedResponse.response) {
            processedResponse = parsedResponse.response;
          }
        } catch (parseError) {
          console.error('JSON parsing error:', parseError);
          console.log('Raw response:', response);
          // Continue with the original response if parsing fails
        }
      }
      
      // Add AI response to conversation
      const aiMessage = { role: 'assistant' as const, content: processedResponse };
      setMessages([...updatedConversation, aiMessage]);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la communication avec l\'assistant');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle quick question selection
  const handleQuickQuestion = (question: string) => {
    setInput(question);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className={`bg-white dark:bg-dark-100 rounded-lg shadow-md flex flex-col ${className}`}>
      <div className="bg-primary-600 text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-semibold flex items-center">
          <FiTruck className="mr-2" />
          Assistant Chauffeur IA
          {driverName && <span className="ml-1">- {driverName}</span>}
        </h3>
      </div>
      
      {messages.length === 0 ? (
        <div className="p-6 text-center">
          <FiHelpCircle className="mx-auto text-5xl text-primary-300 mb-4" />
          <h4 className="text-xl font-semibold mb-2">Comment puis-je vous aider aujourd'hui?</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Je suis votre assistant IA pour vous aider avec toutes vos questions sur la conduite, les itinéraires, et le service client.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="p-3 border border-primary-200 dark:border-primary-800 rounded-lg text-left hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-grow p-4 overflow-y-auto max-h-[400px] space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-tr-none' 
                    : 'bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200 rounded-tl-none'
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.role === 'user' ? (
                    <>
                      <span className="font-medium">Vous</span>
                      <FiUser className="ml-1" />
                    </>
                  ) : (
                    <>
                      <FiTruck className="mr-1" />
                      <span className="font-medium">Assistant</span>
                    </>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200 rounded-tl-none">
                <div className="flex items-center mb-1">
                  <FiTruck className="mr-1" />
                  <span className="font-medium">Assistant</span>
                </div>
                <p className="animate-pulse">En train de répondre...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
              Erreur: {error}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-dark-300 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question ici..."
            disabled={isLoading}
            className="flex-grow p-2 border border-gray-300 dark:border-dark-500 rounded-lg bg-white dark:bg-dark-200 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-primary-600 text-white rounded-lg disabled:opacity-50 hover:bg-primary-700 transition-colors"
            aria-label="Envoyer"
          >
            <FiSend />
          </button>
        </div>
      </form>
    </div>
  );
}
