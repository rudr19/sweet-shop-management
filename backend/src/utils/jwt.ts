import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET: string = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '24h';

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
