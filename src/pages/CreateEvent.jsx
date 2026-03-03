import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CreateEventPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [event, setEvent] = useState({
    title: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    city: '',
    event_type: '',
    max_attendees: '',
    registration_required: false,
    registration_link: '',
    event_website_url: '',
    featured: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser.user_type !== 'broker' && currentUser.role !== 'admin') {
          navigate(createPageUrl('Home'));
          return;
        }
        setUser(currentUser);
      } catch (error) {
        navigate(createPageUrl('Home'));
      }
      setIsLoading(false);
    };
    checkUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEvent(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleSelectChange = (name, value) => {
    setEvent(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    const missingFields = [];
    
    if (!event.title) missingFields.push('Event Title');
    if (!event.description) missingFields.push('Description');
    if (!event.event_date) missingFields.push('Date');
    if (!event.start_time) missingFields.push('Start Time');
    if (!event.end_time) missingFields.push('End Time');
    if (!event.location) missingFields.push('Location');
    if (!event.city) missingFields.push('City');
    if (!event.event_type) missingFields.push('Event Type');
    
    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted, event data:', event);
    
    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }
    
    console.log('Validation passed, creating event...');
    setIsSaving(true);
    setError('');

    try {
      const eventData = {
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location,
        city: event.city,
        event_type: event.event_type,
        max_attendees: event.max_attendees ? Number(event.max_attendees) : undefined,
        registration_required: event.registration_required,
        registration_link: event.registration_link || undefined,
        event_website_url: event.event_website_url || undefined,
        organizer_email: user.email,
        organizer_name: user.full_name,
        organizer_type: user.user_type || 'expert',
        approval_status: user.role === 'admin' ? 'approved' : 'pending',
        featured: user.role === 'admin' ? event.featured : false
      };

      console.log('Submitting event data:', eventData);
      await base44.entities.Event.create(eventData);
      console.log('Event created successfully');
      
      // Send admin notification email if broker created the event
      if (user.role !== 'admin') {
        await base44.integrations.Core.SendEmail({
          to: 'hello@israelproperty360.com',
          subject: '🔔 New Event Awaiting Approval - IsraelProperty360',
          body: `
A new event has been submitted and requires your review.

══════════════════════════════════════
EVENT DETAILS:
══════════════════════════════════════
Title: ${eventData.title}
Type: ${eventData.event_type.replace('_', ' ').toUpperCase()}
Date: ${new Date(eventData.event_date).toLocaleDateString()}
Time: ${eventData.start_time} - ${eventData.end_time}
Location: ${eventData.location}, ${eventData.city}

Description:
${eventData.description}

══════════════════════════════════════
ORGANIZER:
══════════════════════════════════════
Name: ${eventData.organizer_name}
Email: ${eventData.organizer_email}
Type: ${eventData.organizer_type}

══════════════════════════════════════
NEXT STEPS:
══════════════════════════════════════
⚠️ Please review this event in the Admin Dashboard:
   Dashboard → Review Events

Submitted: ${new Date().toLocaleString()}
          `
        });
      }
      
      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to create event:', error);
      setError(`Failed to create event: ${error.message || 'Please try again or contact support.'}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {user.role === 'admin' ? 'Event Created Successfully!' : 'Event Submitted for Review!'}
            </h3>
            <p className="text-gray-600 mb-6">
              {user.role === 'admin' 
                ? 'Your event has been published and is now visible on the Events page.'
                : 'Your event has been submitted and will be visible once approved by our team. You\'ll be notified via email.'}
            </p>
            <div className="space-y-3">
              {user.role === 'admin' ? (
                <Link to={createPageUrl('Events')}>
                  <Button className="w-full">View Events Page</Button>
                </Link>
              ) : (
                <Link to={createPageUrl('BrokerDashboard')}>
                  <Button className="w-full">Return to Dashboard</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cities = [
    "Ashdod",
    "Ashkelon",
    "Be'er Sheva",
    "Beit Shemesh",
    "Haifa",
    "Herzliya",
    "Jerusalem",
    "Modi'in",
    "Netanya",
    "Ra'anana",
    "Tel Aviv",
    "Zichron Ya'akov",
    "Online"
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Link to={createPageUrl('BrokerDashboard')}>
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Create New Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={event.title}
                    onChange={handleChange}
                    placeholder="e.g., First-Time Home Buyers Webinar"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={event.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe what attendees will learn or experience..."
                  />
                </div>

                <div>
                  <Label htmlFor="event_type">Event Type *</Label>
                  <Select onValueChange={(v) => handleSelectChange('event_type', v)} value={event.event_type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="webinar">Webinar</SelectItem>
                      <SelectItem value="open_house">Open House</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="event_date">Date *</Label>
                  <Input
                    id="event_date"
                    name="event_date"
                    type="date"
                    value={event.event_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="start_time">Start Time * <span className="text-xs font-normal text-gray-500">(Israel Time)</span></Label>
                  <Input
                    id="start_time"
                    name="start_time"
                    type="time"
                    value={event.start_time}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: HH:MM (e.g., 14:30)
                  </p>
                </div>

                <div>
                  <Label htmlFor="end_time">End Time * <span className="text-xs font-normal text-gray-500">(Israel Time)</span></Label>
                  <Input
                    id="end_time"
                    name="end_time"
                    type="time"
                    value={event.end_time}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: HH:MM (e.g., 16:00)
                  </p>
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Select onValueChange={(v) => handleSelectChange('city', v)} value={event.city}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location/Venue *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={event.location}
                    onChange={handleChange}
                    placeholder="e.g., Zoom Meeting or Physical Address"
                  />
                </div>

                <div>
                  <Label htmlFor="max_attendees">Max Attendees (Optional)</Label>
                  <Input
                    id="max_attendees"
                    name="max_attendees"
                    type="number"
                    value={event.max_attendees}
                    onChange={handleChange}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="font-semibold text-lg">Registration Options</h3>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="registration_required"
                    name="registration_required"
                    checked={event.registration_required}
                    onCheckedChange={(checked) => handleSelectChange('registration_required', checked)}
                  />
                  <Label htmlFor="registration_required" className="font-normal">
                    Require registration for this event
                  </Label>
                </div>

                {event.registration_required && (
                  <div>
                    <Label htmlFor="registration_link">External Registration Link (Optional)</Label>
                    <Input
                      id="registration_link"
                      name="registration_link"
                      value={event.registration_link}
                      onChange={handleChange}
                      placeholder="https://eventbrite.com/your-event or leave empty for internal form"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      If you provide a link (e.g., Eventbrite), users will be redirected there. 
                      Otherwise, they'll use our built-in registration form.
                    </p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="event_website_url">Event/Company Website (Optional)</Label>
                  <Input
                    id="event_website_url"
                    name="event_website_url"
                    value={event.event_website_url}
                    onChange={handleChange}
                    placeholder="https://yourcompany.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add a link to your company website or event page where users can learn more
                  </p>
                </div>

                {user?.role === 'admin' && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="featured"
                      name="featured"
                      checked={event.featured}
                      onCheckedChange={(checked) => handleSelectChange('featured', checked)}
                    />
                    <Label htmlFor="featured" className="font-normal">
                      Mark as featured event (Admin only)
                    </Label>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                  {isSaving ? 'Creating Event...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}