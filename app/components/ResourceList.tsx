'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStatusDisplay } from '../utils/scheduleUtils';

interface Resource {
  id: string;
  name: string;
  category: string;
  type: string;
  address: string;
  phone?: string;
  website?: string;
  distance?: number;
  schedule?: Record<string, string>;
}

interface ResourceListProps {
  resources: Resource[];
}

export default function ResourceList({ resources }: ResourceListProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Ensure we're on the client side before using localStorage
  useEffect(() => {
    setIsClient(true);
    const savedFavorites = localStorage.getItem('resourceFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites:', error);
        setFavorites([]);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('resourceFavorites', JSON.stringify(favorites));
    }
  }, [favorites, isClient]);

  // Toggle favorite function with success feedback
  const toggleFavorite = (resourceId: string, resourceName: string) => {
    setFavorites(prev => {
      const isAdding = !prev.includes(resourceId);
      setShowSuccessFeedback(isAdding ? `Saved ${resourceName}` : `Removed ${resourceName}`);
      setTimeout(() => setShowSuccessFeedback(null), 2000);
      
      if (prev.includes(resourceId)) {
        return prev.filter(id => id !== resourceId);
      } else {
        return [...prev, resourceId];
      }
    });
  };

  // Share function with success feedback
  const handleShare = async (resource: Resource) => {
    const shareUrl = `${window.location.origin}/resource/${resource.id}`;
    const shareText = `Check out ${resource.name} - ${resource.address}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.name,
          text: shareText,
          url: shareUrl,
        });
        setShowSuccessFeedback('Shared successfully!');
        setTimeout(() => setShowSuccessFeedback(null), 2000);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setShowSuccessFeedback('Link copied to clipboard!');
        setTimeout(() => setShowSuccessFeedback(null), 2000);
      } catch (error) {
        prompt('Copy this link:', shareUrl);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Send to API
    setShowSuccessFeedback(`Report submitted for ${selectedResource?.name}!`);
    setTimeout(() => setShowSuccessFeedback(null), 2000);
    setReportModalOpen(false);
  };

  // Success feedback component
  const SuccessFeedback = () => (
    <AnimatePresence>
      {showSuccessFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 500,
              damping: 25
            }
          }}
          exit={{ 
            opacity: 0, 
            y: -50,
            scale: 0.3,
            transition: { duration: 0.2 }
          }}
          className="fixed top-4 right-4 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg z-50 max-w-sm"
        >
          {showSuccessFeedback}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <SuccessFeedback />
      
      <motion.div 
        className="h-96 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="space-y-3"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <AnimatePresence mode="popLayout">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                whileHover={{ 
                  scale: 1.01,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                  transition: { duration: 0.2 }
                }}
                onHoverStart={() => setHoveredCard(resource.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative"
              >
                <Link 
                  href={`/resource/${resource.id}`}
                      className="block bg-amber-50/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-200/50 hover:border-slate-300/50 transition-all"
                >
                  {/* Main Content */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <motion.h3 
                        className="font-semibold text-lg text-slate-900 truncate"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: (index * 0.05) + 0.1 }}
                      >
                        {resource.name}
                      </motion.h3>
                      
                      <motion.p 
                        className="text-sm text-slate-600 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: (index * 0.05) + 0.15 }}
                      >
                        {resource.type.replace('_', ' ')} • {resource.category}
                      </motion.p>
                      
                      <motion.p 
                        className="text-sm text-slate-500 mt-2 truncate"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.05) + 0.2 }}
                      >
                        {resource.address}
                      </motion.p>
                      
                      {resource.distance && (
                        <motion.p 
                          className="text-sm text-blue-600 mt-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index * 0.05) + 0.25 }}
                        >
                          {resource.distance.toFixed(1)} km away
                        </motion.p>
                      )}

                      {/* Operating hours status */}
                        {resource.schedule && (
                          <motion.div 
                            className="mt-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (index * 0.05) + 0.3 }}
                          >
                            {(() => {
                              try {
                                console.log(`Schedule for ${resource.name}:`, resource.schedule); // Debug log
                                const status = getStatusDisplay(resource.schedule);
                                console.log(`Status for ${resource.name}:`, status); // Debug log
                                
                                const colorClasses = {
                                  green: 'text-green-600 bg-green-50',
                                  yellow: 'text-amber-600 bg-amber-50', 
                                  orange: 'text-orange-600 bg-orange-50',
                                  red: 'text-red-600 bg-red-50',
                                  gray: 'text-slate-500 bg-slate-50'
                                };
                                
                                return (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colorClasses[status.color]}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                      status.color === 'green' ? 'bg-green-400' :
                                      status.color === 'yellow' ? 'bg-amber-400' :
                                      status.color === 'orange' ? 'bg-orange-400' :
                                      status.color === 'red' ? 'bg-red-400' :
                                      'bg-slate-400'
                                    }`} />
                                    {status.text}
                                  </span>
                                );
                              } catch (error) {
                                console.error(`Error getting status for ${resource.name}:`, error);
                                return (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-slate-500 bg-slate-50">
                                    <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-slate-400" />
                                    Call to confirm hours
                                  </span>
                                );
                              }
                            })()}
                          </motion.div>
                        )}
                    </div>

                    {/* Right side - Quick indicators and actions */}
                    <div className="flex items-start space-x-2 ml-4">
                      {/* Contact indicators - subtle */}
                      <div className="flex space-x-1">
                        {resource.phone && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full" title="Has phone" />
                        )}
                        {resource.website && (
                          <div className="w-2 h-2 bg-green-400 rounded-full" title="Has website" />
                        )}
                      </div>

                      {/* Favorite button - always visible */}
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(resource.id, resource.name);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg 
                          className={`w-5 h-5 ${
                            favorites.includes(resource.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-slate-400'
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </motion.button>

                      {/* Actions menu - appears on hover */}
                      <AnimatePresence>
                        {hoveredCard === resource.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: 10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: 10 }}
                            transition={{ duration: 0.15 }}
                            className="flex space-x-1"
                          >
                            {/* Share */}
                            <motion.button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleShare(resource);
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Share"
                            >
                              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                              </svg>
                            </motion.button>

                            {/* Report */}
                            <motion.button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedResource(resource);
                                setReportModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Report issue"
                            >
                              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Animated Report Issue Modal */}
        <AnimatePresence>
          {reportModalOpen && selectedResource && (
            <motion.div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReportModalOpen(false)}
            >
              <motion.div 
                className="bg-white p-6 rounded-2xl max-w-md w-full mx-4 shadow-xl"
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.3, opacity: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.h3 
                  className="text-xl font-semibold mb-4 text-slate-900"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Report Issue: {selectedResource.name}
                </motion.h3>
                
                <form onSubmit={handleSubmit}>
                  <motion.div 
                    className="mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="block text-sm font-medium mb-2 text-slate-700">Issue Type</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Incorrect hours</option>
                      <option>Wrong address</option>
                      <option>No longer exists</option>
                      <option>Incorrect phone number</option>
                      <option>Other</option>
                    </select>
                  </motion.div>
                  
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium mb-2 text-slate-700">Details</label>
                    <textarea 
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Please describe the issue..."
                    ></textarea>
                  </motion.div>
                  
                  <motion.div 
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <motion.button 
                      type="button"
                      onClick={() => setReportModalOpen(false)}
                      className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button 
                      type="submit"
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Submit Report
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}