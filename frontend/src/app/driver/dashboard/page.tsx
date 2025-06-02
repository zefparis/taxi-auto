'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiClock, FiUser, FiMapPin, FiDollarSign, FiStar, FiToggleRight, FiToggleLeft, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi'; // Icônes utilisés dans le JSX

// Mock data for ride requests and history
const mockRideRequests = [
  {
    id: '101',
    clientName: 'Sophie Mbongo',
    clientRating: 4.7,
    requestTime: '14:25',
    pickupLocation: 'Boulevard du 30 Juin, Kinshasa',
    destination: 'Aéroport International de N\'Djili',
    estimatedDistance: '18.5 km',
    estimatedPrice: '15000 FC'
  },
  {
    id: '102',
    clientName: 'Pierre Kalala',
    clientRating: 4.2,
    requestTime: '14:20',
    pickupLocation: 'Hôtel Pullman, Kinshasa',
    destination: 'Université de Kinshasa',
    estimatedDistance: '10.2 km',
    estimatedPrice: '8500 FC'
  }
];

const mockRideHistory = [
  {
    id: '1',
    date: '2023-05-15',
    time: '14:30',
    from: 'Boulevard du 30 Juin, Kinshasa',
    to: 'Aéroport International de N\'Djili',
    status: 'completed',
    price: '15000 FC',
    clientName: 'Sophie Mbongo',
    clientRating: 4.7
  },
  {
    id: '2',
    date: '2023-05-10',
    time: '09:15',
    from: 'Hôtel Pullman, Kinshasa',
    to: 'Université de Kinshasa',
    status: 'completed',
    price: '8500 FC',
    clientName: 'Marie Lukusa',
    clientRating: 4.5
  },
  {
    id: '3',
    date: '2023-05-05',
    time: '19:45',
    from: 'Centre Commercial, Gombe',
    to: 'Quartier Matonge, Kinshasa',
    status: 'cancelled',
    price: '0 FC',
    clientName: 'Jean Kabongo',
    clientRating: 4.0
  }
];

export default function DriverDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('requests');
  const [isOnline, setIsOnline] = useState(true);
  const [rideRequests, setRideRequests] = useState(mockRideRequests);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rideHistory, _] = useState(mockRideHistory);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock driver data
  const driver = {
    firstName: 'Emmanuel',
    lastName: 'Mutombo',
    email: 'emmanuel.mutombo@example.com',
    phoneNumber: '+243 987654321',
    profileImage: 'https://randomuser.me/api/portraits/men/45.jpg',
    vehicle: {
      make: 'Toyota',
      model: 'Corolla',
      year: '2018',
      licensePlate: 'KIN 5432'
    },
    rating: 4.8,
    totalRides: 248,
    totalEarnings: '1,250,000 FC'
  };

  const handleToggleStatus = () => {
    setIsOnline(!isOnline);
  };

  const handleAcceptRide = (rideId: string) => {
    setIsLoading(true);
    
    // Simulate API call to accept a ride
    setTimeout(() => {
      setRideRequests(rideRequests.filter(ride => ride.id !== rideId));
      setIsLoading(false);
      router.push('/driver/ride-active');
    }, 1000);
  };

  const handleDeclineRide = (rideId: string) => {
    setIsLoading(true);
    
    // Simulate API call to decline a ride
    setTimeout(() => {
      setRideRequests(rideRequests.filter(ride => ride.id !== rideId));
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-100">
      {/* Header */}
      <header className="bg-white dark:bg-dark-200 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tableau de bord Chauffeur
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img
                  src={driver.profileImage}
                  alt="Profile"
                  className="h-10 w-10 rounded-full"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium hidden sm:inline-block">
                  {driver.firstName} {driver.lastName}
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
            <div className="bg-white dark:bg-dark-200 shadow rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Statut</span>
                <button
                  onClick={handleToggleStatus}
                  className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isOnline
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  {isOnline ? (
                    <>
                      <FiToggleRight className="mr-1" /> En ligne
                    </>
                  ) : (
                    <>
                      <FiToggleLeft className="mr-1" /> Hors ligne
                    </>
                  )}
                </button>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Note</span>
                  <div className="flex items-center">
                    <FiStar className="text-yellow-400 h-4 w-4" />
                    <span className="ml-1 font-medium">{driver.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Courses totales</span>
                  <span className="font-medium">{driver.totalRides}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Revenus totaux</span>
                  <span className="font-medium">{driver.totalEarnings}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-dark-200 shadow rounded-lg p-4">
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`flex items-center space-x-2 p-3 rounded-md ${
                    activeTab === 'requests'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-dark-300 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <FiMapPin className="h-5 w-5" />
                  <span>Demandes de course</span>
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
              {/* Ride Requests Tab */}
              {activeTab === 'requests' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                    Demandes de course
                  </h2>
                  
                  {!isOnline && (
                    <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md flex items-start">
                      <FiAlertCircle className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-yellow-800 dark:text-yellow-300">Vous êtes hors ligne</h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                          Passez en ligne pour recevoir des demandes de course.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {isOnline && rideRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <FiClock className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Aucune demande</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Aucune demande de course en attente pour le moment.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {isOnline && rideRequests.map((request) => (
                        <div 
                          key={request.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <div className="mr-3">
                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                  <FiUser className="text-primary-600 dark:text-primary-400" />
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-gray-800 dark:text-gray-200">
                                  {request.clientName}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <FiStar className="text-yellow-400 h-3 w-3 mr-1" />
                                  <span>{request.clientRating}</span>
                                  <span className="mx-2">•</span>
                                  <span>Il y a {Math.floor(Math.random() * 5) + 1} min</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                {request.estimatedPrice}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {request.estimatedDistance}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-start mb-2">
                              <div className="flex flex-col items-center mr-3">
                                <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                                <div className="w-0.5 h-10 bg-gray-300 dark:bg-gray-600 my-1"></div>
                                <div className="w-3 h-3 rounded-full bg-primary-700"></div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Prise en charge</div>
                                <div className="font-medium text-gray-800 dark:text-gray-200">{request.pickupLocation}</div>
                                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">Destination</div>
                                <div className="font-medium text-gray-800 dark:text-gray-200">{request.destination}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleDeclineRide(request.id)}
                              className="flex-1 flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-300 hover:bg-gray-50 dark:hover:bg-dark-400 focus:outline-none"
                              disabled={isLoading}
                            >
                              <FiX className="mr-2" />
                              Refuser
                            </button>
                            <button
                              onClick={() => handleAcceptRide(request.id)}
                              className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <span className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Acceptation...
                                </span>
                              ) : (
                                <>
                                  <FiCheck className="mr-2" />
                                  Accepter
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                                    {ride.clientName}
                                  </span>
                                  <div className="flex items-center">
                                    <FiStar className="text-yellow-400 h-4 w-4" />
                                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                                      {ride.clientRating}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
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
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                    Profil Chauffeur
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
                    <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                      <img
                        src={driver.profileImage}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover border-2 border-primary-500"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {driver.firstName} {driver.lastName}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {driver.email}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {driver.phoneNumber}
                      </p>
                      <div className="flex items-center mt-1">
                        <FiStar className="text-yellow-400 h-4 w-4 mr-1" />
                        <span className="font-medium">{driver.rating}</span>
                        <span className="mx-1 text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-gray-500 dark:text-gray-400">{driver.totalRides} courses</span>
                      </div>
                      <button className="mt-3 text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                        Modifier la photo de profil
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                      Informations du véhicule
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Marque</div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">{driver.vehicle.make}</div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Modèle</div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">{driver.vehicle.model}</div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Année</div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">{driver.vehicle.year}</div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Plaque d'immatriculation</div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">{driver.vehicle.licensePlate}</div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      className="btn-secondary"
                    >
                      Mettre à jour les informations du véhicule
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
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
                            defaultValue={driver.firstName}
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
                            defaultValue={driver.lastName}
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
                          defaultValue={driver.email}
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
                          defaultValue={driver.phoneNumber}
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
