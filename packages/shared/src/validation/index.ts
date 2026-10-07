// ============================================================
// Fixli Shared Validation Schemas
// Used for consistent validation across API and mobile
// ============================================================

// Simple validation utilities (no external deps for maximum portability)

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_MIN_LENGTH = 6;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;
export const DESCRIPTION_MIN_LENGTH = 10;
export const DESCRIPTION_MAX_LENGTH = 2000;

export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): ValidationError | null {
  if (!email || !EMAIL_REGEX.test(email)) {
    return { field: 'email', message: 'Please enter a valid email address' };
  }
  return null;
}

export function validatePassword(password: string): ValidationError | null {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return { field: 'password', message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
  }
  return null;
}

export function validateName(name: string): ValidationError | null {
  if (!name || name.length < NAME_MIN_LENGTH) {
    return { field: 'name', message: `Name must be at least ${NAME_MIN_LENGTH} characters` };
  }
  if (name.length > NAME_MAX_LENGTH) {
    return { field: 'name', message: `Name must be at most ${NAME_MAX_LENGTH} characters` };
  }
  return null;
}

export function validateDescription(description: string): ValidationError | null {
  if (!description || description.length < DESCRIPTION_MIN_LENGTH) {
    return { field: 'description', message: `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters` };
  }
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return { field: 'description', message: `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters` };
  }
  return null;
}

export function validateSignup(data: {
  name: string;
  email: string;
  password: string;
  type: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];
  const nameErr = validateName(data.name);
  if (nameErr) errors.push(nameErr);
  const emailErr = validateEmail(data.email);
  if (emailErr) errors.push(emailErr);
  const passwordErr = validatePassword(data.password);
  if (passwordErr) errors.push(passwordErr);
  if (!data.type || !['customer', 'worker'].includes(data.type)) {
    errors.push({ field: 'type', message: 'Type must be either customer or worker' });
  }
  return errors;
}

export function validateLogin(data: { email: string; password: string }): ValidationError[] {
  const errors: ValidationError[] = [];
  const emailErr = validateEmail(data.email);
  if (emailErr) errors.push(emailErr);
  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }
  return errors;
}
