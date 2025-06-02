"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.changePassword = exports.updateProfile = exports.getProfile = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const server_1 = require("../server");
const validators_1 = require("@shared/validators");
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }
        const user = await server_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                role: true,
                profileImageUrl: true,
                isVerified: true,
                createdAt: true,
                client: {
                    select: {
                        id: true,
                        favoriteLocations: true,
                        wallet: {
                            select: {
                                id: true,
                                balance: true,
                                currency: true
                            }
                        }
                    }
                },
                driver: {
                    select: {
                        id: true,
                        licenseNumber: true,
                        licenseExpiry: true,
                        vehicleType: true,
                        vehicleMake: true,
                        vehicleModel: true,
                        vehicleYear: true,
                        vehicleColor: true,
                        vehiclePlateNumber: true,
                        isAvailable: true,
                        currentLatitude: true,
                        currentLongitude: true,
                        averageRating: true,
                        wallet: {
                            select: {
                                id: true,
                                balance: true,
                                currency: true
                            }
                        }
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération du profil' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }
        // Validate request body
        const validationResult = validators_1.updateUserValidator.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation error',
                details: validationResult.error.errors
            });
        }
        const { firstName, lastName, phoneNumber, profileImageUrl } = validationResult.data;
        // Check if phone number is already used by another user
        if (phoneNumber) {
            const existingPhone = await server_1.prisma.user.findFirst({
                where: {
                    phoneNumber,
                    id: { not: userId }
                }
            });
            if (existingPhone) {
                return res.status(400).json({ error: 'Ce numéro de téléphone est déjà utilisé' });
            }
        }
        // Update user profile
        const updatedUser = await server_1.prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                phoneNumber,
                profileImageUrl
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                role: true,
                profileImageUrl: true,
                isVerified: true,
                updatedAt: true
            }
        });
        res.status(200).json({
            message: 'Profil mis à jour avec succès',
            user: updatedUser
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du profil' });
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }
        const { currentPassword, newPassword, confirmPassword } = req.body;
        // Validate input
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Les nouveaux mots de passe ne correspondent pas' });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
        }
        // Get user with password
        const user = await server_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                password: true
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        // Verify current password
        const isPasswordValid = await bcrypt_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
        }
        // Hash new password
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(newPassword, salt);
        // Update password
        await server_1.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword
            }
        });
        // Invalidate all refresh tokens for security
        await server_1.prisma.refreshToken.deleteMany({
            where: { userId }
        });
        res.status(200).json({ message: 'Mot de passe modifié avec succès' });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Erreur serveur lors du changement de mot de passe' });
    }
};
exports.changePassword = changePassword;
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }
        // Soft delete by deactivating the account
        await server_1.prisma.user.update({
            where: { id: userId },
            data: {
                isActive: false
            }
        });
        // Invalidate all refresh tokens
        await server_1.prisma.refreshToken.deleteMany({
            where: { userId }
        });
        res.status(200).json({ message: 'Compte désactivé avec succès' });
    }
    catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la désactivation du compte' });
    }
};
exports.deleteAccount = deleteAccount;
//# sourceMappingURL=user.controller.js.map