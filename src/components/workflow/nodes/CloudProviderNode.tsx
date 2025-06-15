
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Server, Database, Network } from 'lucide-react';
import NodeDescription from './NodeDescription';

const CloudProviderNode = ({ data, id }: { data: any; id: string }) => {
  const [description, setDescription] = useState(data.description || '');

  useEffect(() => {
    if (data.onConfigChange) {
      data.onConfigChange(id, data.config || {}, description);
    }
  }, [description, id, data]);

  const getIcon = () => {
    const category = data.config?.category || '';
    switch (category) {
      case 'compute': return <Server className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'networking': return <Network className="h-4 w-4" />;
      default: return <Cloud className="h-4 w-4" />;
    }
  };

  const getProviderColor = () => {
    switch (data.provider) {
      case 'aws': return 'border-orange-200 bg-orange-50';
      case 'gcp': return 'border-blue-200 bg-blue-50';
      case 'azure': return 'border-blue-300 bg-blue-100';
      case 'oracle': return 'border-red-200 bg-red-50';
      default: return 'border-cyan-200 bg-cyan-50';
    }
  };

  const getIconColor = () => {
    switch (data.provider) {
      case 'aws': return 'text-orange-600';
      case 'gcp': return 'text-blue-600';
      case 'azure': return 'text-blue-700';
      case 'oracle': return 'text-red-600';
      default: return 'text-cyan-600';
    }
  };

  return (
    <Card className={`min-w-[200px] ${getProviderColor()}`}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className={getIconColor()}>
            {getIcon()}
          </div>
          <span className="font-medium text-sm">{data.label}</span>
          <Badge variant="secondary" className="text-xs">
            {data.provider?.toUpperCase() || 'Cloud'}
          </Badge>
        </div>
        
        <div className="text-xs text-gray-600 space-y-1">
          {data.config?.category && (
            <div>Category: {data.config.category}</div>
          )}
          {data.config?.service && (
            <div>Service: {data.config.service}</div>
          )}
          {data.config?.region && (
            <div>Region: {data.config.region}</div>
          )}
          {data.config?.instanceType && (
            <div>Instance: {data.config.instanceType}</div>
          )}
        </div>

        <NodeDescription
          description={description}
          onDescriptionChange={setDescription}
          placeholder="Describe this cloud infrastructure component..."
        />

        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-cyan-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-cyan-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
};

export default CloudProviderNode;
