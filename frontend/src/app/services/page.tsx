import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCar, FaShieldAlt, FaUserTie, FaRoute, FaPhoneAlt, FaBusinessTime, FaPlane, FaStar } from 'react-icons/fa';

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-200">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto max-w-6xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos Services</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Des solutions de transport fiables et sécurisées adaptées à tous vos besoins en République Démocratique du Congo.
          </p>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="section-title text-center mx-auto">Services Principaux</h2>
          <p className="text-center max-w-2xl mx-auto mb-12 text-gray-700 dark:text-gray-300">
            Chez Taxi Express RDC, nous proposons une gamme complète de services de transport pour répondre à tous vos besoins.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <Link href="/services/taxi" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4">
                  <FaCar className="text-primary-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Courses Urbaines</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Déplacez-vous facilement dans la ville avec nos taxis confortables et sécurisés. Disponible 24/7 pour tous vos trajets urbains.
              </p>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✓</span>
                  Arrivée en moins de 10 minutes
                </li>
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✓</span>
                  Chauffeurs professionnels
                </li>
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✓</span>
                  Véhicules climatisés
                </li>
              </ul>
            </Link>
            
            {/* Service 2 */}
            <Link href="/services/business" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4">
                  <FaBusinessTime className="text-primary-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Services Entreprises</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Solutions de transport sur mesure pour les entreprises, avec facturation mensuelle et service prioritaire.
              </p>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✓</span>
                  Comptes professionnels
                </li>
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✓</span>
                  Facturation simplifiée
                </li>
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✓</span>
                  Service VIP
                </li>
              </ul>
            </Link>
            
            {/* Service 3 */}
            <Link href="/services/airport" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4">
                  <FaPlane className="text-primary-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Transfert Aéroport</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Service de transfert aéroport ponctuel et confortable pour vos arrivées et départs, avec suivi des vols.
              </p>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✓</span>
                  Suivi des vols en temps réel
                </li>
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✓</span>
                  Chauffeur avec pancarte nominative
                </li>
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✓</span>
                  Assistance bagages
                </li>
              </ul>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-100 dark:bg-dark-100">
        <div className="container mx-auto max-w-6xl">
          <h2 className="section-title text-center mx-auto">Comment Ça Marche</h2>
          <p className="text-center max-w-2xl mx-auto mb-12 text-gray-700 dark:text-gray-300">
            Réserver un taxi avec Taxi Express RDC est simple, rapide et sans stress.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white dark:bg-dark-200 rounded-xl p-6 shadow-md relative">
              <div className="absolute -top-5 -left-5 bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">1</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 mt-2">Réservez</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Réservez votre course via notre application mobile, notre site web ou par téléphone.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white dark:bg-dark-200 rounded-xl p-6 shadow-md relative">
              <div className="absolute -top-5 -left-5 bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">2</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 mt-2">Confirmez</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Recevez les détails de votre chauffeur et suivez son arrivée en temps réel.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white dark:bg-dark-200 rounded-xl p-6 shadow-md relative">
              <div className="absolute -top-5 -left-5 bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">3</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 mt-2">Voyagez</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Profitez d'un trajet confortable et sécurisé jusqu'à votre destination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">Caractéristiques Premium</h2>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Chez Taxi Express RDC, nous nous distinguons par notre engagement envers la qualité et la sécurité. Voici ce qui fait la différence :
              </p>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full mr-4 h-min mt-1">
                    <FaShieldAlt className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Sécurité Garantie</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Tous nos chauffeurs sont vérifiés et formés. Nos véhicules sont régulièrement inspectés.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full mr-4 h-min mt-1">
                    <FaUserTie className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Chauffeurs Professionnels</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Nos chauffeurs sont courtois, ponctuels et connaissent parfaitement la ville.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full mr-4 h-min mt-1">
                    <FaPhoneAlt className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Support 24/7</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Notre équipe de support est disponible à tout moment pour vous assister.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
              <Image 
                src="/images/premium-service.jpg" 
                alt="Service premium Taxi Express RDC" 
                fill 
                style={{objectFit: 'cover'}}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-gray-100 dark:bg-dark-100">
        <div className="container mx-auto max-w-6xl">
          <h2 className="section-title text-center mx-auto">Tarification Transparente</h2>
          <p className="text-center max-w-2xl mx-auto mb-12 text-gray-700 dark:text-gray-300">
            Des prix clairs et sans surprise. Vous savez exactement ce que vous payez.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic */}
            <div className="bg-white dark:bg-dark-200 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="bg-primary-600 text-white p-4 text-center">
                <h3 className="text-xl font-bold">Course Standard</h3>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">5.000 FC</span>
                  <span className="text-gray-600 dark:text-gray-400">/km</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-primary-600 mr-2">✓</span>
                    Prise en charge : 2.000 FC
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-primary-600 mr-2">✓</span>
                    Temps d'attente : 500 FC/min
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-primary-600 mr-2">✓</span>
                    Annulation : Gratuite avant 5 min
                  </li>
                </ul>
                
                <Link href="/services/taxi" className="btn-primary w-full block text-center">Réserver maintenant</Link>
              </div>
            </div>
            
            {/* Premium */}
            <div className="bg-white dark:bg-dark-200 rounded-xl overflow-hidden shadow-lg transform scale-105 relative z-10">
              <div className="absolute top-0 right-0 bg-secondary-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">POPULAIRE</div>
              <div className="bg-primary-700 text-white p-4 text-center">
                <h3 className="text-xl font-bold">Course Premium</h3>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">7.500 FC</span>
                  <span className="text-gray-600 dark:text-gray-400">/km</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-primary-600 mr-2">✓</span>
                    Prise en charge : 3.000 FC
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-primary-600 mr-2">✓</span>
                    Véhicule haut de gamme
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-primary-600 mr-2">✓</span>
                    Eau et wifi gratuits
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-primary-600 mr-2">✓</span>
                    Annulation : Gratuite avant 10 min
                  </li>
                </ul>
                
                <Link href="/services/taxi" className="btn-primary w-full block text-center">Réserver maintenant</Link>
              </div>
            </div>
            
            {/* Business */}
            <div className="bg-white dark:bg-dark-200 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="bg-primary-600 text-white p-4 text-center">
                <h3 className="text-xl font-bold">Forfait Entreprise</h3>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">Sur mesure</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-primary-600 mr-2">✓</span>
                    Tarifs négociés
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-primary-600 mr-2">✓</span>
                    Facturation mensuelle
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-primary-600 mr-2">✓</span>
                    Service prioritaire
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-primary-600 mr-2">✓</span>
                    Gestionnaire de compte dédié
                  </li>
                </ul>
                
                <Link href="/services/business" className="btn-outline w-full block text-center">Contactez-nous</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary-600 text-white rounded-xl p-8 md:p-12 shadow-xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à essayer nos services ?</h2>
              <p className="text-lg opacity-90 mb-8">
                Téléchargez notre application ou réservez en ligne pour profiter d'un service de taxi exceptionnel en RDC.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="#" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 inline-block">
                  Télécharger l'application
                </Link>
                <Link href="/services/taxi" className="bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-6 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 inline-block">
                  Réserver maintenant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
