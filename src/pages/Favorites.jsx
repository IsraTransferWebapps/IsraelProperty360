
import React, { useState, useEffect, useCallback } from "react";
import { Favorite } from "@/entities/Favorite";
import { Property } from "@/entities/Property";
import { User } from "@/entities/User";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Heart, 
  Trash2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  ArrowRight,
  Search
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [properties, setProperties] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Get user's favorites
      const userFavorites = await Favorite.filter({ user_email: currentUser.email });
      setFavorites(userFavorites);

      // Get property details for each favorite
      if (userFavorites.length > 0) {
        const propertyPromises = userFavorites.map(fav => 
          Property.filter({ id: fav.property_id })
        );
        const propertyResults = await Promise.all(propertyPromises);
        
        // Flatten the results and filter out any empty arrays
        const propertiesData = propertyResults
          .flat()
          .filter(prop => prop);
        
        setProperties(propertiesData);
      } else {
        // If no favorites, ensure properties state is cleared
        setProperties([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      // User not logged in, redirect to login
      navigate(createPageUrl('Home'));
    }
    setIsLoading(false);
  }, [navigate]); // Added navigate to the useCallback dependencies

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]); // Added loadFavorites to the useEffect dependencies

  const handleRemoveFavorite = async (propertyId) => {
    try {
      // Find the favorite record to delete
      const favoriteToDelete = favorites.find(fav => fav.property_id === propertyId);
      if (favoriteToDelete) {
        await Favorite.delete(favoriteToDelete.id);
        
        // Update local state
        setFavorites(prev => prev.filter(fav => fav.property_id !== propertyId));
        setProperties(prev => prev.filter(prop => prop.id !== propertyId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            My Favorite Properties
          </h1>
          <p className="text-xl text-gray-600">
            Properties you've saved for later viewing
          </p>
        </div>

        {/* Favorites Grid */}
        {properties.length === 0 ? (
          <Card className="text-center py-20">
            <CardContent>
              <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Start browsing properties and save your favorites to see them here.
              </p>
              <Link to={createPageUrl("Properties")}>
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Browse Properties
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {properties.length} {properties.length === 1 ? 'property' : 'properties'} saved
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <img
                      src={property.images?.[0] || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                      alt={property.title}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            className="bg-white/80 hover:bg-white"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove from favorites?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove "{property.title}" from your saved properties.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleRemoveFavorite(property.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className={`${
                        property.status === 'for_sale' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {property.status === 'for_sale' ? 'For Sale' : 'In Development'}
                      </Badge>
                    </div>
                    {property.featured && (
                      <div className="absolute top-12 left-4">
                        <Badge className="bg-yellow-600 text-white">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-1">
                        {property.title}
                      </h3>
                    </div>

                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {property.city}{property.neighborhood && `, ${property.neighborhood}`}
                      </span>
                    </div>

                    <div className="text-2xl font-bold text-blue-600 mb-4">
                      ₪{property.price?.toLocaleString()}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {property.broker_name}
                          </p>
                          <p className="text-xs text-gray-500">Licensed Broker</p>
                        </div>
                      </div>
                      
                      <Link to={createPageUrl(`Property?id=${property.id}`)}>
                        <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Browse More Section */}
        {properties.length > 0 && (
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Looking for more properties?
                </h3>
                <p className="text-gray-600 mb-6">
                  Explore our full collection of properties across Israel
                </p>
                <Link to={createPageUrl("Properties")}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Search className="w-5 h-5 mr-2" />
                    Browse All Properties
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
