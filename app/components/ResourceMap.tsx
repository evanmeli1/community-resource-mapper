'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Resource {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  address: string;
}

interface ResourceMapProps {
  resources: Resource[];
}

export default function ResourceMap({ resources }: ResourceMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-122.4194, 37.7749], // San Francisco
      zoom: 12
    });

    // Add markers for each resource
    resources.forEach((resource) => {
      new mapboxgl.Marker()
        .setLngLat([resource.lng, resource.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<div>
              <h3>${resource.name}</h3>
              <p>${resource.address}</p>
              <p>Category: ${resource.category}</p>
            </div>`
          )
        )
        .addTo(map.current!);
    });
  }, [resources]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-96 rounded-lg shadow-lg"
    />
  );
}