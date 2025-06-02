import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-200">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto max-w-6xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Nous sommes à votre écoute. N'hésitez pas à nous contacter pour toute question ou demande d'information.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="section-title">Envoyez-nous un message</h2>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </p>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom complet
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      className="input-field" 
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      className="input-field" 
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Téléphone
                  </label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="input-field" 
                    placeholder="+243 XXXXXXXXX"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sujet
                  </label>
                  <select id="subject" className="input-field">
                    <option value="">Sélectionnez un sujet</option>
                    <option value="reservation">Réservation</option>
                    <option value="information">Demande d'information</option>
                    <option value="complaint">Réclamation</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea 
                    id="message" 
                    rows={5} 
                    className="input-field" 
                    placeholder="Votre message ici..."
                    required
                  ></textarea>
                </div>
                
                <div>
                  <button type="submit" className="btn-primary w-full md:w-auto">
                    Envoyer le message
                  </button>
                </div>
              </form>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="section-title">Nos coordonnées</h2>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Vous préférez nous contacter directement ? Voici toutes nos coordonnées.
              </p>
              
              <div className="space-y-6">
                <div className="card">
                  <div className="flex">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4 h-min">
                      <FaMapMarkerAlt className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Adresse</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        123 Avenue de la Libération<br />
                        Commune de la Gombe<br />
                        Kinshasa, RDC
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4 h-min">
                      <FaPhoneAlt className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Téléphone</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        +243 81 234 5678<br />
                        +243 99 876 5432
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4 h-min">
                      <FaEnvelope className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Email</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        info@taxiexpress-rdc.com<br />
                        support@taxiexpress-rdc.com
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4 h-min">
                      <FaClock className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Heures d'ouverture</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Bureau :</span> Lundi - Vendredi: 8h00 - 17h00<br />
                        <span className="font-medium">Service client :</span> 24h/24, 7j/7
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Suivez-nous</h3>
                  <div className="flex space-x-4">
                    <a href="#" aria-label="Facebook" className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full text-primary-600 hover:bg-primary-600 hover:text-white transition-colors duration-300">
                      <FaFacebook className="text-xl" />
                    </a>
                    <a href="#" aria-label="Twitter" className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full text-primary-600 hover:bg-primary-600 hover:text-white transition-colors duration-300">
                      <FaTwitter className="text-xl" />
                    </a>
                    <a href="#" aria-label="Instagram" className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full text-primary-600 hover:bg-primary-600 hover:text-white transition-colors duration-300">
                      <FaInstagram className="text-xl" />
                    </a>
                    <a href="#" aria-label="LinkedIn" className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full text-primary-600 hover:bg-primary-600 hover:text-white transition-colors duration-300">
                      <FaLinkedin className="text-xl" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 bg-gray-100 dark:bg-dark-100">
        <div className="container mx-auto max-w-6xl">
          <h2 className="section-title text-center mx-auto">Nous trouver</h2>
          <p className="text-center max-w-2xl mx-auto mb-12 text-gray-700 dark:text-gray-300">
            Venez nous rendre visite à notre siège social à Kinshasa.
          </p>
          
          <div className="h-96 rounded-xl overflow-hidden shadow-xl">
            {/* Ici, vous pourriez intégrer une carte Google Maps ou OpenStreetMap */}
            <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              <p className="text-gray-600 dark:text-gray-400 text-center p-4">
                Carte interactive sera chargée ici.<br />
                Pour l'intégration réelle, utilisez Google Maps ou OpenStreetMap API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="section-title text-center mx-auto">Questions fréquentes</h2>
          <p className="text-center max-w-2xl mx-auto mb-12 text-gray-700 dark:text-gray-300">
            Trouvez rapidement des réponses aux questions les plus courantes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Comment puis-je réserver un taxi ?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vous pouvez réserver un taxi via notre application mobile, notre site web ou en appelant notre centre d'appels au +243 81 234 5678.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Quels modes de paiement acceptez-vous ?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nous acceptons les paiements en espèces, par carte bancaire, Mobile Money (M-Pesa, Orange Money, Airtel Money) et par virement bancaire pour les entreprises.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Comment devenir chauffeur chez Taxi Express RDC ?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Pour devenir chauffeur, vous devez avoir un permis de conduire valide, un véhicule en bon état ou utiliser l'un de nos véhicules, et passer notre processus de vérification. Contactez-nous pour plus d'informations.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Puis-je réserver un taxi à l'avance ?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Oui, vous pouvez réserver un taxi jusqu'à 7 jours à l'avance via notre application ou notre site web. C'est idéal pour les transferts aéroport ou les rendez-vous importants.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Vous ne trouvez pas la réponse à votre question ?
            </p>
            <a href="#" className="btn-outline">
              Voir toutes les FAQ
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-100 dark:bg-dark-100">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary-600 text-white rounded-xl p-8 md:p-12 shadow-xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Besoin d'une réponse rapide ?</h2>
              <p className="text-lg opacity-90 mb-8">
                Notre équipe de support client est disponible 24/7 pour répondre à toutes vos questions.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="tel:+243812345678" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center">
                  <FaPhoneAlt className="mr-2" /> Appelez-nous
                </a>
                <a href="mailto:support@taxiexpress-rdc.com" className="bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-6 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center">
                  <FaEnvelope className="mr-2" /> Envoyez un email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
