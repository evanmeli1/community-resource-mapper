// app/components/CommentsSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import AuthModal from './AuthModal';

interface Comment {
  id: string;
  content: string;
  isVerified: boolean;
  createdAt: string;
  user?: {
    name: string;
  };
}

interface CommentsSectionProps {
  resourceId: string;
  userLocation: { lat: number; lng: number } | null;
  resourceLocation: { lat: number; lng: number };
}

export default function CommentsSection({ 
  resourceId, 
  userLocation, 
  resourceLocation 
}: CommentsSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  const [isVerifyingLocation, setIsVerifyingLocation] = useState(false);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Load comments
  useEffect(() => {
    loadComments();
  }, [resourceId]);

  const loadComments = async () => {
      console.log('Loading comments for resourceId:', resourceId); // Add this line
    try {
      const response = await fetch(`/api/comments/${resourceId}`);
      const data = await response.json();
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  // Format relative time
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Submit comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // For anonymous users, verify location first
    if (!session) {
      setIsVerifyingLocation(true);
      
      if (!navigator.geolocation) {
        setShowSuccessMessage('❌ Geolocation not supported');
        setTimeout(() => setShowSuccessMessage(null), 3000);
        setIsVerifyingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const distance = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            resourceLocation.lat,
            resourceLocation.lng
          );

          if (distance <= 100.0) {
            // Within 1km, submit anonymous comment
            await submitComment(null);
          } else {
            setShowSuccessMessage(`❌ You must be within 100m to comment. You are ${(distance * 1000).toFixed(0)}m away.`);
            setTimeout(() => setShowSuccessMessage(null), 4000);
          }
          setIsVerifyingLocation(false);
        },
        () => {
          setShowSuccessMessage('❌ Unable to verify location');
          setTimeout(() => setShowSuccessMessage(null), 3000);
          setIsVerifyingLocation(false);
        }
      );
    } else {
      // Verified user, submit directly
      await submitComment(session.user.id);
    }
  };

  const submitComment = async (userId: string | null) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
           resourceId,
          content: newComment.trim(),
          userId,
            isVerified: !!userId,
           email: userId ? session?.user?.email : null,
            deviceId: userId ? null : 'device-' + Math.random().toString(36).substr(2, 9),
      }),

      });

      const data = await response.json();
      if (data.success) {
        setNewComment('');
        loadComments(); // Refresh comments
        setShowSuccessMessage('✅ Comment posted successfully!');
        setTimeout(() => setShowSuccessMessage(null), 3000);
      } else {
        setShowSuccessMessage('❌ Failed to post comment');
        setTimeout(() => setShowSuccessMessage(null), 3000);
      }
    } catch (error) {
      setShowSuccessMessage('❌ Error posting comment');
      setTimeout(() => setShowSuccessMessage(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-amber-50/90 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
          <span>💬</span>
          <span>Community Comments</span>
        </h3>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-slate-100 rounded-lg text-sm text-gray-900"
            >
              {showSuccessMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your experience with this resource..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-gray-900 placeholder-gray-500"              rows={3}
              maxLength={500}
            />
            <div className="text-xs text-slate-500 mt-1 text-right">
              {newComment.length}/500
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-600">
              {session ? (
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Commenting as {session.user?.name} (verified)</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>Anonymous comment (location verification required)</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {!session && (
                <motion.button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign in/up for verified comments
                </motion.button>
              )}

              <motion.button
                type="submit"
                disabled={!newComment.trim() || isSubmitting || isVerifyingLocation}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors text-sm flex items-center space-x-1"
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting || isVerifyingLocation ? (
                  <>
                    <motion.div
                      className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>{isVerifyingLocation ? 'Verifying...' : 'Posting...'}</span>
                  </>
                ) : (
                  <span>Post Comment</span>
                )}
              </motion.button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-slate-400 text-2xl">💬</span>
              </div>
              <p className="text-slate-500">No comments yet</p>
              <p className="text-slate-400 text-sm">Be the first to share your experience!</p>
            </div>
          ) : (
            <AnimatePresence>
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-l-4 border-slate-200 bg-white/50 rounded-r-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-900">
                        {comment.user?.name ?? 'Anonymous'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        comment.isVerified 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {comment.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-700">{comment.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          // Refresh the page to update session
          window.location.reload();
        }}
      />
    </div>
  );
}