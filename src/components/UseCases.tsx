
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ArrowRight, DollarSign, Clock, Users, Sparkles, TrendingUp } from 'lucide-react';
import UseCaseDetail from './UseCaseDetail';

interface UseCase {
  id: string;
  title: string;
  summary: string;
  industries: string[];
  functions: string[];
  estimatedCost: string;
  savings: string;
  impactTag: string;
  category: 'trending' | 'new' | 'top-picks';
  workflowId?: string;
  hoverMetric?: string;
  gradient: string;
}

const useCases: UseCase[] = [
  {
    id: '1',
    title: 'Automate Invoice Processing',
    summary: 'Extract and categorize invoice data automatically using AI document processing with 99% accuracy.',
    industries: ['Finance', 'SaaS', 'E-commerce'],
    functions: ['Finance Ops', 'Accounting'],
    estimatedCost: '$0.02 per invoice',
    savings: 'Save 85% processing time',
    impactTag: 'Reduces manual work by 90%',
    category: 'trending',
    workflowId: 'invoice-automation',
    hoverMetric: 'Saves 90% time',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    id: '2',
    title: 'Customer Support Ticket Routing',
    summary: 'Automatically categorize and route customer tickets to the right team using AI classification.',
    industries: ['SaaS', 'E-commerce', 'Healthcare'],
    functions: ['Customer Support', 'Operations'],
    estimatedCost: '$0.01 per ticket',
    savings: 'Reduce response time by 60%',
    impactTag: 'Improves customer satisfaction by 40%',
    category: 'top-picks',
    workflowId: 'ticket-routing',
    hoverMetric: 'Improves satisfaction by 40%',
    gradient: 'from-green-500 to-teal-600'
  },
  {
    id: '3',
    title: 'Contract Analysis & Review',
    summary: 'Scan legal contracts for key terms, risks, and compliance issues using advanced NLP models.',
    industries: ['Legal', 'Finance', 'Real Estate'],
    functions: ['Legal Ops', 'Compliance'],
    estimatedCost: '$0.15 per page',
    savings: 'Save 70% review time',
    impactTag: 'Reduces legal review costs by 65%',
    category: 'new',
    workflowId: 'contract-analysis',
    hoverMetric: 'Reduces costs by 65%',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: '4',
    title: 'HR Resume Screening',
    summary: 'Automatically screen resumes and rank candidates based on job requirements and qualifications.',
    industries: ['HR Tech', 'Recruiting', 'SaaS'],
    functions: ['HR Automation', 'Talent Acquisition'],
    estimatedCost: '$0.05 per resume',
    savings: 'Screen 10x faster',
    impactTag: 'Improves hiring quality by 35%',
    category: 'trending',
    workflowId: 'resume-screening',
    hoverMetric: 'Screen 10x faster',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: '5',
    title: 'Social Media Content Moderation',
    summary: 'Detect and flag inappropriate content across social platforms using AI vision and text analysis.',
    industries: ['Social Media', 'Gaming', 'Education'],
    functions: ['Content Moderation', 'Safety'],
    estimatedCost: '$0.001 per post',
    savings: 'Scale moderation 100x',
    impactTag: 'Reduces harmful content by 95%',
    category: 'top-picks',
    workflowId: 'content-moderation',
    hoverMetric: 'Scale 100x capacity',
    gradient: 'from-indigo-500 to-blue-600'
  },
  {
    id: '6',
    title: 'Email Campaign Optimization',
    summary: 'Generate personalized email content and optimize send times using AI behavioral analysis.',
    industries: ['Marketing', 'E-commerce', 'SaaS'],
    functions: ['Marketing Automation', 'Growth'],
    estimatedCost: '$0.03 per email',
    savings: 'Increase open rates by 45%',
    impactTag: 'Boosts conversion by 25%',
    category: 'new',
    workflowId: 'email-optimization',
    hoverMetric: 'Boosts conversion by 25%',
    gradient: 'from-cyan-500 to-emerald-600'
  }
];

const industries = ['All Industries', 'SaaS', 'Finance', 'Healthcare', 'E-commerce', 'Legal', 'HR Tech', 'Marketing'];
const functions = ['All Functions', 'Finance Ops', 'Customer Support', 'HR Automation', 'Legal Ops', 'Marketing Automation', 'Operations'];

const UseCases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedFunction, setSelectedFunction] = useState('All Functions');
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => prev + 1);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const filteredUseCases = useCases.filter(useCase => {
    const matchesSearch = useCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         useCase.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All Industries' || 
                           useCase.industries.includes(selectedIndustry);
    const matchesFunction = selectedFunction === 'All Functions' || 
                           useCase.functions.includes(selectedFunction);
    
    return matchesSearch && matchesIndustry && matchesFunction;
  });

  const handleUseCaseClick = (useCase: UseCase) => {
    setSelectedUseCase(useCase);
  };

  const handleBackToOverview = () => {
    setSelectedUseCase(null);
  };

  const handleDeployWorkflow = (workflowId: string) => {
    // Navigate to workflow with the specific template
    console.log(`Deploying workflow: ${workflowId}`);
    // This would typically navigate to the workflow builder with the template loaded
    window.location.href = `/workflow-builder?template=${workflowId}`;
  };

  if (selectedUseCase) {
    return <UseCaseDetail useCase={selectedUseCase} onBack={handleBackToOverview} onDeploy={handleDeployWorkflow} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            AI Automation Use Cases
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover proven AI automation examples that are saving companies millions. 
            Each use case includes cost estimates, ROI projections, and ready-to-deploy workflows.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search use cases (e.g., customer support, finance automation)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
              />
            </div>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full md:w-48 h-12 border-2 border-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedFunction} onValueChange={setSelectedFunction}>
              <SelectTrigger className="w-full md:w-48 h-12 border-2 border-gray-200">
                <SelectValue placeholder="Function" />
              </SelectTrigger>
              <SelectContent>
                {functions.map(func => (
                  <SelectItem key={func} value={func}>{func}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Auto-scrolling Carousel */}
        <div className="mb-12 overflow-hidden">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Popular Automations</h2>
          <div className="relative">
            <div 
              className="flex gap-4 transition-transform duration-75 ease-linear"
              style={{
                transform: `translateX(-${(scrollPosition * 2) % (useCases.length * 300)}px)`,
                width: `${useCases.length * 600}px`
              }}
            >
              {[...useCases, ...useCases].map((useCase, index) => (
                <CarouselCard 
                  key={`${useCase.id}-${index}`} 
                  useCase={useCase} 
                  onClick={() => {
                    const targetElement = document.getElementById(`use-case-${useCase.id}`);
                    if (targetElement) {
                      targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* All Use Cases Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            All Use Cases ({filteredUseCases.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUseCases.map((useCase) => (
              <div key={useCase.id} id={`use-case-${useCase.id}`}>
                <UseCaseCard 
                  useCase={useCase} 
                  onClick={() => handleUseCaseClick(useCase)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CarouselCardProps {
  useCase: UseCase;
  onClick: () => void;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ useCase, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex-shrink-0 w-72 h-32 cursor-pointer transition-all duration-300 transform hover:scale-105"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`h-full bg-gradient-to-r ${useCase.gradient} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
        <CardContent className="p-4 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-sm line-clamp-2">{useCase.title}</h3>
              {useCase.category === 'new' && (
                <Badge className="bg-white/20 text-white text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  New
                </Badge>
              )}
              {useCase.category === 'trending' && (
                <Badge className="bg-white/20 text-white text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
          </div>
          
          <div className={`transition-all duration-300 ${isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'}`}>
            <div className="bg-white/20 rounded-lg p-2">
              <p className="text-xs font-medium">{useCase.hoverMetric}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface UseCaseCardProps {
  useCase: UseCase;
  onClick: () => void;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ useCase, onClick }) => {
  return (
    <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 overflow-hidden group" onClick={onClick}>
      <div className={`h-2 bg-gradient-to-r ${useCase.gradient}`}></div>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {useCase.title}
          </CardTitle>
          {useCase.category === 'new' && (
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              New
            </Badge>
          )}
          {useCase.category === 'trending' && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {useCase.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Industries */}
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {useCase.industries.slice(0, 2).map((industry) => (
              <Badge key={industry} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
                {industry}
              </Badge>
            ))}
            {useCase.industries.length > 2 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                +{useCase.industries.length - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Functions */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {useCase.functions.map((func) => (
              <Badge key={func} variant="outline" className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50">
                {func}
              </Badge>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded-lg">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-green-800 font-medium">{useCase.estimatedCost}</span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800 font-medium">{useCase.savings}</span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-purple-50 p-2 rounded-lg">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-purple-800 font-medium">{useCase.impactTag}</span>
          </div>
        </div>

        {/* CTA */}
        <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium" variant="default">
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default UseCases;
