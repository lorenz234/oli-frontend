'use client';

import type { FC } from 'react';

const PrivacyPolicyPage: FC = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Privacy Policy & Data Protection</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-8">
            We want you to be aware of our privacy policy and how your data is used, shared and protected. 
            We use and share as little information about you as possible.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Overview</h2>
            <p className="text-gray-700">
              Data protection is of a particularly high priority for orbal GmbH. The use of our website 
              is possible without any indication of personal data. However, if you want to use special 
              enterprise services via our website, processing of personal data could become necessary. 
              If processing of personal data is necessary and there is no statutory basis for such 
              processing, we generally obtain consent from the data subject.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Controller Information</h2>
            <div className="bg-gray-500 p-6 rounded-lg">
              <p className="mb-2">Controller for the purposes of the GDPR:</p>
              <div className="ml-4">
                <p>orbal GmbH</p>
                <p>Möckernstr. 120</p>
                <p>10963 Berlin</p>
                <p>Germany</p>
                <p className="mt-4">Represented by: Matthias Seidl</p>
                <p>Email: matthias@orbal-analytics.com</p>
                <p>Website: www.orbal-analytics.com</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">What Data We Collect</h2>
            <p className="text-gray-700 mb-4">Our website collects the following general data and information:</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Browser types and versions used</li>
              <li>Operating system used by the accessing system</li>
              <li>Website from which an accessing system reaches our website (referrers)</li>
              <li>Sub-websites accessed</li>
              <li>Date and time of access</li>
              <li>Internet protocol address (IP address)</li>
              <li>Internet service provider of the accessing system</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Cookies</h2>
            <p className="text-gray-700 mb-4">
              Our website uses cookies to enhance your experience. Cookies are text files stored in your 
              computer system via your browser. We use different types of cookies for different purposes:
            </p>
            
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Types of Cookies We Use</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-700 mb-4">
              <li>
                <strong>Essential Cookies:</strong> These cookies are necessary for the website to function 
                properly and cannot be disabled. They include cookies needed for wallet connections, session 
                management, and security features.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with 
                our website. We use Vercel Analytics which collects anonymized usage data to help us improve 
                our website.
              </li>
              <li>
                <strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites 
                to display relevant advertisements. We only use these cookies with your explicit consent.
              </li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Cookie Consent</h3>
            <p className="text-gray-700 mb-4">
              When you first visit our website, you will be presented with a cookie consent banner that allows 
              you to accept or reject different categories of cookies. You can change your preferences at any time 
              by clicking the &quot;Cookie Settings&quot; link in the footer.
            </p>
            
            <p className="text-gray-700">
              You can also prevent the setting of cookies through your browser settings at any time and thus 
              permanently deny the setting of cookies. However, please note that if you disable essential cookies, 
              some features of the website may not function properly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Your Rights</h2>
            <p className="text-gray-700 mb-4">Under the GDPR, you have the following rights:</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Right to confirmation and access</li>
              <li>Right to rectification</li>
              <li>Right to erasure (Right to be forgotten)</li>
              <li>Right to restriction of processing</li>
              <li>Right to data portability</li>
              <li>Right to object</li>
              <li>Right to withdraw data protection consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Google Analytics</h2>
            <p className="text-gray-700">
              This website uses Google Analytics with anonymization function. Google Analytics is a web 
              analytics service that collects and analyzes data about website visitor behavior. The IP 
              address of users is truncated within member states of the EU or other parties to the 
              Agreement on the European Economic Area before transmission to Google servers.
            </p>
            <p className="text-gray-700 mt-4">
              You can prevent Google Analytics tracking by installing the browser add-on available at: 
              <a 
                href="https://tools.google.com/dlpage/gaoptout" 
                className="text-blue-600 hover:text-blue-800 ml-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://tools.google.com/dlpage/gaoptout
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Contact</h2>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy, please contact us at the address 
              provided above or via email at matthias@orbal-analytics.com.
            </p>
          </section>

          <section className="text-sm text-gray-500 mt-12 pt-8 border-t">
            <p>
              Last updated: October 2025
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;