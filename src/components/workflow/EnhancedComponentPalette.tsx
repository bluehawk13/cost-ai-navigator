
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
  DollarSign
} from 'lucide-react';

interface ComponentItem {
  id: string;
  name: string;
  type: string;
  subtype: string;
  cost?: string;
  description: string;
  icon?: React.ReactNode;
}

interface ComponentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: ComponentItem[];
  expanded: boolean;
}

interface EnhancedComponentPaletteProps {
  onAddNode: (nodeType: string, subtype: string, label: string) => void;
  isCollapsed: boolean;
}

const EnhancedComponentPalette = ({ onAddNode, isCollapsed }: EnhancedComponentPaletteProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<ComponentCategory[]>([
    {
      id: 'cloud',
      name: '☁️ Cloud Providers',
      icon: <Cloud className="h-4 w-4" />,
      expanded: true,
      items: [
        { id: 'aws-lambda', name: 'AWS Lambda', type: 'dataSource', subtype: 'aws-lambda', cost: '$0.0000002/request', description: 'Serverless compute' },
        { id: 'aws-s3', name: 'AWS S3', type: 'dataSource', subtype: 'aws-s3', cost: '$0.023/GB', description: 'Object storage' },
        { id: 'aws-bedrock', name: 'AWS Bedrock', type: 'aiModel', subtype: 'aws-bedrock', cost: '$0.01/1k tokens', description: 'Managed AI models' },
        { id: 'gcp-vertex', name: 'GCP Vertex AI', type: 'aiModel', subtype: 'gcp-vertex', cost: '$0.008/1k tokens', description: 'Google AI platform' },
        { id: 'gcp-functions', name: 'GCP Cloud Functions', type: 'dataSource', subtype: 'gcp-functions', cost: '$0.0000004/request', description: 'Serverless functions' },
        { id: 'azure-openai', name: 'Azure OpenAI', type: 'aiModel', subtype: 'azure-openai', cost: '$0.02/1k tokens', description: 'OpenAI on Azure' },
        { id: 'azure-blob', name: 'Azure Blob Storage', type: 'dataSource', subtype: 'azure-blob', cost: '$0.021/GB', description: 'Cloud storage' }
      ]
    },
    {
      id: 'ai-models',
      name: '🤖 AI Models',
      icon: <Bot className="h-4 w-4" />,
      expanded: true,
      items: [
        { id: 'gpt-4', name: 'GPT-4', type: 'aiModel', subtype: 'gpt4', cost: '$0.03/1k tokens', description: 'OpenAI\'s most capable model' },
        { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', type: 'aiModel', subtype: 'gpt3.5', cost: '$0.001/1k tokens', description: 'Fast and efficient' },
        { id: 'whisper', name: 'Whisper', type: 'aiModel', subtype: 'whisper', cost: '$0.006/minute', description: 'Speech recognition' },
        { id: 'claude-opus', name: 'Claude 3 Opus', type: 'aiModel', subtype: 'claude-opus', cost: '$0.015/1k tokens', description: 'Anthropic\'s most capable' },
        { id: 'claude-sonnet', name: 'Claude 3 Sonnet', type: 'aiModel', subtype: 'claude-sonnet', cost: '$0.003/1k tokens', description: 'Balanced performance' },
        { id: 'claude-haiku', name: 'Claude 3 Haiku', type: 'aiModel', subtype: 'claude-haiku', cost: '$0.00025/1k tokens', description: 'Fast and affordable' },
        { id: 'mixtral', name: 'Mixtral 8x7B', type: 'aiModel', subtype: 'mixtral', cost: '$0.0007/1k tokens', description: 'Mistral\'s mixture model' },
        { id: 'llama2', name: 'Llama 2 70B', type: 'aiModel', subtype: 'llama2', cost: '$0.0008/1k tokens', description: 'Meta\'s open model' }
      ]
    },
    {
      id: 'data-sources',
      name: '🗂️ Data Sources',
      icon: <FileText className="h-4 w-4" />,
      expanded: false,
      items: [
        { id: 'file-upload', name: 'File Upload', type: 'dataSource', subtype: 'file', description: 'Upload documents, images, data files' },
        { id: 'api-gateway', name: 'API Gateway', type: 'dataSource', subtype: 'api', description: 'Connect to external APIs' },
        { id: 'web-scraper', name: 'Web Scraper', type: 'dataSource', subtype: 'scraper', description: 'Extract data from websites' }
      ]
    },
    {
      id: 'databases',
      name: '🗃️ Databases',
      icon: <Database className="h-4 w-4" />,
      expanded: false,
      items: [
        { id: 'postgresql', name: 'PostgreSQL', type: 'database', subtype: 'postgres', description: 'Relational database' },
        { id: 'pinecone', name: 'Pinecone', type: 'database', subtype: 'pinecone', description: 'Vector database' },
        { id: 'redis', name: 'Redis', type: 'database', subtype: 'redis', description: 'In-memory cache' }
      ]
    },
    {
      id: 'logic',
      name: '⚙️ Logic',
      icon: <Cog className="h-4 w-4" />,
      expanded: false,
      items: [
        { id: 'filter', name: 'Filter', type: 'logic', subtype: 'filter', description: 'Filter data based on conditions' },
        { id: 'branch', name: 'Branch', type: 'logic', subtype: 'branch', description: 'Conditional workflow branching' },
        { id: 'python', name: 'Custom Python', type: 'logic', subtype: 'python', description: 'Execute custom Python code' }
      ]
    },
    {
      id: 'outputs',
      name: '📤 Outputs',
      icon: <Send className="h-4 w-4" />,
      expanded: false,
      items: [
        { id: 'email', name: 'Email', type: 'output', subtype: 'email', description: 'Send email notifications' },
        { id: 'slack', name: 'Slack', type: 'output', subtype: 'slack', description: 'Send Slack messages' },
        { id: 'pdf', name: 'PDF Generator', type: 'output', subtype: 'pdf', description: 'Generate PDF reports' }
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
      <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
        <Cloud className="h-5 w-5 text-gray-600" />
        <Bot className="h-5 w-5 text-gray-600" />
        <FileText className="h-5 w-5 text-gray-600" />
        <Database className="h-5 w-5 text-gray-600" />
        <Cog className="h-5 w-5 text-gray-600" />
        <Send className="h-5 w-5 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Component Palette</h2>
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
                    <div className="flex items-center gap-2">
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
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-move hover:bg-gray-100 transition-colors"
                      draggable
                      onClick={() => onAddNode(item.type, item.subtype, item.name)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                          {item.cost && (
                            <div className="flex items-center gap-1 mt-2">
                              <DollarSign className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">{item.cost}</span>
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs ml-2">
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
