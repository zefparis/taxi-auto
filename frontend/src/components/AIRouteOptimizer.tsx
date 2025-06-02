'use client';

import { useState } from 'react';
import { optimizeRoute } from '@/services/aiService';
import { FiMapPin, FiNavigation, FiClock, FiAlertTriangle } from 'react-icons/fi';

type AIRouteOptimizerProps = {
  className?: string;
  onRouteOptimized?: (routeData: any) => void;
};

export default function AIRouteOptimizer({ 
  className = "", 
  onRouteOptimized 
}: AIRouteOptimizerProps) {
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');
  const [trafficConditions, setTrafficConditions] = useState<'light' | 'moderate' | 'heavy'>('moderate');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await optimizeRoute({
        startLocation,
        endLocation,
        trafficConditions,
        timeOfDay: new Date().toLocaleTimeString(),
      });

      // Parse the JSON response from GPT
      try {
        const optimizedRoute = JSON.parse(result);
        setRouteData(optimizedRoute);
        
        if (onRouteOptimized) {
          onRouteOptimized(optimizedRoute);
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.log('Raw response:', result);
        setError('Erreur lors de l\'analyse de la réponse. Format incorrect.');
        setRouteData(null);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'optimisation de l\'itinéraire');
      setRouteData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-dark-100 rounded-lg shadow-md p-5 ${className}`}>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <FiNavigation className="text-primary-600 mr-2" />
        Optimisation d'itinéraire IA
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <FiMapPin className="inline mr-1" /> Lieu de départ
          </label>
          <input
            type="text"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            placeholder="Ex: Centre-ville, Kinshasa"
            className="w-full p-2 border border-gray-300 dark:border-dark-500 rounded-lg bg-white dark:bg-dark-200 text-gray-800 dark:text-gray-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <FiMapPin className="inline mr-1" /> Destination
          </label>
          <input
            type="text"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            placeholder="Ex: Aéroport, Kinshasa"
            className="w-full p-2 border border-gray-300 dark:border-dark-500 rounded-lg bg-white dark:bg-dark-200 text-gray-800 dark:text-gray-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <FiAlertTriangle className="inline mr-1" /> Conditions de circulation
          </label>
          <select
            value={trafficConditions}
            onChange={(e) => setTrafficConditions(e.target.value as 'light' | 'moderate' | 'heavy')}
            className="w-full p-2 border border-gray-300 dark:border-dark-500 rounded-lg bg-white dark:bg-dark-200 text-gray-800 dark:text-gray-200"
            aria-label="Conditions de circulation"
            title="Sélectionner les conditions de circulation actuelles"
          >
            <option value="light">Légère</option>
            <option value="moderate">Modérée</option>
            <option value="heavy">Dense</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Optimisation en cours...' : 'Optimiser l\'itinéraire'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {routeData && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-200 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Itinéraire optimisé</h4>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FiMapPin className="text-primary-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Distance estimée:</p>
                <p className="font-medium">{routeData.estimatedDistance} km</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <FiClock className="text-primary-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Durée estimée:</p>
                <p className="font-medium">{routeData.estimatedDuration} minutes</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Itinéraire suggéré:</p>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                {routeData.suggestedRoute.map((step: string, index: number) => (
                  <li key={index} className="text-gray-800 dark:text-gray-200">{step}</li>
                ))}
              </ol>
            </div>
            
            {routeData.trafficNotes && (
              <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
                <div className="flex items-start">
                  <FiAlertTriangle className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p>{routeData.trafficNotes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
