'use client';

import { FiStar, FiCheck } from 'react-icons/fi';

export default function TaxiPremiumPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <FiStar className="text-primary-600 mr-2" />
            Service de Taxi Premium
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Notre service de taxi premium offre une expérience de transport exceptionnelle avec des véhicules haut de gamme et un service personnalisé.
          </p>
        </div>

        <div className="bg-white dark:bg-dark-100 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Caractéristiques du service premium</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Véhicules de luxe</h3>
                  <p className="text-gray-600 dark:text-gray-400">Flotte de véhicules haut de gamme pour un confort optimal.</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Chauffeurs d'élite</h3>
                  <p className="text-gray-600 dark:text-gray-400">Chauffeurs expérimentés, professionnels et formés au service client de qualité.</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Service personnalisé</h3>
                  <p className="text-gray-600 dark:text-gray-400">Eau, journaux et autres commodités disponibles à bord.</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Ponctualité garantie</h3>
                  <p className="text-gray-600 dark:text-gray-400">Arrivée à l'heure garantie ou remboursement partiel.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-100 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tarifs premium</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-dark-200">
                    <th className="px-4 py-2 border-b">Type de service</th>
                    <th className="px-4 py-2 border-b">Prix de base</th>
                    <th className="px-4 py-2 border-b">Prix par km</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b">Premium urbain</td>
                    <td className="px-4 py-2 border-b">15000 FC</td>
                    <td className="px-4 py-2 border-b">2000 FC/km</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Premium longue distance</td>
                    <td className="px-4 py-2 border-b">25000 FC</td>
                    <td className="px-4 py-2 border-b">2500 FC/km</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Service à l'heure</td>
                    <td className="px-4 py-2 border-b">30000 FC</td>
                    <td className="px-4 py-2 border-b">par heure</td>
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
            <FiStar className="mr-2" />
            Réserver un taxi premium
          </a>
        </div>
      </div>
    </div>
  );
}
