'use client';

import { ManifestProvider } from '@/lib/store/ManifestContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <ManifestProvider>{children}</ManifestProvider>;
}
