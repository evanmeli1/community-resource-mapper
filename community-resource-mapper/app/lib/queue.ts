// Simple job queue for Next.js (no external dependencies)
interface EmailJob {
  id: string;
  type: 'verification_notification';
  to: string;
  resourceName: string;
  verificationStatus: string;
  userName?: string;
  createdAt: Date;
}

interface DataUpdateJob {
  id: string;
  type: 'refresh_resource_data';
  resourceId?: string;
  createdAt: Date;
}

// In-memory job storage (in production, use database or Redis)
const emailJobs: EmailJob[] = [];
const dataUpdateJobs: DataUpdateJob[] = [];

// Add job to queue
export function addEmailJob(job: Omit<EmailJob, 'id' | 'createdAt'>) {
  const emailJob: EmailJob = {
    ...job,
    id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date()
  };
  
  emailJobs.push(emailJob);
  console.log(`📧 [QUEUE] Email job queued: ${emailJob.id}`);
  
  // Process job immediately in background
  processEmailJob(emailJob);
  
  return emailJob.id;
}

export function addDataUpdateJob(job: Omit<DataUpdateJob, 'id' | 'createdAt'>) {
  const dataJob: DataUpdateJob = {
    ...job,
    id: `data_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date()
  };
  
  dataUpdateJobs.push(dataJob);
  console.log(`🔄 [QUEUE] Data update job queued: ${dataJob.id}`);
  
  // Process job with delay
  setTimeout(() => processDataUpdateJob(dataJob), 5000); // 5 second delay
  
  return dataJob.id;
}

// Process email job in background
async function processEmailJob(job: EmailJob) {
  try {
    console.log(`📧 [EMAIL QUEUE] Processing job ${job.id}:`);
    console.log(`   To: ${job.to}`);
    console.log(`   Resource: ${job.resourceName}`);
    console.log(`   Status: ${job.verificationStatus}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`✅ [EMAIL QUEUE] Email sent successfully! Job ${job.id}`);
    
    // Remove from queue
    const index = emailJobs.findIndex(j => j.id === job.id);
    if (index > -1) emailJobs.splice(index, 1);
    
  } catch (error) {
    console.error(`❌ [EMAIL QUEUE] Job ${job.id} failed:`, error);
  }
}

// Process data update job in background
async function processDataUpdateJob(job: DataUpdateJob) {
  try {
    console.log(`🔄 [DATA QUEUE] Processing job ${job.id}:`);
    console.log(`   Resource ID: ${job.resourceId || 'all resources'}`);
    
    // Simulate data update work
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`✅ [DATA QUEUE] Data refresh completed! Job ${job.id}`);
    
    // Remove from queue
    const index = dataUpdateJobs.findIndex(j => j.id === job.id);
    if (index > -1) dataUpdateJobs.splice(index, 1);
    
  } catch (error) {
    console.error(`❌ [DATA QUEUE] Job ${job.id} failed:`, error);
  }
}

// Get queue status
export function getQueueStatus() {
  return {
    emailJobs: emailJobs.length,
    dataUpdateJobs: dataUpdateJobs.length,
    totalJobs: emailJobs.length + dataUpdateJobs.length
  };
}

console.log('🚀 Simple job queue initialized!');