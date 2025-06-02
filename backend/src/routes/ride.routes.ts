import express from 'express';
import * as rideController from '../controllers/ride.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@shared/types';

const router = express.Router();

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
router.post('/request', authenticate, authorize(UserRole.CLIENT), rideController.requestRide);

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
router.post('/:rideId/accept', authenticate, authorize(UserRole.DRIVER), rideController.acceptRide);

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
router.post('/:rideId/arrived', authenticate, authorize(UserRole.DRIVER), rideController.driverArrived);

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
router.post('/:rideId/start', authenticate, authorize(UserRole.DRIVER), rideController.startRide);

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
router.post('/:rideId/complete', authenticate, authorize(UserRole.DRIVER), rideController.completeRide);

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
router.post('/:rideId/cancel', authenticate, authorize(UserRole.CLIENT, UserRole.DRIVER), rideController.cancelRide);

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
router.get('/:rideId', authenticate, rideController.getRideById);

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
router.get('/', authenticate, rideController.getUserRides);

export default router;
