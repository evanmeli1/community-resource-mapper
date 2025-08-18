import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid data format',
        details: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      },
      { status: 400 }
    )
  }

  // Prisma database errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          { success: false, error: 'Resource already exists' },
          { status: 409 }
        )
      case 'P2025':
        return NextResponse.json(
          { success: false, error: 'Resource not found' },
          { status: 404 }
        )
      default:
        return NextResponse.json(
          { success: false, error: 'Database error' },
          { status: 500 }
        )
    }
  }

  // Database connection errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return NextResponse.json(
      { success: false, error: 'Database connection failed' },
      { status: 503 }
    )
  }

  // Generic server errors
  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  )
}