import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { City } from "@/entities/City";
import { Expert } from "@/entities/Expert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Building2, 
  Users, 
  Star,
  ArrowRight,
  Bed,
  Bath,
  Square,
  Heart
} from "lucide-react";
import HeroSection from "../components/home/HeroSection";
import FeaturedProperties from "../components/home/FeaturedProperties";
import PopularCities from "../components/home/PopularCities";
import FeaturedExperts from "../components/home/FeaturedExperts";
import SearchSection from "../components/home/SearchSection";

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [popularCities, setPopularCities] = useState([]);
  const [featuredExperts, setFeaturedExperts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isPropertyExpired = (property) => {
    if (!property.created_date) return false;
    
    const createdDate = new Date(property.created_date);
    const now = new Date();
    // Calculate difference in months
    const diffMonths = (now.getFullYear() - createdDate.getFullYear()) * 12 + (now.getMonth() - createdDate.getMonth());
    
    if (property.status === 'for_sale' && diffMonths >= 3) {
      return true;
    }
    
    if (property.status === 'in_development' && diffMonths >= 6) {
      return true;
    }
    
    return false;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all properties and filter on client side to handle legacy data
        const [allProperties, cities, experts] = await Promise.all([
          base44.entities.Property.list('-created_date'),
          base44.entities.City.list('-created_date', 6),
          base44.entities.Expert.filter({ featured: true }, '-created_date', 4)
        ]);
        
        // Filter for featured, approved, and not expired
        const validProperties = allProperties
          .filter(p => 
            p.featured && 
            (!p.approval_status || p.approval_status === 'approved') &&
            !isPropertyExpired(p)
          );
        
        // Group by developer OR broker email (whichever is available)
        const bySource = new Map();
        validProperties.forEach(prop => {
          const sourceKey = prop.developer_id || prop.broker_email || `unique_${prop.id}`;
          if (!bySource.has(sourceKey)) {
            bySource.set(sourceKey, []);
          }
          bySource.get(sourceKey).push(prop);
        });
        
        // Round-robin through sources to ensure variety
        const diversified = [];
        let hasMore = true;
        let round = 0;
        while (hasMore && diversified.length < 6) {
          hasMore = false;
          for (const [sourceKey, props] of bySource) {
            if (props.length > round) {
              diversified.push(props[round]);
              hasMore = true;
              if (diversified.length >= 6) break;
            }
          }
          round++;
        }
        
        setFeaturedProperties(diversified);
        setPopularCities(cities);
        setFeaturedExperts(experts);
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* White Separator */}
      <div className="bg-white py-12"></div>

      {/* Search Section */}
      <SearchSection />

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">20+</h3>
              <p className="text-gray-600">New Properties listed weekly</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">50+</h3>
              <p className="text-gray-600">Expert Partners</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">12+</h3>
              <p className="text-gray-600">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <FeaturedProperties properties={featuredProperties} isLoading={isLoading} />

      {/* Popular Cities */}
      <PopularCities cities={popularCities} isLoading={isLoading} />

      {/* Featured Experts */}
      <FeaturedExperts experts={featuredExperts} isLoading={isLoading} />

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Dream Property in Israel?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your property journey with expert guidance and comprehensive city insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Properties")}>
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                Browse Properties
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl("Experts")}>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
                Find Expert Help
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}