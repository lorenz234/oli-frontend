import Link from 'next/link';
import { ArrowRight, Search, PlusCircle, BarChart3, Sparkles } from 'lucide-react';

interface CTAAction {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  variant: 'primary' | 'secondary';
}

interface BlogCTAProps {
  title?: string;
  description?: string;
  actions?: CTAAction[];
  variant?: 'default' | 'minimal';
}

const defaultActions: CTAAction[] = [
  {
    title: 'Explore Labels',
    description: 'Browse existing address labels and discover new insights',
    href: '/search',
    icon: <Search className="w-6 h-6" />,
    variant: 'primary'
  },
  {
    title: 'Create Attestation',
    description: 'Contribute to the ecosystem by labeling addresses you know',
    href: '/attest',
    icon: <PlusCircle className="w-6 h-6" />,
    variant: 'secondary'
  },
  {
    title: 'View Analytics',
    description: 'Check out leaderboards and trending labels',
    href: '/analytics',
    icon: <BarChart3 className="w-6 h-6" />,
    variant: 'secondary'
  }
];

export default function BlogCTA({
  title = "Ready to Get Involved with OLI?",
  description = "Join the many contributors building the future of decentralized address labeling.",
  actions = defaultActions,
  variant = 'default'
}: BlogCTAProps) {
  if (variant === 'minimal') {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-100">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>
          <div className="flex flex-wrap justify-center gap-4">
            {actions.slice(0, 2).map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${
                  action.variant === 'primary'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                {action.icon}
                <span className="ml-2">{action.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-3xl p-12 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-white/5"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-8 left-8 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-8 right-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{title}</h2>
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </div>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">{description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 group border border-white/20 hover:border-white/30"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-white/20 rounded-2xl mb-6 text-white group-hover:bg-white/30 transition-colors">
                  {action.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {action.title}
                </h3>
                <p className="text-white/80 mb-6 text-sm leading-relaxed">
                  {action.description}
                </p>
                <div className="flex items-center text-white/90 text-sm font-semibold group-hover:text-white transition-colors">
                  Get started
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
