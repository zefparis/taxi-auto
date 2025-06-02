'use client';

import { FiCheck } from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';

export default function AirportTransferPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <FaPlane className="text-primary-600 mr-2" />
            Transfert Aéroport
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Notre service de transfert aéroport vous garantit des déplacements ponctuels et confortables entre l'aéroport et votre destination.
          </p>
        </div>

        <div className="bg-white dark:bg-dark-100 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Avantages du service</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Suivi des vols</h3>
                  <p className="text-gray-600 dark:text-gray-400">Nous surveillons votre vol et ajustons l'horaire en cas de retard.</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Accueil personnalisé</h3>
                  <p className="text-gray-600 dark:text-gray-400">Chauffeur vous attendant avec une pancarte à votre nom.</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Assistance bagages</h3>
                  <p className="text-gray-600 dark:text-gray-400">Aide pour le transport de vos bagages jusqu'au véhicule.</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Réservation à l'avance</h3>
                  <p className="text-gray-600 dark:text-gray-400">Garantissez votre transfert en réservant jusqu'à 24h avant votre vol.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-100 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tarifs transfert aéroport</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-dark-200">
                    <th className="px-4 py-2 border-b">Destination</th>
                    <th className="px-4 py-2 border-b">Véhicule standard</th>
                    <th className="px-4 py-2 border-b">Véhicule premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b">Centre-ville</td>
                    <td className="px-4 py-2 border-b">20000 FC</td>
                    <td className="px-4 py-2 border-b">35000 FC</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Quartiers résidentiels</td>
                    <td className="px-4 py-2 border-b">25000 FC</td>
                    <td className="px-4 py-2 border-b">40000 FC</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Périphérie</td>
                    <td className="px-4 py-2 border-b">30000 FC</td>
                    <td className="px-4 py-2 border-b">50000 FC</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a 
            href="tel:+243123456789" 
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
          >
            <FaPlane className="mr-2" />
            Réserver un transfert aéroport
          </a>
        </div>
      </div>
    </div>
  );
}
