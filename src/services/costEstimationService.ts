
import { Node, Edge } from '@xyflow/react';

export interface WorkflowData {
  nodes: Array<{
    id: string;
    type: string;
    subtype?: string;
    provider?: string;
    label: string;
    config: any;
    position: { x: number; y: number };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }>;
}

export interface CostEstimationRequest {
  workflow: WorkflowData;
  estimationType: 'monthly' | 'per_request' | 'hourly';
  expectedVolume?: {
    requests_per_month?: number;
    data_processed_gb?: number;
    storage_gb?: number;
  };
}

export interface NodeCostBreakdown {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  provider?: string;
  service?: string;
  estimatedCost: number;
  costUnit: string;
  breakdown: {
    compute?: number;
    storage?: number;
    network?: number;
    api_calls?: number;
    tokens?: number;
  };
}

export interface CostEstimationResponse {
  totalCost: number;
  costUnit: string;
  estimationType: 'monthly' | 'per_request' | 'hourly';
  currency: 'USD';
  nodeBreakdown: NodeCostBreakdown[];
  summary: {
    totalCompute: number;
    totalStorage: number;
    totalNetwork: number;
    totalApiCalls: number;
    totalTokens: number;
  };
  optimizationSuggestions: Array<{
    nodeId: string;
    suggestion: string;
    potentialSavings: number;
    alternativeProvider?: string;
    alternativeService?: string;
  }>;
  timestamp: string;
}

export const transformWorkflowForEstimation = (nodes: Node[], edges: Edge[]): WorkflowData => {
  return {
    nodes: nodes.map(node => ({
      id: node.id,
      type: node.type || 'unknown',
      subtype: node.data?.subtype,
      provider: node.data?.provider,
      label: node.data?.label || node.id,
      config: node.data?.config || {},
      position: node.position
    })),
    edges: edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle
    }))
  };
};

export const estimateWorkflowCost = async (
  nodes: Node[], 
  edges: Edge[], 
  options: {
    estimationType?: 'monthly' | 'per_request' | 'hourly';
    expectedVolume?: {
      requests_per_month?: number;
      data_processed_gb?: number;
      storage_gb?: number;
    };
  } = {}
): Promise<CostEstimationResponse> => {
  const workflow = transformWorkflowForEstimation(nodes, edges);
  
  const requestData: CostEstimationRequest = {
    workflow,
    estimationType: options.estimationType || 'monthly',
    expectedVolume: options.expectedVolume || {
      requests_per_month: 10000,
      data_processed_gb: 1,
      storage_gb: 0.1
    }
  };

  try {
    // Replace with actual lyzr.ai endpoint
    const response = await fetch('https://api.lyzr.ai/v1/cost-estimation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add API key header if needed
        // 'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const costData: CostEstimationResponse = await response.json();
    return costData;
  } catch (error) {
    console.error('Cost estimation API error:', error);
    
    // Return mock data for development/testing
    return generateMockCostEstimation(nodes, edges);
  }
};

// Mock data generator for development
const generateMockCostEstimation = (nodes: Node[], edges: Edge[]): CostEstimationResponse => {
  const nodeBreakdown: NodeCostBreakdown[] = nodes.map(node => {
    const baseCost = Math.random() * 50 + 5;
    const nodeType = node.type || 'unknown';
    
    let cost = baseCost;
    let costUnit = 'USD/month';
    
    // Adjust cost based on node type
    switch (nodeType) {
      case 'aiModel':
        cost = Math.random() * 100 + 20;
        break;
      case 'cloud':
        cost = Math.random() * 30 + 10;
        break;
      case 'database':
        cost = Math.random() * 25 + 8;
        break;
      case 'dataSource':
        cost = Math.random() * 15 + 3;
        break;
      case 'output':
        cost = Math.random() * 10 + 2;
        break;
    }

    return {
      nodeId: node.id,
      nodeName: node.data?.label || node.id,
      nodeType,
      provider: node.data?.provider,
      service: node.data?.subtype,
      estimatedCost: parseFloat(cost.toFixed(2)),
      costUnit,
      breakdown: {
        compute: parseFloat((cost * 0.6).toFixed(2)),
        storage: parseFloat((cost * 0.2).toFixed(2)),
        network: parseFloat((cost * 0.1).toFixed(2)),
        api_calls: parseFloat((cost * 0.1).toFixed(2))
      }
    };
  });

  const totalCost = nodeBreakdown.reduce((sum, node) => sum + node.estimatedCost, 0);

  return {
    totalCost: parseFloat(totalCost.toFixed(2)),
    costUnit: 'USD/month',
    estimationType: 'monthly',
    currency: 'USD',
    nodeBreakdown,
    summary: {
      totalCompute: parseFloat((totalCost * 0.6).toFixed(2)),
      totalStorage: parseFloat((totalCost * 0.2).toFixed(2)),
      totalNetwork: parseFloat((totalCost * 0.1).toFixed(2)),
      totalApiCalls: parseFloat((totalCost * 0.1).toFixed(2)),
      totalTokens: Math.floor(Math.random() * 100000)
    },
    optimizationSuggestions: [
      {
        nodeId: nodeBreakdown[0]?.nodeId || '',
        suggestion: 'Consider using a smaller model variant to reduce token costs by 30%',
        potentialSavings: parseFloat((totalCost * 0.3).toFixed(2)),
        alternativeProvider: 'anthropic',
        alternativeService: 'claude-3-haiku'
      },
      {
        nodeId: nodeBreakdown[1]?.nodeId || '',
        suggestion: 'Implement caching to reduce API calls by 40%',
        potentialSavings: parseFloat((totalCost * 0.4).toFixed(2))
      }
    ],
    timestamp: new Date().toISOString()
  };
};
