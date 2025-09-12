import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { server } from '@/config';

interface UseSSEProps {
  token: string | null;
  userId: string | null;
  onNewMessage?: (message: any) => void;
}

export const useSSE = ({ token, userId, onNewMessage }: UseSSEProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const dispatch = useDispatch();
  const eventSourceRef = useRef<EventSource | null>(null);
  const onNewMessageRef = useRef(onNewMessage);

  // Update ref when onNewMessage changes
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  useEffect(() => {
    if (!token || !userId) return;

    // Create SSE connection for production
    const sseUrl = `${server.replace('/v1', '')}/sse?token=${token}`;
    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    // Connection events
    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onerror = (error) => {
      setIsConnected(false);
    };

    // Message events
    eventSource.addEventListener('new_message', (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message && onNewMessageRef.current) {
          onNewMessageRef.current(message);
        }
      } catch (error) {
        // Error parsing SSE message - silently continue
      }
    });

    eventSource.addEventListener('conversation_updated', (event) => {
      try {
        const data = JSON.parse(event.data);
        // Handle conversation update
      } catch (error) {
        // Error parsing conversation update - silently continue
      }
    });

    eventSource.addEventListener('user_status_changed', (event) => {
      try {
        const data = JSON.parse(event.data);
        setOnlineUsers(prev => {
          if (data.isOnline) {
            return [...prev.filter(id => id !== data.userId), data.userId];
          } else {
            return prev.filter(id => id !== data.userId);
          }
        });
      } catch (error) {
        // Error parsing user status - silently continue
      }
    });

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      eventSourceRef.current = null;
      setIsConnected(false);
    };
  }, [token, userId, dispatch]);

  // SSE methods (limited functionality compared to WebSocket)
  const joinConversation = useCallback((conversationId: string) => {
    // SSE doesn't support server-side room joining
    // This would need to be handled via API calls
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    // SSE doesn't support server-side room leaving
  }, []);

  const sendMessage = useCallback(async (conversationId: string, content: string, messageId: string) => {
    // Send message via API instead of real-time
    try {
      const response = await fetch(`${server}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId,
          content,
          messageId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      // Error sending message - silently continue
    }
  }, [token]);

  const startTyping = useCallback((conversationId: string) => {
    // Typing indicators not supported with SSE
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    // Typing indicators not supported with SSE
  }, []);


  return {
    socket: null, // No socket object for SSE
    isConnected,
    onlineUsers,
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping
  };
};
