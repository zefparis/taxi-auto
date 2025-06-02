"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleType = exports.RespondentType = exports.TicketPriority = exports.TicketStatus = exports.NotificationType = exports.TransactionStatus = exports.TransactionType = exports.PaymentStatus = exports.PaymentMethod = exports.RideStatus = exports.UserRole = void 0;
// User related types
var UserRole;
(function (UserRole) {
    UserRole["CLIENT"] = "CLIENT";
    UserRole["DRIVER"] = "DRIVER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["SUPPORT"] = "SUPPORT";
})(UserRole || (exports.UserRole = UserRole = {}));
// Ride related types
var RideStatus;
(function (RideStatus) {
    RideStatus["REQUESTED"] = "REQUESTED";
    RideStatus["ACCEPTED"] = "ACCEPTED";
    RideStatus["ARRIVED"] = "ARRIVED";
    RideStatus["IN_PROGRESS"] = "IN_PROGRESS";
    RideStatus["COMPLETED"] = "COMPLETED";
    RideStatus["CANCELLED"] = "CANCELLED";
})(RideStatus || (exports.RideStatus = RideStatus = {}));
// Payment related types
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["MOBILE_MONEY"] = "MOBILE_MONEY";
    PaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentMethod["WALLET"] = "WALLET";
    PaymentMethod["CASH"] = "CASH";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "DEPOSIT";
    TransactionType["WITHDRAWAL"] = "WITHDRAWAL";
    TransactionType["PAYMENT"] = "PAYMENT";
    TransactionType["REFUND"] = "REFUND";
    TransactionType["COMMISSION"] = "COMMISSION";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["COMPLETED"] = "COMPLETED";
    TransactionStatus["FAILED"] = "FAILED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
// Notification related types
var NotificationType;
(function (NotificationType) {
    NotificationType["RIDE_REQUEST"] = "RIDE_REQUEST";
    NotificationType["RIDE_ACCEPTED"] = "RIDE_ACCEPTED";
    NotificationType["RIDE_CANCELLED"] = "RIDE_CANCELLED";
    NotificationType["RIDE_COMPLETED"] = "RIDE_COMPLETED";
    NotificationType["PAYMENT"] = "PAYMENT";
    NotificationType["SYSTEM"] = "SYSTEM";
    NotificationType["PROMOTION"] = "PROMOTION";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
// Support ticket related types
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["OPEN"] = "OPEN";
    TicketStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TicketStatus["RESOLVED"] = "RESOLVED";
    TicketStatus["CLOSED"] = "CLOSED";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var TicketPriority;
(function (TicketPriority) {
    TicketPriority["LOW"] = "LOW";
    TicketPriority["MEDIUM"] = "MEDIUM";
    TicketPriority["HIGH"] = "HIGH";
    TicketPriority["URGENT"] = "URGENT";
})(TicketPriority || (exports.TicketPriority = TicketPriority = {}));
var RespondentType;
(function (RespondentType) {
    RespondentType["USER"] = "USER";
    RespondentType["SUPPORT"] = "SUPPORT";
    RespondentType["AI"] = "AI";
    RespondentType["SYSTEM"] = "SYSTEM";
})(RespondentType || (exports.RespondentType = RespondentType = {}));
// Vehicle related types
var VehicleType;
(function (VehicleType) {
    VehicleType["STANDARD"] = "STANDARD";
    VehicleType["PREMIUM"] = "PREMIUM";
    VehicleType["SUV"] = "SUV";
    VehicleType["MOTO"] = "MOTO";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
