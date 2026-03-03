import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Star, Users, ArrowRight } from "lucide-react";

export default function PopularCities({ cities, isLoading }) {
  const getCityImage = (city) => {
    // Use database image_url if available, otherwise fallback to hardcoded images
    if (city.image_url) {
      return city.image_url;
    }
    
    const cityImages = {
      "Ashdod": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/caaba3f4d_16.jpg",
      "Ashkelon": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/86bc25503_19.jpg",
      "Be'er Sheva": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/a1c81793c_7.jpg",
      "Beit Shemesh": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/1cddd4aff_13.jpg",
      "Haifa": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/773eb4067_24.jpg",
      "Herzliya": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/89ee99ef1_1.jpg",
      "Jerusalem": "https://images.unsplash.com/photo-1602654002697-39d57e51c1dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Modi'in": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Netanya": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Ra'anana": "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Tel Aviv": "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "Zichron Ya'akov": "https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    };
    
    return cityImages[city.name] || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-5 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Sort cities alphabetically
  const sortedCities = [...cities].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Cities
          </h2>
          <p className="text-xl text-gray-600">
            Discover the best locations across Israel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedCities.map((city) => (
            <Card key={city.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img
                  src={getCityImage(city)}
                  alt={city.name}
                  className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-bold text-xl text-white mb-1">
                    {city.name}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    {city.region}
                  </p>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {city.population && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="w-4 h-4 text-green-500 mr-1" />
                        <span className="font-semibold text-sm">
                          {(city.population / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Population</p>
                    </div>
                  )}
                  
                  {city.average_property_price && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="font-semibold text-sm">
                          ₪{(city.average_property_price / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Avg Price</p>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {city.description}
                </p>

                <Link to={createPageUrl(`City?name=${encodeURIComponent(city.name)}`)}>
                  <Button variant="outline" className="w-full">
                    Explore {city.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to={createPageUrl("Cities")}>
            <Button size="lg" className="bg-slate-800 hover:bg-slate-900 text-white">
              View All Cities
              <MapPin className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}