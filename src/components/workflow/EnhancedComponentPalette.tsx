
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  Cloud,
  Bot,
  Database,
  FileText,
  Cog,
  Send,
  DollarSign,
  ChevronLeft,
  Mail,
  FileOutput,
  MessageSquare,
  Server,
  Cpu,
  HardDrive,
  Zap,
  Globe,
  Link,
  Filter,
  Shuffle,
  GitBranch,
  Code
} from 'lucide-react';

interface ComponentItem {
  id: string;
  name: string;
  type: string;
  subtype: string;
  provider?: string;
  cost?: string;
  description: string;
  icon?: React.ReactNode;
  hostingOptions?: string[];
  features?: string[];
}

interface ComponentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: ComponentItem[];
  expanded: boolean;
  color: string;
}

interface EnhancedComponentPaletteProps {
  onAddNode: (nodeType: string, subtype: string, label: string, provider?: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const EnhancedComponentPalette = ({ onAddNode, isCollapsed, onToggle }: EnhancedComponentPaletteProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<ComponentCategory[]>([
    {
      id: 'infrastructure',
      name: 'Infrastructure',
      icon: <Cloud className="h-4 w-4" />,
      color: 'text-blue-600',
      expanded: false,
      items: [
        { 
          id: 'aws', 
          name: 'AWS', 
          type: 'cloud', 
          subtype: 'aws', 
          provider: 'aws', 
          description: 'Amazon Web Services - Global cloud platform',
          cost: 'Pay-as-you-go',
          features: ['Global regions', 'Enterprise-grade', 'Comprehensive services']
        },
        { 
          id: 'gcp', 
          name: 'Google Cloud', 
          type: 'cloud', 
          subtype: 'gcp', 
          provider: 'gcp', 
          description: 'Google Cloud Platform - AI/ML focused cloud',
          cost: 'Pay-as-you-go',
          features: ['AI/ML optimized', 'Global network', 'Kubernetes native']
        },
        { 
          id: 'azure', 
          name: 'Microsoft Azure', 
          type: 'cloud', 
          subtype: 'azure', 
          provider: 'azure', 
          description: 'Microsoft Azure - Enterprise cloud platform',
          cost: 'Pay-as-you-go',
          features: ['Enterprise integration', 'Hybrid cloud', 'Microsoft ecosystem']
        },
        { 
          id: 'oracle', 
          name: 'Oracle Cloud', 
          type: 'cloud', 
          subtype: 'oracle', 
          provider: 'oracle', 
          description: 'Oracle Cloud Infrastructure - Database focused',
          cost: 'Pay-as-you-go',
          features: ['Database optimized', 'High performance', 'Enterprise focused']
        }
      ]
    },
    {
      id: 'data-storage',
      name: 'Data Storage',
      icon: <Database className="h-4 w-4" />,
      color: 'text-green-600',
      expanded: false,
      items: [
        { 
          id: 'postgres', 
          name: 'PostgreSQL', 
          type: 'database', 
          subtype: 'postgres', 
          description: 'Advanced relational database',
          cost: '$0.10-0.50/hour',
          hostingOptions: ['Self-hosted', 'AWS RDS', 'Google Cloud SQL', 'Azure Database'],
          features: ['ACID compliance', 'JSON support', 'Extensions']
        },
        { 
          id: 'mysql', 
          name: 'MySQL', 
          type: 'database', 
          subtype: 'mysql', 
          description: 'Popular relational database',
          cost: '$0.08-0.40/hour',
          hostingOptions: ['Self-hosted', 'AWS RDS', 'Google Cloud SQL', 'Azure Database'],
          features: ['High performance', 'Replication', 'Clustering']
        },
        { 
          id: 'mongodb', 
          name: 'MongoDB', 
          type: 'database', 
          subtype: 'mongodb', 
          description: 'Document-oriented NoSQL database',
          cost: '$0.15-0.80/hour',
          hostingOptions: ['Self-hosted', 'MongoDB Atlas', 'AWS DocumentDB'],
          features: ['Flexible schema', 'Horizontal scaling', 'Rich queries']
        },
        { 
          id: 'redis', 
          name: 'Redis', 
          type: 'database', 
          subtype: 'redis', 
          description: 'In-memory data structure store',
          cost: '$0.05-0.30/hour',
          hostingOptions: ['Self-hosted', 'AWS ElastiCache', 'Google Memorystore', 'Azure Cache'],
          features: ['Sub-millisecond latency', 'Data structures', 'Pub/Sub']
        },
        { 
          id: 'pinecone', 
          name: 'Pinecone', 
          type: 'database', 
          subtype: 'pinecone', 
          description: 'Managed vector database',
          cost: '$70+/month',
          hostingOptions: ['Pinecone Cloud'],
          features: ['Vector similarity', 'Real-time updates', 'Metadata filtering']
        },
        { 
          id: 'weaviate', 
          name: 'Weaviate', 
          type: 'database', 
          subtype: 'weaviate', 
          description: 'Open-source vector database',
          cost: 'Free - $200+/month',
          hostingOptions: ['Self-hosted', 'Weaviate Cloud', 'Cloud providers'],
          features: ['GraphQL API', 'Hybrid search', 'Multi-modal']
        },
        { 
          id: 'chroma', 
          name: 'Chroma', 
          type: 'database', 
          subtype: 'chroma', 
          description: 'AI-native embedding database',
          cost: 'Free - $100+/month',
          hostingOptions: ['Self-hosted', 'Cloud deployment'],
          features: ['Python/JS SDKs', 'Metadata filtering', 'Collections']
        }
      ]
    },
    {
      id: 'ai-models',
      name: 'AI Models',
      icon: <Bot className="h-4 w-4" />,
      color: 'text-purple-600',
      expanded: false,
      items: [
        { 
          id: 'openai', 
          name: 'OpenAI', 
          type: 'aiModel', 
          subtype: 'openai', 
          provider: 'openai', 
          description: 'GPT models for text generation',
          cost: '$0.001-0.06/1k tokens',
          features: ['GPT-4o', 'GPT-4 Mini', 'Function calling', 'Vision']
        },
        { 
          id: 'anthropic', 
          name: 'Anthropic', 
          type: 'aiModel', 
          subtype: 'anthropic', 
          provider: 'anthropic', 
          description: 'Claude models with safety focus',
          cost: '$0.00025-0.015/1k tokens',
          features: ['Claude 3.5 Sonnet', 'Large context', 'Tool use', 'Safety']
        },
        { 
          id: 'google', 
          name: 'Google AI', 
          type: 'aiModel', 
          subtype: 'google', 
          provider: 'google', 
          description: 'Gemini models for multimodal AI',
          cost: '$0.000125-0.01/1k tokens',
          features: ['Gemini 1.5 Pro', 'Multimodal', 'Long context', 'Code generation']
        },
        { 
          id: 'mistral', 
          name: 'Mistral AI', 
          type: 'aiModel', 
          subtype: 'mistral', 
          provider: 'mistral', 
          description: 'Efficient European AI models',
          cost: '$0.0002-0.006/1k tokens',
          features: ['Mixtral 8x7B', 'Function calling', 'Multilingual', 'Open weights']
        },
        { 
          id: 'cohere', 
          name: 'Cohere', 
          type: 'aiModel', 
          subtype: 'cohere', 
          provider: 'cohere', 
          description: 'Enterprise-focused language models',
          cost: '$0.0015-0.06/1k tokens',
          features: ['Command R+', 'Embeddings', 'Rerank', 'Enterprise features']
        },
        { 
          id: 'huggingface', 
          name: 'Hugging Face', 
          type: 'aiModel', 
          subtype: 'huggingface', 
          provider: 'huggingface', 
          description: 'Open-source model hub',
          cost: 'Free - $0.60/hour',
          features: ['Open models', 'Inference API', 'Spaces', 'Datasets']
        }
      ]
    },
    {
      id: 'compute',
      name: 'Compute',
      icon: <Cpu className="h-4 w-4" />,
      color: 'text-orange-600',
      expanded: false,
      items: [
        { 
          id: 'serverless', 
          name: 'Serverless Functions', 
          type: 'compute', 
          subtype: 'serverless', 
          description: 'Event-driven compute without servers',
          cost: '$0.20-2.00/million invocations',
          features: ['Auto-scaling', 'Pay-per-use', 'Event triggers']
        },
        { 
          id: 'containers', 
          name: 'Containers', 
          type: 'compute', 
          subtype: 'containers', 
          description: 'Containerized application deployment',
          cost: '$0.05-0.50/hour',
          features: ['Docker support', 'Orchestration', 'Load balancing']
        },
        { 
          id: 'edge', 
          name: 'Edge Computing', 
          type: 'compute', 
          subtype: 'edge', 
          description: 'Low-latency edge deployment',
          cost: '$0.10-1.00/hour',
          features: ['Global distribution', 'Low latency', 'CDN integration']
        }
      ]
    },
    {
      id: 'data-sources',
      name: 'Data Sources',
      icon: <FileText className="h-4 w-4" />,
      color: 'text-blue-600',
      expanded: false,
      items: [
        { 
          id: 'file-upload', 
          name: 'File Upload', 
          type: 'dataSource', 
          subtype: 'file', 
          description: 'Upload documents, images, data files',
          features: ['Multiple formats', 'Drag & drop', 'Batch processing']
        },
        { 
          id: 'api-gateway', 
          name: 'API Gateway', 
          type: 'dataSource', 
          subtype: 'api', 
          description: 'Connect to external REST/GraphQL APIs',
          features: ['Authentication', 'Rate limiting', 'Caching']
        },
        { 
          id: 'web-scraper', 
          name: 'Web Scraper', 
          type: 'dataSource', 
          subtype: 'scraper', 
          description: 'Extract data from websites',
          features: ['Scheduled scraping', 'Anti-bot detection', 'Data cleaning']
        },
        { 
          id: 'database-source', 
          name: 'Database Source', 
          type: 'dataSource', 
          subtype: 'database', 
          description: 'Connect to existing databases',
          features: ['Real-time sync', 'Change detection', 'Multiple DB types']
        }
      ]
    },
    {
      id: 'logic',
      name: 'Logic & Processing',
      icon: <Cog className="h-4 w-4" />,
      color: 'text-amber-600',
      expanded: false,
      items: [
        { 
          id: 'filter', 
          name: 'Filter', 
          type: 'logic', 
          subtype: 'filter', 
          description: 'Filter data based on conditions',
          icon: <Filter className="h-4 w-4" />,
          features: ['Multiple conditions', 'Regex support', 'Data validation']
        },
        { 
          id: 'transform', 
          name: 'Transform', 
          type: 'logic', 
          subtype: 'transform', 
          description: 'Transform and map data structures',
          icon: <Shuffle className="h-4 w-4" />,
          features: ['JSON mapping', 'Field extraction', 'Data normalization']
        },
        { 
          id: 'branch', 
          name: 'Branch', 
          type: 'logic', 
          subtype: 'branch', 
          description: 'Conditional workflow branching',
          icon: <GitBranch className="h-4 w-4" />,
          features: ['Multiple paths', 'Condition evaluation', 'Error handling']
        },
        { 
          id: 'python', 
          name: 'Custom Python', 
          type: 'logic', 
          subtype: 'python', 
          description: 'Execute custom Python code',
          icon: <Code className="h-4 w-4" />,
          features: ['Full Python support', 'Package imports', 'Environment isolation']
        },
        { 
          id: 'javascript', 
          name: 'Custom JavaScript', 
          type: 'logic', 
          subtype: 'javascript', 
          description: 'Execute custom JavaScript code',
          icon: <Code className="h-4 w-4" />,
          features: ['Node.js runtime', 'NPM packages', 'Async support']
        }
      ]
    },
    {
      id: 'integration',
      name: 'Integration',
      icon: <Link className="h-4 w-4" />,
      color: 'text-indigo-600',
      expanded: false,
      items: [
        { 
          id: 'webhook', 
          name: 'Webhook', 
          type: 'integration', 
          subtype: 'webhook', 
          description: 'Send/receive HTTP webhooks',
          features: ['Real-time triggers', 'Authentication', 'Retry logic']
        },
        { 
          id: 'message-queue', 
          name: 'Message Queue', 
          type: 'integration', 
          subtype: 'queue', 
          description: 'Async message processing',
          features: ['Reliable delivery', 'Dead letter queues', 'Scaling']
        },
        { 
          id: 'event-stream', 
          name: 'Event Streaming', 
          type: 'integration', 
          subtype: 'streaming', 
          description: 'Real-time event processing',
          features: ['Apache Kafka', 'Real-time analytics', 'Stream processing']
        }
      ]
    },
    {
      id: 'outputs',
      name: 'Outputs',
      icon: <Send className="h-4 w-4" />,
      color: 'text-red-600',
      expanded: false,
      items: [
        { 
          id: 'email', 
          name: 'Email', 
          type: 'output', 
          subtype: 'email', 
          description: 'Send email notifications',
          icon: <Mail className="h-4 w-4" />,
          features: ['Templates', 'Attachments', 'Tracking']
        },
        { 
          id: 'slack', 
          name: 'Slack', 
          type: 'output', 
          subtype: 'slack', 
          description: 'Send Slack messages',
          icon: <MessageSquare className="h-4 w-4" />,
          features: ['Rich formatting', 'Interactive buttons', 'Threading']
        },
        { 
          id: 'pdf', 
          name: 'PDF Generator', 
          type: 'output', 
          subtype: 'pdf', 
          description: 'Generate PDF reports',
          icon: <FileOutput className="h-4 w-4" />,
          features: ['Custom templates', 'Charts/graphs', 'Digital signatures']
        },
        { 
          id: 'dashboard', 
          name: 'Dashboard', 
          type: 'output', 
          subtype: 'dashboard', 
          description: 'Real-time data dashboards',
          features: ['Live updates', 'Interactive charts', 'Custom widgets']
        },
        { 
          id: 'api-response', 
          name: 'API Response', 
          type: 'output', 
          subtype: 'api', 
          description: 'Structured API responses',
          features: ['JSON/XML', 'Schema validation', 'Rate limiting']
        }
      ]
    }
  ]);

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
    ));
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.features?.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(category => searchTerm === '' || category.items.length > 0);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-2 border-b border-gray-200 flex justify-center">
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col items-center py-4 space-y-4">
          {categories.map(category => (
            <div key={category.id} className={`${category.color}`}>
              {category.icon}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Component Palette</h2>
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="bg-white shadow-sm">
            <Collapsible open={category.expanded}>
              <CollapsibleTrigger 
                onClick={() => toggleCategory(category.id)}
                className="w-full"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${category.color}`}>
                      {category.icon}
                      {category.name}
                    </div>
                    {category.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-2">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all"
                      onClick={() => onAddNode(item.type, item.subtype, item.name, item.provider)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2 mb-1">
                            {item.icon && <span className="text-gray-600">{item.icon}</span>}
                            <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                          </div>
                          <p className="text-xs text-gray-600 break-words mb-2">{item.description}</p>
                          
                          {item.cost && (
                            <div className="flex items-center gap-1 mb-2">
                              <DollarSign className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">{item.cost}</span>
                            </div>
                          )}
                          
                          {item.hostingOptions && (
                            <div className="mb-2">
                              <div className="text-xs text-gray-500 mb-1">Hosting:</div>
                              <div className="flex flex-wrap gap-1">
                                {item.hostingOptions.slice(0, 2).map((option, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {option}
                                  </Badge>
                                ))}
                                {item.hostingOptions.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{item.hostingOptions.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {item.features && (
                            <div className="flex flex-wrap gap-1">
                              {item.features.slice(0, 2).map((feature, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  {feature}
                                </span>
                              ))}
                              {item.features.length > 2 && (
                                <span className="text-xs text-gray-500">+{item.features.length - 2} more</span>
                              )}
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EnhancedComponentPalette;
