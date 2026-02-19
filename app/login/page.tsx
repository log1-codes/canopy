import type { Metadata } from "next";
import LoginPage from "@/components/loginPage";
import { Suspense } from "react";

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Login | Canopy',
  description: 'Access your account',
  openGraph: {
    title: 'Login | Canopy',
    description: 'Access your account securely.',
    url: 'https://canopy-olive.vercel.app/login',
    siteName: 'Canopy',
    images: [
      {
        url: '/login-preview.png',
        width: 1200,
        height: 630,
        alt: 'Login page preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};


