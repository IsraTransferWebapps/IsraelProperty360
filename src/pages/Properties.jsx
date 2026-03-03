import React, { useState, useEffect, useCallback } from "react";
import { Property } from "@/entities/Property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart,
  SlidersHorizontal
} from "lucide-react";
import PropertyCard from "../components/properties/PropertyCard";
import PropertyFilters from "../components/properties/PropertyFilters";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    status: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("diversified");

  const isPropertyExpired = useCallback((property) => {
    if (!property.created_date) return false;
    
    const createdDate = new Date(property.created_date);
    const now = new Date();
    // Calculate difference in months. This accounts for full years and partial months.
    const diffMonths = (now.getFullYear() - createdDate.getFullYear()) * 12 + (now.getMonth() - createdDate.getMonth());
    
    // For sale properties expire after 3 months
    if (property.status === 'for_sale' && diffMonths >= 3) {
      return true;
    }
    
    // In development properties expire after 6 months
    if (property.status === 'in_development' && diffMonths >= 6) {
      return true;
    }
    
    return false;
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = properties;

    // Filter out expired properties first
    filtered = filtered.filter(property => !isPropertyExpired(property));

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        switch (key) {
          case 'city':
            filtered = filtered.filter(p => p.city.toLowerCase() === value.toLowerCase());
            break;
          case 'propertyType':
            filtered = filtered.filter(p => p.property_type === value);
            break;
          case 'minPrice':
            filtered = filtered.filter(p => p.price >= parseInt(value));
            break;
          case 'maxPrice':
            filtered = filtered.filter(p => p.price <= parseInt(value));
            break;
          case 'bedrooms':
            filtered = filtered.filter(p => p.bedrooms >= parseInt(value));
            break;
          case 'status':
            filtered = filtered.filter(p => p.status === value);
            break;
        }
      }
    });

    // Apply sorting
    switch (sortBy) {
      case 'diversified':
          // Group by developer OR broker email for maximum variety
          const bySource = new Map();
          filtered.forEach(prop => {
            const sourceKey = prop.developer_id || prop.broker_email || `unique_${prop.id}`;
            if (!bySource.has(sourceKey)) {
              bySource.set(sourceKey, []);
            }
            bySource.get(sourceKey).push(prop);
          });

          // Round-robin through sources to ensure no consecutive properties from same source
          const diversified = [];
          let hasMore = true;
          let round = 0;
          while (hasMore) {
            hasMore = false;
            for (const [sourceKey, props] of bySource) {
              if (props.length > round) {
                diversified.push(props[round]);
                hasMore = true;
              }
            }
            round++;
          }

          filtered = diversified;
          break;
        
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        break;
        
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
        
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
        
      case 'size':
        filtered.sort((a, b) => (b.size_sqm || 0) - (a.size_sqm || 0));
        break;
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, filters, sortBy, isPropertyExpired]);

  useEffect(() => {
    loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Separate effect to handle URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newFilters = {
      city: "",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      status: ""
    };
    
    urlParams.forEach((value, key) => {
      // Only apply URL params that are valid filter keys
      if (key in newFilters) {
        newFilters[key] = value;
      }
    });
    
    setFilters(newFilters);
  }, [window.location.search]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadProperties = async () => {
    try {
      // Load all properties and filter on client side to handle both new and legacy data
      const allData = await Property.list('-created_date');
      
      // Filter for approved properties or properties without approval_status (legacy)
      const approvedData = allData.filter(p => 
        !p.approval_status || p.approval_status === 'approved'
      );
      
      setProperties(approvedData);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
    setIsLoading(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      city: "",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      status: ""
    });
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Properties for Sale
          </h1>
          <p className="text-xl text-gray-600">
            Discover your perfect property across Israel
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by title, city, or neighborhood..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6"
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="h-12"
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <PropertyFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {isLoading ? 'Loading...' : `${filteredProperties.length} properties found`}
          </p>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diversified">Diversified</SelectItem>
              <SelectItem value="newest">Date Added</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="size">Largest Size</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(9).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <div className="flex gap-4 mb-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}