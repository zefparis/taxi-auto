'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiTruck, FiFileText, FiCalendar } from 'react-icons/fi';
import styles from './driver-register.module.css';

// Driver registration form validation schema
const driverRegisterSchema = z.object({
  // Personal information
  firstName: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
  lastName: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  phoneNumber: z.string().min(9, 'Numéro de téléphone requis (min. 9 chiffres)'),
  dateOfBirth: z.string().min(1, 'Date de naissance requise'),
  
  // Vehicle information
  vehicleMake: z.string().min(2, 'Marque du véhicule requise'),
  vehicleModel: z.string().min(2, 'Modèle du véhicule requis'),
  vehicleYear: z.string().min(4, 'Année du véhicule requise'),
  licensePlate: z.string().min(5, 'Numéro de plaque d\'immatriculation requis'),
  
  // Driver license information
  licenseNumber: z.string().min(5, 'Numéro de permis de conduire requis'),
  licenseExpiry: z.string().min(1, 'Date d\'expiration du permis requise'),
  
  // Account security
  password: z.string()
    .min(8, 'Mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Doit contenir au moins une lettre majuscule')
    .regex(/[0-9]/, 'Doit contenir au moins un chiffre'),
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise'),
  
  // Terms and conditions
  terms: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les conditions d\'utilisation'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

type DriverRegisterFormData = z.infer<typeof driverRegisterSchema>;

export default function DriverRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid }
  } = useForm<DriverRegisterFormData>({
    resolver: zodResolver(driverRegisterSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      licensePlate: '',
      licenseNumber: '',
      licenseExpiry: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof DriverRegisterFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth'];
        break;
      case 2:
        fieldsToValidate = ['vehicleMake', 'vehicleModel', 'vehicleYear', 'licensePlate', 'licenseNumber', 'licenseExpiry'];
        break;
    }
    
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit: SubmitHandler<DriverRegisterFormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch('/api/auth/driver-register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      // Mock successful registration for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to login page with driver role
      router.push('/auth/login?role=driver');
    } catch (err) {
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
      console.error('Driver registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-dark-100">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            Devenir Chauffeur Taxi Express RDC
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Rejoignez notre réseau de chauffeurs professionnels
          </p>
        </div>

        <div className="bg-white dark:bg-dark-200 shadow-md rounded-lg p-6 mb-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded">
              {error}
            </div>
          )}

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                      currentStep > index + 1 
                        ? 'bg-primary-600 border-primary-600 text-white' 
                        : currentStep === index + 1 
                        ? 'border-primary-600 text-primary-600' 
                        : 'border-gray-300 text-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                    {index === 0 ? 'Personnel' : index === 1 ? 'Véhicule' : 'Compte'}
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.progressBarContainer}>
              <div 
                className={styles.progressBar}
                ref={(el) => {
                  if (el) {
                    el.style.setProperty('--progress-width', `${((currentStep - 1) / (totalSteps - 1)) * 100}%`);
                  }
                }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Informations Personnelles</h2>
                
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
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date de naissance
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-400" />
                    </div>
                    <input
                      id="dateOfBirth"
                      type="date"
                      {...register('dateOfBirth')}
                      className="input pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.dateOfBirth.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Informations du Véhicule</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Marque du véhicule
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiTruck className="text-gray-400" />
                      </div>
                      <input
                        id="vehicleMake"
                        type="text"
                        {...register('vehicleMake')}
                        className="input pl-10"
                        placeholder="Toyota, Honda, etc."
                        disabled={isLoading}
                      />
                    </div>
                    {errors.vehicleMake && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.vehicleMake.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Modèle du véhicule
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiTruck className="text-gray-400" />
                      </div>
                      <input
                        id="vehicleModel"
                        type="text"
                        {...register('vehicleModel')}
                        className="input pl-10"
                        placeholder="Corolla, Civic, etc."
                        disabled={isLoading}
                      />
                    </div>
                    {errors.vehicleModel && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.vehicleModel.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Année du véhicule
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        id="vehicleYear"
                        type="text"
                        {...register('vehicleYear')}
                        className="input pl-10"
                        placeholder="2020"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.vehicleYear && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.vehicleYear.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Plaque d'immatriculation
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiFileText className="text-gray-400" />
                      </div>
                      <input
                        id="licensePlate"
                        type="text"
                        {...register('licensePlate')}
                        className="input pl-10"
                        placeholder="ABC123"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.licensePlate && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.licensePlate.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Numéro de permis de conduire
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiFileText className="text-gray-400" />
                      </div>
                      <input
                        id="licenseNumber"
                        type="text"
                        {...register('licenseNumber')}
                        className="input pl-10"
                        placeholder="12345678"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.licenseNumber && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.licenseNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="licenseExpiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date d'expiration du permis
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        id="licenseExpiry"
                        type="date"
                        {...register('licenseExpiry')}
                        className="input pl-10"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.licenseExpiry && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.licenseExpiry.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Account Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Informations du Compte</h2>
                
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

                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Note importante:</strong> Après votre inscription, notre équipe vérifiera vos informations et documents. 
                    Vous recevrez un email de confirmation une fois votre compte approuvé.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  Précédent
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary ml-auto"
                  disabled={isLoading}
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary ml-auto flex items-center"
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
                    'Soumettre la demande'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Vous avez déjà un compte?{' '}
            <Link
              href="/auth/login?role=driver"
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
