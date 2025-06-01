
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, TrendingDown, Zap } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="pt-20 pb-0 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Cost Optimization
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent leading-tight">
            Optimize Your AI Costs
            <br />
            <span className="text-blue-600">Seamlessly</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            AI-driven orchestration of cost-saving insights, ROI analysis, and AI deployment strategy. 
            Let our intelligent agents find the perfect balance between performance and cost.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg"
            >
              Get Started – Go to Chat
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg"
            >
              Learn More
            </Button>
          </div>
          
          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-6 max-w-10xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg pt-8 pb-8 pr-5 pl-5 border border-gray-200">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Save up to 60%</h3>
              <p className="text-gray-600 text-sm">Reduce AI infrastructure costs through intelligent optimization</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-lg pt-8 pb-8 pr-5 pl-5  border border-gray-200">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Analysis</h3>
              <p className="text-gray-600 text-sm">Get real-time cost breakdowns and optimization recommendations</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-lg pt-8 pb-8 pr-5 pl-5 border border-gray-200">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Automation</h3>
              <p className="text-gray-600 text-sm">Automate cost optimization across your entire AI workflow</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>
    </section>
  );
};

export default Hero;
