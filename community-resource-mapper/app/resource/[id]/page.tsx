'use client';

import { useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

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
      alert('Geolocation not supported by this browser');
      setIsVerifying(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        const distance = calculateDistance(userLat, userLng, resource.lat, resource.lng);
        
        if (distance <= 0.1) {
          alert('✅ Location verified! You can submit verification.');
        } else {
          alert(`❌ You must be within 100m of the resource to verify. You are ${(distance * 1000).toFixed(0)}m away.`);
        }
        
        setIsVerifying(false);
      },
      (error) => {
        alert('Unable to get your location. Please enable location services.');
        setIsVerifying(false);
      }
    );
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!resource) {
    return <div className="text-center p-8">Resource not found</div>;
  }

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{resource.name}</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Category</h2>
            <p className="text-gray-600 capitalize">{resource.type.replace('_', ' ')}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Address</h2>
            <p className="text-gray-600">{resource.address}</p>
          </div>
          
          {resource.phone && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Phone</h2>
              <a href={`tel:${resource.phone}`} className="text-blue-600 hover:underline">
                {resource.phone}
              </a>
            </div>
          )}
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Verifications</h2>
            {resource.verifications && resource.verifications.length > 0 ? (
              <div className="space-y-2">
                {resource.verifications.map((verification: any) => (
                  <div key={verification.id} className="border-l-4 border-blue-200 pl-4">
                    <p className="font-medium text-green-600">Status: {verification.status}</p>
                    {verification.notes && (
                      <p className="text-gray-600 text-sm">&quot;{verification.notes}&quot;</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(verification.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent verifications</p>
            )}
          </div>

          {/* Add Verification Button */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Verify This Information</h3>
            <p className="text-sm text-gray-600 mb-3">
              Help keep our data accurate by verifying this resource
            </p>
            <button 
              onClick={handleVerifyLocation}
              disabled={isVerifying}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isVerifying ? '📍 Checking location...' : '📍 Verify Location & Status'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}