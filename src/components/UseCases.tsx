
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Search, Filter, TrendingUp, Sparkles, Trophy, ArrowRight, DollarSign, Clock, Users } from 'lucide-react';
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
    workflowId: 'invoice-automation'
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
    workflowId: 'ticket-routing'
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
    workflowId: 'contract-analysis'
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
    workflowId: 'resume-screening'
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
    workflowId: 'content-moderation'
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
    workflowId: 'email-optimization'
  }
];

const industries = ['All Industries', 'SaaS', 'Finance', 'Healthcare', 'E-commerce', 'Legal', 'HR Tech', 'Marketing'];
const functions = ['All Functions', 'Finance Ops', 'Customer Support', 'HR Automation', 'Legal Ops', 'Marketing Automation', 'Operations'];

const UseCases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedFunction, setSelectedFunction] = useState('All Functions');
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);

  const featuredUseCases = {
    trending: useCases.filter(uc => uc.category === 'trending'),
    new: useCases.filter(uc => uc.category === 'new'),
    topPicks: useCases.filter(uc => uc.category === 'top-picks')
  };

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

  if (selectedUseCase) {
    return <UseCaseDetail useCase={selectedUseCase} onBack={handleBackToOverview} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Automation Use Cases
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                className="pl-10"
              />
            </div>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full md:w-48">
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
              <SelectTrigger className="w-full md:w-48">
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

        {/* Featured Use Cases */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Use Cases</h2>
          </div>
          
          <div className="space-y-8">
            {/* Trending */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900">Trending</h3>
              </div>
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {featuredUseCases.trending.map((useCase) => (
                    <CarouselItem key={useCase.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <UseCaseCard useCase={useCase} onClick={() => handleUseCaseClick(useCase)} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            {/* New */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">New</h3>
              </div>
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {featuredUseCases.new.map((useCase) => (
                    <CarouselItem key={useCase.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <UseCaseCard useCase={useCase} onClick={() => handleUseCaseClick(useCase)} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            {/* Top Picks */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900">Top Picks</h3>
              </div>
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {featuredUseCases.topPicks.map((useCase) => (
                    <CarouselItem key={useCase.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <UseCaseCard useCase={useCase} onClick={() => handleUseCaseClick(useCase)} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </div>

        {/* All Use Cases Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Use Cases ({filteredUseCases.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUseCases.map((useCase) => (
              <UseCaseCard 
                key={useCase.id} 
                useCase={useCase} 
                onClick={() => handleUseCaseClick(useCase)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface UseCaseCardProps {
  useCase: UseCase;
  onClick: () => void;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ useCase, onClick }) => {
  return (
    <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-white/80 backdrop-blur-sm border-2 border-gray-200" onClick={onClick}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
          {useCase.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 line-clamp-3">
          {useCase.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Industries */}
        <div>
          <div className="flex flex-wrap gap-1 mb-2">
            {useCase.industries.slice(0, 2).map((industry) => (
              <Badge key={industry} variant="secondary" className="text-xs">
                {industry}
              </Badge>
            ))}
            {useCase.industries.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{useCase.industries.length - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Functions */}
        <div>
          <div className="flex flex-wrap gap-1 mb-2">
            {useCase.functions.map((func) => (
              <Badge key={func} variant="outline" className="text-xs">
                {func}
              </Badge>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">{useCase.estimatedCost}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700">{useCase.savings}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-gray-700">{useCase.impactTag}</span>
          </div>
        </div>

        {/* CTA */}
        <Button className="w-full mt-4" variant="outline">
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default UseCases;
