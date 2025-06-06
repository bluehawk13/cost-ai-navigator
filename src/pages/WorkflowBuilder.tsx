import React, { useState, useCallback } from 'react';
import {
  ReactFlowProvider,
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Connection,
  NodeTypes,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from "@/hooks/use-toast";
import { useWorkflows } from '@/hooks/useWorkflows';
import WorkflowTopNavigation from '@/components/workflow/WorkflowTopNavigation';
import EnhancedComponentPalette from '@/components/workflow/EnhancedComponentPalette';
import WorkflowActionsPanel from '@/components/workflow/WorkflowActionsPanel';
import DataSourceNode from '@/components/workflow/nodes/DataSourceNode';
import AIModelNode from '@/components/workflow/nodes/AIModelNode';
import DatabaseNode from '@/components/workflow/nodes/DatabaseNode';
import LogicNode from '@/components/workflow/nodes/LogicNode';
import OutputNode from '@/components/workflow/nodes/OutputNode';
import CloudProviderNode from '@/components/workflow/nodes/CloudProviderNode';

const nodeTypes: NodeTypes = {
  dataSource: DataSourceNode,
  aiModel: AIModelNode,
  database: DatabaseNode,
  logic: LogicNode,
  output: OutputNode,
  cloud: CloudProviderNode,
};

const WorkflowBuilderInner = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | undefined>();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [costEstimationTriggered, setCostEstimationTriggered] = useState(false);
  
  const { saveWorkflow, loadWorkflow } = useWorkflows();
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => {
      console.log('Connecting nodes:', params);
      setEdges((eds) => addEdge(params, eds));
      toast({
        title: "Nodes Connected",
        description: "Successfully connected workflow components",
      });
    },
    [setEdges]
  );

  const addNode = useCallback((nodeType: string, subtype: string, label: string, provider?: string) => {
    const newNode: Node = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType === 'cloud' ? 'cloud' : nodeType,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { 
        label,
        subtype,
        provider,
        config: getDefaultConfig(nodeType, subtype, provider)
      },
    };
    setNodes((nds) => [...nds, newNode]);
    
    toast({
      title: "Component Added",
      description: `Added ${label} to workflow`,
    });
  }, [setNodes]);

  const getDefaultConfig = (nodeType: string, subtype: string, provider?: string) => {
    const configs: Record<string, Record<string, any>> = {
      cloud: {
        aws: { region: 'us-east-1', service: '' },
        gcp: { region: 'us-central1', service: '' },
        azure: { region: 'East US', service: '' },
        oracle: { region: 'us-ashburn-1', service: '' }
      },
      aiModel: {
        openai: { model: '', maxTokens: 2000, temperature: 0.7 },
        anthropic: { model: '', maxTokens: 2000, temperature: 0.7 },
        mistral: { model: '', maxTokens: 2000, temperature: 0.7 },
        google: { model: '', maxTokens: 2000, temperature: 0.7 },
        meta: { model: '', maxTokens: 2000, temperature: 0.7 }
      },
      dataSource: {
        file: { acceptedTypes: ['pdf', 'txt', 'csv'], maxSize: '10MB' },
        api: { url: '', method: 'GET', headers: {} },
        scraper: { url: '', selector: '', frequency: 'daily' },
        'aws-lambda': { region: 'us-east-1', runtime: 'python3.9' },
        'aws-s3': { bucket: '', region: 'us-east-1' },
        'gcp-functions': { region: 'us-central1', runtime: 'python39' },
        'azure-blob': { account: '', container: '' }
      },
      database: {
        postgres: { connectionString: '', table: '' },
        pinecone: { apiKey: '', index: '', dimension: 1536 },
        redis: { host: 'localhost', port: 6379, db: 0 }
      },
      logic: {
        filter: { conditions: [], operator: 'AND' },
        validate: { schema: {}, strict: true },
        transform: { script: '', language: 'javascript' },
        branch: { conditions: [], defaultPath: 'continue' },
        python: { script: '', requirements: [] }
      },
      output: {
        pdf: { template: '', format: 'A4' },
        email: { to: '', subject: '', template: '' },
        webhook: { url: '', method: 'POST', headers: {} },
        slack: { channel: '', webhook: '' }
      }
    };
    
    if (provider && configs[nodeType]?.[provider]) {
      return configs[nodeType][provider];
    }
    
    return configs[nodeType]?.[subtype] || {};
  };

  const handleNewWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setCurrentWorkflowId(undefined);
    setCostEstimationTriggered(false);
  }, [setNodes, setEdges]);

  const handleSaveWorkflow = useCallback(async (name: string, description: string) => {
    try {
      const workflowId = await saveWorkflow({
        name,
        description,
        nodes,
        edges,
        workflowId: currentWorkflowId
      });
      if (workflowId && !currentWorkflowId) {
        setCurrentWorkflowId(workflowId);
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  }, [saveWorkflow, nodes, edges, currentWorkflowId]);

  const handleRunCostEstimation = useCallback(() => {
    setCostEstimationTriggered(true);
    toast({
      title: "Cost Estimation",
      description: "Running cost simulation across cloud providers...",
    });
  }, []);

  const handleExportJSON = useCallback(() => {
    const workflow = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
      })),
      metadata: {
        name: 'AI Workflow Export',
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        description: 'AI agent pipeline workflow'
      }
    };

    const blob = new Blob([JSON.stringify(workflow, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-workflow.json';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Workflow Exported",
      description: "Workflow saved as JSON file",
    });
  }, [nodes, edges]);

  const handleExportPDF = useCallback(() => {
    toast({
      title: "PDF Export",
      description: "Generating PDF report with cost breakdown...",
    });
  }, []);

  // Fit view when nodes change
  React.useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        fitView({ padding: 0.2 });
      }, 100);
    }
  }, [nodes.length, fitView]);

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navigation */}
      <WorkflowTopNavigation
        nodes={nodes}
        edges={edges}
        onNewWorkflow={handleNewWorkflow}
        onSaveWorkflow={() => handleSaveWorkflow('Untitled Workflow', '')}
        onExportJSON={handleExportJSON}
        onExportPDF={handleExportPDF}
        onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
        onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
        onRunCostEstimation={handleRunCostEstimation}
        leftSidebarOpen={leftSidebarOpen}
        rightSidebarOpen={rightSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Component Palette */}
        <EnhancedComponentPalette
          onAddNode={addNode}
          isCollapsed={!leftSidebarOpen}
        />

        {/* Main Canvas */}
        <div className="flex-1 relative bg-gray-50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            className="bg-gray-50"
          >
            <Background color="#e5e7eb" gap={16} />
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                switch (node.type) {
                  case 'dataSource': return '#3b82f6';
                  case 'aiModel': return '#8b5cf6';
                  case 'database': return '#10b981';
                  case 'logic': return '#f59e0b';
                  case 'output': return '#ef4444';
                  case 'cloud': return '#06b6d4';
                  default: return '#6b7280';
                }
              }}
              className="bg-white"
            />
          </ReactFlow>
        </div>

        {/* Right Sidebar - Actions Panel */}
        <WorkflowActionsPanel
          nodes={nodes}
          edges={edges}
          currentWorkflowId={currentWorkflowId}
          onSaveWorkflow={handleSaveWorkflow}
          isCollapsed={!rightSidebarOpen}
          costEstimationTriggered={costEstimationTriggered}
        />
      </div>
    </div>
  );
};

const WorkflowBuilder = () => {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner />
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;
