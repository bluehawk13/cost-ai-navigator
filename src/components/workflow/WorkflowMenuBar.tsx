
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  File, 
  Edit, 
  Plus, 
  FolderOpen, 
  Trash2,
  Calendar,
  Layers
} from 'lucide-react';
import { useWorkflowOperations } from '@/hooks/workflow/useWorkflowOperations';
import { toast } from "@/hooks/use-toast";

interface WorkflowMenuBarProps {
  onNewWorkflow: () => void;
  onLoadWorkflow?: (workflowId: string) => void;
}

const WorkflowMenuBar = ({ onNewWorkflow, onLoadWorkflow }: WorkflowMenuBarProps) => {
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { workflows, loading, deleteWorkflow } = useWorkflowOperations();

  const handleLoadWorkflow = (workflowId: string) => {
    if (onLoadWorkflow) {
      onLoadWorkflow(workflowId);
    }
    setLoadDialogOpen(false);
  };

  const handleDeleteWorkflow = async (workflowId: string, workflowName: string) => {
    if (confirm(`Are you sure you want to delete "${workflowName}"? This action cannot be undone.`)) {
      await deleteWorkflow(workflowId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 1 week
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <>
      <div className="flex items-center space-x-1 bg-white border-b border-gray-200 px-4 py-2">
        {/* File Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-sm">
              <File className="h-4 w-4 mr-1" />
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg" align="start">
            <DropdownMenuItem 
              onClick={onNewWorkflow}
              className="cursor-pointer hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLoadDialogOpen(true)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Load Workflow
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Edit Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg" align="start">
            <DropdownMenuItem 
              onClick={() => setDeleteDialogOpen(true)}
              className="cursor-pointer hover:bg-gray-100 text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Workflows
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Load Workflow Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Load Workflow</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading workflows...</div>
            ) : workflows.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No saved workflows found</div>
            ) : (
              <div className="space-y-3">
                {workflows.map((workflow) => (
                  <Card key={workflow.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div 
                          className="flex-1 min-w-0"
                          onClick={() => handleLoadWorkflow(workflow.id)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900 truncate">{workflow.name}</h4>
                            <Badge variant="secondary">v{workflow.version}</Badge>
                          </div>
                          {workflow.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{workflow.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(workflow.updated_at)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Layers className="h-3 w-3" />
                              {workflow.metadata?.nodeCount || 0} components
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadWorkflow(workflow.id)}
                          className="ml-4"
                        >
                          Load
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Workflows Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Workflows</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading workflows...</div>
            ) : workflows.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No saved workflows found</div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Select workflows to delete. This action cannot be undone.
                </p>
                {workflows.map((workflow) => (
                  <Card key={workflow.id} className="border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900 truncate">{workflow.name}</h4>
                            <Badge variant="secondary">v{workflow.version}</Badge>
                          </div>
                          {workflow.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{workflow.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(workflow.updated_at)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Layers className="h-3 w-3" />
                              {workflow.metadata?.nodeCount || 0} components
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteWorkflow(workflow.id, workflow.name)}
                          className="ml-4"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkflowMenuBar;
