'use client';

import { useState, useRef, useEffect } from 'react';
import { useAI } from '@/hooks/useAI';
import { FiSend, FiUser, FiMessageSquare } from 'react-icons/fi'; // Tous ces icônes sont utilisés dans le JSX

type AIChatProps = {
  userType: 'passenger' | 'driver';
  initialSystemMessage?: string;
  placeholder?: string;
  className?: string;
};

export default function AIChat({
  // userType est utilisé dans le composant parent pour personnaliser le comportement
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userType,
  initialSystemMessage = "You are a helpful assistant for Taxi Express RDC, providing support to users in French and English.",
  placeholder = "Posez votre question ici...",
  className = "",
}: AIChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, error, sendMessage } = useAI({
    initialMessages: [
      { role: 'system', content: initialSystemMessage }
    ],
    maxTokens: 1000,
  });

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    
    try {
      // The useAI hook now handles everything:
      // - Adding the user message to the conversation
      // - Setting loading state
      // - Processing JSON responses automatically
      // - Updating the conversation state
      await sendMessage(userMessage);
      // No need for additional JSON parsing as it's handled in the hook
    } catch (err: any) {
      console.error('Error in AI chat:', err);
      // The useAI hook already handles error state
    }
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-dark-100 rounded-lg shadow-md ${className}`}>
      <div className="bg-primary-600 text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-semibold flex items-center">
          <FiMessageSquare className="mr-2" />
          Assistant Taxi Express
        </h3>
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto max-h-[400px] space-y-4">
        {messages.filter(m => m.role !== 'system').map((message, index) => (
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
                    <FiMessageSquare className="mr-1" />
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
                <FiMessageSquare className="mr-1" />
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
      
      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-dark-300 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
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
