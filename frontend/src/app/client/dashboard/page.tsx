'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiClock, FiUser, FiMapPin, FiMap, FiDollarSign, FiArrowRight, FiStar } from 'react-icons/fi'; // Tous ces icônes sont utilisés dans le JSX

// Mock data for ride history
const mockRideHistory = [
  {
    id: '1',
    date: '2023-05-15',
    time: '14:30',
    from: 'Boulevard du 30 Juin, Kinshasa',
    to: 'Aéroport International de N\'Djili',
    status: 'completed',
    price: '15000 FC',
    driverName: 'Jean Mutombo',
    driverRating: 4.8
  },
  {
    id: '2',
    date: '2023-05-10',
    time: '09:15',
    from: 'Hôtel Pullman, Kinshasa',
    to: 'Université de Kinshasa',
    status: 'completed',
    price: '8500 FC',
    driverName: 'Marie Lukusa',
    driverRating: 4.5
  },
  {
    id: '3',
    date: '2023-05-05',
    time: '19:45',
    from: 'Centre Commercial, Gombe',
    to: 'Quartier Matonge, Kinshasa',
    status: 'cancelled',
    price: '0 FC',
    driverName: '-',
    driverRating: 0
  }
];

export default function ClientDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('request');
  const [isLoading, setIsLoading] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [rideHistory, setRideHistory] = useState(mockRideHistory);
  const [estimatedPrice, setEstimatedPrice] = useState<string | null>(null);
  const [showPriceEstimate, setShowPriceEstimate] = useState(false);
  
  // Mock user data
  const user = {
    firstName: 'David',
    lastName: 'Kabila',
    email: 'david.kabila@example.com',
    phoneNumber: '+243 123456789',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
  };

  const handleRequestRide = () => {
    if (!pickupLocation || !destination) {
      alert('Veuillez saisir les adresses de départ et de destination');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to request a ride
    setTimeout(() => {
      setIsLoading(false);
      router.push('/client/ride-tracking');
    }, 2000);
  };

  const handleEstimatePrice = () => {
    if (!pickupLocation || !destination) {
      alert('Veuillez saisir les adresses de départ et de destination');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to get price estimate
    setTimeout(() => {
      // Random price between 5000 and 20000 FC
      const price = Math.floor(Math.random() * 15000) + 5000;
      setEstimatedPrice(`${price} FC`);
      setShowPriceEstimate(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-100">
      {/* Header */}
      <header className="bg-white dark:bg-dark-200 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tableau de bord
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="h-10 w-10 rounded-full"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium hidden sm:inline-block">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <button className="btn-secondary text-sm">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-200 shadow rounded-lg p-4">
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => setActiveTab('request')}
                  className={`flex items-center space-x-2 p-3 rounded-md ${
                    activeTab === 'request'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-dark-300 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <FiMapPin className="h-5 w-5" />
                  <span>Demander un taxi</span>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center space-x-2 p-3 rounded-md ${
                    activeTab === 'history'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-dark-300 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <FiClock className="h-5 w-5" />
                  <span>Historique des courses</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-2 p-3 rounded-md ${
                    activeTab === 'profile'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-dark-300 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <FiUser className="h-5 w-5" />
                  <span>Profil</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main panel */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-dark-200 shadow rounded-lg p-6">
              {/* Request Ride Tab */}
              {activeTab === 'request' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                    Demander un taxi
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Adresse de prise en charge
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMapPin className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="pickup"
                          className="input pl-10"
                          placeholder="Entrez l'adresse de départ"
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Destination
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMap className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="destination"
                          className="input pl-10"
                          placeholder="Entrez l'adresse de destination"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    
                    {showPriceEstimate && estimatedPrice && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                        <div className="flex items-center">
                          <FiDollarSign className="text-green-500 dark:text-green-400 mr-2" />
                          <span className="text-green-700 dark:text-green-300 font-medium">
                            Prix estimé: {estimatedPrice}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                      <button
                        onClick={handleEstimatePrice}
                        className="btn-secondary flex items-center justify-center"
                        disabled={isLoading}
                      >
                        {isLoading && !showPriceEstimate ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Estimation...
                          </span>
                        ) : (
                          <>
                            <FiDollarSign className="mr-2" />
                            Estimer le prix
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={handleRequestRide}
                        className="btn-primary flex items-center justify-center"
                        disabled={isLoading}
                      >
                        {isLoading && showPriceEstimate ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Recherche de chauffeur...
                          </span>
                        ) : (
                          <>
                            Demander un taxi <FiArrowRight className="ml-2" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                        Destinations populaires
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { name: 'Aéroport International de N\'Djili', address: 'N\'Djili, Kinshasa' },
                          { name: 'Gare Centrale', address: 'Centre-ville, Kinshasa' },
                          { name: 'Université de Kinshasa', address: 'Mont Amba, Kinshasa' },
                          { name: 'Hôpital Général de Référence', address: 'Kintambo, Kinshasa' }
                        ].map((location, index) => (
                          <button
                            key={index}
                            className="flex items-start p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors"
                            onClick={() => setDestination(location.address)}
                          >
                            <FiMapPin className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
                            <div className="text-left">
                              <div className="font-medium text-gray-800 dark:text-gray-200">{location.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{location.address}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ride History Tab */}
              {activeTab === 'history' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                    Historique des courses
                  </h2>
                  
                  {rideHistory.length > 0 ? (
                    <div className="space-y-4">
                      {rideHistory.map((ride) => (
                        <div 
                          key={ride.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {ride.date} • {ride.time}
                              </div>
                              <div className="mt-2 flex items-start">
                                <div className="flex flex-col items-center mr-4">
                                  <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                                  <div className="w-0.5 h-10 bg-gray-300 dark:bg-gray-600 my-1"></div>
                                  <div className="w-3 h-3 rounded-full bg-primary-700"></div>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800 dark:text-gray-200">{ride.from}</div>
                                  <div className="mt-8 font-medium text-gray-800 dark:text-gray-200">{ride.to}</div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                ride.status === 'completed' 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                              }`}>
                                {ride.status === 'completed' ? 'Terminée' : 'Annulée'}
                              </span>
                              <div className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                                {ride.price}
                              </div>
                              {ride.status === 'completed' && (
                                <div className="mt-1 flex items-center justify-end">
                                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-1">
                                    {ride.driverName}
                                  </span>
                                  <div className="flex items-center">
                                    <FiStar className="text-yellow-400 h-4 w-4" />
                                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                                      {ride.driverRating}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {ride.status === 'completed' && (
                            <div className="mt-4 flex justify-end space-x-2">
                              <button className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                                Revoir le trajet
                              </button>
                              <button className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                                Réserver à nouveau
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FiClock className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Aucune course</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Vous n'avez pas encore effectué de course avec Taxi Express RDC.
                      </p>
                      <div className="mt-6">
                        <button 
                          onClick={() => setActiveTab('request')}
                          className="btn-primary"
                        >
                          Demander un taxi
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                    Profil
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
                    <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover border-2 border-primary-500"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {user.phoneNumber}
                      </p>
                      <button className="mt-3 text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                        Modifier la photo de profil
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                      Informations personnelles
                    </h3>
                    
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Prénom
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            className="input"
                            defaultValue={user.firstName}
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nom
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            className="input"
                            defaultValue={user.lastName}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="input"
                          defaultValue={user.email}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Numéro de téléphone
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          className="input"
                          defaultValue={user.phoneNumber}
                        />
                      </div>
                      
                      <div className="pt-2">
                        <button
                          type="button"
                          className="btn-primary"
                        >
                          Enregistrer les modifications
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                      Sécurité
                    </h3>
                    
                    <div className="space-y-4">
                      <button
                        type="button"
                        className="btn-secondary"
                      >
                        Changer le mot de passe
                      </button>
                      
                      <button
                        type="button"
                        className="btn-danger"
                      >
                        Désactiver le compte
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
