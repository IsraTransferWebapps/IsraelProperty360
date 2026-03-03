import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Heart, 
  Bell, 
  Search, 
  MapPin,
  Bed,
  Bath,
  Square,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function VisitorDashboard() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      // Load favorites
      const userFavorites = await base44.entities.Favorite.filter({ user_email: currentUser.email });
      setFavorites(userFavorites);

      // Get property details for favorites
      if (userFavorites.length > 0) {
        const propertyPromises = userFavorites.slice(0, 3).map(fav => 
          base44.entities.Property.filter({ id: fav.property_id })
        );
        const propertyResults = await Promise.all(propertyPromises);
        const propertiesData = propertyResults.flat().filter(prop => prop);
        setProperties(propertiesData);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-xl text-gray-600">
            Your property search dashboard
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Saved Properties</p>
                  <p className="text-3xl font-bold text-gray-900">{favorites.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <Link to={createPageUrl('Favorites')}>
                <Button variant="link" className="p-0 h-auto mt-4 text-blue-600">
                  View all favorites →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Property Alerts</p>
                  <p className="text-3xl font-bold text-gray-900">Active</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <Link to={createPageUrl('PropertyAlerts')}>
                <Button variant="link" className="p-0 h-auto mt-4 text-blue-600">
                  Manage alerts →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">New Listings</p>
                  <p className="text-3xl font-bold text-gray-900">12</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <Link to={createPageUrl('Properties')}>
                <Button variant="link" className="p-0 h-auto mt-4 text-blue-600">
                  Browse properties →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Favorites */}
        {properties.length > 0 ? (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Favorites</CardTitle>
                <Link to={createPageUrl('Favorites')}>
                  <Button variant="ghost">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-all group">
                    <div className="relative">
                      <img
                        src={property.images?.[0] || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                        alt={property.title}
                        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{property.city}</span>
                      </div>
                      <div className="text-xl font-bold text-blue-600 mb-3">
                        ₪{property.price?.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                        {property.bedrooms && (
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            {property.bedrooms}
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            {property.bathrooms}
                          </div>
                        )}
                        {property.size_sqm && (
                          <div className="flex items-center">
                            <Square className="w-4 h-4 mr-1" />
                            {property.size_sqm}m²
                          </div>
                        )}
                      </div>
                      <Link to={createPageUrl(`Property?id=${property.id}`)}>
                        <Button className="w-full">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start saving properties you're interested in to see them here
              </p>
              <Link to={createPageUrl('Properties')}>
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Browse Properties
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <Search className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Find More Properties
              </h3>
              <p className="text-gray-600 mb-4">
                Explore our full collection of properties across Israel
              </p>
              <Link to={createPageUrl('Properties')}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Browse All Properties
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <Bell className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Set Up Alerts
              </h3>
              <p className="text-gray-600 mb-4">
                Get notified when new properties match your preferences
              </p>
              <Link to={createPageUrl('PropertyAlerts')}>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Create Alert
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}