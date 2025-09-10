import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { server } from '@/config';

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

  // Update ref when onNewMessage changes
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  useEffect(() => {
    if (!token || !userId) return;

    // Remove /v1 from server URL for WebSocket connection
    const wsServer = server.replace('/v1', '');

    // Create socket connection
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

    // Connection events
    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Message events
    newSocket.on('new_message', (message: SocketMessage) => {
      // Callback ile yeni mesajı handle et
      if (message && onNewMessageRef.current) {
        onNewMessageRef.current(message);
      }
    });

    newSocket.on('conversation_updated', (data) => {
      // Dispatch action to update conversation in Redux store
    });

    // Typing events
    newSocket.on('user_typing', (data) => {
      // Handle typing indicator
    });

    newSocket.on('user_stopped_typing', (data) => {
      // Handle typing indicator
    });

    // User status events
    newSocket.on('user_status_changed', (data) => {
      setOnlineUsers(prev => {
        if (data.isOnline) {
          return [...prev.filter(id => id !== data.userId), data.userId];
        } else {
          return prev.filter(id => id !== data.userId);
        }
      });
    });

    // Message read events
    newSocket.on('messages_read', (data) => {
      // Handle message read status
    });

    return () => {
      newSocket.close();
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
