
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  DollarSign, 
  TrendingDown,
  Clock,
  User,
  Settings,
  Calculator,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Edit2,
  Save
} from 'lucide-react';
import { Node, Edge } from '@xyflow/react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, Tooltip, Pie } from 'recharts';
import { estimateWorkflowCost, CostEstimationResponse, NodeCostBreakdown } from '@/services/costEstimationService';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";

interface WorkflowActionsPanelProps {
  nodes: Node[];
  edges: Edge[];
  currentWorkflowId?: string;
  isCollapsed: boolean;
  onToggle: () => void;
  costEstimationCounter: number;
  onSaveWorkflow?: (name: string, description: string) => void;
}

const WorkflowActionsPanel = ({ 
  nodes, 
  edges, 
  currentWorkflowId, 
  isCollapsed,
  onToggle,
  costEstimationCounter,
  onSaveWorkflow
}: WorkflowActionsPanelProps) => {
  const [costEstimation, setCostEstimation] = useState<CostEstimationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNodeBreakdown, setShowNodeBreakdown] = useState(false);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [lastEstimationCounter, setLastEstimationCounter] = useState(0);

  // Calculate cost estimation only when counter changes (button clicked) and only once per click
  React.useEffect(() => {
    if (costEstimationCounter > 0 && costEstimationCounter !== lastEstimationCounter && nodes.length > 0) {
      console.log('Running cost estimation for counter:', costEstimationCounter);
      setLastEstimationCounter(costEstimationCounter);
      setIsLoading(true);
      
      estimateWorkflowCost(nodes, edges)
        .then((estimation) => {
          setCostEstimation(estimation);
          console.log('Cost estimation received:', estimation);
        })
        .catch((error) => {
          console.error('Cost estimation failed:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [costEstimationCounter, lastEstimationCounter, nodes, edges]);

  const pieData = useMemo(() => {
    if (!costEstimation) return [];
    
    return [
      { name: 'Compute', value: costEstimation.summary.totalCompute, color: '#3b82f6' },
      { name: 'Storage', value: costEstimation.summary.totalStorage, color: '#10b981' },
      { name: 'Network', value: costEstimation.summary.totalNetwork, color: '#f59e0b' },
      { name: 'API Calls', value: costEstimation.summary.totalApiCalls, color: '#8b5cf6' }
    ].filter(item => item.value > 0);
  }, [costEstimation]);

  const handleSaveWorkflow = async () => {
    if (!workflowName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workflow name",
        variant: "destructive",
      });
      return;
    }

    if (onSaveWorkflow) {
      try {
        await onSaveWorkflow(workflowName, workflowDescription);
        toast({
          title: "Success",
          description: "Workflow saved successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save workflow",
          variant: "destructive",
        });
      }
    }
  };

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    setIsEditingName(false);
    if (workflowName.trim()) {
      toast({
        title: "Workflow Name Updated",
        description: `Name changed to "${workflowName}"`,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-2 border-b border-gray-200 flex justify-center">
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col items-center py-4 space-y-4">
          <DollarSign className="h-5 w-5 text-gray-600" />
          <Settings className="h-5 w-5 text-gray-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Actions Panel</h2>
        <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Workflow Name Section */}
      <Card className="m-4 mb-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Edit2 className="h-4 w-4" />
            Workflow Name
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <div className="flex-1 flex gap-2">
                <Input
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onBlur={handleNameSave}
                  className="text-sm"
                  autoFocus
                />
                <Button size="sm" onClick={handleNameSave}>
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm font-medium truncate">{workflowName}</span>
                <Button variant="ghost" size="sm" onClick={handleNameEdit} className="h-6 w-6 p-0">
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Description</label>
            <Input
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder="Add workflow description..."
              className="text-sm"
            />
          </div>
          {onSaveWorkflow && (
            <Button onClick={handleSaveWorkflow} size="sm" className="w-full">
              <Save className="h-4 w-4 mr-1" />
              Save Workflow
            </Button>
          )}
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
          {costEstimationCounter === 0 ? (
            <div className="text-center py-8">
              <Calculator className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500 mb-2">Cost estimation not calculated</p>
              <p className="text-xs text-gray-400">Click "Estimate" in the top navigation to calculate costs</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-500">Calculating costs...</p>
            </div>
          ) : costEstimation ? (
            <>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  ${costEstimation.totalCost.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">per month (estimated)</div>
              </div>

              {/* Cost Breakdown Pie Chart */}
              {pieData.length > 0 && (
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
              )}

              {/* Cost Breakdown List */}
              {pieData.length > 0 && (
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
              )}

              {/* Node-wise Cost Breakdown */}
              <Collapsible open={showNodeBreakdown} onOpenChange={setShowNodeBreakdown}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-gray-50 rounded text-xs font-medium">
                  <span>Node Cost Breakdown</span>
                  {showNodeBreakdown ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  {costEstimation.nodeBreakdown.map((nodeData) => (
                    <div key={nodeData.nodeId} className="p-2 border border-gray-200 rounded text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{nodeData.nodeName}</span>
                        <span className="text-green-600">${nodeData.estimatedCost}</span>
                      </div>
                      <div className="text-gray-500 text-xs">
                        <div>Type: {nodeData.nodeType}</div>
                        {nodeData.provider && <div>Provider: {nodeData.provider}</div>}
                        {nodeData.service && <div>Service: {nodeData.service}</div>}
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Optimization Tips */}
              {costEstimation.optimizationSuggestions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <TrendingDown className="h-3 w-3" />
                    Optimization Tips
                  </div>
                  {costEstimation.optimizationSuggestions.map((tip, index) => (
                    <div key={index} className="text-xs text-gray-600 pl-5 border-l-2 border-green-200">
                      <div>• {tip.suggestion}</div>
                      {tip.potentialSavings > 0 && (
                        <div className="text-green-600 font-medium">
                          Potential savings: ${tip.potentialSavings}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-red-500">Failed to calculate costs</p>
              <p className="text-xs text-gray-400">Please try again</p>
            </div>
          )}
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

          <div className="space-y-2 text-xs text-gray-500">
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
    </div>
  );
};

export default WorkflowActionsPanel;
