"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user?: { name: string } | null;
}

interface Resource {
  id: string;
  name: string;
  comments: Comment[];
}

export default function ResourceComments({ params }: { params: { id: string } }) {
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchResourceWithComments();
  }, []);

  const fetchResourceWithComments = async () => {
    try {
      const response = await fetch(`/api/admin/resources/${params.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setResource(data.resource);
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setResource(prev => prev ? ({
          ...prev,
          comments: prev.comments.filter(c => c.id !== commentId)
        }) : null);
      } else {
        alert('Failed to delete comment');
      }
    } catch (error) {
      alert('Error deleting comment');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!resource) return <div className="p-8">Resource not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-900"
          >
            ← Back to Resources
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Comments for {resource.name}</h1>
        </div>
        
        {resource.comments.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-slate-600">
            No comments yet for this resource
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Comment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {resource.comments.map((comment) => (
                  <tr key={comment.id}>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {comment.user?.name || 'Anonymous'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 max-w-md">
                      <div className="break-words">{comment.content}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button 
                        onClick={() => deleteComment(comment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}