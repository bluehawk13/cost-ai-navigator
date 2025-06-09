
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileOutput, Mail, Webhook } from 'lucide-react';

const OutputNode = ({ data }: { data: any }) => {
  const getIcon = () => {
    switch (data.subtype) {
      case 'pdf': return <FileOutput className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'webhook': return <Webhook className="h-4 w-4" />;
      default: return <FileOutput className="h-4 w-4" />;
    }
  };

  return (
    <Card className="min-w-[200px] border-red-200 bg-red-50">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-red-600">
            {getIcon()}
          </div>
          <span className="font-medium text-sm">{data.label}</span>
          <Badge variant="secondary" className="text-xs">
            Output
          </Badge>
        </div>
        
        <div className="text-xs text-gray-600 space-y-1">
          {data.subtype === 'pdf' && (
            <div>Format: {data.config?.format || 'A4'}</div>
          )}
          {data.subtype === 'email' && (
            <div>Subject: {data.config?.subject || 'Not set'}</div>
          )}
          {data.subtype === 'webhook' && (
            <div>Method: {data.config?.method || 'POST'}</div>
          )}
        </div>

        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-red-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
};

export default OutputNode;