import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ArrowRight, DollarSign, Clock, Users, Zap, Database, Bot, FileText } from 'lucide-react';
import UseCaseDetail from './UseCaseDetail';

interface UseCase {
  id: string;
  title: string;
  summary: string;
  industries: string[];
  functions: string[];
  estimatedCost: string;
  savings: string;
  impactTag: string;
  workflowId?: string;
  hoverMetric?: string;
  dataSourcesUsed: string[];
  automationSteps: string[];
  realWorldExample: {
    company: string;
    volume: string;
    timeSaved: string;
    costReduction: string;
  };
  isDeployable?: boolean;
}

const useCases: UseCase[] = [
  {
    id: '1',
    title: 'Invoice Processing Automation',
    summary: 'Automatically extract, validate, and process invoices using OCR and AI document understanding with 99.2% accuracy.',
    industries: ['Finance', 'Accounting', 'E-commerce', 'Manufacturing'],
    functions: ['Accounts Payable', 'Finance Operations', 'Procurement'],
    estimatedCost: '$0.03 per invoice',
    savings: 'Save 85% processing time',
    impactTag: 'Reduces manual work by 90%',
    workflowId: 'invoice-processing-automation',
    hoverMetric: 'Process 1000+ invoices/hour',
    dataSourcesUsed: ['PDF Documents', 'Email Attachments', 'Vendor Portals', 'ERP Systems'],
    automationSteps: [
      'Email monitoring for new invoices',
      'OCR extraction using Google Document AI',
      'Data validation against purchase orders',
      'Duplicate detection and flagging',
      'Approval routing based on amount thresholds',
      'Integration with accounting systems (QuickBooks, SAP)',
      'Exception handling for manual review',
      'Audit trail and compliance reporting'
    ],
    realWorldExample: {
      company: 'Walmart Suppliers Network',
      volume: '50,000 invoices monthly',
      timeSaved: '2,400 hours monthly',
      costReduction: '$180,000 annually'
    },
    isDeployable: true
  },
  {
    id: '2',
    title: 'Customer Support Ticket Intelligence',
    summary: 'AI-powered ticket classification, sentiment analysis, and automated response generation with priority routing.',
    industries: ['SaaS', 'E-commerce', 'Telecommunications', 'Banking'],
    functions: ['Customer Support', 'Service Operations', 'Quality Assurance'],
    estimatedCost: '$0.02 per ticket',
    savings: 'Reduce response time by 75%',
    impactTag: 'Improves CSAT by 45%',
    workflowId: 'support-ticket-automation',
    hoverMetric: 'Handle 10,000+ tickets daily',
    dataSourcesUsed: ['Support Platforms', 'Live Chat', 'Email', 'Social Media', 'Knowledge Base'],
    automationSteps: [
      'Real-time ticket ingestion from multiple channels',
      'Natural language processing for intent classification',
      'Sentiment analysis and urgency scoring',
      'Automated response generation using GPT-4',
      'Knowledge base integration for context',
      'Escalation rules based on complexity',
      'Agent assignment optimization',
      'Performance analytics and reporting'
    ],
    realWorldExample: {
      company: 'Shopify Merchant Support',
      volume: '25,000 tickets daily',
      timeSaved: '15,000 hours monthly',
      costReduction: '$2.4M annually'
    },
    isDeployable: true
  },
  {
    id: '3',
    title: 'Financial Document Analysis',
    summary: 'Comprehensive analysis of financial statements, contracts, and regulatory documents using advanced NLP and compliance checking.',
    industries: ['Banking', 'Insurance', 'Investment', 'Real Estate'],
    functions: ['Risk Management', 'Compliance', 'Legal Operations', 'Underwriting'],
    estimatedCost: '$0.25 per document',
    savings: 'Reduce review time by 80%',
    impactTag: 'Improves accuracy by 95%',
    workflowId: 'financial-document-analysis',
    hoverMetric: 'Analyze 500+ docs/hour',
    dataSourcesUsed: ['Financial Statements', 'Contracts', 'Regulatory Filings', 'Credit Reports'],
    automationSteps: [
      'Document ingestion and format standardization',
      'Key information extraction using Claude-3',
      'Financial ratio calculations and analysis',
      'Risk factor identification and scoring',
      'Regulatory compliance verification',
      'Cross-reference validation with external data',
      'Exception flagging for human review',
      'Comprehensive reporting and audit trails'
    ],
    realWorldExample: {
      company: 'JPMorgan Chase Credit Analysis',
      volume: '15,000 documents monthly',
      timeSaved: '8,000 hours monthly',
      costReduction: '$1.8M annually'
    },
    isDeployable: true
  },
  {
    id: '4',
    title: 'HR Resume Screening & Matching',
    summary: 'AI-powered resume analysis with skill extraction, job matching, and candidate ranking based on requirements.',
    industries: ['Technology', 'Healthcare', 'Finance', 'Consulting'],
    functions: ['Talent Acquisition', 'HR Operations', 'Recruiting'],
    estimatedCost: '$0.08 per resume',
    savings: 'Screen 15x faster',
    impactTag: 'Improves hiring quality by 40%',
    workflowId: 'resume-screening',
    hoverMetric: 'Process 2000+ resumes/day',
    dataSourcesUsed: ['Job Boards', 'ATS Systems', 'LinkedIn', 'Company Career Pages'],
    automationSteps: [
      'Resume parsing and data extraction',
      'Skill identification and categorization',
      'Experience level assessment',
      'Job requirement matching algorithm',
      'Cultural fit analysis',
      'Bias detection and mitigation',
      'Candidate scoring and ranking',
      'Interview scheduling automation'
    ],
    realWorldExample: {
      company: 'Google Talent Acquisition',
      volume: '1M+ applications annually',
      timeSaved: '50,000 hours annually',
      costReduction: '$4.2M annually'
    }
  },
  {
    id: '5',
    title: 'Content Moderation at Scale',
    summary: 'Real-time content analysis for text, images, and videos using computer vision and NLP for safety and compliance.',
    industries: ['Social Media', 'Gaming', 'Education', 'E-commerce'],
    functions: ['Content Safety', 'Trust & Safety', 'Community Management'],
    estimatedCost: '$0.005 per item',
    savings: 'Scale moderation 200x',
    impactTag: 'Reduces harmful content by 98%',
    workflowId: 'content-moderation',
    hoverMetric: 'Moderate 10M+ items daily',
    dataSourcesUsed: ['User-Generated Content', 'Comments', 'Images', 'Videos', 'Audio'],
    automationSteps: [
      'Real-time content ingestion',
      'Multi-modal AI analysis (text, image, video)',
      'Toxicity and sentiment detection',
      'Policy violation classification',
      'Age-appropriate content filtering',
      'Automated action enforcement',
      'Appeal process automation',
      'Trend analysis and reporting'
    ],
    realWorldExample: {
      company: 'Meta Content Review',
      volume: '3B+ posts daily',
      timeSaved: '500,000 hours daily',
      costReduction: '$150M annually'
    }
  },
  {
    id: '6',
    title: 'Email Marketing Optimization',
    summary: 'AI-driven email campaign creation, A/B testing, and personalization with predictive send time optimization.',
    industries: ['E-commerce', 'SaaS', 'Media', 'Retail'],
    functions: ['Digital Marketing', 'Growth', 'Customer Success'],
    estimatedCost: '$0.01 per email',
    savings: 'Increase conversion by 65%',
    impactTag: 'Boosts revenue by 35%',
    workflowId: 'email-optimization',
    hoverMetric: 'Optimize millions of emails',
    dataSourcesUsed: ['Customer Data', 'Behavioral Analytics', 'Purchase History', 'Engagement Metrics'],
    automationSteps: [
      'Customer segmentation and profiling',
      'Personalized content generation',
      'Send time optimization using ML',
      'Subject line A/B testing',
      'Dynamic content insertion',
      'Engagement prediction modeling',
      'Automated follow-up sequences',
      'Performance analytics and optimization'
    ],
    realWorldExample: {
      company: 'Amazon Marketing',
      volume: '100M+ emails daily',
      timeSaved: '25,000 hours monthly',
      costReduction: '$12M annually'
    }
  },
  {
    id: '7',
    title: 'Document Classification',
    summary: 'Automatically categorize and organize documents using machine learning classification models.',
    industries: ['Legal', 'Healthcare', 'Finance'],
    functions: ['Document Management', 'Operations'],
    estimatedCost: '$0.01 per document',
    savings: 'Save 80% sorting time',
    impactTag: 'Improves organization by 95%',
    workflowId: 'document-classification',
    hoverMetric: 'Improves organization by 95%',
    dataSourcesUsed: ['PDF Documents', 'Email Attachments', 'File Servers', 'Cloud Storage'],
    automationSteps: [
      'Document ingestion and format standardization',
      'Machine learning classification using BERT',
      'Data validation and correction',
      'Duplicate detection and flagging',
      'Integration with document management systems',
      'Exception handling for manual review',
      'Audit trail and compliance reporting'
    ],
    realWorldExample: {
      company: 'Legal Document Management',
      volume: '100,000 documents monthly',
      timeSaved: '5,000 hours monthly',
      costReduction: '$100,000 annually'
    }
  },
  {
    id: '8',
    title: 'Expense Report Processing',
    summary: 'Extract and validate expense data from receipts and forms automatically.',
    industries: ['Finance', 'Corporate', 'SaaS'],
    functions: ['Finance Ops', 'Accounting'],
    estimatedCost: '$0.05 per receipt',
    savings: 'Reduce processing time by 75%',
    impactTag: 'Cuts expense processing costs by 60%',
    workflowId: 'expense-processing',
    hoverMetric: 'Cuts costs by 60%',
    dataSourcesUsed: ['Expense Forms', 'Receipts', 'ERP Systems'],
    automationSteps: [
      'Email monitoring for new expense reports',
      'OCR extraction using Google Document AI',
      'Data validation against expense templates',
      'Duplicate detection and flagging',
      'Approval routing based on amount thresholds',
      'Integration with accounting systems (QuickBooks, SAP)',
      'Exception handling for manual review',
      'Audit trail and compliance reporting'
    ],
    realWorldExample: {
      company: 'XYZ Corporation',
      volume: '10,000 expense reports monthly',
      timeSaved: '2,000 hours monthly',
      costReduction: '$150,000 annually'
    }
  },
  {
    id: '9',
    title: 'Lead Qualification & Scoring',
    summary: 'Score and qualify sales leads automatically using AI analysis of behavior and demographics.',
    industries: ['SaaS', 'Sales', 'Marketing'],
    functions: ['Sales Ops', 'Lead Generation'],
    estimatedCost: '$0.02 per lead',
    savings: 'Increase qualified leads by 50%',
    impactTag: 'Improves conversion rates by 30%',
    workflowId: 'lead-scoring',
    hoverMetric: 'Improves conversion by 30%',
    dataSourcesUsed: ['Sales Data', 'Customer Profiles', 'Behavioral Analytics'],
    automationSteps: [
      'Real-time data ingestion from sales channels',
      'Behavioral analysis using GPT-4',
      'Demographic scoring and matching',
      'Lead qualification algorithm',
      'Cultural fit analysis',
      'Bias detection and mitigation',
      'Candidate scoring and ranking',
      'Interview scheduling automation'
    ],
    realWorldExample: {
      company: 'Salesforce Marketing',
      volume: '100,000 leads monthly',
      timeSaved: '5,000 hours monthly',
      costReduction: '$100,000 annually'
    }
  },
  {
    id: '10',
    title: 'Inventory Management',
    summary: 'Predict inventory needs and automate reordering using demand forecasting AI.',
    industries: ['E-commerce', 'Retail', 'Manufacturing'],
    functions: ['Operations', 'Supply Chain'],
    estimatedCost: '$0.10 per SKU',
    savings: 'Reduce stockouts by 60%',
    impactTag: 'Cuts inventory costs by 25%',
    workflowId: 'inventory-management',
    hoverMetric: 'Cuts costs by 25%',
    dataSourcesUsed: ['Sales Data', 'Inventory Data', 'Demand Forecasting Models'],
    automationSteps: [
      'Real-time data ingestion from sales channels',
      'Demand forecasting using Prophet',
      'Inventory optimization algorithm',
      'Reordering based on forecasted demand',
      'Exception handling for manual review',
      'Audit trail and compliance reporting'
    ],
    realWorldExample: {
      company: 'Amazon Supply Chain',
      volume: '100,000 SKUs monthly',
      timeSaved: '5,000 hours monthly',
      costReduction: '$100,000 annually'
    }
  },
  {
    id: '11',
    title: 'Quality Control Inspection',
    summary: 'Automate visual quality control using computer vision to detect defects and anomalies.',
    industries: ['Manufacturing', 'Food', 'Automotive'],
    functions: ['Quality Assurance', 'Operations'],
    estimatedCost: '$0.08 per inspection',
    savings: 'Reduce defects by 85%',
    impactTag: 'Improves quality consistency by 90%',
    workflowId: 'quality-control',
    hoverMetric: 'Improves quality by 90%',
    dataSourcesUsed: ['Production Data', 'Inspection Cameras', 'Quality Control Software'],
    automationSteps: [
      'Real-time data ingestion from production lines',
      'Computer vision detection using YOLOv5',
      'Defect classification and anomaly detection',
      'Exception handling for manual review',
      'Audit trail and compliance reporting'
    ],
    realWorldExample: {
      company: 'Ford Quality Control',
      volume: '100,000 inspections monthly',
      timeSaved: '5,000 hours monthly',
      costReduction: '$100,000 annually'
    }
  },
  {
    id: '12',
    title: 'Customer Churn Prediction',
    summary: 'Identify customers at risk of churning using behavioral analysis and engagement patterns.',
    industries: ['SaaS', 'Telecom', 'Subscription'],
    functions: ['Customer Success', 'Analytics'],
    estimatedCost: '$0.05 per customer',
    savings: 'Reduce churn by 40%',
    impactTag: 'Increases retention by 35%',
    workflowId: 'churn-prediction',
    hoverMetric: 'Increases retention by 35%',
    dataSourcesUsed: ['Customer Data', 'Behavioral Analytics', 'Engagement Metrics'],
    automationSteps: [
      'Real-time data ingestion from customer channels',
      'Behavioral analysis using GPT-4',
      'Engagement pattern matching',
      'Churn prediction algorithm',
      'Cultural fit analysis',
      'Bias detection and mitigation',
      'Candidate scoring and ranking',
      'Interview scheduling automation'
    ],
    realWorldExample: {
      company: 'Salesforce Customer Success',
      volume: '100,000 customers monthly',
      timeSaved: '5,000 hours monthly',
      costReduction: '$100,000 annually'
    }
  },
  {
    id: '13',
    title: 'Medical Record Analysis',
    summary: 'Extract and analyze patient data from medical records for faster diagnosis and treatment.',
    industries: ['Healthcare', 'Medical', 'Insurance'],
    functions: ['Clinical Operations', 'Data Analysis'],
    estimatedCost: '$0.20 per record',
    savings: 'Speed up analysis by 70%',
    impactTag: 'Improves diagnostic accuracy by 80%',
    workflowId: 'medical-analysis',
    hoverMetric: 'Improves accuracy by 80%',
    dataSourcesUsed: ['Medical Records', 'Electronic Health Records', 'Clinical Data'],
    automationSteps: [
      'Real-time data ingestion from medical records',
      'Natural language processing using GPT-4',
      'Clinical data analysis and interpretation',
      'Exception handling for manual review',
      'Audit trail and compliance reporting'
    ],
    realWorldExample: {
      company: 'Johns Hopkins Medical Center',
      volume: '100,000 records monthly',
      timeSaved: '5,000 hours monthly',
      costReduction: '$100,000 annually'
    }
  },
  {
    id: '14',
    title: 'Financial Risk Assessment',
    summary: 'Assess loan and credit risks automatically using AI analysis of financial data.',
    industries: ['Banking', 'Finance', 'Insurance'],
    functions: ['Risk Management', 'Underwriting'],
    estimatedCost: '$0.12 per assessment',
    savings: 'Reduce assessment time by 80%',
    impactTag: 'Improves risk accuracy by 65%',
    workflowId: 'risk-assessment',
    hoverMetric: 'Improves accuracy by 65%',
    dataSourcesUsed: ['Financial Data', 'Credit Reports', 'Risk Models'],
    automationSteps: [
      'Real-time data ingestion from financial data sources',
      'Financial risk assessment using GPT-4',
      'Risk factor identification and scoring',
      'Exception handling for manual review',
      'Audit trail and compliance reporting'
    ],
    realWorldExample: {
      company: 'Bank of America Risk Management',
      volume: '100,000 assessments monthly',
      timeSaved: '5,000 hours monthly',
      costReduction: '$100,000 annually'
    }
  },
  {
    id: '15',
    title: 'Product Recommendation Engine',
    summary: 'Generate personalized product recommendations using collaborative filtering and user behavior.',
    industries: ['E-commerce', 'Retail', 'Media'],
    functions: ['Marketing', 'Product Management'],
    estimatedCost: '$0.01 per recommendation',
    savings: 'Increase sales by 35%',
    impactTag: 'Boosts revenue by 25%',
    workflowId: 'product-recommendations',
    hoverMetric: 'Boosts revenue by 25%',
    dataSourcesUsed: ['Customer Data', 'Purchase History', 'User Behavior'],
    automationSteps: [
      'Real-time data ingestion from customer channels',
      'Collaborative filtering using SVD',
      'User behavior analysis using GPT-4',
      'Product recommendation algorithm',
      'Cultural fit analysis',
      'Bias detection and mitigation',
      'Candidate scoring and ranking',
      'Interview scheduling automation'
    ],
    realWorldExample: {
      company: 'Amazon Product Recommendations',
      volume: '100,000 recommendations monthly',
      timeSaved: '5,000 hours monthly',
      costReduction: '$100,000 annually'
    }
  },
  {
    id: '16',
    title: 'Fraud Detection System',
    summary: 'Detect fraudulent transactions and activities in real-time using pattern recognition.',
    industries: ['Banking', 'E-commerce', 'Insurance'],
    functions: ['Security', 'Risk Management'],
    estimatedCost: '$0.03 per transaction',
    savings: 'Reduce fraud by 90%',
    impactTag: 'Prevents 95% of fraud attempts',
    workflowId: 'fraud-detection',
    hoverMetric: 'Prevents 95% fraud',
    dataSourcesUsed: ['Transaction Data', 'Payment Systems', 'Risk Models'],
    automationSteps: [
      'Real-time data ingestion from transaction data sources',
      'Pattern recognition using GPT-4',
      'Fraud detection algorithm',
      'Exception handling for manual review',
      'Audit trail and compliance reporting'
    ],
    realWorldExample: {
      company: 'Mastercard Fraud Detection',
      volume: '100,000 transactions monthly',
      timeSaved: '5,000 hours monthly',
      costReduction: '$100,000 annually'
    }
  },
  {
    id: '17',
    title: 'Sentiment Analysis for Reviews',
    summary: 'Analyze customer reviews and feedback to understand sentiment and extract insights.',
    industries: ['E-commerce', 'Hospitality', 'SaaS'],
    functions: ['Customer Success', 'Product Management'],
    estimatedCost: '$0.002 per review',
    savings: 'Process 1000x more reviews',
    impactTag: 'Improves product insights by 85%',
    workflowId: 'sentiment-analysis',
    hoverMetric: 'Process 1000x more',
    dataSourcesUsed: ['Customer Reviews', 'Feedback Forms', 'Social Media'],
    automationSteps: [
      'Real-time data ingestion from customer channels',
      'Sentiment analysis using GPT-4',
      'Insight extraction and reporting',
      'Cultural fit analysis',
      'Bias detection and mitigation',
      'Candidate scoring and ranking',
      'Interview scheduling automation'
    ],
    realWorldExample: {
      company: 'Google Product Reviews',
      volume: '100,000 reviews monthly',
      timeSaved: '5,000 hours monthly',
      costReduction: '$100,000 annually'
    }
  },
  {
    id: '18',
    title: 'Automated Data Entry',
    summary: 'Convert handwritten forms and documents into structured digital data automatically.',
    industries: ['Healthcare', 'Government', 'Insurance'],
    functions: ['Data Operations', 'Administration'],
    estimatedCost: '$0.04 per form',
    savings: 'Eliminate 95% manual entry',
    impactTag: 'Reduces data entry costs by 85%',
    workflowId: 'data-entry',
    hoverMetric: 'Eliminates 95% manual work',
    dataSourcesUsed: ['Handwritten Forms', 'Paper Documents', 'Digital Forms'],
    automationSteps: [
      'Handwriting recognition using Tesseract',
      'Data extraction and validation',
      'Integration with digital data systems',
      'Exception handling for manual review',
      'Audit trail and compliance reporting'
    ],
    realWorldExample: {
      company: 'Healthcare Data Entry',
      volume: '100,000 forms monthly',
      timeSaved: '5,000 hours monthly',
      costReduction: '$100,000 annually'
    }
  },
  {
    id: '19',
    title: 'Supply Chain Optimization',
    summary: 'Optimize supply chain routes and logistics using AI-powered demand and route analysis.',
    industries: ['Logistics', 'Manufacturing', 'Retail'],
    functions: ['Supply Chain', 'Operations'],
    estimatedCost: '$0.25 per route',
    savings: 'Reduce logistics costs by 30%',
    impactTag: 'Improves delivery efficiency by 50%',
    workflowId: 'supply-chain',
    hoverMetric: 'Improves efficiency by 50%',
    dataSourcesUsed: ['Supply Chain Data', 'Route Optimization Models', 'Logistics Software'],
    automationSteps: [
      'Real-time data ingestion from supply chain data sources',
      'Demand and route analysis using GPT-4',
      'Supply chain optimization algorithm',
      'Route optimization based on demand',
      'Exception handling for manual review',
      'Audit trail and compliance reporting'
    ],
    realWorldExample: {
      company: 'DHL Supply Chain Optimization',
      volume: '100,000 routes monthly',
      timeSaved: '5,000 hours monthly',
      costReduction: '$100,000 annually'
    }
  },
  {
    id: '20',
    title: 'Content Generation & SEO',
    summary: 'Generate SEO-optimized content and meta descriptions automatically for websites.',
    industries: ['Marketing', 'Media', 'E-commerce'],
    functions: ['Content Marketing', 'SEO'],
    estimatedCost: '$0.50 per article',
    savings: 'Generate content 10x faster',
    impactTag: 'Improves SEO rankings by 40%',
    workflowId: 'content-generation',
    hoverMetric: 'Generate 10x faster',
    dataSourcesUsed: ['Content Templates', 'SEO Tools', 'Content Writing Services'],
    automationSteps: [
      'Content generation using GPT-4',
      'SEO optimization using GPT-4',
      'Content review and approval',
      'Cultural fit analysis',
      'Bias detection and mitigation',
      'Candidate scoring and ranking',
      'Interview scheduling automation'
    ],
    realWorldExample: {
      company: 'Google Content Generation',
      volume: '100,000 articles monthly',
      timeSaved: '5,000 hours monthly',
      costReduction: '$100,000 annually'
    }
  },
  {
    id: '21',
    title: 'Meeting Minutes Automation',
    summary: 'Automatically transcribe meetings and generate structured minutes with action items.',
    industries: ['Corporate', 'Consulting', 'Legal'],
    functions: ['Administration', 'Operations'],
    estimatedCost: '$0.15 per meeting',
    savings: 'Save 2 hours per meeting',
    impactTag: 'Eliminates manual note-taking',
    workflowId: 'meeting-minutes',
    hoverMetric: 'Save 2 hours per meeting',
    dataSourcesUsed: ['Meeting Transcripts', 'Meeting Notes', 'Meeting Recording'],
    automationSteps: [
      'Real-time data ingestion from meeting channels',
      'Automatic transcription using GPT-4',
      'Minute generation and action item extraction',
      'Cultural fit analysis',
      'Bias detection and mitigation',
      'Candidate scoring and ranking',
      'Interview scheduling automation'
    ],
    realWorldExample: {
      company: 'Google Meeting Minutes',
      volume: '100,000 meetings monthly',
      timeSaved: '5,000 hours monthly',
      costReduction: '$100,000 annually'
    }
  }
];

const industries = ['All', 'Finance', 'Technology', 'Healthcare', 'E-commerce', 'Banking', 'Insurance', 'Manufacturing', 'SaaS', 'Retail'];
const functions = ['All', 'Operations', 'Finance', 'HR', 'Marketing', 'Support', 'Compliance', 'Sales', 'Analytics', 'Security'];

const UseCases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedFunction, setSelectedFunction] = useState('All');
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => prev + 1);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const filteredUseCases = useCases.filter(useCase => {
    const matchesSearch = useCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         useCase.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || 
                           useCase.industries.includes(selectedIndustry);
    const matchesFunction = selectedFunction === 'All' || 
                           useCase.functions.some(func => func.toLowerCase().includes(selectedFunction.toLowerCase()));
    
    return matchesSearch && matchesIndustry && matchesFunction;
  });

  const handleUseCaseClick = (useCase: UseCase) => {
    setSelectedUseCase(useCase);
  };

  const handleBackToOverview = () => {
    setSelectedUseCase(null);
  };

  const handleDeployWorkflow = (workflowId: string) => {
    // Store the selected workflow template in localStorage for the workflow builder
    localStorage.setItem('selectedWorkflowTemplate', workflowId);
    
    // Navigate to the workflow tab
    const event = new CustomEvent('navigate-to-workflow', { 
      detail: { workflowId } 
    });
    window.dispatchEvent(event);
    
    // If using React Router or similar, you might use:
    // navigate('/workflow-builder', { state: { templateId: workflowId } });
  };

  if (selectedUseCase) {
    return <UseCaseDetail useCase={selectedUseCase} onBack={handleBackToOverview} onDeploy={handleDeployWorkflow} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Automation Use Cases
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Real-world AI automation workflows with detailed data flows, cost breakdowns, and proven results. 
            Deploy pre-built workflows in minutes with complete implementation guides.
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Real Data Sources</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span>AI-Powered Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Instant Deployment</span>
            </div>
          </div>
        </div>

        {/* Featured Deployable Use Cases */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Ready-to-Deploy Workflows</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.filter(useCase => useCase.isDeployable).map((useCase) => (
              <FeaturedUseCaseCard 
                key={useCase.id} 
                useCase={useCase} 
                onDeploy={() => handleDeployWorkflow(useCase.workflowId!)}
                onClick={() => handleUseCaseClick(useCase)}
              />
            ))}
          </div>
        </div>

        {/* Auto-scrolling Carousel */}
        <div className="mb-8 overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Automation Examples</h2>
          <div className="relative">
            <div 
              className="flex gap-3 transition-transform duration-75 ease-linear"
              style={{
                transform: `translateX(-${(scrollPosition * 1.2) % (useCases.length * 250)}px)`,
                width: `${useCases.length * 500}px`
              }}
            >
              {[...useCases, ...useCases].map((useCase, index) => (
                <CarouselCard 
                  key={`${useCase.id}-${index}`} 
                  useCase={useCase} 
                  onClick={() => {
                    const targetElement = document.getElementById(`use-case-${useCase.id}`);
                    if (targetElement) {
                      targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search automation workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full md:w-48 h-11">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedFunction} onValueChange={setSelectedFunction}>
              <SelectTrigger className="w-full md:w-48 h-11">
                <SelectValue placeholder="Function" />
              </SelectTrigger>
              <SelectContent>
                {functions.map(func => (
                  <SelectItem key={func} value={func}>{func}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* All Use Cases Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Complete Use Case Library ({filteredUseCases.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUseCases.map((useCase) => (
              <div key={useCase.id} id={`use-case-${useCase.id}`}>
                <EnhancedUseCaseCard 
                  useCase={useCase} 
                  onClick={() => handleUseCaseClick(useCase)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeaturedUseCaseCardProps {
  useCase: UseCase;
  onDeploy: () => void;
  onClick: () => void;
}

const FeaturedUseCaseCard: React.FC<FeaturedUseCaseCardProps> = ({ useCase, onDeploy, onClick }) => {
  return (
    <Card className="h-full bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-green-100 text-green-800 border-green-300">Ready to Deploy</Badge>
          <Zap className="h-5 w-5 text-blue-600" />
        </div>
        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 cursor-pointer" onClick={onClick}>
          {useCase.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 line-clamp-2">
          {useCase.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-white rounded-lg p-2">
            <div className="font-semibold text-blue-600">{useCase.realWorldExample.volume}</div>
            <div className="text-gray-500">Volume</div>
          </div>
          <div className="bg-white rounded-lg p-2">
            <div className="font-semibold text-green-600">{useCase.realWorldExample.costReduction}</div>
            <div className="text-gray-500">Savings</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={onDeploy}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Zap className="mr-2 h-4 w-4" />
            Deploy Workflow
          </Button>
          <Button variant="outline" onClick={onClick} className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface CarouselCardProps {
  useCase: UseCase;
  onClick: () => void;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ useCase, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex-shrink-0 w-64 h-28 cursor-pointer transition-all duration-300 transform hover:scale-105"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="h-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-3 h-full flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">{useCase.title}</h3>
            <div className="flex flex-wrap gap-1">
              {useCase.dataSourcesUsed.slice(0, 2).map(source => (
                <Badge key={source} variant="secondary" className="text-xs">
                  {source}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className={`transition-all duration-300 ${isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-1'}`}>
            <div className="bg-blue-50 text-blue-700 rounded px-2 py-1">
              <p className="text-xs font-medium">{useCase.hoverMetric}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface EnhancedUseCaseCardProps {
  useCase: UseCase;
  onClick: () => void;
}

const EnhancedUseCaseCard: React.FC<EnhancedUseCaseCardProps> = ({ useCase, onClick }) => {
  return (
    <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white border border-gray-200" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          {useCase.isDeployable && (
            <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Deployable
            </Badge>
          )}
          <div className="flex items-center gap-1">
            <Database className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">{useCase.dataSourcesUsed.length} sources</span>
          </div>
        </div>
        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
          {useCase.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 line-clamp-3">
          {useCase.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data Sources */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Database className="h-3 w-3" />
            Data Sources
          </div>
          <div className="flex flex-wrap gap-1">
            {useCase.dataSourcesUsed.slice(0, 3).map((source) => (
              <Badge key={source} variant="secondary" className="text-xs">
                {source}
              </Badge>
            ))}
            {useCase.dataSourcesUsed.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{useCase.dataSourcesUsed.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Real World Impact */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="text-xs font-medium text-gray-700 mb-2">Real-World Impact</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="font-semibold text-blue-600">{useCase.realWorldExample.timeSaved}</div>
              <div className="text-gray-500">Time Saved</div>
            </div>
            <div>
              <div className="font-semibold text-green-600">{useCase.realWorldExample.costReduction}</div>
              <div className="text-gray-500">Cost Reduction</div>
            </div>
          </div>
          <div className="text-xs text-gray-600 italic">
            {useCase.realWorldExample.company}
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">{useCase.estimatedCost}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700">{useCase.savings}</span>
          </div>
        </div>

        {/* CTA */}
        <Button className="w-full mt-4" variant="default">
          <Bot className="mr-2 h-4 w-4" />
          Explore Automation
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default UseCases;
