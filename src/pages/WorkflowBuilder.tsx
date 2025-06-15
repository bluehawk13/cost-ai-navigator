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
import { useUnsavedChanges } from '@/hooks/workflow/useUnsavedChanges';
import { exportWorkflowToPDF } from '@/services/pdfExportService';
import WorkflowTopNavigation from '@/components/workflow/WorkflowTopNavigation';
import EnhancedComponentPalette from '@/components/workflow/EnhancedComponentPalette';
import WorkflowActionsPanel from '@/components/workflow/WorkflowActionsPanel';
import DataSourceNode from '@/components/workflow/nodes/DataSourceNode';
import AIModelNode from '@/components/workflow/nodes/AIModelNode';
import DatabaseNode from '@/components/workflow/nodes/DatabaseNode';
import LogicNode from '@/components/workflow/nodes/LogicNode';
import OutputNode from '@/components/workflow/nodes/OutputNode';
import CloudProviderNode from '@/components/workflow/nodes/CloudProviderNode';
import ComputeNode from '@/components/workflow/nodes/ComputeNode';
import IntegrationNode from '@/components/workflow/nodes/IntegrationNode';

const nodeTypes: NodeTypes = {
  dataSource: DataSourceNode,
  aiModel: AIModelNode,
  database: DatabaseNode,
  logic: LogicNode,
  output: OutputNode,
  cloud: CloudProviderNode,
  compute: ComputeNode,
  integration: IntegrationNode,
};

const WorkflowBuilderInner = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | undefined>();
  const [currentWorkflowName, setCurrentWorkflowName] = useState<string>('');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [costEstimationCounter, setCostEstimationCounter] = useState(0);
  
  const { saveWorkflow, loadWorkflow } = useWorkflows();
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { hasUnsavedChanges, markAsChanged, markAsSaved } = useUnsavedChanges();

  const onConnect = useCallback(
    (params: Connection) => {
      console.log('Connecting nodes:', params);
      setEdges((eds) => addEdge(params, eds));
      markAsChanged();
      toast({
        title: "Nodes Connected",
        description: "Successfully connected workflow components",
      });
    },
    [setEdges, markAsChanged]
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
        description: '', // Initialize with empty description
        config: getDefaultConfig(nodeType, subtype, provider),
        onConfigChange: handleNodeConfigChange
      },
    };
    setNodes((nds) => [...nds, newNode]);
    markAsChanged();
    
    toast({
      title: "Component Added",
      description: `Added ${label} to workflow`,
    });
  }, [setNodes, markAsChanged]);

  const getDefaultConfig = (nodeType: string, subtype: string, provider?: string) => {
    const configs: Record<string, Record<string, any>> = {
      cloud: {
        aws: { 
          category: '', 
          service: '', 
          region: 'us-east-1', 
          instanceType: '',
          storage: { type: 'gp3', size: '20GB' }
        },
        gcp: { 
          category: '', 
          service: '', 
          region: 'us-central1', 
          instanceType: '',
          storage: { type: 'pd-standard', size: '20GB' }
        },
        azure: { 
          category: '', 
          service: '', 
          region: 'eastus', 
          instanceType: '',
          storage: { type: 'standard', size: '20GB' }
        },
        oracle: { 
          category: '', 
          service: '', 
          region: 'us-ashburn-1', 
          instanceType: '',
          storage: { type: 'standard', size: '20GB' }
        }
      },
      aiModel: {
        openai: { model: 'gpt-4o-mini', maxTokens: 2000, temperature: 0.7, costPerToken: 0.00015 },
        anthropic: { model: 'claude-3-haiku', maxTokens: 2000, temperature: 0.7, costPerToken: 0.00025 },
        mistral: { model: 'mistral-small', maxTokens: 2000, temperature: 0.7, costPerToken: 0.0002 },
        google: { model: 'gemini-1.5-flash', maxTokens: 2000, temperature: 0.7, costPerToken: 0.000125 },
        cohere: { model: 'command-r', maxTokens: 2000, temperature: 0.7, costPerToken: 0.0015 },
        huggingface: { model: 'meta-llama/Llama-2-7b-chat-hf', maxTokens: 2000, temperature: 0.7, costPerHour: 0.60 }
      },
      dataSource: {
        file: { acceptedTypes: ['pdf', 'txt', 'csv', 'docx', 'xlsx'], maxSize: '50MB', processingCost: 0.001 },
        api: { url: '', method: 'GET', headers: {}, rateLimitRpm: 1000, costPerRequest: 0.0001 },
        scraper: { url: '', selector: '', frequency: 'daily', proxyCost: 0.01, dataCost: 0.001 },
        database: { connectionString: '', query: '', syncFrequency: 'hourly', transferCost: 0.09 }
      },
      database: {
        postgres: { 
          hosting: 'self-hosted', 
          region: 'us-east-1', 
          instanceType: 'small',
          connections: 100,
          storage: '20GB'
        },
        mysql: { 
          hosting: 'self-hosted', 
          region: 'us-east-1', 
          instanceType: 'small',
          connections: 100,
          storage: '20GB'
        },
        mongodb: { 
          hosting: 'self-hosted', 
          region: 'us-east-1', 
          instanceType: 'small',
          connections: 100,
          storage: '20GB'
        },
        redis: { 
          hosting: 'self-hosted', 
          region: 'us-east-1', 
          instanceType: 'small',
          memory: '1GB',
          persistence: false
        },
        pinecone: { 
          hosting: 'pinecone-cloud', 
          index: '', 
          dimension: 1536, 
          pods: 1,
          replicas: 1
        },
        weaviate: { 
          hosting: 'self-hosted', 
          region: 'us-east-1', 
          instanceType: 'small',
          vectorizer: 'text2vec-openai'
        },
        chroma: { 
          hosting: 'self-hosted', 
          region: 'us-east-1', 
          instanceType: 'small',
          collections: 1
        }
      },
      compute: {
        serverless: { runtime: 'python3.9', memory: '128MB', timeout: '30s', costPerInvocation: 0.0000002 },
        containers: { image: '', cpu: '0.25', memory: '0.5GB', replicas: 1, costPerHour: 0.05 },
        edge: { locations: ['us-east', 'eu-west', 'ap-southeast'], latency: '<50ms', costPerRequest: 0.000001 }
      },
      logic: {
        filter: { conditions: [], operator: 'AND', processingCost: 0.000001 },
        transform: { script: '', language: 'javascript', processingCost: 0.000002 },
        branch: { conditions: [], defaultPath: 'continue', processingCost: 0.000001 },
        python: { script: '', requirements: [], runtime: 'python3.9', processingCost: 0.00001 },
        javascript: { script: '', packages: [], runtime: 'node18', processingCost: 0.00001 }
      },
      integration: {
        webhook: { url: '', method: 'POST', headers: {}, retries: 3, costPerRequest: 0.0001 },
        queue: { provider: 'aws-sqs', region: 'us-east-1', dlq: true, costPerMessage: 0.0000004 },
        streaming: { provider: 'kafka', partitions: 3, replication: 2, costPerMB: 0.10 }
      },
      output: {
        pdf: { template: '', format: 'A4', costPerPage: 0.01 },
        email: { provider: 'sendgrid', template: '', costPerEmail: 0.001 },
        slack: { channel: '', webhook: '', costPerMessage: 0.0001 },
        dashboard: { refreshRate: '30s', widgets: [], costPerView: 0.0001 },
        api: { format: 'json', schema: {}, rateLimitRpm: 1000, costPerRequest: 0.0001 }
      }
    };
    
    if (provider && configs[nodeType]?.[provider]) {
      return configs[nodeType][provider];
    }
    
    return configs[nodeType]?.[subtype] || {};
  };

  const handleNodeConfigChange = useCallback((nodeId: string, newConfig: any, description?: string) => {
    setNodes(nds =>
      nds.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              config: newConfig,
              description: description !== undefined ? description : node.data.description || ''
            }
          };
        }
        return node;
      })
    );
    markAsChanged();
  }, [setNodes, markAsChanged]);

  const handleNewWorkflow = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to create a new workflow?');
      if (!confirm) return;
    }

    setNodes([]);
    setEdges([]);
    setCurrentWorkflowId(undefined);
    setCurrentWorkflowName('');
    setCostEstimationCounter(0);
    markAsSaved();
    toast({
      title: "New Workflow",
      description: "Started a new workflow canvas",
    });
  }, [setNodes, setEdges, hasUnsavedChanges, markAsSaved]);

  const handleSaveWorkflow = useCallback(async (name: string, description: string) => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workflow name",
        variant: "destructive",
      });
      return;
    }

    if (nodes.length === 0) {
      toast({
        title: "Error", 
        description: "Cannot save an empty workflow. Please add some components first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const nodesToSave = nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          label: node.data?.label || node.type || 'Untitled',
          subtype: node.data?.subtype || '',
          provider: node.data?.provider || null,
          config: node.data?.config || {},
          description: node.data?.description || ''
        }
      }));

      const workflowId = await saveWorkflow({
        name,
        description,
        nodes: nodesToSave,
        edges,
        workflowId: currentWorkflowId
      });
      if (workflowId && !currentWorkflowId) {
        setCurrentWorkflowId(workflowId);
      }
      
      setCurrentWorkflowName(name);
      markAsSaved(); // Mark as saved after successful save
      
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  }, [saveWorkflow, nodes, edges, currentWorkflowId, markAsSaved]);

  const handleLoadWorkflow = useCallback(async (workflowId: string) => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to load a different workflow?');
      if (!confirm) return;
    }

    try {
      const result = await loadWorkflow(workflowId);
      if (result) {
        const restoredNodes = result.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onConfigChange: handleNodeConfigChange,
            label: node.data?.label || node.type || 'Untitled',
            subtype: node.data?.subtype || '',
            provider: node.data?.provider || null,
            config: node.data?.config || {},
            description: node.data?.description || '' // Restore description
          }
        }));
        
        setNodes(restoredNodes);
        setEdges(result.edges);
        setCurrentWorkflowId(workflowId);
        setCurrentWorkflowName(result.workflow.name);
        setCostEstimationCounter(0);
        markAsSaved();
        toast({
          title: "Success",
          description: `Loaded workflow: ${result.workflow.name}`,
        });
      }
    } catch (error) {
      console.error('Error loading workflow:', error);
    }
  }, [loadWorkflow, setNodes, setEdges, handleNodeConfigChange, hasUnsavedChanges, markAsSaved]);

  const handleLoadWorkflowData = useCallback((workflowData: any) => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to load this workflow?');
      if (!confirm) return;
    }

    if (workflowData.nodes) {
      const restoredNodes = workflowData.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onConfigChange: handleNodeConfigChange,
          label: node.data?.label || node.type || 'Untitled',
          subtype: node.data?.subtype || '',
          provider: node.data?.provider || null,
          config: node.data?.config || {},
          description: node.data?.description || '' // Restore description from templates
        }
      }));
      setNodes(restoredNodes);
    }
    if (workflowData.edges) {
      setEdges(workflowData.edges);
    }
    setCurrentWorkflowId(undefined);
    setCurrentWorkflowName('');
    setCostEstimationCounter(0);
    markAsSaved();
  }, [setNodes, setEdges, handleNodeConfigChange, hasUnsavedChanges, markAsSaved]);

  const handleRunCostEstimation = useCallback(() => {
    if (nodes.length === 0) {
      toast({
        title: "No Components",
        description: "Please add some workflow components before running cost estimation.",
        variant: "destructive",
      });
      return;
    }

    console.log('Cost estimation button clicked, incrementing counter from', costEstimationCounter);
    setCostEstimationCounter(prev => {
      const newValue = prev + 1;
      console.log('New cost estimation counter value:', newValue);
      return newValue;
    });
    toast({
      title: "Cost Estimation",
      description: "Running cost simulation across cloud providers...",
    });
  }, [costEstimationCounter, nodes.length]);

  const handleExportJSON = useCallback(() => {
    if (nodes.length === 0) {
      toast({
        title: "No Components",
        description: "Please add some workflow components before exporting.",
        variant: "destructive",
      });
      return;
    }

    const workflow = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          label: node.data?.label || node.type || 'Untitled',
          subtype: node.data?.subtype || '',
          provider: node.data?.provider || null,
          config: node.data?.config || {},
          description: node.data?.description || ''
        },
        style: node.style || {}
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
        style: edge.style || {}
      })),
      metadata: {
        name: 'AI Workflow Export',
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        description: 'AI agent pipeline workflow',
        nodeCount: nodes.length,
        edgeCount: edges.length
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
        currentWorkflowName={currentWorkflowName}
        hasUnsavedChanges={hasUnsavedChanges}
        onNewWorkflow={handleNewWorkflow}
        onSaveWorkflow={handleSaveWorkflow}
        onExportJSON={handleExportJSON}
        onExportPDF={handleExportPDF}
        onRunCostEstimation={handleRunCostEstimation}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitView={fitView}
        onLoadWorkflow={handleLoadWorkflowData}
        onLoadWorkflowFromDB={handleLoadWorkflow}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Component Palette */}
        <EnhancedComponentPalette
          onAddNode={addNode}
          isCollapsed={!leftSidebarOpen}
          onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
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
                  case 'compute': return '#f97316';
                  case 'integration': return '#6366f1';
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
          isCollapsed={!rightSidebarOpen}
          onToggle={() => setRightSidebarOpen(!rightSidebarOpen)}
          costEstimationCounter={costEstimationCounter}
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
