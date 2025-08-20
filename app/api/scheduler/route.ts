import { NextRequest, NextResponse } from 'next/server';
import { 
  healthCheckTask, 
  validateResourcesTask, 
  cleanOldDataTask, 
  generateReportTask,
  getJobStatus 
} from '../../lib/scheduler';

// GET - Get job status and history
export async function GET(request: NextRequest) {
  try {
    const status = getJobStatus();
    
    return NextResponse.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get scheduler status' },
      { status: 500 }
    );
  }
}

// POST - Run jobs manually
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, jobName } = body;

    if (action === 'run' && jobName) {
      let result;

      switch (jobName) {
        case 'health':
          result = await healthCheckTask();
          break;
        case 'validate':
          result = await validateResourcesTask();
          break;
        case 'cleanup':
          result = await cleanOldDataTask();
          break;
        case 'report':
          result = await generateReportTask();
          break;
        default:
          return NextResponse.json(
            { success: false, error: `Unknown job: ${jobName}` },
            { status: 400 }
          );
      }

      return NextResponse.json({
        success: true,
        message: `Job '${jobName}' executed successfully`,
        result,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action or missing jobName' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error running scheduled job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to run scheduled job' },
      { status: 500 }
    );
  }
}