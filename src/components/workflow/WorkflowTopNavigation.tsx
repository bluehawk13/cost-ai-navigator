
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { 
  FileText, 
  Save, 
  Download, 
  Calculator,
  Upload,
  PanelLeftClose,
  PanelRightClose,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Node, Edge } from '@xyflow/react';

interface WorkflowTopNavigationProps {
  nodes: Node[];
  edges: Edge[];
  onNewWorkflow: () => void;
  onSaveWorkflow: () => void;
  onExportJSON: () => void;
  onExportPDF: () => void;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  onRunCostEstimation: () => void;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
}

const WorkflowTopNavigation = ({
  nodes,
  edges,
  onNewWorkflow,
  onSaveWorkflow,
  onExportJSON,
  onExportPDF,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  onRunCostEstimation,
  leftSidebarOpen,
  rightSidebarOpen
}: WorkflowTopNavigationProps) => {
  const [templates] = useState([
    { 
      id: 'hr-automation', 
      name: 'HR Automation Pipeline', 
      description: 'Resume screening, candidate matching, and interview scheduling',
      nodes: [
        { id: 'resume-parser', type: 'dataSource', subtype: 'file', label: 'Resume Parser' },
        { id: 'skill-extractor', type: 'aiModel', subtype: 'gpt4', label: 'Skill Extractor' },
        { id: 'candidate-db', type: 'database', subtype: 'postgres', label: 'Candidate Database' },
        { id: 'email-notify', type: 'output', subtype: 'email', label: 'Email Notification' }
      ]
    },
    { 
      id: 'finance-analysis', 
      name: 'Finance Analysis Workflow', 
      description: 'Invoice processing, expense categorization, and financial reporting',
      nodes: [
        { id: 'invoice-upload', type: 'dataSource', subtype: 'file', label: 'Invoice Upload' },
        { id: 'ocr-processor', type: 'aiModel', subtype: 'gpt4', label: 'OCR Processor' },
        { id: 'expense-categorizer', type: 'logic', subtype: 'filter', label: 'Expense Categorizer' },
        { id: 'financial-db', type: 'database', subtype: 'postgres', label: 'Financial Database' },
        { id: 'report-generator', type: 'output', subtype: 'pdf', label: 'Report Generator' }
      ]
    },
    { 
      id: 'marketing-automation', 
      name: 'Marketing Content Pipeline', 
      description: 'Content generation, social media automation, and performance tracking',
      nodes: [
        { id: 'content-brief', type: 'dataSource', subtype: 'api', label: 'Content Brief API' },
        { id: 'content-generator', type: 'aiModel', subtype: 'gpt4', label: 'Content Generator' },
        { id: 'image-generator', type: 'aiModel', subtype: 'dall-e', label: 'Image Generator' },
        { id: 'social-scheduler', type: 'output', subtype: 'webhook', label: 'Social Scheduler' }
      ]
    },
    { 
      id: 'customer-support', 
      name: 'Customer Support Automation', 
      description: 'Ticket classification, automated responses, and escalation management',
      nodes: [
        { id: 'ticket-intake', type: 'dataSource', subtype: 'api', label: 'Ticket Intake' },
        { id: 'sentiment-analyzer', type: 'aiModel', subtype: 'claude', label: 'Sentiment Analyzer' },
        { id: 'response-generator', type: 'aiModel', subtype: 'gpt3.5', label: 'Response Generator' },
        { id: 'escalation-logic', type: 'logic', subtype: 'branch', label: 'Escalation Logic' },
        { id: 'ticket-db', type: 'database', subtype: 'postgres', label: 'Ticket Database' }
      ]
    },
    { 
      id: 'data-processing', 
      name: 'Data Processing Pipeline', 
      description: 'ETL operations, data validation, and analytics preparation',
      nodes: [
        { id: 'data-source', type: 'dataSource', subtype: 'api', label: 'Data Source' },
        { id: 'data-validator', type: 'logic', subtype: 'validate', label: 'Data Validator' },
        { id: 'data-transformer', type: 'logic', subtype: 'transform', label: 'Data Transformer' },
        { id: 'analytics-db', type: 'database', subtype: 'pinecone', label: 'Analytics Database' }
      ]
    }
  ]);

  const handleNewWorkflow = () => {
    onNewWorkflow();
    toast({
      title: "New Workflow",
      description: "Started a new workflow canvas",
    });
  };

  const handleSaveWorkflow = () => {
    onSaveWorkflow();
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const workflow = JSON.parse(e.target?.result as string);
            toast({
              title: "Workflow Imported",
              description: `Imported workflow: ${workflow.metadata?.name || 'Unnamed'}`,
            });
          } catch (error) {
            toast({
              title: "Import Error",
              description: "Invalid workflow file format",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // Here you would actually load the template nodes and edges
      // For now, just show a toast
      toast({
        title: "Template Loaded",
        description: `Loaded ${template.name} template`,
      });
    }
  };

  const handleExportTerraform = () => {
    const terraformConfig = generateTerraformConfig(nodes, edges);
    
    const blob = new Blob([terraformConfig], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow-infrastructure.tf';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Terraform Generated",
      description: "Infrastructure-as-code configuration downloaded",
    });
  };

  const generateTerraformConfig = (nodes: Node[], edges: Edge[]) => {
    let config = `# Generated Terraform configuration for AI Workflow
# Provider configuration
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "gcp_project_id" {
  description = "GCP project ID"
  type        = string
}

variable "gcp_region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

`;

    // Generate resources based on nodes
    nodes.forEach((node, index) => {
      switch (node.type) {
        case 'dataSource':
          if (node.data.subtype === 'aws-lambda') {
            config += `
# Lambda function for ${node.data.label}
resource "aws_lambda_function" "${node.id.replace('-', '_')}" {
  filename         = "function.zip"
  function_name    = "${node.id}"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "python3.9"
  
  tags = {
    Name = "${node.data.label}"
    Type = "DataSource"
  }
}
`;
          }
          break;
        case 'database':
          if (node.data.subtype === 'postgres') {
            config += `
# RDS PostgreSQL instance for ${node.data.label}
resource "aws_db_instance" "${node.id.replace('-', '_')}" {
  identifier     = "${node.id}"
  engine         = "postgres"
  engine_version = "14.9"
  instance_class = "db.t3.micro"
  allocated_storage = 20
  
  db_name  = "workflow_db"
  username = "admin"
  password = var.db_password
  
  tags = {
    Name = "${node.data.label}"
    Type = "Database"
  }
}
`;
          }
          break;
      }
    });

    config += `
# IAM role for Lambda functions
resource "aws_iam_role" "lambda_role" {
  name = "workflow_lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Output values
output "workflow_info" {
  value = {
    node_count = ${nodes.length}
    edge_count = ${edges.length}
    created_at = timestamp()
  }
}
`;

    return config;
  };

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left Section - Logo, Main Menu, and Sidebar Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">Workflow Builder</span>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </div>

        {/* Sidebar Toggle Buttons */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleLeftSidebar}
            className="h-8 w-8 p-0"
          >
            {leftSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleRightSidebar}
            className="h-8 w-8 p-0"
          >
            {rightSidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <Menubar className="border-none bg-transparent">
          {/* File Menu */}
          <MenubarMenu>
            <MenubarTrigger className="text-sm">File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleNewWorkflow}>
                New Workflow
                <MenubarShortcut>Ctrl+N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={handleSaveWorkflow}>
                Save to Supabase
                <MenubarShortcut>Ctrl+S</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={handleSaveWorkflow}>
                Save As Template
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={handleImportJSON}>
                Import JSON
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          {/* Templates Menu */}
          <MenubarMenu>
            <MenubarTrigger className="text-sm">Templates</MenubarTrigger>
            <MenubarContent>
              {templates.map((template) => (
                <MenubarItem 
                  key={template.id}
                  onClick={() => handleLoadTemplate(template.id)}
                >
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-gray-500">{template.description}</div>
                  </div>
                </MenubarItem>
              ))}
              <MenubarSeparator />
              <MenubarItem>
                Browse Community Templates
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          {/* Estimate Menu */}
          <MenubarMenu>
            <MenubarTrigger className="text-sm">Estimate</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={onRunCostEstimation}>
                <Calculator className="h-4 w-4 mr-2" />
                Run Cost Simulation
              </MenubarItem>
              <MenubarItem>
                Compare Providers
              </MenubarItem>
              <MenubarItem>
                Optimization Tips
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          {/* Export Menu */}
          <MenubarMenu>
            <MenubarTrigger className="text-sm">Export</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={onExportJSON}>
                <Download className="h-4 w-4 mr-2" />
                JSON Configuration
              </MenubarItem>
              <MenubarItem onClick={onExportPDF}>
                PDF Report
              </MenubarItem>
              <MenubarItem onClick={handleExportTerraform}>
                Terraform (IaC)
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Right Section - Quick Actions */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onRunCostEstimation}>
          <Calculator className="h-4 w-4 mr-1" />
          Estimate
        </Button>
        <Button variant="outline" size="sm" onClick={handleSaveWorkflow}>
          <Save className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WorkflowTopNavigation;
