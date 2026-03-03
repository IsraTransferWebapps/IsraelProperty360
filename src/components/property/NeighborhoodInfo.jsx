
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Users, 
  Shield, 
  GraduationCap, 
  DollarSign,
  Bus,
  Hospital,
  ShoppingCart,
  Coffee,
  Star,
  Info,
  ChevronDown,
  ChevronRight
} from "lucide-react";

export default function NeighborhoodInfo({ city, cityInfo }) {
  const [expandedNeighborhood, setExpandedNeighborhood] = useState(null);

  // Sample neighborhood details - in a real app, this would come from the database
  const neighborhoodDetails = {
    "City Center": "The bustling heart of the city with modern shopping centers, restaurants, and business districts. Known for its vibrant nightlife and cultural attractions. Properties here are typically high-rise apartments with excellent public transport connections.",
    "Old City": "Historic quarter with ancient architecture and cultural landmarks. Narrow cobblestone streets lined with traditional buildings, museums, and religious sites. Properties are often renovated historic buildings with unique character and charm.",
    "Neve Tzedek": "Trendy artistic neighborhood with galleries, boutique shops, and cafes. Originally built in the 1880s, it has been beautifully restored while maintaining its historic charm. Properties include converted period buildings and modern luxury developments.",
    "Florentine": "Hip, bohemian area popular with young professionals and artists. Known for its street art, indie music scene, and alternative culture. Properties are typically older buildings being renovated, offering good value in an up-and-coming area.",
    "Jaffa": "Ancient port city with a mix of Arab and Jewish populations. Rich history dating back thousands of years with stunning Mediterranean views. Properties range from restored Ottoman-era buildings to modern luxury developments.",
    "Rothschild Boulevard": "Prestigious tree-lined avenue with Bauhaus architecture and upscale dining. UNESCO World Heritage site known as the 'White City'. Properties are primarily renovated Bauhaus buildings and modern luxury apartments.",
    "Ramat Aviv": "Upscale residential area near Tel Aviv University. Family-friendly neighborhood with parks, shopping centers, and excellent schools. Properties include luxury apartments, penthouses, and some single-family homes.",
    "German Colony": "Quiet residential neighborhood established by German Templars in the 19th century. Known for its tree-lined streets and well-preserved architecture. Properties are typically spacious apartments in historic buildings."
  };

  if (!cityInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            About {city}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Loading neighborhood information...
          </p>
        </CardContent>
      </Card>
    );
  }

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-green-600 bg-green-100";
    if (rating >= 6) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="space-y-6">
      {/* City Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            About {cityInfo.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-6">
            {cityInfo.description}
          </p>

          {/* City Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {cityInfo.population && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold">{(cityInfo.population / 1000).toFixed(0)}K</div>
                <div className="text-sm text-gray-500">Population</div>
              </div>
            )}
            
            {cityInfo.average_property_price && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <div className="font-semibold">₪{(cityInfo.average_property_price / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-gray-500">Avg. Price</div>
              </div>
            )}
          </div>

          {/* Key Features */}
          {cityInfo.key_features && cityInfo.key_features.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
              <div className="flex flex-wrap gap-2">
                {cityInfo.key_features.map((feature, index) => (
                  <Badge key={index} variant="outline">{feature}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transportation */}
      {cityInfo.transportation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bus className="w-5 h-5 mr-2" />
              Transportation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{cityInfo.transportation}</p>
          </CardContent>
        </Card>
      )}

      {/* Neighborhoods with Expandable Details */}
      {cityInfo.neighborhoods && cityInfo.neighborhoods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Neighborhoods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cityInfo.neighborhoods.map((neighborhood, index) => (
                <div key={index} className="border rounded-lg transition-all duration-200 hover:shadow-md">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedNeighborhood(
                      expandedNeighborhood === neighborhood ? null : neighborhood
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{neighborhood}</span>
                      <Info className="w-4 h-4 text-blue-500" />
                    </div>
                    {expandedNeighborhood === neighborhood ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  
                  {expandedNeighborhood === neighborhood && (
                    <div className="px-4 pb-4 border-t bg-gray-50/50">
                      <div className="pt-3">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {neighborhoodDetails[neighborhood] || 
                            `${neighborhood} is a popular neighborhood in ${cityInfo.name} known for its unique character and amenities. This area offers a blend of residential properties, local businesses, and community facilities that make it attractive to both locals and newcomers.`
                          }
                        </p>
                        <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Shield className="w-3 h-3 mr-1" />
                            Safe area
                          </div>
                          <div className="flex items-center">
                            <Bus className="w-3 h-3 mr-1" />
                            Good transport
                          </div>
                          <div className="flex items-center">
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Local amenities
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
