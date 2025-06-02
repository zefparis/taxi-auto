import { User, UserRole } from '@shared/types';

declare global {
  namespace Express {
    // Extend the Express User type with our User type
    interface User extends Omit<User, 'role'> {
      role: UserRole;
    }

    // Extend the Express Request type to include our user
    interface Request {
      user?: User;
    }
  }
}

// Export the types for use in other files
export {};
