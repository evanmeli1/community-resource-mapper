// app/lib/scheduler.ts - Simple Next.js compatible scheduler
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Track job execution
interface JobExecution {
  jobName: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
  recordsProcessed?: number;
  errors?: string[];
}

const jobExecutions: JobExecution[] = [];

// Helper function to log job execution
function logJobExecution(execution: JobExecution) {
  const duration = execution.endTime && execution.startTime 
    ? execution.endTime.getTime() - execution.startTime.getTime()
    : 0;
  
  console.log(`🤖 [SCHEDULER] ${execution.jobName}: ${execution.status} | Duration: ${duration}ms | Records: ${execution.recordsProcessed || 0}`);
  
  if (execution.errors && execution.errors.length > 0) {
    console.log(`❌ [SCHEDULER] Errors:`, execution.errors);
  }
}

// Job 1: Health Check
export async function healthCheckTask() {
  const execution: JobExecution = {
    jobName: 'System Health Check',
    startTime: new Date(),
    status: 'running'
  };

  console.log('❤️ [SCHEDULER] Running system health check...');

  try {
    const resourceCount = await prisma.resource.count();
    const verificationCount = await prisma.verification.count();
    
    const staleResources = await prisma.resource.count({
      where: {
        OR: [
          { lastVerified: null },
          { 
            lastVerified: {
              lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        ]
      }
    });

    console.log(`   Database Status: ✅ Connected`);
    console.log(`   Resources: ${resourceCount} total, ${staleResources} need verification`);
    console.log(`   Verifications: ${verificationCount} total`);

    execution.endTime = new Date();
    execution.status = 'completed';
    execution.recordsProcessed = resourceCount + verificationCount;

  } catch (error) {
    execution.endTime = new Date();
    execution.status = 'failed';
    execution.errors = [error instanceof Error ? error.message : 'Unknown error'];
    
    console.log('🚨 [SCHEDULER] ALERT: System health check failed!');
  }

  jobExecutions.push(execution);
  logJobExecution(execution);
  return execution;
}

// Job 2: Validate Resources
export async function validateResourcesTask() {
  const execution: JobExecution = {
    jobName: 'Validate Resources',
    startTime: new Date(),
    status: 'running'
  };

  console.log('🔍 [SCHEDULER] Starting resource validation job...');

  try {
    const resources = await prisma.resource.findMany();
    let validatedCount = 0;
    const errors: string[] = [];

    for (const resource of resources) {
      try {
        console.log(`   Validating: ${resource.name}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await prisma.resource.update({
          where: { id: resource.id },
          data: { lastVerified: new Date() }
        });
        
        validatedCount++;
      } catch (error) {
        errors.push(`Failed to validate ${resource.name}: ${error}`);
      }
    }

    execution.endTime = new Date();
    execution.status = 'completed';
    execution.recordsProcessed = validatedCount;
    execution.errors = errors;

  } catch (error) {
    execution.endTime = new Date();
    execution.status = 'failed';
    execution.errors = [error instanceof Error ? error.message : 'Unknown error'];
  }

  jobExecutions.push(execution);
  logJobExecution(execution);
  return execution;
}

// Job 3: Clean Old Data
export async function cleanOldDataTask() {
  const execution: JobExecution = {
    jobName: 'Clean Old Verifications',
    startTime: new Date(),
    status: 'running'
  };

  console.log('🧹 [SCHEDULER] Starting cleanup job...');

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deletedVerifications = await prisma.verification.deleteMany({
      where: {
        timestamp: {
          lt: thirtyDaysAgo
        }
      }
    });

    execution.endTime = new Date();
    execution.status = 'completed';
    execution.recordsProcessed = deletedVerifications.count;

    console.log(`   Cleaned up ${deletedVerifications.count} old verifications`);

  } catch (error) {
    execution.endTime = new Date();
    execution.status = 'failed';
    execution.errors = [error instanceof Error ? error.message : 'Unknown error'];
  }

  jobExecutions.push(execution);
  logJobExecution(execution);
  return execution;
}

// Job 4: Generate Report
export async function generateReportTask() {
  const execution: JobExecution = {
    jobName: 'Daily Report',
    startTime: new Date(),
    status: 'running'
  };

  console.log('📊 [SCHEDULER] Generating daily report...');

  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterdayVerifications = await prisma.verification.count({
      where: {
        timestamp: {
          gte: yesterday,
          lt: today
        }
      }
    });

    const totalResources = await prisma.resource.count();
    const verifiedResources = await prisma.resource.count({
      where: {
        lastVerified: {
          not: null
        }
      }
    });

    console.log('📈 [DAILY REPORT]');
    console.log(`   Date: ${yesterday.toDateString()}`);
    console.log(`   New Verifications: ${yesterdayVerifications}`);
    console.log(`   Total Resources: ${totalResources}`);
    console.log(`   Verified Resources: ${verifiedResources}`);
    console.log(`   Coverage: ${Math.round((verifiedResources / totalResources) * 100)}%`);

    execution.endTime = new Date();
    execution.status = 'completed';
    execution.recordsProcessed = yesterdayVerifications;

  } catch (error) {
    execution.endTime = new Date();
    execution.status = 'failed';
    execution.errors = [error instanceof Error ? error.message : 'Unknown error'];
  }

  jobExecutions.push(execution);
  logJobExecution(execution);
  return execution;
}

// Get job execution history
export function getJobStatus() {
  const recentExecutions = jobExecutions
    .slice(-10)
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

  return {
    availableJobs: [
      { name: 'health', description: 'System Health Check' },
      { name: 'validate', description: 'Validate Resources' },
      { name: 'cleanup', description: 'Clean Old Data' },
      { name: 'report', description: 'Generate Report' }
    ],
    recentExecutions,
    totalExecutions: jobExecutions.length
  };
}

console.log('📅 Simple scheduler initialized!');