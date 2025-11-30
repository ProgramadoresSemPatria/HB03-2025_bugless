import {
  BugIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react/dist/ssr'

export const NAV_LINKS = [
  {
    label: 'Features',
    href: '#features',
  },
  {
    label: 'Compare',
    href: '#compare',
  },
  {
    label: 'Pricing',
    href: '#pricing',
  },
]

export const PROBLEMS = [
  {
    icon: BugIcon,
    title: 'Bugs slip through the cracks',
    description:
      'Manual code reviews are inconsistent and time-consuming. Critical issues get missed when reviewers are rushed or fatigued.',
  },
  {
    icon: ClockIcon,
    title: 'Reviews slow you down',
    description:
      "Waiting for code review feedback creates bottlenecks. Your team's velocity suffers while PRs sit in the queue.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Traditional tools fall short',
    description:
      'Static analyzers catch syntax but miss logic errors. They flood you with false positives instead of real insights.',
  },
]

export const COMPARISON_DATA = [
  {
    feature: 'AI-Powered Analysis',
    bugless: true,
    coderabbit: true,
    pragent: true,
  },
  {
    feature: 'CLI-Based Tool',
    bugless: true,
    coderabbit: false,
    pragent: false,
  },
  {
    feature: 'Zero Configuration',
    bugless: true,
    coderabbit: false,
    pragent: false,
  },
  {
    feature: 'Local & Private',
    bugless: true,
    coderabbit: false,
    pragent: false,
  },
  {
    feature: 'Review Presets',
    bugless: true,
    coderabbit: false,
    pragent: true,
  },
  {
    feature: 'Custom Instructions',
    bugless: true,
    coderabbit: true,
    pragent: false,
  },
]

export const COMPARISON_PRODUCTS = [
  { key: 'bugless', name: 'Bugless', isPrimary: true },
  { key: 'coderabbit', name: 'CodeRabbit', isPrimary: false },
  { key: 'pragent', name: 'PR Agent', isPrimary: false },
]

export const PRICING_PLANS = [
  {
    name: 'Hobby',
    price: '$0',
    description: 'Perfect for side projects and learning.',
    features: [
      'Up to 3 repositories',
      '50 reviews/month',
      'CLI access',
      'Community support',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'month',
    description: 'For professional developers and small teams.',
    features: [
      'Unlimited repositories',
      'Unlimited reviews',
      'CLI + GitHub App',
      'Priority support',
      'Custom rules',
      'Team dashboard',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: 'month',
    description: 'For growing teams that need more control.',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'SSO integration',
      'Analytics & insights',
      'Dedicated support',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
  },
]
