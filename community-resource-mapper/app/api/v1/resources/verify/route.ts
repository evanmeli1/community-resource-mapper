import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schema - makes sure data is correct format
const verificationSchema = z.object({
  resourceId: z.string(),
  status: z.enum(['open', 'closed', 'accurate', 'needs_update']),
  notes: z.string().optional(),
  deviceId: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the incoming data
    const validatedData = verificationSchema.parse(body)
    
    // Create new verification record
    const verification = await prisma.verification.create({
      data: {
        resourceId: validatedData.resourceId,
        status: validatedData.status,
        notes: validatedData.notes,
        deviceId: validatedData.deviceId,
      }
    })

    // Update the resource's lastVerified timestamp
    await prisma.resource.update({
      where: { id: validatedData.resourceId },
      data: { lastVerified: new Date() }
    })

    return NextResponse.json({
      success: true,
      message: 'Verification recorded successfully',
      data: verification
    })
  } catch (error) {
    console.error('Error creating verification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record verification' },
      { status: 500 }
    )
  }
}