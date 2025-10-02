'use client';

import React from 'react';
import { Analytics } from "@vercel/analytics/react";
import { useConsentFor } from '@/contexts/CookieConsentContext';

const ConditionalAnalytics: React.FC = () => {
  // Only render Analytics if user has consented to analytics cookies
  const analyticsConsent = useConsentFor('analytics');
  
  if (!analyticsConsent) {
    return null;
  }
  
  return <Analytics />;
};

export default ConditionalAnalytics;
