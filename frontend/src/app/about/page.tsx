import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-200">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto max-w-6xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">À propos de Taxi Express RDC</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Découvrez notre histoire, notre mission et notre engagement envers un service de transport sûr et fiable en République Démocratique du Congo.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">Notre Histoire</h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Fondée en 2022, Taxi Express RDC est née d'une vision simple mais puissante : transformer l'expérience de transport en RDC en offrant un service de taxi fiable, sécurisé et accessible.
              </p>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Face aux défis de mobilité urbaine à Kinshasa et dans d'autres grandes villes du pays, notre fondateur a décidé de créer une solution qui répond aux besoins spécifiques des Congolais.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Depuis notre lancement, nous avons connu une croissance rapide, servant des milliers de clients et créant des opportunités d'emploi pour de nombreux chauffeurs locaux.
              </p>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden shadow-xl">
              <Image 
                src="/images/about-history.jpg" 
                alt="L'histoire de Taxi Express RDC" 
                fill 
                style={{objectFit: 'cover'}}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 px-4 bg-gray-100 dark:bg-dark-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative h-80 rounded-xl overflow-hidden shadow-xl">
              <Image 
                src="/images/about-mission.jpg" 
                alt="Notre mission" 
                fill 
                style={{objectFit: 'cover'}}
                className="rounded-xl"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="section-title">Notre Mission</h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Chez Taxi Express RDC, notre mission est de révolutionner la mobilité urbaine en RDC en offrant un service de transport sûr, fiable et accessible à tous.
              </p>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Nous nous engageons à :
              </p>
              <ul className="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Garantir la sécurité de nos passagers à tout moment</li>
                <li>Offrir un service ponctuel et fiable</li>
                <li>Maintenir une flotte de véhicules propres et bien entretenus</li>
                <li>Former nos chauffeurs aux meilleurs standards de service client</li>
                <li>Contribuer positivement à l'économie locale</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="section-title text-center mx-auto">Notre Équipe</h2>
          <p className="text-center max-w-2xl mx-auto mb-12 text-gray-700 dark:text-gray-300">
            Derrière Taxi Express RDC se trouve une équipe dévouée de professionnels passionnés par l'amélioration de la mobilité urbaine en RDC.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="card text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image 
                  src="/images/team-1.jpg" 
                  alt="Membre de l'équipe" 
                  fill 
                  style={{objectFit: 'cover'}}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Jean Mutombo</h3>
              <p className="text-primary-600 font-medium mb-3">Fondateur & CEO</p>
              <p className="text-gray-600 dark:text-gray-400">
                Visionnaire avec plus de 15 ans d'expérience dans le secteur des transports.
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="card text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image 
                  src="/images/team-2.jpg" 
                  alt="Membre de l'équipe" 
                  fill 
                  style={{objectFit: 'cover'}}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Marie Lukusa</h3>
              <p className="text-primary-600 font-medium mb-3">Directrice des Opérations</p>
              <p className="text-gray-600 dark:text-gray-400">
                Experte en logistique urbaine avec une passion pour l'excellence du service.
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="card text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image 
                  src="/images/team-3.jpg" 
                  alt="Membre de l'équipe" 
                  fill 
                  style={{objectFit: 'cover'}}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Patrick Kabongo</h3>
              <p className="text-primary-600 font-medium mb-3">Responsable Technique</p>
              <p className="text-gray-600 dark:text-gray-400">
                Ingénieur innovant qui dirige notre plateforme technologique et nos initiatives numériques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gray-100 dark:bg-dark-100">
        <div className="container mx-auto max-w-6xl">
          <h2 className="section-title text-center mx-auto">Nos Valeurs</h2>
          <p className="text-center max-w-2xl mx-auto mb-12 text-gray-700 dark:text-gray-300">
            Ces principes guident chacune de nos actions et décisions au quotidien.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Value 1 */}
            <div className="feature-card">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Sécurité</h3>
              <p className="text-gray-600 dark:text-gray-400">
                La sécurité de nos clients et chauffeurs est notre priorité absolue.
              </p>
            </div>
            
            {/* Value 2 */}
            <div className="feature-card">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Fiabilité</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nous tenons nos promesses et sommes là quand vous avez besoin de nous.
              </p>
            </div>
            
            {/* Value 3 */}
            <div className="feature-card">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nous cherchons constamment à améliorer notre service grâce à la technologie.
              </p>
            </div>
            
            {/* Value 4 */}
            <div className="feature-card">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Communauté</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nous investissons dans nos communautés locales et notre environnement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
