import axios from 'axios';

const API_URL = process.env.JSON_SERVER_URL || 'http://localhost:3001';

export interface User {
  id: string;
  email: string;
  messagesLeft: number;
  totalMessagesSent: number;
  createdAt: string;
  lastMessageSent?: string;
}

export interface Message {
  id: string;
  userId: string;
  recipientEmail: string;
  content: string;
  template: string;
  subject: string;
  createdAt: string;
  hasResponse: boolean;
  responseId?: string;
}

export interface Response {
  id: string;
  messageId: string;
  recipientEmail: string;
  content: string;
  createdAt: string;
}

export interface RedemptionCode {
  id: string;
  code: string;
  used: boolean;
  usedBy?: string;
  createdAt: string;
  usedAt?: string;
}

// Utilisateurs
export const createUser = async (email: string): Promise<User> => {
  const user: User = {
    id: generateId(),
    email,
    messagesLeft: 3,
    totalMessagesSent: 0,
    createdAt: new Date().toISOString(),
  };
  
  await axios.post(`${API_URL}/users`, user);
  return user;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const response = await axios.get(`${API_URL}/users?email=${email}`);
    return response.data[0] || null;
  } catch (error) {
    return null;
  }
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<void> => {
  await axios.patch(`${API_URL}/users/${id}`, updates);
};

// Messages
export const createMessage = async (message: Omit<Message, 'id' | 'createdAt' | 'hasResponse'>): Promise<Message> => {
  const newMessage: Message = {
    ...message,
    id: generateId(),
    createdAt: new Date().toISOString(),
    hasResponse: false,
  };
  
  await axios.post(`${API_URL}/messages`, newMessage);
  return newMessage;
};

export const getMessageById = async (id: string): Promise<Message | null> => {
  try {
    const response = await axios.get(`${API_URL}/messages/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const updateMessage = async (id: string, updates: Partial<Message>): Promise<void> => {
  await axios.patch(`${API_URL}/messages/${id}`, updates);
};

export const getUserMessages = async (userId: string): Promise<Message[]> => {
  try {
    const response = await axios.get(`${API_URL}/messages?userId=${userId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

// Réponses
export const createResponse = async (response: Omit<Response, 'id' | 'createdAt'>): Promise<Response> => {
  const newResponse: Response = {
    ...response,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  
  await axios.post(`${API_URL}/responses`, newResponse);
  return newResponse;
};

export const getResponseById = async (id: string): Promise<Response | null> => {
  try {
    const response = await axios.get(`${API_URL}/responses/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

// Codes de rédemption
export const createRedemptionCode = async (): Promise<RedemptionCode> => {
  const code: RedemptionCode = {
    id: generateId(),
    code: generateRedemptionCode(),
    used: false,
    createdAt: new Date().toISOString(),
  };
  
  await axios.post(`${API_URL}/codes`, code);
  return code;
};

export const getRedemptionCode = async (code: string): Promise<RedemptionCode | null> => {
  try {
    const response = await axios.get(`${API_URL}/codes?code=${code}`);
    return response.data[0] || null;
  } catch (error) {
    return null;
  }
};

export const useRedemptionCode = async (code: string, userEmail: string): Promise<void> => {
  const redemptionCode = await getRedemptionCode(code);
  if (redemptionCode && !redemptionCode.used) {
    await axios.patch(`${API_URL}/codes/${redemptionCode.id}`, {
      used: true,
      usedBy: userEmail,
      usedAt: new Date().toISOString(),
    });
  }
};

// Utilitaires
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const generateRedemptionCode = (): string => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

// Vérifications
export const canSendMessage = (user: User): boolean => {
  if (user.messagesLeft > 0) return true;
  
  // Vérifier si c'est une nouvelle semaine
  const lastMessage = user.lastMessageSent ? new Date(user.lastMessageSent) : null;
  const now = new Date();
  const daysSinceLastMessage = lastMessage ? 
    Math.floor((now.getTime() - lastMessage.getTime()) / (1000 * 60 * 60 * 24)) : 7;
  
  return daysSinceLastMessage >= 7;
};

export const resetWeeklyMessages = async (user: User): Promise<void> => {
  const lastMessage = user.lastMessageSent ? new Date(user.lastMessageSent) : null;
  const now = new Date();
  const daysSinceLastMessage = lastMessage ? 
    Math.floor((now.getTime() - lastMessage.getTime()) / (1000 * 60 * 60 * 24)) : 7;
  
  if (daysSinceLastMessage >= 7) {
    await updateUser(user.id, { messagesLeft: 3 });
  }
};
