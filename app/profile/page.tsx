// app/profile/page.tsx
'use client';

import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold">You must be logged in to view your profile.</h1>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="space-y-2">
        <p><span className="font-semibold">Name:</span> {session.user?.name}</p>
        <p><span className="font-semibold">Email:</span> {session.user?.email}</p>
        <p className="text-sm text-gray-500">Account created via Community Resource Mapper</p>
      </div>
    </div>
  );
}
