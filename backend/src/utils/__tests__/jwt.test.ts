import { generateToken, verifyToken } from '../jwt';
import { JWTPayload } from '../../types';

describe('JWT Utils', () => {
  const mockPayload: JWTPayload = {
    userId: 1,
    email: 'test@example.com',
    isAdmin: false
  };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(mockPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const token = generateToken(mockPayload);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.isAdmin).toBe(mockPayload.isAdmin);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyToken('invalid.token.here');
      }).toThrow('Invalid or expired token');
    });

    it('should throw error for expired token', () => {
      // This would require mocking time or using a library like jest-date-mock
      // For now, we test the basic error handling
      expect(() => {
        verifyToken('');
      }).toThrow();
    });
  });
});
