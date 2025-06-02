'use client';

import { useState } from 'react';
import Link from 'next/link';
import AIChat from '@/components/AIChat';
import AIFareEstimator from '@/components/AIFareEstimator';
import AIRouteOptimizer from '@/components/AIRouteOptimizer';
import AIDriverAssistant from '@/components/AIDriverAssistant';
import { FiCpu, FiMessageSquare, FiDollarSign, FiNavigation, FiTruck, FiHome, FiArrowLeft } from 'react-icons/fi';

export default function AIFeaturesPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'fare' | 'route' | 'driver'>('chat');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-start mb-6">
          <Link href="/" className="flex items-center text-primary-600 hover:text-primary-700 transition-colors">
            <FiArrowLeft className="mr-2" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <FiCpu className="text-primary-600 mr-2" />
            Fonctionnalités IA de Taxi Express RDC
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Notre plateforme utilise l'intelligence artificielle avancée pour améliorer votre expérience de transport
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-6">
          <a
            href="#chat"
            className={`px-4 py-2 font-medium text-sm flex items-center cursor-pointer ${
              activeTab === 'chat'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('chat');
            }}
          >
            <FiMessageSquare className="mr-1" />
            Assistant Client
          </a>
          <a
            href="#fare"
            className={`px-4 py-2 font-medium text-sm flex items-center cursor-pointer ${
              activeTab === 'fare'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('fare');
            }}
          >
            <FiDollarSign className="mr-1" />
            Estimation de Tarif
          </a>
          <a
            href="#route"
            className={`px-4 py-2 font-medium text-sm flex items-center cursor-pointer ${
              activeTab === 'route'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('route');
            }}
          >
            <FiNavigation className="mr-1" />
            Optimisation d'Itinéraire
          </a>
          <a
            href="#driver"
            className={`px-4 py-2 font-medium text-sm flex items-center cursor-pointer ${
              activeTab === 'driver'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('driver');
            }}
          >
            <FiTruck className="mr-1" />
            Assistant Chauffeur
          </a>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-dark-100 rounded-lg shadow-md overflow-hidden">
          {activeTab === 'chat' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiMessageSquare className="text-primary-600 mr-2" />
                Assistant Client IA
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Notre assistant IA est disponible 24/7 pour répondre à toutes vos questions concernant nos services de taxi.
              </p>
              <AIChat 
                userType="passenger" 
                initialSystemMessage="Vous êtes un assistant client pour Taxi Express RDC. Répondez aux questions des clients de manière professionnelle et utile. Utilisez un ton amical et soyez précis dans vos réponses. Répondez en français."
              />
            </div>
          )}

          {activeTab === 'fare' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiDollarSign className="text-primary-600 mr-2" />
                Estimation de Tarif IA
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Notre système d'IA calcule des estimations de tarifs précises basées sur la distance, la durée, le type de véhicule et l'heure de la journée.
              </p>
              <AIFareEstimator />
            </div>
          )}

          {activeTab === 'route' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiNavigation className="text-primary-600 mr-2" />
                Optimisation d'Itinéraire IA
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Notre IA analyse les conditions de circulation en temps réel pour vous proposer l'itinéraire le plus efficace à travers Kinshasa et autres villes de la RDC.
              </p>
              <AIRouteOptimizer />
            </div>
          )}

          {activeTab === 'driver' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiTruck className="text-primary-600 mr-2" />
                Assistant Chauffeur IA
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Notre assistant IA aide les chauffeurs avec des conseils sur les itinéraires, la gestion des clients, et l'optimisation de leur service.
              </p>
              <AIDriverAssistant />
            </div>
          )}
        </div>

        <div className="mt-8 p-6 bg-gray-50 dark:bg-dark-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">À propos de notre technologie IA</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Taxi Express RDC utilise GPT-4-Turbo, l'un des modèles d'IA les plus avancés au monde, pour alimenter toutes nos fonctionnalités d'assistance et d'optimisation.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Notre IA est conçue pour comprendre le contexte local de la RDC, y compris les conditions de circulation, les quartiers, et les préférences des utilisateurs locaux, afin de fournir des réponses et des recommandations pertinentes.
          </p>
        </div>
      </div>
    </div>
  );
}
