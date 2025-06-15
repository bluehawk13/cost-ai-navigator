
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Edit3, ChevronDown, ChevronRight } from 'lucide-react';

interface NodeDescriptionProps {
  description: string;
  onDescriptionChange: (description: string) => void;
  placeholder?: string;
}

const NodeDescription = ({ description, onDescriptionChange, placeholder = "Describe what this node does in your workflow..." }: NodeDescriptionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localDescription, setLocalDescription] = useState(description);

  useEffect(() => {
    setLocalDescription(description);
  }, [description]);

  const handleSave = () => {
    onDescriptionChange(localDescription);
    setIsOpen(false);
  };

  const truncatedDescription = description.length > 40 ? description.substring(0, 40) + '...' : description;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="mt-2 pt-2 border-t border-gray-200">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-between text-xs p-1 h-6">
            <div className="flex items-center gap-1">
              <Edit3 className="h-3 w-3" />
              <span>Description</span>
            </div>
            {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>
        </CollapsibleTrigger>
        
        {!isOpen && description && (
          <div className="text-xs text-gray-600 mt-1 px-2">
            {truncatedDescription}
          </div>
        )}
        
        <CollapsibleContent className="mt-2">
          <div className="space-y-2">
            <Textarea
              value={localDescription}
              onChange={(e) => setLocalDescription(e.target.value)}
              placeholder={placeholder}
              className="text-xs min-h-[60px] resize-none"
            />
            <div className="flex gap-1">
              <Button 
                size="sm" 
                onClick={handleSave}
                className="text-xs h-6 px-2"
              >
                Save
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  setLocalDescription(description);
                  setIsOpen(false);
                }}
                className="text-xs h-6 px-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default NodeDescription;
