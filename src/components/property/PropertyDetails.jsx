import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Building2, 
  Calendar,
  Check,
  X
} from "lucide-react";

export default function PropertyDetails({ property }) {
  const features = [
    { icon: Bed, label: "Bedrooms", value: property.bedrooms },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms },
    { icon: Square, label: "Size", value: property.size_sqm ? `${property.size_sqm} m²` : null },
    { icon: Building2, label: "Floor", value: property.floor },
    { icon: Car, label: "Parking", value: property.parking_spaces },
  ].filter(feature => feature.value);

  const amenities = [
    { label: "Balcony", value: property.balcony },
    { label: "Elevator", value: property.elevator },
    { label: "Furnished", value: property.furnished },
    { label: "Pool", value: property.pool },
    { label: "Gym", value: property.gym },
    { label: "Mamad (Safe Room)", value: property.mamad },
    { label: "Storage", value: property.storage },
    { label: "Air Conditioning", value: property.air_conditioning },
    { label: "Renovated", value: property.renovated },
    { label: "Accessible", value: property.accessible },
    { label: "Garden", value: property.garden },
    { label: "Terrace", value: property.terrace },
    { label: "Security System", value: property.security_system },
  ].filter(amenity => amenity.value !== undefined);

  return (
    <div className="space-y-6">
      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Property Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {features.map((feature) => (
              <div key={feature.label} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="font-semibold text-gray-900">{feature.value}</div>
                <div className="text-sm text-gray-500">{feature.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {property.description || "Beautiful property in a prime location. Contact the broker for more details about this exceptional opportunity."}
          </p>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities & Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {amenities.map((amenity) => (
              <div key={amenity.label} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  amenity.value ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {amenity.value ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </div>
                <span className={amenity.value ? 'text-gray-900' : 'text-gray-500'}>
                  {amenity.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Development Timeline (for in_development properties) */}
      {property.status === 'in_development' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Construction Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Project Status</span>
                <Badge className="bg-blue-100 text-blue-800">New Construction</Badge>
              </div>
              {property.completion_date && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Expected Completion</span>
                  <span className="font-semibold">
                    {new Date(property.completion_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}