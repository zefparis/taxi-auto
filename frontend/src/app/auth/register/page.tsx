'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi'; // Tous ces icônes sont utilisés dans le JSX

// Registration form validation schema
const registerSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
  lastName: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  phoneNumber: z.string().min(9, 'Numéro de téléphone requis (min. 9 chiffres)'),
  password: z.string()
    .min(8, 'Mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Doit contenir au moins une lettre majuscule')
    .regex(/[0-9]/, 'Doit contenir au moins un chiffre'),
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise'),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter les conditions d\'utilisation' } as const)
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'client';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      terms: false as true // Type assertion for the literal true type
    }
  });

  const onSubmit = async (formData: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...formData, role })
      // });
      
      // Mock successful registration for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to login page
      router.push(`/auth/login${role === 'driver' ? '?role=driver' : ''}`);
    } catch (err) {
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-dark-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {role === 'driver' ? 'Inscription Chauffeur' : 'Inscription Client'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Créez votre compte Taxi Express RDC
          </p>
        </div>

        <div className="bg-white dark:bg-dark-200 shadow-md rounded-lg p-6 mb-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prénom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    {...register('firstName')}
                    className="input pl-10"
                    placeholder="Prénom"
                    disabled={isLoading}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    {...register('lastName')}
                    className="input pl-10"
                    placeholder="Nom"
                    disabled={isLoading}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  id="phoneNumber"
                  type="tel"
                  {...register('phoneNumber')}
                  className="input pl-10"
                  placeholder="+243 XXXXXXXXX"
                  disabled={isLoading}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.phoneNumber.message}</p>
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

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <FiEye className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  {...register('terms')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                  J'accepte les{' '}
                  <Link href="/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    politique de confidentialité
                  </Link>
                </label>
                {errors.terms && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.terms.message}</p>
                )}
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
                  Inscription en cours...
                </span>
              ) : (
                'S\'inscrire'
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Vous avez déjà un compte?{' '}
            <Link
              href={`/auth/login${role === 'driver' ? '?role=driver' : ''}`}
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
