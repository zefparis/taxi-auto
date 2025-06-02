import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../server';
import { z } from 'zod';

// Define UserRole enum locally to avoid import issues
enum UserRole {
  USER = 'USER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN'
}

// Define validation schemas
const registerValidator = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  firstName: z.string().min(2, 'Le prénom est requis'),
  lastName: z.string().min(2, 'Le nom est requis'),
  phoneNumber: z.string().min(10, 'Numéro de téléphone invalide'),
  role: z.enum([UserRole.USER, UserRole.DRIVER, UserRole.ADMIN])
});

const loginValidator = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis')
});

export const register = async (req: any, res: any) => {
  try {
    // Validate request body
    const validationResult = registerValidator.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: validationResult.error.errors 
      });
    }
    
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phoneNumber, 
      role 
    } = validationResult.data;
    
    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingEmail) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }
    
    // Check if phone number already exists
    const existingPhone = await prisma.user.findFirst({
      where: { phoneNumber }
    });
    
    if (existingPhone) {
      return res.status(400).json({ error: 'Ce numéro de téléphone est déjà utilisé.' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(String(password), salt);
    
    // Create user with transaction
    const result = await prisma.$transaction(async (tx: any) => {
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
      } else if (role === 'DRIVER') {
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
    const accessToken = jwt.sign(
      { id: result.id, email: result.email, role: result.role },
      process.env.JWT_SECRET as jwt.Secret,
      { 
        expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
        algorithm: 'HS256' 
      } as jwt.SignOptions
    );
    
    const refreshToken = jwt.sign(
      { id: result.id },
      process.env.JWT_SECRET as jwt.Secret,
      { 
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
        algorithm: 'HS256' 
      } as jwt.SignOptions
    );
    
    try {
      // Delete old refresh token if it exists
      await prisma.refreshToken.deleteMany({
        where: { userId: result.id }
      });
      
      // Save new refresh token
      await prisma.refreshToken.create({
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
    } catch (error) {
      console.error('Error during register:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription.' });
  }
};

export const login = async (req: any, res: any) => {
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
    const user = await prisma.user.findUnique({
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
    const isMatch = await bcrypt.compare(String(password), user.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
    
    // Generate JWT token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as jwt.Secret,
      { 
        expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
        algorithm: 'HS256' 
      } as jwt.SignOptions
    );
    
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as jwt.Secret,
      { 
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
        algorithm: 'HS256' 
      } as jwt.SignOptions
    );
    
    try {
      // Delete old refresh token if it exists
      await prisma.refreshToken.deleteMany({
        where: { userId: user.id }
      });
      
      // Save new refresh token
      await prisma.refreshToken.create({
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
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion.' });
  }
};

export const refreshToken = async (req: any, res: any) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is required' });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as jwt.Secret) as JwtPayload;
    
    if (!decoded.id) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    const userId = decoded.id;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate new tokens
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as jwt.Secret,
      { 
        expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
        algorithm: 'HS256' 
      } as jwt.SignOptions
    );
    
    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as jwt.Secret,
      { 
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
        algorithm: 'HS256' 
      } as jwt.SignOptions
    );
    
    try {
      // Delete old refresh token if it exists
      await prisma.refreshToken.deleteMany({
        where: { userId: user.id }
      });
      
      // Save new refresh token
      await prisma.refreshToken.create({
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
    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Erreur serveur lors du rafraîchissement du token.' });
  }
};

export const logout = async (req: any, res: any) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token manquant.' });
    }
    
    // Delete refresh token
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    });
    
    res.status(200).json({ message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la déconnexion.' });
  }
};

export const registerDriver = async (req: any, res: any) => {
  try {
    // Driver registration will be implemented separately
    // It requires additional validation and document uploads
    res.status(501).json({ message: 'Inscription chauffeur non implémentée' });
  } catch (error) {
    console.error('Register driver error:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription du chauffeur.' });
  }
};
