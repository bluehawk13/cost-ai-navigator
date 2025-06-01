
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Network, Shield, Target } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="pt-10 pb-5 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl text-white">
            <h2 className="text-4xl font-bold text-white mb-6">
              Meet Your AI Cost Optimization Manager Agent
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Our intelligent agent orchestrates a network of specialized sub-agents to analyze, optimize, 
              and streamline your AI infrastructure costs. Think of it as your dedicated AI finance team 
              that never sleeps.
            </p>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              How Our Agent Orchestration Works
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              When you ask a question or request an analysis, our AI Cost Optimization Manager Agent 
              intelligently routes your query to the most qualified specialized agents. This ensures 
              you get expert-level insights for every aspect of your AI cost optimization journey.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Intelligent Query Routing</h4>
                  <p className="text-gray-600 text-sm">Automatically directs your questions to the right expert agents</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Network className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Multi-Agent Collaboration</h4>
                  <p className="text-gray-600 text-sm">Coordinates between specialists for comprehensive solutions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Precision Optimization</h4>
                  <p className="text-gray-600 text-sm">Delivers targeted recommendations based on your specific needs</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl">
            <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Our Specialized Agent Network
            </h4>
            
            <div className="grid gap-4">
              <Card className="border-2 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Model Selection Agent</h5>
                      <p className="text-gray-600 text-sm">Finds the most cost-effective AI models for your use case</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">ROI Analysis Agent</h5>
                      <p className="text-gray-600 text-sm">Calculates savings, payback periods, and investment returns</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Network className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Automation Strategy Agent</h5>
                      <p className="text-gray-600 text-sm">Identifies workflows ready for AI automation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl text-white">
            <h3 className="text-2xl font-bold mb-4">
              Why Choose Agent Orchestration?
            </h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Instead of one-size-fits-all solutions, our orchestrated approach ensures you get 
              specialized expertise for every aspect of AI cost optimization, resulting in more 
              accurate insights and better outcomes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
