
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Cloud, Server, Database, Network, Cpu, HardDrive, Globe, Shield } from 'lucide-react';
import NodeDescription from './NodeDescription';

const CloudProviderNode = ({ data, id }: { data: any; id: string }) => {
  const [config, setConfig] = useState(data.config || {});
  const [description, setDescription] = useState(data.description || '');

  useEffect(() => {
    if (data.onConfigChange) {
      data.onConfigChange(id, config, description);
    }
  }, [config, description, id, data]);

  const updateConfig = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
  };

  const updateNestedConfig = (parentKey: string, childKey: string, value: any) => {
    const newConfig = {
      ...config,
      [parentKey]: {
        ...config[parentKey],
        [childKey]: value
      }
    };
    setConfig(newConfig);
  };

  const getIcon = () => {
    const category = config.category || '';
    switch (category) {
      case 'compute': return <Server className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'networking': return <Network className="h-4 w-4" />;
      case 'storage': return <HardDrive className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'ai-ml': return <Cpu className="h-4 w-4" />;
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

  const getServiceOptions = () => {
    const services: Record<string, Record<string, string[]>> = {
      aws: {
        compute: ['EC2', 'Lambda', 'ECS', 'EKS', 'Fargate', 'Batch'],
        database: ['RDS', 'DynamoDB', 'Aurora', 'DocumentDB', 'Neptune', 'Timestream'],
        networking: ['VPC', 'CloudFront', 'Route 53', 'ELB', 'API Gateway', 'Direct Connect'],
        storage: ['S3', 'EBS', 'EFS', 'FSx', 'Storage Gateway', 'Backup'],
        security: ['IAM', 'Cognito', 'KMS', 'WAF', 'Shield', 'GuardDuty'],
        'ai-ml': ['SageMaker', 'Comprehend', 'Rekognition', 'Translate', 'Polly', 'Lex']
      },
      gcp: {
        compute: ['Compute Engine', 'Cloud Functions', 'Cloud Run', 'GKE', 'App Engine'],
        database: ['Cloud SQL', 'Firestore', 'BigQuery', 'Bigtable', 'Spanner'],
        networking: ['VPC', 'Cloud CDN', 'Cloud DNS', 'Load Balancing', 'Cloud NAT'],
        storage: ['Cloud Storage', 'Persistent Disk', 'Filestore', 'Cloud Backup'],
        security: ['IAM', 'Cloud KMS', 'Security Command Center', 'Cloud Armor'],
        'ai-ml': ['Vertex AI', 'AutoML', 'Natural Language AI', 'Vision AI', 'Translation AI']
      },
      azure: {
        compute: ['Virtual Machines', 'Functions', 'Container Instances', 'AKS', 'App Service'],
        database: ['SQL Database', 'Cosmos DB', 'MySQL', 'PostgreSQL', 'Redis Cache'],
        networking: ['Virtual Network', 'CDN', 'DNS', 'Load Balancer', 'Application Gateway'],
        storage: ['Blob Storage', 'Disk Storage', 'File Storage', 'Archive Storage'],
        security: ['Active Directory', 'Key Vault', 'Security Center', 'Sentinel'],
        'ai-ml': ['Machine Learning', 'Cognitive Services', 'Bot Framework', 'Form Recognizer']
      },
      oracle: {
        compute: ['Compute', 'Functions', 'Container Engine', 'Resource Manager'],
        database: ['Autonomous Database', 'MySQL', 'NoSQL', 'Database Cloud Service'],
        networking: ['Virtual Cloud Network', 'Load Balancer', 'DNS', 'FastConnect'],
        storage: ['Object Storage', 'Block Storage', 'File Storage', 'Archive Storage'],
        security: ['Identity Cloud', 'Key Management', 'Cloud Guard', 'Security Zones'],
        'ai-ml': ['Data Science', 'AI Services', 'Analytics Cloud', 'Integration']
      }
    };
    
    return services[data.provider]?.[config.category] || [];
  };

  const getRegionOptions = () => {
    const regions: Record<string, string[]> = {
      aws: ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-southeast-1', 'ap-northeast-1'],
      gcp: ['us-central1', 'us-east1', 'europe-west1', 'europe-west3', 'asia-southeast1', 'asia-northeast1'],
      azure: ['eastus', 'westus2', 'westeurope', 'northeurope', 'southeastasia', 'japaneast'],
      oracle: ['us-ashburn-1', 'us-phoenix-1', 'eu-frankfurt-1', 'uk-london-1', 'ap-tokyo-1', 'ap-sydney-1']
    };
    
    return regions[data.provider] || [];
  };

  const getInstanceTypeOptions = () => {
    const instanceTypes: Record<string, string[]> = {
      aws: ['t3.micro', 't3.small', 't3.medium', 't3.large', 'm5.large', 'm5.xlarge', 'c5.large', 'r5.large'],
      gcp: ['e2-micro', 'e2-small', 'e2-medium', 'e2-standard-2', 'n2-standard-2', 'c2-standard-4'],
      azure: ['B1s', 'B2s', 'B4ms', 'D2s_v3', 'D4s_v3', 'F2s_v2', 'E2s_v3'],
      oracle: ['VM.Standard2.1', 'VM.Standard2.2', 'VM.Standard2.4', 'VM.Standard.E3.Flex', 'VM.Standard.E4.Flex']
    };
    
    return instanceTypes[data.provider] || [];
  };

  return (
    <Card className={`min-w-[320px] max-w-[400px] ${getProviderColor()}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className={getIconColor()}>
            {getIcon()}
          </div>
          <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
          <Badge variant="secondary" className="text-xs ml-auto">
            {data.provider?.toUpperCase() || 'Cloud'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Category Selection */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Category</Label>
          <Select value={config.category || ''} onValueChange={(value) => updateConfig('category', value)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="compute">Compute</SelectItem>
              <SelectItem value="database">Database</SelectItem>
              <SelectItem value="networking">Networking</SelectItem>
              <SelectItem value="storage">Storage</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="ai-ml">AI/ML</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Service Selection */}
        {config.category && (
          <div className="space-y-1">
            <Label className="text-xs font-medium">Service</Label>
            <Select value={config.service || ''} onValueChange={(value) => updateConfig('service', value)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {getServiceOptions().map(service => (
                  <SelectItem key={service} value={service}>{service}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Region Selection */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Region</Label>
          <Select value={config.region || ''} onValueChange={(value) => updateConfig('region', value)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {getRegionOptions().map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Instance Type */}
        {config.category === 'compute' && (
          <div className="space-y-1">
            <Label className="text-xs font-medium">Instance Type</Label>
            <Select value={config.instanceType || ''} onValueChange={(value) => updateConfig('instanceType', value)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select instance type" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {getInstanceTypeOptions().map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Storage Configuration */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Storage</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-gray-600">Type</Label>
              <Select 
                value={config.storage?.type || ''} 
                onValueChange={(value) => updateNestedConfig('storage', 'type', value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="gp3">GP3 (SSD)</SelectItem>
                  <SelectItem value="gp2">GP2 (SSD)</SelectItem>
                  <SelectItem value="io2">IO2 (High IOPS)</SelectItem>
                  <SelectItem value="st1">ST1 (HDD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-600">Size</Label>
              <Input
                value={config.storage?.size || ''}
                onChange={(e) => updateNestedConfig('storage', 'size', e.target.value)}
                placeholder="20GB"
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Pricing Model */}
        <div className="space-y-1">
          <Label className="text-xs font-medium">Pricing Model</Label>
          <Select value={config.pricingModel || 'on-demand'} onValueChange={(value) => updateConfig('pricingModel', value)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="on-demand">On-Demand</SelectItem>
              <SelectItem value="reserved">Reserved Instances</SelectItem>
              <SelectItem value="spot">Spot Instances</SelectItem>
              <SelectItem value="savings-plan">Savings Plan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Auto Scaling */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Auto Scaling</Label>
            <Switch
              checked={config.autoScaling?.enabled || false}
              onCheckedChange={(checked) => updateNestedConfig('autoScaling', 'enabled', checked)}
            />
          </div>
          {config.autoScaling?.enabled && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-gray-600">Min</Label>
                <Input
                  type="number"
                  value={config.autoScaling?.minInstances || 1}
                  onChange={(e) => updateNestedConfig('autoScaling', 'minInstances', parseInt(e.target.value))}
                  className="h-8 text-xs"
                  min={1}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-600">Max</Label>
                <Input
                  type="number"
                  value={config.autoScaling?.maxInstances || 10}
                  onChange={(e) => updateNestedConfig('autoScaling', 'maxInstances', parseInt(e.target.value))}
                  className="h-8 text-xs"
                  min={1}
                />
              </div>
            </div>
          )}
        </div>

        {/* Network Configuration */}
        <div className="space-y-2">
          <Label className="text-xs font-medium flex items-center gap-1">
            <Network className="h-3 w-3" />
            Network
          </Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600">VPC</Label>
              <Switch
                checked={config.network?.vpc || false}
                onCheckedChange={(checked) => updateNestedConfig('network', 'vpc', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600">Load Balancer</Label>
              <Switch
                checked={config.network?.loadBalancer || false}
                onCheckedChange={(checked) => updateNestedConfig('network', 'loadBalancer', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600">CDN</Label>
              <Switch
                checked={config.network?.cdn || false}
                onCheckedChange={(checked) => updateNestedConfig('network', 'cdn', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Node Description */}
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
