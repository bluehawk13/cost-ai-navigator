
export const deployableWorkflowTemplates = {
  'invoice-processing-automation': {
    id: 'invoice-processing-automation',
    name: 'Invoice Processing Automation',
    description: 'Complete invoice processing pipeline with OCR, validation, and ERP integration',
    category: 'Finance Operations',
    nodes: [
      {
        id: 'email-monitor',
        type: 'datasource',
        subtype: 'email',
        position: { x: 100, y: 100 },
        data: {
          label: 'Email Monitor',
          description: 'Monitor email for invoice attachments',
          config: {
            emailProvider: 'Office365/Gmail',
            folderPath: 'Invoices',
            fileTypes: ['PDF', 'PNG', 'JPG'],
            processingFrequency: 'Real-time'
          }
        }
      },
      {
        id: 'document-ocr',
        type: 'aimodel',
        subtype: 'vision',
        position: { x: 350, y: 100 },
        data: {
          label: 'Google Document AI',
          description: 'Extract text and data from invoice documents',
          config: {
            provider: 'Google Cloud',
            model: 'Document AI OCR',
            confidence_threshold: 0.85,
            supported_formats: ['PDF', 'PNG', 'JPG', 'TIFF']
          }
        }
      },
      {
        id: 'data-validation',
        type: 'logic',
        subtype: 'validation',
        position: { x: 600, y: 100 },
        data: {
          label: 'Data Validation',
          description: 'Validate extracted data against business rules',
          config: {
            validation_rules: [
              'Amount > 0',
              'Valid vendor ID',
              'Valid date format',
              'Required fields present'
            ],
            duplicate_detection: true,
            po_matching: true
          }
        }
      },
      {
        id: 'approval-routing',
        type: 'logic',
        subtype: 'branch',
        position: { x: 100, y: 300 },
        data: {
          label: 'Approval Routing',
          description: 'Route invoices based on amount thresholds',
          config: {
            rules: [
              { condition: 'amount < 1000', action: 'auto_approve' },
              { condition: 'amount < 5000', action: 'manager_approval' },
              { condition: 'amount >= 5000', action: 'director_approval' }
            ]
          }
        }
      },
      {
        id: 'erp-integration',
        type: 'integration',
        subtype: 'api',
        position: { x: 600, y: 300 },
        data: {
          label: 'ERP Integration',
          description: 'Send approved invoices to accounting system',
          config: {
            system: 'SAP/QuickBooks/NetSuite',
            api_endpoint: '/api/invoices',
            authentication: 'OAuth 2.0',
            retry_policy: '3 attempts with exponential backoff'
          }
        }
      },
      {
        id: 'audit-database',
        type: 'database',
        subtype: 'postgresql',
        position: { x: 350, y: 500 },
        data: {
          label: 'Audit Database',
          description: 'Store processing audit trail',
          config: {
            provider: 'AWS RDS',
            instance_type: 'db.t3.medium',
            storage: '100GB SSD',
            backup_enabled: true
          }
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'email-monitor', target: 'document-ocr' },
      { id: 'e2', source: 'document-ocr', target: 'data-validation' },
      { id: 'e3', source: 'data-validation', target: 'approval-routing' },
      { id: 'e4', source: 'approval-routing', target: 'erp-integration' },
      { id: 'e5', source: 'erp-integration', target: 'audit-database' }
    ],
    estimatedCost: '$0.03 per invoice',
    expectedVolume: '1000-50000 invoices/month',
    implementation_time: '2-3 weeks'
  },

  'support-ticket-automation': {
    id: 'support-ticket-automation',
    name: 'Customer Support Ticket Intelligence',
    description: 'AI-powered ticket classification, routing, and automated response system',
    category: 'Customer Support',
    nodes: [
      {
        id: 'ticket-ingestion',
        type: 'datasource',
        subtype: 'api',
        position: { x: 100, y: 100 },
        data: {
          label: 'Multi-Channel Ingestion',
          description: 'Collect tickets from all support channels',
          config: {
            channels: ['Zendesk', 'Freshdesk', 'Email', 'Chat', 'Social Media'],
            real_time: true,
            rate_limit: '1000 tickets/minute'
          }
        }
      },
      {
        id: 'nlp-analysis',
        type: 'aimodel',
        subtype: 'language',
        position: { x: 350, y: 100 },
        data: {
          label: 'GPT-4 Analysis',
          description: 'Analyze ticket content for intent and sentiment',
          config: {
            provider: 'OpenAI',
            model: 'gpt-4-turbo',
            tasks: ['intent_classification', 'sentiment_analysis', 'urgency_scoring'],
            max_tokens: 1500
          }
        }
      },
      {
        id: 'knowledge-base',
        type: 'database',
        subtype: 'vector',
        position: { x: 600, y: 100 },
        data: {
          label: 'Knowledge Base Vector DB',
          description: 'Semantic search through support documentation',
          config: {
            provider: 'Pinecone',
            dimensions: 1536,
            metric: 'cosine',
            replicas: 2
          }
        }
      },
      {
        id: 'response-generation',
        type: 'aimodel',
        subtype: 'language',
        position: { x: 100, y: 300 },
        data: {
          label: 'Response Generator',
          description: 'Generate contextual responses using knowledge base',
          config: {
            provider: 'Anthropic',
            model: 'claude-3-sonnet',
            temperature: 0.3,
            max_tokens: 2000
          }
        }
      },
      {
        id: 'routing-engine',
        type: 'logic',
        subtype: 'branch',
        position: { x: 350, y: 300 },
        data: {
          label: 'Intelligent Routing',
          description: 'Route tickets to appropriate agents or auto-respond',
          config: {
            auto_response_threshold: 0.85,
            escalation_rules: {
              high_urgency: 'immediate_escalation',
              complex_technical: 'senior_agent',
              billing_issues: 'billing_team'
            }
          }
        }
      },
      {
        id: 'analytics-db',
        type: 'database',
        subtype: 'timeseries',
        position: { x: 600, y: 300 },
        data: {
          label: 'Analytics Database',
          description: 'Store performance metrics and trends',
          config: {
            provider: 'InfluxDB',
            retention_policy: '2 years',
            metrics: ['response_time', 'resolution_rate', 'satisfaction_score']
          }
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'ticket-ingestion', target: 'nlp-analysis' },
      { id: 'e2', source: 'nlp-analysis', target: 'knowledge-base' },
      { id: 'e3', source: 'knowledge-base', target: 'response-generation' },
      { id: 'e4', source: 'response-generation', target: 'routing-engine' },
      { id: 'e5', source: 'routing-engine', target: 'analytics-db' }
    ],
    estimatedCost: '$0.02 per ticket',
    expectedVolume: '5000-25000 tickets/day',
    implementation_time: '3-4 weeks'
  },

  'financial-document-analysis': {
    id: 'financial-document-analysis',
    name: 'Financial Document Analysis Pipeline',
    description: 'Comprehensive financial document processing with compliance checking and risk assessment',
    category: 'Risk Management',
    nodes: [
      {
        id: 'document-intake',
        type: 'datasource',
        subtype: 'file',
        position: { x: 100, y: 100 },
        data: {
          label: 'Secure Document Intake',
          description: 'Encrypted document upload and processing queue',
          config: {
            supported_formats: ['PDF', 'DOC', 'XLSX', 'CSV'],
            encryption: 'AES-256',
            max_file_size: '50MB',
            virus_scanning: true
          }
        }
      },
      {
        id: 'claude-analyzer',
        type: 'aimodel',
        subtype: 'language',
        position: { x: 350, y: 100 },
        data: {
          label: 'Claude-3 Document Analysis',
          description: 'Deep analysis of financial documents and contracts',
          config: {
            provider: 'Anthropic',
            model: 'claude-3-opus',
            context_window: 200000,
            analysis_tasks: [
              'key_metrics_extraction',
              'risk_factor_identification',
              'compliance_checking',
              'anomaly_detection'
            ]
          }
        }
      },
      {
        id: 'regulatory-db',
        type: 'database',
        subtype: 'postgresql',
        position: { x: 600, y: 100 },
        data: {
          label: 'Regulatory Database',
          description: 'Reference database for compliance rules and regulations',
          config: {
            provider: 'AWS RDS',
            instance_type: 'db.r5.xlarge',
            regulations: ['SOX', 'GDPR', 'PCI-DSS', 'Basel III'],
            update_frequency: 'Weekly'
          }
        }
      },
      {
        id: 'risk-scoring',
        type: 'compute',
        subtype: 'serverless',
        position: { x: 100, y: 300 },
        data: {
          label: 'Risk Scoring Engine',
          description: 'Calculate comprehensive risk scores using ML models',
          config: {
            provider: 'AWS Lambda',
            runtime: 'Python 3.9',
            memory: '3008MB',
            timeout: '15 minutes',
            models: ['credit_risk', 'market_risk', 'operational_risk']
          }
        }
      },
      {
        id: 'compliance-checker',
        type: 'logic',
        subtype: 'validation',
        position: { x: 350, y: 300 },
        data: {
          label: 'Compliance Validator',
          description: 'Automated compliance checking against multiple frameworks',
          config: {
            frameworks: ['SOX', 'COSO', 'ISO 27001'],
            validation_rules: 500,
            automated_remediation: true,
            exception_handling: 'human_review_queue'
          }
        }
      },
      {
        id: 'reporting-system',
        type: 'output',
        subtype: 'dashboard',
        position: { x: 600, y: 300 },
        data: {
          label: 'Executive Dashboard',
          description: 'Real-time risk and compliance reporting',
          config: {
            platform: 'Tableau/PowerBI',
            refresh_rate: 'Real-time',
            alerts: ['high_risk_threshold', 'compliance_violations'],
            stakeholder_access: ['executives', 'risk_managers', 'auditors']
          }
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'document-intake', target: 'claude-analyzer' },
      { id: 'e2', source: 'claude-analyzer', target: 'regulatory-db' },
      { id: 'e3', source: 'regulatory-db', target: 'risk-scoring' },
      { id: 'e4', source: 'risk-scoring', target: 'compliance-checker' },
      { id: 'e5', source: 'compliance-checker', target: 'reporting-system' }
    ],
    estimatedCost: '$0.25 per document',
    expectedVolume: '1000-15000 documents/month',
    implementation_time: '4-6 weeks'
  }
};
