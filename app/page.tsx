"use client"
import { Button } from "@/components/ui/button"
import { MessageCircle, Layers, FileText, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
const features = [
  {
    icon: MessageCircle,
    title: "Real-time Collaboration",
    description: "Work together seamlessly with instant updates and live collaboration features.",
  },
  {
    icon: Layers,
    title: "Nested Pages",
    description: "Organize your ideas hierarchically with infinitely nested pages and structures.",
  },
  {
    icon: FileText,
    title: "Markdown Editor",
    description: "Write with full markdown support for rich formatting and flexible content creation.",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Invite team members, set permissions, and collaborate on shared workspaces.",
  },
]

export default function Home() {
  const router = useRouter();
  const handleNavigation = (path: string) => router.push(path)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (

    <main className="min-h-screen bg-black text-white overflow-hidden">
      <section className="w-full py-20 md:py-32 lg:py-40 px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className={`text-center space-y-6 md:space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight animate-fade-in-up">
              Organize. Collaborate. Create. Together.
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-neutral-400 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              Canopy helps teams and individuals build, share, and manage knowledge effortlessly, in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <Button
                onClick={() => handleNavigation("/login")}
                className=" cursor-pointer h-14 px-10 text-base font-semibold bg-white text-black hover:bg-neutral-50 shadow-custom-lg hover:shadow-custom-2xl hover:scale-105 active:scale-95 transition-all duration-200 ease-smooth rounded-xl">
                Start for Free
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer h-14 px-10 text-base font-semibold bg-neutral-900 text-white border-2 border-neutral-700 hover:bg-neutral-600 hover:border-neutral-800 shadow-custom-md hover:shadow-custom-lg hover:scale-105 active:scale-95 transition-all duration-200 ease-smooth rounded-xl"
              >
                Learn More
              </Button>
            </div>
          </div>

          <div
            className="mt-16 md:mt-20 rounded-2xl overflow-hidden aspect-video flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-950 shadow-custom-2xl hover:shadow-glow transition-all duration-500 ease-smooth group animate-scale-in"
            style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
          >
            <div className="text-center group-hover:scale-105 transition-transform duration-300">
              <svg
                className="w-20 h-20 mx-auto mb-4 text-neutral-600 group-hover:text-neutral-400 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-neutral-500 group-hover:text-neutral-400 transition-colors duration-300">Editor Interface Preview</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-32 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20 animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">Powerful Features</h2>
            <p className="text-lg max-w-2xl mx-auto text-neutral-400">
              Everything you need to organize, collaborate, and create.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="rounded-2xl p-8 md:p-10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-sm shadow-custom-lg hover:shadow-custom-2xl hover:-translate-y-2 active:translate-y-0 transition-all duration-300 ease-smooth group animate-fade-in-up cursor-pointer border border-white/[0.06] hover:border-white/[0.12]"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                >
                  <div className="mb-5 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ease-bounce">
                    <Icon className="w-10 h-10 text-neutral-300 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors duration-300">{feature.title}</h3>
                  <p className="leading-relaxed text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-32 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-8 md:space-y-10 p-12 md:p-16 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-sm shadow-custom-2xl border border-white/[0.06] animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Ready to transform your team's workflow?
            </h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-neutral-400">
              Join Canopy today and experience a new way to create together.
            </p>
            <Button className="h-14 px-12 text-base font-semibold bg-white text-black hover:bg-neutral-50 shadow-custom-xl hover:shadow-custom-2xl hover:scale-110 active:scale-100 transition-all duration-300 ease-bounce rounded-xl">
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>

      <footer className="w-full py-16 md:py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-12 md:pb-16">
            <div className="animate-fade-in">
              <h3 className="font-semibold text-lg mb-2 hover:text-neutral-300 transition-colors duration-200 cursor-pointer">Canopy</h3>
              <p className="text-sm text-neutral-500">Organize. Collaborate. Create. Together.</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-neutral-500 hover:text-neutral-300 hover:translate-x-1 inline-block transition-all duration-200">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-500 hover:text-neutral-300 hover:translate-x-1 inline-block transition-all duration-200">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-500 hover:text-neutral-300 hover:translate-x-1 inline-block transition-all duration-200">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-neutral-500 hover:text-neutral-300 hover:translate-x-1 inline-block transition-all duration-200">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-500 hover:text-neutral-300 hover:translate-x-1 inline-block transition-all duration-200">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-12 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-600 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <p>&copy; 2025 Canopy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
