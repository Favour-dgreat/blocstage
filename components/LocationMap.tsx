"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Search, X, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LocationMapProps {
  value: string;
  onChange: (location: string) => void;
  placeholder?: string;
  className?: string;
}

interface LocationSuggestion {
  place_name: string;
  display_name: string;
  lat: number;
  lon: number;
  type: string;
}

export default function LocationMap({ 
  value, 
  onChange, 
  placeholder = "Enter location in Nigeria...",
  className = ""
}: LocationMapProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search for locations using OpenStreetMap Nominatim API (free, no API key required)
  // Limited to Nigeria only
  const searchLocations = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ng&limit=5&addressdetails=1&extratags=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        const formattedSuggestions = data.map((item: any) => ({
          place_name: item.display_name,
          display_name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          type: item.type || 'location'
        }));
        setSuggestions(formattedSuggestions);
      }
    } catch (error) {
      console.error("Error searching locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onChange(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(query);
    }, 300);
  };

  // Handle location selection
  const handleLocationSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    onChange(location.display_name);
    setSuggestions([]);
    setIsOpen(false);
  };

  // Initialize map when location is selected
  useEffect(() => {
    if (selectedLocation) {
      console.log("Selected location:", selectedLocation);
    }
  }, [selectedLocation]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Location Input */}
      <div className="relative">
        <Input
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pr-10"
        />
        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto mb-2"></div>
              Searching locations...
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(suggestion)}
                className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.display_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Map Preview */}
      {selectedLocation && (
        <div className="mt-3 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900">Selected Location</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedLocation(null);
                onChange("");
              }}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-700">{selectedLocation.display_name}</span>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
