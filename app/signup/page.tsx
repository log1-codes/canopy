import type { Metadata } from "next";
import SignupPage from "@/components/signupPage";

export const metadata: Metadata = {
  title: 'Signup | Canopy',
  description: 'create your account',
  openGraph: {
    title: 'Signup | Canopy',
    description: 'Access your account securely.',
    url: 'https://canopy-olive.vercel.app/signup',
    siteName: 'Canopy',
    images: [
      {
        url: '/signup-preview.png',
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

const Page = ()=>{
    return (
        <div>
            <SignupPage/>
        </div>
    )
}

export default Page ;