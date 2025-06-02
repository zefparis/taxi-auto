"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDriver = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../server");
const zod_1 = require("zod");
// Define UserRole enum locally to avoid import issues
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["DRIVER"] = "DRIVER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
// Define validation schemas
const registerValidator = zod_1.z.object({
    email: zod_1.z.string().email('Email invalide'),
    password: zod_1.z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    firstName: zod_1.z.string().min(2, 'Le prénom est requis'),
    lastName: zod_1.z.string().min(2, 'Le nom est requis'),
    phoneNumber: zod_1.z.string().min(10, 'Numéro de téléphone invalide'),
    role: zod_1.z.enum([UserRole.USER, UserRole.DRIVER, UserRole.ADMIN])
});
const loginValidator = zod_1.z.object({
    email: zod_1.z.string().email('Email invalide'),
    password: zod_1.z.string().min(1, 'Le mot de passe est requis')
});
const register = async (req, res) => {
    try {
        // Validate request body
        const validationResult = registerValidator.safeParse(req.body);
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
        const hashedPassword = await bcrypt_1.default.hash(String(password), salt);
        // Create user with transaction
        const result = await server_1.prisma.$transaction(async (tx) => {
            // Create user
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    phoneNumber,
                    role,
                },
            });
            // Create client or driver based on role
            if (role === 'USER') {
                await tx.client.create({
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
            else if (role === 'DRIVER') {
                await tx.driverProfile.create({
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
        // Generate JWT tokens
        const accessToken = jsonwebtoken_1.default.sign({ id: result.id, email: result.email, role: result.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
            algorithm: 'HS256'
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: result.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
            algorithm: 'HS256'
        });
        try {
            // Delete old refresh token if it exists
            await server_1.prisma.refreshToken.deleteMany({
                where: { userId: result.id }
            });
            // Save new refresh token
            await server_1.prisma.refreshToken.create({
                data: {
                    token: refreshToken,
                    userId: result.id,
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
            console.error('Error during register:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
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
        const validationResult = loginValidator.safeParse(req.body);
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
        const isMatch = await bcrypt_1.default.compare(String(password), user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }
        // Generate JWT token
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
            algorithm: 'HS256'
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
            algorithm: 'HS256'
        });
        try {
            // Delete old refresh token if it exists
            await server_1.prisma.refreshToken.deleteMany({
                where: { userId: user.id }
            });
            // Save new refresh token
            await server_1.prisma.refreshToken.create({
                data: {
                    token: refreshToken,
                    userId: user.id,
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
                    profileImageUrl: user.profileImageUrl || null
                },
                accessToken,
                refreshToken
            });
        }
        catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la connexion.' });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token is required' });
        }
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
        if (!decoded.id) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }
        const userId = decoded.id;
        // Find user
        const user = await server_1.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Generate new tokens
        const newAccessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
            algorithm: 'HS256'
        });
        const newRefreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
            algorithm: 'HS256'
        });
        try {
            // Delete old refresh token if it exists
            await server_1.prisma.refreshToken.deleteMany({
                where: { userId: user.id }
            });
            // Save new refresh token
            await server_1.prisma.refreshToken.create({
                data: {
                    token: newRefreshToken,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
                }
            });
            // Set refresh token in HTTP-only cookie
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            // Return new access token
            res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            });
        }
        catch (error) {
            console.error('Error refreshing token:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
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