"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDriver = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../server");
const types_1 = require("@shared/types");
const validators_1 = require("@shared/validators");
const register = async (req, res) => {
    try {
        // Validate request body
        const validationResult = validators_1.registerValidator.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation error',
                details: validationResult.error.errors
            });
        }
        const { email, password, firstName, lastName, phoneNumber, role } = validationResult.data;
        // Check if email already exists
        const existingEmail = await server_1.prisma.user.findUnique({
            where: { email }
        });
        if (existingEmail) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
        }
        // Check if phone number already exists
        const existingPhone = await server_1.prisma.user.findFirst({
            where: { phoneNumber }
        });
        if (existingPhone) {
            return res.status(400).json({ error: 'Ce numéro de téléphone est déjà utilisé.' });
        }
        // Hash password
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        // Create user transaction
        const result = await server_1.prisma.$transaction(async (prisma) => {
            // Create user
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    phoneNumber,
                    role: role,
                }
            });
            // Create client or driver based on role
            if (role === types_1.UserRole.CLIENT) {
                await prisma.client.create({
                    data: {
                        userId: user.id,
                        wallet: {
                            create: {
                                balance: 0,
                                currency: 'CDF'
                            }
                        }
                    }
                });
            }
            return user;
        });
        // Generate JWT token
        const accessToken = jsonwebtoken_1.default.sign({ id: result.id, email: result.email, role: result.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: result.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' });
        // Save refresh token
        await server_1.prisma.refreshToken.create({
            data: {
                userId: result.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });
        // Return user data and tokens
        res.status(201).json({
            message: 'Inscription réussie',
            user: {
                id: result.id,
                email: result.email,
                firstName: result.firstName,
                lastName: result.lastName,
                phoneNumber: result.phoneNumber,
                role: result.role,
            },
            accessToken,
            refreshToken
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'inscription.' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        // Validate request body
        const validationResult = validators_1.loginValidator.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation error',
                details: validationResult.error.errors
            });
        }
        const { email, password } = validationResult.data;
        // Find user by email
        const user = await server_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }
        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({ error: 'Votre compte a été désactivé.' });
        }
        // Compare passwords
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }
        // Generate JWT token
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' });
        // Save refresh token
        await server_1.prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });
        // Return user data and tokens
        res.status(200).json({
            message: 'Connexion réussie',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profileImageUrl: user.profileImageUrl,
                isVerified: user.isVerified
            },
            accessToken,
            refreshToken
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la connexion.' });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token manquant.' });
        }
        // Find refresh token in database
        const tokenRecord = await server_1.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true }
        });
        if (!tokenRecord) {
            return res.status(401).json({ error: 'Refresh token invalide.' });
        }
        // Check if token is expired
        if (tokenRecord.expiresAt < new Date()) {
            // Delete expired token
            await server_1.prisma.refreshToken.delete({
                where: { id: tokenRecord.id }
            });
            return res.status(401).json({ error: 'Refresh token expiré.' });
        }
        // Check if user is active
        if (!tokenRecord.user.isActive) {
            return res.status(401).json({ error: 'Votre compte a été désactivé.' });
        }
        // Generate new tokens
        const newAccessToken = jsonwebtoken_1.default.sign({ id: tokenRecord.user.id, email: tokenRecord.user.email, role: tokenRecord.user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' });
        const newRefreshToken = jsonwebtoken_1.default.sign({ id: tokenRecord.user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' });
        // Delete old refresh token
        await server_1.prisma.refreshToken.delete({
            where: { id: tokenRecord.id }
        });
        // Save new refresh token
        await server_1.prisma.refreshToken.create({
            data: {
                userId: tokenRecord.user.id,
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });
        // Return new tokens
        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    }
    catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ error: 'Erreur serveur lors du rafraîchissement du token.' });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token manquant.' });
        }
        // Delete refresh token
        await server_1.prisma.refreshToken.deleteMany({
            where: { token: refreshToken }
        });
        res.status(200).json({ message: 'Déconnexion réussie' });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la déconnexion.' });
    }
};
exports.logout = logout;
const registerDriver = async (req, res) => {
    try {
        // Driver registration will be implemented separately
        // It requires additional validation and document uploads
        res.status(501).json({ message: 'Inscription chauffeur non implémentée' });
    }
    catch (error) {
        console.error('Register driver error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'inscription du chauffeur.' });
    }
};
exports.registerDriver = registerDriver;
//# sourceMappingURL=auth.controller.js.map