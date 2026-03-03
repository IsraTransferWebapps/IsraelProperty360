import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function AdminReviewExpertsPage() {
    const [experts, setExperts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);

    useEffect(() => {
        loadExperts();
    }, []);

    const loadExperts = async () => {
        setIsLoading(true);
        try {
            const allExperts = await base44.entities.Expert.list('-created_date', 100);
            setExperts(allExperts);
        } catch (error) {
            console.error('Error loading experts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (expert) => {
        setIsProcessing(true);
        try {
            await base44.entities.Expert.update(expert.id, {
                approval_status: 'approved'
            });
            
            // Try to send email, but don't fail if it errors
            try {
                await base44.integrations.Core.SendEmail({
                    to: expert.email,
                    subject: 'Your IsraelProperty360 Expert Profile is Now Live!',
                    body: `Hi ${expert.name},

Great news! Your expert profile on IsraelProperty360 has been approved and is now live.

You can view your profile and create an account at: ${window.location.origin}

To manage your profile in the future, please register an account using the same email address (${expert.email}).

Welcome to the IsraelProperty360 community!

Best regards,
The IsraelProperty360 Team`
                });
            } catch (emailError) {
                console.log('Could not send email:', emailError);
            }

            await loadExperts();
        } catch (error) {
            console.error('Error approving expert:', error);
            alert('Failed to approve expert');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }

        setIsProcessing(true);
        try {
            await base44.entities.Expert.update(selectedExpert.id, {
                approval_status: 'rejected',
                rejection_reason: rejectionReason
            });

            // Try to send email, but don't fail if it errors
            try {
                await base44.integrations.Core.SendEmail({
                    to: selectedExpert.email,
                    subject: 'Update on Your IsraelProperty360 Expert Application',
                    body: `Hi ${selectedExpert.name},

Thank you for your interest in joining IsraelProperty360 as an expert.

After review, we're unable to approve your profile at this time.

Reason: ${rejectionReason}

If you have any questions or would like to reapply, please contact us at hello@israelproperty360.com

Best regards,
The IsraelProperty360 Team`
                });
            } catch (emailError) {
                console.log('Could not send email:', emailError);
            }

            setShowRejectDialog(false);
            setSelectedExpert(null);
            setRejectionReason('');
            await loadExperts();
        } catch (error) {
            console.error('Error rejecting expert:', error);
            alert('Failed to reject expert');
        } finally {
            setIsProcessing(false);
        }
    };

    const openRejectDialog = (expert) => {
        setSelectedExpert(expert);
        setShowRejectDialog(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
            case 'approved':
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
            default:
                return null;
        }
    };

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const pendingExperts = experts.filter(e => e.approval_status === 'pending');
    const approvedExperts = experts.filter(e => e.approval_status === 'approved');
    const rejectedExperts = experts.filter(e => e.approval_status === 'rejected');

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Review Expert Registrations</h1>

                {/* Pending Experts */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Pending Review ({pendingExperts.length})
                    </h2>
                    {pendingExperts.length === 0 ? (
                        <p className="text-gray-500">No pending experts</p>
                    ) : (
                        <div className="grid gap-6">
                            {pendingExperts.map((expert) => (
                                <Card key={expert.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl">{expert.name}</CardTitle>
                                                <div className="flex gap-2 mt-2">
                                                    {getStatusBadge(expert.approval_status)}
                                                    <Badge variant="outline">{getExpertiseLabel(expert.expertise)}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{expert.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="font-medium">{expert.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Company</p>
                                                <p className="font-medium">{expert.company}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Experience</p>
                                                <p className="font-medium">{expert.experience_years ? `${expert.experience_years} years` : 'Not specified'}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Professional Bio</p>
                                            <p className="text-gray-700">{expert.description}</p>
                                        </div>

                                        {expert.specialties && expert.specialties.length > 0 && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Specialties</p>
                                                <p className="text-gray-700">{expert.specialties.join(', ')}</p>
                                            </div>
                                        )}

                                        {expert.languages && expert.languages.length > 0 && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Languages</p>
                                                <p className="text-gray-700">{expert.languages.join(', ')}</p>
                                            </div>
                                        )}

                                        {expert.website && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Website</p>
                                                <a href={expert.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                    {expert.website}
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        )}

                                        {expert.video_url && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Introduction Video</p>
                                                <video src={expert.video_url} controls className="max-w-md rounded-lg" />
                                            </div>
                                        )}

                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                onClick={() => handleApprove(expert)}
                                                disabled={isProcessing}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                                Approve
                                            </Button>
                                            <Button
                                                onClick={() => openRejectDialog(expert)}
                                                disabled={isProcessing}
                                                variant="destructive"
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

                {/* Approved Experts */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Approved ({approvedExperts.length})
                    </h2>
                    {approvedExperts.length === 0 ? (
                        <p className="text-gray-500">No approved experts</p>
                    ) : (
                        <div className="grid gap-4">
                            {approvedExperts.map((expert) => (
                                <Card key={expert.id} className="bg-green-50">
                                    <CardContent className="py-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{expert.name}</p>
                                                <p className="text-sm text-gray-600">{getExpertiseLabel(expert.expertise)} • {expert.company}</p>
                                            </div>
                                            {getStatusBadge(expert.approval_status)}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Rejected Experts */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Rejected ({rejectedExperts.length})
                    </h2>
                    {rejectedExperts.length === 0 ? (
                        <p className="text-gray-500">No rejected experts</p>
                    ) : (
                        <div className="grid gap-4">
                            {rejectedExperts.map((expert) => (
                                <Card key={expert.id} className="bg-red-50">
                                    <CardContent className="py-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-semibold">{expert.name}</p>
                                                <p className="text-sm text-gray-600">{getExpertiseLabel(expert.expertise)} • {expert.company}</p>
                                                {expert.rejection_reason && (
                                                    <p className="text-sm text-red-700 mt-1">Reason: {expert.rejection_reason}</p>
                                                )}
                                            </div>
                                            {getStatusBadge(expert.approval_status)}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Expert Application</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="rejection-reason">Reason for Rejection</Label>
                        <Textarea
                            id="rejection-reason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please provide a clear reason for rejecting this application..."
                            rows={4}
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Reject Application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}