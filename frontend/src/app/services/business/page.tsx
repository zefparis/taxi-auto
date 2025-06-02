'use client';

import { FiBriefcase, FiCheck } from 'react-icons/fi';

export default function BusinessServicePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <FiBriefcase className="text-primary-600 mr-2" />
            Service Entreprise
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Nos solutions de transport dédiées aux entreprises offrent fiabilité, flexibilité et tarifs préférentiels pour tous vos besoins professionnels.
          </p>
        </div>

        <div className="bg-white dark:bg-dark-100 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Solutions pour entreprises</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Compte entreprise</h3>
                  <p className="text-gray-600 dark:text-gray-400">Gérez facilement les déplacements de vos employés avec un compte centralisé.</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Facturation mensuelle</h3>
                  <p className="text-gray-600 dark:text-gray-400">Simplifiez votre comptabilité avec une facture unique en fin de mois.</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Tarifs préférentiels</h3>
                  <p className="text-gray-600 dark:text-gray-400">Bénéficiez de remises en fonction du volume de courses réservées.</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheck className="text-primary-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Service VIP</h3>
                  <p className="text-gray-600 dark:text-gray-400">Accueil personnalisé pour vos clients et partenaires commerciaux.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-100 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Nos offres entreprises</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 text-center">
                <h3 className="font-semibold text-lg mb-2">Pack Essentiel</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Pour les petites entreprises</p>
                <ul className="text-left mb-4 space-y-2">
                  <li className="flex items-center">
                    <FiCheck className="text-primary-600 mr-2" />
                    <span>Jusqu'à 20 courses/mois</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheck className="text-primary-600 mr-2" />
                    <span>5% de réduction</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheck className="text-primary-600 mr-2" />
                    <span>Facturation mensuelle</span>
                  </li>
                </ul>
                <p className="font-bold text-xl">Contactez-nous</p>
              </div>
              
              <div className="border rounded-lg p-4 text-center bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700">
                <h3 className="font-semibold text-lg mb-2">Pack Business</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Pour les moyennes entreprises</p>
                <ul className="text-left mb-4 space-y-2">
                  <li className="flex items-center">
                    <FiCheck className="text-primary-600 mr-2" />
                    <span>Jusqu'à 50 courses/mois</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheck className="text-primary-600 mr-2" />
                    <span>10% de réduction</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheck className="text-primary-600 mr-2" />
                    <span>Service prioritaire</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheck className="text-primary-600 mr-2" />
                    <span>Rapport d'activité mensuel</span>
                  </li>
                </ul>
                <p className="font-bold text-xl">Contactez-nous</p>
              </div>
              
              <div className="border rounded-lg p-4 text-center">
                <h3 className="font-semibold text-lg mb-2">Pack Corporate</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Pour les grandes entreprises</p>
                <ul className="text-left mb-4 space-y-2">
                  <li className="flex items-center">
                    <FiCheck className="text-primary-600 mr-2" />
                    <span>Courses illimitées</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheck className="text-primary-600 mr-2" />
                    <span>15% de réduction</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheck className="text-primary-600 mr-2" />
                    <span>Chauffeur dédié</span>
                  </li>
                  <li className="flex items-center">
                    <FiCheck className="text-primary-600 mr-2" />
                    <span>Plateforme de réservation personnalisée</span>
                  </li>
                </ul>
                <p className="font-bold text-xl">Contactez-nous</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a 
            href="tel:+243123456789" 
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center mr-4"
          >
            <FiBriefcase className="mr-2" />
            Nous contacter
          </a>
          <a 
            href="mailto:business@taxiexpress-rdc.com" 
            className="bg-gray-200 dark:bg-dark-300 hover:bg-gray-300 dark:hover:bg-dark-400 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
          >
            Demander un devis
          </a>
        </div>
      </div>
    </div>
  );
}
