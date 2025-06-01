
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  created_at: string;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export const useChatSession = () => {
  const { user } = useAuth();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Create a new chat session
  const createNewSession = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{
          user_id: user.id,
          title: 'New Chat',
        }])
        .select()
        .single();

      if (error) throw error;

      setCurrentSessionId(data.id);
      setMessages([]);
      
      return data.id;
    } catch (error: any) {
      console.error('Error creating session:', error);
      toast({
        title: "Error creating session",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  // Load messages for a specific session
  const loadSession = async (sessionId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
      setCurrentSessionId(sessionId);
    } catch (error: any) {
      console.error('Error loading session:', error);
      toast({
        title: "Error loading session",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save a message to the current session
  const saveMessage = async (content: string, sender: 'user' | 'assistant') => {
    if (!currentSessionId || !user) return null;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          session_id: currentSessionId,
          content,
          sender,
        }])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setMessages(prev => [...prev, data]);

      // Update session timestamp
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentSessionId);

      return data;
    } catch (error: any) {
      console.error('Error saving message:', error);
      toast({
        title: "Error saving message",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  // Update session title based on first user message
  const updateSessionTitle = async (sessionId: string, title: string) => {
    try {
      await supabase
        .from('chat_sessions')
        .update({ 
          title: title.length > 50 ? title.substring(0, 47) + '...' : title,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error updating session title:', error);
    }
  };

  // Initialize with welcome message if no session
  useEffect(() => {
    if (!currentSessionId && user) {
      setMessages([{
        id: 'welcome',
        content: `Hello${user.email ? ` ${user.email.split('@')[0]}` : ''}! I'm your AI Cost Optimization Manager Agent. I can help you analyze your AI costs, find savings opportunities, calculate ROI, and identify automation workflows. What would you like to optimize today?`,
        sender: 'assistant',
        created_at: new Date().toISOString()
      }]);
    }
  }, [currentSessionId, user]);

  return {
    currentSessionId,
    messages,
    isLoading,
    createNewSession,
    loadSession,
    saveMessage,
    updateSessionTitle,
    setMessages,
  };
};
