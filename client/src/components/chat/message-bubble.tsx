import { User } from "lucide-react";

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  timestamp: string;
}

const parseContent = (text: string) => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Cerca sia i link Markdown che la parola "hello" (case insensitive)
  const regex = /(\[([^\]]+)\]\(([^)]+)\))|(hello)/gi;

  let match;
  while ((match = regex.exec(text)) !== null) {
    // Aggiungo il testo prima del match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Link markdown trovato
      const linkText = match[2];
      const linkUrl = match[3];
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          {linkText}
        </a>
      );
    } else if (match[4]) {
      // Parola "hello" trovata
      parts.push(
        <strong key={match.index}>{match[4]}</strong>
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Aggiungo il testo rimanente
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

export function MessageBubble({ content, isUser, timestamp }: MessageBubbleProps) {
  if (isUser) {
    return (
      <div className="flex items-start space-x-3 justify-end message-bubble">
        <div className="bg-[var(--user-bubble)] rounded-2xl rounded-tr-md px-4 py-3 max-w-xs shadow-lg">
          <p className="text-white text-sm leading-relaxed">{parseContent(content)}</p>
          <div className="text-xs text-blue-100 mt-1 text-right">{timestamp}</div>
        </div>
        <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 message-bubble">
      <div className="w-8 h-8 bg-gradient-to-br from-[var(--google-blue)] to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="url(#botGradient)"/>
          <path d="M12 10h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2z" fill="white"/>
          <circle cx="16" cy="16" r="3" fill="url(#botGradient)"/>
          <defs>
            <linearGradient id="botGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: "#FFFFFF"}}/>
              <stop offset="100%" style={{stopColor: "#E5E7EB"}}/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="bg-[var(--bot-bubble)] rounded-2xl rounded-tl-md px-4 py-3 max-w-sm shadow-lg">
        <p className="text-gray-100 text-sm leading-relaxed">{parseContent(content)}</p>
        <div className="text-xs text-[var(--muted-foreground)] mt-1">{timestamp}</div>
      </div>
    </div>
  );
}
