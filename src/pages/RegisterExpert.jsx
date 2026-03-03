import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertCircle, CheckCircle, Users, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const getExpertiseLabel = (expertise) => {
    const labels = {
        lawyer: 'Lawyer',
        realtor: 'Realtor',
        mortgage_advisor: 'Mortgage Advisor',
        money_exchange: 'Money Exchange',
        interior_designer: 'Interior Designer',
        property_management: 'Property Management'
    };
    return labels[expertise] || expertise;
};

export default function RegisterExpertPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        expertise: '',
        company: '',
        description: '',
        experience_years: '',
        specialties: '',
        languages: '',
        website: 'https://',
        video_url: ''
    });
    const [videoFile, setVideoFile] = useState(null);
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleVideoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            setError('Video file must be less than 50MB');
            return;
        }

        // Check file type
        if (!file.type.startsWith('video/')) {
            setError('Please upload a video file');
            return;
        }

        setIsUploadingVideo(true);
        setError('');

        try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            setFormData(prev => ({ ...prev, video_url: file_url }));
            setVideoFile(file);
        } catch (err) {
            console.error('Video upload error:', err);
            setError('Failed to upload video. Please try again.');
        } finally {
            setIsUploadingVideo(false);
        }
    };

    const validateForm = () => {
         if (!formData.name || !formData.email || !formData.phone || !formData.expertise || !formData.company || !formData.description || !formData.website || formData.website === 'https://') {
            setError('Please fill in all required fields including your professional bio and website.');
            return false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        
        setError('');
        return true;
    }

    const handleRegistration = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        setError('');
        
        try {
            // Create expert profile with pending status
            const expertData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                expertise: formData.expertise,
                company: formData.company,
                description: formData.description,
                experience_years: formData.experience_years ? Number(formData.experience_years) : undefined,
                specialties: formData.specialties ? formData.specialties.split(',').map(s => s.trim()).filter(s => s) : [],
                languages: formData.languages ? formData.languages.split(',').map(l => l.trim()).filter(l => l) : [],
                website: (formData.website && formData.website !== 'https://') ? formData.website : undefined,
                video_url: formData.video_url || undefined,
                featured: false,
                approval_status: 'pending'
            };

            const newExpert = await base44.entities.Expert.create(expertData);

            // Notify all admin users
            try {
                const allUsers = await base44.entities.User.list();
                const adminUsers = allUsers.filter(u => u.role === 'admin');

                for (const admin of adminUsers) {
                    await base44.integrations.Core.SendEmail({
                        to: admin.email,
                        subject: 'New Expert Registration - Review Required',
                        body: `Hello ${admin.full_name},

            A new expert has registered on IsraelProperty360 and requires your review.

            Expert Details:
            - Name: ${formData.name}
            - Expertise: ${getExpertiseLabel(formData.expertise)}
            - Company: ${formData.company}
            - Email: ${formData.email}
            - Phone: ${formData.phone}

            Please review and approve/reject this expert in the admin panel:
            ${window.location.origin}${createPageUrl('AdminReviewExperts')}

            Thank you,
            IsraelProperty360 System`
                    });
                }
            } catch (emailError) {
                console.log('Could not send admin notification:', emailError);
            }

            setShowSuccess(true);
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Failed to complete registration. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <Card className="w-full max-w-md text-center p-8 shadow-xl">
                    <CardHeader className="p-0">
                        <CardTitle className="text-2xl">Finalizing Your Profile</CardTitle>
                        <CardDescription className="mt-2">Please wait while we set up your expert account...</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center py-10 p-0">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (showSuccess) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="max-w-md">
                <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Submission Received!
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Thank you for registering! Your profile is now under review by our team. Once approved, you'll be live on the platform and can create an account to manage your profile.
                    </p>
                    <Link to={createPageUrl('Home')}>
                        <Button className="w-full">
                            Return to Homepage
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
      );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <Users className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Register as an Expert
                    </h1>
                    <p className="text-lg text-gray-600">
                        Join our network of verified real estate professionals
                    </p>
                </div>

                <Card>
                    <CardContent className="p-8">
                        <form onSubmit={handleRegistration} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your full name"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="phone">Phone *</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="+972-XX-XXX-XXXX"
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="expertise">Area of Expertise *</Label>
                                    <Select value={formData.expertise} onValueChange={(value) => {setFormData(prev => ({ ...prev, expertise: value })); setError('');}}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select expertise" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lawyer">Lawyer</SelectItem>
                                            <SelectItem value="realtor">Realtor</SelectItem>
                                            <SelectItem value="mortgage_advisor">Mortgage Advisor</SelectItem>
                                            <SelectItem value="money_exchange">Money Exchange</SelectItem>
                                            <SelectItem value="interior_designer">Interior Designer</SelectItem>
                                            <SelectItem value="property_management">Property Management</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="md:col-span-2">
                                    <Label htmlFor="company">Company Name *</Label>
                                    <Input
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your company name"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="description">Professional Bio *</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        placeholder="Tell us about your professional background, experience, and what makes you stand out..."
                                        rows={5}
                                        className="resize-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        This will be displayed on your expert profile page
                                    </p>
                                </div>
                                
                                <div>
                                    <Label htmlFor="experience_years">Years of Experience</Label>
                                    <Input
                                        id="experience_years"
                                        name="experience_years"
                                        type="number"
                                        value={formData.experience_years}
                                        onChange={handleChange}
                                        placeholder="e.g., 10"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="website">Website *</Label>
                                    <Input
                                        id="website"
                                        name="website"
                                        type="url"
                                        value={formData.website}
                                        onChange={handleChange}
                                        required
                                        placeholder="https://yourwebsite.com"
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <Label htmlFor="specialties">Specialties</Label>
                                    <Input
                                        id="specialties"
                                        name="specialties"
                                        value={formData.specialties}
                                        onChange={handleChange}
                                        placeholder="e.g., Commercial Real Estate, Property Tax, International Clients"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Separate multiple specialties with commas
                                    </p>
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="languages">Languages Spoken</Label>
                                    <Input
                                        id="languages"
                                        name="languages"
                                        value={formData.languages}
                                        onChange={handleChange}
                                        placeholder="e.g., English, Hebrew, French"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Separate multiple languages with commas
                                    </p>
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="video">Introduction Video (Optional)</Label>
                                    <div className="mt-2">
                                        <div className="flex items-center gap-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('video-upload').click()}
                                                disabled={isUploadingVideo}
                                                className="w-full"
                                            >
                                                {isUploadingVideo ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-4 h-4 mr-2" />
                                                        {videoFile ? 'Change Video' : 'Upload Video'}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <input
                                            id="video-upload"
                                            type="file"
                                            accept="video/*"
                                            onChange={handleVideoUpload}
                                            className="hidden"
                                        />
                                        {videoFile && (
                                            <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                {videoFile.name} uploaded successfully
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            Upload a short video introducing yourself (max 50MB, MP4 recommended)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                                    <AlertCircle className="w-4 h-4" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                            
                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                                disabled={isLoading || isUploadingVideo}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    'Register as Expert'
                                )}
                                </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}