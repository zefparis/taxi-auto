// User related types
export var UserRole;
(function (UserRole) {
    UserRole["CLIENT"] = "CLIENT";
    UserRole["DRIVER"] = "DRIVER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["SUPPORT"] = "SUPPORT";
})(UserRole || (UserRole = {}));
// Ride related types
export var RideStatus;
(function (RideStatus) {
    RideStatus["REQUESTED"] = "REQUESTED";
    RideStatus["ACCEPTED"] = "ACCEPTED";
    RideStatus["ARRIVED"] = "ARRIVED";
    RideStatus["IN_PROGRESS"] = "IN_PROGRESS";
    RideStatus["COMPLETED"] = "COMPLETED";
    RideStatus["CANCELLED"] = "CANCELLED";
})(RideStatus || (RideStatus = {}));
// Payment related types
export var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["MOBILE_MONEY"] = "MOBILE_MONEY";
    PaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentMethod["WALLET"] = "WALLET";
    PaymentMethod["CASH"] = "CASH";
})(PaymentMethod || (PaymentMethod = {}));
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (PaymentStatus = {}));
export var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "DEPOSIT";
    TransactionType["WITHDRAWAL"] = "WITHDRAWAL";
    TransactionType["PAYMENT"] = "PAYMENT";
    TransactionType["REFUND"] = "REFUND";
    TransactionType["COMMISSION"] = "COMMISSION";
})(TransactionType || (TransactionType = {}));
export var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["COMPLETED"] = "COMPLETED";
    TransactionStatus["FAILED"] = "FAILED";
})(TransactionStatus || (TransactionStatus = {}));
// Notification related types
export var NotificationType;
(function (NotificationType) {
    NotificationType["RIDE_REQUEST"] = "RIDE_REQUEST";
    NotificationType["RIDE_ACCEPTED"] = "RIDE_ACCEPTED";
    NotificationType["RIDE_CANCELLED"] = "RIDE_CANCELLED";
    NotificationType["RIDE_COMPLETED"] = "RIDE_COMPLETED";
    NotificationType["PAYMENT"] = "PAYMENT";
    NotificationType["SYSTEM"] = "SYSTEM";
    NotificationType["PROMOTION"] = "PROMOTION";
})(NotificationType || (NotificationType = {}));
// Support ticket related types
export var TicketStatus;
(function (TicketStatus) {
    TicketStatus["OPEN"] = "OPEN";
    TicketStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TicketStatus["RESOLVED"] = "RESOLVED";
    TicketStatus["CLOSED"] = "CLOSED";
})(TicketStatus || (TicketStatus = {}));
export var TicketPriority;
(function (TicketPriority) {
    TicketPriority["LOW"] = "LOW";
    TicketPriority["MEDIUM"] = "MEDIUM";
    TicketPriority["HIGH"] = "HIGH";
    TicketPriority["URGENT"] = "URGENT";
})(TicketPriority || (TicketPriority = {}));
export var RespondentType;
(function (RespondentType) {
    RespondentType["USER"] = "USER";
    RespondentType["SUPPORT"] = "SUPPORT";
    RespondentType["AI"] = "AI";
    RespondentType["SYSTEM"] = "SYSTEM";
})(RespondentType || (RespondentType = {}));
// Vehicle related types
export var VehicleType;
(function (VehicleType) {
    VehicleType["STANDARD"] = "STANDARD";
    VehicleType["PREMIUM"] = "PREMIUM";
    VehicleType["SUV"] = "SUV";
    VehicleType["MOTO"] = "MOTO";
})(VehicleType || (VehicleType = {}));
