export const AUTH_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 3,
  REDIRECT_DELAY: 1000,
  TOAST_LIFE: {
    SUCCESS: 2000,
    ERROR: 3000
  }
} as const;

export const DEFAULT_CREDENTIALS = {
  USERNAME: 'admin',
  PASSWORD: 'admin123'
} as const;

export const VALIDATION_MESSAGES = {
  USERNAME_REQUIRED: 'Username is required',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 3 characters',
  INVALID_CREDENTIALS: 'Invalid credentials. Please try again.',
  LOGIN_FAILED: 'Login failed. Please try again.',
  LOGIN_SUCCESS: 'Login successful! Redirecting...'
} as const; 