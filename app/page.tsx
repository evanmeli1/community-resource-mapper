'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ResourceMap from './components/ResourceMap';
import ResourceList from './components/ResourceList';
import ResourceFilter from './components/ResourceFilter';
import { isOpenNow } from './utils/scheduleUtils';
import './lib/startup';
import * as Sentry from "@sentry/nextjs";

interface Resource {
  id: string;
  name: string;
  category: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  schedule: Record<string, string>;
  distance?: number;
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [resources, setResources] = useState<Resource[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'split' | 'map' | 'list'>('split');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ORIGINAL FETCH LOGIC - UNCHANGED
  useEffect(() => {
    async function fetchResources() {
      try {
        const response = await fetch('/api/resources');
        const data = await response.json();
        if (data.success) {
          setResources(data.data);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, []);

  // ORIGINAL GEOLOCATION LOGIC - UNCHANGED
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
          setUserLocation({ lat: 37.7749, lng: -122.4194 });
        }
      );
    } else {
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
    }
  }, []);

  // ORIGINAL PROCESSING LOGIC - UNCHANGED
  const processedResources = resources.map(resource => {
    if (userLocation) {
      return {
        ...resource,
        distance: calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          resource.lat, 
          resource.lng
        )
      };
    }
    return resource;
  });

  // UPDATED FILTERING LOGIC - WITH SAVED FILTER
  let filteredResources = processedResources;

  const category = searchParams.get('category');
  
  // Handle saved filter first
  if (category === 'saved') {
    if (isClient) {
      const savedFavorites = localStorage.getItem('resourceFavorites');
      if (savedFavorites) {
        try {
          const favoriteIds = JSON.parse(savedFavorites);
          filteredResources = filteredResources.filter(resource => 
            favoriteIds.includes(resource.id)
          );
        } catch (error) {
          console.error('Error parsing favorites:', error);
          filteredResources = [];
        }
      } else {
        filteredResources = [];
      }
    }
  } else if (category && category !== 'all') {
    // Regular category filtering
    filteredResources = filteredResources.filter(
      resource => resource.category === category
    );
  }

  const openNow = searchParams.get('openNow');
  if (openNow === 'true') {
    filteredResources = filteredResources.filter(resource => {
      if (!resource.schedule) return false;
      return isOpenNow(resource.schedule);
    });
  }

  const sortBy = searchParams.get('sortBy');
  if (sortBy === 'distance' && userLocation) {
    filteredResources.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  useEffect(() => {

  }, []);

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
          <h1 className="text-2xl font-bold mb-2 text-slate-900">Community Resource Mapper</h1>
          <p className="text-slate-600 font-medium">Loading resources...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Modern Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Community Resource Mapper</h1>
                <p className="text-xs text-slate-500">Find local community resources</p>
              </div>
            </motion.div>

            {/* View Toggle */}
            <motion.div 
              className="hidden md:flex items-center bg-slate-100 rounded-lg p-1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[
                { key: 'split', icon: '⊞', label: 'Split' },
                { key: 'map', icon: '🗺️', label: 'Map' },
                { key: 'list', icon: '📋', label: 'List' }
              ].map(({ key, icon, label }) => (
                <motion.button
                  key={key}
                  onClick={() => setActiveView(key as any)}
                  className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeView === key 
                      ? 'text-slate-900' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeView === key && (
                    <motion.div
                      layoutId="activeViewBg"
                      className="absolute inset-0 bg-white rounded-md shadow-sm"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center space-x-1">
                    <span>{icon}</span>
                    <span className="hidden lg:inline">{label}</span>
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto p-4">
        {/* ORIGINAL RESOURCEFILTER WITH YOUR EXACT PROPS - UNCHANGED */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <ResourceFilter 
            totalResources={resources.length}
            filteredCount={filteredResources.length}
            currentCategory={category || 'all'}
            showOpenOnly={openNow === 'true'}
            sortBy={sortBy || 'name'}
            userLocation={userLocation}
          />
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeView === 'split' && (
            <motion.div
              key="split"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
            >
              {/* Map Panel */}
              <motion.div 
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden order-1 lg:order-1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="p-4 border-b border-slate-200/50">
                  <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center space-x-2">
                    <span>📍</span>
                    <span>Map View</span>
                  </h2>
                </div>
                <div className="h-64 md:h-96">
                  <ResourceMap resources={filteredResources} />
                </div>
              </motion.div>

              {/* List Panel */}
              <motion.div 
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden order-2 lg:order-2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="p-4 border-b border-slate-200/50">
                  <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center space-x-2">
                    <span>📋</span>
                    <span>Resources ({filteredResources.length} found)</span>
                  </h2>
                </div>
                <div className="h-64 md:h-96">
                  <ResourceList resources={filteredResources} />
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeView === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200/50">
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center space-x-2">
                  <span>📍</span>
                  <span>Map View</span>
                </h2>
              </div>
              <div className="h-64 md:h-96 lg:h-[70vh]">
                <ResourceMap resources={filteredResources} />
              </div>
            </motion.div>
          )}

          {activeView === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200/50">
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center space-x-2">
                  <span>📋</span>
                  <span>Resources ({filteredResources.length} found)</span>
                </h2>
              </div>
              <div className="h-64 md:h-96 lg:h-[70vh]">
                <ResourceList resources={filteredResources} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ORIGINAL FOOTER TEXT - UNCHANGED */}
        <motion.div 
          className="text-center text-gray-600 mt-6 md:mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm md:text-base">
            Find community resources with real-time availability
          </p>
        </motion.div>

        {/* ORIGINAL SENTRY TEST BUTTON - UNCHANGED (but prettier) */}
        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={() => {
              try {
                throw new Error("Sentry test error triggered by button");
              } catch (err) {
                Sentry.captureException(err);
                console.error("Test error captured:", err);
              }
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔴 Trigger Sentry Error
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}