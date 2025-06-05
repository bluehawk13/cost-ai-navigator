
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Save, 
  Download, 
  DollarSign, 
  TrendingDown,
  PieChart,
  Clock,
  User,
  FileJson,
  FileText,
  Settings
} from 'lucide-react';
import { Node, Edge } from '@xyflow/react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, Tooltip, Pie } from 'recharts';

interface WorkflowActionsPanelProps {
  nodes: Node[];
  edges: Edge[];
  currentWorkflowId?: string;
  onSaveWorkflow: (name: string, description: string) => void;
  onExportJSON: () => void;
  onExportPDF: () => void;
  isCollapsed: boolean;
}

const WorkflowActionsPanel = ({ 
  nodes, 
  edges, 
  currentWorkflowId, 
  onSaveWorkflow,
  onExportJSON,
  onExportPDF,
  isCollapsed 
}: WorkflowActionsPanelProps) => {
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');

  // Calculate cost estimation
  const costEstimation = useMemo(() => {
    let totalCost = 0;
    let breakdown = {
      llm: 0,
      database: 0,
      compute: 0,
      storage: 0
    };

    nodes.forEach(node => {
      switch (node.type) {
        case 'aiModel':
          const llmCost = Math.random() * 50 + 10; // Simulated cost
          breakdown.llm += llmCost;
          totalCost += llmCost;
          break;
        case 'database':
          const dbCost = Math.random() * 20 + 5;
          breakdown.database += dbCost;
          totalCost += dbCost;
          break;
        case 'dataSource':
          const computeCost = Math.random() * 15 + 3;
          breakdown.compute += computeCost;
          totalCost += computeCost;
          break;
        case 'output':
          const storageCost = Math.random() * 5 + 1;
          breakdown.storage += storageCost;
          totalCost += storageCost;
          break;
      }
    });

    return { totalCost, breakdown };
  }, [nodes]);

  const pieData = [
    { name: 'LLM Costs', value: costEstimation.breakdown.llm, color: '#8b5cf6' },
    { name: 'Database', value: costEstimation.breakdown.database, color: '#10b981' },
    { name: 'Compute', value: costEstimation.breakdown.compute, color: '#3b82f6' },
    { name: 'Storage', value: costEstimation.breakdown.storage, color: '#f59e0b' }
  ];

  const optimizationTips = [
    "Switch to Claude Haiku to save 30% on LLM costs",
    "Use caching to reduce API calls by 40%",
    "Consider batch processing for better efficiency"
  ];

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-l border-gray-200 flex flex-col items-center py-4 space-y-4">
        <Save className="h-5 w-5 text-gray-600" />
        <DollarSign className="h-5 w-5 text-gray-600" />
        <Download className="h-5 w-5 text-gray-600" />
        <Settings className="h-5 w-5 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto">
      {/* Workflow Metadata */}
      <Card className="m-4 mb-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Workflow Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700">Name</label>
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="mt-1 h-8"
              placeholder="Enter workflow name"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Description</label>
            <Textarea
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              className="mt-1 h-16 text-xs"
              placeholder="Describe your workflow..."
            />
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last modified: Now
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Owner: You
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Estimator */}
      <Card className="m-4 mb-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Cost Estimation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              ${costEstimation.totalCost.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">per month (estimated)</div>
          </div>

          {/* Cost Breakdown Pie Chart */}
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={50}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `$${value.toFixed(2)}`} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Breakdown List */}
          <div className="space-y-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">${item.value.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Optimization Tips */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <TrendingDown className="h-3 w-3" />
              Optimization Tips
            </div>
            {optimizationTips.map((tip, index) => (
              <div key={index} className="text-xs text-gray-600 pl-5">
                • {tip}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card className="m-4 mb-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Export Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            onClick={() => onSaveWorkflow(workflowName, workflowDescription)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            Save to Supabase
          </Button>
          
          <Button onClick={onExportJSON} variant="outline" className="w-full" size="sm">
            <FileJson className="h-4 w-4 mr-2" />
            Download JSON
          </Button>
          
          <Button onClick={onExportPDF} variant="outline" className="w-full" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF Report
          </Button>
          
          <Button variant="outline" className="w-full" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Generate Terraform
          </Button>
        </CardContent>
      </Card>

      {/* Workflow Stats */}
      <Card className="m-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Workflow Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-bold text-lg">{nodes.length}</div>
              <div className="text-gray-600">Nodes</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-bold text-lg">{edges.length}</div>
              <div className="text-gray-600">Connections</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Completion</span>
              <span>85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowActionsPanel;
