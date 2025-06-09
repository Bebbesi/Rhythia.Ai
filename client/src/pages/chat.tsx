import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send, Trash2, WifiOff, User, AlertTriangle } from "lucide-react";
import type { Message, GeminiRequest, GeminiResponse } from "@shared/schema";

export default function ChatPage() {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Generate session ID if one doesn't exist
  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      // Generate random number between 1 and 10,000,000
      const newSessionId = Math.floor(Math.random() * 10000000) + 1;
      const sessionIdStr = newSessionId.toString();
      localStorage.setItem('sessionId', sessionIdStr);
      setSessionId(sessionIdStr);
    }
  }, []);

  // Check for internet connectivity
  useEffect(() => {
    const checkConnection = () => {
      if (!navigator.onLine) {
        setIsConnectionModalOpen(true);
      }
    };

    checkConnection();
    window.addEventListener('online', () => setIsConnectionModalOpen(false));
    window.addEventListener('offline', () => setIsConnectionModalOpen(true));

    return () => {
      window.removeEventListener('online', () => setIsConnectionModalOpen(false));
      window.removeEventListener('offline', () => setIsConnectionModalOpen(true));
    };
  }, []);

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", sessionId],
    queryFn: () => sessionId ? apiRequest(`/api/messages?sessionId=${sessionId}`) : Promise.resolve([]),
    refetchInterval: 1000,
    enabled: sessionId !== null,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (message: GeminiRequest) => {
      if (!sessionId) throw new Error("No session available");
      return apiRequest(`/api/chat?sessionId=${sessionId}`, {
        method: "POST",
        body: JSON.stringify(message),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", sessionId] });
      setIsTyping(false);
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      setIsTyping(false);
    }
  });

  // Reset chat mutation
  const resetChatMutation = useMutation({
    mutationFn: () => {
      if (!sessionId) throw new Error("No session available");
      return apiRequest(`/api/chat/reset?sessionId=${sessionId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", sessionId] });
      setIsResetModalOpen(false);
    },
    onError: (error) => {
      console.error("Failed to reset chat:", error);
    }
  });

  const handleSendMessage = () => {
    if (message.trim() && sessionId) {
      setIsTyping(true);
      sendMessageMutation.mutate({ message: message.trim() });
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    resetChatMutation.mutate();
  };

  // Rhythia logo component
  const RhythiaLogo = () => (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="url(#gradient)"/>
      <path d="M12 10h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2z" fill="white"/>
      <circle cx="16" cy="16" r="3" fill="url(#gradient)"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: "#FFFFFF"}}/>
          <stop offset="100%" style={{stopColor: "#E5E7EB"}}/>
        </linearGradient>
      </defs>
    </svg>
  );

  // Message bubble component
  const MessageBubble = ({ content, isUser, timestamp }: { content: string; isUser: boolean; timestamp: string }) => {
    if (isUser) {
      return (
        <div className="flex items-start space-x-3 justify-end mb-4">
          <div className="bg-blue-600 rounded-2xl rounded-tr-md px-4 py-3 max-w-md shadow-lg">
            <p className="text-white text-sm leading-relaxed">{content}</p>
            <div className="text-xs text-blue-100 mt-1 text-right">{timestamp}</div>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
          <RhythiaLogo />
        </div>
        <div className="bg-gray-800 rounded-2xl rounded-tl-md px-4 py-3 max-w-md shadow-lg">
          <p className="text-gray-100 text-sm leading-relaxed">{content}</p>
          <div className="text-xs text-gray-400 mt-1">{timestamp}</div>
        </div>
      </div>
    );
  };

  // Typing indicator component
  const TypingIndicator = () => (
    <div className="flex items-start space-x-3 mb-4">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
        <RhythiaLogo />
      </div>
      <div className="bg-gray-800 rounded-2xl rounded-tl-md px-4 py-3 shadow-lg">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Large Chat Container */}
      <div className="w-[1200px] h-[800px] max-w-[95vw] max-h-[95vh] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
              <RhythiaLogo />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Rhythia AI</h1>
              <p className="text-sm text-gray-400">Online</p>
            </div>
          </div>

          {/* Session ID Display */}
          <div className="text-center">
            <p className="text-sm text-gray-400">Session ID:</p>
            <p className="text-lg font-mono text-white">{sessionId || 'Loading...'}</p>
          </div>

          <Button
            onClick={() => setIsResetModalOpen(true)}
            variant="destructive"
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
            disabled={!sessionId}
          >
            <Trash2 className="w-5 h-5" />
            <span>Reset</span>
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(75 85 99) transparent'
        }}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400 text-lg">Loading messages...</div>
            </div>
          ) : (
            <>
              {/* Welcome message if no messages */}
              {messages.length === 0 && sessionId && (
                <MessageBubble
                  content="Hello! I'm Rhythia AI, your game assistant. How can I help you with Rhythia today?"
                  isUser={false}
                  timestamp={new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                />
              )}

              {/* Render all messages */}
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  content={msg.content}
                  isUser={msg.isUser}
                  timestamp={new Date(msg.timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                />
              ))}

              {/* Typing indicator */}
              {isTyping && <TypingIndicator />}
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder={sessionId ? "Type a message..." : "Creating session..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={sendMessageMutation.isPending || !sessionId}
                className="w-full bg-gray-700 border border-gray-600 rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending || !sessionId}
              className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-full w-14 h-14 flex items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Made by Bebbesi, Not affiliated with Rhythia.
          </p>
        </div>
      </div>

      {/* Version label outside the chat container */}
      <div className="fixed bottom-6 right-6">
        <p className="text-sm text-gray-500">Version 1.0</p>
      </div>

      {/* Reset Modal */}
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent className="bg-gray-800 border border-gray-600 text-white max-w-md">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold">Confirm Reset</DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              Are you sure you want to delete all chat history? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex space-x-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsResetModalOpen(false)}
              disabled={resetChatMutation.isPending}
              className="flex-1 bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleResetChat}
              disabled={resetChatMutation.isPending}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {resetChatMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Connection Modal */}
      <Dialog open={isConnectionModalOpen} onOpenChange={setIsConnectionModalOpen}>
        <DialogContent className="bg-gray-800 border border-gray-600 text-white max-w-md">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <WifiOff className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold">Connection Issue</DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              Some functionalities may be unavailable
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-center mt-6">
            <Button
              onClick={() => setIsConnectionModalOpen(false)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}