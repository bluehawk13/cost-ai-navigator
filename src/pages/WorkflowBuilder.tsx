
import React, { useEffect, useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import EnhancedComponentPalette from '@/components/workflow/EnhancedComponentPalette';
import WorkflowMenuBar from '@/components/workflow/WorkflowMenuBar';
import WorkflowActionsPanel from '@/components/workflow/WorkflowActionsPanel';
import { nodeTypes } from '@/components/workflow/nodes';
import { useWorkflows } from '@/hooks/useWorkflows';
import { toast } from '@/hooks/use-toast';
import { deployableWorkflowTemplates } from '@/data/deployableWorkflowTemplates';

const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const { loadWorkflow } = useWorkflows();

  // Check for template loading on component mount
  useEffect(() => {
    const selectedTemplate = localStorage.getItem('selectedWorkflowTemplate');
    if (selectedTemplate && deployableWorkflowTemplates[selectedTemplate]) {
      loadWorkflowTemplate(selectedTemplate);
      localStorage.removeItem('selectedWorkflowTemplate'); // Clean up
    }
  }, []);

  const loadWorkflowTemplate = (templateId: string) => {
    const template = deployableWorkflowTemplates[templateId];
    if (!template) {
      toast({
        title: "Template Not Found",
        description: "The requested workflow template could not be loaded.",
        variant: "destructive",
      });
      return;
    }

    // Convert template to React Flow format
    const templateNodes = template.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        ...node.data,
        subtype: node.subtype,
      },
    }));

    const templateEdges = template.edges.map((edge) => ({
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

  const onConnect = (params: any) => {
    setEdges((eds) => addEdge(params, eds));
  };

  const onNodeClick = (_: any, node: any) => {
    setSelectedNode(node);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  const handleNewWorkflow = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    toast({
      title: "New Workflow",
      description: "Started a new workflow",
    });
  };

  const handleLoadWorkflow = async (workflowId: string) => {
    try {
      const result = await loadWorkflow(workflowId);
      if (result) {
        setNodes(result.nodes);
        setEdges(result.edges);
        setSelectedNode(null);
        toast({
          title: "Success",
          description: `Loaded workflow: ${result.workflow.name}`,
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

  const handleAddNode = (nodeType: string, subtype: string, label: string, provider?: string) => {
    const newNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label,
        subtype,
        provider: provider || null,
        config: {},
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Menu Bar */}
        <WorkflowMenuBar 
          onNewWorkflow={handleNewWorkflow}
          onLoadWorkflow={handleLoadWorkflow}
        />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Component Palette */}
          <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
            <EnhancedComponentPalette onAddNode={handleAddNode} />
          </div>

          {/* Workflow Canvas */}
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

          {/* Actions Panel */}
          <div className="w-96 bg-white border-l border-gray-200 flex-shrink-0">
            <WorkflowActionsPanel 
              selectedNode={selectedNode}
              nodes={nodes}
              edges={edges}
              onNodesChange={setNodes}
              onNewWorkflow={handleNewWorkflow}
            />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;
