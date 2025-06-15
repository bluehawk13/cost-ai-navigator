import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Database, Cloud, HardDrive, Server, DollarSign } from 'lucide-react';
import NodeDescription from './NodeDescription';

const DatabaseNode = ({ data, id }: { data: any; id: string }) => {
  const [hostingOption, setHostingOption] = useState(data.config?.hosting || 'self-hosted');
  const [region, setRegion] = useState(data.config?.region || 'us-east-1');
  const [instanceType, setInstanceType] = useState(data.config?.instanceType || 'small');
  const [description, setDescription] = useState(data.description || '');

  // Update node data when configuration changes
  useEffect(() => {
    if (data.onConfigChange) {
      data.onConfigChange(id, {
        ...data.config,
        hosting: hostingOption,
        region: region,
        instanceType: instanceType
      }, description);
    }
  }, [hostingOption, region, instanceType, description, id, data]);

  const getIcon = () => {
    switch (data.subtype) {
      case 'postgres': return <Database className="h-4 w-4" />;
      case 'mysql': return <Database className="h-4 w-4" />;
      case 'mongodb': return <Database className="h-4 w-4" />;
      case 'pinecone': return <Cloud className="h-4 w-4" />;
      case 'redis': return <HardDrive className="h-4 w-4" />;
      case 'weaviate': return <Cloud className="h-4 w-4" />;
      case 'chroma': return <Database className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getHostingOptions = () => {
    switch (data.subtype) {
      case 'postgres':
        return [
          { value: 'self-hosted', label: 'Self-hosted', cost: '$20-100/month' },
          { value: 'aws-rds', label: 'AWS RDS', cost: '$50-500/month' },
          { value: 'gcp-sql', label: 'Google Cloud SQL', cost: '$45-450/month' },
          { value: 'azure-db', label: 'Azure Database', cost: '$50-480/month' }
        ];
      case 'mysql':
        return [
          { value: 'self-hosted', label: 'Self-hosted', cost: '$15-80/month' },
          { value: 'aws-rds', label: 'AWS RDS', cost: '$40-400/month' },
          { value: 'gcp-sql', label: 'Google Cloud SQL', cost: '$35-380/month' },
          { value: 'azure-db', label: 'Azure Database', cost: '$40-400/month' }
        ];
      case 'mongodb':
        return [
          { value: 'self-hosted', label: 'Self-hosted', cost: '$25-150/month' },
          { value: 'atlas', label: 'MongoDB Atlas', cost: '$57-700/month' },
          { value: 'aws-documentdb', label: 'AWS DocumentDB', cost: '$60-600/month' }
        ];
      case 'redis':
        return [
          { value: 'self-hosted', label: 'Self-hosted', cost: '$10-50/month' },
          { value: 'aws-elasticache', label: 'AWS ElastiCache', cost: '$25-300/month' },
          { value: 'gcp-memorystore', label: 'Google Memorystore', cost: '$20-280/month' },
          { value: 'azure-cache', label: 'Azure Cache', cost: '$25-300/month' }
        ];
      case 'pinecone':
        return [
          { value: 'pinecone-cloud', label: 'Pinecone Cloud', cost: '$70-1000/month' }
        ];
      case 'weaviate':
        return [
          { value: 'self-hosted', label: 'Self-hosted', cost: '$30-200/month' },
          { value: 'weaviate-cloud', label: 'Weaviate Cloud', cost: '$25-500/month' }
        ];
      case 'chroma':
        return [
          { value: 'self-hosted', label: 'Self-hosted', cost: 'Free' },
          { value: 'cloud-deploy', label: 'Cloud Deployment', cost: '$20-200/month' }
        ];
      default:
        return [{ value: 'self-hosted', label: 'Self-hosted', cost: 'Variable' }];
    }
  };

  const getInstanceTypes = () => {
    if (hostingOption === 'self-hosted') {
      return [
        { value: 'small', label: 'Small (2 CPU, 4GB RAM)', cost: '$20-50/month' },
        { value: 'medium', label: 'Medium (4 CPU, 8GB RAM)', cost: '$50-100/month' },
        { value: 'large', label: 'Large (8 CPU, 16GB RAM)', cost: '$100-200/month' }
      ];
    }
    
    return [
      { value: 'db.t3.micro', label: 'db.t3.micro (1 vCPU, 1GB)', cost: '$15-25/month' },
      { value: 'db.t3.small', label: 'db.t3.small (2 vCPU, 2GB)', cost: '$30-50/month' },
      { value: 'db.t3.medium', label: 'db.t3.medium (2 vCPU, 4GB)', cost: '$60-100/month' },
      { value: 'db.r5.large', label: 'db.r5.large (2 vCPU, 16GB)', cost: '$150-250/month' }
    ];
  };

  const selectedHosting = getHostingOptions().find(h => h.value === hostingOption);
  const selectedInstance = getInstanceTypes().find(i => i.value === instanceType);
  const estimatedCost = selectedInstance?.cost || selectedHosting?.cost || 'N/A';

  return (
    <Card className="min-w-[300px] border-green-200 bg-green-50">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-green-600">
            {getIcon()}
          </div>
          <span className="font-medium text-sm">{data.label}</span>
          <Badge variant="secondary" className="text-xs">
            Database
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Hosting</label>
            <Select value={hostingOption} onValueChange={setHostingOption}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select hosting" />
              </SelectTrigger>
              <SelectContent>
                {getHostingOptions().map((option) => (
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

          {hostingOption !== 'self-hosted' && hostingOption !== 'pinecone-cloud' && (
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Region</label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                  <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                  <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                  <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Instance Type</label>
            <Select value={instanceType} onValueChange={setInstanceType}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select instance" />
              </SelectTrigger>
              <SelectContent>
                {getInstanceTypes().map((instance) => (
                  <SelectItem key={instance.value} value={instance.value}>
                    <div className="flex flex-col">
                      <span className="text-xs">{instance.label}</span>
                      <span className="text-xs text-green-600">{instance.cost}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1 pt-2 border-t">
            <div className="flex items-center justify-between">
              <span>Type:</span>
              <span className="font-medium">{data.subtype}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Hosting:</span>
              <span className="font-medium">{selectedHosting?.label}</span>
            </div>
            <div className="flex items-center justify-between text-green-600">
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Est. Cost:
              </span>
              <span className="font-medium">{estimatedCost}</span>
            </div>
          </div>
        </div>

        <NodeDescription
          description={description}
          onDescriptionChange={setDescription}
          placeholder="Describe how this database is used in your workflow..."
        />

        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-green-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-green-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
};

export default DatabaseNode;
