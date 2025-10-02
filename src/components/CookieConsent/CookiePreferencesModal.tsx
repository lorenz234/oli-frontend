'use client';

import React from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({ isOpen, onClose }) => {
  const { consentState, updateConsent, savePreferences } = useCookieConsent();
  
  if (!isOpen) return null;
  
  const handleSave = () => {
    savePreferences();
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Cookie Preferences
                </h3>
                
                <div className="mt-4 space-y-4">
                  {/* Essential cookies - always enabled */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Essential Cookies</h5>
                      <p className="text-xs text-gray-500">
                        These cookies are necessary for the website to function properly.
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
                        These cookies are used to track visitors across websites for advertising.
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
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSave}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save Preferences
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferencesModal;
