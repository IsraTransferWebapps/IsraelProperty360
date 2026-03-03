import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Disclaimer</h1>
          <p className="text-gray-600">Last updated: January 2025</p>
        </div>

        <Card>
          <CardContent className="prose prose-slate max-w-none p-8">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">General Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                The information provided by IsraelProperty360 ("we," "our," or "us") on this platform is for general informational purposes only. All information on the platform is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Listings Disclaimer</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Accuracy of Information</h3>
              <p className="text-gray-700 mb-4">
                Property listings are provided by third-party brokers and sellers. While we strive to ensure accuracy, we do not guarantee that all property information is accurate, complete, or up-to-date. Property details, prices, availability, and other information are subject to change without notice.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">No Endorsement</h3>
              <p className="text-gray-700 mb-4">
                The inclusion of any property listing on our platform does not constitute an endorsement, recommendation, or verification by IsraelProperty360. We are not responsible for the quality, condition, or legality of any listed property.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Independent Verification</h3>
              <p className="text-gray-700 mb-4">
                Users are strongly encouraged to independently verify all property information, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Property condition and specifications</li>
                <li>Legal title and ownership</li>
                <li>Zoning and building permits</li>
                <li>Property taxes and fees</li>
                <li>Neighborhood characteristics</li>
                <li>Market value and pricing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Expert Network Disclaimer</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">No Professional Relationship</h3>
              <p className="text-gray-700 mb-4">
                IsraelProperty360 provides a platform for connecting users with real estate professionals, including lawyers, realtors, mortgage advisors, and money exchange services. However:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>We do not employ these professionals</li>
                <li>We are not responsible for their actions, advice, or services</li>
                <li>We do not verify their credentials beyond basic information</li>
                <li>We do not guarantee the quality of their services</li>
                <li>We are not liable for any losses resulting from their services</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Independent Contractors</h3>
              <p className="text-gray-700 mb-4">
                All experts listed on our platform are independent contractors. Any engagement with them creates a direct relationship between you and the expert, not with IsraelProperty360.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal and Financial Advice Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                The information on this platform is not intended to be, and should not be construed as, legal, financial, tax, or investment advice. Users should:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Consult with qualified professionals before making any property decisions</li>
                <li>Seek independent legal advice regarding contracts and transactions</li>
                <li>Obtain professional financial advice regarding mortgages and investments</li>
                <li>Verify all tax implications with a qualified tax advisor</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Market Information Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                Market trends, statistics, and analysis provided on the platform are for informational purposes only. Real estate markets are subject to rapid change, and past performance is not indicative of future results. Users should not rely solely on this information for investment decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">City and Neighborhood Information</h2>
              <p className="text-gray-700 mb-4">
                Information about cities and neighborhoods, including safety ratings, school ratings, and cost of living, is provided for general reference only. These ratings are subjective and may not reflect current conditions. Users should conduct their own research and visit locations in person before making decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">External Links Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                Our platform may contain links to external websites. We have no control over the content, privacy policies, or practices of third-party websites and assume no responsibility for them. Users access third-party websites at their own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Warranty</h2>
              <p className="text-gray-700 mb-4">
                The platform and all information, content, materials, and services provided are on an "as is" and "as available" basis without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement</li>
                <li>Accuracy or completeness of information</li>
                <li>Uninterrupted or error-free operation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Under no circumstances shall IsraelProperty360, its officers, directors, employees, or agents be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or relating to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Your use of or inability to use the platform</li>
                <li>Any property transaction or investment decision</li>
                <li>Information or advice provided by experts</li>
                <li>Errors or omissions in property listings</li>
                <li>Any dealings with brokers, sellers, or service providers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibility</h2>
              <p className="text-gray-700 mb-4">
                Users are solely responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Conducting due diligence on all properties and transactions</li>
                <li>Verifying credentials of professionals they engage</li>
                <li>Making informed decisions based on comprehensive research</li>
                <li>Complying with all applicable laws and regulations</li>
                <li>Protecting their own interests in all transactions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Israeli Law Compliance</h2>
              <p className="text-gray-700 mb-4">
                Real estate transactions in Israel are subject to Israeli law. Users, especially foreign buyers, should be aware that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Different laws may apply to residents and non-residents</li>
                <li>Tax obligations vary based on residency status</li>
                <li>Property purchase procedures differ from other countries</li>
                <li>Currency regulations may affect transactions</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Professional legal and financial advice is essential before proceeding with any transaction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Disclaimer, please contact us at:
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