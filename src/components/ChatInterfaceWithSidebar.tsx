
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Loader2, AlertCircle, Brain } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { useChatSession } from '@/hooks/useChatSession';
import ChatSidebar from './ChatSidebar';

const ChatInterfaceWithSidebar = () => {
  const { user } = useAuth();
  const {
    currentSessionId,
    messages,
    isLoading: sessionLoading,
    createNewSession,
    loadSession,
    saveMessage,
    updateSessionTitle,
    setMessages,
    clearCurrentSession,
  } = useChatSession();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = async () => {
    // Clear current session first
    clearCurrentSession();
    // Then create new session
    await createNewSession();
  };

  const handleSessionSelect = async (sessionId: string) => {
    // Clear current session before loading new one
    clearCurrentSession();
    await loadSession(sessionId);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user) return;

    let sessionId = currentSessionId;
    
    // Create new session if none exists
    if (!sessionId) {
      sessionId = await createNewSession();
      if (!sessionId) return;
    }

    const userMessageContent = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    // Save user message
    await saveMessage(userMessageContent, 'user');

    // Update session title with first user message if it's still "New Chat"
    const nonWelcomeMessages = messages.filter(msg => !msg.id.startsWith('welcome-'));
    const isFirstMessage = nonWelcomeMessages.length <= 1;
    if (isFirstMessage && sessionId) {
      await updateSessionTitle(sessionId, userMessageContent);
    }

    try {
      // Use the actual database session ID for the API call
      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-default-gLsaQsiInbLlKDdFTxKqVtaBvrSIeTIk'
        },
        body: JSON.stringify({
          user_id: user?.email || "anonymous@example.com",
          agent_id: "683c3a403b7c57f1745cef6c",
          session_id: sessionId, // Use the actual database session ID
          message: userMessageContent
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantResponse = data.response || "I apologize, but I couldn't process your request. Please try again.";

      // Save assistant message
      await saveMessage(assistantResponse, 'assistant');
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please check your connection and try again.');
      
      toast({
        title: "Connection Error",
        description: "Unable to reach the AI agent. Please try again in a moment.",
        variant: "destructive",
      });
      
      const errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
      await saveMessage(errorMessage, 'assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <ChatSidebar
        currentSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Cost Optimization Chat
              </h1>
              <p className="text-gray-600 text-sm">
                Get instant insights on AI costs, ROI analysis, and optimization strategies
              </p>
              {currentSessionId && (
                <p className="text-xs text-gray-500 mt-1">Session: {currentSessionId.slice(0, 8)}...</p>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-xs lg:max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <span className={`text-xs mt-2 block ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {!message.id.startsWith('welcome-') ? formatTime(message.created_at) : 'Now'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-xs lg:max-w-2xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Agent is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="flex justify-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="flex space-x-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about AI costs, ROI analysis, automation opportunities..."
              className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Suggestions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {['Analyze my AI costs', 'Find cost savings', 'Calculate ROI', 'Automation opportunities'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputMessage(suggestion)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterfaceWithSidebar;
