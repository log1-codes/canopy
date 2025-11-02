import { CheckCircleIcon, UsersIcon, LayoutGridIcon, EditIcon } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: UsersIcon,
      title: 'Real-time Collaboration',
      description: 'Edit documents together with your team, see changes as they happen, and stay in sync.',
    },
    {
      icon: LayoutGridIcon,
      title: 'Nested Page Structure',
      description: 'Organize your knowledge base with infinite nesting, creating a clear hierarchy for all your ideas.',
    },
    {
      icon: EditIcon,
      title: 'Markdown Powered Editor',
      description: 'Leverage the power of Markdown for fast, flexible, and powerful content creation with rich formatting.',
    },
    {
      icon: CheckCircleIcon,
      title: 'Secure Access Control',
      description: 'Manage who sees and edits your content with robust role-based permissions (Owner, Editor, Viewer).',
    },
  ];

  return (
    <section id="features" className="w-full py-20 md:py-28 lg:py-36 bg-gray-900 text-gray-50">
      <div className="container px-4 md:px-6 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Powerful Features for Seamless Workflow</h2>
          <p className="text-lg text-gray-300">
            Canopy is designed to simplify how you manage information and work together.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-xl text-center">
              <feature.icon className="h-10 w-10 text-blue-500 mb-4" /> {/* Feature Icon */}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}