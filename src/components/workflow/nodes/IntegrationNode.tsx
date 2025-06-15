import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Link, Webhook, MessageSquare, Zap } from 'lucide-react';
import NodeDescription from './NodeDescription';

const IntegrationNode = ({ data, id }: { data: any; id: string }) => {
  const [method, setMethod] = useState(data.config?.method || 'POST');
  const [retries, setRetries] = useState(data.config?.retries || 3);
  const [provider, setProvider] = useState(data.config?.provider || 'aws-sqs');
  const [description, setDescription] = useState(data.description || '');

  useEffect(() => {
    if (data.onConfigChange) {
      data.onConfigChange(id, {
        ...data.config,
        method,
        retries,
        provider
      }, description);
    }
  }, [method, retries, provider, description, id, data]);

  const getIcon = () => {
    switch (data.subtype) {
      case 'webhook': return <Webhook className="h-4 w-4" />;
      case 'queue': return <MessageSquare className="h-4 w-4" />;
      case 'streaming': return <Zap className="h-4 w-4" />;
      default: return <Link className="h-4 w-4" />;
    }
  };

  const getProviderOptions = () => {
    switch (data.subtype) {
      case 'queue':
        return [
          { value: 'aws-sqs', label: 'AWS SQS' },
          { value: 'gcp-pubsub', label: 'Google Pub/Sub' },
          { value: 'azure-servicebus', label: 'Azure Service Bus' },
          { value: 'rabbitmq', label: 'RabbitMQ' }
        ];
      case 'streaming':
        return [
          { value: 'kafka', label: 'Apache Kafka' },
          { value: 'aws-kinesis', label: 'AWS Kinesis' },
          { value: 'gcp-dataflow', label: 'Google Dataflow' },
          { value: 'azure-eventhubs', label: 'Azure Event Hubs' }
        ];
      default:
        return [
          { value: 'http', label: 'HTTP/HTTPS' },
          { value: 'tcp', label: 'TCP' }
        ];
    }
  };

  const selectedProvider = getProviderOptions().find(p => p.value === provider);

  return (
    <Card className="min-w-[280px] border-indigo-200 bg-indigo-50">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-indigo-600">
            {getIcon()}
          </div>
          <span className="font-medium text-sm">{data.label}</span>
          <Badge variant="secondary" className="text-xs">
            Integration
          </Badge>
        </div>
        
        <div className="space-y-3">
          {data.subtype !== 'webhook' && (
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Provider</label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {getProviderOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {data.subtype === 'webhook' && (
            <>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Method</label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Retries</label>
                <Input
                  type="number"
                  value={retries}
                  onChange={(e) => setRetries(Number(e.target.value))}
                  className="h-8 text-xs"
                  min="0"
                  max="10"
                />
              </div>
            </>
          )}
          
          <div className="text-xs text-gray-600 space-y-1 pt-2 border-t">
            <div className="flex items-center justify-between">
              <span>Type:</span>
              <span className="font-medium capitalize">{data.subtype}</span>
            </div>
            {data.subtype === 'webhook' && (
              <div className="flex items-center justify-between">
                <span>Method:</span>
                <span className="font-medium">{method}</span>
              </div>
            )}
            {data.subtype !== 'webhook' && (
              <div className="flex items-center justify-between">
                <span>Provider:</span>
                <span className="font-medium">{selectedProvider?.label}</span>
              </div>
            )}
          </div>
        </div>

        <NodeDescription
          description={description}
          onDescriptionChange={setDescription}
          placeholder="Describe how this integration connects to external systems..."
        />

        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-indigo-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-indigo-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
};

export default IntegrationNode;
