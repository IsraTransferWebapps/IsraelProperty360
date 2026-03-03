import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertCircle, Building, Search, ArrowLeft, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [userType, setUserType] = useState(null);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        company_name: '',
        license_number: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUserTypeSelect = (type) => {
        setUserType(type);
        setStep(2);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.full_name || !formData.phone) {
            setError('Please fill in your full name and phone number.');
            return false;
        }
        if (userType === 'broker' && (!formData.company_name || !formData.license_number)) {
            setError('Company name and license number are required for broker registration.');
            return false;
        }
        setError('');
        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            let currentUser;
            try {
                currentUser = await base44.auth.me();
            } catch (e) {
                // Not authenticated - store data and redirect to login
                sessionStorage.setItem('pendingRegistration', JSON.stringify({
                    userType,
                    formData
                }));
                
                const returnUrl = `${window.location.origin}${createPageUrl('Register')}?returning=true`;
                
                // Use Base44 auth redirect
                await base44.auth.redirectToLogin(returnUrl);
                return;
            }

            // Already authenticated - complete registration
            await finalizeRegistration(currentUser);
        } catch (err) {
            console.error('Registration error:', err);
            setError('Failed to complete registration. Please try again.');
            setIsLoading(false);
        }
    };

    const finalizeRegistration = async (currentUser) => {
        try {
            const updateData = {
                user_type: userType,
                phone: formData.phone,
                full_name: formData.full_name || currentUser.full_name,
                ...(userType === 'broker' && {
                    company_name: formData.company_name,
                    license_number: formData.license_number,
                }),
            };
            
            await base44.auth.updateMe(updateData);
            
            // Clear pending registration
            sessionStorage.removeItem('pendingRegistration');
            
            if (userType === 'broker') {
                navigate(createPageUrl('BrokerDashboard'));
            } else {
                navigate(createPageUrl('Home'));
            }
        } catch (e) {
            console.error("Finalization error:", e);
            setError('Registration failed. Please try again or contact support.');
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        const handleReturn = async () => {
            const params = new URLSearchParams(window.location.search);
            const returning = params.get('returning');

            if (returning === 'true') {
                setIsLoading(true);
                try {
                    const currentUser = await base44.auth.me();
                    const pendingData = sessionStorage.getItem('pendingRegistration');
                    
                    if (pendingData) {
                        const { userType: savedUserType, formData: savedFormData } = JSON.parse(pendingData);
                        
                        setUserType(savedUserType);
                        setFormData(savedFormData);
                        
                        const updateData = {
                            user_type: savedUserType,
                            phone: savedFormData.phone,
                            full_name: savedFormData.full_name || currentUser.full_name,
                            ...(savedUserType === 'broker' && {
                                company_name: savedFormData.company_name,
                                license_number: savedFormData.license_number,
                            }),
                        };
                        
                        await base44.auth.updateMe(updateData);
                        sessionStorage.removeItem('pendingRegistration');

                        if (savedUserType === 'broker') {
                            navigate(createPageUrl('BrokerDashboard'));
                        } else {
                            navigate(createPageUrl('Home'));
                        }
                    } else {
                        navigate(createPageUrl('Register'));
                    }
                } catch (e) {
                    console.error("Return handling error:", e);
                    setError('Registration failed. Please try again.');
                    sessionStorage.removeItem('pendingRegistration');
                    navigate(createPageUrl('Register'));
                } finally {
                    setIsLoading(false);
                }
            }
        };
        
        handleReturn();
    }, [navigate]);

    const renderStep1 = () => (
        <>
            <CardHeader className="text-center">
                <div className="mb-6">
                    <img
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c254383f4_IsraelProperty360logo.png"
                        alt="IsraelProperty360"
                        className="h-16 w-auto mx-auto mb-4"
                    />
                </div>
                <CardTitle className="text-2xl font-bold">Join IsraelProperty360</CardTitle>
                <CardDescription>Unlock exclusive benefits when you register</CardDescription>
                
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 text-left">
                  <h4 className="font-semibold text-gray-900 mb-3 text-center">Your Free Membership Includes:</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Expert Contact Information</p>
                        <p className="text-sm text-gray-600">Direct access to lawyers, realtors, and advisors</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Magazine Delivery</p>
                        <p className="text-sm text-gray-600">Get our property magazine via email or WhatsApp</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Save Favorite Properties</p>
                        <p className="text-sm text-gray-600">Track and compare properties you love</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Exclusive Property Alerts</p>
                        <p className="text-sm text-gray-600">Be first to know about new listings</p>
                      </div>
                    </div>
                  </div>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 p-6">
                <Button
                    variant="outline"
                    className="h-auto p-6 text-left flex items-center gap-4 transition-all hover:shadow-md hover:border-blue-600 hover:bg-blue-600 group"
                    onClick={() => handleUserTypeSelect('visitor')}
                    disabled={isLoading}
                >
                    <Search className="w-8 h-8 text-blue-600 group-hover:text-white flex-shrink-0 transition-colors" />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold group-hover:text-white transition-colors">I'm looking for a property</h3>
                        <p className="text-sm text-gray-600 group-hover:text-blue-50 transition-colors">Browse listings, save favorites, and connect with experts.</p>
                    </div>
                </Button>
                <Button
                    variant="outline"
                    className="h-auto p-6 text-left flex items-center gap-4 transition-all hover:shadow-md hover:border-blue-600 hover:bg-blue-600 group"
                    onClick={() => handleUserTypeSelect('broker')}
                    disabled={isLoading}
                >
                    <Building className="w-8 h-8 text-blue-600 group-hover:text-white flex-shrink-0 transition-colors" />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold group-hover:text-white transition-colors">I'm a real estate broker</h3>
                        <p className="text-sm text-gray-600 group-hover:text-blue-50 transition-colors">List properties, manage your portfolio, and reach more clients.</p>
                    </div>
                </Button>
                <Button
                    variant="outline"
                    className="h-auto p-6 text-left flex items-center gap-4 transition-all hover:shadow-md hover:border-blue-600 hover:bg-blue-600 group"
                    onClick={() => navigate(createPageUrl('RegisterExpert'))}
                    disabled={isLoading}
                >
                    <Users className="w-8 h-8 text-blue-600 group-hover:text-white flex-shrink-0 transition-colors" />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold group-hover:text-white transition-colors">I'm an expert (lawyer, advisor, etc.)</h3>
                        <p className="text-sm text-gray-600 group-hover:text-blue-50 transition-colors">Showcase your services and connect with property buyers.</p>
                    </div>
                </Button>
            </CardContent>
        </>
    );

    const renderStep2 = () => (
        <>
            <CardHeader>
                 <div className="flex items-center gap-4 mb-4">
                    <Button variant="outline" size="icon" onClick={() => { setStep(1); setUserType(null); }}><ArrowLeft className="w-4 h-4" /></Button>
                    <div>
                        <CardTitle>Complete Your Profile</CardTitle>
                        <CardDescription>
                            {userType === 'broker' ? 'Please provide your professional details.' : 'Just a few more details to get you started.'}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <Label htmlFor="full_name">Full Name *</Label>
                            <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone *</Label>
                            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                        </div>
                    </div>
                    {userType === 'broker' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="company_name">Company Name *</Label>
                                <Input id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="license_number">License Number *</Label>
                                <Input id="license_number" name="license_number" value={formData.license_number} onChange={handleChange} required />
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                        <AlertCircle className="w-4 h-4" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <Button 
                    onClick={handleRegister} 
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <svg className="mr-2 h-4 w-4 fill-current" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <title>Google</title>
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.62-4.8 1.62-3.6 0-6.42-2.92-6.42-6.52s2.82-6.52 6.42-6.52c2.02 0 3.32.74 4.28 1.68l2.54-2.54C18.1 1.82 15.54 0 12.48 0 5.6 0 0 5.6 0 12.5S5.6 25 12.48 25c3.2 0 5.68-1.1 7.4-2.74 1.77-1.64 2.48-4.02 2.48-6.44.01-.66-.08-1.32-.2-1.98z"/>
                            </svg>
                            Continue with Google
                        </>
                    )}
                </Button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700 text-center">
                        <strong>Note:</strong> You'll be redirected to sign in with Google to complete your registration.
                    </p>
                </div>
            </CardContent>
        </>
    );
    
    if (isLoading && step === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Processing...</CardTitle>
                        <CardDescription>Please wait while we set up your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center py-10">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-lg">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
            </Card>
        </div>
    );
}