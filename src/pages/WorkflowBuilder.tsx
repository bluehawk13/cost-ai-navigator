
import React, { useState, useCallback, useMemo } from 'react';
import {
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import ComponentPalette from '@/components/workflow/ComponentPalette';
import WorkflowSidebar from '@/components/workflow/WorkflowSidebar';
import DataSourceNode from '@/components/workflow/nodes/DataSourceNode';
import AIModelNode from '@/components/workflow/nodes/AIModelNode';
import DatabaseNode from '@/components/workflow/nodes/DatabaseNode';
import LogicNode from '@/components/workflow/nodes/LogicNode';
import OutputNode from '@/components/workflow/nodes/OutputNode';

const nodeTypes: NodeTypes = {
  dataSource: DataSourceNode,
  aiModel: AIModelNode,
  database: DatabaseNode,
  logic: LogicNode,
  output: OutputNode,
};

const initialNodes: Node[] = [
  {
    id: 'welcome',
    type: 'dataSource',
    position: { x: 100, y: 100 },
    data: { 
      label: 'File Upload',
      subtype: 'file',
      config: { acceptedTypes: ['pdf', 'txt', 'csv'] }
    },
  },
];

const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | undefined>();

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

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addNode = useCallback((nodeType: string, subtype: string, label: string) => {
    const newNode: Node = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { 
        label,
        subtype,
        config: getDefaultConfig(nodeType, subtype)
      },
    };
    setNodes((nds) => [...nds, newNode]);
    
    toast({
      title: "Component Added",
      description: `Added ${label} to workflow`,
    });
  }, [setNodes]);

  const getDefaultConfig = (nodeType: string, subtype: string) => {
    const configs = {
      dataSource: {
        file: { acceptedTypes: ['pdf', 'txt', 'csv'], maxSize: '10MB' },
        api: { url: '', method: 'GET', headers: {} },
        scraper: { url: '', selector: '', frequency: 'daily' }
      },
      aiModel: {
        gpt4: { temperature: 0.7, maxTokens: 2000, model: 'gpt-4' },
        claude: { temperature: 0.7, maxTokens: 2000, model: 'claude-3-sonnet' },
        mistral: { temperature: 0.7, maxTokens: 2000, model: 'mistral-large' }
      },
      database: {
        postgres: { connectionString: '', table: '' },
        pinecone: { apiKey: '', index: '', dimension: 1536 },
        redis: { host: 'localhost', port: 6379, db: 0 }
      },
      logic: {
        filter: { conditions: [], operator: 'AND' },
        validate: { schema: {}, strict: true },
        transform: { script: '', language: 'javascript' }
      },
      output: {
        pdf: { template: '', format: 'A4' },
        email: { to: '', subject: '', template: '' },
        webhook: { url: '', method: 'POST', headers: {} }
      }
    };
    return configs[nodeType as keyof typeof configs]?.[subtype] || {};
  };

  const handleLoadWorkflow = useCallback((loadedNodes: Node[], loadedEdges: Edge[], workflowId: string) => {
    setNodes(loadedNodes);
    setEdges(loadedEdges);
    setCurrentWorkflowId(workflowId);
  }, [setNodes, setEdges]);

  const handleNewWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setCurrentWorkflowId(undefined);
    toast({
      title: "New Workflow",
      description: "Started a new workflow",
    });
  }, [setNodes, setEdges]);

  const nodeStats = useMemo(() => {
    const stats = {
      total: nodes.length,
      dataSource: 0,
      aiModel: 0,
      database: 0,
      logic: 0,
      output: 0
    };
    
    nodes.forEach(node => {
      if (node.type && node.type in stats) {
        stats[node.type as keyof typeof stats]++;
      }
    });
    
    return stats;
  }, [nodes]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Left Sidebar - Component Palette */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Component Palette</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {nodeStats.total} Total
            </Badge>
            <Badge variant="outline">
              {edges.length} Connections
            </Badge>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <ComponentPalette onAddNode={addNode} />
        </div>
      </div>

      {/* Main Workflow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
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
                default: return '#6b7280';
              }
            }}
            className="bg-white"
          />
        </ReactFlow>

        {/* Workflow Stats Overlay */}
        <Card className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Workflow Stats</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-600">Data Sources:</span>
                <span>{nodeStats.dataSource}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-600">AI Models:</span>
                <span>{nodeStats.aiModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Databases:</span>
                <span>{nodeStats.database}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-600">Logic:</span>
                <span>{nodeStats.logic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Outputs:</span>
                <span>{nodeStats.output}</span>
              </div>
              <div className="flex justify-between font-semibold pt-1 border-t">
                <span>Connections:</span>
                <span>{edges.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Workflow Management */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Workflow Management</h2>
        </div>
        <div className="p-4">
          <WorkflowSidebar
            nodes={nodes}
            edges={edges}
            currentWorkflowId={currentWorkflowId}
            onLoadWorkflow={handleLoadWorkflow}
            onNewWorkflow={handleNewWorkflow}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
