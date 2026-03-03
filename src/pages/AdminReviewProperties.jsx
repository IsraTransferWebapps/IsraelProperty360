
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  ArrowLeft,
  Calendar
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminReviewPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      // Only admins can access this page
      if (currentUser.role !== 'admin') {
        navigate(createPageUrl('Home'));
        return;
      }

      // Load pending properties
      const pendingProps = await base44.entities.Property.filter({ 
        approval_status: 'pending' 
      }, '-created_date');
      
      setProperties(pendingProps);
    } catch (error) {
      console.error('Error loading data:', error);
      navigate(createPageUrl('Home'));
    }
    setIsLoading(false);
  };

  const handleApprove = async (property) => {
    setIsProcessing(true);
    try {
      await base44.entities.Property.update(property.id, {
        approval_status: 'approved'
      });

      // Send approval email to broker
      await base44.integrations.Core.SendEmail({
        to: property.broker_email,
        subject: `Your Property "${property.title}" Has Been Approved!`,
        body: `Great news! Your property listing has been approved and is now live on IsraelProperty360.

Property: ${property.title}
Location: ${property.city}${property.neighborhood ? `, ${property.neighborhood}` : ''}
Price: ₪${property.price?.toLocaleString()}

${property.scheduled_publish_date 
  ? `Scheduled to publish: ${new Date(property.scheduled_publish_date).toLocaleDateString()}`
  : 'Your property is now visible to buyers!'}

View your listing: ${window.location.origin}${createPageUrl(`Property?id=${property.id}`)}

Thank you for listing with IsraelProperty360!
`
      });

      // Send notifications to users with matching alert preferences
      try {
        const allUsers = await base44.entities.User.list();
        const interestedUsers = allUsers.filter(user => {
          if (!user.property_alerts_enabled || !user.alert_preferences) return false;
          
          const prefs = user.alert_preferences;
          
          // Check city match
          if (prefs.preferred_cities && prefs.preferred_cities.length > 0) {
            if (!prefs.preferred_cities.includes(property.city)) return false;
          }
          
          // Check budget
          if (prefs.max_budget && property.price > prefs.max_budget) return false;
          
          // Check bedrooms
          if (prefs.min_bedrooms && property.bedrooms < prefs.min_bedrooms) return false;
          
          // Check property type
          if (prefs.property_types && prefs.property_types.length > 0) {
            if (!prefs.property_types.includes(property.property_type)) return false;
          }
          
          return true;
        });

        // Send email to each interested user
        for (const user of interestedUsers) {
          await base44.integrations.Core.SendEmail({
            to: user.email,
            subject: `New Property Alert: ${property.title} in ${property.city}`,
            body: `A new property matching your preferences has been listed!

${property.title}
📍 ${property.city}${property.neighborhood ? `, ${property.neighborhood}` : ''}
💰 ₪${property.price?.toLocaleString()}
${property.bedrooms ? `🛏️ ${property.bedrooms} bedrooms` : ''}
${property.bathrooms ? `🚿 ${property.bathrooms} bathrooms` : ''}
${property.size_sqm ? `📐 ${property.size_sqm}m²` : ''}

${property.description ? property.description.substring(0, 200) + '...' : ''}

View full details: ${window.location.origin}${createPageUrl(`Property?id=${property.id}`)}

---
You're receiving this because you have property alerts enabled for ${property.city}.
Manage your alert preferences: ${window.location.origin}${createPageUrl('PropertyAlerts')}
`
          });
        }
      } catch (notificationError) {
        console.error('Failed to send user notifications:', notificationError);
        // Don't fail the approval if notifications fail
      }

      // Reload properties
      await loadData();
    } catch (error) {
      console.error('Error approving property:', error);
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
      await base44.entities.Property.update(selectedProperty.id, {
        approval_status: 'rejected',
        rejection_reason: rejectionReason
      });

      // Send rejection email to broker
      await base44.integrations.Core.SendEmail({
        to: selectedProperty.broker_email,
        subject: `Update Required: Property "${selectedProperty.title}"`,
        body: `Your property listing requires some updates before it can be published.

Property: ${selectedProperty.title}
Location: ${selectedProperty.city}

Reason: ${rejectionReason}

Please update your listing and resubmit for review. You can edit your property from your broker dashboard.

${window.location.origin}${createPageUrl('BrokerDashboard')}

If you have any questions, please don't hesitate to contact us.
`
      });

      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedProperty(null);
      
      // Reload properties
      await loadData();
    } catch (error) {
      console.error('Error rejecting property:', error);
    }
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl('Home')}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review Properties</h1>
            <p className="text-gray-600 mt-1">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'} pending review
            </p>
          </div>
        </div>

        {properties.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                All Caught Up!
              </h3>
              <p className="text-gray-600">
                No properties pending review at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                    alt={property.title}
                    className="h-48 w-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-yellow-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                  {property.scheduled_publish_date && (
                    <Badge className="absolute top-2 left-2 bg-blue-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      Scheduled
                    </Badge>
                  )}
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                    {property.title}
                  </h3>

                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.city}</span>
                  </div>

                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    ₪{property.price?.toLocaleString()}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    {property.bedrooms && (
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        {property.bedrooms}
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        {property.bathrooms}
                      </div>
                    )}
                    {property.size_sqm && (
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        {property.size_sqm}m²
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <strong>Broker:</strong> {property.broker_name}<br />
                    <strong>Submitted:</strong> {new Date(property.created_date).toLocaleDateString()}
                    {property.scheduled_publish_date && (
                      <>
                        <br />
                        <strong>Publish:</strong> {new Date(property.scheduled_publish_date).toLocaleDateString()}
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(property)}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedProperty(property);
                        setShowRejectDialog(true);
                      }}
                      disabled={isProcessing}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>

                  <Link to={createPageUrl(`Property?id=${property.id}`)}>
                    <Button variant="outline" className="w-full mt-2" size="sm">
                      View Full Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Property</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this property. The broker will receive this feedback.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="e.g., Images are unclear, missing required information, pricing seems incorrect..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason('');
                setSelectedProperty(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? 'Rejecting...' : 'Reject Property'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
