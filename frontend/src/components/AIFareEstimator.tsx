'use client';

import { useState } from 'react';
import { estimateFare } from '@/services/aiService';
import { FiDollarSign, FiClock, FiMapPin, FiTruck } from 'react-icons/fi';

type AIFareEstimatorProps = {
  className?: string;
  onEstimateComplete?: (fareData: any) => void;
};

export default function AIFareEstimator({ 
  className = "", 
  onEstimateComplete 
}: AIFareEstimatorProps) {
  const [distance, setDistance] = useState<number>(5);
  const [duration, setDuration] = useState<number>(15);
  const [vehicleType, setVehicleType] = useState<'standard' | 'premium'>('standard');
  const [timeOfDay, setTimeOfDay] = useState<string>('jour');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fareEstimate, setFareEstimate] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await estimateFare({
        distance,
        duration,
        vehicleType,
        timeOfDay
      });

      // Parse the JSON response from GPT
      try {
        // First check if the response is already a valid JSON string
        if (typeof result === 'string' && result.startsWith('{') && result.endsWith('}')) {
          try {
            const fareData = JSON.parse(result);
            
            // Check if we have a valid fare estimate with required fields
            if (fareData && typeof fareData === 'object' && 
                'totalFare' in fareData && 
                'currency' in fareData) {
              
              setFareEstimate(fareData);
              
              if (onEstimateComplete) {
                onEstimateComplete(fareData);
              }
            } else {
              // JSON is valid but doesn't have the expected structure
              console.error('Invalid fare data structure:', fareData);
              setError('La structure des données de tarification est invalide.');
              setFareEstimate(null);
            }
          } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            console.log('Raw response:', result);
            setError('Erreur lors de l\'analyse de la réponse. Format incorrect.');
            setFareEstimate(null);
          }
        } else {
          // Response is not a JSON string
          console.error('Response is not a JSON string:', result);
          setError('La réponse n\'est pas au format JSON attendu.');
          setFareEstimate(null);
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.log('Raw response:', result);
        setError('Erreur lors de l\'analyse de la réponse. Format incorrect.');
        setFareEstimate(null);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'estimation');
      setFareEstimate(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-dark-100 rounded-lg shadow-md p-5 ${className}`}>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <FiDollarSign className="text-primary-600 mr-2" />
        Estimation de tarif IA
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <FiMapPin className="inline mr-1" /> Distance (km)
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 dark:border-dark-500 rounded-lg bg-white dark:bg-dark-200 text-gray-800 dark:text-gray-200"
            required
            aria-label="Distance en kilomètres"
            title="Entrez la distance en kilomètres"
            placeholder="Distance en km"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <FiClock className="inline mr-1" /> Durée estimée (minutes)
          </label>
          <input
            type="number"
            min="5"
            max="180"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 dark:border-dark-500 rounded-lg bg-white dark:bg-dark-200 text-gray-800 dark:text-gray-200"
            required
            aria-label="Durée estimée en minutes"
            title="Entrez la durée estimée en minutes"
            placeholder="Durée en minutes"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <FiTruck className="inline mr-1" /> Type de véhicule
          </label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value as 'standard' | 'premium')}
            className="w-full p-2 border border-gray-300 dark:border-dark-500 rounded-lg bg-white dark:bg-dark-200 text-gray-800 dark:text-gray-200"
            required
            aria-label="Type de véhicule"
            title="Sélectionner le type de véhicule"
          >
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Moment de la journée
          </label>
          <select
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-dark-500 rounded-lg bg-white dark:bg-dark-200 text-gray-800 dark:text-gray-200"
            required
            aria-label="Moment de la journée"
            title="Sélectionner le moment de la journée"
          >
            <option value="jour">Jour (6h-18h)</option>
            <option value="soir">Soir (18h-22h)</option>
            <option value="nuit">Nuit (22h-6h)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Calcul en cours...' : 'Calculer le tarif'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {fareEstimate && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-200 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Estimation du tarif</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tarif de base:</span>
              <span className="font-medium">{fareEstimate.baseFare.toLocaleString()} {fareEstimate.currency}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Coût de distance:</span>
              <span className="font-medium">{fareEstimate.distanceCost.toLocaleString()} {fareEstimate.currency}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Coût de temps:</span>
              <span className="font-medium">{fareEstimate.timeCost.toLocaleString()} {fareEstimate.currency}</span>
            </div>
            
            <div className="border-t border-gray-200 dark:border-dark-500 pt-2 flex justify-between">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-primary-600 dark:text-primary-400">
                {fareEstimate.totalFare.toLocaleString()} {fareEstimate.currency}
              </span>
            </div>
          </div>
          
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Cette estimation est basée sur les conditions normales. Le tarif réel peut varier en fonction des conditions de circulation et d'autres facteurs.
          </p>
        </div>
      )}
    </div>
  );
}
