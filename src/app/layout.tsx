/**
 * Root Layout
 * Wraps the entire application with providers
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeProvider from '@/components/providers/ThemeProvider';
import SessionProvider from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Team Task-Hub',
  description: 'A productivity app for small teams with task boards and collaboration features',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
