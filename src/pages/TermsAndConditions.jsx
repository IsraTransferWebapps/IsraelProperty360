import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-gray-600">Last updated: January 2025</p>
        </div>

        <Card>
          <CardContent className="prose prose-slate max-w-none p-8">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using IsraelProperty360 ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Services</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Eligibility</h3>
              <p className="text-gray-700 mb-4">
                You must be at least 18 years old to use our services. By using the Platform, you represent and warrant that you meet this age requirement.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Account Registration</h3>
              <p className="text-gray-700 mb-4">
                Some features of the Platform require account registration. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Account Security</h3>
              <p className="text-gray-700 mb-4">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Property Listings</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Listing Accuracy</h3>
              <p className="text-gray-700 mb-4">
                Property brokers and sellers are responsible for ensuring that all information in their listings is accurate, complete, and up-to-date. IsraelProperty360 reserves the right to remove or modify any listing that violates these terms.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Approval Process</h3>
              <p className="text-gray-700 mb-4">
                All property listings are subject to approval by IsraelProperty360. We reserve the right to reject or remove any listing at our discretion without prior notice.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Listing Content</h3>
              <p className="text-gray-700 mb-4">
                Property listings must not contain false, misleading, or deceptive information. All images must accurately represent the property being listed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Expert Network</h2>
              <p className="text-gray-700 mb-4">
                IsraelProperty360 provides a platform for connecting users with real estate professionals including lawyers, realtors, mortgage advisors, and money exchange services. However, we do not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Guarantee the quality, accuracy, or completeness of services provided by experts</li>
                <li>Endorse or recommend any specific expert or service provider</li>
                <li>Act as an agent or intermediary in transactions between users and experts</li>
                <li>Assume liability for the actions or advice of any expert listed on the Platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Conduct</h2>
              <p className="text-gray-700 mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Use the Platform for any unlawful purpose</li>
                <li>Post false, inaccurate, misleading, or defamatory content</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt the Platform or servers</li>
                <li>Collect or harvest personal information of other users</li>
                <li>Use automated systems to access the Platform without permission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All content on the Platform, including text, graphics, logos, images, and software, is the property of IsraelProperty360 or its content suppliers and is protected by international copyright laws.
              </p>
              <p className="text-gray-700 mb-4">
                Users retain ownership of content they submit but grant IsraelProperty360 a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content on the Platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                IsraelProperty360 shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Platform. We do not guarantee the accuracy, completeness, or usefulness of any information on the Platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify and hold harmless IsraelProperty360 and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of your use of the Platform or violation of these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modifications to Terms</h2>
              <p className="text-gray-700 mb-4">
                IsraelProperty360 reserves the right to modify these terms at any time. We will notify users of significant changes via email or through the Platform. Continued use of the Platform after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to terminate or suspend your account and access to the Platform at our sole discretion, without notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These terms shall be governed by and construed in accordance with the laws of the State of Israel, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> hello@israelproperty360.com
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}