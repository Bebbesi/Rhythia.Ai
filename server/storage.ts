import { messages, chatSessions, type Message, type InsertMessage, type ChatSession, type InsertChatSession } from "@shared/schema";

export interface IStorage {
  // Message operations
  createMessage(message: InsertMessage, sessionId?: string): Promise<Message>;
  getMessages(sessionId?: string): Promise<Message[]>;
  clearMessages(sessionId?: string): Promise<void>;
  
  // Chat session operations
  createChatSession(): Promise<ChatSession>;
  getCurrentSession(): Promise<ChatSession | undefined>;
  getSession(sessionId: string): Promise<ChatSession | undefined>;
}

export class MemStorage implements IStorage {
  private sessionMessages: Map<string, Map<number, Message>>; // sessionId -> messageId -> Message
  private chatSessions: Map<string, ChatSession>;
  private currentMessageId: number;

  constructor() {
    this.sessionMessages = new Map();
    this.chatSessions = new Map();
    this.currentMessageId = 1;
  }

  async createMessage(insertMessage: InsertMessage, sessionId?: string): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };

    // Use provided sessionId or generate a default one
    const activeSessionId = sessionId || 'default';
    
    // Get or create message map for this session
    if (!this.sessionMessages.has(activeSessionId)) {
      this.sessionMessages.set(activeSessionId, new Map());
    }
    
    this.sessionMessages.get(activeSessionId)!.set(id, message);
    return message;
  }

  async getMessages(sessionId?: string): Promise<Message[]> {
    if (!sessionId) {
      // Return empty array if no session specified
      return [];
    }
    
    const sessionMap = this.sessionMessages.get(sessionId);
    if (!sessionMap) {
      return [];
    }
    
    return Array.from(sessionMap.values()).sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );
  }

  async clearMessages(sessionId?: string): Promise<void> {
    if (sessionId) {
      this.sessionMessages.delete(sessionId);
    } else {
      this.sessionMessages.clear();
    }
  }

  async createChatSession(): Promise<ChatSession> {
    const id = Date.now(); // or use an incrementing number if you prefer
    const session: ChatSession = {
      id,
      createdAt: new Date(),
    };
    this.chatSessions.set(id.toString(), session);
    return session;
  }

  async getCurrentSession(): Promise<ChatSession | undefined> {
    // This method is no longer used since sessions are managed per request
    return undefined;
  }

  async getSession(sessionId: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(sessionId);
  }
}

export const storage = new MemStorage();
