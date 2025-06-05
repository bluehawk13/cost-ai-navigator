
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SaveWorkflowParams } from './types';
import { convertNodesToDatabase, convertEdgesToDatabase } from './utils';

export const useWorkflowSave = () => {
  const [loading, setLoading] = useState(false);

  const saveWorkflow = async (params: SaveWorkflowParams): Promise<string | null> => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      let workflowId = params.workflowId;

      if (workflowId) {
        // Update existing workflow
        const { error: workflowError } = await supabase
          .from('workflows')
          .update({
            name: params.name,
            description: params.description,
            version: '1.0.0',
            metadata: { nodeCount: params.nodes.length, edgeCount: params.edges.length },
            updated_at: new Date().toISOString()
          })
          .eq('id', workflowId)
          .eq('user_id', user.id);

        if (workflowError) throw workflowError;
      } else {
        // Create new workflow
        const { data: workflowData, error: workflowError } = await supabase
          .from('workflows')
          .insert({
            name: params.name,
            description: params.description,
            version: '1.0.0',
            metadata: { nodeCount: params.nodes.length, edgeCount: params.edges.length },
            user_id: user.id
          })
          .select()
          .single();

        if (workflowError) throw workflowError;
        workflowId = workflowData.id;
      }

      // Delete existing nodes and edges
      await supabase.from('workflow_nodes').delete().eq('workflow_id', workflowId);
      await supabase.from('workflow_edges').delete().eq('workflow_id', workflowId);

      // Insert new nodes
      if (params.nodes.length > 0) {
        const nodeData = convertNodesToDatabase(params.nodes, workflowId);
        const { error: nodesError } = await supabase
          .from('workflow_nodes')
          .insert(nodeData);

        if (nodesError) throw nodesError;
      }

      // Insert new edges
      if (params.edges.length > 0) {
        const edgeData = convertEdgesToDatabase(params.edges, workflowId);
        const { error: edgesError } = await supabase
          .from('workflow_edges')
          .insert(edgeData);

        if (edgesError) throw edgesError;
      }

      toast({
        title: "Success",
        description: `Workflow "${params.name}" saved successfully`,
      });

      return workflowId;

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
