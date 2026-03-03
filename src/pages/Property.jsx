import React, { useState, useEffect, useCallback } from "react";
import { Property } from "@/entities/Property";
import { City } from "@/entities/City";
import { User } from "@/entities/User";
import { Favorite } from "@/entities/Favorite";
import { useLocation, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Hash
} from "lucide-react";
import PropertyImageGallery from "../components/property/PropertyImageGallery";
import PropertyDetails from "../components/property/PropertyDetails";
import PropertyContact from "../components/property/PropertyContact";
import NeighborhoodInfo from "../components/property/NeighborhoodInfo";
import SimilarProperties from "../components/property/SimilarProperties";

export default function PropertyPage() {
  const [property, setProperty] = useState(null);
  const [cityInfo, setCityInfo] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const loadUser = useCallback(async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      setUser(null);
      return null;
    }
  }, []);

  const loadPropertyData = useCallback(async (propertyId) => {
    setIsLoading(true);
    try {
      const [propertyData, userData] = await Promise.all([
        Property.filter({ id: propertyId }),
        loadUser()
      ]);

      if (propertyData.length > 0) {
        const prop = propertyData[0];
        setProperty(prop);

        // Load city information
        const cityData = await City.filter({ name: prop.city });
        if (cityData.length > 0) {
          setCityInfo(cityData[0]);
        }

        // Load similar properties
        const similar = await Property.filter({ 
          city: prop.city,
          property_type: prop.property_type 
        }, '-created_date', 4);
        setSimilarProperties(similar.filter(p => p.id !== prop.id));

        // Check if favorited
        if (userData) {
          const favorites = await Favorite.filter({ 
            property_id: prop.id, 
            user_email: userData.email 
          });
          setIsFavorited(favorites.length > 0);
        }
      }
    } catch (error) {
      console.error('Error loading property:', error);
    }
    setIsLoading(false);
  }, [loadUser]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const propertyId = urlParams.get('id');
    if (propertyId) {
      loadPropertyData(propertyId);
    }
  }, [location.search, loadPropertyData]);

  const toggleFavorite = async () => {
    if (!user) {
      await User.loginWithRedirect(window.location.href);
      return;
    }

    try {
      if (isFavorited) {
        const favorites = await Favorite.filter({ 
          property_id: property.id, 
          user_email: user.email 
        });
        if (favorites.length > 0) {
          await Favorite.delete(favorites[0].id);
        }
        setIsFavorited(false);
      } else {
        await Favorite.create({
          property_id: property.id,
          user_email: user.email
        });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full mb-6" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
            <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
            <Link to={createPageUrl("Properties")}>
              <Button>Browse All Properties</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to={createPageUrl("Properties")}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
        </div>

        {/* Property Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <Badge className={`${
                  property.status === 'for_sale' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 text-white'
                }`}>
                  {property.status === 'for_sale' ? 'For Sale' : 'New Construction'}
                </Badge>
                {property.featured && (
                  <Badge className="bg-yellow-600 text-white">
                    Featured
                  </Badge>
                )}
                {property.reference_number && (
                  <Badge variant="outline" className="font-mono">
                    <Hash className="w-3 h-3 mr-1" />
                    {property.reference_number}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">
                  {property.address || `${property.city}${property.neighborhood ? `, ${property.neighborhood}` : ''}`}
                </span>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                ₪{property.price?.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={toggleFavorite}
                className="flex items-center gap-2"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-current' : ''}`} />
                {isFavorited ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <PropertyImageGallery property={property} />

            {/* Property Details */}
            <PropertyDetails property={property} />

            {/* Neighborhood Information */}
            <NeighborhoodInfo city={property.city} cityInfo={cityInfo} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <PropertyContact property={property} />

            {/* Similar Properties */}
            <SimilarProperties properties={similarProperties} />
          </div>
        </div>
      </div>
    </div>
  );
}