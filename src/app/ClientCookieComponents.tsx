'use client';

import React from 'react';
import { CookieConsentBanner, ConditionalAnalytics } from '@/components/CookieConsent';

export default function ClientCookieComponents() {
  return (
    <>
      <CookieConsentBanner />
      <ConditionalAnalytics />
    </>
  );
}
