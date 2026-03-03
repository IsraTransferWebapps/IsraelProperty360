import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  Building, 
  Scale, 
  CreditCard, 
  Banknote,
  Mail,
  Phone,
  Video,
  Loader2,
  AlertCircle,
  Palette,
  Home
} from 'lucide-react';

const sectors = [
  { 
    id: 'property', 
    label: 'Property Search', 
    icon: Building,
    benefits: [
      'Browse 500+ verified property listings',
      'Advanced filtering by city, price, and type',
      'Email alerts for new properties matching your criteria',
      'Save and compare your favorite properties',
      'Direct contact with licensed brokers'
    ]
  },
  { 
    id: 'lawyer', 
    label: 'Legal Services', 
    icon: Scale,
    benefits: [
      'Connect with verified real estate lawyers',
      'Assistance with property contracts and agreements',
      'Guidance on Israeli property law',
      'Title searches and due diligence',
      'Closing and transfer support'
    ]
  },
  { 
    id: 'mortgage', 
    label: 'Mortgage & Financing', 
    icon: CreditCard,
    benefits: [
      'Expert mortgage advisors for Israeli properties',
      'Financing options for overseas buyers',
      'Competitive interest rate comparisons',
      'Pre-approval assistance',
      'Support through the entire loan process'
    ]
  },
  { 
    id: 'exchange', 
    label: 'Currency Exchange', 
    icon: Banknote,
    benefits: [
      'Specialized currency exchange services',
      'Competitive exchange rates',
      'Large transaction support',
      'International transfer assistance',
      'Currency hedging advice'
    ]
  },
  { 
    id: 'interior_design', 
    label: 'Interior Design', 
    icon: Palette,
    benefits: [
      'Professional interior design consultation',
      'Space planning and optimization',
      'Furniture and fixture selection',
      'Color schemes and styling',
      'Complete home transformation services'
    ]
  },
  { 
    id: 'property_management', 
    label: 'Property Management', 
    icon: Home,
    benefits: [
      'Professional property management services',
      'Tenant screening and placement',
      'Maintenance and repairs coordination',
      'Rent collection and financial reporting',
      'Long-term investment property care'
    ]
  }
];

const contactMethods = [
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone Call', icon: Phone },
  { id: 'video', label: 'Video Call', icon: Video }
];

export default function GetStartedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sectors: [],
    contactPreferences: [],
    message: '',
    timeline: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFormData(prev => ({
      ...prev,
      name: params.get('name') || '',
      email: params.get('email') || '',
      phone: params.get('phone') || ''
    }));
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSector = (sectorId) => {
    setFormData(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sectorId)
        ? prev.sectors.filter(s => s !== sectorId)
        : [...prev.sectors, sectorId]
    }));
  };

  const toggleContactMethod = (methodId) => {
    setFormData(prev => ({
      ...prev,
      contactPreferences: prev.contactPreferences.includes(methodId)
        ? prev.contactPreferences.filter(m => m !== methodId)
        : [...prev.contactPreferences, methodId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const selectedSectors = sectors
        .filter(s => formData.sectors.includes(s.id))
        .map(s => s.label)
        .join(', ');

      const selectedMethods = contactMethods
        .filter(m => formData.contactPreferences.includes(m.id))
        .map(m => m.label)
        .join(', ');

      // Get current user's email if logged in, otherwise use default
      let recipientEmail = 'ben@isratransfer.com';
      try {
        const currentUser = await base44.auth.me();
        if (currentUser && currentUser.email) {
          recipientEmail = currentUser.email;
        }
      } catch (err) {
        // User not logged in, use default email
        console.log('Not logged in, using default email');
      }

      console.log('Sending email to:', recipientEmail);

      await base44.integrations.Core.SendEmail({
        to: recipientEmail,
        subject: `New Lead: ${formData.name} - IsraelProperty360`,
        body: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; }
    .section { background: white; padding: 15px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #3b82f6; }
    .label { font-weight: bold; color: #3b82f6; display: block; margin-bottom: 5px; }
    .value { color: #333; }
    .alert { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 4px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">🎯 New Lead: ${formData.name}</h2>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">IsraelProperty360 - Comprehensive Inquiry</p>
    </div>
    
    <div class="content">
      <div class="section">
        <span class="label">Contact Information</span>
        <p class="value" style="margin: 5px 0;"><strong>Name:</strong> ${formData.name}</p>
        <p class="value" style="margin: 5px 0;"><strong>Email:</strong> ${formData.email}</p>
        <p class="value" style="margin: 5px 0;"><strong>Phone:</strong> ${formData.phone}</p>
      </div>
      
      <div class="section">
        <span class="label">Services Interested In</span>
        <p class="value">${selectedSectors}</p>
      </div>
      
      <div class="section">
        <span class="label">Preferred Contact Methods</span>
        <p class="value">${selectedMethods}</p>
      </div>
      
      <div class="section">
        <span class="label">Timeline</span>
        <p class="value">${formData.timeline || 'Not specified'}</p>
      </div>
      
      ${formData.message ? `
      <div class="section">
        <span class="label">Additional Notes</span>
        <p class="value">${formData.message}</p>
      </div>
      ` : ''}
      
      <div class="alert">
        <strong>⚠️ Action Required:</strong> Please respond to ${formData.email} within 24 hours
      </div>
      
      <p style="text-align: center; color: #6c757d; margin-top: 20px; font-size: 12px;">
        Submitted: ${new Date().toLocaleString()}<br>
        Source: Homepage Get Started Form
      </p>
    </div>
  </div>
</body>
</html>`
      });

      console.log('Email sent successfully!');
      setSubmitted(true);
    } catch (error) {
      console.error('Submission error details:', error);
      setError(`Failed to submit: ${error.message || 'Unknown error'}. Please try again or email us directly at ben@isratransfer.com`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-16 shadow-2xl border-2 border-green-100">
            <CardContent>
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Thank You! 🎉
              </h2>
              
              <p className="text-xl text-gray-700 mb-6 font-medium">
                Your inquiry has been successfully submitted
              </p>
              
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8 text-left max-w-2xl mx-auto">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  What Happens Next:
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Our team will review your inquiry within <strong>24 hours</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>We'll match you with the right experts for your needs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>You'll receive a personalized response via your preferred contact method</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>We'll reach out to you at <strong>{formData.email}</strong> or <strong>{formData.phone}</strong></span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  Explore While You Wait:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    onClick={() => navigate(createPageUrl('Properties'))}
                    variant="outline"
                    className="h-auto py-3"
                  >
                    <Building className="w-4 h-4 mr-2" />
                    Browse Properties
                  </Button>
                  <Button 
                    onClick={() => navigate(createPageUrl('Cities'))}
                    variant="outline"
                    className="h-auto py-3"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Explore Cities
                  </Button>
                  <Button 
                    onClick={() => navigate(createPageUrl('Experts'))}
                    variant="outline"
                    className="h-auto py-3"
                  >
                    <Scale className="w-4 h-4 mr-2" />
                    Meet Our Experts
                  </Button>
                  <Button 
                    onClick={() => navigate(createPageUrl('Blog'))}
                    variant="outline"
                    className="h-auto py-3"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Read Our Blog
                  </Button>
                </div>
              </div>

              <Button 
                onClick={() => navigate(createPageUrl('Home'))}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
              >
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Let's Find the Perfect Solution for You
          </h1>
          <p className="text-xl text-gray-600">
            Tell us more about your needs so we can connect you with the right experts
          </p>
        </div>

        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Submission Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Please verify your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What are you interested in? *</CardTitle>
              <CardDescription>Select all that apply - we'll connect you with the right experts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sectors.map((sector) => {
                  const Icon = sector.icon;
                  const isSelected = formData.sectors.includes(sector.id);
                  
                  return (
                    <div
                      key={sector.id}
                      onClick={() => toggleSector(sector.id)}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${isSelected
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-semibold">{sector.label}</span>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      
                      {isSelected && (
                        <ul className="space-y-1 ml-2">
                          {sector.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start">
                              <span className="text-blue-600 mr-1">✓</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How would you like us to contact you? *</CardTitle>
              <CardDescription>Select your preferred method(s) of communication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = formData.contactPreferences.includes(method.id);
                  
                  return (
                    <div
                      key={method.id}
                      onClick={() => toggleContactMethod(method.id)}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all text-center
                        ${isSelected
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <p className="font-semibold">{method.label}</p>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-blue-600 mx-auto mt-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Help us understand your needs better</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="timeline">When are you looking to proceed?</Label>
                <Input
                  id="timeline"
                  name="timeline"
                  placeholder="e.g., Within 3 months, Flexible, As soon as possible"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message">Tell us more about what you're looking for (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Any specific requirements, questions, or additional information..."
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl('Home'))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || formData.sectors.length === 0 || formData.contactPreferences.length === 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Inquiry
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {(formData.sectors.length === 0 || formData.contactPreferences.length === 0) && (
            <p className="text-sm text-red-600 text-right mt-2">
              Please select at least one service and one contact method
            </p>
          )}
        </form>
      </div>
    </div>
  );
}