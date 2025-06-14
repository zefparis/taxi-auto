"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRides = exports.getRideById = exports.cancelRide = exports.completeRide = exports.startRide = exports.driverArrived = exports.acceptRide = exports.requestRide = void 0;
const server_1 = require("../server");
const zod_1 = require("zod");
// Définition locale du validateur
const createRideValidator = zod_1.z.object({
    pickupLocation: zod_1.z.string().min(5),
    dropoffLocation: zod_1.z.string().min(5),
    pickupLatitude: zod_1.z.number(),
    pickupLongitude: zod_1.z.number(),
    dropoffLatitude: zod_1.z.number(),
    dropoffLongitude: zod_1.z.number(),
    estimatedPrice: zod_1.z.number().positive().optional(),
    estimatedDistance: zod_1.z.number().positive().optional(),
    estimatedDuration: zod_1.z.number().positive().optional(),
    rideType: zod_1.z.enum(['STANDARD', 'PREMIUM', 'LUXURY', 'VAN']).optional(),
    paymentMethod: zod_1.z.enum(['CASH', 'CARD', 'WALLET']).optional()
});
// Définition locale des types
var RideStatus;
(function (RideStatus) {
    RideStatus["REQUESTED"] = "REQUESTED";
    RideStatus["PENDING"] = "PENDING";
    RideStatus["ACCEPTED"] = "ACCEPTED";
    RideStatus["ARRIVED"] = "ARRIVED";
    RideStatus["DRIVER_ARRIVED"] = "DRIVER_ARRIVED";
    RideStatus["IN_PROGRESS"] = "IN_PROGRESS";
    RideStatus["COMPLETED"] = "COMPLETED";
    RideStatus["CANCELLED"] = "CANCELLED";
    RideStatus["NO_DRIVERS_AVAILABLE"] = "NO_DRIVERS_AVAILABLE";
})(RideStatus || (RideStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
    PaymentStatus["CANCELLED"] = "CANCELLED";
    PaymentStatus["COMPLETED"] = "COMPLETED";
})(PaymentStatus || (PaymentStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["CLIENT"] = "CLIENT";
    UserRole["DRIVER"] = "DRIVER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
const server_2 = require("../server");
const pricing_service_1 = require("../services/pricing.service");
const matching_service_1 = require("../services/matching.service");
const requestRide = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    const userId = req.user.id;
    try {
        // Validate request body
        const validationResult = createRideValidator.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation error',
                details: validationResult.error.errors
            });
        }
        const { pickupLatitude, pickupLongitude, pickupLocation: pickupAddress, // Map pickupLocation to pickupAddress
        dropoffLatitude: destinationLatitude, // Map dropoffLatitude to destinationLatitude
        dropoffLongitude: destinationLongitude, // Map dropoffLongitude to destinationLongitude
        dropoffLocation: destinationAddress, // Map dropoffLocation to destinationAddress
        paymentMethod } = validationResult.data;
        // Get client ID
        const client = await server_1.prisma.client.findFirst({
            where: { userId }
        });
        if (!client) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }
        // Check if client already has an active ride
        const activeRide = await server_1.prisma.ride.findFirst({
            where: {
                clientId: client.id,
                status: {
                    in: [
                        RideStatus.REQUESTED,
                        RideStatus.ACCEPTED,
                        RideStatus.ARRIVED,
                        RideStatus.IN_PROGRESS
                    ]
                }
            }
        });
        if (activeRide) {
            return res.status(400).json({ error: 'Vous avez déjà une course en cours' });
        }
        // Calculate distance (in km) using Haversine formula
        const R = 6371; // Earth radius in km
        const dLat = (destinationLatitude - pickupLatitude) * Math.PI / 180;
        const dLon = (destinationLongitude - pickupLongitude) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(pickupLatitude * Math.PI / 180) * Math.cos(destinationLatitude * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        // Calculate estimated price
        const estimatedPrice = await (0, pricing_service_1.calculatePrice)(distance);
        // Create ride
        const ride = await server_1.prisma.ride.create({
            data: {
                clientId: client.id,
                status: RideStatus.REQUESTED,
                pickupLatitude,
                pickupLongitude,
                pickupAddress,
                destinationLatitude,
                destinationLongitude,
                destinationAddress,
                estimatedPrice,
                distance,
                paymentMethod,
                paymentStatus: PaymentStatus.PENDING
            }
        });
        // Find nearest drivers
        const nearestDrivers = await (0, matching_service_1.findNearestDrivers)(pickupLatitude, pickupLongitude);
        // Emit ride request to nearest drivers
        if (nearestDrivers.length > 0) {
            nearestDrivers.forEach(driver => {
                server_2.io.to(`driver:${driver.id}`).emit('ride:requested', {
                    rideId: ride.id,
                    pickup: {
                        latitude: pickupLatitude,
                        longitude: pickupLongitude,
                        address: pickupAddress
                    },
                    destination: {
                        latitude: destinationLatitude,
                        longitude: destinationLongitude,
                        address: destinationAddress
                    },
                    distance,
                    estimatedPrice
                });
            });
        }
        else {
            // No drivers available, cancel ride
            await server_1.prisma.ride.update({
                where: { id: ride.id },
                data: {
                    status: RideStatus.CANCELLED,
                    cancelledAt: new Date(),
                    cancelReason: 'Aucun chauffeur disponible'
                }
            });
            return res.status(404).json({ error: 'Aucun chauffeur disponible pour le moment' });
        }
        res.status(201).json({
            message: 'Demande de course créée avec succès',
            ride: {
                id: ride.id,
                status: ride.status,
                pickup: {
                    latitude: ride.pickupLatitude,
                    longitude: ride.pickupLongitude,
                    address: ride.pickupAddress
                },
                destination: {
                    latitude: ride.destinationLatitude,
                    longitude: ride.destinationLongitude,
                    address: ride.destinationAddress
                },
                estimatedPrice: ride.estimatedPrice,
                distance: ride.distance,
                requestedAt: ride.requestedAt
            }
        });
    }
    catch (error) {
        console.error('Request ride error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la demande de course' });
    }
};
exports.requestRide = requestRide;
const acceptRide = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    const userId = req.user.id;
    try {
        // Check if user is a driver - we know req.user is defined at this point
        if (req.user.role !== UserRole.DRIVER) {
            return res.status(403).json({ error: 'Seuls les chauffeurs peuvent accepter des courses' });
        }
        const { rideId } = req.params;
        // Get driver ID
        const driver = await server_1.prisma.driver.findFirst({
            where: { userId }
        });
        if (!driver) {
            return res.status(404).json({ error: 'Chauffeur non trouvé' });
        }
        // Check if driver is available
        if (!driver.isAvailable) {
            return res.status(400).json({ error: 'Vous n\'êtes pas disponible pour accepter une course' });
        }
        // Check if driver already has an active ride
        const activeRide = await server_1.prisma.ride.findFirst({
            where: {
                driverId: driver.id,
                status: {
                    in: [
                        RideStatus.ACCEPTED,
                        RideStatus.ARRIVED,
                        RideStatus.IN_PROGRESS
                    ]
                }
            }
        });
        if (activeRide) {
            return res.status(400).json({ error: 'Vous avez déjà une course en cours' });
        }
        // Get ride
        const ride = await server_1.prisma.ride.findUnique({
            where: { id: rideId },
            include: {
                client: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                phoneNumber: true,
                                profileImageUrl: true
                            }
                        }
                    }
                }
            }
        });
        if (!ride) {
            return res.status(404).json({ error: 'Course non trouvée' });
        }
        // Check if ride is still in REQUESTED status
        if (ride.status !== RideStatus.REQUESTED) {
            return res.status(400).json({ error: 'Cette course n\'est plus disponible' });
        }
        // Update ride
        const updatedRide = await server_1.prisma.ride.update({
            where: { id: rideId },
            data: {
                driverId: driver.id,
                status: RideStatus.ACCEPTED,
                acceptedAt: new Date()
            }
        });
        // Update driver availability
        await server_1.prisma.driver.update({
            where: { id: driver.id },
            data: {
                isAvailable: false
            }
        });
        // Notify client
        server_2.io.to(`client:${ride.clientId}`).emit('ride:accepted', {
            rideId: ride.id,
            driver: {
                id: driver.id,
                user: {
                    firstName: driver.user?.firstName || '',
                    lastName: driver.user?.lastName || '',
                    phoneNumber: driver.user?.phoneNumber || '',
                    profileImageUrl: driver.user?.profileImageUrl
                },
                vehicleMake: driver.vehicleMake,
                vehicleModel: driver.vehicleModel,
                vehicleColor: driver.vehicleColor,
                licensePlate: driver.licensePlate,
                averageRating: driver.averageRating
            },
            acceptedAt: updatedRide.acceptedAt
        });
        res.status(200).json({
            message: 'Course acceptée avec succès',
            ride: {
                id: updatedRide.id,
                status: updatedRide.status,
                client: {
                    id: ride.clientId,
                    firstName: ride.client.user.firstName,
                    lastName: ride.client.user.lastName,
                    phoneNumber: ride.client.user.phoneNumber,
                    profileImageUrl: ride.client.user.profileImageUrl
                },
                pickup: {
                    latitude: ride.pickupLatitude,
                    longitude: ride.pickupLongitude,
                    address: ride.pickupAddress
                },
                destination: {
                    latitude: ride.destinationLatitude,
                    longitude: ride.destinationLongitude,
                    address: ride.destinationAddress
                },
                estimatedPrice: ride.estimatedPrice,
                distance: ride.distance,
                acceptedAt: updatedRide.acceptedAt
            }
        });
    }
    catch (error) {
        console.error('Accept ride error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'acceptation de la course' });
    }
};
exports.acceptRide = acceptRide;
const driverArrived = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    const userId = req.user.id;
    try {
        // User is already authenticated at this point
        // Check if user is a driver
        if (req.user?.role !== UserRole.DRIVER) {
            return res.status(403).json({ error: 'Seuls les chauffeurs peuvent signaler leur arrivée' });
        }
        const { rideId } = req.params;
        // Get driver ID
        const driver = await server_1.prisma.driver.findFirst({
            where: { userId }
        });
        if (!driver) {
            return res.status(404).json({ error: 'Chauffeur non trouvé' });
        }
        // Get ride
        const ride = await server_1.prisma.ride.findUnique({
            where: { id: rideId }
        });
        if (!ride) {
            return res.status(404).json({ error: 'Course non trouvée' });
        }
        // Check if ride belongs to driver
        if (ride.driverId !== driver.id) {
            return res.status(403).json({ error: 'Cette course ne vous appartient pas' });
        }
        // Check if ride is in ACCEPTED status
        if (ride.status !== RideStatus.ACCEPTED) {
            return res.status(400).json({ error: 'Vous ne pouvez pas signaler votre arrivée pour cette course' });
        }
        // Update ride
        const updatedRide = await server_1.prisma.ride.update({
            where: { id: rideId },
            data: {
                status: RideStatus.ARRIVED
            }
        });
        // Notify client
        server_2.io.to(`client:${ride.clientId}`).emit('ride:driver_arrived', {
            rideId: ride.id
        });
        res.status(200).json({
            message: 'Arrivée signalée avec succès',
            ride: {
                id: updatedRide.id,
                status: updatedRide.status
            }
        });
    }
    catch (error) {
        console.error('Driver arrived error:', error);
        res.status(500).json({ error: 'Erreur serveur lors du signalement de l\'arrivée' });
    }
};
exports.driverArrived = driverArrived;
const startRide = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    const userId = req.user.id;
    try {
        if (!userId) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }
        // Check if user is a driver - we know req.user is defined at this point
        if (req.user.role !== UserRole.DRIVER) {
            return res.status(403).json({ error: 'Seuls les chauffeurs peuvent démarrer une course' });
        }
        const { rideId } = req.params;
        // Get driver ID
        const driver = await server_1.prisma.driver.findFirst({
            where: { userId }
        });
        if (!driver) {
            return res.status(404).json({ error: 'Chauffeur non trouvé' });
        }
        // Get ride
        const ride = await server_1.prisma.ride.findUnique({
            where: { id: rideId }
        });
        if (!ride) {
            return res.status(404).json({ error: 'Course non trouvée' });
        }
        // Check if ride belongs to driver
        if (ride.driverId !== driver.id) {
            return res.status(403).json({ error: 'Cette course ne vous appartient pas' });
        }
        // Check if ride is in ARRIVED status
        if (ride.status !== RideStatus.ARRIVED) {
            return res.status(400).json({ error: 'Vous ne pouvez pas démarrer cette course' });
        }
        // Update ride
        const updatedRide = await server_1.prisma.ride.update({
            where: { id: rideId },
            data: {
                status: RideStatus.IN_PROGRESS,
                startedAt: new Date()
            }
        });
        // Notify client
        server_2.io.to(`client:${ride.clientId}`).emit('ride:started', {
            rideId: ride.id,
            startedAt: updatedRide.startedAt
        });
        res.status(200).json({
            message: 'Course démarrée avec succès',
            ride: {
                id: updatedRide.id,
                status: updatedRide.status,
                startedAt: updatedRide.startedAt
            }
        });
    }
    catch (error) {
        console.error('Start ride error:', error);
        res.status(500).json({ error: 'Erreur serveur lors du démarrage de la course' });
    }
};
exports.startRide = startRide;
const completeRide = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    const userId = req.user.id;
    try {
        if (!userId) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }
        // Check if user is a driver - we know req.user is defined at this point
        if (req.user.role !== UserRole.DRIVER) {
            return res.status(403).json({ error: 'Seuls les chauffeurs peuvent terminer une course' });
        }
        const { rideId } = req.params;
        // Get driver ID
        const driver = await server_1.prisma.driver.findFirst({
            where: { userId }
        });
        if (!driver) {
            return res.status(404).json({ error: 'Chauffeur non trouvé' });
        }
        // Get ride
        const ride = await server_1.prisma.ride.findUnique({
            where: { id: rideId }
        });
        if (!ride) {
            return res.status(404).json({ error: 'Course non trouvée' });
        }
        // Check if ride belongs to driver
        if (ride.driverId !== driver.id) {
            return res.status(403).json({ error: 'Cette course ne vous appartient pas' });
        }
        // Check if ride is in IN_PROGRESS status
        if (ride.status !== RideStatus.IN_PROGRESS) {
            return res.status(400).json({ error: 'Vous ne pouvez pas terminer cette course' });
        }
        const completedAt = new Date();
        // Calculate ride duration in minutes
        const startedAt = ride.startedAt;
        const durationInMinutes = Math.round((completedAt.getTime() - startedAt.getTime()) / 60000);
        // Calculate final price (could be adjusted based on actual route, time, etc.)
        const finalPrice = ride.estimatedPrice;
        // Update ride
        const updatedRide = await server_1.prisma.ride.update({
            where: { id: rideId },
            data: {
                status: RideStatus.COMPLETED,
                completedAt,
                duration: durationInMinutes,
                finalPrice
            }
        });
        // Update driver availability
        await server_1.prisma.driver.update({
            where: { id: driver.id },
            data: {
                isAvailable: true
            }
        });
        // Process payment if method is WALLET
        if (ride.paymentMethod === 'WALLET') {
            // Payment processing would be implemented here
            // For now, just mark as completed
            await server_1.prisma.ride.update({
                where: { id: rideId },
                data: {
                    paymentStatus: PaymentStatus.COMPLETED
                }
            });
        }
        // Notify client
        server_2.io.to(`client:${ride.clientId}`).emit('ride:completed', {
            rideId: ride.id,
            completedAt: updatedRide.completedAt,
            duration: updatedRide.duration,
            finalPrice: updatedRide.finalPrice
        });
        res.status(200).json({
            message: 'Course terminée avec succès',
            ride: {
                id: updatedRide.id,
                status: updatedRide.status,
                completedAt: updatedRide.completedAt,
                duration: updatedRide.duration,
                finalPrice: updatedRide.finalPrice
            }
        });
    }
    catch (error) {
        console.error('Complete ride error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la finalisation de la course' });
    }
};
exports.completeRide = completeRide;
const cancelRide = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    const userId = req.user.id;
    try {
        if (!userId) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }
        const { rideId } = req.params;
        const { reason } = req.body;
        // Get user role specific ID (client or driver)
        let clientId = null;
        let driverId = null;
        if (req.user?.role === UserRole.CLIENT) {
            const client = await server_1.prisma.client.findFirst({
                where: { userId }
            });
            if (!client) {
                return res.status(404).json({ error: 'Client non trouvé' });
            }
            clientId = client.id;
        }
        else if (req.user?.role === UserRole.DRIVER) {
            const driver = await server_1.prisma.driver.findFirst({
                where: { userId }
            });
            if (!driver) {
                return res.status(404).json({ error: 'Chauffeur non trouvé' });
            }
            driverId = driver.id;
        }
        // Get ride
        const ride = await server_1.prisma.ride.findUnique({
            where: { id: rideId }
        });
        if (!ride) {
            return res.status(404).json({ error: 'Course non trouvée' });
        }
        // Check if ride belongs to user
        if ((req.user?.role === UserRole.CLIENT && ride.clientId !== clientId) ||
            (req.user?.role === UserRole.DRIVER && ride.driverId !== driverId)) {
            return res.status(403).json({ error: 'Cette course ne vous appartient pas' });
        }
        // Check if ride can be cancelled
        if (ride.status === RideStatus.COMPLETED ||
            ride.status === RideStatus.CANCELLED) {
            return res.status(400).json({ error: 'Cette course ne peut pas être annulée' });
        }
        // Update ride
        const updatedRide = await server_1.prisma.ride.update({
            where: { id: rideId },
            data: {
                status: RideStatus.CANCELLED,
                cancelledAt: new Date(),
                cancelReason: reason || 'Annulée par l\'utilisateur'
            }
        });
        // If driver cancelled, update availability
        if (req.user?.role === UserRole.DRIVER && ride.driverId) {
            await server_1.prisma.driver.update({
                where: { id: ride.driverId },
                data: {
                    isAvailable: true
                }
            });
        }
        // Notify other party
        if (req.user?.role === UserRole.CLIENT) {
            if (ride.driverId) {
                server_2.io.to(`driver:${ride.driverId}`).emit('ride:cancelled', {
                    rideId: ride.id,
                    cancelledBy: 'CLIENT',
                    reason: updatedRide.cancelReason
                });
            }
        }
        else {
            server_2.io.to(`client:${ride.clientId}`).emit('ride:cancelled', {
                rideId: ride.id,
                cancelledBy: 'DRIVER',
                reason: updatedRide.cancelReason
            });
        }
        res.status(200).json({
            message: 'Course annulée avec succès',
            ride: {
                id: updatedRide.id,
                status: updatedRide.status,
                cancelledAt: updatedRide.cancelledAt,
                cancelReason: updatedRide.cancelReason
            }
        });
    }
    catch (error) {
        console.error('Cancel ride error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'annulation de la course' });
    }
};
exports.cancelRide = cancelRide;
const getRideById = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    const userId = req.user.id;
    try {
        if (!userId) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }
        const { rideId } = req.params;
        // Get user role specific ID (client or driver)
        let clientId = null;
        let driverId = null;
        if (req.user?.role === UserRole.CLIENT) {
            const client = await server_1.prisma.client.findFirst({
                where: { userId }
            });
            if (!client) {
                return res.status(404).json({ error: 'Client non trouvé' });
            }
            clientId = client.id;
        }
        else if (req.user?.role === UserRole.DRIVER) {
            const driver = await server_1.prisma.driver.findFirst({
                where: { userId }
            });
            if (!driver) {
                return res.status(404).json({ error: 'Chauffeur non trouvé' });
            }
            driverId = driver.id;
        }
        // Get ride with related data
        const ride = await server_1.prisma.ride.findUnique({
            where: { id: rideId },
            include: {
                client: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                phoneNumber: true,
                                profileImageUrl: true
                            }
                        }
                    }
                },
                driver: req.user?.role === UserRole.CLIENT || req.user?.role === UserRole.ADMIN ? {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                phoneNumber: true,
                                profileImageUrl: true
                            }
                        }
                    }
                } : false,
                rating: true,
                messages: {
                    orderBy: {
                        timestamp: 'asc'
                    }
                }
            }
        });
        if (!ride) {
            return res.status(404).json({ error: 'Course non trouvée' });
        }
        // Check if user is authorized to view this ride
        if (!req.user) {
            return res.status(401).json({ error: 'Non autorisé' });
        }
        const isAuthorized = ((req.user.role === UserRole.CLIENT && ride.clientId === clientId) ||
            (req.user.role === UserRole.DRIVER && ride.driverId === driverId) ||
            req.user.role === UserRole.ADMIN);
        if (!isAuthorized) {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à voir cette course' });
        }
        res.status(200).json({ ride });
    }
    catch (error) {
        console.error('Get ride error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de la course' });
    }
};
exports.getRideById = getRideById;
const getUserRides = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    const userId = req.user.id;
    try {
        if (!userId) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }
        const { status, limit = 10, offset = 0 } = req.query;
        // Get user role specific ID (client or driver)
        let clientId = null;
        let driverId = null;
        if (req.user?.role === UserRole.CLIENT) {
            const client = await server_1.prisma.client.findFirst({
                where: { userId }
            });
            if (!client) {
                return res.status(404).json({ error: 'Client non trouvé' });
            }
            clientId = client.id;
        }
        else if (req.user?.role === UserRole.DRIVER) {
            const driver = await server_1.prisma.driver.findFirst({
                where: { userId }
            });
            if (!driver) {
                return res.status(404).json({ error: 'Chauffeur non trouvé' });
            }
            driverId = driver.id;
        }
        // Build query
        const query = {};
        if (req.user?.role === UserRole.CLIENT) {
            query.clientId = clientId;
        }
        else if (req.user?.role === UserRole.DRIVER) {
            query.driverId = driverId;
        }
        if (status) {
            query.status = status;
        }
        // Get rides
        const rides = await server_1.prisma.ride.findMany({
            where: query,
            include: {
                client: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profileImageUrl: true
                            }
                        }
                    }
                },
                driver: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profileImageUrl: true
                            }
                        }
                    }
                },
                rating: true
            },
            orderBy: {
                requestedAt: 'desc'
            },
            skip: Number(offset),
            take: Number(limit)
        });
        // Get total count
        const totalCount = await server_1.prisma.ride.count({
            where: query
        });
        res.status(200).json({
            rides,
            pagination: {
                total: totalCount,
                limit: Number(limit),
                offset: Number(offset)
            }
        });
    }
    catch (error) {
        console.error('Get user rides error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des courses' });
    }
};
exports.getUserRides = getUserRides;
//# sourceMappingURL=ride.controller.js.map