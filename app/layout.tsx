import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
export const metadata: Metadata = {
  metadataBase: new URL("https://canopy-olive.vercel.app/"),
  title: 'Canopy | Your Collaborative Workspace',
  description: 'Canopy is a modern, collaborative notes application inspired by Notion, featuring real-time editing, nested pages, Markdown support, and robust role-based access control. Organize, collaborate, and create together.',
  keywords: ['notes', 'collaboration', 'markdown', 'realtime', 'workspace', 'nextjs', 'typescript'],
  authors: [{ name: 'Anurag' }], 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}