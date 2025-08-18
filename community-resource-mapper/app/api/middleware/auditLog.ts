import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuditLogData {
  endpoint: string;
  method: string;
  userAgent?: string;
  ipAddress: string;
  responseStatus: number;
  responseTime: number;
  requestSize?: number;
  responseSize?: number;
}

export async function logApiCall(
  request: NextRequest,
  response: NextResponse,
  startTime: number
): Promise<void> {
  try {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const auditData: AuditLogData = {
      endpoint: new URL(request.url).pathname,
      method: request.method,
      userAgent: request.headers.get("user-agent") || "unknown",
      ipAddress: request.ip ?? request.headers.get("x-forwarded-for") ?? "127.0.0.1",
      responseStatus: response.status,
      responseTime: responseTime,
      requestSize: request.headers.get("content-length") ? parseInt(request.headers.get("content-length")!) : 0,
      responseSize: response.headers.get("content-length") ? parseInt(response.headers.get("content-length")!) : 0,
    };

    // Log to console for development
    console.log(`[AUDIT] ${auditData.method} ${auditData.endpoint} - ${auditData.responseStatus} (${auditData.responseTime}ms) - IP: ${auditData.ipAddress}`);

    // Store in database (optional - can be heavy)
    // await prisma.auditLog.create({ data: auditData });

    // In production, you'd send to logging service like:
    // - DataDog
    // - New Relic  
    // - CloudWatch
    // - Sentry

  } catch (error) {
    console.error("Audit logging failed:", error);
    // Never let audit logging break the actual API
  }
}

export function createAuditWrapper(handler: Function) {
  return async (request: NextRequest) => {
    const startTime = Date.now();
    
    try {
      const response = await handler(request);
      
      // Log the API call
      await logApiCall(request, response, startTime);
      
      return response;
    } catch (error) {
      // Log failed requests too
      const errorResponse = NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
      
      await logApiCall(request, errorResponse, startTime);
      
      throw error;
    }
  };
}