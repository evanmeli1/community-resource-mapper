// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'  // 👈 import your auth options

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // ✅ Make sure to pass authOptions
    const session = await getServerSession(authOptions)

    const { resourceId, content, deviceId } = await request.json()

    if (!resourceId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        resourceId,
        content,
        userId: session?.user?.id || null,   // ✅ now gets saved
        deviceId: session?.user?.id ? null : deviceId,
        isVerified: !!session?.user?.id,
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
