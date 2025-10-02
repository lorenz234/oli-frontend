'use client';

import React, { useState } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const CookieConsentBanner: React.FC = () => {
  const { 
    consentState, 
    hasInteracted, 
    updateConsent, 
    acceptAll, 
    rejectAll, 
    savePreferences 
  } = useCookieConsent();
  
  const [showDetails, setShowDetails] = useState(false);

  // If user has already made a choice, don't show the banner
  if (hasInteracted) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">Cookie Preferences</h3>
            <p className="mt-1 text-sm text-gray-600">
              We use cookies to enhance your experience on our website. By clicking &quot;Accept All&quot;, you consent to the use of all cookies. 
              You can also customize your preferences by clicking &quot;Customize&quot;.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              {showDetails ? 'Hide Details' : 'Customize'}
            </button>
            <button
              onClick={rejectAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-md"
            >
              Reject All
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Accept All
            </button>
          </div>
        </div>

        {/* Detailed preferences section */}
        {showDetails && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h4 className="text-md font-medium text-gray-900 mb-2">Customize Cookie Preferences</h4>
            <div className="space-y-3">
              {/* Essential cookies - always enabled */}
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-medium text-gray-900">Essential Cookies</h5>
                  <p className="text-xs text-gray-500">
                    These cookies are necessary for the website to function properly and cannot be disabled.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={consentState.essential}
                    disabled={true}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-not-allowed"
                  />
                  <span className="ml-2 text-xs text-gray-500">Always active</span>
                </div>
              </div>

              {/* Analytics cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-medium text-gray-900">Analytics Cookies</h5>
                  <p className="text-xs text-gray-500">
                    These cookies help us understand how visitors interact with our website.
                  </p>
                </div>
                <div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentState.analytics}
                      onChange={(e) => updateConsent('analytics', e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              {/* Marketing cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-medium text-gray-900">Marketing Cookies</h5>
                  <p className="text-xs text-gray-500">
                    These cookies are used to track visitors across websites to display relevant advertisements.
                  </p>
                </div>
                <div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentState.marketing}
                      onChange={(e) => updateConsent('marketing', e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={savePreferences}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-2 text-xs text-gray-500">
          <a href="/privacy" className="underline hover:text-gray-700">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
