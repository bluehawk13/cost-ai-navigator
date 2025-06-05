
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Settings, Trash2, Menu, MessagesSquare, LayoutGrid } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatSidebarProps {
  onNewChat: () => void;
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ChatSidebar = ({ onNewChat, currentSessionId, onSelectSession, isCollapsed, onToggleCollapse }: ChatSidebarProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchSessions = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Use a more resilient approach with timeout and retry
      const fetchWithTimeout = async (retries = 3) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
          
          const { data, error } = await supabase
            .from('chat_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });
          
          clearTimeout(timeoutId);
          
          if (error) throw error;
          return data;
        } catch (error) {
          if (retries > 0) {
            console.log(`Retrying fetch sessions... (${retries} attempts left)`);
            await new Promise(r => setTimeout(r, 1000)); // Wait 1 second before retry
            return fetchWithTimeout(retries - 1);
          }
          throw error;
        }
      };
      
      const data = await fetchWithTimeout();
      setSessions(data || []);
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load chat sessions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Also delete associated messages
      await supabase
        .from('messages')
        .delete()
        .eq('session_id', sessionId);

      toast({
        title: "Success",
        description: "Chat session deleted",
      });

      fetchSessions();
      
      if (currentSessionId === sessionId) {
        onNewChat();
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete chat session",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  if (isCollapsed) {
    return (
      <div className="w-16 h-full border-r bg-muted/40 flex flex-col items-center py-4">
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="mb-6">
          <Menu className="h-5 w-5" />
        </Button>
        <Button onClick={onNewChat} size="icon" className="mb-6">
          <Plus className="h-5 w-5" />
        </Button>
        <div className="mt-auto">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 h-full border-r bg-muted/40 flex flex-col">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="mr-2">
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="font-semibold flex-1 text-center">AI Cost Optimizer</h2>
      </div>
      
      <div className="p-3">
        <Button onClick={onNewChat} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-3 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
            <MessagesSquare className="h-10 w-10 mb-3" />
            <p>No chat sessions yet</p>
            <p className="text-sm">Start a new conversation by clicking the New Chat button</p>
          </div>
        ) : (
          <div className="p-3 space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer ${
                  currentSessionId === session.id ? "bg-accent" : ""
                }`}
              >
                <div className="truncate flex-1">
                  <span className="text-sm">{session.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => deleteSession(session.id, e)}
                  className="h-7 w-7 p-0 opacity-50 hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-auto p-3 border-t">
        <div className="flex justify-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
            <LayoutGrid className="h-4 w-4 mr-1" /> Dashboard
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" /> Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
