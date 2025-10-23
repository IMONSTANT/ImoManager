/**
 * @file auth.fixtures.ts
 * @description Test fixtures for authentication-related data
 * @usage Import these fixtures in integration and E2E tests for consistent test data
 */

import type { LoginInput, RegisterInput } from '@/lib/validations/auth'

// ============================================================================
// VALID AUTH DATA
// ============================================================================

export const validLoginData: LoginInput = {
  email: 'test@example.com',
  password: 'password123'
}

export const validRegisterData: RegisterInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  confirmPassword: 'password123'
}

export const alternativeValidRegisterData: RegisterInput = {
  name: 'Maria Silva',
  email: 'maria.silva@example.com',
  password: 'securePass456',
  confirmPassword: 'securePass456'
}

// ============================================================================
// INVALID AUTH DATA - Email
// ============================================================================

export const invalidEmailLogin = {
  email: 'invalid-email',
  password: 'password123'
}

export const missingAtSignEmail = {
  email: 'testexample.com',
  password: 'password123'
}

export const emptyEmailLogin = {
  email: '',
  password: 'password123'
}

// ============================================================================
// INVALID AUTH DATA - Password (RN-016)
// ============================================================================

export const shortPasswordLogin = {
  email: 'test@example.com',
  password: '12345' // Only 5 characters
}

export const emptyPasswordLogin = {
  email: 'test@example.com',
  password: ''
}

export const boundaryPasswordLogin = {
  email: 'test@example.com',
  password: '123456' // Exactly 6 characters (should be valid)
}

// ============================================================================
// INVALID REGISTER DATA - Name (RN-018)
// ============================================================================

export const shortNameRegister = {
  name: 'J', // Only 1 character
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123'
}

export const boundaryNameRegister = {
  name: 'Jo', // Exactly 2 characters (should be valid)
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123'
}

export const emptyNameRegister = {
  name: '',
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123'
}

// ============================================================================
// INVALID REGISTER DATA - Password Mismatch (RN-017)
// ============================================================================

export const passwordMismatchRegister = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password456'
}

export const emptyConfirmPasswordRegister = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: ''
}

// ============================================================================
// EDGE CASES
// ============================================================================

export const longNameRegister = {
  name: 'João Pedro da Silva Santos Oliveira Rodrigues',
  email: 'joao.pedro@example.com',
  password: 'password123',
  confirmPassword: 'password123'
}

export const longPasswordRegister = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'veryLongSecurePasswordWithManyCharacters123!@#$%^&*()',
  confirmPassword: 'veryLongSecurePasswordWithManyCharacters123!@#$%^&*()'
}

export const specialCharsEmailRegister = {
  name: 'Test User',
  email: 'test+tag@example.co.uk',
  password: 'password123',
  confirmPassword: 'password123'
}

// ============================================================================
// MOCK USER RESPONSES
// ============================================================================

export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

export const mockAuthResponse = {
  user: mockUser,
  session: {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Date.now() + 3600000,
    token_type: 'bearer'
  }
}

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const authErrorMessages = {
  invalidEmail: 'Invalid email format',
  passwordTooShort: 'Password must be at least 6 characters',
  passwordMismatch: 'Passwords do not match',
  nameTooShort: 'Name must be at least 2 characters',
  invalidCredentials: 'Invalid login credentials',
  userExists: 'User already exists',
  emailRequired: 'Email is required',
  passwordRequired: 'Password is required',
  nameRequired: 'Name is required'
}
