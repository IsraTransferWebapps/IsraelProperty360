import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Target, Users, TrendingUp, Handshake, Briefcase, Home, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const processSteps = [
  { icon: TrendingUp, title: 'Market Research', description: 'Explore cities and properties to find your ideal investment or home.' },
  { icon: Handshake, title: 'Expert Consultation', description: 'Connect with our verified lawyers, realtors, and financial advisors.' },
  { icon: Briefcase, title: 'Financial Planning', description: 'Secure mortgages and plan your currency exchange with expert guidance.' },
  { icon: Home, title: 'Property Acquisition', description: 'Navigate the legal process and close the deal with confidence.' }
];

function ProcessStep({ step, index }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-yellow-500 text-white">
        <step.icon className="h-8 w-8" aria-hidden="true" />
      </div>
      <h3 className="mt-6 text-lg font-medium leading-6 text-gray-900">{step.title}</h3>
      <p className="mt-2 text-base text-gray-600">{step.description}</p>
    </motion.div>
  );
}

export default function AboutPage() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await base44.entities.Testimonial.filter({ active: true }, 'display_order');
        setTestimonials(data);
      } catch (error) {
        console.error('Error loading testimonials:', error);
      }
      setTestimonialsLoading(false);
    };
    
    loadTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    setError('');
    
    try {
      // Check if email already exists
      const existing = await base44.entities.NewsletterSubscription.filter({ email: email });
      
      if (existing.length > 0) {
        setError('This email is already subscribed!');
        setIsSubscribing(false);
        return;
      }

      // Create new subscription
      await base44.entities.NewsletterSubscription.create({
        email: email,
        source: 'about_page'
      });
      
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error('Subscription failed:', err);
      setError('Something went wrong. Please try again.');
    }
    setIsSubscribing(false);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
        <div className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">Your Trusted Partner in Israeli Real Estate</h1>
            <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
              <p className="text-lg leading-8 text-gray-600">IsraelProperty360 is more than just a listing site. We are a comprehensive resource designed to empower you at every stage of your property journey in Israel. From initial search to final signature, our platform and network of verified experts are here to ensure a smooth, transparent, and successful experience.</p>
              <div className="mt-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-4">
                <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Backed by IsraTransfer - Licensed Currency Exchange Provider
                </p>
                <p className="text-sm text-blue-800 mt-1">Trusted financial services for your property transactions</p>
              </div>
            </div>
            
            {/* Rotating Image with Testimonials */}
            <div className="relative mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl overflow-hidden sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36">
              {testimonialsLoading ? (
                <Skeleton className="w-full h-full" />
              ) : testimonials.length > 0 ? (
                <>
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentTestimonial ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img 
                        src={testimonial.image_url} 
                        alt={`Client testimonial from ${testimonial.name}`}
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-8">
                        <div>
                          <p className="text-white text-lg italic leading-relaxed mb-2">
                            "{testimonial.quote}"
                          </p>
                          <p className="text-white/90 text-sm font-medium">
                            — {testimonial.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentTestimonial 
                            ? 'bg-white w-8' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`View testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80" 
                  alt="Modern Israeli property" 
                  className="w-full h-full object-cover" 
                />
              )}
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
      </div>

      {/* Mission Section */}
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-24 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">To simplify property acquisition in Israel by providing a centralized platform with trusted expert guidance, comprehensive market data, and a seamless user experience for buyers worldwide.</p>
        </div>
      </div>

      {/* The Buying Process */}
      <div id="buying-process" className="mx-auto my-16 max-w-7xl px-6 sm:my-24 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-12">The 360° Buying Process</h2>
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-6 lg:gap-x-8">
          {processSteps.map((step, index) => (
            <ProcessStep key={step.title} step={step} index={index} />
          ))}
        </div>
      </div>

      {/* Connect with Us Section */}
      <div id="connect-with-us" className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Connect With Us</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Stay updated with the latest market insights, new properties, and expert advice. 
              Join our community of property investors and homebuyers.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Newsletter Subscription */}
            <Card className="p-8">
              <CardHeader className="text-center pb-6">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Mail className="w-6 h-6 text-blue-600" />
                  Subscribe to Our Newsletter
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subscribed ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-600">You've successfully subscribed to our newsletter.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                    {error && (
                      <p className="text-sm text-red-600">{error}</p>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                      disabled={isSubscribing}
                    >
                      {isSubscribing ? (
                        <>
                          <Mail className="w-4 h-4 mr-2 animate-pulse" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Subscribe
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Get weekly market updates, new property alerts, and expert insights.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="p-8">
              <CardHeader className="text-center pb-6">
                <CardTitle>Follow Us on Social Media</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center mb-8">
                  Join our community and stay connected with the latest updates, 
                  property showcases, and market insights.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <a 
                    href="https://facebook.com/israelproperty360" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <Facebook className="w-6 h-6 text-blue-600" />
                    <span className="font-medium">Facebook</span>
                  </a>
                  
                  <a 
                    href="https://twitter.com/israelproperty360" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <Twitter className="w-6 h-6 text-blue-400" />
                    <span className="font-medium">Twitter</span>
                  </a>
                  
                  <a 
                    href="https://linkedin.com/company/israelproperty360" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <Linkedin className="w-6 h-6 text-blue-700" />
                    <span className="font-medium">LinkedIn</span>
                  </a>
                  
                  <a 
                    href="https://instagram.com/israelproperty360" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-colors"
                  >
                    <Instagram className="w-6 h-6 text-pink-600" />
                    <span className="font-medium">Instagram</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact CCO Section */}
          <div className="mt-12">
            <Card className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-200">
              <CardContent className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch with Leadership</h3>
                <p className="text-gray-600 mb-4">Have questions or need direct assistance? Connect with our Chief Commercial Officer</p>
                <div className="bg-white rounded-lg p-6 inline-block">
                  <p className="text-lg font-semibold text-gray-900 mb-1">Daniel Eisenberg</p>
                  <p className="text-sm text-gray-600 mb-3">Chief Commercial Officer</p>
                  <a href="mailto:daniel@israelproperty360.com">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Daniel
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}