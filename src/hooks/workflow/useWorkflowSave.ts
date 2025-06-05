
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SaveWorkflowParams } from './types';
import { convertNodesToDatabase, convertEdgesToDatabase } from './utils';

export const useWorkflowSave = () => {
  const [loading, setLoading] = useState(false);

  const saveWorkflow = async ({
    name,
    description,
    nodes,
    edges,
    workflowId
  }: SaveWorkflowParams): Promise<string | null> => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      // Save or update workflow
      const workflowData = {
        name,
        description,
        version: '1.0.0',
        metadata: { nodeCount: nodes.length, edgeCount: edges.length },
        user_id: user.id
      };

      let savedWorkflow;
      if (workflowId) {
        const { data, error } = await supabase
          .from('workflows')
          .update({ 
            name: workflowData.name,
            description: workflowData.description,
            version: workflowData.version,
            metadata: workflowData.metadata,
            updated_at: new Date().toISOString() 
          })
          .eq('id', workflowId)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        savedWorkflow = data;
      } else {
        const { data, error } = await supabase
          .from('workflows')
          .insert(workflowData)
          .select()
          .single();
        
        if (error) throw error;
        savedWorkflow = data;
      }

      // Delete existing nodes and edges if updating
      if (workflowId) {
        await supabase.from('workflow_nodes').delete().eq('workflow_id', workflowId);
        await supabase.from('workflow_edges').delete().eq('workflow_id', workflowId);
      }

      // Save nodes in batches
      if (nodes.length > 0) {
        const nodeData = convertNodesToDatabase(nodes, savedWorkflow.id);
        
        for (let i = 0; i < nodeData.length; i += 10) {
          const batch = nodeData.slice(i, i + 10);
          const { error: nodesError } = await supabase
            .from('workflow_nodes')
            .insert(batch);
          
          if (nodesError) throw nodesError;
        }
      }

      // Save edges in batches
      if (edges.length > 0) {
        const edgeData = convertEdgesToDatabase(edges, savedWorkflow.id);
        
        for (let i = 0; i < edgeData.length; i += 10) {
          const batch = edgeData.slice(i, i + 10);
          const { error: edgesError } = await supabase
            .from('workflow_edges')
            .insert(batch);
          
          if (edgesError) throw edgesError;
        }
      }

      toast({
        title: "Success",
        description: workflowId ? "Workflow updated successfully" : "Workflow saved successfully",
      });

      return savedWorkflow.id;

    } catch (error) {
      console.error('Error saving workflow:', error);
      toast({
        title: "Error",
        description: "Failed to save workflow",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { saveWorkflow, loading };
};
