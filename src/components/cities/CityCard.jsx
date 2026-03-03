import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  Building2,
  ArrowRight,
} from "lucide-react";

export default function CityCard({ city, propertyStats = {} }) {
  const getCityImage = () => {
    // Use database image_url if available
    if (city.image_url) {
      return city.image_url;
    }
    
    // Fallback to hardcoded images for legacy support
    const cityImages = {
      "Ashdod": "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Ashkelon": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Be'er Sheva": "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Beit Shemesh": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Haifa": "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Herzliya": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Jerusalem": "https://images.unsplash.com/photo-1602654002697-39d57e51c1dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Modi'in": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Netanya": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Ra'anana": "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Tel Aviv": "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Zichron Ya'akov": "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    };

    return cityImages[city.name] || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        <img
          src={getCityImage()}
          alt={city.name}
          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-bold text-2xl text-white mb-1">
            {city.name}
          </h3>
          <div className="flex items-center text-gray-200">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{city.region}</span>
          </div>
        </div>
        {city.featured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-yellow-600 text-white">
              Popular
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {city.description}
        </p>

        {/* Key Stats - Population Centered */}
        {city.population && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mb-1">
              <Users className="w-4 h-4" />
            </div>
            <div className="font-semibold text-sm">
              {(city.population / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-gray-500">Population</div>
          </div>
        )}

        {/* Property Market Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Property Market</span>
            <Building2 className="w-4 h-4 text-gray-400" />
          </div>

          {city.average_property_price ? (
            <div className="text-lg font-bold text-blue-600">
              ₪{city.average_property_price.toLocaleString()}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Price data available</div>
          )}

          {propertyStats.count && (
            <div className="text-xs text-gray-500 mt-1">
              {propertyStats.count} properties available
            </div>
          )}
        </div>

        {/* Key Features */}
        {city.key_features && city.key_features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {city.key_features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {city.key_features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{city.key_features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <Link to={createPageUrl(`City?name=${encodeURIComponent(city.name)}`)}>
          <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white">
            Explore {city.name}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}