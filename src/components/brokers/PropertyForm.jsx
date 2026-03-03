import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UploadFile } from "@/integrations/Core";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";

export default function PropertyForm({ onSubmit, initialData = {}, isSaving }) {
  const [property, setProperty] = useState({
    title: '', description: '', price: '', property_type: '', status: 'for_sale',
    city: '', neighborhood: '', address: '', bedrooms: '', bathrooms: '',
    size_sqm: '', floor: '', parking_spaces: '', balcony: false, elevator: false,
    furnished: false, featured: false, completion_date: '', images: [],
    ...initialData
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

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
        const result = await UploadFile({ file });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadedImageUrls = await handleImageUpload();
    onSubmit({ ...property, images: uploadedImageUrls });
  };

  const removeImage = (index) => {
    setProperty(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const cities = ["Tel Aviv", "Jerusalem", "Haifa", "Netanya", "Herzliya", "Raanana", "Petah Tikva"];
  const propertyTypes = ["apartment", "house", "villa", "penthouse", "studio", "commercial", "land"];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input name="title" placeholder="Property Title" value={property.title} onChange={handleChange} required className="md:col-span-2" />
        <Textarea name="description" placeholder="Property Description" value={property.description} onChange={handleChange} className="md:col-span-2" />
        
        <Input name="price" type="number" placeholder="Price (₪)" value={property.price} onChange={handleChange} required />
        <Select name="property_type" onValueChange={(v) => handleSelectChange('property_type', v)} value={property.property_type} required>
          <SelectTrigger><SelectValue placeholder="Property Type" /></SelectTrigger>
          <SelectContent>{propertyTypes.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}</SelectContent>
        </Select>

        <Select name="city" onValueChange={(v) => handleSelectChange('city', v)} value={property.city} required>
          <SelectTrigger><SelectValue placeholder="City" /></SelectTrigger>
          <SelectContent>{cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <Input name="neighborhood" placeholder="Neighborhood" value={property.neighborhood} onChange={handleChange} />
        <Input name="address" placeholder="Full Address" value={property.address} onChange={handleChange} className="md:col-span-2" />

        <Input name="bedrooms" type="number" placeholder="Bedrooms" value={property.bedrooms} onChange={handleChange} />
        <Input name="bathrooms" type="number" placeholder="Bathrooms" value={property.bathrooms} onChange={handleChange} />
        <Input name="size_sqm" type="number" placeholder="Size (sqm)" value={property.size_sqm} onChange={handleChange} />
        <Input name="floor" type="number" placeholder="Floor" value={property.floor} onChange={handleChange} />
        <Input name="parking_spaces" type="number" placeholder="Parking Spaces" value={property.parking_spaces} onChange={handleChange} />

        <Select name="status" onValueChange={(v) => handleSelectChange('status', v)} value={property.status}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="for_sale">For Sale</SelectItem>
            <SelectItem value="in_development">In Development</SelectItem>
          </SelectContent>
        </Select>

        {property.status === 'in_development' && (
          <div className="md:col-span-2">
            <Label htmlFor="completion_date">Expected Completion Date</Label>
            <Input id="completion_date" name="completion_date" type="date" value={property.completion_date} onChange={handleChange} />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label>Features</Label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2"><Checkbox id="balcony" name="balcony" checked={property.balcony} onCheckedChange={(c) => handleSelectChange('balcony', c)} /><Label htmlFor="balcony">Balcony</Label></div>
          <div className="flex items-center gap-2"><Checkbox id="elevator" name="elevator" checked={property.elevator} onCheckedChange={(c) => handleSelectChange('elevator', c)} /><Label htmlFor="elevator">Elevator</Label></div>
          <div className="flex items-center gap-2"><Checkbox id="furnished" name="furnished" checked={property.furnished} onCheckedChange={(c) => handleSelectChange('furnished', c)} /><Label htmlFor="furnished">Furnished</Label></div>
          <div className="flex items-center gap-2"><Checkbox id="featured" name="featured" checked={property.featured} onCheckedChange={(c) => handleSelectChange('featured', c)} /><Label htmlFor="featured">Featured Listing</Label></div>
        </div>
      </div>

      <div>
        <Label>Images</Label>
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {property.images?.map((url, index) => (
            <div key={index} className="relative group">
              <img src={url} alt={`Property image ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
              <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeImage(index)}><X className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
        <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <Label htmlFor="image-upload" className="mt-2 block text-sm font-medium text-gray-900 cursor-pointer">
                Upload new images
                <Input id="image-upload" type="file" multiple onChange={handleImageChange} className="sr-only" />
            </Label>
            {imageFiles.length > 0 && <p className="text-xs text-gray-500 mt-1">{imageFiles.length} file(s) selected</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isUploading || isSaving}>
          {(isUploading || isSaving) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUploading ? 'Uploading images...' : (isSaving ? 'Saving...' : (initialData.id ? 'Update Property' : 'Create Property'))}
        </Button>
      </div>
    </form>
  );
}