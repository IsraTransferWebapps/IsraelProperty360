import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function SearchSection() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] = useState({
    cities: [],
    propertyTypes: [],
    statuses: [],
    maxPrice: [7750000], // Starting in the middle
    bedrooms: []
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '-50px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleSearch = () => {
    setIsSearching(true);
    const params = new URLSearchParams();
    
    if (searchParams.cities.length > 0) {
      searchParams.cities.forEach(city => params.append('city', city));
    }
    if (searchParams.propertyTypes.length > 0) {
      searchParams.propertyTypes.forEach(type => params.append('propertyType', type));
    }
    if (searchParams.statuses.length > 0) {
      searchParams.statuses.forEach(status => params.append('status', status));
    }
    if (searchParams.bedrooms.length > 0) {
      searchParams.bedrooms.forEach(bed => params.append('bedrooms', bed));
    }
    if (searchParams.maxPrice[0] > 0 && searchParams.maxPrice[0] < 15000000) {
      params.append('maxPrice', searchParams.maxPrice[0].toString());
    }
    
    setTimeout(() => {
      navigate(`${createPageUrl("Properties")}?${params.toString()}`);
    }, 300);
  };

  const toggleArrayValue = (key, value) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  const cities = [
    "Ashdod",
    "Ashkelon", 
    "Be'er Sheva",
    "Beit Shemesh",
    "Haifa",
    "Herzliya",
    "Jerusalem",
    "Modi'in",
    "Netanya",
    "Ra'anana",
    "Tel Aviv",
    "Zichron Ya'akov"
  ];

  const propertyTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "penthouse", label: "Penthouse" }
  ];

  const statuses = [
    { value: "for_sale", label: "For Sale" },
    { value: "in_development", label: "New Construction" }
  ];

  const bedroomOptions = ["1", "2", "3", "4", "5"];

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `₪${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `₪${(price / 1000).toFixed(0)}K`;
    }
    return `₪${price.toLocaleString()}`;
  };

  const MultiSelectPopover = ({ label, items, selectedItems, onToggle, valueKey = "value", labelKey = "label" }) => {
    const isSimpleArray = typeof items[0] === 'string';
    
    return (
      <div className="group">
        <label className="block text-base font-bold text-gray-800 mb-3 transition-all group-hover:text-lg group-hover:text-blue-600">
          {label}
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12 justify-between border-2 border-gray-200 hover:border-blue-500 shadow-md hover:shadow-lg transition-all bg-white"
            >
              <span className="truncate">
                {selectedItems.length > 0
                  ? `${selectedItems.length} selected`
                  : `Select ${label.toLowerCase()}`}
              </span>
              <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="start">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => {
                const value = isSimpleArray ? item : item[valueKey];
                const displayLabel = isSimpleArray ? item : item[labelKey];
                const isChecked = selectedItems.includes(value);
                
                return (
                  <div key={value} className="flex items-center space-x-3">
                    <Checkbox
                      id={`${label}-${value}`}
                      checked={isChecked}
                      onCheckedChange={() => onToggle(value)}
                    />
                    <label
                      htmlFor={`${label}-${value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {displayLabel}
                    </label>
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <section 
      ref={sectionRef}
      className={`py-16 relative transition-all duration-1000 ease-in-out ${
        isVisible 
          ? 'bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-gray-50 to-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-colors duration-1000 ${isVisible ? 'text-white' : 'text-gray-900'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your Perfect Property
          </h2>
          <p className={`text-xl transition-colors duration-1000 ${isVisible ? 'text-gray-200' : 'text-gray-600'}`}>
            Search through thousands of properties across Israel
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-2xl p-8 border-2 border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MultiSelectPopover
                label="City"
                items={cities}
                selectedItems={searchParams.cities}
                onToggle={(value) => toggleArrayValue('cities', value)}
              />

              <MultiSelectPopover
                label="Property Type"
                items={propertyTypes}
                selectedItems={searchParams.propertyTypes}
                onToggle={(value) => toggleArrayValue('propertyTypes', value)}
              />

              <MultiSelectPopover
                label="Status"
                items={statuses}
                selectedItems={searchParams.statuses}
                onToggle={(value) => toggleArrayValue('statuses', value)}
              />

              <MultiSelectPopover
                label="Bedrooms"
                items={bedroomOptions}
                selectedItems={searchParams.bedrooms}
                onToggle={(value) => toggleArrayValue('bedrooms', value)}
              />

              <div className="lg:col-span-2 group">
                <label className="block text-base font-bold text-gray-800 mb-3 transition-all group-hover:text-lg group-hover:text-blue-600">
                  Price
                </label>
                <div className="space-y-4 p-4 rounded-lg border-2 border-blue-200 shadow-md hover:shadow-xl hover:border-blue-400 transition-all bg-gradient-to-br from-white via-blue-50 to-indigo-50">
                  <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg py-3 px-4 border border-blue-300 shadow-sm">
                    <span className="text-lg font-bold text-blue-700">
                      {searchParams.maxPrice[0] === 15000000 ? 'No limit' : `Up to ${formatPrice(searchParams.maxPrice[0])}`}
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <style>{`
                      .price-slider [data-orientation="horizontal"] {
                        height: 6px;
                        background: linear-gradient(to right, #3b82f6, #6366f1);
                        border-radius: 9999px;
                      }
                      .price-slider [role="slider"] {
                        height: 24px;
                        width: 24px;
                        border: 3px solid #2563eb;
                        background: white;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        cursor: grab;
                      }
                      .price-slider [role="slider"]:active {
                        cursor: grabbing;
                      }
                    `}</style>
                    <Slider
                      value={searchParams.maxPrice}
                      onValueChange={(value) => setSearchParams(prev => ({ ...prev, maxPrice: value }))}
                      max={15000000}
                      min={500000}
                      step={100000}
                      className="w-full price-slider"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 px-2">
                    <span>₪500K</span>
                    <span>No limit</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Search className={`w-5 h-5 mr-2 transition-transform duration-500 ${isSearching ? 'animate-spin' : ''}`} />
                <span className={`transition-all duration-300 ${isSearching ? 'text-lg' : 'text-base'}`}>
                  SEARCH
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}