import type { Metadata } from "next";
import LoginPage from "@/components/loginPage";

export const metadata: Metadata = {
  title: 'Login | Canopy',
  description: 'Access your account or create a new one.',
  openGraph: {
    title: 'Login | Canopy',
    description: 'Access your account securely.',
    url: 'http://localhost:3000/login',
    siteName: 'Canopy',
    images: [
      {
        url: '/images/login-preview.png',
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

const Page = () => {
  return (
    <div>
      <LoginPage />
    </div>
  );
};

export default Page;
