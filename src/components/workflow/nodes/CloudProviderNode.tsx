
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, Server, Database, Cpu, Network, Shield, HardDrive, Zap } from 'lucide-react';

const CloudProviderNode = ({ data, id }: { data: any; id: string }) => {
  const [selectedCategory, setSelectedCategory] = useState(data.config?.category || '');
  const [selectedService, setSelectedService] = useState(data.config?.service || '');
  const [selectedRegion, setSelectedRegion] = useState(data.config?.region || '');
  const [selectedInstanceType, setSelectedInstanceType] = useState(data.config?.instanceType || '');
  const [storageConfig, setStorageConfig] = useState(data.config?.storage || { type: 'gp3', size: '20GB' });

  useEffect(() => {
    if (data.onConfigChange) {
      data.onConfigChange(id, {
        ...data.config,
        category: selectedCategory,
        service: selectedService,
        region: selectedRegion,
        instanceType: selectedInstanceType,
        storage: storageConfig
      });
    }
  }, [selectedCategory, selectedService, selectedRegion, selectedInstanceType, storageConfig, id, data]);

  const getIcon = () => {
    switch (data.provider) {
      case 'aws': return <Cloud className="h-4 w-4 text-orange-500" />;
      case 'gcp': return <Cloud className="h-4 w-4 text-blue-500" />;
      case 'azure': return <Cloud className="h-4 w-4 text-blue-600" />;
      case 'oracle': return <Cloud className="h-4 w-4 text-red-500" />;
      default: return <Cloud className="h-4 w-4" />;
    }
  };

  const getServiceCategories = () => {
    const categories = {
      aws: [
        { id: 'compute', name: 'Compute', icon: <Cpu className="h-3 w-3" /> },
        { id: 'storage', name: 'Storage', icon: <HardDrive className="h-3 w-3" /> },
        { id: 'database', name: 'Database', icon: <Database className="h-3 w-3" /> },
        { id: 'networking', name: 'Networking', icon: <Network className="h-3 w-3" /> },
        { id: 'security', name: 'Security', icon: <Shield className="h-3 w-3" /> },
        { id: 'serverless', name: 'Serverless', icon: <Zap className="h-3 w-3" /> },
        { id: 'analytics', name: 'Analytics', icon: <Server className="h-3 w-3" /> },
        { id: 'ml', name: 'Machine Learning', icon: <Cpu className="h-3 w-3" /> }
      ],
      gcp: [
        { id: 'compute', name: 'Compute', icon: <Cpu className="h-3 w-3" /> },
        { id: 'storage', name: 'Storage', icon: <HardDrive className="h-3 w-3" /> },
        { id: 'database', name: 'Database', icon: <Database className="h-3 w-3" /> },
        { id: 'networking', name: 'Networking', icon: <Network className="h-3 w-3" /> },
        { id: 'security', name: 'Security', icon: <Shield className="h-3 w-3" /> },
        { id: 'serverless', name: 'Serverless', icon: <Zap className="h-3 w-3" /> },
        { id: 'ai', name: 'AI/ML', icon: <Cpu className="h-3 w-3" /> }
      ],
      azure: [
        { id: 'compute', name: 'Compute', icon: <Cpu className="h-3 w-3" /> },
        { id: 'storage', name: 'Storage', icon: <HardDrive className="h-3 w-3" /> },
        { id: 'database', name: 'Database', icon: <Database className="h-3 w-3" /> },
        { id: 'networking', name: 'Networking', icon: <Network className="h-3 w-3" /> },
        { id: 'security', name: 'Security', icon: <Shield className="h-3 w-3" /> },
        { id: 'serverless', name: 'Serverless', icon: <Zap className="h-3 w-3" /> },
        { id: 'ai', name: 'AI Services', icon: <Cpu className="h-3 w-3" /> }
      ],
      oracle: [
        { id: 'compute', name: 'Compute', icon: <Cpu className="h-3 w-3" /> },
        { id: 'storage', name: 'Storage', icon: <HardDrive className="h-3 w-3" /> },
        { id: 'database', name: 'Database', icon: <Database className="h-3 w-3" /> },
        { id: 'networking', name: 'Networking', icon: <Network className="h-3 w-3" /> }
      ]
    };
    return categories[data.provider] || [];
  };

  const getServicesForCategory = () => {
    const services = {
      aws: {
        compute: [
          { value: 'ec2', label: 'EC2 - Virtual Servers' },
          { value: 'ecs', label: 'ECS - Container Service' },
          { value: 'eks', label: 'EKS - Kubernetes Service' },
          { value: 'fargate', label: 'Fargate - Serverless Containers' },
          { value: 'batch', label: 'Batch - Batch Computing' },
          { value: 'lightsail', label: 'Lightsail - Virtual Private Servers' }
        ],
        storage: [
          { value: 's3', label: 'S3 - Object Storage' },
          { value: 'ebs', label: 'EBS - Block Storage' },
          { value: 'efs', label: 'EFS - File Storage' },
          { value: 'fsx', label: 'FSx - Fully Managed File Systems' },
          { value: 'glacier', label: 'Glacier - Archive Storage' }
        ],
        database: [
          { value: 'rds', label: 'RDS - Relational Database' },
          { value: 'dynamodb', label: 'DynamoDB - NoSQL Database' },
          { value: 'redshift', label: 'Redshift - Data Warehouse' },
          { value: 'documentdb', label: 'DocumentDB - MongoDB Compatible' },
          { value: 'neptune', label: 'Neptune - Graph Database' },
          { value: 'elasticache', label: 'ElastiCache - In-Memory Cache' }
        ],
        networking: [
          { value: 'vpc', label: 'VPC - Virtual Private Cloud' },
          { value: 'cloudfront', label: 'CloudFront - CDN' },
          { value: 'route53', label: 'Route53 - DNS Service' },
          { value: 'elb', label: 'ELB - Load Balancer' },
          { value: 'api-gateway', label: 'API Gateway' }
        ],
        security: [
          { value: 'iam', label: 'IAM - Identity & Access Management' },
          { value: 'kms', label: 'KMS - Key Management' },
          { value: 'secrets-manager', label: 'Secrets Manager' },
          { value: 'waf', label: 'WAF - Web Application Firewall' },
          { value: 'shield', label: 'Shield - DDoS Protection' }
        ],
        serverless: [
          { value: 'lambda', label: 'Lambda - Functions' },
          { value: 'step-functions', label: 'Step Functions - Workflows' },
          { value: 'eventbridge', label: 'EventBridge - Event Bus' },
          { value: 'sqs', label: 'SQS - Message Queue' },
          { value: 'sns', label: 'SNS - Notifications' }
        ],
        analytics: [
          { value: 'kinesis', label: 'Kinesis - Data Streaming' },
          { value: 'athena', label: 'Athena - Query Service' },
          { value: 'emr', label: 'EMR - Big Data Platform' },
          { value: 'glue', label: 'Glue - ETL Service' }
        ],
        ml: [
          { value: 'bedrock', label: 'Bedrock - Generative AI' },
          { value: 'sagemaker', label: 'SageMaker - ML Platform' },
          { value: 'comprehend', label: 'Comprehend - NLP' },
          { value: 'rekognition', label: 'Rekognition - Computer Vision' }
        ]
      },
      gcp: {
        compute: [
          { value: 'compute-engine', label: 'Compute Engine - VMs' },
          { value: 'gke', label: 'GKE - Kubernetes Engine' },
          { value: 'cloud-run', label: 'Cloud Run - Containers' },
          { value: 'app-engine', label: 'App Engine - Platform' }
        ],
        storage: [
          { value: 'cloud-storage', label: 'Cloud Storage - Object Storage' },
          { value: 'persistent-disk', label: 'Persistent Disk - Block Storage' },
          { value: 'filestore', label: 'Filestore - File Storage' }
        ],
        database: [
          { value: 'cloud-sql', label: 'Cloud SQL - Relational DB' },
          { value: 'firestore', label: 'Firestore - NoSQL DB' },
          { value: 'bigtable', label: 'Bigtable - Wide-column DB' },
          { value: 'spanner', label: 'Spanner - Global SQL DB' }
        ],
        networking: [
          { value: 'vpc', label: 'VPC - Virtual Private Cloud' },
          { value: 'cloud-cdn', label: 'Cloud CDN' },
          { value: 'cloud-dns', label: 'Cloud DNS' },
          { value: 'load-balancer', label: 'Load Balancer' }
        ],
        security: [
          { value: 'iam', label: 'IAM - Identity Management' },
          { value: 'kms', label: 'KMS - Key Management' },
          { value: 'secret-manager', label: 'Secret Manager' }
        ],
        serverless: [
          { value: 'cloud-functions', label: 'Cloud Functions' },
          { value: 'pub-sub', label: 'Pub/Sub - Messaging' },
          { value: 'workflows', label: 'Workflows' }
        ],
        ai: [
          { value: 'vertex-ai', label: 'Vertex AI - ML Platform' },
          { value: 'translation', label: 'Translation AI' },
          { value: 'vision-api', label: 'Vision API' },
          { value: 'speech-api', label: 'Speech-to-Text' }
        ]
      },
      azure: {
        compute: [
          { value: 'virtual-machines', label: 'Virtual Machines' },
          { value: 'aks', label: 'AKS - Kubernetes Service' },
          { value: 'container-instances', label: 'Container Instances' },
          { value: 'app-service', label: 'App Service' }
        ],
        storage: [
          { value: 'blob-storage', label: 'Blob Storage - Object Storage' },
          { value: 'disk-storage', label: 'Disk Storage' },
          { value: 'file-storage', label: 'File Storage' }
        ],
        database: [
          { value: 'sql-database', label: 'SQL Database' },
          { value: 'cosmos-db', label: 'Cosmos DB - NoSQL' },
          { value: 'postgresql', label: 'PostgreSQL' },
          { value: 'redis-cache', label: 'Redis Cache' }
        ],
        networking: [
          { value: 'virtual-network', label: 'Virtual Network' },
          { value: 'cdn', label: 'CDN' },
          { value: 'dns', label: 'DNS' },
          { value: 'load-balancer', label: 'Load Balancer' }
        ],
        security: [
          { value: 'active-directory', label: 'Active Directory' },
          { value: 'key-vault', label: 'Key Vault' },
          { value: 'security-center', label: 'Security Center' }
        ],
        serverless: [
          { value: 'functions', label: 'Azure Functions' },
          { value: 'logic-apps', label: 'Logic Apps' },
          { value: 'service-bus', label: 'Service Bus' }
        ],
        ai: [
          { value: 'openai', label: 'Azure OpenAI' },
          { value: 'cognitive-services', label: 'Cognitive Services' },
          { value: 'ml-studio', label: 'ML Studio' }
        ]
      },
      oracle: {
        compute: [
          { value: 'compute', label: 'Compute Instances' },
          { value: 'container-engine', label: 'Container Engine' },
          { value: 'functions', label: 'Oracle Functions' }
        ],
        storage: [
          { value: 'object-storage', label: 'Object Storage' },
          { value: 'block-storage', label: 'Block Storage' },
          { value: 'file-storage', label: 'File Storage' }
        ],
        database: [
          { value: 'autonomous-db', label: 'Autonomous Database' },
          { value: 'mysql', label: 'MySQL HeatWave' },
          { value: 'nosql', label: 'NoSQL Database' }
        ],
        networking: [
          { value: 'vcn', label: 'Virtual Cloud Network' },
          { value: 'load-balancer', label: 'Load Balancer' },
          { value: 'dns', label: 'DNS' }
        ]
      }
    };
    return services[data.provider]?.[selectedCategory] || [];
  };

  const getRegions = () => {
    const regions = {
      aws: [
        { value: 'us-east-1', label: 'US East (N. Virginia)' },
        { value: 'us-west-2', label: 'US West (Oregon)' },
        { value: 'eu-west-1', label: 'Europe (Ireland)' },
        { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
        { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' }
      ],
      gcp: [
        { value: 'us-central1', label: 'US Central (Iowa)' },
        { value: 'us-east1', label: 'US East (S. Carolina)' },
        { value: 'europe-west1', label: 'Europe West (Belgium)' },
        { value: 'asia-southeast1', label: 'Asia Southeast (Singapore)' }
      ],
      azure: [
        { value: 'eastus', label: 'East US' },
        { value: 'westus2', label: 'West US 2' },
        { value: 'westeurope', label: 'West Europe' },
        { value: 'southeastasia', label: 'Southeast Asia' }
      ],
      oracle: [
        { value: 'us-ashburn-1', label: 'US East (Ashburn)' },
        { value: 'us-phoenix-1', label: 'US West (Phoenix)' },
        { value: 'eu-frankfurt-1', label: 'EU Central (Frankfurt)' }
      ]
    };
    return regions[data.provider] || [];
  };

  const getInstanceTypes = () => {
    if (!selectedCategory || selectedCategory !== 'compute') return [];
    
    const instanceTypes = {
      aws: [
        { value: 't3.micro', label: 't3.micro (1 vCPU, 1 GB RAM)' },
        { value: 't3.small', label: 't3.small (2 vCPU, 2 GB RAM)' },
        { value: 't3.medium', label: 't3.medium (2 vCPU, 4 GB RAM)' },
        { value: 'm5.large', label: 'm5.large (2 vCPU, 8 GB RAM)' },
        { value: 'm5.xlarge', label: 'm5.xlarge (4 vCPU, 16 GB RAM)' },
        { value: 'c5.large', label: 'c5.large (2 vCPU, 4 GB RAM) - Compute Optimized' }
      ],
      gcp: [
        { value: 'e2-micro', label: 'e2-micro (0.25-2 vCPU, 1 GB RAM)' },
        { value: 'e2-small', label: 'e2-small (0.5-2 vCPU, 2 GB RAM)' },
        { value: 'e2-medium', label: 'e2-medium (1-2 vCPU, 4 GB RAM)' },
        { value: 'n2-standard-2', label: 'n2-standard-2 (2 vCPU, 8 GB RAM)' },
        { value: 'n2-standard-4', label: 'n2-standard-4 (4 vCPU, 16 GB RAM)' }
      ],
      azure: [
        { value: 'Standard_B1s', label: 'B1s (1 vCPU, 1 GB RAM)' },
        { value: 'Standard_B2s', label: 'B2s (2 vCPU, 4 GB RAM)' },
        { value: 'Standard_D2s_v3', label: 'D2s v3 (2 vCPU, 8 GB RAM)' },
        { value: 'Standard_D4s_v3', label: 'D4s v3 (4 vCPU, 16 GB RAM)' }
      ],
      oracle: [
        { value: 'VM.Standard2.1', label: 'VM.Standard2.1 (1 OCPU, 15 GB RAM)' },
        { value: 'VM.Standard2.2', label: 'VM.Standard2.2 (2 OCPU, 30 GB RAM)' },
        { value: 'VM.Standard.E3.Flex', label: 'VM.Standard.E3.Flex (Flexible)' }
      ]
    };
    return instanceTypes[data.provider] || [];
  };

  const shouldShowInstanceTypes = selectedCategory === 'compute' && ['ec2', 'compute-engine', 'virtual-machines', 'compute'].includes(selectedService);
  const shouldShowStorage = ['storage', 'database'].includes(selectedCategory);

  return (
    <Card className="min-w-[320px] border-blue-200 bg-blue-50">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-blue-600">
            {getIcon()}
          </div>
          <span className="font-medium text-sm">{data.label}</span>
          <Badge variant="secondary" className="text-xs">
            Cloud
          </Badge>
        </div>
        
        <Tabs defaultValue="service" className="space-y-3">
          <TabsList className="grid w-full grid-cols-2 h-7">
            <TabsTrigger value="service" className="text-xs">Service</TabsTrigger>
            <TabsTrigger value="config" className="text-xs">Config</TabsTrigger>
          </TabsList>
          
          <TabsContent value="service" className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {getServiceCategories().map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {category.icon}
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategory && (
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Service</label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {getServicesForCategory().map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </TabsContent>

          <TabsContent value="config" className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {getRegions().map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {shouldShowInstanceTypes && (
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Instance Type</label>
                <Select value={selectedInstanceType} onValueChange={setSelectedInstanceType}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select instance" />
                  </SelectTrigger>
                  <SelectContent>
                    {getInstanceTypes().map((instance) => (
                      <SelectItem key={instance.value} value={instance.value}>
                        {instance.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {shouldShowStorage && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 mb-1 block">Storage</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Size (e.g., 100GB)"
                    value={storageConfig.size}
                    onChange={(e) => setStorageConfig({...storageConfig, size: e.target.value})}
                    className="h-7 text-xs"
                  />
                  <Select value={storageConfig.type} onValueChange={(value) => setStorageConfig({...storageConfig, type: value})}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gp3">GP3 (General Purpose)</SelectItem>
                      <SelectItem value="io2">IO2 (High IOPS)</SelectItem>
                      <SelectItem value="st1">ST1 (Throughput Optimized)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {selectedService && (
          <div className="text-xs text-gray-600 space-y-1 pt-2 border-t mt-3">
            <div className="flex items-center justify-between">
              <span>Provider:</span>
              <span className="font-medium">{data.provider?.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Category:</span>
              <span className="font-medium capitalize">{selectedCategory}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Service:</span>
              <span className="font-medium">{getServicesForCategory().find(s => s.value === selectedService)?.label}</span>
            </div>
          </div>
        )}

        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
};

export default CloudProviderNode;
