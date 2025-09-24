import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | OLI Blog',
    default: 'OLI Blog - Open Labels Initiative',
  },
  description: 'Insights, updates, and deep dives from the Open Labels Initiative team.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
