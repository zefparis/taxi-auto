import { Request, Response } from 'express';
import { s3Service } from '../services/s3.service';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';

// Define allowed file types and their MIME types
export const ALLOWED_FILE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
  'image/webp': 'webp',
} as const;

type AllowedMimeType = keyof typeof ALLOWED_FILE_TYPES;

// Validation schema for file metadata
const fileMetadataSchema = z.object({
  userId: z.string().uuid().optional(),
  rideId: z.string().uuid().optional(),
  description: z.string().max(500).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

// Configure multer for memory storage with enhanced options
const storage = multer.memoryStorage();

export const uploadSingle = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (!(file.mimetype in ALLOWED_FILE_TYPES)) {
      return cb(new Error(`Invalid file type. Allowed types: ${Object.keys(ALLOWED_FILE_TYPES).join(', ')}`));
    }
    cb(null, true);
  },
}).single('file');

// Rate limiting for file uploads (100 requests per 15 minutes per IP)
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 file uploads per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many uploads from this IP, please try again after 15 minutes',
});

export class FileController {
  static async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Validate file type
      if (!(req.file.mimetype in ALLOWED_FILE_TYPES)) {
        return res.status(400).json({ 
          error: 'Invalid file type', 
          allowedTypes: Object.keys(ALLOWED_FILE_TYPES) 
        });
      }

      // Validate file size (should already be handled by multer, but double-checking)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (req.file.size > maxSize) {
        return res.status(400).json({ 
          error: 'File too large', 
          maxSize: `${maxSize / (1024 * 1024)}MB` 
        });
      }

      // Parse and validate metadata
      let metadata = {};
      if (req.body.metadata) {
        try {
          metadata = fileMetadataSchema.parse(JSON.parse(req.body.metadata));
        } catch (error) {
          return res.status(400).json({ error: 'Invalid metadata format' });
        }
      }

      // Generate a unique filename with proper extension
      const fileExtension = ALLOWED_FILE_TYPES[req.file.mimetype as AllowedMimeType];
      const fileName = `${uuidv4()}.${fileExtension}`;
      
      // Add user ID to metadata if available
      if (req.user?.id) {
        metadata = { ...metadata, userId: req.user.id };
      }
      
      // Upload to S3 with metadata
      const key = await s3Service.uploadFile(
        req.file, 
        fileName,
        {
          ...metadata,
          originalName: req.file.originalname,
          uploadedAt: new Date().toISOString(),
        }
      );
      
      // Generate a signed URL for the uploaded file (valid for 1 hour)
      const url = await s3Service.getSignedUrl(key);
      
      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          key,
          url,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          metadata,
          expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
        }
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ 
        error: 'Error uploading file',
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  static async getFile(req: Request, res: Response) {
    try {
      const { key } = req.params;
      if (!key) {
        return res.status(400).json({ error: 'File key is required' });
      }

      // Generate a signed URL (valid for 15 minutes)
      const url = await s3Service.getSignedUrl(key, 900);
      
      // Redirect to the signed URL
      res.redirect(url);
    } catch (error) {
      console.error('Error getting file:', error);
      res.status(500).json({ 
        error: 'Error retrieving file',
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  static async deleteFile(req: Request, res: Response) {
    try {
      const { key } = req.params;
      if (!key) {
        return res.status(400).json({ error: 'File key is required' });
      }

      await s3Service.deleteFile(key);
      
      res.status(200).json({ 
        message: 'File deleted successfully',
        key 
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ 
        error: 'Error deleting file',
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
}
