import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { server } from '@/config';
import { useSSE } from './useSSE';

// Check if we're in production (Vercel)
const isProduction = process.env.NODE_ENV === 'production';

interface UseSocketProps {
  token: string | null;
  userId: string | null;
  onNewMessage?: (message: SocketMessage) => void;
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

export const useSocket = ({ token, userId, onNewMessage }: UseSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const onNewMessageRef = useRef(onNewMessage);

  // Use SSE for production (Vercel)
  const sseHook = useSSE({ token, userId, onNewMessage });

  // Update ref when onNewMessage changes
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  useEffect(() => {
    if (!token || !userId) return;

    // In production (Vercel), use polling only as WebSocket is not supported
    if (isProduction) {
      // Use polling for production environment
      const wsServer = server.replace('/v1', '');
      const newSocket = io(wsServer, {
        auth: {
          token: token
        },
        transports: ['polling'], // Only polling for Vercel
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        forceNew: true
      });
      
      socketRef.current = newSocket;
      setSocket(newSocket);
    } else {
      // Use WebSocket for local development
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

    // Get the current socket reference
    const currentSocket = socketRef.current;
    if (!currentSocket) return;

    // Connection events
    currentSocket.on('connect', () => {
      setIsConnected(true);
    });

    currentSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    currentSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Message events
    currentSocket.on('new_message', (message: SocketMessage) => {
      // Callback ile yeni mesajı handle et
      if (message && onNewMessageRef.current) {
        onNewMessageRef.current(message);
      }
    });

    currentSocket.on('conversation_updated', (data) => {
      // Dispatch action to update conversation in Redux store
    });

    // Typing events
    currentSocket.on('user_typing', (data) => {
      // Handle typing indicator
    });

    currentSocket.on('user_stopped_typing', (data) => {
      // Handle typing indicator
    });

    // User status events
    currentSocket.on('user_status_changed', (data) => {
      setOnlineUsers(prev => {
        if (data.isOnline) {
          return [...prev.filter(id => id !== data.userId), data.userId];
        } else {
          return prev.filter(id => id !== data.userId);
        }
      });
    });

    // Message read events
    currentSocket.on('messages_read', (data) => {
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
  }, [token, userId, dispatch]);

  // Socket methods with safety checks
  const joinConversation = useCallback((conversationId: string) => {
    if (socketRef.current && socketRef.current.connected && conversationId) {
      socketRef.current.emit('join_conversation', conversationId);
    }
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    if (socketRef.current && socketRef.current.connected && conversationId) {
      socketRef.current.emit('leave_conversation', conversationId);
    }
  }, []);

  const sendMessage = useCallback((conversationId: string, content: string, messageId: string) => {
    if (socketRef.current && socketRef.current.connected && conversationId && content && messageId) {
      socketRef.current.emit('send_message', {
        conversationId,
        content,
        messageId
      });
    }
  }, []);

  const startTyping = useCallback((conversationId: string) => {
    if (socketRef.current && socketRef.current.connected && conversationId) {
      socketRef.current.emit('typing_start', { conversationId });
    }
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    if (socketRef.current && socketRef.current.connected && conversationId) {
      socketRef.current.emit('typing_stop', { conversationId });
    }
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    if (socketRef.current && socketRef.current.connected && conversationId) {
      socketRef.current.emit('mark_as_read', { conversationId });
    }
  }, []);

  const isUserOnline = (userId: string) => {
    return onlineUsers.includes(userId);
  };

  // Return SSE for production, WebSocket for development
  if (isProduction) {
    return {
      ...sseHook,
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
    markAsRead,
    isUserOnline
  };
};
