import 'express-serve-static-core';
import 'express';

// Extend Express Request interface to include authenticated user information

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      roles: string[];
    }
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};