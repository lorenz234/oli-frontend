// app/layout.tsx (server component)
import Providers from '@/components/Providers';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import './globals.css';
import { Metadata } from 'next';
import { CookieConsentProvider } from '@/contexts/CookieConsentContext';
import ClientCookieComponents from '@/app/ClientCookieComponents';

// Define default metadata
export const metadata: Metadata = {
  title: 'Open Labels Initiative',
  description: 'A standardized framework and data model for EVM address labeling',
  openGraph: {
    title: 'Open Labels Initiative',
    description: 'A standardized framework and data model for EVM address labeling',
    url: 'https://openlabelsinitiative.org',
    siteName: 'Open Labels Initiative',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Open Labels Initiative',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open Labels Initiative',
    description: 'A standardized framework and data model for EVM address labeling',
    creator: '@open_labels',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the entire app with CookieConsentProvider */}
        <CookieConsentProvider>
          <Providers>
            <Navigation />
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
              {children}
            </div>
            <Footer />
            
            {/* Import cookie consent components */}
            <ClientCookieComponents />
          </Providers>
        </CookieConsentProvider>
      </body>
    </html>
  );
}