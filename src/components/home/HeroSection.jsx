import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, MapPin, Users, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BACKGROUND_IMAGES = [
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/d541c2cb7_1.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/869a09766_4.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/57486a3cf_17.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/ca9fdd7d5_20.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/570171db2_21.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/d77cf2c18_31.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/a53574281_36.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/5c277c632_39.jpg',
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    });
    navigate(`${createPageUrl('GetStarted')}?${params.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Rotating Image Background */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80"
              style={{
                backgroundImage: `url(${BACKGROUND_IMAGES[currentImageIndex]})`,
              }}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/65 to-slate-900/70"></div>
        
        {/* Image indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {BACKGROUND_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-yellow-500 w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              Your Complete Guide to
              <span className="text-yellow-500"> Israeli Real Estate</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white font-medium mb-8 leading-relaxed drop-shadow-lg bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg border border-white/10">
              Connect with verified lawyers, realtors, mortgage advisors, and money exchange experts. 
              Explore cities, discover properties, and make informed decisions with confidence.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <Link to={createPageUrl("Experts")}>
                <Button size="lg" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-lg px-6 py-4 h-auto">
                  <Users className="w-5 h-5 mr-2" />
                  Connect with Expert
                </Button>
              </Link>
              <Link to={createPageUrl("Properties")}>
                <Button size="lg" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-lg px-6 py-4 h-auto">
                  <MapPin className="w-5 h-5 mr-2" />
                  Browse Properties
                </Button>
              </Link>
              <Link to={createPageUrl("Blog")}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg px-6 py-4 h-auto"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Read Latest Blogs
                </Button>
              </Link>
              <Link to={createPageUrl("Cities")}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg px-6 py-4 h-auto"
                >
                  Discover Cities
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold">20+</div>
                <div className="text-gray-400 text-sm">New Properties weekly</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-gray-400 text-sm">Expert Partners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">12+</div>
                <div className="text-gray-400 text-sm">Cities Covered</div>
              </div>
            </div>
          </div>

          {/* Right Column - Lead Capture Form */}
          <div className="lg:pl-8">
            <div className="relative">
              {/* Decorative background elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
              
              <Card className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-50 shadow-2xl border-2 border-white/50 backdrop-blur-sm overflow-hidden">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-bl-full opacity-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-tr-full opacity-10"></div>
                
                <CardHeader className="text-center pb-4 relative">
                  {/* Logo */}
                  <div className="mb-4">
                    <img
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c254383f4_IsraelProperty360logo.png"
                      alt="IsraelProperty360"
                      className="h-20 w-auto mx-auto"
                    />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Start Your Journey Today
                  </CardTitle>
                  <p className="text-gray-700 mt-2 font-medium">
                    Get personalized guidance from our expert team
                  </p>
                </CardHeader>
                <CardContent className="relative">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="name" className="text-gray-800 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-800 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                        className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-gray-800 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+972-XX-XXX-XXXX"
                        className="h-12 mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <div className="flex items-center gap-2 pt-2">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                      <p className="text-xs text-gray-600 text-center px-2">
                        100% Free • No Obligation
                      </p>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}