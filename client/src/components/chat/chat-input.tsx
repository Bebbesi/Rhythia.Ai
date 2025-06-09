import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
}

export function ChatInput({ onSendMessage, isDisabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim() && !isDisabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 border-t border-[var(--border)] bg-gradient-to-r from-[var(--chat-dark)] to-[var(--chat-bg)]">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isDisabled}
            className="w-full bg-gray-800 border border-gray-700 rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--google-blue)] focus:border-transparent transition-all duration-200"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || isDisabled}
          className="bg-[var(--google-blue)] hover:bg-blue-600 transition-colors duration-200 rounded-full w-12 h-12 flex items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
