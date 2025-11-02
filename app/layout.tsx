import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Canopy | Your Collaborative Workspace',
  description: 'Canopy is a modern, collaborative notes application inspired by Notion, featuring real-time editing, nested pages, Markdown support, and robust role-based access control. Organize, collaborate, and create together.',
  keywords: ['notes', 'collaboration', 'markdown', 'realtime', 'workspace', 'nextjs', 'typescript'],
  authors: [{ name: 'Anurag' }], 
  // openGraph: {
  //   title: 'Canopy | Your Collaborative Workspace',
  //   description: 'Canopy: Organize, collaborate, and create together.',
  //   url: 'http://localhost:3000', 
  //   siteName: 'Canopy',
  //   images: [
  //     {
  //       url: '/canopy.png', 
  //       width: 1200, 
  //       height: 630, 
  //       alt: 'Canopy - Collaborative Notes App Logo', 
  //     },
  //   ],
  //   locale: 'en_US',
  //   type: 'website',
  // },
};

// Root Layout Component
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body>
        {children}
      </body>
    </html>
  );
}