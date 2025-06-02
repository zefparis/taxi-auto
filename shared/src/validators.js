"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketResponseValidator = exports.createTicketValidator = exports.createLocationValidator = exports.createPaymentValidator = exports.createRatingValidator = exports.createRideValidator = exports.driverRegistrationValidator = exports.updateUserValidator = exports.registerValidator = exports.loginValidator = void 0;
const zod_1 = require("zod");
const types_1 = require("./types");
// Auth validators
exports.loginValidator = zod_1.z.object({
    email: zod_1.z.string().email('Adresse email invalide'),
    password: zod_1.z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});
exports.registerValidator = zod_1.z.object({
    email: zod_1.z.string().email('Adresse email invalide'),
    password: zod_1.z.string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
        .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
    confirmPassword: zod_1.z.string(),
    firstName: zod_1.z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: zod_1.z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    phoneNumber: zod_1.z.string().regex(/^\+?[0-9]{10,15}$/, 'Numéro de téléphone invalide'),
    role: zod_1.z.nativeEnum(types_1.UserRole),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
});
// User validators
exports.updateUserValidator = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').optional(),
    lastName: zod_1.z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
    phoneNumber: zod_1.z.string().regex(/^\+?[0-9]{10,15}$/, 'Numéro de téléphone invalide').optional(),
    profileImageUrl: zod_1.z.string().url('URL d\'image invalide').optional(),
});
// Driver validators
// Create a new schema that includes all fields from registerValidator plus driver-specific fields
exports.driverRegistrationValidator = zod_1.z.object({
    // Include all fields from the base register schema
    email: zod_1.z.string().email('Adresse email invalide'),
    password: zod_1.z.string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
        .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
    confirmPassword: zod_1.z.string(),
    firstName: zod_1.z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: zod_1.z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    phoneNumber: zod_1.z.string().regex(/^\+?[0-9]{10,15}$/, 'Numéro de téléphone invalide'),
    role: zod_1.z.nativeEnum(types_1.UserRole),
    // Driver-specific fields
    licenseNumber: zod_1.z.string().min(5, 'Numéro de licence invalide'),
    licenseExpiry: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Date d\'expiration invalide',
    }),
    vehicleType: zod_1.z.nativeEnum(types_1.VehicleType),
    vehicleMake: zod_1.z.string().min(2, 'Marque du véhicule invalide'),
    vehicleModel: zod_1.z.string().min(2, 'Modèle du véhicule invalide'),
    vehicleYear: zod_1.z.number().int().min(2000, 'Année du véhicule invalide').max(new Date().getFullYear(), 'Année du véhicule invalide'),
    vehicleColor: zod_1.z.string().min(2, 'Couleur du véhicule invalide'),
    vehiclePlateNumber: zod_1.z.string().min(5, 'Numéro de plaque invalide'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
});
// Ride validators
exports.createRideValidator = zod_1.z.object({
    pickupLatitude: zod_1.z.number(),
    pickupLongitude: zod_1.z.number(),
    pickupAddress: zod_1.z.string().min(5, 'Adresse de départ invalide'),
    destinationLatitude: zod_1.z.number(),
    destinationLongitude: zod_1.z.number(),
    destinationAddress: zod_1.z.string().min(5, 'Adresse de destination invalide'),
    paymentMethod: zod_1.z.nativeEnum(types_1.PaymentMethod),
});
// Rating validators
exports.createRatingValidator = zod_1.z.object({
    rideId: zod_1.z.string().uuid('ID de course invalide'),
    rating: zod_1.z.number().int().min(1, 'Note minimale: 1').max(5, 'Note maximale: 5'),
    comment: zod_1.z.string().max(500, 'Commentaire trop long').optional(),
});
// Payment validators
exports.createPaymentValidator = zod_1.z.object({
    amount: zod_1.z.number().positive('Le montant doit être positif'),
    paymentMethod: zod_1.z.nativeEnum(types_1.PaymentMethod),
    rideId: zod_1.z.string().uuid('ID de course invalide').optional(),
    description: zod_1.z.string().optional(),
});
// Location validators
exports.createLocationValidator = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Nom de l\'emplacement invalide'),
    address: zod_1.z.string().min(5, 'Adresse invalide'),
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
    isFavorite: zod_1.z.boolean().optional(),
});
// Support ticket validators
exports.createTicketValidator = zod_1.z.object({
    subject: zod_1.z.string().min(5, 'Sujet trop court').max(100, 'Sujet trop long'),
    description: zod_1.z.string().min(10, 'Description trop courte').max(1000, 'Description trop longue'),
});
exports.ticketResponseValidator = zod_1.z.object({
    message: zod_1.z.string().min(2, 'Message trop court').max(1000, 'Message trop long'),
});
//# sourceMappingURL=validators.js.map