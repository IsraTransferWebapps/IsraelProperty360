import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft, X, Upload, Loader2, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ListPropertyPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [schedulePublish, setSchedulePublish] = useState(false);
  const [property, setProperty] = useState({
    reference_number: '',
    title: '', description: '', price: '', price_from: false, property_type: '', status: 'for_sale',
    city: '', neighborhood: '', address: '', bedrooms: '', bathrooms: '',
    size_sqm: '', floor: '', parking_spaces: '', balcony: false, elevator: false,
    furnished: false, pool: false, gym: false, mamad: false, storage: false,
    air_conditioning: false, renovated: false, accessible: false, garden: false,
    terrace: false, security_system: false, featured: false, completion_date: '',
    images: [], scheduled_publish_date: ''
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  const propertyId = new URLSearchParams(location.search).get('edit');

  useEffect(() => {
    const checkUserAndLoadData = async () => {
      try {
        const currentUser = await base44.auth.me(); // Changed from base44.entities.User.me()
        if (currentUser.user_type !== 'broker') {
          navigate(createPageUrl('Home'));
          return;
        }
        setUser(currentUser);

        if (propertyId) {
          const properties = await base44.entities.Property.filter({ id: propertyId });
          if (properties.length > 0 && properties[0].broker_email === currentUser.email) {
            const fetchedProperty = properties[0];
            setProperty(prev => ({
              ...prev,
              ...fetchedProperty,
              // Convert date objects to YYYY-MM-DD for input type="date"
              completion_date: fetchedProperty.completion_date ? new Date(fetchedProperty.completion_date).toISOString().split('T')[0] : '',
              scheduled_publish_date: fetchedProperty.scheduled_publish_date ? new Date(fetchedProperty.scheduled_publish_date).toISOString().split('T')[0] : ''
            }));
            if (fetchedProperty.scheduled_publish_date) {
              setSchedulePublish(true);
            }
          } else {
            setError('Property not found or you don\'t have permission to edit it.');
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        navigate(createPageUrl('Home'));
      } finally {
        setIsLoading(false);
      }
    };
    checkUserAndLoadData();
  }, [propertyId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProperty(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSelectChange = (name, value) => {
    setProperty(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleImageUpload = async () => {
    if (imageFiles.length === 0) return property.images || [];

    setIsUploading(true);
    const uploadedUrls = [];
    for (const file of imageFiles) {
      try {
        const result = await base44.integrations.Core.UploadFile({ file }); // Changed from UploadFile
        if (result.file_url) {
          uploadedUrls.push(result.file_url);
        }
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
    setIsUploading(false);
    return [...(property.images || []), ...uploadedUrls];
  };

  const generateReferenceNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `REF-${year}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    try {
      const uploadedImageUrls = await handleImageUpload();
      
      // Clean up the property data - convert empty strings to undefined for numeric fields
      const propertyData = {
        reference_number: property.reference_number || generateReferenceNumber(), // Use existing or generate new REF
        title: property.title,
        description: property.description,
        price: property.price ? Number(property.price) : undefined,
        property_type: property.property_type,
        status: property.status,
        approval_status: 'pending', // New field for approval workflow
        city: property.city,
        neighborhood: property.neighborhood || undefined,
        address: property.address || undefined,
        bedrooms: property.bedrooms ? Number(property.bedrooms) : undefined,
        bathrooms: property.bathrooms ? Number(property.bathrooms) : undefined,
        size_sqm: property.size_sqm ? Number(property.size_sqm) : undefined,
        floor: property.floor ? Number(property.floor) : undefined,
        parking_spaces: property.parking_spaces ? Number(property.parking_spaces) : undefined,
        balcony: property.balcony,
        elevator: property.elevator,
        furnished: property.furnished,
        pool: property.pool,
        gym: property.gym,
        mamad: property.mamad,
        storage: property.storage,
        air_conditioning: property.air_conditioning,
        renovated: property.renovated,
        accessible: property.accessible,
        garden: property.garden,
        terrace: property.terrace,
        security_system: property.security_system,
        price_from: property.price_from,
        featured: property.featured,
        completion_date: property.completion_date || undefined,
        scheduled_publish_date: schedulePublish && property.scheduled_publish_date ? property.scheduled_publish_date : undefined,
        images: uploadedImageUrls,
        broker_email: user.email,
        broker_name: user.full_name
      };
      
      let savedProperty;
      if (propertyId) {
        savedProperty = await base44.entities.Property.update(propertyId, propertyData);
      } else {
        savedProperty = await base44.entities.Property.create(propertyData);
        
        // Send notification email to admin
        try {
          await base44.integrations.Core.SendEmail({
            to: 'hello@israelproperty360.com',
            subject: `New Property Submitted - REF: ${propertyData.reference_number}`, // Updated subject
            body: `A new property has been submitted for approval:

Reference Number: ${propertyData.reference_number}
Property Title: ${property.title}
City: ${property.city}
Price: ₪${property.price}
Broker: ${user.full_name} (${user.email})
${schedulePublish && property.scheduled_publish_date ? `Scheduled to publish: ${new Date(property.scheduled_publish_date).toLocaleDateString()}` : 'Publish immediately upon approval'}

Please review and approve this property at:
${window.location.origin}${createPageUrl('AdminReviewProperties')}

Property Details:
${property.description}
`
          });
        } catch (emailError) {
          console.error('Failed to send notification email:', emailError);
        }
      }
      
      setShowSuccess(true);
    } catch (error) {
      console.error("Failed to save property:", error);
      setError('Failed to save property. Please try again.');
      setIsSaving(false);
    }
  };

  const removeImage = (index) => {
    setProperty(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

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
    "Zichron Ya'akov"
  ];
  const propertyTypes = ["apartment", "house", "villa", "penthouse", "studio", "commercial", "land"];

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600 mb-4">You need to be logged in as a broker to access this page.</p>
            <Link to={createPageUrl('Register')}>
              <Button>Register as Broker</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Property Submitted Successfully!
            </h3>
            <p className="text-gray-600 mb-6">
              Your property has been submitted for review. Our team will review it and approve it shortly.
              {schedulePublish && property.scheduled_publish_date && (
                <span className="block mt-2">
                  It will be published on {new Date(property.scheduled_publish_date).toLocaleDateString()}.
                </span>
              )}
            </p>
            <div className="space-y-3">
              <Link to={createPageUrl('BrokerDashboard')}>
                <Button className="w-full">
                  Return to Dashboard
                </Button>
              </Link>
              <Link to={createPageUrl('ListProperty')}>
                <Button variant="outline" className="w-full">
                  List Another Property
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !showSuccess) { // Ensure error is not shown simultaneously with success
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <Link to={createPageUrl('BrokerDashboard')}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card>
            <CardContent className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
              <p className="text-gray-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <CardTitle>
              {propertyId ? 'Edit Property' : 'List a New Property'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="reference_number">Reference Number</Label>
                  <Input 
                    id="reference_number"
                    name="reference_number" 
                    placeholder="e.g., REF-2024-001 (auto-generated if left empty)" 
                    value={property.reference_number} 
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to auto-generate a unique reference number
                  </p>
                </div>

                <Input 
                  name="title" 
                  placeholder="Property Title" 
                  value={property.title} 
                  onChange={handleChange} 
                  required 
                  className="md:col-span-2" 
                />
                <Textarea 
                  name="description" 
                  placeholder="Property Description" 
                  value={property.description} 
                  onChange={handleChange} 
                  className="md:col-span-2" 
                />
                
                <div>
                  <Input 
                    name="price" 
                    type="number" 
                    placeholder="Price (₪)" 
                    value={property.price} 
                    onChange={handleChange} 
                    required 
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Checkbox 
                      id="price_from" 
                      name="price_from" 
                      checked={property.price_from} 
                      onCheckedChange={(c) => handleSelectChange('price_from', c)} 
                    />
                    <Label htmlFor="price_from" className="text-sm font-normal">
                      Show as "From" price (for developments with multiple units)
                    </Label>
                  </div>
                </div>
                <Select onValueChange={(v) => handleSelectChange('property_type', v)} value={property.property_type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map(t => (
                      <SelectItem key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={(v) => handleSelectChange('city', v)} value={property.city}>
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input 
                  name="neighborhood" 
                  placeholder="Neighborhood" 
                  value={property.neighborhood} 
                  onChange={handleChange} 
                />
                <Input 
                  name="address" 
                  placeholder="Full Address" 
                  value={property.address} 
                  onChange={handleChange} 
                  className="md:col-span-2" 
                />

                <Input 
                  name="bedrooms" 
                  type="number" 
                  placeholder="Bedrooms" 
                  value={property.bedrooms} 
                  onChange={handleChange} 
                />
                <Input 
                  name="bathrooms" 
                  type="number" 
                  placeholder="Bathrooms" 
                  value={property.bathrooms} 
                  onChange={handleChange} 
                />
                <Input 
                  name="size_sqm" 
                  type="number" 
                  placeholder="Size (sqm)" 
                  value={property.size_sqm} 
                  onChange={handleChange} 
                />
                <Input 
                  name="floor" 
                  type="number" 
                  placeholder="Floor" 
                  value={property.floor} 
                  onChange={handleChange} 
                />
                <Input 
                  name="parking_spaces" 
                  type="number" 
                  placeholder="Parking Spaces" 
                  value={property.parking_spaces} 
                  onChange={handleChange} 
                />

                <Select onValueChange={(v) => handleSelectChange('status', v)} value={property.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="for_sale">For Sale</SelectItem>
                    <SelectItem value="in_development">New Construction</SelectItem>
                  </SelectContent>
                </Select>

                {property.status === 'in_development' && (
                  <div className="md:col-span-2">
                    <Label htmlFor="completion_date">Expected Completion Date</Label>
                    <Input 
                      id="completion_date" 
                      name="completion_date" 
                      type="date" 
                      value={property.completion_date} 
                      onChange={handleChange} 
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label>Amenities & Features</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="balcony" 
                      name="balcony" 
                      checked={property.balcony} 
                      onCheckedChange={(c) => handleSelectChange('balcony', c)} 
                    />
                    <Label htmlFor="balcony">Balcony</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="elevator" 
                      name="elevator" 
                      checked={property.elevator} 
                      onCheckedChange={(c) => handleSelectChange('elevator', c)} 
                    />
                    <Label htmlFor="elevator">Elevator</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="furnished" 
                      name="furnished" 
                      checked={property.furnished} 
                      onCheckedChange={(c) => handleSelectChange('furnished', c)} 
                    />
                    <Label htmlFor="furnished">Furnished</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="pool" 
                      name="pool" 
                      checked={property.pool} 
                      onCheckedChange={(c) => handleSelectChange('pool', c)} 
                    />
                    <Label htmlFor="pool">Pool</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="gym" 
                      name="gym" 
                      checked={property.gym} 
                      onCheckedChange={(c) => handleSelectChange('gym', c)} 
                    />
                    <Label htmlFor="gym">Gym</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="mamad" 
                      name="mamad" 
                      checked={property.mamad} 
                      onCheckedChange={(c) => handleSelectChange('mamad', c)} 
                    />
                    <Label htmlFor="mamad">Mamad (Safe Room)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="storage" 
                      name="storage" 
                      checked={property.storage} 
                      onCheckedChange={(c) => handleSelectChange('storage', c)} 
                    />
                    <Label htmlFor="storage">Storage</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="air_conditioning" 
                      name="air_conditioning" 
                      checked={property.air_conditioning} 
                      onCheckedChange={(c) => handleSelectChange('air_conditioning', c)} 
                    />
                    <Label htmlFor="air_conditioning">A/C</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="renovated" 
                      name="renovated" 
                      checked={property.renovated} 
                      onCheckedChange={(c) => handleSelectChange('renovated', c)} 
                    />
                    <Label htmlFor="renovated">Renovated</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="accessible" 
                      name="accessible" 
                      checked={property.accessible} 
                      onCheckedChange={(c) => handleSelectChange('accessible', c)} 
                    />
                    <Label htmlFor="accessible">Accessible</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="garden" 
                      name="garden" 
                      checked={property.garden} 
                      onCheckedChange={(c) => handleSelectChange('garden', c)} 
                    />
                    <Label htmlFor="garden">Garden</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="terrace" 
                      name="terrace" 
                      checked={property.terrace} 
                      onCheckedChange={(c) => handleSelectChange('terrace', c)} 
                    />
                    <Label htmlFor="terrace">Terrace</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="security_system" 
                      name="security_system" 
                      checked={property.security_system} 
                      onCheckedChange={(c) => handleSelectChange('security_system', c)} 
                    />
                    <Label htmlFor="security_system">Security</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Images</Label>
                <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {property.images?.map((url, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={url} 
                        alt={`Property image ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-md" 
                      />
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100" 
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <Label htmlFor="image-upload" className="mt-2 block text-sm font-medium text-gray-900 cursor-pointer">
                    Upload new images
                    <Input 
                      id="image-upload" 
                      type="file" 
                      multiple 
                      onChange={handleImageChange} 
                      className="sr-only" 
                    />
                  </Label>
                  {imageFiles.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">{imageFiles.length} file(s) selected</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Scheduling Options</Label>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="schedule_publish" 
                    checked={schedulePublish} 
                    onCheckedChange={(checked) => setSchedulePublish(checked)} 
                  />
                  <Label htmlFor="schedule_publish" className="font-normal">
                    Schedule property to go live at a specific date
                  </Label>
                </div>
                
                {schedulePublish && (
                  <div>
                    <Label htmlFor="scheduled_publish_date">Publish Date</Label>
                    <Input 
                      id="scheduled_publish_date" 
                      name="scheduled_publish_date" 
                      type="date" 
                      value={property.scheduled_publish_date} 
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Property will be published automatically on this date after approval
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> All properties are reviewed by our team before going live. 
                  You'll be notified once your property is approved.
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isUploading || isSaving}>
                  {(isUploading || isSaving) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isUploading ? 'Uploading images...' : (isSaving ? 'Saving...' : (propertyId ? 'Update Property' : 'Submit for Review'))}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}