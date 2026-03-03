import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, Calendar, Clock, MapPin, Users, ArrowLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const eventTypeColors = {
  seminar: "bg-blue-100 text-blue-800",
  webinar: "bg-purple-100 text-purple-800",
  open_house: "bg-green-100 text-green-800",
  workshop: "bg-yellow-100 text-yellow-800",
  networking: "bg-pink-100 text-pink-800",
  consultation: "bg-indigo-100 text-indigo-800"
};

export default function AdminReviewEventsPage() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser.role !== 'admin') {
          navigate(createPageUrl('Home'));
          return;
        }
        setUser(currentUser);
        
        const allEvents = await base44.entities.Event.list('-created_date');
        const pendingEvents = allEvents.filter(e => e.approval_status === 'pending');
        setEvents(pendingEvents);
      } catch (error) {
        navigate(createPageUrl('Home'));
      }
      setIsLoading(false);
    };
    loadData();
  }, [navigate]);

  const handleApprove = async (event) => {
    setIsProcessing(true);
    try {
      await base44.entities.Event.update(event.id, {
        approval_status: 'approved'
      });

      await base44.integrations.Core.SendEmail({
        to: event.organizer_email,
        subject: '✅ Your Event Has Been Approved - IsraelProperty360',
        body: `
Good news! Your event has been approved and is now live on IsraelProperty360.

══════════════════════════════════════
EVENT DETAILS:
══════════════════════════════════════
Title: ${event.title}
Date: ${new Date(event.event_date).toLocaleDateString()}
Time: ${event.start_time} - ${event.end_time}
Location: ${event.location}, ${event.city}

Your event is now visible to all visitors on our Events page:
https://israelproperty360.com/events

Best regards,
IsraelProperty360 Team
        `
      });

      setEvents(prev => prev.filter(e => e.id !== event.id));
    } catch (error) {
      console.error('Failed to approve event:', error);
    }
    setIsProcessing(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setIsProcessing(true);
    try {
      await base44.entities.Event.update(selectedEvent.id, {
        approval_status: 'rejected',
        rejection_reason: rejectionReason
      });

      await base44.integrations.Core.SendEmail({
        to: selectedEvent.organizer_email,
        subject: '❌ Event Not Approved - IsraelProperty360',
        body: `
We're sorry, but your event submission has not been approved at this time.

══════════════════════════════════════
EVENT DETAILS:
══════════════════════════════════════
Title: ${selectedEvent.title}
Date: ${new Date(selectedEvent.event_date).toLocaleDateString()}

══════════════════════════════════════
REASON:
══════════════════════════════════════
${rejectionReason}

If you have questions or would like to resubmit, please contact us at hello@israelproperty360.com

Best regards,
IsraelProperty360 Team
        `
      });

      setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
      setShowRejectDialog(false);
      setSelectedEvent(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject event:', error);
    }
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <Link to={createPageUrl('Home')}>
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Events</h1>
          <p className="text-gray-600">{events.length} events awaiting approval</p>
        </div>

        {events.length === 0 ? (
          <Card className="text-center py-20">
            <CardContent>
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">All caught up!</h3>
              <p className="mt-1 text-sm text-gray-500">There are no events pending approval.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map(event => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={eventTypeColors[event.event_type]}>
                      {event.event_type.replace('_', ' ')}
                    </Badge>
                    <Badge className="bg-yellow-600">Pending Review</Badge>
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription>
                    By {event.organizer_name} ({event.organizer_email})
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{event.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.event_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.start_time} - {event.end_time}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}, {event.city}
                    </div>
                    {event.max_attendees && (
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        Max {event.max_attendees} attendees
                      </div>
                    )}
                  </div>

                  {event.registration_required && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-2">
                      <p className="text-xs text-blue-800">
                        <strong>Registration Required:</strong>{' '}
                        {event.registration_link ? (
                          <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="underline">
                            External Link
                          </a>
                        ) : (
                          'Internal Form'
                        )}
                      </p>
                    </div>
                  )}

                  {event.event_website_url && (
                    <div className="bg-gray-50 border border-gray-200 rounded p-2">
                      <p className="text-xs text-gray-700">
                        <strong>Website:</strong>{' '}
                        <a href={event.event_website_url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                          {event.event_website_url}
                        </a>
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => handleApprove(event)}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowRejectDialog(true);
                      }}
                      disabled={isProcessing}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Event</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this event. The organizer will be notified via email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection_reason">Rejection Reason *</Label>
              <Textarea
                id="rejection_reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="E.g., Event details are incomplete, does not align with platform guidelines..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false);
                  setSelectedEvent(null);
                  setRejectionReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isProcessing || !rejectionReason.trim()}
              >
                {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}