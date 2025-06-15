
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, DollarSign, CheckCircle, Zap, Users, Building2, Database, Bot, FileText, Clock, TrendingUp, Shield, AlertCircle } from 'lucide-react';

interface UseCase {
  id: string;
  title: string;
  summary: string;
  industries: string[];
  functions: string[];
  estimatedCost: string;
  savings: string;
  impactTag: string;
  workflowId?: string;
  dataSourcesUsed?: string[];
  automationSteps?: string[];
  realWorldExample?: {
    company: string;
    volume: string;
    timeSaved: string;
    costReduction: string;
  };
}

interface UseCaseDetailProps {
  useCase: UseCase;
  onBack: () => void;
  onDeploy: (workflowId: string) => void;
}

const UseCaseDetail: React.FC<UseCaseDetailProps> = ({ useCase, onBack, onDeploy }) => {
  const processSteps = useCase.automationSteps || [
    "Data Input and Collection",
    "AI Processing and Analysis", 
    "Validation and Quality Checks",
    "Output Generation and Integration"
  ];

  const dataFlowSteps = [
    {
      step: 1,
      title: "Data Ingestion",
      description: `Automated collection from ${useCase.dataSourcesUsed?.slice(0, 3).join(', ') || 'multiple sources'} with real-time monitoring and error handling.`,
      icon: Database,
      technologies: ["REST APIs", "Webhooks", "File Watchers", "Database Connectors"]
    },
    {
      step: 2,
      title: "AI Processing",
      description: "Advanced machine learning models process and analyze data with intelligent routing and parallel processing.",
      icon: Bot,
      technologies: ["GPT-4", "Claude-3", "Computer Vision", "NLP Models"]
    },
    {
      step: 3,
      title: "Quality Assurance",
      description: "Multi-layer validation ensures accuracy with confidence scoring and exception handling for edge cases.",
      icon: Shield,
      technologies: ["Validation Rules", "Confidence Scoring", "Human-in-Loop", "Audit Trails"]
    },
    {
      step: 4,
      title: "Integration & Output",
      description: "Seamless integration with existing systems through standardized APIs and customizable output formats.",
      icon: Zap,
      technologies: ["REST APIs", "GraphQL", "Webhooks", "Custom Integrations"]
    }
  ];

  const costBreakdown = [
    { item: "Data Processing", cost: "40%", amount: "$0.012/unit" },
    { item: "AI Model Usage", cost: "35%", amount: "$0.008/unit" },
    { item: "Infrastructure", cost: "15%", amount: "$0.005/unit" },
    { item: "Quality Validation", cost: "10%", amount: "$0.003/unit" },
  ];

  const performanceMetrics = [
    { 
      label: "Processing Speed", 
      value: useCase.realWorldExample?.volume || "10,000+ items/hour",
      icon: Clock,
      trend: "+35% faster than manual"
    },
    { 
      label: "Accuracy Rate", 
      value: "99.2%", 
      icon: CheckCircle,
      trend: "+15% vs baseline"
    },
    { 
      label: "Cost Reduction", 
      value: useCase.realWorldExample?.costReduction || "60-80%",
      icon: DollarSign,
      trend: "Immediate ROI"
    },
    { 
      label: "Scalability", 
      value: "100x capacity",
      icon: TrendingUp,
      trend: "Auto-scaling enabled"
    }
  ];

  const technicalRequirements = [
    {
      category: "Data Sources",
      items: useCase.dataSourcesUsed || ["File Systems", "APIs", "Databases"],
      description: "Supports multiple input formats and real-time streaming"
    },
    {
      category: "AI Models",
      items: ["GPT-4 Turbo", "Claude-3 Sonnet", "Custom Models"],
      description: "Optimized model selection based on use case requirements"
    },
    {
      category: "Infrastructure",
      items: ["AWS/Azure/GCP", "Kubernetes",  "Auto-scaling", "Load Balancing"],
      description: "Cloud-native architecture with high availability"
    },
    {
      category: "Integration",
      items: ["REST APIs", "GraphQL", "Webhooks", "Custom Connectors"],
      description: "Seamless integration with existing enterprise systems"
    }
  ];

  const realWorldCases = [
    {
      company: useCase.realWorldExample?.company || "Enterprise Client",
      industry: useCase.industries[0],
      challenge: "Manual processing bottlenecks causing delays and errors",
      solution: `Implemented ${useCase.title.toLowerCase()} with custom workflow automation`,
      results: [
        useCase.realWorldExample?.timeSaved || "80% time reduction",
        useCase.realWorldExample?.costReduction || "$500K annual savings",
        useCase.realWorldExample?.volume || "10x processing capacity",
        "99%+ accuracy improvement"
      ],
      timeline: "2-week implementation"
    }
  ];

  const handleDeployWorkflow = () => {
    if (useCase.workflowId) {
      onDeploy(useCase.workflowId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>
                Use Cases
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{useCase.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <Button variant="outline" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Use Cases
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{useCase.title}</h1>
            {useCase.workflowId && (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                <Zap className="h-3 w-3 mr-1" />
                Ready to Deploy
              </Badge>
            )}
          </div>
          <p className="text-xl text-gray-600 mb-6 max-w-4xl">{useCase.summary}</p>
          
          {/* Tags and Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-500" />
              <div>
                <span className="text-sm text-gray-500">Industries:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {useCase.industries.map((industry) => (
                    <Badge key={industry} variant="secondary" className="text-xs">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-gray-500" />
              <div>
                <span className="text-sm text-gray-500">Data Sources:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(useCase.dataSourcesUsed || []).slice(0, 3).map((source) => (
                    <Badge key={source} variant="outline" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <span className="text-sm text-gray-500">Functions:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {useCase.functions.map((func) => (
                    <Badge key={func} variant="outline" className="text-xs">
                      {func}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Data Flow Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Automation Data Flow
                </CardTitle>
                <CardDescription>
                  End-to-end data processing pipeline with real-world implementation details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dataFlowSteps.map((step, index) => (
                    <div key={step.step} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <step.icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {step.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technical Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Architecture</CardTitle>
                <CardDescription>
                  Infrastructure and integration requirements for deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {technicalRequirements.map((req, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{req.category}</h4>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {req.items.map((item) => (
                          <Badge key={item} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">{req.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Real-World Case Studies */}
            <Card>
              <CardHeader>
                <CardTitle>Implementation Success Story</CardTitle>
                <CardDescription>
                  Real customer deployment and measurable business impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {realWorldCases.map((study, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-6 py-4">
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="font-semibold text-gray-900">{study.company}</h4>
                        <Badge variant="secondary">{study.industry}</Badge>
                        <Badge variant="outline" className="text-xs">{study.timeline}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="font-medium text-gray-800 mb-2">Challenge</h5>
                          <p className="text-sm text-gray-600">{study.challenge}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-800 mb-2">Solution</h5>
                          <p className="text-sm text-gray-600">{study.solution}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Measurable Results</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {study.results.map((result, idx) => (
                            <div key={idx} className="bg-green-50 rounded-lg p-3 text-center">
                              <div className="font-semibold text-green-700 text-sm">{result}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <metric.icon className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{metric.label}</div>
                        <div className="text-xs text-gray-500">{metric.trend}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{metric.value}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Cost Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {costBreakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.item}</span>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{item.cost}</div>
                        <div className="text-xs text-gray-500">{item.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3 mt-4">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Cost per Unit</span>
                    <span className="text-blue-600">{useCase.estimatedCost}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Includes infrastructure, processing, and support
                  </div>
                </div>

                <Badge className="w-full justify-center bg-green-50 text-green-700 border-green-200">
                  {useCase.impactTag}
                </Badge>
              </CardContent>
            </Card>

            {/* Deployment CTA */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <AlertCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">Ready for Deployment</h3>
                    <p className="text-sm text-gray-600">Pre-configured workflow with enterprise-grade components</p>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={handleDeployWorkflow}
                    disabled={!useCase.workflowId}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Deploy This Workflow
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-1 h-3 w-3" />
                      Export Specs
                    </Button>
                    <Button variant="outline" size="sm">
                      <Database className="mr-1 h-3 w-3" />
                      View Schema
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Enterprise deployment includes dedicated support, SLA guarantees, and custom integration assistance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCaseDetail;
