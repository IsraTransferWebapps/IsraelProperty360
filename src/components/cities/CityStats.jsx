import React from "react";
import { Building2, MapPin, Users, TrendingUp } from "lucide-react";

export default function CityStats({ cities, propertyStats }) {
  const totalCities = cities.length;
  const totalPopulation = cities.reduce((sum, city) => sum + (city.population || 0), 0);
  const totalProperties = Object.values(propertyStats).reduce((sum, stats) => sum + (stats?.count || 0), 0);

  const stats = [
    {
      label: "Cities Covered",
      value: totalCities,
      icon: MapPin,
      color: "text-blue-600"
    },
    {
      label: "Total Population",
      value: `${(totalPopulation / 1000000).toFixed(1)}M`,
      icon: Users,
      color: "text-green-600"
    },
    {
      label: "Properties Listed",
      value: totalProperties,
      icon: Building2,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="bg-white/10 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-2">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-white">{stat.value}</div>
          <div className="text-sm text-blue-100">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}