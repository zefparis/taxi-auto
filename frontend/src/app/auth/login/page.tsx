'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'; // Tous ces icônes sont utilisés dans le JSX

// Login form validation schema
const loginSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(1, 'Mot de passe requis')
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'client';
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (formData: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...formData, role })
      // });
      
      // Mock successful login for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect based on role
      if (role === 'driver') {
        router.push('/driver/dashboard');
      } else {
        router.push('/client/dashboard');
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-dark-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {role === 'driver' ? 'Connexion Chauffeur' : 'Connexion Client'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Bienvenue sur Taxi Express RDC
          </p>
        </div>

        <div className="bg-white dark:bg-dark-200 shadow-md rounded-lg p-6 mb-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="input pl-10"
                  placeholder="votre@email.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <FiEye className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Se souvenir de moi
                </label>
              </div>
              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Mot de passe oublié?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex justify-center py-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Vous n'avez pas de compte?{' '}
            <Link
              href={`/auth/register${role === 'driver' ? '?role=driver' : ''}`}
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
