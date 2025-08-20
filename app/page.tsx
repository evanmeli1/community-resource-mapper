'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

  let filteredResources = processedResources;

  const category = searchParams.get('category');
  if (category && category !== 'all') {
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
      <main className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Community Resource Mapper</h1>
        <p>Loading resources...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
        Community Resource Mapper
      </h1>
      
      <ResourceFilter 
        totalResources={resources.length}
        filteredCount={filteredResources.length}
        currentCategory={category || 'all'}
        showOpenOnly={openNow === 'true'}
        sortBy={sortBy || 'name'}
        userLocation={userLocation}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-4 md:mt-6">
        <div className="order-1 lg:order-1">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
            📍 Map View
          </h2>
          <div className="h-64 md:h-96">
            <ResourceMap resources={filteredResources} />
          </div>
        </div>
        
        <div className="order-2 lg:order-2">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
            📋 Resources ({filteredResources.length} found)
          </h2>
          <div className="h-64 md:h-96">
            <ResourceList resources={filteredResources} />
          </div>
        </div>
      </div>
      
      <div className="text-center text-gray-600 mt-6 md:mt-8">
        <p className="text-sm md:text-base">
          Find community resources with real-time availability
        </p>
      </div>
      <div className="text-center mt-6">
  <button
    onClick={() => {
      try {
        throw new Error("Sentry test error triggered by button");
      } catch (err) {
        Sentry.captureException(err);
        console.error("Test error captured:", err);
      }
    }}
    className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
  >
    🔴 Trigger Sentry Error
  </button>
</div>

    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}