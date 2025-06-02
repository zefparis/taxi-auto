"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.APP_CONSTANTS = exports.STORAGE_KEYS = exports.SOCKET_EVENTS = exports.API_ENDPOINTS = void 0;
// API Endpoints
exports.API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        REFRESH: '/api/auth/refresh',
        LOGOUT: '/api/auth/logout',
        VERIFY_EMAIL: '/api/auth/verify-email',
        FORGOT_PASSWORD: '/api/auth/forgot-password',
        RESET_PASSWORD: '/api/auth/reset-password',
    },
    USERS: {
        BASE: '/api/users',
        PROFILE: '/api/users/profile',
        UPDATE: '/api/users/update',
        CHANGE_PASSWORD: '/api/users/change-password',
    },
    CLIENTS: {
        BASE: '/api/clients',
        RIDES: '/api/clients/rides',
        FAVORITES: '/api/clients/favorites',
        WALLET: '/api/clients/wallet',
    },
    DRIVERS: {
        BASE: '/api/drivers',
        RIDES: '/api/drivers/rides',
        AVAILABILITY: '/api/drivers/availability',
        LOCATION: '/api/drivers/location',
        WALLET: '/api/drivers/wallet',
        DOCUMENTS: '/api/drivers/documents',
    },
    RIDES: {
        BASE: '/api/rides',
        REQUEST: '/api/rides/request',
        ACCEPT: '/api/rides/accept',
        CANCEL: '/api/rides/cancel',
        START: '/api/rides/start',
        COMPLETE: '/api/rides/complete',
        RATE: '/api/rides/rate',
    },
    PAYMENTS: {
        BASE: '/api/payments',
        PROCESS: '/api/payments/process',
        VERIFY: '/api/payments/verify',
        WALLET: '/api/payments/wallet',
    },
    ADMIN: {
        BASE: '/api/admin',
        USERS: '/api/admin/users',
        DRIVERS: '/api/admin/drivers',
        RIDES: '/api/admin/rides',
        PAYMENTS: '/api/admin/payments',
        REPORTS: '/api/admin/reports',
        SETTINGS: '/api/admin/settings',
    },
    SUPPORT: {
        BASE: '/api/support',
        TICKETS: '/api/support/tickets',
        CHAT: '/api/support/chat',
    },
};
// Socket.IO Events
exports.SOCKET_EVENTS = {
    // Connection events
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    // Ride events
    RIDE_REQUESTED: 'ride:requested',
    RIDE_ACCEPTED: 'ride:accepted',
    RIDE_REJECTED: 'ride:rejected',
    RIDE_CANCELLED: 'ride:cancelled',
    RIDE_STARTED: 'ride:started',
    RIDE_COMPLETED: 'ride:completed',
    DRIVER_ARRIVED: 'ride:driver_arrived',
    // Location events
    LOCATION_UPDATE: 'location:update',
    LOCATION_SUBSCRIBE: 'location:subscribe',
    LOCATION_UNSUBSCRIBE: 'location:unsubscribe',
    // Chat events
    CHAT_JOIN: 'chat:join',
    CHAT_LEAVE: 'chat:leave',
    CHAT_MESSAGE: 'chat:message',
    CHAT_TYPING: 'chat:typing',
    // Notification events
    NOTIFICATION: 'notification',
    // Driver availability events
    DRIVER_AVAILABLE: 'driver:available',
    DRIVER_UNAVAILABLE: 'driver:unavailable',
    // Payment events
    PAYMENT_PROCESSED: 'payment:processed',
    PAYMENT_FAILED: 'payment:failed',
};
// Local Storage Keys
exports.STORAGE_KEYS = {
    ACCESS_TOKEN: 'taxi_express_access_token',
    REFRESH_TOKEN: 'taxi_express_refresh_token',
    USER: 'taxi_express_user',
    THEME: 'taxi_express_theme',
    LANGUAGE: 'taxi_express_language',
    LAST_LOCATION: 'taxi_express_last_location',
};
// App Constants
exports.APP_CONSTANTS = {
    DEFAULT_LANGUAGE: 'fr',
    SUPPORTED_LANGUAGES: ['fr', 'en', 'ln', 'sw'],
    DEFAULT_CURRENCY: 'CDF',
    DEFAULT_THEME: 'dark',
    MIN_PASSWORD_LENGTH: 8,
    MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
    RIDE_TIMEOUT: 60 * 1000, // 60 seconds
    DRIVER_LOCATION_UPDATE_INTERVAL: 10 * 1000, // 10 seconds
    RIDE_STATUSES: {
        REQUESTED: 'REQUESTED',
        ACCEPTED: 'ACCEPTED',
        ARRIVED: 'ARRIVED',
        IN_PROGRESS: 'IN_PROGRESS',
        COMPLETED: 'COMPLETED',
        CANCELLED: 'CANCELLED',
    },
    PAYMENT_METHODS: {
        MOBILE_MONEY: 'MOBILE_MONEY',
        CREDIT_CARD: 'CREDIT_CARD',
        WALLET: 'WALLET',
        CASH: 'CASH',
    },
    MOBILE_MONEY_PROVIDERS: {
        UNIPESA: 'UniPesa',
        ORANGE: 'Orange Money',
        AIRTEL: 'Airtel Money',
        AFRICELL: 'Africell Money',
    },
};
// Error Messages
exports.ERROR_MESSAGES = {
    GENERIC: 'Une erreur est survenue. Veuillez réessayer.',
    NETWORK: 'Erreur de connexion. Veuillez vérifier votre connexion internet.',
    UNAUTHORIZED: 'Vous n\'êtes pas autorisé à effectuer cette action.',
    NOT_FOUND: 'La ressource demandée n\'a pas été trouvée.',
    VALIDATION: 'Veuillez vérifier les informations saisies.',
    SERVER: 'Erreur serveur. Veuillez réessayer plus tard.',
    AUTH: {
        INVALID_CREDENTIALS: 'Email ou mot de passe incorrect.',
        EMAIL_EXISTS: 'Cet email est déjà utilisé.',
        PHONE_EXISTS: 'Ce numéro de téléphone est déjà utilisé.',
        WEAK_PASSWORD: 'Le mot de passe est trop faible.',
        ACCOUNT_DISABLED: 'Votre compte a été désactivé.',
        UNVERIFIED_EMAIL: 'Veuillez vérifier votre email avant de vous connecter.',
    },
    RIDE: {
        NO_DRIVERS: 'Aucun chauffeur disponible pour le moment.',
        ALREADY_IN_RIDE: 'Vous avez déjà une course en cours.',
        CANNOT_CANCEL: 'Impossible d\'annuler cette course.',
        CANNOT_START: 'Impossible de démarrer cette course.',
        CANNOT_COMPLETE: 'Impossible de terminer cette course.',
    },
    PAYMENT: {
        FAILED: 'Le paiement a échoué. Veuillez réessayer.',
        INSUFFICIENT_FUNDS: 'Solde insuffisant.',
        INVALID_METHOD: 'Méthode de paiement invalide.',
    },
};
