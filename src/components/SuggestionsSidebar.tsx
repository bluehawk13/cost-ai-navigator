
import React from 'react';
import { Agent } from '@/config/agents';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, MessageSquare, Lightbulb, ArrowRight } from 'lucide-react';

interface SuggestionsSidebarProps {
  selectedAgent: Agent;
  isOpen: boolean;
  onClose: () => void;
  onSuggestionClick: (suggestion: string) => void;
}

const SuggestionsSidebar: React.FC<SuggestionsSidebarProps> = ({
  selectedAgent,
  isOpen,
  onClose,
  onSuggestionClick
}) => {
  if (!isOpen) return null;

  const IconComponent = selectedAgent.ui.icon;

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
    // Don't close the sidebar - let user close it manually
  };

  return (
    <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-white border-l border-gray-200 shadow-lg z-40 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedAgent.ui.gradient}`}>
              <IconComponent className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{selectedAgent.name}</h3>
              <p className="text-xs text-gray-600">AI Suggestions</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Agent Description */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
              About {selectedAgent.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-gray-600 mb-3">{selectedAgent.fullDescription}</p>
            <div className="flex flex-wrap gap-1">
              {selectedAgent.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Suggested Questions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
              Suggested Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {selectedAgent.features.suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-auto p-3 hover:bg-gray-50 group"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-start space-x-2 w-full">
                  <ArrowRight className="w-3 h-3 mt-0.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-xs text-gray-700 group-hover:text-gray-900 leading-relaxed">
                    {suggestion}
                  </span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">💡 Tips for Better Results</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2 text-xs text-gray-600">
              <li>• Be specific about your requirements</li>
              <li>• Provide context about your use case</li>
              <li>• Ask follow-up questions for clarification</li>
              <li>• Use the suggested formats above</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuggestionsSidebar;
