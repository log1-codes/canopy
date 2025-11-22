import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full py-8 md:py-12 bg-gray-950 text-gray-400 border-t border-gray-800">
      <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">Canopy</span>
        </div>
        <nav className="flex flex-wrap gap-6 text-sm">
          <Link href="/privacy" className="hover:text-white transition-colors duration-200" prefetch={false}>
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors duration-200" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors duration-200" prefetch={false}>
            Contact
          </Link>
        </nav>
        <p className="text-sm">© {new Date().getFullYear()} Canopy. All rights reserved.</p>
      </div>
    </footer>
  );
}