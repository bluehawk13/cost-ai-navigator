
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
  workflow_description: string;
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

// Helper function to safely check if config has a property
const hasProperty = (obj: unknown, prop: string): boolean => {
  return obj !== null && obj !== undefined && typeof obj === 'object' && prop in obj;
};

// Helper function to safely get a property from config
const getConfigProperty = (config: unknown, prop: string): any => {
  if (hasProperty(config, prop)) {
    return (config as any)[prop];
  }
  return undefined;
};

const formatCloudNodeDetails = (node: Node) => {
  const config = node.data?.config || {};
  const provider = node.data?.provider || 'unknown';
  const category = getConfigProperty(config, 'category') || 'unspecified';
  const service = getConfigProperty(config, 'service') || 'unspecified';
  const region = getConfigProperty(config, 'region') || 'default';
  const instanceType = getConfigProperty(config, 'instanceType') || 'not specified';
  const storage = getConfigProperty(config, 'storage') || {};
  const pricingModel = getConfigProperty(config, 'pricingModel') || 'on-demand';
  const autoScaling = getConfigProperty(config, 'autoScaling') || {};
  const description = node.data?.description || 'No description provided';
  
  let details = `${typeof provider === 'string' ? provider.toUpperCase() : String(provider).toUpperCase()} ${category} service: ${service}`;
  details += ` | Region: ${region}`;
  details += ` | Pricing: ${pricingModel}`;
  
  if (instanceType !== 'not specified') {
    details += ` | Instance: ${instanceType}`;
  }
  
  if (storage.type) {
    details += ` | Storage: ${storage.type} ${storage.size || ''}`;
  }
  
  if (autoScaling.enabled) {
    details += ` | Auto-scaling: ${autoScaling.minInstances}-${autoScaling.maxInstances} instances`;
  }
  
  details += ` | Description: "${description}"`;
  
  return details;
};

const formatAIModelDetails = (node: Node) => {
  const config = node.data?.config || {};
  const provider = node.data?.provider || 'unknown';
  const model = getConfigProperty(config, 'model') || 'unspecified';
  const maxTokens = getConfigProperty(config, 'maxTokens') || 'default';
  const temperature = getConfigProperty(config, 'temperature') || 0.7;
  const costPerToken = getConfigProperty(config, 'costPerToken') || 0;
  const costPerHour = getConfigProperty(config, 'costPerHour') || 0;
  const description = node.data?.description || 'No description provided';
  
  let details = `${typeof provider === 'string' ? provider.toUpperCase() : String(provider).toUpperCase()} AI Model: ${model}`;
  details += ` | Max Tokens: ${maxTokens}`;
  details += ` | Temperature: ${temperature}`;
  
  if (costPerToken > 0) {
    details += ` | Cost per Token: $${costPerToken}`;
  }
  if (costPerHour > 0) {
    details += ` | Cost per Hour: $${costPerHour}`;
  }
  
  details += ` | Description: "${description}"`;
  
  return details;
};

const formatDataSourceDetails = (node: Node) => {
  const config = node.data?.config || {};
  const subtype = node.data?.subtype || 'unknown';
  const description = node.data?.description || 'No description provided';
  
  let details = `Data Source (${subtype})`;
  
  switch (subtype) {
    case 'file':
      const acceptedTypes = getConfigProperty(config, 'acceptedTypes') || [];
      const maxSize = getConfigProperty(config, 'maxSize') || 'unlimited';
      details += ` | File types: ${acceptedTypes.join(', ')} | Max size: ${maxSize}`;
      break;
    case 'api':
      const url = getConfigProperty(config, 'url') || 'not configured';
      const method = getConfigProperty(config, 'method') || 'GET';
      const rateLimitRpm = getConfigProperty(config, 'rateLimitRpm') || 'unlimited';
      details += ` | URL: ${url} | Method: ${method} | Rate limit: ${rateLimitRpm} RPM`;
      break;
    case 'scraper':
      const scraperUrl = getConfigProperty(config, 'url') || 'not configured';
      const frequency = getConfigProperty(config, 'frequency') || 'daily';
      details += ` | URL: ${scraperUrl} | Frequency: ${frequency}`;
      break;
    case 'database':
      const syncFrequency = getConfigProperty(config, 'syncFrequency') || 'hourly';
      details += ` | Sync frequency: ${syncFrequency}`;
      break;
  }
  
  details += ` | Description: "${description}"`;
  
  return details;
};

const formatDatabaseDetails = (node: Node) => {
  const config = node.data?.config || {};
  const subtype = node.data?.subtype || 'unknown';
  const hosting = getConfigProperty(config, 'hosting') || 'self-hosted';
  const region = getConfigProperty(config, 'region') || 'default';
  const instanceType = getConfigProperty(config, 'instanceType') || 'small';
  const storage = getConfigProperty(config, 'storage') || 'default';
  const connections = getConfigProperty(config, 'connections') || 100;
  const description = node.data?.description || 'No description provided';
  
  let details = `Database (${typeof subtype === 'string' ? subtype.toUpperCase() : String(subtype).toUpperCase()})`;
  details += ` | Hosting: ${hosting}`;
  details += ` | Region: ${region}`;
  details += ` | Instance: ${instanceType}`;
  details += ` | Storage: ${storage}`;
  details += ` | Max connections: ${connections}`;
  
  // Add specific details for vector databases
  if (subtype === 'pinecone') {
    const dimension = getConfigProperty(config, 'dimension') || 1536;
    const pods = getConfigProperty(config, 'pods') || 1;
    details += ` | Dimensions: ${dimension} | Pods: ${pods}`;
  }
  
  details += ` | Description: "${description}"`;
  
  return details;
};

const formatComputeDetails = (node: Node) => {
  const config = node.data?.config || {};
  const subtype = node.data?.subtype || 'unknown';
  const description = node.data?.description || 'No description provided';
  
  let details = `Compute (${subtype})`;
  
  switch (subtype) {
    case 'serverless':
      const runtime = getConfigProperty(config, 'runtime') || 'python3.9';
      const memory = getConfigProperty(config, 'memory') || '128MB';
      const timeout = getConfigProperty(config, 'timeout') || '30s';
      details += ` | Runtime: ${runtime} | Memory: ${memory} | Timeout: ${timeout}`;
      break;
    case 'containers':
      const cpu = getConfigProperty(config, 'cpu') || '0.25';
      const containerMemory = getConfigProperty(config, 'memory') || '0.5GB';
      const replicas = getConfigProperty(config, 'replicas') || 1;
      details += ` | CPU: ${cpu} | Memory: ${containerMemory} | Replicas: ${replicas}`;
      break;
    case 'edge':
      const locations = getConfigProperty(config, 'locations') || [];
      const latency = getConfigProperty(config, 'latency') || '<50ms';
      details += ` | Locations: ${locations.join(', ')} | Latency: ${latency}`;
      break;
  }
  
  details += ` | Description: "${description}"`;
  
  return details;
};

const formatLogicDetails = (node: Node) => {
  const config = node.data?.config || {};
  const subtype = node.data?.subtype || 'unknown';
  const description = node.data?.description || 'No description provided';
  
  let details = `Logic (${subtype})`;
  
  switch (subtype) {
    case 'filter':
      const conditions = getConfigProperty(config, 'conditions') || [];
      const operator = getConfigProperty(config, 'operator') || 'AND';
      details += ` | Conditions: ${conditions.length} | Operator: ${operator}`;
      break;
    case 'transform':
      const language = getConfigProperty(config, 'language') || 'javascript';
      details += ` | Language: ${language}`;
      break;
    case 'python':
    case 'javascript':
      const runtime = getConfigProperty(config, 'runtime') || `${subtype}3.9`;
      const packages = getConfigProperty(config, 'requirements') || getConfigProperty(config, 'packages') || [];
      details += ` | Runtime: ${runtime} | Packages: ${packages.length}`;
      break;
  }
  
  details += ` | Description: "${description}"`;
  
  return details;
};

const formatIntegrationDetails = (node: Node) => {
  const config = node.data?.config || {};
  const subtype = node.data?.subtype || 'unknown';
  const description = node.data?.description || 'No description provided';
  
  let details = `Integration (${subtype})`;
  
  switch (subtype) {
    case 'webhook':
      const url = getConfigProperty(config, 'url') || 'not configured';
      const method = getConfigProperty(config, 'method') || 'POST';
      const retries = getConfigProperty(config, 'retries') || 3;
      details += ` | URL: ${url} | Method: ${method} | Retries: ${retries}`;
      break;
    case 'queue':
      const provider = getConfigProperty(config, 'provider') || 'aws-sqs';
      const region = getConfigProperty(config, 'region') || 'us-east-1';
      details += ` | Provider: ${provider} | Region: ${region}`;
      break;
    case 'streaming':
      const streamProvider = getConfigProperty(config, 'provider') || 'kafka';
      const partitions = getConfigProperty(config, 'partitions') || 3;
      details += ` | Provider: ${streamProvider} | Partitions: ${partitions}`;
      break;
  }
  
  details += ` | Description: "${description}"`;
  
  return details;
};

const formatOutputDetails = (node: Node) => {
  const config = node.data?.config || {};
  const subtype = node.data?.subtype || 'unknown';
  const description = node.data?.description || 'No description provided';
  
  let details = `Output (${subtype})`;
  
  switch (subtype) {
    case 'pdf':
      const format = getConfigProperty(config, 'format') || 'A4';
      details += ` | Format: ${format}`;
      break;
    case 'email':
      const emailProvider = getConfigProperty(config, 'provider') || 'sendgrid';
      details += ` | Provider: ${emailProvider}`;
      break;
    case 'slack':
      const channel = getConfigProperty(config, 'channel') || 'not configured';
      details += ` | Channel: ${channel}`;
      break;
    case 'dashboard':
      const refreshRate = getConfigProperty(config, 'refreshRate') || '30s';
      const widgets = getConfigProperty(config, 'widgets') || [];
      details += ` | Refresh: ${refreshRate} | Widgets: ${widgets.length}`;
      break;
    case 'api':
      const apiFormat = getConfigProperty(config, 'format') || 'json';
      const rateLimitRpm = getConfigProperty(config, 'rateLimitRpm') || 1000;
      details += ` | Format: ${apiFormat} | Rate limit: ${rateLimitRpm} RPM`;
      break;
  }
  
  details += ` | Description: "${description}"`;
  
  return details;
};

const formatConnectionDetails = (edges: Edge[], nodes: Node[]): string => {
  if (edges.length === 0) {
    return "No connections established between components.";
  }

  let connectionDetails = `WORKFLOW CONNECTIONS (${edges.length} total):\n`;
  connectionDetails += "=" .repeat(50) + "\n";

  edges.forEach((edge, index) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    const sourceName = sourceNode?.data?.label || edge.source;
    const targetName = targetNode?.data?.label || edge.target;
    const sourceType = sourceNode?.type || 'unknown';
    const targetType = targetNode?.type || 'unknown';
    
    connectionDetails += `${index + 1}. DATA FLOW: "${sourceName}" (${sourceType}) → "${targetName}" (${targetType})\n`;
    connectionDetails += `   Connection ID: ${edge.id}\n`;
    
    if (edge.sourceHandle) {
      connectionDetails += `   Source Handle: ${edge.sourceHandle}\n`;
    }
    if (edge.targetHandle) {
      connectionDetails += `   Target Handle: ${edge.targetHandle}\n`;
    }
    
    connectionDetails += `   Flow Direction: Data flows from ${sourceName} to ${targetName}\n\n`;
  });

  return connectionDetails;
};

export const createWorkflowDescription = (nodes: Node[], edges: Edge[] = []): string => {
  if (nodes.length === 0) {
    return "Empty workflow with no components.";
  }

  let description = "COMPREHENSIVE AI WORKFLOW PIPELINE COST ESTIMATION REQUEST\n\n";
  description += `WORKFLOW OVERVIEW:\n`;
  description += "=" .repeat(50) + "\n";
  description += `Total Components: ${nodes.length} nodes\n`;
  description += `Total Connections: ${edges.length} edges\n`;
  description += `Workflow Complexity: ${edges.length > 5 ? 'High' : edges.length > 2 ? 'Medium' : 'Low'}\n\n`;

  // Add connection details first for better context
  description += formatConnectionDetails(edges, nodes);

  description += "DETAILED COMPONENT BREAKDOWN WITH FULL CONFIGURATION:\n";
  description += "=" .repeat(60) + "\n\n";

  // Group nodes by type for better organization
  const nodesByType: Record<string, Node[]> = {};
  nodes.forEach(node => {
    const nodeType = node.type || 'unknown';
    if (!nodesByType[nodeType]) {
      nodesByType[nodeType] = [];
    }
    nodesByType[nodeType].push(node);
  });

  // Process each node type with comprehensive details
  Object.entries(nodesByType).forEach(([nodeType, nodeList]) => {
    description += `${nodeType.toUpperCase()} COMPONENTS (${nodeList.length}):\n`;
    description += "-" .repeat(40) + "\n";
    
    nodeList.forEach((node, index) => {
      const label = typeof node.data?.label === 'string' ? node.data.label : node.id;
      description += `${index + 1}. COMPONENT: "${label}" (Node ID: ${node.id})\n`;
      
      let nodeDetails = '';
      switch (nodeType) {
        case 'cloud':
          nodeDetails = formatCloudNodeDetails(node);
          break;
        case 'aiModel':
          nodeDetails = formatAIModelDetails(node);
          break;
        case 'dataSource':
          nodeDetails = formatDataSourceDetails(node);
          break;
        case 'database':
          nodeDetails = formatDatabaseDetails(node);
          break;
        case 'compute':
          nodeDetails = formatComputeDetails(node);
          break;
        case 'logic':
          nodeDetails = formatLogicDetails(node);
          break;
        case 'integration':
          nodeDetails = formatIntegrationDetails(node);
          break;
        case 'output':
          nodeDetails = formatOutputDetails(node);
          break;
        default:
          const description = node.data?.description || 'No description provided';
          nodeDetails = `Component type: ${nodeType}`;
          if (node.data?.subtype) {
            nodeDetails += ` | Subtype: ${node.data.subtype}`;
          }
          if (node.data?.provider) {
            nodeDetails += ` | Provider: ${node.data.provider}`;
          }
          nodeDetails += ` | Description: "${description}"`;
      }
      
      description += `   FULL CONFIGURATION: ${nodeDetails}\n`;
      description += `   CANVAS POSITION: (X: ${node.position.x}, Y: ${node.position.y})\n`;
      
      // Add configuration object details if available
      if (node.data?.config && Object.keys(node.data.config).length > 0) {
        description += `   DETAILED CONFIG:\n`;
        Object.entries(node.data.config).forEach(([key, value]) => {
          description += `     - ${key}: ${JSON.stringify(value)}\n`;
        });
      }
      
      description += "\n";
    });
  });

  description += "DATA FLOW ANALYSIS:\n";
  description += "=" .repeat(50) + "\n";
  
  // Analyze data flow patterns
  const sourceNodes = nodes.filter(node => 
    !edges.some(edge => edge.target === node.id) && 
    edges.some(edge => edge.source === node.id)
  );
  const sinkNodes = nodes.filter(node => 
    edges.some(edge => edge.target === node.id) && 
    !edges.some(edge => edge.source === node.id)
  );
  const processingNodes = nodes.filter(node => 
    edges.some(edge => edge.target === node.id) && 
    edges.some(edge => edge.source === node.id)
  );

  description += `Data Entry Points: ${sourceNodes.length} (${sourceNodes.map(n => n.data?.label || n.id).join(', ')})\n`;
  description += `Processing Components: ${processingNodes.length} (${processingNodes.map(n => n.data?.label || n.id).join(', ')})\n`;
  description += `Output Destinations: ${sinkNodes.length} (${sinkNodes.map(n => n.data?.label || n.id).join(', ')})\n\n`;

  description += "COST ESTIMATION REQUIREMENTS:\n";
  description += "=" .repeat(50) + "\n";
  description += "Based on the comprehensive workflow analysis above, provide detailed cost estimates including:\n\n";
  description += "REQUIRED COST BREAKDOWN:\n";
  description += "• Individual component operational costs with detailed breakdown (compute, storage, network, API calls, tokens)\n";
  description += "• Data transfer costs between connected components\n";
  description += "• Total monthly workflow operating costs\n";
  description += "• Peak usage vs average usage cost projections\n";
  description += "• Regional cost variations for multi-region deployments\n\n";
  
  description += "OPTIMIZATION ANALYSIS:\n";
  description += "• Identify cost optimization opportunities for each component\n";
  description += "• Alternative provider/service suggestions with cost comparisons\n";
  description += "• Scaling cost projections (10x, 100x current volume)\n";
  description += "• Reserved instance vs on-demand cost analysis\n";
  description += "• Auto-scaling cost impact analysis\n\n";

  description += "ESTIMATION PARAMETERS:\n";
  description += "• Monthly usage volume: 10,000 workflow executions\n";
  description += "• Average data processing: 1GB per execution\n";
  description += "• Storage requirements: 100GB persistent + 50GB temporary\n";
  description += "• Operating schedule: 24/7 production environment\n";
  description += "• High availability requirements: 99.9% uptime SLA\n";
  description += "• Security compliance: Enterprise-grade encryption\n\n";

  description += "Please analyze this comprehensive workflow configuration and provide accurate, detailed cost estimates based on current cloud provider pricing models and the specific component configurations outlined above.";

  return description;
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
  const workflowDescription = createWorkflowDescription(nodes, edges);
  
  const requestData: CostEstimationRequest = {
    workflow_description: workflowDescription,
    estimationType: options.estimationType || 'monthly',
    expectedVolume: options.expectedVolume || {
      requests_per_month: 10000,
      data_processed_gb: 1,
      storage_gb: 0.1
    }
  };

  try {
    console.log('Sending comprehensive cost estimation request with detailed workflow data:', workflowDescription);
    
    const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'sk-default-gLsaQsiInbLlKDdFTxKqVtaBvrSIeTIk'
        },
        body: JSON.stringify({
            user_id: 'reddyjaswanth361@gmail.com',
            agent_id: '6846bcf1e49ec5e8feda577d',
            session_id: '6846bcf1e49ec5e8feda577d-7spmfclhbej',
            message: JSON.stringify(requestData)
        })
      });
    console.log(response);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    const responseJson = await response.json();
    const costData: CostEstimationResponse = JSON.parse(responseJson.response); 
    return costData;
  } catch (error) {
    console.error('Cost estimation API error:', error);
    console.log('Using mock data for development');
    
    return generateMockCostEstimation(nodes, edges);
  }
};

// Mock data generator for development
const generateMockCostEstimation = (nodes: Node[], edges: Edge[]): CostEstimationResponse => {
  const nodeBreakdown: NodeCostBreakdown[] = nodes.map(node => {
    const baseCost = Math.random() * 50 + 5;
    const nodeType = node.type || 'unknown';
    const provider = typeof node.data?.provider === 'string' ? node.data.provider : undefined;
    const subtype = typeof node.data?.subtype === 'string' ? node.data.subtype : undefined;
    const config = node.data?.config || {};
    
    let cost = baseCost;
    let costUnit = 'USD/month';
    
    // Adjust cost based on node type and configuration
    switch (nodeType) {
      case 'aiModel':
        const maxTokens = getConfigProperty(config, 'maxTokens');
        if (maxTokens && typeof maxTokens === 'number') {
          cost = (maxTokens / 1000) * 0.002;
        } else {
          cost = Math.random() * 100 + 20;
        }
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
      nodeName: typeof node.data?.label === 'string' ? node.data.label : node.id,
      nodeType,
      provider,
      service: subtype,
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
