
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Brain, Cpu } from 'lucide-react';

const AIModelNode = ({ data }: { data: any }) => {
  const getIcon = () => {
    switch (data.subtype) {
      case 'gpt4': return <Bot className="h-4 w-4" />;
      case 'claude': return <Brain className="h-4 w-4" />;
      case 'mistral': return <Cpu className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  return (
    <Card className="min-w-[200px] border-purple-200 bg-purple-50">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-purple-600">
            {getIcon()}
          </div>
          <span className="font-medium text-sm">{data.label}</span>
          <Badge variant="secondary" className="text-xs">
            AI Model
          </Badge>
        </div>
        
        <div className="text-xs text-gray-600 space-y-1">
          <div>Temperature: {data.config?.temperature || 0.7}</div>
          <div>Max Tokens: {data.config?.maxTokens || 2000}</div>
          <div>Model: {data.config?.model || data.subtype}</div>
        </div>

        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-purple-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-purple-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
};

export default AIModelNode;
