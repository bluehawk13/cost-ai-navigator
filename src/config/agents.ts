
import { Brain, Calculator, Cog, BarChart } from 'lucide-react';

export interface Agent {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  specialties: string[];
  apiConfig: {
    url: string;
    apiKey: string;
    userId: string;
    agentId: string;
    sessionId: string;
  };
  ui: {
    icon: typeof Brain;
    color: string;
    gradient: string;
  };
  features: {
    welcomeMessage: string;
    suggestions: string[];
  };
}

export const AGENTS: Agent[] = [
  {
    id: 'cost-optimization',
    name: 'Cost Optimization Agent',
    shortDescription: 'Cost Expert',
    fullDescription: 'Specialized in analyzing AI costs, finding cost-saving opportunities, and optimizing your AI infrastructure spending.',
    specialties: [
      'AI cost analysis and breakdown',
      'Cost optimization strategies',
      'Budget planning and forecasting',
      'Resource utilization insights'
    ],
    apiConfig: {
      url: 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/',
      apiKey: 'sk-default-DDZnBXRl6l6iKKj7YT39T4rCh4Qvb7za',
      userId: 'jaswanth6365@gmail.com',
      agentId: '683d63dfe5bd32ccbe6470a8',
      sessionId: '683d63dfe5bd32ccbe6470a8-1rw8wb2mp7r'
    },
    ui: {
      icon: BarChart,
      color: 'blue',
      gradient: 'from-blue-600 to-purple-600'
    },
    features: {
      welcomeMessage: 'Hello! I\'m your AI Cost Optimization Manager Agent. I can help you analyze your AI costs, find savings opportunities, calculate ROI, and identify optimization strategies. What would you like to optimize today?',
      suggestions: ['Analyze my AI costs', 'Find cost savings', 'Calculate ROI', 'Optimization strategies']
    }
  },
  {
    id: 'roi-calculator',
    name: 'ROI Calculator Agent',
    shortDescription: 'ROI Expert',
    fullDescription: 'Expert in calculating return on investment for AI projects, analyzing financial impact, and providing detailed ROI breakdowns.',
    specialties: [
      'ROI calculations and projections',
      'Financial impact analysis',
      'Investment planning',
      'Performance metrics tracking'
    ],
    apiConfig: {
      url: 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/',
      apiKey: 'sk-default-DDZnBXRl6l6iKKj7YT39T4rCh4Qvb7za',
      userId: 'jaswanth6365@gmail.com',
      agentId: '683d63dfe5bd32ccbe6470a9',
      sessionId: '683d63dfe5bd32ccbe6470a9-roi123'
    },
    ui: {
      icon: Calculator,
      color: 'green',
      gradient: 'from-green-600 to-emerald-600'
    },
    features: {
      welcomeMessage: 'Hi! I\'m your ROI Calculator Agent. I specialize in calculating return on investment for AI projects, analyzing financial impact, and providing detailed ROI breakdowns. What investment would you like me to analyze?',
      suggestions: ['Calculate AI ROI', 'Project profitability', 'Investment analysis', 'Financial projections']
    }
  },
  {
    id: 'business-automation',
    name: 'Business Automation Agent',
    shortDescription: 'Automation Specialist',
    fullDescription: 'Focused on identifying automation opportunities, workflow optimization, and implementing AI-driven business process improvements.',
    specialties: [
      'Process automation identification',
      'Workflow optimization',
      'Business process improvement',
      'Efficiency enhancement strategies'
    ],
    apiConfig: {
      url: 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/',
      apiKey: 'sk-default-DDZnBXRl6l6iKKj7YT39T4rCh4Qvb7za',
      userId: 'jaswanth6365@gmail.com',
      agentId: '683d63dfe5bd32ccbe6470a10',
      sessionId: '683d63dfe5bd32ccbe6470a10-auto456'
    },
    ui: {
      icon: Cog,
      color: 'orange',
      gradient: 'from-orange-600 to-red-600'
    },
    features: {
      welcomeMessage: 'Hello! I\'m your Business Automation Agent. I help identify automation opportunities, optimize workflows, and implement AI-driven process improvements. What processes would you like to automate?',
      suggestions: ['Automation opportunities', 'Workflow optimization', 'Process improvement', 'Efficiency analysis']
    }
  },
  {
    id: 'llm-comparison',
    name: 'LLM Comparison Agent',
    shortDescription: 'Model Expert',
    fullDescription: 'Expert in comparing different LLM models, analyzing their capabilities, costs, and helping you choose the best model for your needs.',
    specialties: [
      'LLM model comparisons',
      'Performance benchmarking',
      'Model selection guidance',
      'Cost-benefit analysis of models'
    ],
    apiConfig: {
      url: 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/',
      apiKey: 'sk-default-DDZnBXRl6l6iKKj7YT39T4rCh4Qvb7za',
      userId: 'jaswanth6365@gmail.com',
      agentId: '683d63dfe5bd32ccbe6470a11',
      sessionId: '683d63dfe5bd32ccbe6470a11-llm789'
    },
    ui: {
      icon: Brain,
      color: 'purple',
      gradient: 'from-purple-600 to-pink-600'
    },
    features: {
      welcomeMessage: 'Hi there! I\'m your LLM Comparison Agent. I specialize in comparing different AI models, analyzing their capabilities and costs, and helping you choose the best model for your specific needs. Which models would you like me to compare?',
      suggestions: ['Compare LLM models', 'Model recommendations', 'Performance analysis', 'Cost comparison']
    }
  }
];

export const getAgentById = (id: string): Agent | undefined => {
  return AGENTS.find(agent => agent.id === id);
};

export const getDefaultAgent = (): Agent => {
  return AGENTS[0]; // Cost Optimization Agent as default
};
