import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { server } from '@/config';
import { usePolling } from './usePolling';

// Check if we're in production (Vercel)
const isProduction = process.env.NODE_ENV === 'production';

// Dynamic import for Socket.IO (only in development)
let io: any = null;
let Socket: any = null;

if (!isProduction) {
  const socketIO = require('socket.io-client');
  io = socketIO.io;
  Socket = socketIO.Socket;
}

interface UseSocketProps {
  token: string | null;
  userId: string | null;
  onNewMessage?: (message: SocketMessage) => void;
  onMessagesRead?: (data: { conversationId: string; readBy: string; readAt: string }) => void;
}

interface SocketMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    surname: string;
    picture?: string;
  };
  timestamp: string;
  isRead: boolean;
}

export const useSocket = ({ token, userId, onNewMessage, onMessagesRead }: UseSocketProps) => {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const dispatch = useDispatch();
  const socketRef = useRef<any>(null);
  const onNewMessageRef = useRef(onNewMessage);
  const onMessagesReadRef = useRef(onMessagesRead);

  // Use polling for production (Vercel)
  const pollingHook = usePolling({ token, userId, onNewMessage });

  // Update refs when handlers change
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
    onMessagesReadRef.current = onMessagesRead;
  }, [onNewMessage, onMessagesRead]);

  useEffect(() => {
    if (!token || !userId) return;

    // In production (Vercel), don't use Socket.IO at all
    if (isProduction) {
      // Set connected state to true for SSE
      setIsConnected(true);
      return;
    } else {
      // Use WebSocket for local development only
      const wsServer = server.replace('/v1', '');
      const newSocket = io(wsServer, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
      
      socketRef.current = newSocket;
      setSocket(newSocket);
    }

    // Only set up socket events for development
    if (!isProduction) {
      const currentSocket = socketRef.current;
      if (!currentSocket) return;

      // Connection events
      currentSocket.on('connect', () => {
        setIsConnected(true);
      });

      currentSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      currentSocket.on('connect_error', (error: any) => {
        setIsConnected(false);
      });

      // Message events
      currentSocket.on('new_message', (message: SocketMessage) => {
        // Callback ile yeni mesajı handle et
        if (message && onNewMessageRef.current) {
          onNewMessageRef.current(message);
        }
      });

      // Messages read events
      currentSocket.on('messages_read', (data: { conversationId: string; readBy: string; readAt: string }) => {
        // Callback ile okundu durumunu handle et
        if (data && onMessagesReadRef.current) {
          onMessagesReadRef.current(data);
        }
      });

      currentSocket.on('conversation_updated', (data: any) => {
        // Dispatch action to update conversation in Redux store
      });

      // Typing events
      currentSocket.on('user_typing', (data: any) => {
        // Handle typing indicator
      });

      currentSocket.on('user_stopped_typing', (data: any) => {
        // Handle typing indicator
      });

      // User status events
      currentSocket.on('user_status_changed', (data: any) => {
        setOnlineUsers(prev => {
          if (data.isOnline) {
            return [...prev.filter(id => id !== data.userId), data.userId];
          } else {
            return prev.filter(id => id !== data.userId);
          }
        });
      });

      // Message read events
      currentSocket.on('messages_read', (data: any) => {
        // Handle message read status
      });

      return () => {
        if (currentSocket) {
          currentSocket.close();
        }
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [token, userId, dispatch]);

  // Socket methods with safety checks
  const joinConversation = useCallback((conversationId: string) => {
    if (!isProduction && socketRef.current && socketRef.current.connected && conversationId) {
      socketRef.current.emit('join_conversation', conversationId);
    }
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    if (!isProduction && socketRef.current && socketRef.current.connected && conversationId) {
      socketRef.current.emit('leave_conversation', conversationId);
    }
  }, []);

  const sendMessage = useCallback((conversationId: string, content: string, messageId: string) => {
    if (!isProduction && socketRef.current && socketRef.current.connected && conversationId && content && messageId) {
      socketRef.current.emit('send_message', {
        conversationId,
        content,
        messageId
      });
    }
  }, []);

  const startTyping = useCallback((conversationId: string) => {
    if (!isProduction && socketRef.current && socketRef.current.connected && conversationId) {
      socketRef.current.emit('typing_start', { conversationId });
    }
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    if (!isProduction && socketRef.current && socketRef.current.connected && conversationId) {
      socketRef.current.emit('typing_stop', { conversationId });
    }
  }, []);


  const isUserOnline = (userId: string) => {
    return onlineUsers.includes(userId);
  };

  // Return polling for production, WebSocket for development
  if (isProduction) {
    return {
      ...pollingHook,
      isUserOnline
    };
  }

  return {
    socket,
    isConnected,
    onlineUsers,
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    isUserOnline
  };
};
