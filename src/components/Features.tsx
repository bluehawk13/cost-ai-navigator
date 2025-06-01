
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Zap, 
  Target, 
  BarChart3, 
  Cog, 
  DollarSign,
  TrendingUp,
  Shield,
  Clock,
  Lightbulb
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "Intelligent Orchestration",
      description: "Understands your queries and routes to specialized agents for expert-level responses",
      color: "blue",
      badge: "Core Feature"
    },
    {
      icon: DollarSign,
      title: "Cost Efficiency",
      description: "Finds the best AI models and deployment architectures to minimize your expenses",
      color: "green",
      badge: "Money Saver"
    },
    {
      icon: Target,
      title: "Action Cost Transparency",
      description: "Breaks down token and credit consumption with detailed cost analysis",
      color: "purple",
      badge: "Analytics"
    },
    {
      icon: BarChart3,
      title: "ROI Analysis",
      description: "Calculates savings and payback periods to justify your AI investments",
      color: "orange",
      badge: "Business Intelligence"
    },
    {
      icon: Cog,
      title: "Business Automation",
      description: "Identifies workflows for AI automation to maximize efficiency and reduce costs",
      color: "indigo",
      badge: "Automation"
    },
    {
      icon: TrendingUp,
      title: "Performance Optimization",
      description: "Continuously monitors and optimizes your AI deployments for better performance",
      color: "emerald",
      badge: "Performance"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600 border-blue-200",
      green: "bg-green-100 text-green-600 border-green-200",
      purple: "bg-purple-100 text-purple-600 border-purple-200",
      orange: "bg-orange-100 text-orange-600 border-orange-200",
      indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
      emerald: "bg-emerald-100 text-emerald-600 border-emerald-200"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getBadgeColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      green: "bg-green-50 text-green-700 border-green-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      orange: "bg-orange-50 text-orange-700 border-orange-200",
      indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
      emerald: "bg-emerald-50 text-emerald-700 border-emerald-200"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <section id="features" className="py-5 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
            <Lightbulb className="w-4 h-4 mr-2" />
            Powerful Features
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Everything You Need to Optimize AI Costs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive suite of AI agents work together to provide you with 
            actionable insights, cost savings, and strategic recommendations.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${getColorClasses(feature.color)}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getBadgeColorClasses(feature.color)}`}
                    >
                      {feature.badge}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Additional Benefits Section */}
        <div className="mt-20 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Businesses Choose Our AI Cost Optimizer
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join hundreds of companies already saving thousands on their AI infrastructure
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Save Time</h4>
                <p className="text-gray-600">Automated analysis eliminates hours of manual cost research</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Reduce Risk</h4>
                <p className="text-gray-600">Make informed decisions with comprehensive cost analysis</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Scale Smart</h4>
                <p className="text-gray-600">Optimize costs as you grow your AI implementations</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
