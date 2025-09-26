'use client';

import React, { Suspense } from 'react';
import EnhancedDocsLayout from '@/components/docs/EnhancedDocsLayout';

function DocsContent() {
  return <EnhancedDocsLayout />;
}

export default function DocsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocsContent />
    </Suspense>
  );
} 