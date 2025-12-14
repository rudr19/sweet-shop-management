import { validateRegistration, validateLogin } from '../validation';

describe('Validation Utils', () => {
  describe('validateRegistration', () => {
    it('should return error for missing email', () => {
      const error = validateRegistration('', 'password123');
      expect(error).toBe('Email is required');
    });

    it('should return error for invalid email format', () => {
      const error = validateRegistration('invalid-email', 'password123');
      expect(error).toBe('Invalid email format');
    });

    it('should return error for missing password', () => {
      const error = validateRegistration('test@example.com', '');
      expect(error).toBe('Password is required');
    });

    it('should return error for short password', () => {
      const error = validateRegistration('test@example.com', '12345');
      expect(error).toBe('Password must be at least 6 characters long');
    });

    it('should return null for valid inputs', () => {
      const error = validateRegistration('test@example.com', 'password123');
      expect(error).toBeNull();
    });
  });

  describe('validateLogin', () => {
    it('should return error for missing email', () => {
      const error = validateLogin('', 'password123');
      expect(error).toBe('Email is required');
    });

    it('should return error for missing password', () => {
      const error = validateLogin('test@example.com', '');
      expect(error).toBe('Password is required');
    });

    it('should return null for valid inputs', () => {
      const error = validateLogin('test@example.com', 'password123');
      expect(error).toBeNull();
    });
  });
});
