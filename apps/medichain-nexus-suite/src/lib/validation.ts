/**
 * Validation utilities for admin forms
 */

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
}

/**
 * Validate required field
 */
export function validateRequired(value: string | undefined | null, fieldName: string): string | null {
  if (!value || value.trim() === "") {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validate phone number (Indian format)
 */
export function validatePhone(phone: string): string | null {
  if (!phone) return "Phone number is required";
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
  if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
    return "Invalid phone number (should be 10 digits starting with 6-9)";
  }
  return null;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  return null;
}

/**
 * Validate entity form
 */
export function validateEntity(data: {
  name: string;
  type: string;
  licenseNumber?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!data.name || data.name.trim() === "") {
    errors.push({ field: "name", message: "Entity name is required" });
  }
  
  if (!data.type) {
    errors.push({ field: "type", message: "Entity type is required" });
  }
  
  if (data.licenseNumber && data.licenseNumber.length < 5) {
    errors.push({ field: "licenseNumber", message: "License number must be at least 5 characters" });
  }
  
  return errors;
}

/**
 * Validate user form
 */
export function validateUser(data: {
  name: string;
  email: string;
  roles: string[];
}): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const nameError = validateRequired(data.name, "Name");
  if (nameError) errors.push({ field: "name", message: nameError });
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.push({ field: "email", message: emailError });
  
  if (!data.roles || data.roles.length === 0) {
    errors.push({ field: "roles", message: "At least one role must be selected" });
  }
  
  return errors;
}

/**
 * Validate settings form
 */
export function validateSettings(data: {
  clinic?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (data.clinic) {
    if (data.clinic.name && data.clinic.name.trim() === "") {
      errors.push({ field: "clinic.name", message: "Clinic name cannot be empty" });
    }
    
    if (data.clinic.email) {
      const emailError = validateEmail(data.clinic.email);
      if (emailError) errors.push({ field: "clinic.email", message: emailError });
    }
    
    if (data.clinic.phone) {
      const phoneError = validatePhone(data.clinic.phone);
      if (phoneError) errors.push({ field: "clinic.phone", message: phoneError });
    }
  }
  
  return errors;
}

