// app/lib/startup.ts
console.log('🚀 Application starting...');

// Simple startup - no cron jobs needed for Docker build
let appStarted = false;

export function initializeApp() {
  if (!appStarted) {
    console.log('✅ Application initialized successfully!');
    appStarted = true;
  }
}

// Auto-start when this module is imported
initializeApp();