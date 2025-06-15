
import React, { useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import EnhancedComponentPalette from '@/components/workflow/EnhancedComponentPalette';
import WorkflowTopNavigation from '@/components/workflow/WorkflowTopNavigation';
import WorkflowActionsPanel from '@/components/workflow/WorkflowActionsPanel';
import { nodeTypes } from '@/components/workflow/nodes';
import { useWorkflows } from '@/hooks/useWorkflows';
import { toast } from '@/hooks/use-toast';
import { deployableWorkflowTemplates } from '@/data/deployableWorkflowTemplates';

const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [costEstimationCounter, setCostEstimationCounter] = useState(0);
  const [currentWorkflowName, setCurrentWorkflowName] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { saveWorkflow, loadWorkflow, loading } = useWorkflows();

  // Check for template loading on component mount
  useEffect(() => {
    const selectedTemplate = localStorage.getItem('selectedWorkflowTemplate');
    if (selectedTemplate && deployableWorkflowTemplates[selectedTemplate as keyof typeof deployableWorkflowTemplates]) {
      loadWorkflowTemplate(selectedTemplate);
      localStorage.removeItem('selectedWorkflowTemplate'); // Clean up
    }
  }, []);

  const loadWorkflowTemplate = (templateId: string) => {
    const template = deployableWorkflowTemplates[templateId as keyof typeof deployableWorkflowTemplates];
    if (!template) {
      toast({
        title: "Template Not Found",
        description: "The requested workflow template could not be loaded.",
        variant: "destructive",
      });
      return;
    }

    // Convert template to React Flow format
    const templateNodes: Node[] = template.nodes.map((node, index) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        ...node.data,
        subtype: node.subtype,
      },
    }));

    const templateEdges: Edge[] = template.edges.map((edge, index) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
    }));

    setNodes(templateNodes);
    setEdges(templateEdges);

    toast({
      title: "Template Loaded",
      description: `${template.name} workflow template has been loaded successfully.`,
    });
  };

  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  };

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  const handleAddNode = (nodeType: string, subtype: string, label: string, provider?: string) => {
    const newNode: Node = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { 
        label: label,
        subtype: subtype,
        provider: provider
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setHasUnsavedChanges(true);
  };

  const handleNewWorkflow = () => {
    setNodes([]);
    setEdges([]);
    setCurrentWorkflowName('');
    setHasUnsavedChanges(false);
  };

  const handleSaveWorkflow = async (name: string, description?: string) => {
    try {
      await saveWorkflow(nodes, edges, name, description);
      setCurrentWorkflowName(name);
      setHasUnsavedChanges(false);
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
  };

  const handleExportJSON = () => {
    const workflowData = {
      nodes,
      edges,
      name: currentWorkflowName || 'Untitled Workflow'
    };
    
    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentWorkflowName || 'workflow'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleExportPDF = () => {
    // PDF export logic will be handled by WorkflowTopNavigation
  };

  const handleRunCostEstimation = () => {
    setCostEstimationCounter(prev => prev + 1);
  };

  const handleZoomIn = () => {
    // Zoom functionality can be implemented later
  };

  const handleZoomOut = () => {
    // Zoom functionality can be implemented later
  };

  const handleFitView = () => {
    // Fit view functionality can be implemented later
  };

  const handleLoadWorkflow = (workflowData: any) => {
    if (workflowData.nodes) {
      setNodes(workflowData.nodes);
    }
    if (workflowData.edges) {
      setEdges(workflowData.edges);
    }
    setHasUnsavedChanges(false);
  };

  const handleLoadWorkflowFromDB = async (workflowId: string) => {
    try {
      const result = await loadWorkflow(workflowId);
      if (result) {
        setNodes(result.nodes);
        setEdges(result.edges);
        setHasUnsavedChanges(false);
        toast({
          title: "Success",
          description: "Workflow loaded successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load workflow",
        variant: "destructive",
      });
    }
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Top Navigation */}
        <WorkflowTopNavigation
          nodes={nodes}
          edges={edges}
          currentWorkflowName={currentWorkflowName}
          hasUnsavedChanges={hasUnsavedChanges}
          onNewWorkflow={handleNewWorkflow}
          onSaveWorkflow={handleSaveWorkflow}
          onExportJSON={handleExportJSON}
          onExportPDF={handleExportPDF}
          onRunCostEstimation={handleRunCostEstimation}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
          onLoadWorkflow={handleLoadWorkflow}
          onLoadWorkflowFromDB={handleLoadWorkflowFromDB}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Component Palette */}
          <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
            <EnhancedComponentPalette 
              onAddNode={handleAddNode}
              isCollapsed={false}
              onToggle={() => {}}
            />
          </div>

          {/* Main Canvas */}
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
              className="bg-gray-50"
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>

          {/* Right Sidebar - Actions Panel */}
          <div className="w-96 bg-white border-l border-gray-200 flex-shrink-0">
            <WorkflowActionsPanel
              nodes={nodes}
              edges={edges}
              isCollapsed={false}
              onToggle={() => {}}
              costEstimationCounter={costEstimationCounter}
            />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;
