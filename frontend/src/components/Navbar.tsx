'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Avoid hydration mismatch by only rendering theme components after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-dark-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-primary-600 font-bold text-2xl">
            Taxi Express RDC
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`${pathname === '/' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'} hover:text-primary-600 dark:hover:text-primary-400 font-medium`}
            >
              Accueil
            </Link>
            <Link 
              href="/about" 
              className={`${pathname === '/about' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'} hover:text-primary-600 dark:hover:text-primary-400 font-medium`}
            >
              À propos
            </Link>
            <Link 
              href="/services" 
              className={`${pathname === '/services' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'} hover:text-primary-600 dark:hover:text-primary-400 font-medium`}
            >
              Services
            </Link>
            <Link 
              href="/contact" 
              className={`${pathname === '/contact' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'} hover:text-primary-600 dark:hover:text-primary-400 font-medium`}
            >
              Contact
            </Link>
            <Link 
              href="/ai-features" 
              className={`${pathname === '/ai-features' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'} hover:text-primary-600 dark:hover:text-primary-400 font-medium`}
            >
              IA
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            
            {/* Login Button */}
            <Link 
              href="/auth/login" 
              className="hidden md:block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Connexion
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-200 shadow-lg">
          <nav className="flex flex-col px-4 py-3 space-y-3">
            <Link 
              href="/" 
              className={`${pathname === '/' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'} hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              href="/about" 
              className={`${pathname === '/about' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'} hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2`}
              onClick={() => setMobileMenuOpen(false)}
            >
              À propos
            </Link>
            <Link 
              href="/services" 
              className={`${pathname === '/services' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'} hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/contact" 
              className={`${pathname === '/contact' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'} hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/ai-features" 
              className={`${pathname === '/ai-features' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'} hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2`}
              onClick={() => setMobileMenuOpen(false)}
            >
              IA
            </Link>
            <Link 
              href="/auth/login" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Connexion
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
