
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Award,
  Languages,
  BookOpen,
  Lock,
  CheckCircle,
  Send,
  Calendar,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function ExpertPage() {
  const [expert, setExpert] = useState(null);
  const [user, setUser] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [location.search]);

  const loadData = async () => {
    const urlParams = new URLSearchParams(location.search);
    const expertId = urlParams.get('id');

    if (!expertId) {
      navigate(createPageUrl('Experts'));
      return;
    }

    try {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }

      const experts = await base44.entities.Expert.filter({ id: expertId });
      if (experts.length > 0) {
        const expertData = experts[0];
        setExpert(expertData);

        // Load blog posts by this expert
        const posts = await base44.entities.BlogPost.filter({
          author_expert_id: expertId,
          published: true
        }, '-created_date');
        setBlogPosts(posts);

        // Load upcoming events organized by this expert
        const today = new Date().toISOString().split('T')[0];
        const allEvents = await base44.entities.Event.list('-event_date');
        const expertEvents = allEvents.filter(event =>
          event.organizer_email === expertData.email &&
          event.event_date >= today &&
          (!event.approval_status || event.approval_status === 'approved')
        );
        setUpcomingEvents(expertEvents);
      } else {
        navigate(createPageUrl('Experts'));
      }
    } catch (error) {
      console.error('Error loading expert:', error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const recipientEmail = user ? expert.email : 'hello@israelproperty360.com';
      const subject = user
        ? `Expert Inquiry: ${expert.name}`
        : `🔔 EXPERT INQUIRY: ${expert.name} (${expert.expertise.replace('_', ' ').toUpperCase()})`;

      await base44.integrations.Core.SendEmail({
        to: recipientEmail,
        subject: subject,
        body: `
${user ? '✅ DIRECT INQUIRY (Registered User)' : '📧 GENERAL INQUIRY (Non-Registered User)'}

══════════════════════════════════════
EXPERT INFORMATION:
══════════════════════════════════════
Expert Name: ${expert.name}
Company: ${expert.company}
Expertise: ${expert.expertise.replace('_', ' ').toUpperCase()}
${!user ? `Expert Contact: ${expert.email}${expert.phone ? ` | ${expert.phone}` : ''}` : ''}

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
Source: Expert Profile Page
Expert Profile: ${window.location.href}

${user ?
  `✅ This is a direct inquiry - user has access to expert contact details.` :
  `⚠️ Action Required: Please forward this inquiry to ${expert.name} at ${expert.email} or respond to ${formData.email} within 24 hours.`}

Submitted: ${new Date().toLocaleString()}
        `
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const expertDetails = {
    lawyer: { color: "bg-blue-100 text-blue-800", label: "Lawyer" },
    realtor: { color: "bg-green-100 text-green-800", label: "Realtor" },
    mortgage_advisor: { color: "bg-purple-100 text-purple-800", label: "Mortgage Advisor" },
    money_exchange: { color: "bg-yellow-100 text-yellow-800", label: "Money Exchange" },
    interior_designer: { color: "bg-pink-100 text-pink-800", label: "Interior Designer" },
    property_management: { color: "bg-indigo-100 text-indigo-800", label: "Property Management" }
  };

  const eventTypeLabels = {
    seminar: "Seminar",
    webinar: "Webinar",
    open_house: "Open House",
    workshop: "Workshop",
    networking: "Networking",
    consultation: "Consultation"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Expert Not Found</h2>
            <p className="text-gray-600 mb-6">The expert you're looking for doesn't exist.</p>
            <Link to={createPageUrl('Experts')}>
              <Button>Browse All Experts</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const details = expertDetails[expert.expertise];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={createPageUrl('Experts')}>
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Experts
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={expert.image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                    alt={expert.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h1 className="text-3xl font-bold text-gray-900">{expert.name}</h1>
                      <Badge className={details.color}>
                        {details.label}
                      </Badge>
                    </div>
                    <p className="text-lg text-gray-600 mb-4">{expert.company}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {expert.experience_years && (
                        <div className="flex items-center text-gray-700">
                          <Award className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{expert.experience_years} years experience</span>
                        </div>
                      )}
                      {expert.languages && expert.languages.length > 0 && (
                        <div className="flex items-center text-gray-700">
                          <Languages className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{expert.languages.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {expert.video_url && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Introduction Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <video
                    controls
                    className="w-full rounded-lg"
                    style={{ maxHeight: '500px' }}
                  >
                    <source src={expert.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  About {expert.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {expert.description}
                </p>

                {expert.specialties && expert.specialties.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {expert.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline">{specialty}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events Section */}
            {upcomingEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Events by {expert.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map(event => (
                      <div
                        key={event.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-4">
                          {event.image_url && (
                            <img
                              src={event.image_url}
                              alt={event.title}
                              className="w-24 h-24 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900 line-clamp-2">
                                {event.title}
                              </h4>
                              {event.event_type && (
                                <Badge variant="outline" className="flex-shrink-0">
                                  {eventTypeLabels[event.event_type]}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {event.description}
                            </p>
                            <div className="space-y-1 mb-3">
                              {event.event_date && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  <span>{new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                              )}
                              {event.start_time && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>{event.start_time}{event.end_time && ` - ${event.end_time}`}</span>
                                </div>
                              )}
                              {event.location && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {event.registration_link ? (
                                <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                                  <Button variant="outline" size="sm">
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Register
                                  </Button>
                                </a>
                              ) : (
                                <Link to={createPageUrl(`Events`)}>
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Blog Posts Section */}
            {blogPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Articles by {expert.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blogPosts.map(post => (
                      <div
                        key={post.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-4">
                          {post.image_url && (
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="w-24 h-24 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <a
                              href={createPageUrl(`BlogPost?slug=${post.slug || post.id}`)}
                              className="block"
                            >
                              <h4 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 line-clamp-2">
                                {post.title}
                              </h4>
                            </a>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs text-gray-500">
                                <span>{new Date(post.created_date).toLocaleDateString()}</span>
                                {post.category && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span className="capitalize">{post.category.replace('_', ' ')}</span>
                                  </>
                                )}
                              </div>
                              <a href={createPageUrl(`BlogPost?slug=${post.slug || post.id}`)}>
                                <Button variant="outline" size="sm">
                                  Read Article
                                </Button>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Contact {expert.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-800 text-center font-medium">
                        You're registered! Contact this expert directly:
                      </p>
                    </div>

                    <div className="space-y-4">
                      {expert.email && (
                        <a
                          href={`mailto:${expert.email}`}
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Mail className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">Email</div>
                            <div className="text-sm text-gray-600">{expert.email}</div>
                          </div>
                        </a>
                      )}

                      {expert.phone && (
                        <a
                          href={`tel:${expert.phone}`}
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Phone className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">Phone</div>
                            <div className="text-sm text-gray-600">{expert.phone}</div>
                          </div>
                        </a>
                      )}

                      {expert.website && (
                        <a
                          href={expert.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Globe className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">Website</div>
                            <div className="text-sm text-gray-600 truncate">{expert.website}</div>
                          </div>
                        </a>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-xs text-gray-500 text-center mb-4">Or send a message:</p>
                      {isSubmitted ? (
                        <div className="text-center py-4">
                          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                          <p className="font-medium text-gray-900 mb-2">Message Sent!</p>
                          <p className="text-sm text-gray-600 mb-4">
                            Your message has been sent directly to {expert.name}.
                          </p>
                          <Button
                            onClick={() => setIsSubmitted(false)}
                            variant="outline"
                            size="sm"
                          >
                            Send Another Message
                          </Button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-3">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                              id="message"
                              value={formData.message}
                              onChange={(e) => handleInputChange('message', e.target.value)}
                              required
                              rows={3}
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Send className="w-4 h-4 mr-2 animate-pulse" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                              </>
                            )}
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                      <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="font-bold text-gray-900 mb-2">Register to Contact Directly</h3>
                      <p className="text-sm text-gray-700 mb-4">
                        Get instant access to {expert.name}'s contact details when you create a free account.
                      </p>
                      <div className="space-y-2 mb-4 text-left">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Direct contact with all experts</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Save favorite properties</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Get property alerts</span>
                        </div>
                      </div>
                      <Link to={createPageUrl('Register')}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-2">
                          Register Free
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => base44.auth.redirectToLogin(window.location.href)}
                      >
                        Already have an account? Login
                      </Button>
                    </div>

                    <div className="border-t pt-6">
                      <p className="text-sm text-gray-700 mb-4 text-center">
                        Or send us a general inquiry and we'll connect you:
                      </p>
                      {isSubmitted ? (
                        <div className="text-center py-4">
                          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                          <p className="font-medium text-gray-900 mb-2">Message Sent!</p>
                          <p className="text-sm text-gray-600 mb-4">
                            We'll forward your inquiry to {expert.name} and get back to you shortly.
                          </p>
                          <Button
                            onClick={() => setIsSubmitted(false)}
                            variant="outline"
                            size="sm"
                          >
                            Send Another Message
                          </Button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-3">
                          <div>
                            <Label htmlFor="name">Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              required
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
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                              id="message"
                              value={formData.message}
                              onChange={(e) => handleInputChange('message', e.target.value)}
                              required
                              rows={3}
                              placeholder={`I'm interested in ${expert.expertise.replace('_', ' ')} services...`}
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full bg-gray-800 hover:bg-gray-900"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Send className="w-4 h-4 mr-2 animate-pulse" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Send Inquiry
                              </>
                            )}
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
