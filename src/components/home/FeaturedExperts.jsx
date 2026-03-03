
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  Mail,
  Phone,
  ExternalLink,
  ArrowRight,
  Scale,
  Home,
  CreditCard,
  Banknote,
  Palette, // Added for interior_designer
  Building // Added for property_management
} from "lucide-react";

const expertIcons = {
  lawyer: Scale,
  realtor: Home,
  mortgage_advisor: CreditCard,
  money_exchange: Banknote,
  interior_designer: Palette,
  property_management: Building
};

const expertColors = {
  lawyer: "bg-blue-100 text-blue-800",
  realtor: "bg-green-100 text-green-800",
  mortgage_advisor: "bg-purple-100 text-purple-800",
  money_exchange: "bg-yellow-100 text-yellow-800",
  interior_designer: "bg-pink-100 text-pink-800",
  property_management: "bg-indigo-100 text-indigo-800"
};

export default function FeaturedExperts({ experts, isLoading }) {
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array(4).fill(0).map((_, i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-6">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto mb-4" />
                  <Skeleton className="h-5 w-20 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Experts
          </h2>
          <p className="text-xl text-gray-600">
            Connect with verified professionals to guide your property journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {experts.map((expert) => {
            const IconComponent = expertIcons[expert.expertise] || Scale;

            return (
              <Card key={expert.id} className="text-center hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <img
                      src={expert.image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                      alt={expert.name}
                      className="w-16 h-16 rounded-full mx-auto object-cover"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className={`p-2 rounded-full ${expertColors[expert.expertise]}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {expert.name}
                  </h3>

                  <Badge
                    variant="secondary"
                    className={`mb-2 ${expertColors[expert.expertise]}`}
                  >
                    {expert.expertise.replace('_', ' ').toUpperCase()}
                  </Badge>

                  <p className="text-sm text-gray-600 mb-3">
                    {expert.company}
                  </p>

                  {expert.experience_years && (
                    <p className="text-sm text-gray-500 mb-4">
                      {expert.experience_years} years experience
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Expert
                    </div>

                    <Link to={createPageUrl(`Expert?id=${expert.id}`)}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Profile
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to={createPageUrl("Experts")}>
            <Button size="lg" className="bg-slate-800 hover:bg-slate-900 text-white">
              View All Experts
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
