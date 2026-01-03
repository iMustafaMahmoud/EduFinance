/**
 * @jest-environment node
 */

import { POST } from '@/app/api/auth/signin/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

describe('/api/auth/signin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('successfully signs in user with correct credentials', async () => {
    const mockUser = {
      id: 'user1',
      email: 'john@example.com',
      name: 'John Doe',
      password: 'password123',
      role: 'end_user',
      phone: '+1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

    const request = new NextRequest('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'password123',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.user).toBeDefined()
    expect(data.user.email).toBe('john@example.com')
    expect(data.user.password).toBeUndefined() // Password should not be returned
  })

  it('returns 401 for non-existent user', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'password123',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid credentials')
  })

  it('returns 401 for incorrect password', async () => {
    const mockUser = {
      id: 'user1',
      email: 'john@example.com',
      name: 'John Doe',
      password: 'correctpassword',
      role: 'end_user',
      phone: '+1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

    const request = new NextRequest('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'wrongpassword',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid credentials')
  })

  it('handles database errors gracefully', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockRejectedValue(
      new Error('Database error')
    )

    const request = new NextRequest('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'password123',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal server error')
  })
})

