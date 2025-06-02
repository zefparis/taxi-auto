'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiClock, FiShield, FiStar, FiPhone, FiUser, FiTruck, FiInfo, FiMapPin } from 'react-icons/fi'; // Tous ces icônes sont utilisés dans le JSX

export default function Home() {
  const {} = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering theme components after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Votre taxi à portée de main en RDC
                </h1>
                <p className="text-xl md:text-2xl opacity-90">
                  Service de taxi rapide, sûr et fiable dans toute la République Démocratique du Congo
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Link href="/auth/login" className="btn-primary text-center py-3 px-8 text-lg">
                    Réserver un taxi
                  </Link>
                  <Link href="/auth/driver-register" className="btn-outline bg-transparent border-white text-white hover:bg-white hover:text-primary-800 text-center py-3 px-8 text-lg">
                    Devenir chauffeur
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex justify-end">
                <div className="card w-full max-w-md bg-white/90 dark:bg-dark-100/90 backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Estimation rapide</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-200 rounded-lg">
                      <FiMapPin className="text-primary-600" />
                      <div className="text-gray-700 dark:text-gray-300">Départ: Centre-ville, Kinshasa</div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-200 rounded-lg">
                      <FiMapPin className="text-primary-600" />
                      <div className="text-gray-700 dark:text-gray-300">Arrivée: Aéroport, Kinshasa</div>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 dark:bg-dark-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FiClock className="text-primary-600" />
                        <div className="text-gray-700 dark:text-gray-300">Durée estimée</div>
                      </div>
                      <div className="font-semibold text-gray-800 dark:text-white">25 min</div>
                    </div>
                    <div className="flex justify-between p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-primary-800 dark:text-primary-300 font-bold">Prix estimé</div>
                      </div>
                      <div className="font-bold text-primary-800 dark:text-primary-300 text-xl">15.000 FC</div>
                    </div>
                    <button className="btn-primary w-full py-3 text-center">
                      Réserver maintenant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 dark:bg-dark-300">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Pourquoi choisir Taxi Express RDC?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Nous offrons un service de taxi de qualité supérieure avec des chauffeurs professionnels et des véhicules confortables.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white dark:bg-dark-100 p-6 rounded-lg shadow hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full mr-3">
                    <FiClock size={18} />
                  </div>
                  <h3 className="text-xl font-semibold">Service rapide</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Arrivée de votre chauffeur en moins de 10 minutes dans les zones urbaines.
                </p>
              </div>
              
              <div className="bg-white dark:bg-dark-100 p-6 rounded-lg shadow hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full mr-3">
                    <FiShield size={18} />
                  </div>
                  <h3 className="text-xl font-semibold">Sécurité garantie</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Chauffeurs vérifiés et suivis par GPS pour votre tranquillité d'esprit.
                </p>
              </div>
              
              <div className="bg-white dark:bg-dark-100 p-6 rounded-lg shadow hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full mr-3">
                    <FiStar size={18} />
                  </div>
                  <h3 className="text-xl font-semibold">Confort premium</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Véhicules modernes et bien entretenus pour un trajet confortable.
                </p>
              </div>
              
              <div className="bg-white dark:bg-dark-100 p-6 rounded-lg shadow hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full mr-3">
                    <FiPhone size={18} />
                  </div>
                  <h3 className="text-xl font-semibold">Support 24/7</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Notre équipe est disponible à tout moment pour vous assister.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white dark:bg-dark-200">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="section-title">Rejoignez-nous dès aujourd'hui</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Que vous soyez un client à la recherche d'un moyen de transport fiable ou un chauffeur souhaitant augmenter vos revenus, Taxi Express RDC est là pour vous.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/auth/login" className="btn-primary flex items-center justify-center space-x-2 py-3">
                    <FiUser />
                    <span>Espace client</span>
                  </Link>
                  <Link href="/auth/driver-register" className="btn-secondary flex items-center justify-center space-x-2 py-3">
                    <FiTruck />
                    <span>Espace chauffeur</span>
                  </Link>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-dark-100 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <FiInfo className="text-primary-600 mr-2" />
                  <span>À propos de nous</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Taxi Express RDC est le premier service de taxi digital en République Démocratique du Congo, offrant une solution moderne aux défis de transport urbain.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Notre mission est de révolutionner le transport en RDC en offrant un service fiable, sécurisé et accessible à tous.
                </p>
                <Link href="/about" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium flex items-center group">
                  En savoir plus
                  <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
