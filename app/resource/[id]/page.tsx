'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const prisma = new PrismaClient();

interface ResourcePageProps {
  params: Promise<{
    id: string;
  }>;
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function ResourcePage({ params }: ResourcePageProps) {
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResource() {
      try {
        const { id } = await params;
        const response = await fetch(`/api/resource/${id}`);
        const data = await response.json();
        if (data.success) {
          setResource(data.data);
        }
      } catch (error) {
        console.error('Error fetching resource:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchResource();
  }, [params]);

  const handleVerifyLocation = async () => {
    setIsVerifying(true);
    
    if (!navigator.geolocation) {
      setShowSuccessMessage('❌ Geolocation not supported by this browser');
      setTimeout(() => setShowSuccessMessage(null), 3000);
      setIsVerifying(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        const distance = calculateDistance(userLat, userLng, resource.lat, resource.lng);
        
        if (distance <= 0.1) {
          setShowSuccessMessage('✅ Location verified! You can submit verification.');
        } else {
          setShowSuccessMessage(`❌ You must be within 100m of the resource to verify. You are ${(distance * 1000).toFixed(0)}m away.`);
        }
        
        setTimeout(() => setShowSuccessMessage(null), 4000);
        setIsVerifying(false);
      },
      (error) => {
        setShowSuccessMessage('❌ Unable to get your location. Please enable location services.');
        setTimeout(() => setShowSuccessMessage(null), 3000);
        setIsVerifying(false);
      }
    );
  };

  const handleCallPhone = () => {
    setShowSuccessMessage('📞 Opening phone app...');
    setTimeout(() => setShowSuccessMessage(null), 2000);
  };

  const handleDirections = () => {
    if (resource) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(resource.address)}`;
      window.open(url, '_blank');
      setShowSuccessMessage('🗺️ Opening directions...');
      setTimeout(() => setShowSuccessMessage(null), 2000);
    }
  };

  // Success feedback component
  const SuccessFeedback = () => (
    <AnimatePresence>
      {showSuccessMessage && (
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
          {showSuccessMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-12 h-12 border-4 border-slate-300 border-t-slate-600 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-slate-600 font-medium">Loading resource details...</p>
        </motion.div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Resource not found</h1>
          <p className="text-slate-600 mb-6">The resource you're looking for doesn't exist.</p>
          <Link 
            href="/"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            ← Back to Resources
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SuccessFeedback />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <motion.header 
          className="bg-white/80 backdrop-blur-md border-b border-slate-200/50"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Link 
                  href="/"
                  className="flex items-center space-x-3 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <span className="font-medium">Back to Resources</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.header>

        <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Title Section */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                {resource.name}
              </h1>
              <div className="flex items-center space-x-3 text-slate-600">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {resource.type.replace('_', ' ')}
                </span>
                <span className="text-sm">•</span>
                <span className="text-sm">{resource.category}</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <motion.div 
                className="lg:col-span-2 space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Contact Info */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                      <span>📍</span>
                      <span>Contact Information</span>
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <span className="text-slate-600">🏠</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">Address</p>
                          <p className="text-slate-600">{resource.address}</p>
                        </div>
                      </div>

                      {resource.phone && (
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <span className="text-slate-600">📞</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">Phone</p>
                            <motion.a 
                              href={`tel:${resource.phone}`} 
                              className="text-blue-600 hover:text-blue-700 transition-colors"
                              onClick={handleCallPhone}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {resource.phone}
                            </motion.a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verifications */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                      <span>✅</span>
                      <span>Recent Verifications</span>
                    </h2>
                    
                    {resource.verifications && resource.verifications.length > 0 ? (
                      <div className="space-y-4">
                        {resource.verifications.map((verification: any, index: number) => (
                          <motion.div 
                            key={verification.id} 
                            className="border-l-4 border-green-200 bg-green-50/50 rounded-r-lg p-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (index * 0.1) }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-green-700">
                                Status: {verification.status}
                              </span>
                              <span className="text-xs text-slate-500">
                                {new Date(verification.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            {verification.notes && (
                              <p className="text-slate-600 text-sm italic">
                                "{verification.notes}"
                              </p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-slate-400 text-2xl">📝</span>
                        </div>
                        <p className="text-slate-500">No recent verifications</p>
                        <p className="text-slate-400 text-sm">Be the first to verify this resource!</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Action Panel */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Quick Actions */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                    
                    <div className="space-y-3">
                      <motion.button
                        onClick={handleDirections}
                        className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>🗺️</span>
                        <span>Get Directions</span>
                      </motion.button>

                      {resource.phone && (
                        <motion.a
                          href={`tel:${resource.phone}`}
                          onClick={handleCallPhone}
                          className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>📞</span>
                          <span>Call Now</span>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verification Panel */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-200/50 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                      <span>🔍</span>
                      <span>Verify This Resource</span>
                    </h3>
                    
                    <p className="text-slate-600 text-sm mb-4">
                      Help keep our data accurate by verifying this resource's current status
                    </p>
                    
                    <motion.button 
                      onClick={handleVerifyLocation}
                      disabled={isVerifying}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                      whileHover={!isVerifying ? { scale: 1.02 } : {}}
                      whileTap={!isVerifying ? { scale: 0.98 } : {}}
                    >
                      {isVerifying ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>Checking location...</span>
                        </>
                      ) : (
                        <>
                          <span>📍</span>
                          <span>Verify Location & Status</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
}