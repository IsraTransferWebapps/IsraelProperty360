import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { Phone, Mail, Building2, CheckCircle, Lock, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PropertyContact({ property }) {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hi, I'm interested in the property "${property.title}" and would like more information.`
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    loadUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const recipientEmail = user ? property.broker_email : 'hello@israelproperty360.com';
      const subject = user
        ? `Property Inquiry: ${property.title}${property.reference_number ? ` - REF: ${property.reference_number}` : ''}`
        : `🏠 PROPERTY INQUIRY: ${property.title} in ${property.city}${property.reference_number ? ` - REF: ${property.reference_number}` : ''}`;

      await base44.integrations.Core.SendEmail({
        to: recipientEmail,
        subject: subject,
        body: `
${user ? '✅ DIRECT INQUIRY (Registered User)' : '📧 GENERAL INQUIRY (Non-Registered User)'}

══════════════════════════════════════
PROPERTY INFORMATION:
══════════════════════════════════════
Property: ${property.title}
${property.reference_number ? `Reference Number: ${property.reference_number}` : ''}
Location: ${property.city}${property.neighborhood ? `, ${property.neighborhood}` : ''}
Price: ₪${property.price?.toLocaleString()}
Status: ${property.status === 'for_sale' ? 'For Sale' : 'New Construction'}
Property ID: ${property.id}

══════════════════════════════════════
BROKER INFORMATION:
══════════════════════════════════════
${!user ? `Broker: ${property.broker_name}
Broker Email: ${property.broker_email}
${property.broker_phone ? `Broker Phone: ${property.broker_phone}` : ''}
` : 'Direct inquiry to broker'}

══════════════════════════════════════
INQUIRY FROM:
══════════════════════════════════════
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
${user ? `Registered User: ${user.email}` : 'Status: Non-registered user (general inquiry)'}

══════════════════════════════════════
MESSAGE:
══════════════════════════════════════
${formData.message}

══════════════════════════════════════
SOURCE & NEXT STEPS:
══════════════════════════════════════
Source: Property Detail Page
Property URL: ${window.location.href}

${user ?
  `✅ This is a direct inquiry - user has access to broker contact details.` :
  `⚠️ Action Required: Please forward this inquiry to ${property.broker_name} at ${property.broker_email} or respond to ${formData.email} within 24 hours.`}

Submitted: ${new Date().toLocaleString()}
        `
      });

      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: `Hi, I'm interested in the property "${property.title}" and would like more information.`
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = () => {
    navigate(createPageUrl('Register'));
  };

  if (isSubmitted) {
    return (
      <Card className="sticky top-8">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Message Sent!
          </h3>
          <p className="text-gray-600 mb-4">
            {user
              ? "Your inquiry has been sent to the broker. They will contact you soon."
              : "We've received your inquiry and will connect you with the broker shortly."}
          </p>
          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <Lock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-800 font-medium mb-3">
                Want to contact brokers directly?
              </p>
              <Button onClick={handleRegister} size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                Register Free
              </Button>
            </div>
          )}
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            size="sm"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {!user && (
        <Card className="sticky top-8 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Register for Full Access</h3>
              <p className="text-sm text-gray-700 mb-4">
                Get instant access to contact realtors directly, plus:
              </p>
              <div className="space-y-2 mb-4 text-left">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Direct contact with all experts & brokers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Magazine delivered to inbox or WhatsApp</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Exclusive property alerts</span>
                </div>
              </div>
              <Button onClick={handleRegister} className="w-full bg-blue-600 hover:bg-blue-700">
                Register Free Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="sticky top-8">
        <CardHeader>
          <CardTitle>
            {user ? 'Contact Broker Directly' : 'Inquire About This Property'}
          </CardTitle>
          {property.reference_number && (
            <p className="text-sm text-gray-500 mt-1">
              Reference: <span className="font-mono font-semibold">{property.reference_number}</span>
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-b pb-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{property.broker_name}</h3>
                <p className="text-sm text-gray-500">Licensed Broker</p>
              </div>
            </div>

            {user ? (
              <div className="space-y-2">
                {property.broker_phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <a href={`tel:${property.broker_phone}`} className="hover:text-blue-600">
                      {property.broker_phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${property.broker_email}`} className="hover:text-blue-600">
                    {property.broker_email}
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span>Contact details visible after registration</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="Your full name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+972-50-xxx-xxxx"
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                required
                rows={4}
                placeholder="Tell us more about your interest in this property..."
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : (user ? 'Send to Broker' : 'Send Inquiry')}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center">
            {user
              ? "Your message will be sent directly to the broker."
              : "We'll forward your inquiry to the broker and get back to you shortly."}
          </p>
        </CardContent>
      </Card>
    </>
  );
}