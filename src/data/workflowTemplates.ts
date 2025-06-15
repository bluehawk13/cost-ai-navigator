
import { Node, Edge } from '@xyflow/react';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: Node[];
  edges: Edge[];
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'ai-chatbot-template',
    name: 'AI Chatbot Pipeline',
    description: 'Complete AI chatbot with document processing, vector storage, and response generation',
    category: 'AI Applications',
    nodes: [
      {
        id: 'data-source-1',
        type: 'dataSource',
        position: { x: 100, y: 100 },
        data: {
          label: 'Document Upload',
          subtype: 'file',
          config: {
            acceptedTypes: ['pdf', 'txt', 'docx'],
            maxSize: '50MB',
            processingCost: 0.001
          }
        }
      },
      {
        id: 'logic-1',
        type: 'logic',
        position: { x: 350, y: 100 },
        data: {
          label: 'Text Chunking',
          subtype: 'transform',
          config: {
            script: 'Split documents into chunks of 1000 characters with 200 character overlap',
            language: 'python',
            processingCost: 0.00001
          }
        }
      },
      {
        id: 'ai-model-1',
        type: 'aiModel',
        position: { x: 600, y: 100 },
        data: {
          label: 'Text Embeddings',
          subtype: 'openai',
          provider: 'openai',
          config: {
            model: 'text-embedding-ada-002',
            maxTokens: 8000,
            temperature: 0,
            costPerToken: 0.0001
          }
        }
      },
      {
        id: 'database-1',
        type: 'database',
        position: { x: 850, y: 100 },
        data: {
          label: 'Vector Database',
          subtype: 'pinecone',
          config: {
            hosting: 'pinecone-cloud',
            index: 'chatbot-knowledge',
            dimension: 1536,
            pods: 1,
            replicas: 1
          }
        }
      },
      {
        id: 'data-source-2',
        type: 'dataSource',
        position: { x: 100, y: 300 },
        data: {
          label: 'User Query',
          subtype: 'api',
          config: {
            url: '/api/chat',
            method: 'POST',
            rateLimitRpm: 100,
            costPerRequest: 0.0001
          }
        }
      },
      {
        id: 'database-2',
        type: 'database',
        position: { x: 350, y: 300 },
        data: {
          label: 'Similarity Search',
          subtype: 'pinecone',
          config: {
            hosting: 'pinecone-cloud',
            index: 'chatbot-knowledge',
            dimension: 1536,
            pods: 1,
            replicas: 1
          }
        }
      },
      {
        id: 'ai-model-2',
        type: 'aiModel',
        position: { x: 600, y: 300 },
        data: {
          label: 'Response Generation',
          subtype: 'openai',
          provider: 'openai',
          config: {
            model: 'gpt-4o-mini',
            maxTokens: 2000,
            temperature: 0.7,
            costPerToken: 0.00015
          }
        }
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 850, y: 300 },
        data: {
          label: 'Chat Response',
          subtype: 'api',
          config: {
            format: 'json',
            schema: { message: 'string', sources: 'array' },
            rateLimitRpm: 100,
            costPerRequest: 0.0001
          }
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'data-source-1', target: 'logic-1' },
      { id: 'e2', source: 'logic-1', target: 'ai-model-1' },
      { id: 'e3', source: 'ai-model-1', target: 'database-1' },
      { id: 'e4', source: 'data-source-2', target: 'database-2' },
      { id: 'e5', source: 'database-2', target: 'ai-model-2' },
      { id: 'e6', source: 'ai-model-2', target: 'output-1' }
    ]
  },
  {
    id: 'data-analysis-template',
    name: 'Data Analysis & Reporting',
    description: 'Automated data processing, analysis, and report generation with cloud storage',
    category: 'Data Processing',
    nodes: [
      {
        id: 'data-source-1',
        type: 'dataSource',
        position: { x: 100, y: 100 },
        data: {
          label: 'CSV Data Import',
          subtype: 'file',
          config: {
            acceptedTypes: ['csv', 'xlsx'],
            maxSize: '100MB',
            processingCost: 0.002
          }
        }
      },
      {
        id: 'logic-1',
        type: 'logic',
        position: { x: 350, y: 100 },
        data: {
          label: 'Data Cleaning',
          subtype: 'python',
          config: {
            script: 'import pandas as pd\n# Clean and validate data\ndf = df.dropna()\ndf = df.drop_duplicates()',
            requirements: ['pandas', 'numpy'],
            runtime: 'python3.9',
            processingCost: 0.00005
          }
        }
      },
      {
        id: 'database-1',
        type: 'database',
        position: { x: 600, y: 100 },
        data: {
          label: 'Data Warehouse',
          subtype: 'postgres',
          config: {
            hosting: 'cloud',
            region: 'us-east-1',
            instanceType: 'medium',
            connections: 200,
            storage: '100GB'
          }
        }
      },
      {
        id: 'logic-2',
        type: 'logic',
        position: { x: 350, y: 250 },
        data: {
          label: 'Statistical Analysis',
          subtype: 'python',
          config: {
            script: 'import scipy.stats as stats\n# Perform statistical analysis\nresults = stats.describe(data)',
            requirements: ['scipy', 'matplotlib', 'seaborn'],
            runtime: 'python3.9',
            processingCost: 0.0001
          }
        }
      },
      {
        id: 'ai-model-1',
        type: 'aiModel',
        position: { x: 600, y: 250 },
        data: {
          label: 'Insights Generation',
          subtype: 'openai',
          provider: 'openai',
          config: {
            model: 'gpt-4o-mini',
            maxTokens: 1500,
            temperature: 0.3,
            costPerToken: 0.00015
          }
        }
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 850, y: 175 },
        data: {
          label: 'PDF Report',
          subtype: 'pdf',
          config: {
            template: 'analytics-report',
            format: 'A4',
            costPerPage: 0.01
          }
        }
      },
      {
        id: 'cloud-1',
        type: 'cloud',
        position: { x: 850, y: 300 },
        data: {
          label: 'Cloud Storage',
          subtype: 'aws',
          provider: 'aws',
          config: {
            category: 'storage',
            service: 's3',
            region: 'us-east-1',
            storage: { type: 'standard', size: '1TB' }
          }
        }
      },
      {
        id: 'integration-1',
        type: 'integration',
        position: { x: 600, y: 400 },
        data: {
          label: 'Email Notification',
          subtype: 'email',
          config: {
            provider: 'sendgrid',
            template: 'analysis-complete',
            costPerEmail: 0.001
          }
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'data-source-1', target: 'logic-1' },
      { id: 'e2', source: 'logic-1', target: 'database-1' },
      { id: 'e3', source: 'database-1', target: 'logic-2' },
      { id: 'e4', source: 'logic-2', target: 'ai-model-1' },
      { id: 'e5', source: 'ai-model-1', target: 'output-1' },
      { id: 'e6', source: 'output-1', target: 'cloud-1' },
      { id: 'e7', source: 'ai-model-1', target: 'integration-1' }
    ]
  }
];
