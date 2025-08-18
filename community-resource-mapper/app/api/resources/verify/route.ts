import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { addEmailJob, addDataUpdateJob } from '../../../lib/queue'

const prisma = new PrismaClient()

// Validation schema
const verificationSchema = z.object({
  resourceId: z.string(),
  status: z.enum(['open', 'closed', 'accurate', 'needs_update']),
  notes: z.string().optional(),
  deviceId: z.string(),
  userEmail: z.string().email().optional(), // Add optional email for notifications
})

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json()
    
    // Validate the incoming data
    const validatedData = verificationSchema.parse(body)
    
    // Create verification record
    const verification = await prisma.verification.create({
      data: {
        resourceId: validatedData.resourceId,
        status: validatedData.status,
        notes: validatedData.notes,
        deviceId: validatedData.deviceId,
      }
    })

    // Update the resource's lastVerified timestamp
    const updatedResource = await prisma.resource.update({
      where: { id: validatedData.resourceId },
      data: { lastVerified: new Date() },
      select: { name: true, id: true }
    })

    // 🔥 ADD BACKGROUND JOBS HERE! 🔥
    
    // 1. Send verification notification email (if email provided)
    if (validatedData.userEmail) {
      addEmailJob({
        type: 'verification_notification',
        to: validatedData.userEmail,
        resourceName: updatedResource.name,
        verificationStatus: validatedData.status,
        userName: 'Community Member'
      });
      
      console.log(`📧 [QUEUE] Email notification queued for ${validatedData.userEmail}`);
    }

    // 2. Queue data refresh for this resource
    addDataUpdateJob({
      type: 'refresh_resource_data',
      resourceId: validatedData.resourceId
    });
    
    console.log(`🔄 [QUEUE] Data refresh queued for resource ${updatedResource.name}`);

    // 3. Log the API call (audit logging)
    const responseTime = Date.now() - startTime;
    const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "unknown";
    console.log(`[AUDIT] ${new Date().toISOString()} | POST /api/resources/verify | IP: ${ip} | Status: 200 | Time: ${responseTime}ms`);

    // Return immediate response (user doesn't wait for email!)
    return NextResponse.json({
      success: true,
      message: 'Verification recorded successfully',
      data: verification,
      backgroundJobs: {
        emailQueued: !!validatedData.userEmail,
        dataRefreshQueued: true
      }
    })
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "unknown";
    console.log(`[AUDIT] ${new Date().toISOString()} | POST /api/resources/verify | IP: ${ip} | Status: 500 | Time: ${responseTime}ms`);
    
    console.error('Error creating verification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record verification' },
      { status: 500 }
    )
  }
}