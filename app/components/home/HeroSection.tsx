import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-48 bg-gradient-to-br from-gray-900 to-black text-gray-50 flex items-center justify-center">
      <div className="container px-4 md:px-6 text-center z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Organize. Collaborate. Create. Together.
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Canopy helps teams and individuals build, share, and manage knowledge effortlessly, in real-time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/login" 
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md shadow-lg
                         bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
              prefetch={false}
            >
              Start for Free
            </Link>
            <Link
              href="#features" // Scroll to features section
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md border
                         border-gray-600 hover:border-gray-500 text-gray-50 hover:text-gray-200 transition-colors duration-200"
              prefetch={false}
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      {/* Optional: Subtle background pattern or image for depth */}
      <div className="absolute inset-0 opacity-10">
        {/* Placeholder for a subtle background pattern or image */}
        {/* You could use a pattern like dot grid, or a very faint abstract graphic */}
      </div>
    </section>
  );
}