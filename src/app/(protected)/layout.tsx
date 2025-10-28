/**
 * Protected Layout
 * Layout for authenticated pages with sidebar and app bar
 */

import AppLayout from '@/components/layout/AppLayout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
