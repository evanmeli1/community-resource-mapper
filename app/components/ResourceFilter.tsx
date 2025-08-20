'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface ResourceFilterProps {
  totalResources: number;
  filteredCount: number;
  currentCategory: string;
  showOpenOnly: boolean;
  sortBy: string;
  userLocation: {lat: number, lng: number} | null;
}

export default function ResourceFilter({
  totalResources,
  filteredCount,
  currentCategory,
  showOpenOnly,
  sortBy,
  userLocation
}: ResourceFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'all' || value === 'false' || value === 'name') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    router.push(`?${params.toString()}`);
  };

  return (
  <div className="bg-white p-3 md:p-4 rounded-lg shadow border">
    <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-4 items-center">
      {/* Category Filter */}
      <div className="col-span-1">
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={currentCategory}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="w-full border border-gray-300 rounded px-2 md:px-3 py-1 text-xs md:text-sm"
        >
          <option value="all">All Categories</option>
          <option value="food">Food</option>
          <option value="shelter">Shelter</option>
          <option value="health">Health</option>
        </select>
      </div>

      {/* Sort By */}
      <div className="col-span-1">
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          className="w-full border border-gray-300 rounded px-2 md:px-3 py-1 text-xs md:text-sm"
        >
          <option value="name">Name</option>
          <option value="distance" disabled={!userLocation}>
            Distance {!userLocation && '(📍)'}
          </option>
        </select>
      </div>

      {/* Open Now Toggle - Full width on mobile */}
      <div className="col-span-2 md:col-span-1">
        <label className="flex items-center justify-center md:justify-start">
          <input
            type="checkbox"
            checked={showOpenOnly}
            onChange={(e) => updateFilter('openNow', e.target.checked.toString())}
            className="mr-2"
          />
          <span className="text-xs md:text-sm">Open Now Only</span>
        </label>
      </div>

      {/* Results Count */}
      <div className="col-span-2 md:ml-auto text-center md:text-right">
        <p className="text-xs md:text-sm text-gray-600">
          {filteredCount} of {totalResources} resources
        </p>
      </div>
    </div>
  </div>
);
}