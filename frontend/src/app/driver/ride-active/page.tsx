'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPhone, FiMessageSquare, FiNavigation, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'; // Icônes utilisés dans le JSX

export default function DriverActiveRidePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState('driverToPickup'); // driverToPickup, waitingForClient, inProgress, completed
  const [timeElapsed, setTimeElapsed] = useState(0); // seconds
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock ride data
  const ride = {
    id: '12345',
    pickupLocation: 'Boulevard du 30 Juin, Kinshasa',
    destination: 'Aéroport International de N\'Djili',
    estimatedPrice: '15000 FC',
    estimatedDistance: '18.5 km',
    estimatedDuration: '35 min',
    client: {
      id: 'client-123',
      name: 'Sophie Mbongo',
      rating: 4.7,
      phone: '+243 123456789',
      location: {
        latitude: -4.3217,
        longitude: 15.3125
      }
    }
  };

  // Timer for ride duration
  useEffect(() => {
    if (currentStep === 'inProgress') {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleArriveAtPickup = (): void => {
    setCurrentStep('waitingForClient');
  };

  const handleStartRide = (): void => {
    setCurrentStep('inProgress');
    setTimeElapsed(0);
  };

  const handleCompleteRide = (): void => {
    setIsLoading(true);
    
    // Simulate API call to complete the ride
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('completed');
      setShowCompleteModal(true);
    }, 1000);
  };

  const handleCancelRide = (): void => {
    setIsLoading(true);
    
    // Simulate API call to cancel the ride
    const cancelRide = (): void => {
      setShowCancelModal(false);
      router.push('/driver/dashboard');
    };  
    setTimeout(cancelRide, 1000);
  };

  const handleFinishRide = (): void => {
    router.push('/driver/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-100">
      {/* Map area (placeholder) */}
      <div className="h-[60vh] bg-gray-300 dark:bg-gray-700 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">
            Carte interactive ici
          </p>
        </div>
        
        {/* Navigation button */}
        <button
          className="absolute bottom-4 right-4 z-10 bg-primary-600 text-white p-3 rounded-full shadow-md flex items-center"
        >
          <FiNavigation className="h-6 w-6 mr-2" />
          <span className="font-medium">Naviguer</span>
        </button>
      </div>

      {/* Ride information panel */}
      <div className="bg-white dark:bg-dark-200 rounded-t-3xl -mt-6 relative z-10 shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-6">
          {/* Status indicator */}
          <div className="mb-6">
            {currentStep === 'driverToPickup' && (
              <div className="text-center">
                <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  En route vers le client
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Dirigez-vous vers le point de prise en charge
                </p>
              </div>
            )}
            
            {currentStep === 'waitingForClient' && (
              <div className="text-center">
                <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  En attente du client
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Le client a été notifié de votre arrivée
                </p>
              </div>
            )}
            
            {currentStep === 'inProgress' && (
              <div className="text-center">
                <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Course en cours
                </div>
                <div className="flex items-center justify-center mt-1">
                  <FiClock className="text-primary-600 mr-1" />
                  <span className="text-primary-600 font-medium">
                    {formatTime(timeElapsed)}
                  </span>
                </div>
              </div>
            )}
            
            {currentStep === 'completed' && (
              <div className="text-center">
                <div className="text-lg font-medium text-green-600 dark:text-green-400">
                  Course terminée
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Paiement reçu: {ride.estimatedPrice}
                </p>
              </div>
            )}
          </div>

          {/* Client information */}
          {currentStep !== 'completed' && (
            <div className="flex items-center p-4 bg-gray-50 dark:bg-dark-300 rounded-lg mb-4">
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mr-4 flex-shrink-0">
                {/* Client image placeholder */}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {ride.client.name}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <svg className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {ride.client.rating}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <a
                  href={`tel:${ride.client.phone}`}
                  aria-label="Call client"
                  className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full"
                >
                  <FiPhone className="h-5 w-5" />
                </a>
                <button
                  aria-label="Message client"
                  className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full"
                >
                  <FiMessageSquare className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Ride details */}
          <div className="mb-6">
            <div className="flex items-start mb-4">
              <div className="flex flex-col items-center mr-4">
                <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                <div className="w-0.5 h-10 bg-gray-300 dark:bg-gray-600 my-1"></div>
                <div className="w-3 h-3 rounded-full bg-primary-700"></div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Prise en charge</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{ride.pickupLocation}</div>
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">Destination</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{ride.destination}</div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm">
              <div>
                <div className="text-gray-500 dark:text-gray-400">Distance</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{ride.estimatedDistance}</div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400">Durée estimée</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{ride.estimatedDuration}</div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400">Prix</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{ride.estimatedPrice}</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between space-x-3">
            {currentStep !== 'completed' && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="btn-danger flex-1"
                disabled={isLoading}
              >
                Annuler
              </button>
            )}
            
            {currentStep === 'driverToPickup' && (
              <button
                onClick={handleArriveAtPickup}
                className="btn-primary flex-1"
                disabled={isLoading}
              >
                Je suis arrivé
              </button>
            )}
            
            {currentStep === 'waitingForClient' && (
              <button
                onClick={handleStartRide}
                className="btn-primary flex-1"
                disabled={isLoading}
              >
                Démarrer la course
              </button>
            )}
            
            {currentStep === 'inProgress' && (
              <button
                onClick={handleCompleteRide}
                className="btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Finalisation...
                  </span>
                ) : (
                  'Terminer la course'
                )}
              </button>
            )}
            
            {currentStep === 'completed' && (
              <button
                onClick={handleFinishRide}
                className="btn-primary w-full"
              >
                Retour au tableau de bord
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-200 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-4">
                <FiAlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Annuler la course?
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Veuillez indiquer la raison de l'annulation:
            </p>
            
            <div className="mb-4">
              <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Raison d'annulation
              </label>
              <select
                id="cancel-reason"
                name="cancel-reason"
                aria-label="Raison d'annulation"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-300"
              >
                <option value="">Sélectionnez une raison</option>
                <option value="client_not_found">Client introuvable</option>
                <option value="client_no_show">Client absent</option>
                <option value="wrong_address">Adresse incorrecte</option>
                <option value="traffic">Trafic trop dense</option>
                <option value="vehicle_issue">Problème de véhicule</option>
                <option value="other">Autre raison</option>
              </select>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-300 hover:bg-gray-50 dark:hover:bg-dark-400"
              >
                Retour
              </button>
              <button
                onClick={handleCancelRide}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                disabled={!cancelReason || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Annulation...
                  </span>
                ) : (
                  'Confirmer l\'annulation'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ride completed modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-200 rounded-lg max-w-md w-full p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <FiCheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                Course terminée avec succès!
              </h3>
            </div>
            
            <div className="bg-gray-50 dark:bg-dark-300 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">Montant de la course</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{ride.estimatedPrice}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">Votre commission (80%)</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {parseInt(ride.estimatedPrice) * 0.8} FC
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Distance parcourue</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{ride.estimatedDistance}</span>
              </div>
            </div>
            
            <button
              onClick={handleFinishRide}
              className="w-full btn-primary"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
