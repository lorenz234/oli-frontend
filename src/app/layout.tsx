// app/layout.tsx
import Providers from '@/components/Providers';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navigation />
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}