import { z } from 'zod';
import { PaymentMethod, UserRole, VehicleType } from './types';
// Auth validators
export const loginValidator = z.object({
    email: z.string().email('Adresse email invalide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});
export const registerValidator = z.object({
    email: z.string().email('Adresse email invalide'),
    password: z.string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
        .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
    confirmPassword: z.string(),
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, 'Numéro de téléphone invalide'),
    role: z.nativeEnum(UserRole),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
});
// User validators
export const updateUserValidator = z.object({
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').optional(),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
    phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, 'Numéro de téléphone invalide').optional(),
    profileImageUrl: z.string().url('URL d\'image invalide').optional(),
});
// Driver validators
// Create a new schema that includes all fields from registerValidator plus driver-specific fields
export const driverRegistrationValidator = z.object({
    // Include all fields from the base register schema
    email: z.string().email('Adresse email invalide'),
    password: z.string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
        .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
    confirmPassword: z.string(),
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, 'Numéro de téléphone invalide'),
    role: z.nativeEnum(UserRole),
    // Driver-specific fields
    licenseNumber: z.string().min(5, 'Numéro de licence invalide'),
    licenseExpiry: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Date d\'expiration invalide',
    }),
    vehicleType: z.nativeEnum(VehicleType),
    vehicleMake: z.string().min(2, 'Marque du véhicule invalide'),
    vehicleModel: z.string().min(2, 'Modèle du véhicule invalide'),
    vehicleYear: z.number().int().min(2000, 'Année du véhicule invalide').max(new Date().getFullYear(), 'Année du véhicule invalide'),
    vehicleColor: z.string().min(2, 'Couleur du véhicule invalide'),
    vehiclePlateNumber: z.string().min(5, 'Numéro de plaque invalide'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
});
// Ride validators
export const createRideValidator = z.object({
    pickupLatitude: z.number(),
    pickupLongitude: z.number(),
    pickupAddress: z.string().min(5, 'Adresse de départ invalide'),
    destinationLatitude: z.number(),
    destinationLongitude: z.number(),
    destinationAddress: z.string().min(5, 'Adresse de destination invalide'),
    paymentMethod: z.nativeEnum(PaymentMethod),
});
// Rating validators
export const createRatingValidator = z.object({
    rideId: z.string().uuid('ID de course invalide'),
    rating: z.number().int().min(1, 'Note minimale: 1').max(5, 'Note maximale: 5'),
    comment: z.string().max(500, 'Commentaire trop long').optional(),
});
// Payment validators
export const createPaymentValidator = z.object({
    amount: z.number().positive('Le montant doit être positif'),
    paymentMethod: z.nativeEnum(PaymentMethod),
    rideId: z.string().uuid('ID de course invalide').optional(),
    description: z.string().optional(),
});
// Location validators
export const createLocationValidator = z.object({
    name: z.string().min(2, 'Nom de l\'emplacement invalide'),
    address: z.string().min(5, 'Adresse invalide'),
    latitude: z.number(),
    longitude: z.number(),
    isFavorite: z.boolean().optional(),
});
// Support ticket validators
export const createTicketValidator = z.object({
    subject: z.string().min(5, 'Sujet trop court').max(100, 'Sujet trop long'),
    description: z.string().min(10, 'Description trop courte').max(1000, 'Description trop longue'),
});
export const ticketResponseValidator = z.object({
    message: z.string().min(2, 'Message trop court').max(1000, 'Message trop long'),
});
