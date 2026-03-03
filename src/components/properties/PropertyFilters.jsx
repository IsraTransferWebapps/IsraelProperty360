import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function PropertyFilters({ filters, onFilterChange }) {
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

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `₪${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `₪${(price / 1000).toFixed(0)}K`;
    }
    return `₪${price.toLocaleString()}`;
  };

  // Convert string filters to numbers for slider, with defaults
  const minPrice = parseInt(filters.minPrice) || 500000;
  const maxPrice = parseInt(filters.maxPrice) || 15000000;
  const priceRange = [minPrice, maxPrice];

  const handlePriceRangeChange = (values) => {
    onFilterChange('minPrice', values[0].toString());
    onFilterChange('maxPrice', values[1].toString());
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div>
        <Label htmlFor="city" className="text-sm font-medium text-gray-700 mb-2 block">
          City
        </Label>
        <Select value={filters.city} onValueChange={(value) => onFilterChange('city', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Any city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>Any city</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="propertyType" className="text-sm font-medium text-gray-700 mb-2 block">
          Property Type
        </Label>
        <Select value={filters.propertyType} onValueChange={(value) => onFilterChange('propertyType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>Any type</SelectItem>
            {propertyTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Price Range
        </Label>
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg py-3 px-4 border border-blue-200">
            <span className="text-sm font-bold text-blue-700">
              {formatPrice(priceRange[0])}
            </span>
            <span className="text-xs text-blue-600 font-medium">to</span>
            <span className="text-sm font-bold text-blue-700">
              {priceRange[1] === 15000000 ? 'No limit' : formatPrice(priceRange[1])}
            </span>
          </div>
          <div className="px-3 py-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              max={15000000}
              min={500000}
              step={100000}
              className="w-full [&>.relative]:h-3 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-600 [&_[role=slider]]:bg-white [&_[role=slider]]:shadow-lg [&>.relative>.bg-primary]:bg-gradient-to-r [&>.relative>.bg-primary]:from-blue-500 [&>.relative>.bg-primary]:to-blue-600 [&>.relative>.bg-primary]:h-3 [&>.relative]:bg-gray-300 [&>.relative]:rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 px-3 font-medium">
            <span>₪500K</span>
            <span>₪15M+</span>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700 mb-2 block">
          Min Bedrooms
        </Label>
        <Select value={filters.bedrooms} onValueChange={(value) => onFilterChange('bedrooms', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 block">
          Status
        </Label>
        <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Any status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>Any status</SelectItem>
            <SelectItem value="for_sale">For Sale</SelectItem>
            <SelectItem value="in_development">New Construction</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}