import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const eventTypeColors = {
  seminar: "bg-blue-100 text-blue-800",
  webinar: "bg-purple-100 text-purple-800",
  open_house: "bg-green-100 text-green-800",
  workshop: "bg-yellow-100 text-yellow-800",
  networking: "bg-pink-100 text-pink-800",
  consultation: "bg-indigo-100 text-indigo-800"
};

const eventTypeIcons = {
  seminar: "📚",
  webinar: "💻",
  open_house: "🏠",
  workshop: "🔨",
  networking: "🤝",
  consultation: "💼"
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [experts, setExperts] = useState({});
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filterType, filterCity, selectedDate]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const [allEvents, allExperts] = await Promise.all([
        base44.entities.Event.list('-event_date'),
        base44.entities.Expert.list()
      ]);

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      // Filter for approved events (or events without approval_status for legacy data) and future dates
      const futureApprovedEvents = allEvents.filter(event =>
        new Date(event.event_date) >= now &&
        (!event.approval_status || event.approval_status === 'approved')
      );

      // Create a map of experts by email for quick lookup
      const expertMap = {};
      allExperts.forEach(expert => {
        expertMap[expert.email] = expert;
      });

      setEvents(futureApprovedEvents);
      setExperts(expertMap);
    } catch (error) {
      console.error('Error loading events:', error);
    }
    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...events];

    if (filterType !== "all") {
      filtered = filtered.filter(event => event.event_type === filterType);
    }

    if (filterCity !== "all") {
      filtered = filtered.filter(event => event.city === filterCity);
    }

    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      filtered = filtered.filter(event => event.event_date === dateStr);
    }

    setFilteredEvents(filtered);
  };

  const handleRegister = (event) => {
    if (event.registration_link) {
      window.open(event.registration_link, '_blank');
    } else {
      setSelectedEvent(event);
      setShowRegistration(true);
      setRegistrationSuccess(false);
      setRegistrationError('');
      setRegistrationData({ name: '', email: '', phone: '', notes: '' });
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRegistrationError('');

    try {
      // Send email notification to admin (ben@isratransfer.com)
      const emailBody = `New event registration received on IsraelProperty360

EVENT DETAILS:
Event: ${selectedEvent.title || 'N/A'}
Organizer: ${selectedEvent.organizer_name || 'N/A'} (${selectedEvent.organizer_email || 'N/A'})
Date: ${selectedEvent.event_date ? new Date(selectedEvent.event_date).toLocaleDateString() : 'N/A'}
Time: ${selectedEvent.start_time || 'N/A'} - ${selectedEvent.end_time || 'N/A'}
Location: ${selectedEvent.location || 'N/A'}, ${selectedEvent.city || 'N/A'}

ATTENDEE INFORMATION:
Name: ${registrationData.name}
Email: ${registrationData.email}
Phone: ${registrationData.phone}
${registrationData.notes ? '\nAdditional Notes: ' + registrationData.notes : ''}

ACTION REQUIRED: Please forward this registration to ${selectedEvent.organizer_email}`;

      await base44.integrations.Core.SendEmail({
        to: 'ben@isratransfer.com',
        subject: 'Event Registration: ' + selectedEvent.title,
        body: emailBody
      });

      setRegistrationSuccess(true);
      setRegistrationData({ name: '', email: '', phone: '', notes: '' });
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      setRegistrationError('Registration error: ' + (error?.message || error?.toString() || 'Unknown error. Please contact ' + selectedEvent.organizer_email));
    }
    setIsSubmitting(false);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.event_date === dateStr);
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const cities = [...new Set(events.map(e => e.city).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CalendarIcon className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Property Events & Seminars</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join webinars, open houses, and networking events hosted by our expert community
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="seminar">Seminars</SelectItem>
                    <SelectItem value="webinar">Webinars</SelectItem>
                    <SelectItem value="open_house">Open Houses</SelectItem>
                    <SelectItem value="workshop">Workshops</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="consultation">Consultations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Select value={filterCity} onValueChange={setFilterCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterType("all");
                    setFilterCity("all");
                    setSelectedDate(null);
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon" onClick={previousMonth}>
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <CardTitle className="text-lg">
                    {new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={nextMonth}>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-xs font-semibold text-gray-600 p-2">
                      {day}
                    </div>
                  ))}

                  {Array(startingDayOfWeek).fill(null).map((_, index) => (
                    <div key={`empty-${index}`} className="p-2" />
                  ))}

                  {Array(daysInMonth).fill(null).map((_, index) => {
                    const day = index + 1;
                    const date = new Date(year, month, day);
                    const dateEvents = getEventsForDate(date);
                    const isSelected = selectedDate &&
                      selectedDate.toISOString().split('T')[0] === date.toISOString().split('T')[0];
                    const isToday = new Date().toDateString() === date.toDateString();

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(isSelected ? null : date)}
                        className={`
                          p-2 text-sm rounded-lg transition-colors relative
                          ${isSelected ? 'bg-blue-600 text-white' :
                            isToday ? 'bg-blue-100 text-blue-900 font-semibold' :
                            'hover:bg-gray-100'}
                          ${dateEvents.length > 0 ? 'font-bold' : ''}
                        `}
                      >
                        {day}
                        {dateEvents.length > 0 && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                            {dateEvents.slice(0, 3).map((_, i) => (
                              <div key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-600'}`} />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No events found
                  </h3>
                  <p className="text-gray-600">
                    {selectedDate ? 'No events on this date. Try selecting a different date.' : 'No upcoming events match your filters.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredEvents.map((event) => {
                  const organizerExpert = event.organizer_type === 'expert' ? experts[event.organizer_email] : null;

                  return (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{eventTypeIcons[event.event_type]}</span>
                              <Badge className={eventTypeColors[event.event_type]}>
                                {event.event_type.replace('_', ' ')}
                              </Badge>
                              {event.featured && (
                                <Badge variant="secondary">Featured</Badge>
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {event.title}
                            </h3>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            <span>{new Date(event.event_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{event.start_time} - {event.end_time}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{event.location}, {event.city}</span>
                          </div>
                          {event.max_attendees && (
                            <div className="flex items-center text-gray-600">
                              <Users className="w-4 h-4 mr-2" />
                              <span>Max {event.max_attendees} attendees</span>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-700 mb-4">
                          {event.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            Organized by {organizerExpert ? (
                              <Link
                                to={createPageUrl(`Expert?id=${organizerExpert.id}`)}
                                className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {event.organizer_name}
                              </Link>
                            ) : (
                              <span className="font-semibold">{event.organizer_name}</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {event.event_website_url && (
                              <Button
                                variant="outline"
                                onClick={() => window.open(event.event_website_url, '_blank')}
                              >
                                Learn More
                              </Button>
                            )}
                            {event.registration_required && (
                              <Button
                                onClick={() => handleRegister(event)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Register Now
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register for Event</DialogTitle>
            <DialogDescription>
              {selectedEvent && selectedEvent.title}
            </DialogDescription>
          </DialogHeader>

          {registrationSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Registration Received!
              </h3>
              <p className="text-gray-700 mb-4 text-base">
                Thank you for registering for <strong>{selectedEvent?.title}</strong>
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-2">What happens next:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>The event organizer will review your registration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>You'll receive a confirmation email with event details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>The organizer will be in touch to confirm your attendance</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Organized by: <strong>{selectedEvent?.organizer_name}</strong>
              </p>
              <Button onClick={() => {
                setShowRegistration(false);
                setRegistrationSuccess(false);
              }} className="w-full">
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRegistrationSubmit} className="space-y-4">
              {registrationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                  {registrationError}
                </div>
              )}
              
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={registrationData.notes}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Any questions or special requirements?"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRegistration(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}