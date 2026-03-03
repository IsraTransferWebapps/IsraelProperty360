
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Bed, 
  Bath, 
  Square, 
  MapPin 
} from "lucide-react";

export default function SimilarProperties({ properties }) {
  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {properties.slice(0, 3).map((property) => (
          <Link to={createPageUrl(`Property?id=${property.id}`)} key={property.id} className="block"> {/* Added block to Link for full card clickability */}
            <div className="border rounded-lg overflow-hidden hover:shadow-md transition-all h-full flex flex-col">
              <img
                src={property.images?.[0] || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                alt={property.title}
                className="w-full h-32 object-cover"
              />
              
              <div className="p-4 flex-grow flex flex-col justify-between"> {/* New div to hold content and apply padding */}
                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {property.title}
                </h4>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="text-sm">{property.city}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  {property.bedrooms && (
                    <div className="flex items-center">
                      <Bed className="w-3 h-3 mr-1" />
                      {property.bedrooms}
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center">
                      <Bath className="w-3 h-3 mr-1" />
                      {property.bathrooms}
                    </div>
                  )}
                  {property.size_sqm && (
                    <div className="flex items-center">
                      <Square className="w-3 h-3 mr-1" />
                      {property.size_sqm}m²
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto"> {/* mt-auto pushes this div to the bottom */}
                  <div className="font-bold text-blue-600">
                    ₪{property.price?.toLocaleString()}
                  </div>
                  {/* Removed the nested Link here as the entire card is now a link */}
                  <Button size="sm" variant="outline" className="pointer-events-none"> {/* Disable pointer events so link click isn't overridden by button */}
                    View
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        ))}

        <Link to={createPageUrl(`Properties?city=${encodeURIComponent(properties[0]?.city)}`)}>
          <Button variant="outline" className="w-full mt-4">
            View All in {properties[0]?.city}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
