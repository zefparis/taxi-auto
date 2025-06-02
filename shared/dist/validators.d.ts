import { z } from 'zod';
import { PaymentMethod, UserRole, VehicleType } from './types';
export declare const loginValidator: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const registerValidator: z.ZodEffects<z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phoneNumber: z.ZodString;
    role: z.ZodNativeEnum<typeof UserRole>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
}, {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
}>, {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
}, {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
}>;
export declare const updateUserValidator: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    profileImageUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    phoneNumber?: string | undefined;
    profileImageUrl?: string | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    phoneNumber?: string | undefined;
    profileImageUrl?: string | undefined;
}>;
export declare const driverRegistrationValidator: z.ZodEffects<z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phoneNumber: z.ZodString;
    role: z.ZodNativeEnum<typeof UserRole>;
    licenseNumber: z.ZodString;
    licenseExpiry: z.ZodEffects<z.ZodString, string, string>;
    vehicleType: z.ZodNativeEnum<typeof VehicleType>;
    vehicleMake: z.ZodString;
    vehicleModel: z.ZodString;
    vehicleYear: z.ZodNumber;
    vehicleColor: z.ZodString;
    vehiclePlateNumber: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
    licenseNumber: string;
    licenseExpiry: string;
    vehicleType: VehicleType;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number;
    vehicleColor: string;
    vehiclePlateNumber: string;
}, {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
    licenseNumber: string;
    licenseExpiry: string;
    vehicleType: VehicleType;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number;
    vehicleColor: string;
    vehiclePlateNumber: string;
}>, {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
    licenseNumber: string;
    licenseExpiry: string;
    vehicleType: VehicleType;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number;
    vehicleColor: string;
    vehiclePlateNumber: string;
}, {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
    licenseNumber: string;
    licenseExpiry: string;
    vehicleType: VehicleType;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number;
    vehicleColor: string;
    vehiclePlateNumber: string;
}>;
export declare const createRideValidator: z.ZodObject<{
    pickupLatitude: z.ZodNumber;
    pickupLongitude: z.ZodNumber;
    pickupAddress: z.ZodString;
    destinationLatitude: z.ZodNumber;
    destinationLongitude: z.ZodNumber;
    destinationAddress: z.ZodString;
    paymentMethod: z.ZodNativeEnum<typeof PaymentMethod>;
}, "strip", z.ZodTypeAny, {
    pickupLatitude: number;
    pickupLongitude: number;
    pickupAddress: string;
    destinationLatitude: number;
    destinationLongitude: number;
    destinationAddress: string;
    paymentMethod: PaymentMethod;
}, {
    pickupLatitude: number;
    pickupLongitude: number;
    pickupAddress: string;
    destinationLatitude: number;
    destinationLongitude: number;
    destinationAddress: string;
    paymentMethod: PaymentMethod;
}>;
export declare const createRatingValidator: z.ZodObject<{
    rideId: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    rideId: string;
    rating: number;
    comment?: string | undefined;
}, {
    rideId: string;
    rating: number;
    comment?: string | undefined;
}>;
export declare const createPaymentValidator: z.ZodObject<{
    amount: z.ZodNumber;
    paymentMethod: z.ZodNativeEnum<typeof PaymentMethod>;
    rideId: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    paymentMethod: PaymentMethod;
    amount: number;
    rideId?: string | undefined;
    description?: string | undefined;
}, {
    paymentMethod: PaymentMethod;
    amount: number;
    rideId?: string | undefined;
    description?: string | undefined;
}>;
export declare const createLocationValidator: z.ZodObject<{
    name: z.ZodString;
    address: z.ZodString;
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    isFavorite: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    isFavorite?: boolean | undefined;
}, {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    isFavorite?: boolean | undefined;
}>;
export declare const createTicketValidator: z.ZodObject<{
    subject: z.ZodString;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    subject: string;
}, {
    description: string;
    subject: string;
}>;
export declare const ticketResponseValidator: z.ZodObject<{
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
}, {
    message: string;
}>;
//# sourceMappingURL=validators.d.ts.map