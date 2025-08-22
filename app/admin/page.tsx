import { redirect } from "next/navigation";
import { checkAdminAuth } from "../lib/adminAuth";

export default async function AdminDashboard() {
  const { isAdmin } = await checkAdminAuth();
  
  if (!isAdmin) {
    redirect("/");
  }
  
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Resources</h2>
            <p className="text-slate-600">Manage community resources</p>
            <a href="/admin/resources" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded inline-block">
                    Manage Resources
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <p className="text-slate-600">View and manage users</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
              Manage Users
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <p className="text-slate-600">View app statistics</p>
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}