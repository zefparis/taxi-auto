// User related types
export enum UserRole {
  CLIENT = 'CLIENT',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  profileImageUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client extends User {
  favoriteLocations?: Location[];
  wallet?: Wallet;
}

export interface Driver extends User {
  licenseNumber: string;
  licenseExpiry: Date;
  vehicleType: VehicleType;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleColor: string;
  vehiclePlateNumber: string;
  isAvailable: boolean;
  currentLatitude?: number;
  currentLongitude?: number;
  averageRating: number;
  wallet?: Wallet;
  documents?: DriverDocuments;
}

export interface DriverDocuments {
  identityDocument?: string;
  driverLicense?: string;
  vehicleRegistration?: string;
  insuranceDocument?: string;
}

// Ride related types
export enum RideStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  ARRIVED = 'ARRIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Ride {
  id: string;
  clientId: string;
  client?: Client;
  driverId?: string;
  driver?: Driver;
  status: RideStatus;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupAddress: string;
  destinationLatitude: number;
  destinationLongitude: number;
  destinationAddress: string;
  requestedAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  estimatedPrice: number;
  finalPrice?: number;
  distance: number;
  duration?: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  rating?: Rating;
  messages?: Message[];
}

// Payment related types
export enum PaymentMethod {
  MOBILE_MONEY = 'MOBILE_MONEY',
  CREDIT_CARD = 'CREDIT_CARD',
  WALLET = 'WALLET',
  CASH = 'CASH'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface Wallet {
  id: string;
  balance: number;
  currency: string;
  clientId?: string;
  driverId?: string;
  transactions?: Transaction[];
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  COMMISSION = 'COMMISSION'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description?: string;
  externalReference?: string;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

// Rating related types
export interface Rating {
  id: string;
  rideId: string;
  clientId: string;
  driverId: string;
  clientToDriverRating?: number;
  driverToClientRating?: number;
  clientComment?: string;
  driverComment?: string;
  createdAt: Date;
}

// Location related types
export interface Location {
  id: string;
  clientId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isFavorite: boolean;
}

// Message related types
export interface Message {
  id: string;
  rideId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

// Notification related types
export enum NotificationType {
  RIDE_REQUEST = 'RIDE_REQUEST',
  RIDE_ACCEPTED = 'RIDE_ACCEPTED',
  RIDE_CANCELLED = 'RIDE_CANCELLED',
  RIDE_COMPLETED = 'RIDE_COMPLETED',
  PAYMENT = 'PAYMENT',
  SYSTEM = 'SYSTEM',
  PROMOTION = 'PROMOTION'
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

// Support ticket related types
export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum RespondentType {
  USER = 'USER',
  SUPPORT = 'SUPPORT',
  AI = 'AI',
  SYSTEM = 'SYSTEM'
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
  responses?: TicketResponse[];
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  message: string;
  respondentType: RespondentType;
  respondentId?: string;
  createdAt: Date;
}

// Vehicle related types
export enum VehicleType {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  SUV = 'SUV',
  MOTO = 'MOTO'
}

// Auth related types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
}
