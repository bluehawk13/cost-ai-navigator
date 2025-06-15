
import React from 'react';
import { Agent } from '@/config/agents';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info } from 'lucide-react';

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgent: Agent;
  onAgentSelect: (agent: Agent) => void;
  isLoading?: boolean;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({
  agents,
  selectedAgent,
  onAgentSelect,
  isLoading = false
}) => {
  return (
    <TooltipProvider>
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 relative z-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {agents.map((agent) => {
              const IconComponent = agent.ui.icon;
              const isSelected = selectedAgent.id === agent.id;
              
              return (
                <div key={agent.id} className="relative">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        className={`w-full h-auto p-4 flex flex-col items-center space-y-2 transition-all duration-200 hover:scale-105 ${
                          isSelected 
                            ? `bg-gradient-to-r ${agent.ui.gradient} text-white shadow-lg` 
                            : 'hover:bg-gray-50 hover:border-gray-300'
                        }`}
                        onClick={() => onAgentSelect(agent)}
                        disabled={isLoading}
                      >
                        <IconComponent className={`w-6 h-6 ${isSelected ? 'text-white' : `text-${agent.ui.color}-600`}`} />
                        <div className="text-center">
                          <div className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                            {agent.name}
                          </div>
                          <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                            {agent.shortDescription}
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
                        className="absolute -top-1 -right-1 w-6 h-6 p-0 rounded-full bg-white shadow-sm border z-10"
                      >
                        <Info className="w-3 h-3 text-gray-500" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent side="bottom" className="w-80 z-[60] bg-white border shadow-lg">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${agent.ui.gradient}`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{agent.name}</h4>
                            <p className="text-sm text-gray-600">{agent.shortDescription}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm mb-2">{agent.fullDescription}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-sm mb-2">Core Specialties:</h5>
                          <div className="grid grid-cols-1 gap-1">
                            {agent.specialties.map((specialty, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                <span className="text-xs text-gray-600">{specialty}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-sm mb-2">Sample Queries:</h5>
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
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AgentSelector;
