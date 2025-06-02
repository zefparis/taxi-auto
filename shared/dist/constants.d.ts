export declare const API_ENDPOINTS: {
    AUTH: {
        LOGIN: string;
        REGISTER: string;
        REFRESH: string;
        LOGOUT: string;
        VERIFY_EMAIL: string;
        FORGOT_PASSWORD: string;
        RESET_PASSWORD: string;
    };
    USERS: {
        BASE: string;
        PROFILE: string;
        UPDATE: string;
        CHANGE_PASSWORD: string;
    };
    CLIENTS: {
        BASE: string;
        RIDES: string;
        FAVORITES: string;
        WALLET: string;
    };
    DRIVERS: {
        BASE: string;
        RIDES: string;
        AVAILABILITY: string;
        LOCATION: string;
        WALLET: string;
        DOCUMENTS: string;
    };
    RIDES: {
        BASE: string;
        REQUEST: string;
        ACCEPT: string;
        CANCEL: string;
        START: string;
        COMPLETE: string;
        RATE: string;
    };
    PAYMENTS: {
        BASE: string;
        PROCESS: string;
        VERIFY: string;
        WALLET: string;
    };
    ADMIN: {
        BASE: string;
        USERS: string;
        DRIVERS: string;
        RIDES: string;
        PAYMENTS: string;
        REPORTS: string;
        SETTINGS: string;
    };
    SUPPORT: {
        BASE: string;
        TICKETS: string;
        CHAT: string;
    };
};
export declare const SOCKET_EVENTS: {
    CONNECT: string;
    DISCONNECT: string;
    RIDE_REQUESTED: string;
    RIDE_ACCEPTED: string;
    RIDE_REJECTED: string;
    RIDE_CANCELLED: string;
    RIDE_STARTED: string;
    RIDE_COMPLETED: string;
    DRIVER_ARRIVED: string;
    LOCATION_UPDATE: string;
    LOCATION_SUBSCRIBE: string;
    LOCATION_UNSUBSCRIBE: string;
    CHAT_JOIN: string;
    CHAT_LEAVE: string;
    CHAT_MESSAGE: string;
    CHAT_TYPING: string;
    NOTIFICATION: string;
    DRIVER_AVAILABLE: string;
    DRIVER_UNAVAILABLE: string;
    PAYMENT_PROCESSED: string;
    PAYMENT_FAILED: string;
};
export declare const STORAGE_KEYS: {
    ACCESS_TOKEN: string;
    REFRESH_TOKEN: string;
    USER: string;
    THEME: string;
    LANGUAGE: string;
    LAST_LOCATION: string;
};
export declare const APP_CONSTANTS: {
    DEFAULT_LANGUAGE: string;
    SUPPORTED_LANGUAGES: string[];
    DEFAULT_CURRENCY: string;
    DEFAULT_THEME: string;
    MIN_PASSWORD_LENGTH: number;
    MAX_UPLOAD_SIZE: number;
    RIDE_TIMEOUT: number;
    DRIVER_LOCATION_UPDATE_INTERVAL: number;
    RIDE_STATUSES: {
        REQUESTED: string;
        ACCEPTED: string;
        ARRIVED: string;
        IN_PROGRESS: string;
        COMPLETED: string;
        CANCELLED: string;
    };
    PAYMENT_METHODS: {
        MOBILE_MONEY: string;
        CREDIT_CARD: string;
        WALLET: string;
        CASH: string;
    };
    MOBILE_MONEY_PROVIDERS: {
        UNIPESA: string;
        ORANGE: string;
        AIRTEL: string;
        AFRICELL: string;
    };
};
export declare const ERROR_MESSAGES: {
    GENERIC: string;
    NETWORK: string;
    UNAUTHORIZED: string;
    NOT_FOUND: string;
    VALIDATION: string;
    SERVER: string;
    AUTH: {
        INVALID_CREDENTIALS: string;
        EMAIL_EXISTS: string;
        PHONE_EXISTS: string;
        WEAK_PASSWORD: string;
        ACCOUNT_DISABLED: string;
        UNVERIFIED_EMAIL: string;
    };
    RIDE: {
        NO_DRIVERS: string;
        ALREADY_IN_RIDE: string;
        CANNOT_CANCEL: string;
        CANNOT_START: string;
        CANNOT_COMPLETE: string;
    };
    PAYMENT: {
        FAILED: string;
        INSUFFICIENT_FUNDS: string;
        INVALID_METHOD: string;
    };
};
