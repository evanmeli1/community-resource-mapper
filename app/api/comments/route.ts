import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { checkRateLimit } from '../middleware/rateLimit'
import { prisma } from '../../lib/prisma'

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = await checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await getServerSession(authOptions)
    const { resourceId, content, deviceId } = await request.json()

    // Input validation
    if (!resourceId || typeof resourceId !== 'string' || resourceId.length < 10) {
      return NextResponse.json(
        { error: 'Invalid resource ID' },
        { status: 400 }
      )
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (content.length > 200) {
      return NextResponse.json(
        { error: 'Content too long (max 200 characters)' },
        { status: 400 }
      )
    }

    // Get actual user ID from database if session exists
    let userId = null;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      userId = user?.id || null;
    }

    // Check for existing comment today (1 per day limit)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingComment = await prisma.comment.findFirst({
      where: {
        resourceId,
        OR: [
          { userId: userId },
          { deviceId: deviceId }
        ],
        createdAt: {
          gte: today
        }
      }
    });
    
    if (existingComment) {
      return NextResponse.json(
        { success: false, error: "You can only comment once per day on each resource" },
        { status: 429 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        resourceId,
        content: content.trim(),
        userId: userId,
        deviceId: userId ? null : deviceId,
        isVerified: !!userId,
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json({
      success: true,
      comment,
    })

  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}