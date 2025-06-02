'use client';

import { FiCheck } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';

export default function TaxiStandardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <FaCar className="text-primary-600 mr-2" />
            Service de Taxi Standard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Notre service de taxi standard offre une solution de transport fiable, sûre et abordable pour tous vos déplacements à Kinshasa et dans les environs.
          </p>
        </div>

        <div className="bg-white dark:bg-dark-100 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Caractéristiques du service</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Disponibilité 24/7</h3>
                  <p className="text-gray-600 dark:text-gray-400">Nos taxis sont disponibles à toute heure, tous les jours de la semaine.</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Chauffeurs professionnels</h3>
                  <p className="text-gray-600 dark:text-gray-400">Tous nos chauffeurs sont formés, expérimentés et connaissent parfaitement la ville.</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Tarifs transparents</h3>
                  <p className="text-gray-600 dark:text-gray-400">Prix fixés à l'avance, pas de surprises ni de frais cachés.</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Véhicules confortables</h3>
                  <p className="text-gray-600 dark:text-gray-400">Flotte de véhicules bien entretenus et climatisés pour votre confort.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-100 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tarifs</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-dark-200">
                    <th className="px-4 py-2 border-b">Type de trajet</th>
                    <th className="px-4 py-2 border-b">Prix de base</th>
                    <th className="px-4 py-2 border-b">Prix par km</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b">Trajet urbain</td>
                    <td className="px-4 py-2 border-b">5000 FC</td>
                    <td className="px-4 py-2 border-b">1000 FC/km</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Trajet périphérique</td>
                    <td className="px-4 py-2 border-b">8000 FC</td>
                    <td className="px-4 py-2 border-b">1200 FC/km</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Attente</td>
                    <td className="px-4 py-2 border-b">2000 FC</td>
                    <td className="px-4 py-2 border-b">par 15 min</td>
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
            <FaCar className="mr-2" />
            Réserver un taxi maintenant
          </a>
        </div>
      </div>
    </div>
  );
}
