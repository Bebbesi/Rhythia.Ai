import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ChatHeaderProps {
  onResetClick: () => void;
}

export function ChatHeader({ onResetClick }: ChatHeaderProps) {
  return (
    <div className="flex justify-between items-center p-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--chat-dark)] to-[var(--chat-bg)]">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[var(--google-blue)] to-blue-600 rounded-full flex items-center justify-center">
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
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Rhythia AI</h1>
          <p className="text-xs text-[var(--muted-foreground)]">Beta</p>
        </div>
      </div>
      
      <Button
        onClick={onResetClick}
        variant="destructive"
        size="sm"
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
      >
        <Trash2 className="w-4 h-4" />
        <span>Reset</span>
      </Button>
    </div>
  );
}
