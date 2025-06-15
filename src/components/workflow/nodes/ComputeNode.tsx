
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Cpu, Server, Zap, DollarSign } from 'lucide-react';

const ComputeNode = ({ data, id }: { data: any; id: string }) => {
  const [runtime, setRuntime] = useState(data.config?.runtime || 'python3.9');
  const [memory, setMemory] = useState(data.config?.memory || '128MB');
  const [timeout, setTimeout] = useState(data.config?.timeout || '30s');

  useEffect(() => {
    if (data.onConfigChange) {
      data.onConfigChange(id, {
        ...data.config,
        runtime,
        memory,
        timeout
      });
    }
  }, [runtime, memory, timeout, id, data]);

  const getIcon = () => {
    switch (data.subtype) {
      case 'serverless': return <Zap className="h-4 w-4" />;
      case 'containers': return <Server className="h-4 w-4" />;
      case 'edge': return <Cpu className="h-4 w-4" />;
      default: return <Cpu className="h-4 w-4" />;
    }
  };

  const getRuntimeOptions = () => {
    if (data.subtype === 'serverless') {
      return [
        { value: 'python3.9', label: 'Python 3.9' },
        { value: 'python3.11', label: 'Python 3.11' },
        { value: 'node18', label: 'Node.js 18' },
        { value: 'node20', label: 'Node.js 20' },
        { value: 'java11', label: 'Java 11' },
        { value: 'java17', label: 'Java 17' },
        { value: 'dotnet6', label: '.NET 6' },
        { value: 'go1.19', label: 'Go 1.19' }
      ];
    }
    return [
      { value: 'ubuntu-20.04', label: 'Ubuntu 20.04' },
      { value: 'ubuntu-22.04', label: 'Ubuntu 22.04' },
      { value: 'alpine', label: 'Alpine Linux' },
      { value: 'custom', label: 'Custom Image' }
    ];
  };

  const getMemoryOptions = () => {
    if (data.subtype === 'serverless') {
      return [
        { value: '128MB', label: '128 MB', cost: '$0.0000000208/ms' },
        { value: '256MB', label: '256 MB', cost: '$0.0000000417/ms' },
        { value: '512MB', label: '512 MB', cost: '$0.0000000833/ms' },
        { value: '1GB', label: '1 GB', cost: '$0.0000001667/ms' },
        { value: '2GB', label: '2 GB', cost: '$0.0000003333/ms' },
        { value: '4GB', label: '4 GB', cost: '$0.0000006667/ms' }
      ];
    }
    return [
      { value: '0.5GB', label: '0.5 GB', cost: '$0.02/hour' },
      { value: '1GB', label: '1 GB', cost: '$0.04/hour' },
      { value: '2GB', label: '2 GB', cost: '$0.08/hour' },
      { value: '4GB', label: '4 GB', cost: '$0.16/hour' },
      { value: '8GB', label: '8 GB', cost: '$0.32/hour' }
    ];
  };

  const selectedMemory = getMemoryOptions().find(m => m.value === memory);

  return (
    <Card className="min-w-[280px] border-orange-200 bg-orange-50">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-orange-600">
            {getIcon()}
          </div>
          <span className="font-medium text-sm">{data.label}</span>
          <Badge variant="secondary" className="text-xs">
            Compute
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Runtime</label>
            <Select value={runtime} onValueChange={setRuntime}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select runtime" />
              </SelectTrigger>
              <SelectContent>
                {getRuntimeOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Memory</label>
            <Select value={memory} onValueChange={setMemory}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select memory" />
              </SelectTrigger>
              <SelectContent>
                {getMemoryOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-green-600">{option.cost}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {data.subtype === 'serverless' && (
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Timeout</label>
              <Input
                value={timeout}
                onChange={(e) => setTimeout(e.target.value)}
                placeholder="e.g., 30s, 5m"
                className="h-8 text-xs"
              />
            </div>
          )}
          
          <div className="text-xs text-gray-600 space-y-1 pt-2 border-t">
            <div className="flex items-center justify-between">
              <span>Type:</span>
              <span className="font-medium capitalize">{data.subtype}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Runtime:</span>
              <span className="font-medium">{runtime}</span>
            </div>
            <div className="flex items-center justify-between text-green-600">
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Cost:
              </span>
              <span className="font-medium">{selectedMemory?.cost || 'Variable'}</span>
            </div>
          </div>
        </div>

        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-orange-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-orange-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
};

export default ComputeNode;
