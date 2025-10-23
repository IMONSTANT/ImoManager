/**
 * @testfile auth-schema.test.ts
 * @description Comprehensive unit tests for authentication Zod schemas
 * @requirements RN-016, RN-017, RN-018, RF-001, RF-002
 * @coverage
 *   - loginSchema validation
 *   - registerSchema validation
 *   - RN-016: Password minimum 6 characters
 *   - RN-017: Password confirmation must match
 *   - RN-018: Name minimum 2 characters
 *   - Email format validation
 * @author TDD Test Architect Agent
 */

import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '@/lib/validations/auth'

describe('[UNIT] Auth Schemas', () => {
  describe('loginSchema', () => {
    // ========================================================================
    // HAPPY PATH - Valid login data
    // ========================================================================
    it('should validate correct login data', () => {
      // Arrange
      const validData = {
        email: 'user@example.com',
        password: 'password123'
      }

      // Act
      const result = loginSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should validate with minimum password length (RN-016)', () => {
      // Arrange - Exactly 6 characters (boundary)
      const validData = {
        email: 'user@example.com',
        password: '123456'
      }

      // Act
      const result = loginSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should validate with various email formats', () => {
      // Arrange
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@test-domain.com'
      ]

      // Act & Assert
      validEmails.forEach(email => {
        const result = loginSchema.safeParse({ email, password: 'password123' })
        expect(result.success).toBe(true)
      })
    })

    // ========================================================================
    // SAD PATH - Invalid email
    // ========================================================================
    it('should reject invalid email format', () => {
      // Arrange
      const invalidData = {
        email: 'invalid-email',
        password: 'password123'
      }

      // Act
      const result = loginSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email format')
        expect(result.error.issues[0].path).toContain('email')
      }
    })

    it('should reject email without @', () => {
      // Arrange
      const invalidData = {
        email: 'userexample.com',
        password: 'password123'
      }

      // Act
      const result = loginSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should reject email without domain', () => {
      // Arrange
      const invalidData = {
        email: 'user@',
        password: 'password123'
      }

      // Act
      const result = loginSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    // ========================================================================
    // SAD PATH - Invalid password (RN-016)
    // ========================================================================
    it('should reject password with less than 6 characters (RN-016)', () => {
      // Arrange
      const invalidData = {
        email: 'user@example.com',
        password: '12345' // 5 characters
      }

      // Act
      const result = loginSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 6 characters')
        expect(result.error.issues[0].path).toContain('password')
      }
    })

    it('should reject empty password', () => {
      // Arrange
      const invalidData = {
        email: 'user@example.com',
        password: ''
      }

      // Act
      const result = loginSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    // ========================================================================
    // EDGE CASES - Missing fields
    // ========================================================================
    it('should reject missing email field', () => {
      // Arrange
      const invalidData = {
        password: 'password123'
      }

      // Act
      const result = loginSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should reject missing password field', () => {
      // Arrange
      const invalidData = {
        email: 'user@example.com'
      }

      // Act
      const result = loginSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should reject empty object', () => {
      // Arrange
      const invalidData = {}

      // Act
      const result = loginSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    // ========================================================================
    // HAPPY PATH - Valid registration data
    // ========================================================================
    it('should validate correct registration data', () => {
      // Arrange
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      }

      // Act
      const result = registerSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
        expect(result.data.email).toBe('john@example.com')
        expect(result.data.password).toBe('password123')
        expect(result.data.confirmPassword).toBe('password123')
      }
    })

    it('should validate with minimum name length (RN-018)', () => {
      // Arrange - Exactly 2 characters (boundary)
      const validData = {
        name: 'Jo',
        email: 'jo@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      }

      // Act
      const result = registerSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should validate matching passwords (RN-017)', () => {
      // Arrange
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'mySecurePassword',
        confirmPassword: 'mySecurePassword'
      }

      // Act
      const result = registerSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    // ========================================================================
    // SAD PATH - Invalid name (RN-018)
    // ========================================================================
    it('should reject name with less than 2 characters (RN-018)', () => {
      // Arrange
      const invalidData = {
        name: 'J', // 1 character
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      }

      // Act
      const result = registerSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name must be at least 2 characters')
        expect(result.error.issues[0].path).toContain('name')
      }
    })

    it('should reject empty name', () => {
      // Arrange
      const invalidData = {
        name: '',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      }

      // Act
      const result = registerSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    // ========================================================================
    // SAD PATH - Password mismatch (RN-017)
    // ========================================================================
    it('should reject when passwords do not match (RN-017)', () => {
      // Arrange
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password456'
      }

      // Act
      const result = registerSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Passwords do not match')
        expect(result.error.issues[0].path).toContain('confirmPassword')
      }
    })

    it('should reject when confirmPassword is empty but password is set', () => {
      // Arrange
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: ''
      }

      // Act
      const result = registerSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    // ========================================================================
    // COMBINED VALIDATIONS
    // ========================================================================
    it('should reject password less than 6 chars even if matching (RN-016)', () => {
      // Arrange
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345',
        confirmPassword: '12345'
      }

      // Act
      const result = registerSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        const passwordError = result.error.issues.find(e => e.path.includes('password'))
        expect(passwordError?.message).toBe('Password must be at least 6 characters')
      }
    })

    it('should handle multiple validation errors', () => {
      // Arrange
      const invalidData = {
        name: 'J', // Too short
        email: 'invalid-email', // Invalid format
        password: '123', // Too short
        confirmPassword: '456' // Doesn't match
      }

      // Act
      const result = registerSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1)
      }
    })

    // ========================================================================
    // EDGE CASES
    // ========================================================================
    it('should reject missing name field', () => {
      // Arrange
      const invalidData = {
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      }

      // Act
      const result = registerSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should reject missing confirmPassword field', () => {
      // Arrange
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      }

      // Act
      const result = registerSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should validate long names', () => {
      // Arrange
      const validData = {
        name: 'João Pedro da Silva Santos Oliveira',
        email: 'joao@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      }

      // Act
      const result = registerSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should validate long passwords', () => {
      // Arrange
      const longPassword = 'veryLongSecurePasswordWithManyCharacters123!@#'
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: longPassword,
        confirmPassword: longPassword
      }

      // Act
      const result = registerSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })
  })
})
