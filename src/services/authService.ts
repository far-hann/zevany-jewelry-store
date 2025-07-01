import jwt from 'jsonwebtoken';
import { AuthUser } from '../../types/AuthUser'; // Fixed import path

const secretKey = process.env.JWT_SECRET || 'defaultSecret';

export function verifyToken(token: string): AuthUser {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded as AuthUser;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
