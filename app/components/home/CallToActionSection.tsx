import Link from 'next/link';

export function CallToActionSection() {
  return (
    <section className="w-full py-20 md:py-28 lg:py-36 bg-gradient-to-tr from-blue-700 to-purple-800 text-white text-center">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to transform your team's workflow?</h2>
          <p className="text-lg md:text-xl text-blue-200">
            Join Canopy today and experience a new way to create together. It's free to get started!
          </p>
          <Link
            href="/login" 
            className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-md shadow-xl
                       bg-white text-blue-700 hover:bg-gray-100 transition-colors duration-200"
            prefetch={false}
          >
            Get Started for Free
          </Link>
        </div>
      </div>
    </section>
  );
}