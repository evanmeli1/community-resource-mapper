'use client';

import * as Sentry from '@sentry/nextjs';

export default function GlobalError({ 
  error, 
  reset 
}: { 
  error: Error; 
  reset: () => void 
}) {
  // Report error to Sentry
  Sentry.captureException(error);

  return (
    <html>
      <body className="bg-gray-50 font-inter antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              We're sorry, but the Community Resource Mapper encountered an unexpected error. 
              Our team has been notified and is working to fix this.
            </p>

            {/* Error details (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-100 rounded-md p-4 mb-6 text-left">
                <p className="text-sm text-gray-700 font-mono">
                  <strong>Error:</strong> {error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button 
                onClick={() => reset()}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition-colors duration-200"
              >
                Try Again
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Go to Homepage
              </button>
            </div>

            {/* Footer */}
            <p className="text-sm text-gray-500 mt-6">
              If this problem continues, please contact support.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}