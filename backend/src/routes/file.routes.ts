import { Router } from 'express';
import { 
  FileController, 
  uploadSingle, 
  uploadLimiter,
  ALLOWED_FILE_TYPES
} from '../controllers/file.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';

const router = Router();

// Public routes for getting files (no auth required)
router.get(
  '/files/:key',
  validateRequest({
    params: {
      key: { type: 'string', required: true, min: 1, max: 1024 }
    }
  }),
  FileController.getFile
);

// Protected routes (require authentication)
router.use(authenticate);

// Upload a file with rate limiting and validation
router.post(
  '/files',
  uploadLimiter, // Apply rate limiting
  (req, res, next) => {
    // Handle file size limit errors
    uploadSingle(req, res, (err: any) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ 
            success: false,
            error: 'File too large. Maximum size is 10MB.' 
          });
        }
        if (err.message.includes('Invalid file type')) {
          return res.status(400).json({ 
            success: false,
            error: err.message,
            allowedTypes: Object.keys(ALLOWED_FILE_TYPES)
          });
        }
        return next(err);
      }
      next();
    });
  },
  FileController.uploadFile
);

// Delete a file with validation
router.delete(
  '/files/:key',
  validateRequest({
    params: {
      key: { type: 'string', required: true, min: 1, max: 1024 }
    }
  }),
  FileController.deleteFile
);

export default router;
