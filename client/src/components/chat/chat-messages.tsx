import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import type { Message } from "@shared/schema";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
}

export function ChatMessages({ messages, isLoading, isTyping }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll flex items-center justify-center">
        <div className="text-[var(--muted-foreground)]">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll">
      {/* Welcome message if no messages */}
      {messages.length === 0 && (
        <MessageBubble
          content="Hello! I'm Rhythia AI. How can I help you today?"
          isUser={false}
          timestamp={new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        />
      )}
      
      {/* Render all messages */}
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          content={message.content}
          isUser={message.isUser}
          timestamp={new Date(message.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        />
      ))}
      
      {/* Typing indicator */}
      {isTyping && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
