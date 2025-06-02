"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rideController = __importStar(require("../controllers/ride.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const types_1 = require("@shared/types");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/rides/request:
 *   post:
 *     summary: Request a new ride
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupLatitude
 *               - pickupLongitude
 *               - pickupAddress
 *               - destinationLatitude
 *               - destinationLongitude
 *               - destinationAddress
 *               - paymentMethod
 *             properties:
 *               pickupLatitude:
 *                 type: number
 *                 format: float
 *               pickupLongitude:
 *                 type: number
 *                 format: float
 *               pickupAddress:
 *                 type: string
 *               destinationLatitude:
 *                 type: number
 *                 format: float
 *               destinationLongitude:
 *                 type: number
 *                 format: float
 *               destinationAddress:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [CASH, WALLET, MOBILE_MONEY]
 *     responses:
 *       201:
 *         description: Ride requested successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No drivers available
 *       500:
 *         description: Server error
 */
router.post('/request', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(types_1.UserRole.CLIENT), rideController.requestRide);
/**
 * @swagger
 * /api/rides/{rideId}/accept:
 *   post:
 *     summary: Accept a ride request (driver only)
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride accepted successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Ride not found
 *       500:
 *         description: Server error
 */
router.post('/:rideId/accept', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(types_1.UserRole.DRIVER), rideController.acceptRide);
/**
 * @swagger
 * /api/rides/{rideId}/arrived:
 *   post:
 *     summary: Driver arrived at pickup location (driver only)
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arrival marked successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Ride not found
 *       500:
 *         description: Server error
 */
router.post('/:rideId/arrived', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(types_1.UserRole.DRIVER), rideController.driverArrived);
/**
 * @swagger
 * /api/rides/{rideId}/start:
 *   post:
 *     summary: Start a ride (driver only)
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride started successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Ride not found
 *       500:
 *         description: Server error
 */
router.post('/:rideId/start', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(types_1.UserRole.DRIVER), rideController.startRide);
/**
 * @swagger
 * /api/rides/{rideId}/complete:
 *   post:
 *     summary: Complete a ride (driver only)
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride completed successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Ride not found
 *       500:
 *         description: Server error
 */
router.post('/:rideId/complete', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(types_1.UserRole.DRIVER), rideController.completeRide);
/**
 * @swagger
 * /api/rides/{rideId}/cancel:
 *   post:
 *     summary: Cancel a ride (both client and driver)
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ride cancelled successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Ride not found
 *       500:
 *         description: Server error
 */
router.post('/:rideId/cancel', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(types_1.UserRole.CLIENT, types_1.UserRole.DRIVER), rideController.cancelRide);
/**
 * @swagger
 * /api/rides/{rideId}:
 *   get:
 *     summary: Get ride details by ID
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Ride not found
 *       500:
 *         description: Server error
 */
router.get('/:rideId', auth_middleware_1.authenticate, rideController.getRideById);
/**
 * @swagger
 * /api/rides:
 *   get:
 *     summary: Get user rides (filtered by role)
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [REQUESTED, ACCEPTED, ARRIVED, IN_PROGRESS, COMPLETED, CANCELLED]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Rides retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', auth_middleware_1.authenticate, rideController.getUserRides);
exports.default = router;
//# sourceMappingURL=ride.routes.js.map