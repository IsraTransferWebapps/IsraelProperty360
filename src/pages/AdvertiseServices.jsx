import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  Home, 
  CreditCard, 
  Banknote, 
  Users, 
  TrendingUp, 
  Award, 
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Shield
} from 'lucide-react';

const serviceTypes = [
  {
    icon: Scale,
    title: "Legal Services",
    type: "lawyer",
    description: "Property law, contracts, due diligence",
    benefits: ["High-value clients", "Complex legal cases", "International buyers"],
    color: "bg-blue-100 text-blue-800"
  },
  {
    icon: Home,
    title: "Real Estate Services",
    type: "realtor",
    description: "Property sales, rentals, market analysis",
    benefits: ["Qualified leads", "Premium listings", "Exclusive network"],
    color: "bg-green-100 text-green-800"
  },
  {
    icon: CreditCard,
    title: "Mortgage & Finance",
    type: "mortgage_advisor",
    description: "Mortgage advisory, financial planning",
    benefits: ["Serious buyers", "Large transactions", "Repeat business"],
    color: "bg-purple-100 text-purple-800"
  },
  {
    icon: Banknote,
    title: "Currency Exchange",
    type: "money_exchange",
    description: "Currency exchange, international transfers",
    benefits: ["International clients", "Large transfers", "Regular customers"],
    color: "bg-yellow-100 text-yellow-800"
  }
];

const platformBenefits = [
  {
    icon: Users,
    title: "Qualified Lead Generation",
    description: "Connect with serious buyers who are actively looking for professional services in the Israeli real estate market."
  },
  {
    icon: Globe,
    title: "International Reach",
    description: "Access clients from around the world who are interested in Israeli property investments and relocations."
  },
  {
    icon: Shield,
    title: "Verified Professional Network",
    description: "Join a trusted network of verified professionals, enhancing your credibility and client trust."
  },
  {
    icon: TrendingUp,
    title: "Business Growth",
    description: "Expand your client base and grow your business through our targeted marketing and lead distribution."
  },
  {
    icon: Award,
    title: "Brand Visibility",
    description: "Showcase your expertise and build your professional brand on our high-traffic platform."
  },
  {
    icon: CheckCircle,
    title: "Easy Management",
    description: "Simple dashboard to manage your profile, track leads, and communicate with potential clients."
  }
];

export default function AdvertiseServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Grow Your Business with IsraelProperty360
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join our exclusive network of verified professionals and connect with qualified clients 
              looking for expert services in the Israeli real estate market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("RegisterExpert")}>
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  Join Our Expert Network
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Types */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Services We're Looking For
          </h2>
          <p className="text-xl text-gray-600">
            We welcome professionals across all areas of Israeli real estate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {serviceTypes.map((service) => (
            <Card key={service.type} className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${service.color}`}>
                    <service.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">What you'll get:</h4>
                  <ul className="space-y-1">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Platform Benefits */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Advertise with Us?
            </h2>
            <p className="text-xl text-gray-600">
              Join hundreds of professionals who trust our platform to grow their business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformBenefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join a Growing Network</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Verified Experts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">1,000+</div>
              <div className="text-gray-600">Monthly Visitors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Properties Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">20+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Partners Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "IsraelProperty360 has connected me with serious international buyers. The platform is professional and the leads are high-quality."
                </p>
                <div className="font-semibold">David Cohen</div>
                <div className="text-sm text-gray-500">Real Estate Lawyer</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The platform has significantly increased my business. I've closed more deals in 6 months than the previous year."
                </p>
                <div className="font-semibold">Sarah Levy</div>
                <div className="text-sm text-gray-500">Licensed Realtor</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Excellent platform for reaching international clients. The integration with my existing workflow is seamless."
                </p>
                <div className="font-semibold">Michael Rosen</div>
                <div className="text-sm text-gray-500">Mortgage Advisor</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our network of trusted professionals and start connecting with qualified clients today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("RegisterExpert")}>
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl("Contact")}>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}