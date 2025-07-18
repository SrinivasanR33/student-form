// utils/jwt.ts

import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Define your payload interface
export interface AuthPayload {
  userId: string;
  phoneNumber: string;
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}
export function getTokenData(token: string|undefined) {
  if (!token) throw new Error('Token missing');
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch (err) {
    throw new Error('Invalid token');
  }
}
export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch (e) {
    return null;
  }
}
