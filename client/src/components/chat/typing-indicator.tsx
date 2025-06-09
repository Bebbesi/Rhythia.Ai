

export function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3 typing-indicator">
      <div className="w-8 h-8 bg-gradient-to-br from-[var(--google-blue)] to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="url(#typingGradient)"/>
          <path d="M12 10h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2z" fill="white"/>
          <circle cx="16" cy="16" r="3" fill="url(#typingGradient)"/>
          <defs>
            <linearGradient id="typingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: "#FFFFFF"}}/>
              <stop offset="100%" style={{stopColor: "#E5E7EB"}}/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="bg-[var(--bot-bubble)] rounded-2xl rounded-tl-md px-4 py-3 shadow-lg">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
