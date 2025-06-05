
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { 
  FileText, 
  Save, 
  Download, 
  Eye, 
  Calculator,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
  Upload,
  FileCode2,
  PanelLeftClose,
  PanelRightClose
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface WorkflowTopNavigationProps {
  onNewWorkflow: () => void;
  onSaveWorkflow: () => void;
  onExportJSON: () => void;
  onExportPDF: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
}

const WorkflowTopNavigation = ({
  onNewWorkflow,
  onSaveWorkflow,
  onExportJSON,
  onExportPDF,
  onZoomIn,
  onZoomOut,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  isDarkMode,
  onToggleDarkMode,
  leftSidebarOpen,
  rightSidebarOpen
}: WorkflowTopNavigationProps) => {
  const [templates] = useState([
    { id: 'hr', name: 'HR Automation', description: 'Resume screening and candidate matching' },
    { id: 'finance', name: 'Finance Analysis', description: 'Invoice processing and cost analysis' },
    { id: 'marketing', name: 'Marketing Pipeline', description: 'Content generation and social media automation' }
  ]);

  const handleNewWorkflow = () => {
    onNewWorkflow();
    toast({
      title: "New Workflow",
      description: "Started a new workflow canvas",
    });
  };

  const handleSaveWorkflow = () => {
    onSaveWorkflow();
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const workflow = JSON.parse(e.target?.result as string);
            toast({
              title: "Workflow Imported",
              description: `Imported workflow: ${workflow.metadata?.name || 'Unnamed'}`,
            });
          } catch (error) {
            toast({
              title: "Import Error",
              description: "Invalid workflow file format",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      toast({
        title: "Template Loaded",
        description: `Loaded ${template.name} template`,
      });
    }
  };

  const handleRunCostEstimation = () => {
    toast({
      title: "Cost Estimation",
      description: "Running cost simulation across cloud providers...",
    });
  };

  const handleExportTerraform = () => {
    toast({
      title: "Terraform Export",
      description: "Generating infrastructure-as-code configuration...",
    });
  };

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left Section - Logo and Main Menu */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">Workflow Builder</span>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </div>

        <Menubar className="border-none bg-transparent">
          {/* File Menu */}
          <MenubarMenu>
            <MenubarTrigger className="text-sm">File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleNewWorkflow}>
                New Workflow
                <MenubarShortcut>Ctrl+N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={handleSaveWorkflow}>
                Save to Supabase
                <MenubarShortcut>Ctrl+S</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={handleSaveWorkflow}>
                Save As Template
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={handleImportJSON}>
                Import JSON
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          {/* Templates Menu */}
          <MenubarMenu>
            <MenubarTrigger className="text-sm">Templates</MenubarTrigger>
            <MenubarContent>
              {templates.map((template) => (
                <MenubarItem 
                  key={template.id}
                  onClick={() => handleLoadTemplate(template.id)}
                >
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-gray-500">{template.description}</div>
                  </div>
                </MenubarItem>
              ))}
              <MenubarSeparator />
              <MenubarItem>
                Browse Community Templates
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          {/* Estimate Menu */}
          <MenubarMenu>
            <MenubarTrigger className="text-sm">Estimate</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleRunCostEstimation}>
                <Calculator className="h-4 w-4 mr-2" />
                Run Cost Simulation
              </MenubarItem>
              <MenubarItem>
                Compare Providers
              </MenubarItem>
              <MenubarItem>
                Optimization Tips
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          {/* Export Menu */}
          <MenubarMenu>
            <MenubarTrigger className="text-sm">Export</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={onExportJSON}>
                <Download className="h-4 w-4 mr-2" />
                JSON Configuration
              </MenubarItem>
              <MenubarItem onClick={onExportPDF}>
                PDF Report
              </MenubarItem>
              <MenubarItem onClick={handleExportTerraform}>
                Terraform (IaC)
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          {/* View Menu */}
          <MenubarMenu>
            <MenubarTrigger className="text-sm">View</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={onToggleLeftSidebar}>
                <PanelLeftClose className="h-4 w-4 mr-2" />
                {leftSidebarOpen ? 'Hide' : 'Show'} Component Palette
              </MenubarItem>
              <MenubarItem onClick={onToggleRightSidebar}>
                <PanelRightClose className="h-4 w-4 mr-2" />
                {rightSidebarOpen ? 'Hide' : 'Show'} Actions Panel
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={onZoomIn}>
                <ZoomIn className="h-4 w-4 mr-2" />
                Zoom In
                <MenubarShortcut>Ctrl++</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={onZoomOut}>
                <ZoomOut className="h-4 w-4 mr-2" />
                Zoom Out
                <MenubarShortcut>Ctrl+-</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={onToggleDarkMode}>
                {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Right Section - Quick Actions */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleSaveWorkflow}>
          <Save className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onToggleDarkMode}>
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default WorkflowTopNavigation;
