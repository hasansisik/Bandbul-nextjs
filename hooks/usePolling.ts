import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { server } from '@/config';

interface UsePollingProps {
  token: string | null;
  userId: string | null;
  onNewMessage?: (message: any) => void;
}

export const usePolling = ({ token, userId, onNewMessage }: UsePollingProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const dispatch = useDispatch();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const onNewMessageRef = useRef(onNewMessage);
  const lastMessageTimeRef = useRef<Date | null>(null);

  // Update ref when onNewMessage changes
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  useEffect(() => {
    if (!token || !userId) return;

    setIsConnected(true);

    // Start polling for new messages
    const startPolling = () => {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          // Poll for new messages
          const sinceParam = lastMessageTimeRef.current?.toISOString() || new Date(Date.now() - 60000).toISOString();
          const response = await fetch(`${server}/messages/poll?since=${sinceParam}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            
            if (data.messages && data.messages.length > 0) {
              data.messages.forEach((message: any) => {
                if (onNewMessageRef.current) {
                  onNewMessageRef.current(message);
                }
                lastMessageTimeRef.current = new Date(message.timestamp || message.createdAt);
              });
            }
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, 2000); // Poll every 2 seconds
    };

    startPolling();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      setIsConnected(false);
    };
  }, [token, userId, dispatch]);

  // Polling methods (limited functionality compared to WebSocket)
  const joinConversation = useCallback((conversationId: string) => {
    // Polling doesn't support server-side room joining
    console.log('Polling: Join conversation not directly supported');
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    // Polling doesn't support server-side room leaving
    console.log('Polling: Leave conversation not directly supported');
  }, []);

  const sendMessage = useCallback(async (conversationId: string, content: string, messageId: string) => {
    // Send message via API
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
      console.error('Error sending message:', error);
    }
  }, [token]);

  const startTyping = useCallback((conversationId: string) => {
    // Typing indicators not supported with polling
    console.log('Polling: Typing indicators not supported');
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    // Typing indicators not supported with polling
    console.log('Polling: Typing indicators not supported');
  }, []);

  const markAsRead = useCallback(async (conversationId: string) => {
    // Mark as read via API
    try {
      await fetch(`${server}/messages/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ conversationId })
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [token]);

  const isUserOnline = (userId: string) => {
    return onlineUsers.includes(userId);
  };

  return {
    socket: null, // No socket object for polling
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
