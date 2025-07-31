import { LoginCredentials } from '@/types/auth';
import { AUTH_CONSTANTS, VALIDATION_MESSAGES } from '@/constants/auth';

export interface ValidationError {
  [key: string]: string;
}

export class ValidationUtils {
  static validateLoginCredentials(credentials: LoginCredentials): ValidationError {
    const errors: ValidationError = {};

    if (!credentials.username.trim()) {
      errors.username = VALIDATION_MESSAGES.USERNAME_REQUIRED;
    }

    if (!credentials.password.trim()) {
      errors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
    } else if (credentials.password.length < AUTH_CONSTANTS.MIN_PASSWORD_LENGTH) {
      errors.password = VALIDATION_MESSAGES.PASSWORD_TOO_SHORT;
    }

    return errors;
  }

  static hasErrors(errors: ValidationError): boolean {
    return Object.keys(errors).length > 0;
  }

  static getInputClassName(field: string, errors: ValidationError): string {
    const baseClass = 'w-full';
    return errors[field] ? `${baseClass} p-invalid` : baseClass;
  }
} 