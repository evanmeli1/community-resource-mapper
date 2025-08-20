'use client';

import * as Sentry from '@sentry/nextjs';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  // Report error to Sentry
  Sentry.captureException(error);

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
