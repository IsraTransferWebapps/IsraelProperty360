import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from "@/api/base44Client";
import { Mail, CheckCircle, MessageCircle, Phone } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiry_type: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await base44.integrations.Core.SendEmail({
        to: 'hello@israelproperty360.com',
        subject: `📬 CONTACT FORM: ${formData.inquiry_type.replace('_', ' ').toUpperCase()} - ${formData.subject}`,
        body: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; }
    .section { background: white; padding: 15px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #667eea; }
    .label { font-weight: bold; color: #667eea; display: block; margin-bottom: 5px; }
    .value { color: #333; }
    .alert { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 4px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">📬 New Contact Form Submission</h2>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">IsraelProperty360</p>
    </div>
    
    <div class="content">
      <div class="section">
        <span class="label">Inquiry Type</span>
        <span class="value">${formData.inquiry_type.replace('_', ' ').toUpperCase()}</span>
      </div>
      
      <div class="section">
        <span class="label">Contact Information</span>
        <p class="value" style="margin: 5px 0;"><strong>Name:</strong> ${formData.name}</p>
        <p class="value" style="margin: 5px 0;"><strong>Email:</strong> ${formData.email}</p>
        <p class="value" style="margin: 5px 0;"><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
      </div>
      
      <div class="section">
        <span class="label">Subject</span>
        <p class="value">${formData.subject}</p>
      </div>
      
      <div class="section">
        <span class="label">Message</span>
        <p class="value">${formData.message}</p>
      </div>
      
      <div class="alert">
        <strong>⚠️ Action Required:</strong> Please respond to ${formData.email} within 24 hours
      </div>
      
      <p style="text-align: center; color: #6c757d; margin-top: 20px; font-size: 12px;">
        Submitted: ${new Date().toLocaleString()}<br>
        Source: Contact Page
      </p>
    </div>
  </div>
</body>
</html>`
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
              <Button onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '', email: '', phone: '', subject: '', message: '', inquiry_type: ''
                });
              }}>
                Send Another Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to start your property journey in Israel? Our team is here to help you every step of the way.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Email Contact */}
          <Card className="text-center">
            <CardContent className="py-8 px-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <a 
                href="mailto:hello@israelproperty360.com" 
                className="text-blue-600 hover:text-blue-700 font-medium break-all px-2 inline-block"
              >
                hello@israelproperty360.com
              </a>
              <p className="text-sm text-gray-500 mt-2">We respond within 24 hours</p>
            </CardContent>
          </Card>

          {/* WhatsApp Contact */}
          <Card className="text-center">
            <CardContent className="py-8 px-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp</h3>
              <a 
                href="#" 
                className="text-green-600 hover:text-green-700 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  alert('WhatsApp link coming soon!');
                }}
              >
                Message us on WhatsApp
              </a>
              <p className="text-sm text-gray-500 mt-2">Quick responses</p>
            </CardContent>
          </Card>

          {/* Phone Contact */}
          <Card className="text-center">
            <CardContent className="py-8 px-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-purple-600 font-medium">
                +972-XX-XXX-XXXX
              </p>
              <p className="text-sm text-gray-500 mt-2">Sun-Thu, 9AM-5PM IST</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+972-XX-XXX-XXXX"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="inquiry_type">Type of Inquiry</Label>
                  <Select 
                    value={formData.inquiry_type} 
                    onValueChange={(value) => handleSelectChange('inquiry_type', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buying">Buying Property</SelectItem>
                      <SelectItem value="selling">Selling Property</SelectItem>
                      <SelectItem value="expert">Connect with Expert</SelectItem>
                      <SelectItem value="investment">Investment Advice</SelectItem>
                      <SelectItem value="general">General Question</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="mt-1"
                  placeholder="Tell us about your property needs, questions, or how we can help you..."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-yellow-600 hover:bg-yellow-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Mail className="w-4 h-4 mr-2 animate-pulse" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}