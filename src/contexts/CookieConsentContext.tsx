'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Define cookie consent categories
export type ConsentCategory = 'essential' | 'analytics' | 'marketing';

// Define consent state structure
export interface ConsentState {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

// Define context interface
interface CookieConsentContextType {
  consentState: ConsentState;
  hasInteracted: boolean;
  updateConsent: (category: ConsentCategory, value: boolean) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: () => void;
}

// Default consent state - essential is always true as it's required for functionality
const defaultConsentState: ConsentState = {
  essential: true, // Essential cookies are always allowed
  analytics: false,
  marketing: false,
};

// Create context with default values
const CookieConsentContext = createContext<CookieConsentContextType>({
  consentState: defaultConsentState,
  hasInteracted: false,
  updateConsent: () => {},
  acceptAll: () => {},
  rejectAll: () => {},
  savePreferences: () => {},
});

// Cookie name for storing consent
const CONSENT_COOKIE_NAME = 'oli-cookie-consent';
// Cookie expiration in days
const CONSENT_COOKIE_EXPIRY = 365;

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // State for consent preferences
  const [consentState, setConsentState] = useState<ConsentState>(defaultConsentState);
  // Track if user has interacted with consent banner
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  // Track if component is mounted (for SSR compatibility)
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Load saved consent preferences on mount
  useEffect(() => {
    setIsMounted(true);
    const savedConsent = Cookies.get(CONSENT_COOKIE_NAME);
    
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        setConsentState(parsedConsent);
        setHasInteracted(true);
      } catch (error) {
        console.error('Error parsing consent cookie:', error);
        // If there's an error, reset to default state
        Cookies.remove(CONSENT_COOKIE_NAME);
      }
    }
  }, []);

  // Update a single consent category
  const updateConsent = (category: ConsentCategory, value: boolean) => {
    setConsentState(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  // Accept all cookies
  const acceptAll = () => {
    const allAccepted: ConsentState = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    setConsentState(allAccepted);
    setHasInteracted(true);
    
    // Save to cookie
    Cookies.set(CONSENT_COOKIE_NAME, JSON.stringify(allAccepted), {
      expires: CONSENT_COOKIE_EXPIRY,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  };

  // Reject all non-essential cookies
  const rejectAll = () => {
    const allRejected: ConsentState = {
      essential: true, // Essential cookies are always allowed
      analytics: false,
      marketing: false,
    };
    setConsentState(allRejected);
    setHasInteracted(true);
    
    // Save to cookie
    Cookies.set(CONSENT_COOKIE_NAME, JSON.stringify(allRejected), {
      expires: CONSENT_COOKIE_EXPIRY,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  };

  // Save current preferences
  const savePreferences = () => {
    setHasInteracted(true);
    
    // Save to cookie
    Cookies.set(CONSENT_COOKIE_NAME, JSON.stringify(consentState), {
      expires: CONSENT_COOKIE_EXPIRY,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  };

  // Only render children after component is mounted (for SSR compatibility)
  if (!isMounted) {
    return null;
  }

  return (
    <CookieConsentContext.Provider
      value={{
        consentState,
        hasInteracted,
        updateConsent,
        acceptAll,
        rejectAll,
        savePreferences,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

// Custom hook for using the cookie consent context
export const useCookieConsent = () => useContext(CookieConsentContext);

// Helper function to check if a specific category is consented to
export const useConsentFor = (category: ConsentCategory): boolean => {
  const { consentState } = useCookieConsent();
  return consentState[category];
};
