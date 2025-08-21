// app/help/page.tsx
export default function HelpPage() {
  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
      <p className="mb-4">If you’re having issues or need assistance, you can reach us at:</p>
      <a 
        href="mailto:support@example.com" 
        className="text-blue-600 underline"
      >
        support@example.com
      </a>
      <p className="mt-4 text-sm text-gray-500">We usually respond within 24 hours.</p>
    </div>
  );
}
