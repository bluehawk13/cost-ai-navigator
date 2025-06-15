
export const deployableWorkflowTemplates: Record<string, any> = {
  'basic-workflow': {
    name: 'Basic Workflow',
    description: 'A simple workflow template',
    nodes: [
      {
        id: '1',
        type: 'dataSource',
        subtype: 'file',
        position: { x: 100, y: 100 },
        data: { label: 'File Input' }
      },
      {
        id: '2',
        type: 'output',
        subtype: 'api',
        position: { x: 300, y: 100 },
        data: { label: 'API Output' }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: '1',
        target: '2'
      }
    ]
  }
};
