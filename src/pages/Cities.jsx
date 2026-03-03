import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  MapPin, 
  Users, 
  Star, 
  TrendingUp, 
  Building2,
  ArrowRight,
  Filter
} from "lucide-react";
import CityCard from "../components/cities/CityCard";
import CityStats from "../components/cities/CityStats";

export default function CitiesPage() {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [propertyStats, setPropertyStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [regionFilter, setRegionFilter] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cities, searchTerm, sortBy, regionFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [citiesData, allProperties] = await Promise.all([
        base44.entities.City.list(),
        base44.entities.Property.list()
      ]);
      
      setCities(citiesData);
      
      // Filter for approved or legacy properties (no approval_status)
      const approvedProperties = allProperties.filter(p => 
        !p.approval_status || p.approval_status === 'approved'
      );
      
      // Filter out expired properties
      const now = new Date();
      const validProperties = approvedProperties.filter(property => {
        if (!property.created_date) return true;
        
        const createdDate = new Date(property.created_date);
        const diffMonths = (now.getFullYear() - createdDate.getFullYear()) * 12 + (now.getMonth() - createdDate.getMonth());
        
        if (property.status === 'for_sale' && diffMonths >= 3) return false;
        if (property.status === 'in_development' && diffMonths >= 6) return false;
        
        return true;
      });
      
      // Calculate property stats per city
      const stats = {};
      validProperties.forEach(property => {
        if (!stats[property.city]) {
          stats[property.city] = { count: 0, avgPrice: 0, totalPrice: 0 };
        }
        stats[property.city].count++;
        stats[property.city].totalPrice += property.price || 0;
      });
      
      // Calculate average prices
      Object.keys(stats).forEach(city => {
        stats[city].avgPrice = stats[city].totalPrice / stats[city].count;
      });
      
      setPropertyStats(stats);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...cities];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Region filter
    if (regionFilter) {
      filtered = filtered.filter(city => city.region === regionFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'population':
          return (b.population || 0) - (a.population || 0);
        case 'price':
          return (b.average_property_price || 0) - (a.average_property_price || 0);
        // Removed 'safety' sort option as per requirements
        default:
          return 0;
      }
    });

    setFilteredCities(filtered);
  };

  const regions = [...new Set(cities.map(city => city.region).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-6 w-96 mx-auto mb-8 bg-white/20" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Israeli Cities
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover the best places to live in Israel. From vibrant Tel Aviv to historic Jerusalem, 
              find detailed insights about each city's lifestyle, amenities, and property market.
            </p>
            <CityStats cities={cities} propertyStats={propertyStats} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Cities
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by city name or region..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region
              </label>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="All regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All Regions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="population">Population</SelectItem>
                  <SelectItem value="price">Average Price</SelectItem>
                  {/* Removed 'Safety Rating' as per requirements */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredCities.length} {filteredCities.length === 1 ? 'City' : 'Cities'}
          </h2>
          {(searchTerm || regionFilter) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setRegionFilter("");
                setSortBy("name");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {filteredCities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <CityCard 
                key={city.id} 
                city={city} 
                propertyStats={propertyStats[city.name] || {}}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Cities Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}