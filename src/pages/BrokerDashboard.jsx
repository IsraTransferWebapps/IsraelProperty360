import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, Home, AlertTriangle, Calendar, Clock } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BrokerDashboardPage() {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser.user_type !== 'broker') {
          navigate(createPageUrl('Home'));
          return;
        }
        setUser(currentUser);
        const [userProperties, userEvents] = await Promise.all([
          base44.entities.Property.filter({ broker_email: currentUser.email }, '-created_date'),
          base44.entities.Event.filter({ organizer_email: currentUser.email }, '-created_date')
        ]);
        setProperties(userProperties);
        setEvents(userEvents);
      } catch (error) {
        navigate(createPageUrl('Home'));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const handleDeleteProperty = async (propertyId) => {
    try {
      await base44.entities.Property.delete(propertyId);
      setProperties(prev => prev.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await base44.entities.Event.delete(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const getExpiryInfo = (property) => {
    if (!property.created_date) return null;
    
    const createdDate = new Date(property.created_date);
    const now = new Date();
    const diffMonths = (now.getFullYear() - createdDate.getFullYear()) * 12 + (now.getMonth() - createdDate.getMonth());
    
    const expiryMonths = property.status === 'for_sale' ? 3 : 6; 
    const remainingMonths = expiryMonths - diffMonths;
    
    if (remainingMonths <= 0) {
      return { expired: true, message: 'Expired - Not visible to buyers', color: 'text-red-600' };
    } else if (remainingMonths === 1) {
      return { expired: false, message: 'Expires in 1 month', color: 'text-orange-600' };
    } else if (remainingMonths <= 2) {
      return { expired: false, message: `Expires in ${remainingMonths} months`, color: 'text-yellow-600' };
    }
    
    return { expired: false, message: `Expires in ${remainingMonths} months`, color: 'text-gray-600' };
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Broker Dashboard</h1>
          <div className="flex gap-3">
            <Link to={createPageUrl('CreateEvent')}>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </Link>
            <Link to={createPageUrl('ListProperty')}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                List New Property
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="properties">
              <Home className="w-4 h-4 mr-2" />
              My Properties ({properties.length})
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="w-4 h-4 mr-2" />
              My Events ({events.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties">
            {/* Property Expiry Information Banner */}
            <Card className="mb-8 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Property Listing Duration</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>For Sale</strong> properties remain visible for <strong>3 months</strong></li>
                      <li>• <strong>New Construction</strong> properties remain visible for <strong>6 months</strong></li>
                      <li>• After expiry, properties are automatically hidden from buyers</li>
                      <li>• Edit and re-save your listing to extend its visibility</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {properties.length === 0 ? (
              <Card className="text-center py-20">
                <CardContent>
                  <Home className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No properties listed yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by listing your first property.</p>
                  <div className="mt-6">
                    <Link to={createPageUrl('ListProperty')}>
                      <Button>List a Property</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map(prop => {
                  const expiryInfo = getExpiryInfo(prop);
                  
                  return (
                    <Card key={prop.id} className="flex flex-col">
                      <CardHeader>
                        <div className="relative h-40 w-full mb-4">
                           <img 
                             src={prop.images?.[0] || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=400&q=80'} 
                             alt={prop.title} 
                             className="w-full h-full object-cover rounded-t-lg" 
                           />
                           <div className="absolute top-2 right-2 flex flex-col gap-2">
                             <Badge className={
                               prop.approval_status === 'approved' ? 'bg-green-600' :
                               prop.approval_status === 'rejected' ? 'bg-red-600' :
                               'bg-yellow-600'
                             }>
                               {prop.approval_status === 'approved' ? 'Live' :
                                prop.approval_status === 'rejected' ? 'Rejected' :
                                'Pending Review'}
                             </Badge>
                             {prop.scheduled_publish_date && (
                               <Badge className="bg-blue-600">
                                 Scheduled
                               </Badge>
                             )}
                             {expiryInfo && expiryInfo.expired && (
                               <Badge className="bg-red-600">
                                 Expired
                               </Badge>
                             )}
                           </div>
                        </div>
                        <CardTitle className="truncate">{prop.title}</CardTitle>
                        <CardDescription>{prop.city}, {prop.neighborhood}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-lg font-semibold text-blue-600 mb-2">₪{prop.price?.toLocaleString()}</p>
                        
                        {prop.created_date && (
                          <div className="text-sm text-gray-600 mb-2">
                            Listed: {new Date(prop.created_date).toLocaleDateString()}
                          </div>
                        )}
                        
                        {expiryInfo && (
                          <div className={`flex items-center gap-2 text-sm ${expiryInfo.color} mb-2`}>
                            {expiryInfo.expired ? (
                              <AlertTriangle className="w-4 h-4" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                            <span className="font-medium">{expiryInfo.message}</span>
                          </div>
                        )}
                        
                        {expiryInfo && expiryInfo.expired && (
                          <p className="text-xs text-gray-600 bg-red-50 p-2 rounded">
                            This listing has expired. Edit and save to make it visible again.
                          </p>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Link to={createPageUrl(`ListProperty?edit=${prop.id}`)}>
                          <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4"/>Edit</Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the property listing for "{prop.title}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteProperty(prop.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="events">
            {events.length === 0 ? (
              <Card className="text-center py-20">
                <CardContent>
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No events created yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first event.</p>
                  <div className="mt-6">
                    <Link to={createPageUrl('CreateEvent')}>
                      <Button>Create Event</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <Card key={event.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={
                          event.approval_status === 'approved' ? 'bg-green-600' :
                          event.approval_status === 'rejected' ? 'bg-red-600' :
                          'bg-yellow-600'
                        }>
                          {event.approval_status === 'approved' ? 'Live' :
                           event.approval_status === 'rejected' ? 'Rejected' :
                           'Pending Review'}
                        </Badge>
                        {event.featured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                      </div>
                      <CardTitle className="truncate">{event.title}</CardTitle>
                      <CardDescription>
                        {new Date(event.event_date).toLocaleDateString()} • {event.city}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-600 mb-2">
                        {event.start_time} - {event.end_time}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                        {event.description}
                      </p>
                      {event.rejection_reason && (
                        <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
                          <p className="text-xs text-red-800">
                            <strong>Rejection reason:</strong> {event.rejection_reason}
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the event "{event.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}