
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  created_at: string;
  session_id: string;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useChatSession = () => {
  const { user } = useAuth();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Welcome message for new sessions
  const getWelcomeMessage = (): Message => ({
    id: 'welcome-message',
    content: "Hello! I'm your AI Cost Optimization Manager. I can help you analyze AI costs, find savings opportunities, calculate ROI, and suggest automation strategies. What would you like to explore today?",
    sender: 'assistant',
    created_at: new Date().toISOString(),
    session_id: currentSessionId || ''
  });

  const createNewSession = async (): Promise<string | null> => {
    if (!user) return null;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          title: 'New Chat',
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSessionId(data.id);
      setMessages([getWelcomeMessage()]);
      return data.id;
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to create new chat session",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadSession = async (sessionId: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Load session messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      setCurrentSessionId(sessionId);
      
      if (messagesData && messagesData.length > 0) {
        // Type assertion to ensure messages match the Message interface
        setMessages(messagesData as Message[]);
      } else {
        // If no messages, add welcome message
        setMessages([getWelcomeMessage()]);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast({
        title: "Error",
        description: "Failed to load chat session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveMessage = async (content: string, sender: 'user' | 'assistant') => {
    if (!currentSessionId || !user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          session_id: currentSessionId,
          content,
          sender,
        })
        .select()
        .single();

      if (error) throw error;

      // Type assertion to ensure the new message matches the Message interface
      setMessages(prev => [...prev, data as Message]);

      // Update session's updated_at timestamp
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentSessionId);

    } catch (error) {
      console.error('Error saving message:', error);
      toast({
        title: "Error",
        description: "Failed to save message",
        variant: "destructive",
      });
    }
  };

  const updateSessionTitle = async (sessionId: string, title: string) => {
    if (!user) return;

    try {
      // Truncate title to a reasonable length
      const truncatedTitle = title.length > 50 ? title.substring(0, 50) + '...' : title;
      
      const { error } = await supabase
        .from('chat_sessions')
        .update({ 
          title: truncatedTitle,
          updated_at: new Date().toISOString() 
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating session title:', error);
    }
  };

  const clearCurrentSession = () => {
    setCurrentSessionId(null);
    setMessages([]);
  };

  // Initialize with welcome message if no session
  useEffect(() => {
    if (!currentSessionId && messages.length === 0) {
      setMessages([getWelcomeMessage()]);
    }
  }, [currentSessionId]);

  return {
    currentSessionId,
    messages,
    isLoading,
    createNewSession,
    loadSession,
    saveMessage,
    updateSessionTitle,
    setMessages,
    clearCurrentSession,
  };
};
