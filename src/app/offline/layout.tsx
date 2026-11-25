import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Offline Mode | ChatForge',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
