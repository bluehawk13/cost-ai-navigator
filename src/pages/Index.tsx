import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bot, Zap, Target, BarChart3, Cog, MessageSquare, ArrowRight, Star, Shield, Users, User, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatInterfaceWithSidebar from '@/components/ChatInterfaceWithSidebar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import About from '@/components/About';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl mb-4 mx-auto w-fit">
            <Bot  className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Cost Optimizer
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="home">Home</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {user ? (
                <UserMenu user={user} />
              ) : (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="home" className="mt-0">
            <div className="space-y-20 pb-0">
              <Hero onGetStarted={() => user ? setActiveTab("chat") : navigate('/auth')} />
              <About />
              <Features />
              
              {/* CTA Section */}
              <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="container mx-auto px-4 text-center">
                  <h2 className="text-4xl font-bold text-white mb-6">
                    Ready to Optimize Your AI Costs?
                  </h2>
                  <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                    {user 
                      ? "Start chatting with our AI Cost Optimization Manager Agent and discover how much you can save."
                      : "Join thousands of users who are already saving on their AI costs. Sign up now and start optimizing!"
                    }
                  </p>
                  <Button 
                    size="lg" 
                    variant="secondary"
                    onClick={() => user ? setActiveTab("chat") : navigate('/auth')}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
                  >
                    {user ? "Get Started – Go to Chat" : "Sign Up Now – It's Free"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-0">
            {user ? (
              <ChatInterfaceWithSidebar />
            ) : (
              <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full bg-white/80 backdrop-blur-sm border-2 border-gray-200 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl mb-6 mx-auto w-fit">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Authentication Required
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Please sign in to access the AI Cost Optimization chat interface and start saving on your AI costs.
                    </p>
                    <Button 
                      onClick={() => navigate('/auth')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In to Continue
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer - only show on home tab */}
      {activeTab === "home" && (
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">AI Cost Optimizer</span>
                </div>
                <p className="text-gray-400">
                  Intelligent AI cost optimization through advanced agent orchestration.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <p className="text-gray-400">support@aicostoptimizer.com</p>
                <p className="text-gray-400">+1 (555) 123-4567</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 AI Cost Optimizer. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;
