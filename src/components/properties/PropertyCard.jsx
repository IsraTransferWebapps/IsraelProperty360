import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Heart,
  ArrowRight,
  Calendar,
  Phone,
  Mail,
  Hash
} from "lucide-react";

export default function PropertyCard({ property }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        const favorites = await base44.entities.Favorite.filter({ 
          property_id: property.id, 
          user_email: currentUser.email 
        });
        setIsFavorited(favorites.length > 0);
      } catch (error) {
        setUser(null);
      }
    };
    loadUser();
  }, [property.id]);

  const toggleFavorite = async () => {
    if (!user) {
      await base44.auth.redirectToLogin(window.location.href);
      return;
    }

    try {
      if (isFavorited) {
        const favorites = await base44.entities.Favorite.filter({ 
          property_id: property.id, 
          user_email: user.email 
        });
        if (favorites.length > 0) {
          await base44.entities.Favorite.delete(favorites[0].id);
        }
        setIsFavorited(false);
      } else {
        await base44.entities.Favorite.create({
          property_id: property.id,
          user_email: user.email
        });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatListingDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Listed today';
    if (diffDays === 1) return 'Listed yesterday';
    if (diffDays < 7) return `Listed ${diffDays} days ago`;
    if (diffDays < 30) return `Listed ${Math.floor(diffDays / 7)} weeks ago`;
    return `Listed ${date.toLocaleDateString()}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        <img
          src={property.images?.[0] || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
          alt={property.title}
          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Button 
            size="icon" 
            variant="secondary" 
            className="bg-white/80 hover:bg-white"
            onClick={toggleFavorite}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : ''}`} />
          </Button>
        </div>
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {(() => {
            const now = new Date();
            const created = new Date(property.created_date);
            const daysSinceCreated = Math.floor((now - created) / (1000 * 60 * 60 * 24));
            
            if (daysSinceCreated <= 7) {
              return (
                <Badge className="bg-green-600 text-white font-bold shadow-lg">
                  🎉 JUST ADDED
                </Badge>
              );
            }
            return null;
          })()}
          {property.featured && (
            <Badge className="bg-amber-500 text-white font-bold shadow-lg">
              ⭐ FEATURED
            </Badge>
          )}
          <Badge className={`${
            property.status === 'for_sale' 
              ? 'bg-slate-600 text-white' 
              : 'bg-blue-600 text-white'
          } shadow-lg`}>
            {property.status === 'for_sale' ? 'For Sale' : 'New Construction'}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-1">
            {property.title}
          </h3>
        </div>

        {property.reference_number && (
          <div className="flex items-center text-gray-500 text-xs mb-2">
            <Hash className="w-3 h-3 mr-1" />
            <span className="font-mono">{property.reference_number}</span>
          </div>
        )}

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {property.city}{property.neighborhood && `, ${property.neighborhood}`}
          </span>
        </div>

        {property.created_date && (
          <div className="flex items-center text-gray-500 text-xs mb-3">
            <Calendar className="w-3 h-3 mr-1" />
            {formatListingDate(property.created_date)}
          </div>
        )}

        <div className="text-2xl font-bold text-blue-600 mb-4">
          {property.price_from && 'From '}₪{property.price?.toLocaleString()}
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

        {property.status === 'in_development' && property.completion_date && (
          <div className="flex items-center text-sm text-blue-600 mb-4">
            <Calendar className="w-4 h-4 mr-1" />
            Expected completion: {new Date(property.completion_date).toLocaleDateString()}
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {property.broker_name}
              </p>
              <p className="text-xs text-gray-500">Licensed Broker</p>
            </div>
            <div className="flex items-center gap-2">
              {property.broker_phone && (
                <Button size="icon" variant="ghost" className="w-8 h-8">
                  <Phone className="w-4 h-4" />
                </Button>
              )}
              <Button size="icon" variant="ghost" className="w-8 h-8">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Link to={createPageUrl(`Property?id=${property.id}`)}>
            <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white">
              View Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}