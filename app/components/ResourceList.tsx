'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Resource {
  id: string;
  name: string;
  category: string;
  type: string;
  address: string;
  phone?: string;
  website?: string;
  distance?: number;
}

interface ResourceListProps {
  resources: Resource[];
}

export default function ResourceList({ resources }: ResourceListProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

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

  // Toggle favorite function
  const toggleFavorite = (resourceId: string) => {
    setFavorites(prev => {
      if (prev.includes(resourceId)) {
        // Remove from favorites
        return prev.filter(id => id !== resourceId);
      } else {
        // Add to favorites
        return [...prev, resourceId];
      }
    });
  };

  // Share function
  const handleShare = async (resource: Resource) => {
    const shareUrl = `${window.location.origin}/resource/${resource.id}`;
    const shareText = `Check out ${resource.name} - ${resource.address}`;
    
    if (navigator.share) {
      // Use native sharing on mobile
      try {
        await navigator.share({
          title: resource.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert('🔗 Link copied to clipboard!');
      } catch (error) {
        // Fallback to manual selection
        prompt('Copy this link:', shareUrl);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Send to API
    alert(`Report submitted for ${selectedResource?.name}!`);
    setReportModalOpen(false);
  };

  return (
    <div className="h-96 overflow-y-auto">
      <div className="space-y-4">
        {resources.map((resource) => (
          <Link 
            key={resource.id} 
            href={`/resource/${resource.id}`}
            className="block bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg text-gray-900">
              {resource.name}
            </h3>
            
            <p className="text-sm text-gray-600 capitalize">
              {resource.type.replace('_', ' ')} • {resource.category}
            </p>
            
            <p className="text-sm text-gray-700 mt-2">
              📍 {resource.address}
            </p>
            
            {resource.distance && (
              <p className="text-sm text-blue-600 mt-1">
                📏 {resource.distance.toFixed(1)} km away
              </p>
            )}
            
            <div className="flex gap-2 mt-3 flex-wrap">
              {resource.phone && (
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  📞 Has Phone
                </span>
              )}
              {resource.website && (
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  🌐 Has Website
                </span>
              )}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(resource.id);
                }}
                className={`text-sm px-2 py-1 rounded hover:opacity-80 whitespace-nowrap ${
                  favorites.includes(resource.id) 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-pink-100 text-pink-800'
                }`}
              >
                {favorites.includes(resource.id) ? '❤️ Saved' : '🤍 Save'}
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleShare(resource);
                }}
                className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 whitespace-nowrap"
              >
                📤 Share
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedResource(resource);
                  setReportModalOpen(true);
                }}
                className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 whitespace-nowrap"
              >
                🚨 Report Issue
              </button>
              <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded whitespace-nowrap">
                👆 Click for details
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Report Issue Modal */}
      {reportModalOpen && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Report Issue: {selectedResource.name}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Issue Type</label>
                <select className="w-full border rounded px-3 py-2">
                  <option>Incorrect hours</option>
                  <option>Wrong address</option>
                  <option>No longer exists</option>
                  <option>Incorrect phone number</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Details</label>
                <textarea 
                  className="w-full border rounded px-3 py-2 h-24"
                  placeholder="Please describe the issue..."
                ></textarea>
              </div>
              
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}