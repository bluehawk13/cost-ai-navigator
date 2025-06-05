
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Node, Edge } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  version: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const useWorkflows = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkflows = async () => {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setWorkflows(data || []);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      toast({
        title: "Error",
        description: "Failed to fetch workflows",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveWorkflow = async (
    name: string,
    description: string,
    nodes: Node[],
    edges: Edge[],
    workflowId?: string
  ) => {
    try {
      setLoading(true);
      
      // Save or update workflow
      const workflowData = {
        name,
        description,
        version: '1.0.0',
        metadata: { nodeCount: nodes.length, edgeCount: edges.length }
      };

      let savedWorkflow;
      if (workflowId) {
        const { data, error } = await supabase
          .from('workflows')
          .update({ ...workflowData, updated_at: new Date().toISOString() })
          .eq('id', workflowId)
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

      // Save nodes
      if (nodes.length > 0) {
        const nodeData = nodes.map(node => ({
          workflow_id: savedWorkflow.id,
          node_id: node.id,
          node_type: node.type || 'default',
          subtype: node.data?.subtype,
          label: node.data?.label || '',
          position_x: node.position.x,
          position_y: node.position.y,
          config: node.data?.config || {},
          style: node.style || {}
        }));

        const { error: nodesError } = await supabase
          .from('workflow_nodes')
          .insert(nodeData);

        if (nodesError) throw nodesError;
      }

      // Save edges
      if (edges.length > 0) {
        const edgeData = edges.map(edge => ({
          workflow_id: savedWorkflow.id,
          edge_id: edge.id,
          source_node_id: edge.source,
          target_node_id: edge.target,
          source_handle: edge.sourceHandle,
          target_handle: edge.targetHandle,
          edge_type: edge.type || 'default',
          style: edge.style || {}
        }));

        const { error: edgesError } = await supabase
          .from('workflow_edges')
          .insert(edgeData);

        if (edgesError) throw edgesError;
      }

      toast({
        title: "Success",
        description: workflowId ? "Workflow updated successfully" : "Workflow saved successfully",
      });

      await fetchWorkflows();
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

  const loadWorkflow = async (workflowId: string) => {
    try {
      setLoading(true);

      // Fetch workflow details
      const { data: workflow, error: workflowError } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', workflowId)
        .single();

      if (workflowError) throw workflowError;

      // Fetch nodes
      const { data: nodesData, error: nodesError } = await supabase
        .from('workflow_nodes')
        .select('*')
        .eq('workflow_id', workflowId);

      if (nodesError) throw nodesError;

      // Fetch edges
      const { data: edgesData, error: edgesError } = await supabase
        .from('workflow_edges')
        .select('*')
        .eq('workflow_id', workflowId);

      if (edgesError) throw edgesError;

      // Convert to React Flow format
      const nodes: Node[] = (nodesData || []).map(node => ({
        id: node.node_id,
        type: node.node_type,
        position: { x: node.position_x, y: node.position_y },
        data: {
          label: node.label,
          subtype: node.subtype,
          config: node.config
        },
        style: node.style
      }));

      const edges: Edge[] = (edgesData || []).map(edge => ({
        id: edge.edge_id,
        source: edge.source_node_id,
        target: edge.target_node_id,
        sourceHandle: edge.source_handle,
        targetHandle: edge.target_handle,
        type: edge.edge_type,
        style: edge.style
      }));

      return { workflow, nodes, edges };

    } catch (error) {
      console.error('Error loading workflow:', error);
      toast({
        title: "Error",
        description: "Failed to load workflow",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkflow = async (workflowId: string) => {
    try {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', workflowId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Workflow deleted successfully",
      });

      await fetchWorkflows();
    } catch (error) {
      console.error('Error deleting workflow:', error);
      toast({
        title: "Error",
        description: "Failed to delete workflow",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  return {
    workflows,
    loading,
    saveWorkflow,
    loadWorkflow,
    deleteWorkflow,
    refetch: fetchWorkflows
  };
};
