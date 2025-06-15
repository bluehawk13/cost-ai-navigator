import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, 
  Plus, 
  Download, 
  FileText, 
  Play, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Upload,
  FolderOpen,
  Circle
} from 'lucide-react';
import { Node, Edge } from '@xyflow/react';
import { useWorkflows } from '@/hooks/useWorkflows';
import { toast } from "@/hooks/use-toast";

interface WorkflowTopNavigationProps {
  nodes: Node[];
  edges: Edge[];
  currentWorkflowName?: string;
  hasUnsavedChanges?: boolean;
  onNewWorkflow: () => void;
  onSaveWorkflow: (name: string, description: string) => void;
  onExportJSON: () => void;
  onExportPDF: () => void;
  onRunCostEstimation: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onLoadWorkflow: (workflowData: any) => void;
  onLoadWorkflowFromDB: (workflowId: string) => void;
}

const WorkflowTopNavigation = ({
  nodes,
  edges,
  currentWorkflowName = '',
  hasUnsavedChanges = false,
  onNewWorkflow,
  onSaveWorkflow,
  onExportJSON,
  onExportPDF,
  onRunCostEstimation,
  onZoomIn,
  onZoomOut,
  onFitView,
  onLoadWorkflow,
  onLoadWorkflowFromDB
}: WorkflowTopNavigationProps) => {
  const { workflows, loading } = useWorkflows();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState(currentWorkflowName);
  const [workflowDescription, setWorkflowDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setWorkflowName(currentWorkflowName);
  }, [currentWorkflowName]);

  const handleSaveWorkflow = async () => {
    if (!workflowName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workflow name",
        variant: "destructive",
      });
      return;
    }

    await onSaveWorkflow(workflowName, workflowDescription);
    setSaveDialogOpen(false);
    setWorkflowDescription('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflowData = JSON.parse(e.target?.result as string);
        onLoadWorkflow(workflowData);
        toast({
          title: "Workflow Loaded",
          description: "Workflow loaded from file",
        });
      } catch (error) {
        console.error("Error parsing JSON:", error);
        toast({
          title: "Error",
          description: "Failed to parse workflow file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    setLoadDialogOpen(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section - Workflow Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold text-gray-900">
              {currentWorkflowName || 'Untitled Workflow'}
            </h1>
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-1">
                <Circle className="w-2 h-2 fill-orange-500 text-orange-500" />
                <span className="text-xs text-orange-600">Unsaved changes</span>
              </div>
            )}
          </div>
          <Badge variant="secondary" className="text-xs">
            {nodes.length} components, {edges.length} connections
          </Badge>
        </div>

        {/* Center Section - Main Actions */}
        <div className="flex items-center space-x-2">
          <Button onClick={onNewWorkflow} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>

          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {currentWorkflowName ? 'Update' : 'Save'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {currentWorkflowName ? `Update "${currentWorkflowName}"` : 'Save Workflow'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    placeholder="Enter workflow name"
                  />
                  {currentWorkflowName && (
                    <p className="text-xs text-gray-500 mt-1">
                      This will update the existing workflow "{currentWorkflowName}"
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    placeholder="Enter workflow description (optional)"
                    rows={3}
                  />
                </div>
                <Button onClick={handleSaveWorkflow} className="w-full">
                  {currentWorkflowName ? 'Update Workflow' : 'Save Workflow'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderOpen className="h-4 w-4 mr-2" />
                Load
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Load Workflow</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="saved" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="saved">Saved Workflows</TabsTrigger>
                  <TabsTrigger value="file">From File</TabsTrigger>
                </TabsList>
                
                <TabsContent value="saved" className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">Loading workflows...</div>
                  ) : workflows.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No saved workflows found</div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {workflows.map((workflow) => (
                        <div key={workflow.id} className="border rounded-lg p-3 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium">{workflow.name}</h4>
                              {workflow.description && (
                                <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>Updated: {new Date(workflow.updated_at).toLocaleDateString()}</span>
                                <span>{workflow.metadata?.nodeCount || 0} components</span>
                              </div>
                            </div>
                            <Button
                              onClick={() => {
                                onLoadWorkflowFromDB(workflow.id);
                                setLoadDialogOpen(false);
                              }}
                              size="sm"
                            >
                              Load
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="file">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Upload a workflow JSON file to load a workflow.
                    </p>
                    <Button variant="outline" onClick={triggerFileInput}>
                      <Upload className="h-4 w-4 mr-2" />
                      Select File
                    </Button>
                    <Input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        {/* Right Section - Export, Run, and Zoom Controls */}
        <div className="flex items-center space-x-2">
          <Button onClick={onExportJSON} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button onClick={onExportPDF} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={onRunCostEstimation} size="sm">
            <Play className="h-4 w-4 mr-2" />
            Run Cost Estimation
          </Button>
          <Button onClick={onZoomIn} variant="outline" size="sm">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button onClick={onZoomOut} variant="outline" size="sm">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button onClick={onFitView} variant="outline" size="sm">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowTopNavigation;
