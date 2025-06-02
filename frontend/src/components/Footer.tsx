'use client';

import Link from 'next/link';
import { FiMapPin, FiPhone } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Taxi Express RDC</h3>
            <p className="text-gray-400 mb-4">
              Votre partenaire de confiance pour tous vos déplacements en République Démocratique du Congo.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white">Accueil</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white">À propos</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white">Services</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/services/taxi" className="text-gray-400 hover:text-white">Taxi standard</Link></li>
              <li><Link href="/services/premium" className="text-gray-400 hover:text-white">Taxi premium</Link></li>
              <li><Link href="/services/airport" className="text-gray-400 hover:text-white">Transfert aéroport</Link></li>
              <li><Link href="/services/business" className="text-gray-400 hover:text-white">Service entreprise</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <FiMapPin className="text-primary-400 mt-1 mr-2" />
                <span>123 Avenue du Commerce, Kinshasa, RDC</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="text-primary-400 mr-2" />
                <span>+243 123 456 789</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Taxi Express RDC. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
