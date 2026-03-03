import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Users,
  Building2,
  ArrowLeft,
  DollarSign,
  Bus
} from "lucide-react";
import PropertyCard from "../components/properties/PropertyCard";

export default function CityPage() {
  const [city, setCity] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const getCityImage = (cityName) => {
    const cityImages = {
      "Ashdod": "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      "Ashkelon": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      "Be'er Sheva": "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      "Beit Shemesh": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      "Haifa": "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      "Herzliya": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      "Jerusalem": "https://images.unsplash.com/photo-1602654002697-39d57e51c1dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      "Modi'in": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      "Netanya": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      "Ra'anana": "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      "Tel Aviv": "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      "Zichron Ya'akov": "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    };

    return cityImages[cityName] || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const cityName = urlParams.get('name');

    if (cityName) {
      loadCityData(cityName);
    }
  }, [location.search]);

  const loadCityData = async (cityName) => {
    setIsLoading(true);
    try {
      const citiesData = await base44.entities.City.list();
      const cityData = citiesData.find(c => c.name.toLowerCase() === cityName.toLowerCase());
      
      if (!cityData) {
        setIsLoading(false);
        return;
      }
      
      setCity(cityData);
      
      // Load all properties for the city and filter on client side to handle legacy data
      const allPropertiesData = await base44.entities.Property.filter({ 
        city: cityData.name
      }, '-created_date');
      
      // Filter for approved or legacy (no approval_status)
      const propertiesData = allPropertiesData.filter(p => 
        !p.approval_status || p.approval_status === 'approved'
      );
      
      // Filter out expired properties
      const now = new Date();
      const validProperties = propertiesData.filter(property => {
        if (!property.created_date) return true;
        
        const createdDate = new Date(property.created_date);
        const diffMonths = (now.getFullYear() - createdDate.getFullYear()) * 12 + (now.getMonth() - createdDate.getMonth());
        
        if (property.status === 'for_sale' && diffMonths >= 3) return false;
        if (property.status === 'in_development' && diffMonths >= 6) return false;
        
        return true;
      });
      
      setProperties(validProperties);
    } catch (error) {
      console.error('Error loading city data:', error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-48 w-full" />
            </div>
            <div>
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">City not found</h2>
          <p className="text-gray-600 mb-6">The city you're looking for doesn't exist in our database.</p>
          <Link to={createPageUrl("Cities")}>
            <Button>Back to Cities</Button>
          </Link>
        </div>
      </div>
    );
  }

  const propertyStats = {
    total: properties.length,
    avgPrice: properties.length > 0
      ? properties.reduce((sum, p) => sum + (p.price || 0), 0) / properties.length
      : 0,
    forSale: properties.filter(p => p.status === 'for_sale').length,
    inDevelopment: properties.filter(p => p.status === 'in_development').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to={createPageUrl("Cities")}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{city.name}</h1>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{city.region}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 md:h-80 lg:h-96">
        <img
          src={getCityImage(city.name)}
          alt={city.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About {city.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {city.description}
                </p>

                {/* Key Features */}
                {city.key_features && city.key_features.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Key Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {city.key_features.map((feature, index) => (
                        <Badge key={index} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Neighborhoods */}
            {city.neighborhoods && city.neighborhoods.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Popular Neighborhoods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {city.neighborhoods.map((neighborhood, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">{neighborhood}</h5>
                        <p className="text-sm text-gray-600">
                          A popular neighborhood in {city.name} known for its residential appeal and community atmosphere.
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transportation */}
            {city.transportation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bus className="w-5 h-5" />
                    Transportation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{city.transportation}</p>
                </CardContent>
              </Card>
            )}

            {/* Properties in City */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Properties in {city.name}</CardTitle>
                  <Link to={createPageUrl(`Properties?city=${encodeURIComponent(city.name)}`)}>
                    <Button variant="outline">
                      View All Properties
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {properties.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No properties currently listed in {city.name}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {properties.slice(0, 4).map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* City Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {city.population && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold">{(city.population / 1000).toFixed(0)}K</div>
                  <div className="text-sm text-gray-500">Population</div>
                </div>
              )}

              {city.average_property_price && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <div className="font-semibold">₪{(city.average_property_price / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-gray-500">Avg. Price</div>
                </div>
              )}
            </div>

            {/* Property Market */}
            <Card>
              <CardHeader>
                <CardTitle>Property Market</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Price</span>
                  <span className="font-bold text-blue-600">
                    ₪{(city.average_property_price || propertyStats.avgPrice).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Properties Listed</span>
                  <span className="font-semibold">{propertyStats.total}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">For Sale</span>
                  <span className="font-semibold text-green-600">{propertyStats.forSale}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">In Development</span>
                  <span className="font-semibold text-blue-600">{propertyStats.inDevelopment}</span>
                </div>

                <Link to={createPageUrl(`Properties?city=${encodeURIComponent(city.name)}`)}>
                  <Button className="w-full mt-4">
                    Browse Properties
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}