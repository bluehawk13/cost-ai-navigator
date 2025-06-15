
import React from 'react';
import { Agent } from '@/config/agents';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info, Lightbulb } from 'lucide-react';

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgent: Agent;
  onAgentSelect: (agent: Agent) => void;
  isLoading?: boolean;
  onToggleSuggestions: () => void;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({
  agents,
  selectedAgent,
  onAgentSelect,
  isLoading = false,
  onToggleSuggestions
}) => {
  return (
    <TooltipProvider>
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-2 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 flex-1">
              {agents.map((agent) => {
                const IconComponent = agent.ui.icon;
                const isSelected = selectedAgent.id === agent.id;
                
                return (
                  <div key={agent.id} className="relative">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          className={`w-full h-12 p-1.5 flex flex-col items-center justify-center space-y-0.5 transition-all duration-200 hover:scale-105 ${
                            isSelected 
                              ? `bg-gradient-to-r ${agent.ui.gradient} text-white shadow-lg` 
                              : 'hover:bg-gray-50 hover:border-gray-300'
                          }`}
                          onClick={() => onAgentSelect(agent)}
                          disabled={isLoading}
                        >
                          <IconComponent className={`w-3 h-3 ${isSelected ? 'text-white' : `text-${agent.ui.color}-600`}`} />
                          <div className="text-center">
                            <div className={`text-xs font-medium leading-tight ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                              {agent.name}
                            </div>
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs z-[60]">
                        <div className="space-y-2">
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-xs text-gray-600">{agent.fullDescription}</p>
                          <div className="text-xs">
                            <p className="font-medium mb-1">Specialties:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {agent.specialties.map((specialty, index) => (
                                <li key={index}>{specialty}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    
                    {/* Info button for detailed view */}
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-0.5 -right-0.5 w-3 h-3 p-0 rounded-full bg-white shadow-sm border z-10"
                        >
                          <Info className="w-1.5 h-1.5 text-gray-500" />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent side="bottom" className="w-80 z-[60] bg-white border shadow-lg">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${agent.ui.gradient}`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">{agent.name}</h4>
                              <p className="text-xs text-gray-600">{agent.shortDescription}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs mb-2">{agent.fullDescription}</p>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-xs mb-2">Core Specialties:</h5>
                            <div className="grid grid-cols-1 gap-1">
                              {agent.specialties.map((specialty, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                                  <span className="text-xs text-gray-600">{specialty}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-xs mb-2">Sample Queries:</h5>
                            <div className="flex flex-wrap gap-1">
                              {agent.features.suggestions.slice(0, 2).map((suggestion, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                                  {suggestion}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                );
              })}
            </div>
            
            {/* Suggestions Toggle Button - Unique styling */}
            <div className="flex-shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleSuggestions}
                    className="h-12 px-3 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white border-0 hover:from-amber-500 hover:via-orange-600 hover:to-red-600 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Lightbulb className="w-4 h-4 mr-1" />
                    <span className="font-semibold text-xs">Ideas</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Get AI suggestions for better questions</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AgentSelector;
