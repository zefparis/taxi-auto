'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPhone, FiMessageSquare, FiStar, FiNavigation, FiClock, FiX, FiAlertTriangle } from 'react-icons/fi'; // Icônes utilisés dans le JSX

export default function RideTrackingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState('searching'); // searching, driverAssigned, driverArriving, inProgress, completed
  const [timeRemaining, setTimeRemaining] = useState(5 * 60); // 5 minutes in seconds
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  // Mock ride data
  const ride = {
    id: '12345',
    pickupLocation: 'Boulevard du 30 Juin, Kinshasa',
    destination: 'Aéroport International de N\'Djili',
    estimatedPrice: '15000 FC',
    estimatedDistance: '18.5 km',
    estimatedDuration: '35 min',
    driver: {
      id: 'driver-123',
      name: 'Jean Mutombo',
      rating: 4.8,
      phone: '+243 123456789',
      vehicle: {
        make: 'Toyota',
        model: 'Corolla',
        color: 'Blanc',
        licensePlate: 'KIN 1234'
      },
      location: {
        latitude: -4.3217,
        longitude: 15.3125
      }
    }
  };

  // Simulate ride progress
  useEffect(() => {
    if (currentStep === 'searching') {
      const timer = setTimeout(() => {
        setCurrentStep('driverAssigned');
      }, 5000);
      return () => clearTimeout(timer);
    }
    
    if (currentStep === 'driverAssigned') {
      const timer = setTimeout(() => {
        setCurrentStep('driverArriving');
      }, 10000);
      return () => clearTimeout(timer);
    }
    
    if (currentStep === 'driverArriving') {
      const timer = setTimeout(() => {
        setCurrentStep('inProgress');
      }, 15000);
      return () => clearTimeout(timer);
    }
    
    if (currentStep === 'inProgress') {
      const timer = setTimeout(() => {
        setCurrentStep('completed');
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Countdown timer
  useEffect(() => {
    if (currentStep === 'driverArriving' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCancelRide = () => {
    setShowCancelModal(true);
    return undefined;
  };

  const handleSubmitRating = () => {
    // Envoyer la note et le commentaire au serveur
    console.log('Note:', rating, 'Commentaire:', comment);
    setShowRatingModal(false);
    return undefined;
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
        
        {/* Back button */}
        <Link
          href="/client/dashboard"
          className="absolute top-4 left-4 z-10 bg-white dark:bg-dark-200 p-2 rounded-full shadow-md"
        >
          <FiX className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </Link>
      </div>

      {/* Ride information panel */}
      <div className="bg-white dark:bg-dark-200 rounded-t-3xl -mt-6 relative z-10 shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-6">
          {/* Status indicator */}
          <div className="mb-6">
            {currentStep === 'searching' && (
              <div className="flex items-center justify-center">
                <div className="animate-pulse flex space-x-2 items-center">
                  <div className="h-3 w-3 bg-primary-600 rounded-full"></div>
                  <div className="h-3 w-3 bg-primary-600 rounded-full"></div>
                  <div className="h-3 w-3 bg-primary-600 rounded-full"></div>
                </div>
                <span className="ml-3 font-medium text-gray-700 dark:text-gray-300">
                  Recherche d'un chauffeur...
                </span>
              </div>
            )}
            
            {currentStep === 'driverAssigned' && (
              <div className="text-center">
                <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Chauffeur trouvé!
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Votre chauffeur est en route vers votre position
                </p>
              </div>
            )}
            
            {currentStep === 'driverArriving' && (
              <div className="text-center">
                <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Arrivée du chauffeur
                </div>
                <div className="flex items-center justify-center mt-1">
                  <FiClock className="text-primary-600 mr-1" />
                  <span className="text-primary-600 font-medium">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
            )}
            
            {currentStep === 'inProgress' && (
              <div className="text-center">
                <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  En route vers votre destination
                </div>
                <div className="flex items-center justify-center mt-1">
                  <FiClock className="text-primary-600 mr-1" />
                  <span className="text-primary-600 font-medium">
                    Arrivée estimée: {ride.estimatedDuration}
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
                  Merci d'avoir utilisé Taxi Express RDC
                </p>
              </div>
            )}
          </div>

          {/* Driver information */}
          {currentStep !== 'searching' && currentStep !== 'completed' && (
            <div className="flex items-center p-4 bg-gray-50 dark:bg-dark-300 rounded-lg mb-4">
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mr-4 flex-shrink-0">
                {/* Driver image placeholder */}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {ride.driver.name}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FiStar className="text-yellow-400 mr-1" />
                  <span>{ride.driver.rating}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {ride.driver.vehicle.make} {ride.driver.vehicle.model} • {ride.driver.vehicle.color}
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {ride.driver.vehicle.licensePlate}
                </div>
              </div>
              <div className="flex space-x-2">
                <a
                  href={`tel:${ride.driver.phone}`}
                  className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full"
                  title="Appeler le chauffeur"
                  aria-label={`Appeler le chauffeur ${ride.driver.name}`}
                >
                  <FiPhone className="h-5 w-5" />
                </a>
                <button
                  className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full"
                  title="Envoyer un message"
                  aria-label="Envoyer un message au chauffeur"
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
          {currentStep !== 'completed' ? (
            <div className="flex justify-center">
              {(currentStep === 'searching' || currentStep === 'driverAssigned' || currentStep === 'driverArriving') && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="btn-danger w-full"
                >
                  Annuler la course
                </button>
              )}
              
              {currentStep === 'inProgress' && (
                <button
                  className="btn-primary w-full"
                  disabled
                >
                  Course en cours...
                </button>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => setShowRatingModal(true)}
                className="btn-primary w-full"
              >
                Noter votre chauffeur
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-200 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-4">
                <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Annuler la course?
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Êtes-vous sûr de vouloir annuler cette course? Des frais d'annulation peuvent s'appliquer.
            </p>
            
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
              >
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-200 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Noter votre chauffeur
            </h3>
            
            <div className="flex items-center mb-6 justify-center">
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mr-4 flex-shrink-0">
                {/* Driver image placeholder */}
              </div>
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {ride.driver.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {ride.driver.vehicle.make} {ride.driver.vehicle.model}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="mx-1 p-1"
                  title={`Noter ${star} étoile${star > 1 ? 's' : ''}`}
                  aria-label={`Noter ${star} étoile${star > 1 ? 's' : ''}`}
                  aria-pressed={star <= rating}
                >
                  <FiStar
                    className={`h-8 w-8 ${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <div className="mb-6">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Commentaire (optionnel)
              </label>
              <textarea
                id="comment"
                rows={3}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-300"
                placeholder="Partagez votre expérience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-300 hover:bg-gray-50 dark:hover:bg-dark-400"
              >
                Plus tard
              </button>
              <button
                onClick={handleSubmitRating}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Soumettre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
