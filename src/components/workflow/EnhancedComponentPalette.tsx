
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
  description: string;
  icon?: React.ReactNode;
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
      icon: <Cloud className="h-4 w-4 text-black" />,
      color: 'text-black',
      expanded: false,
      items: [
        { 
          id: 'aws', 
          name: 'AWS', 
          type: 'cloud', 
          subtype: 'aws', 
          provider: 'aws', 
          description: 'Amazon Web Services cloud platform'
        },
        { 
          id: 'gcp', 
          name: 'Google Cloud', 
          type: 'cloud', 
          subtype: 'gcp', 
          provider: 'gcp', 
          description: 'Google Cloud Platform services'
        },
        { 
          id: 'azure', 
          name: 'Microsoft Azure', 
          type: 'cloud', 
          subtype: 'azure', 
          provider: 'azure', 
          description: 'Microsoft Azure cloud platform'
        },
        { 
          id: 'oracle', 
          name: 'Oracle Cloud', 
          type: 'cloud', 
          subtype: 'oracle', 
          provider: 'oracle', 
          description: 'Oracle Cloud Infrastructure'
        }
      ]
    },
    {
      id: 'data-storage',
      name: 'Data Storage',
      icon: <Database className="h-4 w-4 text-black" />,
      color: 'text-black',
      expanded: false,
      items: [
        { 
          id: 'postgres', 
          name: 'PostgreSQL', 
          type: 'database', 
          subtype: 'postgres', 
          description: 'Advanced relational database'
        },
        { 
          id: 'mysql', 
          name: 'MySQL', 
          type: 'database', 
          subtype: 'mysql', 
          description: 'Popular relational database'
        },
        { 
          id: 'mongodb', 
          name: 'MongoDB', 
          type: 'database', 
          subtype: 'mongodb', 
          description: 'Document-oriented NoSQL database'
        },
        { 
          id: 'redis', 
          name: 'Redis', 
          type: 'database', 
          subtype: 'redis', 
          description: 'In-memory data structure store'
        },
        { 
          id: 'pinecone', 
          name: 'Pinecone', 
          type: 'database', 
          subtype: 'pinecone', 
          description: 'Managed vector database'
        },
        { 
          id: 'weaviate', 
          name: 'Weaviate', 
          type: 'database', 
          subtype: 'weaviate', 
          description: 'Open-source vector database'
        },
        { 
          id: 'chroma', 
          name: 'Chroma', 
          type: 'database', 
          subtype: 'chroma', 
          description: 'AI-native embedding database'
        }
      ]
    },
    {
      id: 'ai-models',
      name: 'AI Models',
      icon: <Bot className="h-4 w-4 text-black" />,
      color: 'text-black',
      expanded: false,
      items: [
        { 
          id: 'openai', 
          name: 'OpenAI', 
          type: 'aiModel', 
          subtype: 'openai', 
          provider: 'openai', 
          description: 'GPT models for text generation'
        },
        { 
          id: 'anthropic', 
          name: 'Anthropic', 
          type: 'aiModel', 
          subtype: 'anthropic', 
          provider: 'anthropic', 
          description: 'Claude models with safety focus'
        },
        { 
          id: 'google', 
          name: 'Google AI', 
          type: 'aiModel', 
          subtype: 'google', 
          provider: 'google', 
          description: 'Gemini models for multimodal AI'
        },
        { 
          id: 'mistral', 
          name: 'Mistral AI', 
          type: 'aiModel', 
          subtype: 'mistral', 
          provider: 'mistral', 
          description: 'Efficient European AI models'
        },
        { 
          id: 'cohere', 
          name: 'Cohere', 
          type: 'aiModel', 
          subtype: 'cohere', 
          provider: 'cohere', 
          description: 'Enterprise-focused language models'
        },
        { 
          id: 'huggingface', 
          name: 'Hugging Face', 
          type: 'aiModel', 
          subtype: 'huggingface', 
          provider: 'huggingface', 
          description: 'Open-source model hub'
        }
      ]
    },
    {
      id: 'compute',
      name: 'Compute',
      icon: <Cpu className="h-4 w-4 text-black" />,
      color: 'text-black',
      expanded: false,
      items: [
        { 
          id: 'serverless', 
          name: 'Serverless Functions', 
          type: 'compute', 
          subtype: 'serverless', 
          description: 'Event-driven compute without servers'
        },
        { 
          id: 'containers', 
          name: 'Containers', 
          type: 'compute', 
          subtype: 'containers', 
          description: 'Containerized application deployment'
        },
        { 
          id: 'edge', 
          name: 'Edge Computing', 
          type: 'compute', 
          subtype: 'edge', 
          description: 'Low-latency edge deployment'
        }
      ]
    },
    {
      id: 'data-sources',
      name: 'Data Sources',
      icon: <FileText className="h-4 w-4 text-black" />,
      color: 'text-black',
      expanded: false,
      items: [
        { 
          id: 'file-upload', 
          name: 'File Upload', 
          type: 'dataSource', 
          subtype: 'file', 
          description: 'Upload documents, images, data files'
        },
        { 
          id: 'api-gateway', 
          name: 'API Gateway', 
          type: 'dataSource', 
          subtype: 'api', 
          description: 'Connect to external REST/GraphQL APIs'
        },
        { 
          id: 'web-scraper', 
          name: 'Web Scraper', 
          type: 'dataSource', 
          subtype: 'scraper', 
          description: 'Extract data from websites'
        },
        { 
          id: 'database-source', 
          name: 'Database Source', 
          type: 'dataSource', 
          subtype: 'database', 
          description: 'Connect to existing databases'
        }
      ]
    },
    {
      id: 'logic',
      name: 'Logic & Processing',
      icon: <Cog className="h-4 w-4 text-black" />,
      color: 'text-black',
      expanded: false,
      items: [
        { 
          id: 'filter', 
          name: 'Filter', 
          type: 'logic', 
          subtype: 'filter', 
          description: 'Filter data based on conditions',
          icon: <Filter className="h-4 w-4 text-black" />
        },
        { 
          id: 'transform', 
          name: 'Transform', 
          type: 'logic', 
          subtype: 'transform', 
          description: 'Transform and map data structures',
          icon: <Shuffle className="h-4 w-4 text-black" />
        },
        { 
          id: 'branch', 
          name: 'Branch', 
          type: 'logic', 
          subtype: 'branch', 
          description: 'Conditional workflow branching',
          icon: <GitBranch className="h-4 w-4 text-black" />
        },
        { 
          id: 'python', 
          name: 'Custom Python', 
          type: 'logic', 
          subtype: 'python', 
          description: 'Execute custom Python code',
          icon: <Code className="h-4 w-4 text-black" />
        },
        { 
          id: 'javascript', 
          name: 'Custom JavaScript', 
          type: 'logic', 
          subtype: 'javascript', 
          description: 'Execute custom JavaScript code',
          icon: <Code className="h-4 w-4 text-black" />
        }
      ]
    },
    {
      id: 'integration',
      name: 'Integration',
      icon: <Link className="h-4 w-4 text-black" />,
      color: 'text-black',
      expanded: false,
      items: [
        { 
          id: 'webhook', 
          name: 'Webhook', 
          type: 'integration', 
          subtype: 'webhook', 
          description: 'Send/receive HTTP webhooks'
        },
        { 
          id: 'message-queue', 
          name: 'Message Queue', 
          type: 'integration', 
          subtype: 'queue', 
          description: 'Async message processing'
        },
        { 
          id: 'event-stream', 
          name: 'Event Streaming', 
          type: 'integration', 
          subtype: 'streaming', 
          description: 'Real-time event processing'
        }
      ]
    },
    {
      id: 'outputs',
      name: 'Outputs',
      icon: <Send className="h-4 w-4 text-black" />,
      color: 'text-black',
      expanded: false,
      items: [
        { 
          id: 'email', 
          name: 'Email', 
          type: 'output', 
          subtype: 'email', 
          description: 'Send email notifications',
          icon: <Mail className="h-4 w-4 text-black" />
        },
        { 
          id: 'slack', 
          name: 'Slack', 
          type: 'output', 
          subtype: 'slack', 
          description: 'Send Slack messages',
          icon: <MessageSquare className="h-4 w-4 text-black" />
        },
        { 
          id: 'pdf', 
          name: 'PDF Generator', 
          type: 'output', 
          subtype: 'pdf', 
          description: 'Generate PDF reports',
          icon: <FileOutput className="h-4 w-4 text-black" />
        },
        { 
          id: 'dashboard', 
          name: 'Dashboard', 
          type: 'output', 
          subtype: 'dashboard', 
          description: 'Real-time data dashboards'
        },
        { 
          id: 'api-response', 
          name: 'API Response', 
          type: 'output', 
          subtype: 'api', 
          description: 'Structured API responses'
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
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div key={category.id} className="text-black">
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
                    <div className="flex items-center gap-2 text-black">
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
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {item.icon && <span className="text-black">{item.icon}</span>}
                            <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                          </div>
                          <p className="text-xs text-gray-600 break-words">{item.description}</p>
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
