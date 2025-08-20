'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'all' || value === 'false' || value === 'name') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    router.push(`?${params.toString()}`);
  };

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🏠' },
    { value: 'food', label: 'Food', icon: '🍽️' },
    { value: 'shelter', label: 'Shelter', icon: '🏠' },
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'saved', label: 'Saved Only', icon: '❤️' },
  ];

  const activeFiltersCount = [
    currentCategory !== 'all' ? 1 : 0,
    showOpenOnly ? 1 : 0,
    sortBy !== 'name' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <motion.div 
      className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        {/* Main Filter Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 flex-1">
            {categories.map(({ value, label, icon }) => (
              <motion.button
                key={value}
                onClick={() => updateFilter('category', value)}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  currentCategory === value
                    ? 'text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {currentCategory === value && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-blue-100 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center space-x-1">
                  <span className="text-xs">{icon}</span>
                  <span className="hidden sm:inline">{label}</span>
                </span>
              </motion.button>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            {/* Open Now Toggle */}
            <motion.label 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showOpenOnly}
                  onChange={(e) => updateFilter('openNow', e.target.checked.toString())}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  showOpenOnly ? 'bg-green-500' : 'bg-slate-300'
                }`}>
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full shadow-sm m-0.5"
                    animate={{ x: showOpenOnly ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </div>
              <span className="ml-2 text-sm text-slate-600">Open Now</span>
            </motion.label>

            {/* Advanced Filters Toggle */}
            <motion.button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`p-2 rounded-lg transition-colors relative ${
                showAdvanced || activeFiltersCount > 0
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              
              {/* Active filters indicator */}
              {activeFiltersCount > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {activeFiltersCount}
                </motion.div>
              )}
            </motion.button>
          </div>
        </div>

        {/* Advanced Filters - Collapsible */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-slate-200/50">
                <div className="flex items-center justify-between">
                  {/* Sort Options */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-slate-600">Sort by:</span>
                    <div className="flex space-x-1">
                      {[
                        { value: 'name', label: 'Name', icon: '📝' },
                        { value: 'distance', label: 'Distance', icon: '📍', disabled: !userLocation }
                      ].map(({ value, label, icon, disabled }) => (
                        <motion.button
                          key={value}
                          onClick={() => !disabled && updateFilter('sortBy', value)}
                          disabled={disabled}
                          className={`relative px-3 py-1.5 rounded-md text-sm transition-colors ${
                            sortBy === value
                              ? 'text-slate-900'
                              : disabled
                              ? 'text-slate-400 cursor-not-allowed'
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                          whileHover={!disabled ? { scale: 1.02 } : {}}
                          whileTap={!disabled ? { scale: 0.98 } : {}}
                        >
                          {sortBy === value && (
                            <motion.div
                              layoutId="activeSort"
                              className="absolute inset-0 bg-slate-100 rounded-md"
                              initial={false}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          )}
                          <span className="relative flex items-center space-x-1">
                            <span className="text-xs">{icon}</span>
                            <span>{label}</span>
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <motion.button
                      onClick={() => {
                        updateFilter('category', 'all');
                        updateFilter('openNow', 'false');
                        updateFilter('sortBy', 'name');
                      }}
                      className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Clear all
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <motion.div 
          className="mt-3 pt-3 border-t border-slate-200/50 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">{filteredCount}</span> of {totalResources} resources
          </p>
          
          {!userLocation && (
            <motion.div 
              className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              📍 Enable location for distance sorting
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}