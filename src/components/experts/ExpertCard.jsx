import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scale, Home, CreditCard, Banknote, Palette, Building, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const expertDetails = {
  lawyer: { icon: Scale, color: "bg-blue-100 text-blue-800" },
  realtor: { icon: Home, color: "bg-green-100 text-green-800" },
  mortgage_advisor: { icon: CreditCard, color: "bg-purple-100 text-purple-800" },
  money_exchange: { icon: Banknote, color: "bg-yellow-100 text-yellow-800" },
  interior_designer: { icon: Palette, color: "bg-pink-100 text-pink-800" },
  property_management: { icon: Building, color: "bg-indigo-100 text-indigo-800" }
};

export default function ExpertCard({ expert }) {
  const details = expertDetails[expert.expertise];
  const Icon = details.icon;

  return (
    <Card className="hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      <CardContent className="p-6 text-center flex-grow flex flex-col">
        <div className="relative mb-4">
          <img
            src={expert.image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
            alt={expert.name}
            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
          />
          <div className={`absolute bottom-0 right-1/2 translate-x-10 p-2 rounded-full ${details.color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <h3 className="font-bold text-xl text-gray-900 mb-1">{expert.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{expert.company}</p>
        <Badge variant="secondary" className={`mb-3 ${details.color}`}>
          {expert.expertise.replace('_', ' ').toUpperCase()}
        </Badge>
        
        {expert.experience_years && (
          <p className="text-sm text-gray-600 mb-3">
            {expert.experience_years} years experience
          </p>
        )}

        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
          {expert.description}
        </p>

        <div className="flex flex-wrap gap-1 justify-center mb-4">
          {expert.specialties?.slice(0, 3).map(spec => (
            <Badge key={spec} variant="outline" className="text-xs">{spec}</Badge>
          ))}
        </div>
        
        <div className="mt-auto pt-4 border-t">
          <Link to={createPageUrl(`Expert?id=${expert.id}`)}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Read More
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}