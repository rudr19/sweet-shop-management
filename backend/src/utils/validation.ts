export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateRegistration = (email: string, password: string): string | null => {
  if (!email || !password) {
    return 'Email and password are required';
  }

  if (!isValidEmail(email)) {
    return 'Invalid email format';
  }

  if (!isValidPassword(password)) {
    return 'Password must be at least 6 characters long';
  }

  return null;
};

export const validateLogin = (email: string, password: string): string | null => {
  if (!email || !password) {
    return 'Email and password are required';
  }

  return null;
};
