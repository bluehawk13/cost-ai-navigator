
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Cloud, Server, Database, Cpu, Network, Shield, HardDrive, Zap, BarChart3, Brain, Search, Info } from 'lucide-react';

const CloudProviderNode = ({ data, id }: { data: any; id: string }) => {
  const [selectedCategory, setSelectedCategory] = useState(data.config?.category || '');
  const [selectedService, setSelectedService] = useState(data.config?.service || '');
  const [selectedRegion, setSelectedRegion] = useState(data.config?.region || '');
  const [selectedInstanceType, setSelectedInstanceType] = useState(data.config?.instanceType || '');
  const [selectedAvailabilityZone, setSelectedAvailabilityZone] = useState(data.config?.availabilityZone || '');
  const [selectedPricingModel, setSelectedPricingModel] = useState(data.config?.pricingModel || 'on-demand');
  const [storageConfig, setStorageConfig] = useState(data.config?.storage || { type: 'gp3', size: '20GB', class: 'standard' });
  const [networkingConfig, setNetworkingConfig] = useState(data.config?.networking || { vpc: '', subnet: '', securityGroup: '' });
  const [scalingConfig, setScalingConfig] = useState(data.config?.scaling || { minInstances: 1, maxInstances: 10, autoScale: false });
  const [serviceSearch, setServiceSearch] = useState('');

  useEffect(() => {
    if (data.onConfigChange) {
      data.onConfigChange(id, {
        ...data.config,
        category: selectedCategory,
        service: selectedService,
        region: selectedRegion,
        instanceType: selectedInstanceType,
        availabilityZone: selectedAvailabilityZone,
        pricingModel: selectedPricingModel,
        storage: storageConfig,
        networking: networkingConfig,
        scaling: scalingConfig
      });
    }
  }, [selectedCategory, selectedService, selectedRegion, selectedInstanceType, selectedAvailabilityZone, selectedPricingModel, storageConfig, networkingConfig, scalingConfig, id, data]);

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
        { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="h-3 w-3" /> },
        { id: 'ml', name: 'Machine Learning', icon: <Brain className="h-3 w-3" /> }
      ],
      gcp: [
        { id: 'compute', name: 'Compute', icon: <Cpu className="h-3 w-3" /> },
        { id: 'storage', name: 'Storage', icon: <HardDrive className="h-3 w-3" /> },
        { id: 'database', name: 'Database', icon: <Database className="h-3 w-3" /> },
        { id: 'networking', name: 'Networking', icon: <Network className="h-3 w-3" /> },
        { id: 'security', name: 'Security', icon: <Shield className="h-3 w-3" /> },
        { id: 'serverless', name: 'Serverless', icon: <Zap className="h-3 w-3" /> },
        { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="h-3 w-3" /> },
        { id: 'ml', name: 'AI/ML', icon: <Brain className="h-3 w-3" /> }
      ],
      azure: [
        { id: 'compute', name: 'Compute', icon: <Cpu className="h-3 w-3" /> },
        { id: 'storage', name: 'Storage', icon: <HardDrive className="h-3 w-3" /> },
        { id: 'database', name: 'Database', icon: <Database className="h-3 w-3" /> },
        { id: 'networking', name: 'Networking', icon: <Network className="h-3 w-3" /> },
        { id: 'security', name: 'Security', icon: <Shield className="h-3 w-3" /> },
        { id: 'serverless', name: 'Serverless', icon: <Zap className="h-3 w-3" /> },
        { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="h-3 w-3" /> },
        { id: 'ml', name: 'AI Services', icon: <Brain className="h-3 w-3" /> }
      ],
      oracle: [
        { id: 'compute', name: 'Compute', icon: <Cpu className="h-3 w-3" /> },
        { id: 'storage', name: 'Storage', icon: <HardDrive className="h-3 w-3" /> },
        { id: 'database', name: 'Database', icon: <Database className="h-3 w-3" /> },
        { id: 'networking', name: 'Networking', icon: <Network className="h-3 w-3" /> },
        { id: 'security', name: 'Security', icon: <Shield className="h-3 w-3" /> },
        { id: 'serverless', name: 'Serverless', icon: <Zap className="h-3 w-3" /> },
        { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="h-3 w-3" /> },
        { id: 'ml', name: 'Machine Learning', icon: <Brain className="h-3 w-3" /> }
      ]
    };
    return categories[data.provider] || [];
  };

  const getServicesForCategory = () => {
    const services = {
      aws: {
        compute: [
          { value: 'ec2', label: 'EC2 - Virtual Servers', description: 'Scalable virtual machines in the cloud' },
          { value: 'ecs', label: 'ECS - Container Service', description: 'Docker container orchestration service' },
          { value: 'eks', label: 'EKS - Kubernetes Service', description: 'Managed Kubernetes service' },
          { value: 'fargate', label: 'Fargate - Serverless Containers', description: 'Run containers without managing servers' },
          { value: 'batch', label: 'Batch - Batch Computing', description: 'Run batch jobs at any scale' },
          { value: 'lightsail', label: 'Lightsail - Virtual Private Servers', description: 'Easy-to-use virtual private servers' },
          { value: 'elastic-beanstalk', label: 'Elastic Beanstalk - Application Platform', description: 'Deploy and manage web applications' }
        ],
        storage: [
          { value: 's3', label: 'S3 - Object Storage', description: 'Scalable object storage service' },
          { value: 'ebs', label: 'EBS - Block Storage', description: 'High-performance block storage' },
          { value: 'efs', label: 'EFS - File Storage', description: 'Fully managed NFS file system' },
          { value: 'fsx', label: 'FSx - Fully Managed File Systems', description: 'High-performance file systems' },
          { value: 'glacier', label: 'Glacier - Archive Storage', description: 'Low-cost archive storage' },
          { value: 'storage-gateway', label: 'Storage Gateway - Hybrid Storage', description: 'Hybrid cloud storage service' }
        ],
        database: [
          { value: 'rds', label: 'RDS - Relational Database', description: 'Managed relational database service' },
          { value: 'dynamodb', label: 'DynamoDB - NoSQL Database', description: 'Fast and flexible NoSQL database' },
          { value: 'redshift', label: 'Redshift - Data Warehouse', description: 'Fast, simple, cost-effective data warehouse' },
          { value: 'documentdb', label: 'DocumentDB - MongoDB Compatible', description: 'MongoDB-compatible document database' },
          { value: 'neptune', label: 'Neptune - Graph Database', description: 'Fast, reliable graph database' },
          { value: 'elasticache', label: 'ElastiCache - In-Memory Cache', description: 'In-memory caching service' },
          { value: 'timestream', label: 'Timestream - Time Series DB', description: 'Fast, scalable time series database' }
        ],
        networking: [
          { value: 'vpc', label: 'VPC - Virtual Private Cloud', description: 'Isolated cloud resources' },
          { value: 'cloudfront', label: 'CloudFront - CDN', description: 'Global content delivery network' },
          { value: 'route53', label: 'Route53 - DNS Service', description: 'Scalable domain name system' },
          { value: 'elb', label: 'ELB - Load Balancer', description: 'Distribute incoming traffic across targets' },
          { value: 'api-gateway', label: 'API Gateway', description: 'Create, publish, maintain APIs' },
          { value: 'direct-connect', label: 'Direct Connect - Dedicated Network', description: 'Dedicated network connection to AWS' }
        ],
        security: [
          { value: 'iam', label: 'IAM - Identity & Access Management', description: 'Manage access to AWS services securely' },
          { value: 'kms', label: 'KMS - Key Management', description: 'Create and manage cryptographic keys' },
          { value: 'secrets-manager', label: 'Secrets Manager', description: 'Rotate, manage, retrieve secrets' },
          { value: 'waf', label: 'WAF - Web Application Firewall', description: 'Protect web applications from attacks' },
          { value: 'shield', label: 'Shield - DDoS Protection', description: 'DDoS protection service' },
          { value: 'guardduty', label: 'GuardDuty - Threat Detection', description: 'Intelligent threat detection service' },
          { value: 'security-hub', label: 'Security Hub - Security Posture', description: 'Central security findings management' }
        ],
        serverless: [
          { value: 'lambda', label: 'Lambda - Functions', description: 'Run code without thinking about servers' },
          { value: 'step-functions', label: 'Step Functions - Workflows', description: 'Coordinate multiple AWS services' },
          { value: 'eventbridge', label: 'EventBridge - Event Bus', description: 'Serverless event bus service' },
          { value: 'sqs', label: 'SQS - Message Queue', description: 'Managed message queuing service' },
          { value: 'sns', label: 'SNS - Notifications', description: 'Pub/sub messaging service' },
          { value: 'api-gateway-v2', label: 'API Gateway v2 - HTTP APIs', description: 'Build RESTful APIs and WebSocket APIs' }
        ],
        analytics: [
          { value: 'kinesis', label: 'Kinesis - Data Streaming', description: 'Real-time streaming data platform' },
          { value: 'athena', label: 'Athena - Query Service', description: 'Query data in S3 using SQL' },
          { value: 'emr', label: 'EMR - Big Data Platform', description: 'Cloud big data platform' },
          { value: 'glue', label: 'Glue - ETL Service', description: 'Serverless data integration service' },
          { value: 'quicksight', label: 'QuickSight - Business Intelligence', description: 'Fast business analytics service' },
          { value: 'data-pipeline', label: 'Data Pipeline - Data Processing', description: 'Process and move data between services' }
        ],
        ml: [
          { value: 'bedrock', label: 'Bedrock - Generative AI', description: 'Build and scale generative AI applications' },
          { value: 'sagemaker', label: 'SageMaker - ML Platform', description: 'Build, train, and deploy ML models' },
          { value: 'comprehend', label: 'Comprehend - NLP', description: 'Natural language processing service' },
          { value: 'rekognition', label: 'Rekognition - Computer Vision', description: 'Add image and video analysis' },
          { value: 'textract', label: 'Textract - Document Analysis', description: 'Extract text and data from documents' },
          { value: 'polly', label: 'Polly - Text-to-Speech', description: 'Turn text into lifelike speech' }
        ]
      },
      gcp: {
        compute: [
          { value: 'compute-engine', label: 'Compute Engine - VMs', description: 'Scalable virtual machines' },
          { value: 'gke', label: 'GKE - Kubernetes Engine', description: 'Managed Kubernetes service' },
          { value: 'cloud-run', label: 'Cloud Run - Containers', description: 'Fully managed serverless platform' },
          { value: 'app-engine', label: 'App Engine - Platform', description: 'Build scalable web applications' },
          { value: 'batch', label: 'Batch - Job Scheduling', description: 'Fully managed batch service' },
          { value: 'vmware-engine', label: 'VMware Engine', description: 'VMware workloads in Google Cloud' }
        ],
        storage: [
          { value: 'cloud-storage', label: 'Cloud Storage - Object Storage', description: 'Unified object storage' },
          { value: 'persistent-disk', label: 'Persistent Disk - Block Storage', description: 'High-performance block storage' },
          { value: 'filestore', label: 'Filestore - File Storage', description: 'Fully managed NFS file shares' },
          { value: 'archive', label: 'Archive Storage', description: 'Long-term data archival' },
          { value: 'transfer-service', label: 'Transfer Service', description: 'Data transfer to Cloud Storage' }
        ],
        database: [
          { value: 'cloud-sql', label: 'Cloud SQL - Relational DB', description: 'Fully managed relational databases' },
          { value: 'firestore', label: 'Firestore - NoSQL DB', description: 'NoSQL document database' },
          { value: 'bigtable', label: 'Bigtable - Wide-column DB', description: 'NoSQL wide-column database' },
          { value: 'spanner', label: 'Spanner - Global SQL DB', description: 'Globally distributed relational database' },
          { value: 'memorystore', label: 'Memorystore - In-Memory DB', description: 'Fully managed Redis and Memcached' },
          { value: 'datastore', label: 'Datastore - NoSQL DB', description: 'Highly scalable NoSQL database' }
        ],
        networking: [
          { value: 'vpc', label: 'VPC - Virtual Private Cloud', description: 'Global virtual network' },
          { value: 'cloud-cdn', label: 'Cloud CDN', description: 'Content delivery network' },
          { value: 'cloud-dns', label: 'Cloud DNS', description: 'Reliable, resilient DNS' },
          { value: 'load-balancer', label: 'Load Balancer', description: 'Distribute traffic across instances' },
          { value: 'cloud-nat', label: 'Cloud NAT', description: 'Network address translation service' },
          { value: 'interconnect', label: 'Cloud Interconnect', description: 'Connect your infrastructure to Google Cloud' }
        ],
        security: [
          { value: 'iam', label: 'IAM - Identity Management', description: 'Identity and access management' },
          { value: 'kms', label: 'KMS - Key Management', description: 'Cryptographic key management' },
          { value: 'secret-manager', label: 'Secret Manager', description: 'Store API keys, passwords, certificates' },
          { value: 'security-command-center', label: 'Security Command Center', description: 'Security insights and threat detection' },
          { value: 'binary-authorization', label: 'Binary Authorization', description: 'Deploy-time security controls' }
        ],
        serverless: [
          { value: 'cloud-functions', label: 'Cloud Functions', description: 'Event-driven serverless compute' },
          { value: 'pub-sub', label: 'Pub/Sub - Messaging', description: 'Asynchronous messaging service' },
          { value: 'workflows', label: 'Workflows', description: 'Orchestrate Google Cloud services' },
          { value: 'eventarc', label: 'Eventarc - Event Management', description: 'Event-driven architectures' },
          { value: 'scheduler', label: 'Cloud Scheduler', description: 'Fully managed cron job service' }
        ],
        analytics: [
          { value: 'bigquery', label: 'BigQuery - Data Warehouse', description: 'Serverless data warehouse' },
          { value: 'dataflow', label: 'Dataflow - Stream Processing', description: 'Stream and batch data processing' },
          { value: 'dataproc', label: 'Dataproc - Managed Hadoop', description: 'Managed Apache Spark and Hadoop' },
          { value: 'data-fusion', label: 'Data Fusion - Data Integration', description: 'Cloud-native data integration' },
          { value: 'looker', label: 'Looker - Business Intelligence', description: 'Modern BI and data platform' }
        ],
        ml: [
          { value: 'vertex-ai', label: 'Vertex AI - ML Platform', description: 'Unified ML platform' },
          { value: 'automl', label: 'AutoML - Custom Models', description: 'Custom machine learning models' },
          { value: 'translation', label: 'Translation AI', description: 'Detect and translate text' },
          { value: 'vision-api', label: 'Vision API', description: 'Image analysis and recognition' },
          { value: 'speech-api', label: 'Speech-to-Text', description: 'Convert audio to text' },
          { value: 'natural-language', label: 'Natural Language AI', description: 'Text analysis and sentiment' }
        ]
      },
      azure: {
        compute: [
          { value: 'virtual-machines', label: 'Virtual Machines', description: 'Linux and Windows virtual machines' },
          { value: 'aks', label: 'AKS - Kubernetes Service', description: 'Managed Kubernetes service' },
          { value: 'container-instances', label: 'Container Instances', description: 'Run containers without managing servers' },
          { value: 'app-service', label: 'App Service', description: 'Build and host web apps' },
          { value: 'batch', label: 'Batch - Job Scheduling', description: 'Cloud-scale job scheduling' },
          { value: 'service-fabric', label: 'Service Fabric', description: 'Microservices platform' }
        ],
        storage: [
          { value: 'blob-storage', label: 'Blob Storage - Object Storage', description: 'Massively scalable object storage' },
          { value: 'disk-storage', label: 'Disk Storage', description: 'High-performance managed disks' },
          { value: 'file-storage', label: 'File Storage', description: 'Fully managed file shares' },
          { value: 'archive-storage', label: 'Archive Storage', description: 'Long-term data archival' },
          { value: 'data-lake', label: 'Data Lake Storage', description: 'Secure data lake for big data analytics' }
        ],
        database: [
          { value: 'sql-database', label: 'SQL Database', description: 'Managed relational SQL database' },
          { value: 'cosmos-db', label: 'Cosmos DB - NoSQL', description: 'Globally distributed NoSQL database' },
          { value: 'postgresql', label: 'PostgreSQL', description: 'Managed PostgreSQL database' },
          { value: 'mysql', label: 'MySQL', description: 'Managed MySQL database' },
          { value: 'redis-cache', label: 'Redis Cache', description: 'In-memory data store' },
          { value: 'synapse', label: 'Synapse Analytics', description: 'Analytics service' }
        ],
        networking: [
          { value: 'virtual-network', label: 'Virtual Network', description: 'Private network in Azure' },
          { value: 'cdn', label: 'CDN', description: 'Content delivery network' },
          { value: 'dns', label: 'DNS', description: 'Domain name system' },
          { value: 'load-balancer', label: 'Load Balancer', description: 'Distribute network traffic' },
          { value: 'application-gateway', label: 'Application Gateway', description: 'Web traffic load balancer' },
          { value: 'expressroute', label: 'ExpressRoute', description: 'Private connection to Azure' }
        ],
        security: [
          { value: 'active-directory', label: 'Active Directory', description: 'Identity and access management' },
          { value: 'key-vault', label: 'Key Vault', description: 'Safeguard cryptographic keys and secrets' },
          { value: 'security-center', label: 'Security Center', description: 'Unified security management' },
          { value: 'sentinel', label: 'Sentinel - SIEM', description: 'Cloud-native SIEM service' },
          { value: 'ddos-protection', label: 'DDoS Protection', description: 'Protect applications from DDoS attacks' }
        ],
        serverless: [
          { value: 'functions', label: 'Azure Functions', description: 'Serverless compute service' },
          { value: 'logic-apps', label: 'Logic Apps', description: 'Automate workflows and processes' },
          { value: 'service-bus', label: 'Service Bus', description: 'Enterprise messaging service' },
          { value: 'event-grid', label: 'Event Grid', description: 'Event routing service' },
          { value: 'event-hubs', label: 'Event Hubs', description: 'Big data streaming platform' }
        ],
        analytics: [
          { value: 'synapse-analytics', label: 'Synapse Analytics', description: 'Analytics service' },
          { value: 'data-factory', label: 'Data Factory', description: 'Data integration service' },
          { value: 'stream-analytics', label: 'Stream Analytics', description: 'Real-time analytics' },
          { value: 'hdinsight', label: 'HDInsight', description: 'Managed Apache Hadoop, Spark' },
          { value: 'power-bi', label: 'Power BI', description: 'Business analytics solution' }
        ],
        ml: [
          { value: 'openai', label: 'Azure OpenAI', description: 'OpenAI models on Azure' },
          { value: 'cognitive-services', label: 'Cognitive Services', description: 'AI services and APIs' },
          { value: 'ml-studio', label: 'ML Studio', description: 'Machine learning workspace' },
          { value: 'bot-service', label: 'Bot Service', description: 'Intelligent bot service' },
          { value: 'form-recognizer', label: 'Form Recognizer', description: 'Extract data from documents' }
        ]
      },
      oracle: {
        compute: [
          { value: 'compute', label: 'Compute Instances', description: 'Virtual machines and bare metal servers' },
          { value: 'container-engine', label: 'Container Engine', description: 'Managed Kubernetes service' },
          { value: 'functions', label: 'Oracle Functions', description: 'Serverless platform' },
          { value: 'digital-assistant', label: 'Digital Assistant', description: 'AI-powered conversational platform' },
          { value: 'resource-manager', label: 'Resource Manager', description: 'Infrastructure as code service' }
        ],
        storage: [
          { value: 'object-storage', label: 'Object Storage', description: 'Internet-scale object storage' },
          { value: 'block-storage', label: 'Block Storage', description: 'High-performance block storage' },
          { value: 'file-storage', label: 'File Storage', description: 'Shared file system service' },
          { value: 'archive-storage', label: 'Archive Storage', description: 'Long-term data archival' },
          { value: 'data-transfer', label: 'Data Transfer Service', description: 'Migrate data to Oracle Cloud' }
        ],
        database: [
          { value: 'autonomous-db', label: 'Autonomous Database', description: 'Self-driving, self-securing database' },
          { value: 'mysql', label: 'MySQL HeatWave', description: 'MySQL database service' },
          { value: 'nosql', label: 'NoSQL Database', description: 'Multi-model NoSQL database' },
          { value: 'goldengate', label: 'GoldenGate', description: 'Real-time data integration' },
          { value: 'database-migration', label: 'Database Migration', description: 'Migrate databases to Oracle Cloud' }
        ],
        networking: [
          { value: 'vcn', label: 'Virtual Cloud Network', description: 'Software-defined network' },
          { value: 'load-balancer', label: 'Load Balancer', description: 'Distribute traffic across instances' },
          { value: 'dns', label: 'DNS', description: 'Domain name system service' },
          { value: 'fastconnect', label: 'FastConnect', description: 'Dedicated network connectivity' },
          { value: 'internet-gateway', label: 'Internet Gateway', description: 'Connect VCN to internet' }
        ],
        security: [
          { value: 'identity-management', label: 'Identity and Access Management', description: 'Control access to resources' },
          { value: 'key-management', label: 'Key Management', description: 'Centralized key management' },
          { value: 'vault', label: 'Vault', description: 'Secrets management service' },
          { value: 'security-zones', label: 'Security Zones', description: 'Security policy enforcement' },
          { value: 'cloud-guard', label: 'Cloud Guard', description: 'Cloud security posture management' }
        ],
        serverless: [
          { value: 'functions', label: 'Functions', description: 'Event-driven serverless platform' },
          { value: 'api-gateway', label: 'API Gateway', description: 'Fully managed API gateway' },
          { value: 'events', label: 'Events', description: 'Event-driven architecture service' },
          { value: 'streaming', label: 'Streaming', description: 'Real-time data streaming' }
        ],
        analytics: [
          { value: 'analytics-cloud', label: 'Analytics Cloud', description: 'Self-service analytics platform' },
          { value: 'data-integration', label: 'Data Integration', description: 'Data integration platform' },
          { value: 'data-science', label: 'Data Science', description: 'Collaborative data science platform' },
          { value: 'big-data', label: 'Big Data Service', description: 'Hadoop-based big data service' }
        ],
        ml: [
          { value: 'ai-services', label: 'AI Services', description: 'Pre-built AI capabilities' },
          { value: 'data-science', label: 'Data Science', description: 'Build and deploy ML models' },
          { value: 'digital-assistant', label: 'Digital Assistant', description: 'Conversational AI platform' },
          { value: 'language', label: 'Language', description: 'Natural language processing' }
        ]
      }
    };
    
    const categoryServices = services[data.provider]?.[selectedCategory] || [];
    return categoryServices.filter(service => 
      service.label.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      service.description.toLowerCase().includes(serviceSearch.toLowerCase())
    );
  };

  const getRegions = () => {
    const regions = {
      aws: [
        { value: 'us-east-1', label: 'US East (N. Virginia)', latency: '5ms' },
        { value: 'us-east-2', label: 'US East (Ohio)', latency: '8ms' },
        { value: 'us-west-1', label: 'US West (N. California)', latency: '12ms' },
        { value: 'us-west-2', label: 'US West (Oregon)', latency: '15ms' },
        { value: 'eu-west-1', label: 'Europe (Ireland)', latency: '45ms' },
        { value: 'eu-central-1', label: 'Europe (Frankfurt)', latency: '50ms' },
        { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)', latency: '180ms' },
        { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)', latency: '150ms' }
      ],
      gcp: [
        { value: 'us-central1', label: 'US Central (Iowa)', latency: '10ms' },
        { value: 'us-east1', label: 'US East (S. Carolina)', latency: '8ms' },
        { value: 'us-west1', label: 'US West (Oregon)', latency: '15ms' },
        { value: 'europe-west1', label: 'Europe West (Belgium)', latency: '48ms' },
        { value: 'europe-west2', label: 'Europe West (London)', latency: '42ms' },
        { value: 'asia-southeast1', label: 'Asia Southeast (Singapore)', latency: '180ms' },
        { value: 'asia-northeast1', label: 'Asia Northeast (Tokyo)', latency: '150ms' }
      ],
      azure: [
        { value: 'eastus', label: 'East US', latency: '5ms' },
        { value: 'eastus2', label: 'East US 2', latency: '7ms' },
        { value: 'westus2', label: 'West US 2', latency: '15ms' },
        { value: 'centralus', label: 'Central US', latency: '12ms' },
        { value: 'westeurope', label: 'West Europe', latency: '45ms' },
        { value: 'northeurope', label: 'North Europe', latency: '48ms' },
        { value: 'southeastasia', label: 'Southeast Asia', latency: '180ms' },
        { value: 'japaneast', label: 'Japan East', latency: '150ms' }
      ],
      oracle: [
        { value: 'us-ashburn-1', label: 'US East (Ashburn)', latency: '5ms' },
        { value: 'us-phoenix-1', label: 'US West (Phoenix)', latency: '15ms' },
        { value: 'eu-frankfurt-1', label: 'EU Central (Frankfurt)', latency: '50ms' },
        { value: 'uk-london-1', label: 'UK South (London)', latency: '42ms' },
        { value: 'ap-tokyo-1', label: 'Asia Pacific (Tokyo)', latency: '150ms' }
      ]
    };
    return regions[data.provider] || [];
  };

  const getAvailabilityZones = () => {
    if (!selectedRegion) return [];
    return [
      { value: `${selectedRegion}a`, label: `${selectedRegion}a` },
      { value: `${selectedRegion}b`, label: `${selectedRegion}b` },
      { value: `${selectedRegion}c`, label: `${selectedRegion}c` }
    ];
  };

  const getInstanceTypes = () => {
    if (!selectedCategory || !['compute', 'database'].includes(selectedCategory)) return [];
    
    const instanceTypes = {
      aws: [
        // General Purpose
        { value: 't3.nano', label: 't3.nano (2 vCPU, 0.5 GB RAM) - Burstable', family: 'General Purpose' },
        { value: 't3.micro', label: 't3.micro (2 vCPU, 1 GB RAM) - Burstable', family: 'General Purpose' },
        { value: 't3.small', label: 't3.small (2 vCPU, 2 GB RAM) - Burstable', family: 'General Purpose' },
        { value: 't3.medium', label: 't3.medium (2 vCPU, 4 GB RAM) - Burstable', family: 'General Purpose' },
        { value: 'm5.large', label: 'm5.large (2 vCPU, 8 GB RAM)', family: 'General Purpose' },
        { value: 'm5.xlarge', label: 'm5.xlarge (4 vCPU, 16 GB RAM)', family: 'General Purpose' },
        { value: 'm5.2xlarge', label: 'm5.2xlarge (8 vCPU, 32 GB RAM)', family: 'General Purpose' },
        // Compute Optimized
        { value: 'c5.large', label: 'c5.large (2 vCPU, 4 GB RAM) - Compute Optimized', family: 'Compute Optimized' },
        { value: 'c5.xlarge', label: 'c5.xlarge (4 vCPU, 8 GB RAM) - Compute Optimized', family: 'Compute Optimized' },
        { value: 'c5.2xlarge', label: 'c5.2xlarge (8 vCPU, 16 GB RAM) - Compute Optimized', family: 'Compute Optimized' },
        // Memory Optimized
        { value: 'r5.large', label: 'r5.large (2 vCPU, 16 GB RAM) - Memory Optimized', family: 'Memory Optimized' },
        { value: 'r5.xlarge', label: 'r5.xlarge (4 vCPU, 32 GB RAM) - Memory Optimized', family: 'Memory Optimized' },
        { value: 'x1e.xlarge', label: 'x1e.xlarge (4 vCPU, 122 GB RAM) - High Memory', family: 'Memory Optimized' }
      ],
      gcp: [
        { value: 'e2-micro', label: 'e2-micro (0.25-2 vCPU, 1 GB RAM) - Shared-core', family: 'General Purpose' },
        { value: 'e2-small', label: 'e2-small (0.5-2 vCPU, 2 GB RAM) - Shared-core', family: 'General Purpose' },
        { value: 'e2-medium', label: 'e2-medium (1-2 vCPU, 4 GB RAM) - Shared-core', family: 'General Purpose' },
        { value: 'n2-standard-2', label: 'n2-standard-2 (2 vCPU, 8 GB RAM)', family: 'General Purpose' },
        { value: 'n2-standard-4', label: 'n2-standard-4 (4 vCPU, 16 GB RAM)', family: 'General Purpose' },
        { value: 'n2-standard-8', label: 'n2-standard-8 (8 vCPU, 32 GB RAM)', family: 'General Purpose' },
        { value: 'n2-highmem-2', label: 'n2-highmem-2 (2 vCPU, 16 GB RAM) - Memory Optimized', family: 'Memory Optimized' },
        { value: 'n2-highmem-4', label: 'n2-highmem-4 (4 vCPU, 32 GB RAM) - Memory Optimized', family: 'Memory Optimized' },
        { value: 'c2-standard-4', label: 'c2-standard-4 (4 vCPU, 16 GB RAM) - Compute Optimized', family: 'Compute Optimized' }
      ],
      azure: [
        { value: 'Standard_B1s', label: 'B1s (1 vCPU, 1 GB RAM) - Burstable', family: 'General Purpose' },
        { value: 'Standard_B2s', label: 'B2s (2 vCPU, 4 GB RAM) - Burstable', family: 'General Purpose' },
        { value: 'Standard_D2s_v3', label: 'D2s v3 (2 vCPU, 8 GB RAM)', family: 'General Purpose' },
        { value: 'Standard_D4s_v3', label: 'D4s v3 (4 vCPU, 16 GB RAM)', family: 'General Purpose' },
        { value: 'Standard_D8s_v3', label: 'D8s v3 (8 vCPU, 32 GB RAM)', family: 'General Purpose' },
        { value: 'Standard_F2s_v2', label: 'F2s v2 (2 vCPU, 4 GB RAM) - Compute Optimized', family: 'Compute Optimized' },
        { value: 'Standard_F4s_v2', label: 'F4s v2 (4 vCPU, 8 GB RAM) - Compute Optimized', family: 'Compute Optimized' },
        { value: 'Standard_E2s_v3', label: 'E2s v3 (2 vCPU, 16 GB RAM) - Memory Optimized', family: 'Memory Optimized' }
      ],
      oracle: [
        { value: 'VM.Standard2.1', label: 'VM.Standard2.1 (1 OCPU, 15 GB RAM)', family: 'General Purpose' },
        { value: 'VM.Standard2.2', label: 'VM.Standard2.2 (2 OCPU, 30 GB RAM)', family: 'General Purpose' },
        { value: 'VM.Standard2.4', label: 'VM.Standard2.4 (4 OCPU, 60 GB RAM)', family: 'General Purpose' },
        { value: 'VM.Standard.E3.Flex', label: 'VM.Standard.E3.Flex (Flexible)', family: 'General Purpose' },
        { value: 'VM.DenseIO2.8', label: 'VM.DenseIO2.8 (8 OCPU, 120 GB RAM) - Storage Optimized', family: 'Storage Optimized' }
      ]
    };
    return instanceTypes[data.provider] || [];
  };

  const getPricingModels = () => {
    const models = {
      aws: [
        { value: 'on-demand', label: 'On-Demand', description: 'Pay for compute capacity by the hour or second' },
        { value: 'reserved', label: 'Reserved Instances', description: 'Up to 75% discount for 1-3 year commitment' },
        { value: 'spot', label: 'Spot Instances', description: 'Up to 90% discount for interruptible workloads' },
        { value: 'savings-plans', label: 'Savings Plans', description: 'Flexible pricing model for consistent usage' }
      ],
      gcp: [
        { value: 'on-demand', label: 'On-Demand', description: 'Pay-as-you-go pricing' },
        { value: 'preemptible', label: 'Preemptible VMs', description: 'Up to 80% discount for interruptible workloads' },
        { value: 'committed-use', label: 'Committed Use Discounts', description: '1-3 year commitment discounts' },
        { value: 'sustained-use', label: 'Sustained Use Discounts', description: 'Automatic discounts for sustained usage' }
      ],
      azure: [
        { value: 'on-demand', label: 'Pay-as-you-go', description: 'Pay for what you use' },
        { value: 'reserved', label: 'Reserved Instances', description: '1-3 year reservations for discounts' },
        { value: 'spot', label: 'Spot VMs', description: 'Deep discounts for evictable VMs' },
        { value: 'dev-test', label: 'Dev/Test Pricing', description: 'Discounted rates for development' }
      ],
      oracle: [
        { value: 'on-demand', label: 'Pay-as-you-go', description: 'Hourly billing with no commitments' },
        { value: 'monthly-flex', label: 'Monthly Flex', description: 'Monthly universal credits' },
        { value: 'annual-flex', label: 'Annual Flex', description: 'Annual universal credits with discount' }
      ]
    };
    return models[data.provider] || [];
  };

  const getStorageTypes = () => {
    const storageTypes = {
      aws: [
        { value: 'gp3', label: 'gp3 - General Purpose SSD', performance: '3,000-16,000 IOPS' },
        { value: 'gp2', label: 'gp2 - General Purpose SSD', performance: '3-10,000 IOPS' },
        { value: 'io2', label: 'io2 - Provisioned IOPS SSD', performance: 'Up to 64,000 IOPS' },
        { value: 'io1', label: 'io1 - Provisioned IOPS SSD', performance: 'Up to 32,000 IOPS' },
        { value: 'st1', label: 'st1 - Throughput Optimized HDD', performance: '500 MB/s' },
        { value: 'sc1', label: 'sc1 - Cold HDD', performance: '250 MB/s' }
      ],
      gcp: [
        { value: 'pd-standard', label: 'Standard Persistent Disk', performance: 'Good for sequential I/O' },
        { value: 'pd-ssd', label: 'SSD Persistent Disk', performance: 'Higher IOPS and lower latency' },
        { value: 'pd-balanced', label: 'Balanced Persistent Disk', performance: 'Balance of performance and cost' },
        { value: 'pd-extreme', label: 'Extreme Persistent Disk', performance: 'Highest performance' }
      ],
      azure: [
        { value: 'standard-hdd', label: 'Standard HDD', performance: 'Low-cost disk storage' },
        { value: 'standard-ssd', label: 'Standard SSD', performance: 'Consistent performance' },
        { value: 'premium-ssd', label: 'Premium SSD', performance: 'High-performance SSD' },
        { value: 'ultra-ssd', label: 'Ultra SSD', performance: 'Highest performance and IOPS' }
      ],
      oracle: [
        { value: 'balanced', label: 'Balanced', performance: '60 IOPS per GB' },
        { value: 'higher-performance', label: 'Higher Performance', performance: '75 IOPS per GB' },
        { value: 'ultra-high-performance', label: 'Ultra High Performance', performance: '100 IOPS per GB' }
      ]
    };
    return storageTypes[data.provider] || [];
  };

  const shouldShowInstanceTypes = selectedCategory === 'compute' || (selectedCategory === 'database' && ['rds', 'cloud-sql', 'sql-database', 'autonomous-db'].includes(selectedService));
  const shouldShowStorage = ['storage', 'database', 'compute'].includes(selectedCategory);
  const shouldShowNetworking = ['compute', 'database'].includes(selectedCategory);
  const shouldShowScaling = selectedCategory === 'compute';

  return (
    <TooltipProvider>
      <Card className="min-w-[380px] border-blue-200 bg-blue-50">
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
            <TabsList className="grid w-full grid-cols-4 h-7">
              <TabsTrigger value="service" className="text-xs">Service</TabsTrigger>
              <TabsTrigger value="config" className="text-xs">Config</TabsTrigger>
              <TabsTrigger value="networking" className="text-xs">Network</TabsTrigger>
              <TabsTrigger value="scaling" className="text-xs">Scaling</TabsTrigger>
            </TabsList>
            
            <TabsContent value="service" className="space-y-3 mt-2">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
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
                <>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Search Services</label>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="Search services..."
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        className="h-7 text-xs pl-7"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Service</label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50 max-h-60">
                        {getServicesForCategory().map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            <div className="flex items-center justify-between w-full">
                              <span className="truncate">{service.label}</span>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-gray-400 ml-2 flex-shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs max-w-xs">{service.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="config" className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Region</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {getRegions().map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          <div className="flex items-center justify-between">
                            <span className="truncate">{region.label}</span>
                            <Badge variant="outline" className="text-xs ml-2">{region.latency}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">AZ</label>
                  <Select value={selectedAvailabilityZone} onValueChange={setSelectedAvailabilityZone}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select AZ" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {getAvailabilityZones().map((az) => (
                        <SelectItem key={az.value} value={az.value}>
                          {az.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Pricing Model</label>
                <Select value={selectedPricingModel} onValueChange={setSelectedPricingModel}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select pricing" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {getPricingModels().map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div>
                          <div className="font-medium">{model.label}</div>
                          <div className="text-xs text-gray-500">{model.description}</div>
                        </div>
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
                    <SelectContent className="bg-white z-50 max-h-60">
                      {getInstanceTypes().map((instance) => (
                        <SelectItem key={instance.value} value={instance.value}>
                          <div>
                            <div className="font-medium text-xs">{instance.label}</div>
                            <div className="text-xs text-gray-500">{instance.family}</div>
                          </div>
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
                      <SelectContent className="bg-white z-50">
                        {getStorageTypes().map((storage) => (
                          <SelectItem key={storage.value} value={storage.value}>
                            <div>
                              <div className="font-medium text-xs">{storage.label}</div>
                              <div className="text-xs text-gray-500">{storage.performance}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="networking" className="space-y-3 mt-2">
              {shouldShowNetworking && (
                <>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">VPC/VNet</label>
                    <Input
                      placeholder="VPC ID or name"
                      value={networkingConfig.vpc}
                      onChange={(e) => setNetworkingConfig({...networkingConfig, vpc: e.target.value})}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Subnet</label>
                    <Input
                      placeholder="Subnet ID or name"
                      value={networkingConfig.subnet}
                      onChange={(e) => setNetworkingConfig({...networkingConfig, subnet: e.target.value})}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Security Group</label>
                    <Input
                      placeholder="Security group ID"
                      value={networkingConfig.securityGroup}
                      onChange={(e) => setNetworkingConfig({...networkingConfig, securityGroup: e.target.value})}
                      className="h-7 text-xs"
                    />
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="scaling" className="space-y-3 mt-2">
              {shouldShowScaling && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Min Instances</label>
                      <Input
                        type="number"
                        min="1"
                        value={scalingConfig.minInstances}
                        onChange={(e) => setScalingConfig({...scalingConfig, minInstances: parseInt(e.target.value) || 1})}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Max Instances</label>
                      <Input
                        type="number"
                        min="1"
                        value={scalingConfig.maxInstances}
                        onChange={(e) => setScalingConfig({...scalingConfig, maxInstances: parseInt(e.target.value) || 1})}
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoscale"
                      checked={scalingConfig.autoScale}
                      onChange={(e) => setScalingConfig({...scalingConfig, autoScale: e.target.checked})}
                      className="h-3 w-3"
                    />
                    <label htmlFor="autoscale" className="text-xs text-gray-700">Enable Auto Scaling</label>
                  </div>
                </>
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
                <span className="font-medium">{getServicesForCategory().find(s => s.value === selectedService)?.label?.split(' - ')[0]}</span>
              </div>
              {selectedRegion && (
                <div className="flex items-center justify-between">
                  <span>Region:</span>
                  <span className="font-medium">{selectedRegion}</span>
                </div>
              )}
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
    </TooltipProvider>
  );
};

export default CloudProviderNode;
