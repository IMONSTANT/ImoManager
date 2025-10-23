import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LoginForm } from '@/components/auth/login-form'

describe('LoginForm', () => {
  it('should validate email format', async () => {
    render(<LoginForm />)
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await userEvent.type(emailInput, 'invalid-email')
    await userEvent.click(submitButton)

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument()
  })

  it('should require password', async () => {
    render(<LoginForm />)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await userEvent.click(submitButton)

    expect(await screen.findByText(/password.*required/i)).toBeInTheDocument()
  })

  it('should call onSuccess after successful login', async () => {
    const onSuccess = vi.fn()
    render(<LoginForm onSuccess={onSuccess} />)

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalled())
  })
})
