"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "next/navigation"
import { AppDispatch } from "@/redux/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Send, 
  Smile, 
  User,
  Clock,
  Check,
  CheckCheck,
  Loader2,
  ArrowLeft
} from "lucide-react"
import { 
  getConversations, 
  getMessages, 
  sendMessage, 
  markAsRead,
  getUnreadCount,
  startConversation 
} from "@/redux/actions/userActions"
import { RootState } from "@/redux/store"
import { useSocket } from "@/hooks/useSocket"
import { server } from "@/config"
import { playNotificationSound } from "@/utils/soundNotification"


export function MessagesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()
  const { 
    conversations, 
    currentMessages, 
    currentConversation, 
    messagesLoading, 
    messagesError,
    user 
  } = useSelector((state: RootState) => state.user)

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [isStartingConversation, setIsStartingConversation] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [hasProcessedUrlParams, setHasProcessedUrlParams] = useState(false)
  const [isNavigatingFromListing, setIsNavigatingFromListing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const prevMessageCount = useRef(0)

  // WebSocket connection
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null


  // Function to create title slug for URL (same as in listing detail page)
  const createTitleSlug = useCallback((title: string) => {
    return title.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  }, [])
  // Handle new message from WebSocket
  const handleNewMessage = useCallback((socketMessage: any) => {
    // If it's a message for the current conversation, reload messages
    if (selectedConversation && socketMessage.conversationId === selectedConversation) {
      dispatch(getMessages({ conversationId: selectedConversation }));
      // Auto scroll to bottom for new messages in current conversation
      setTimeout(() => {
        forceScrollToBottom();
      }, 100);
    }
    
    // Always refresh conversations to update last message and unread counts
    dispatch(getConversations());
    dispatch(getUnreadCount());
  }, [dispatch, selectedConversation]);

  const { 
    isConnected, 
    joinConversation, 
    leaveConversation, 
    sendMessage: sendSocketMessage, 
    startTyping, 
    stopTyping, 
    markAsRead: markAsReadSocket,
    isUserOnline 
  } = useSocket({ 
    token, 
    userId: user?._id,
    onNewMessage: handleNewMessage
  })

  // Filter conversations and remove duplicates by ID (define early)
  const uniqueConversations = conversations.filter((conv, index, self) =>
    index === self.findIndex(c => c.id === conv.id)
  )
  
  const filteredConversations = uniqueConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Load conversations on component mount
  useEffect(() => {
    dispatch(getConversations())
    dispatch(getUnreadCount())
  }, [dispatch])

  // Handle URL parameters for direct conversation
  useEffect(() => {
    if (hasProcessedUrlParams) return;
    
    const recipientId = searchParams.get('recipientId')
    const recipientName = searchParams.get('recipientName')
    const conversationId = searchParams.get('conversationId')
    const listingId = searchParams.get('listingId')
    const listingTitle = searchParams.get('listingTitle')
    
    if (conversationId && !isStartingConversation) {
      // Direct conversation ID provided
      setSelectedConversation(conversationId)
      setHasProcessedUrlParams(true)
    } else if (recipientId && recipientName && !isStartingConversation) {
      // Set flag to indicate we're navigating from a listing
      setIsNavigatingFromListing(true)
      
      // Check if conversation already exists in unique conversations
      const existingConversation = uniqueConversations.find(conv => 
        conv.otherParticipant._id === recipientId
      )
      
      if (existingConversation) {
        // Select existing conversation
        setSelectedConversation(existingConversation.id)
        setHasProcessedUrlParams(true)
        setIsNavigatingFromListing(false)
      } else {
        // Start new conversation - don't wait for conversations to load
        setIsStartingConversation(true)
        setHasProcessedUrlParams(true)
        dispatch(startConversation({ 
          recipientId, 
          listingId: listingId || undefined 
        }))
          .unwrap()
          .then((result) => {
            setIsStartingConversation(false)
            setIsNavigatingFromListing(false)
            // Set the conversation immediately after creation
            if (result && result.id) {
              setSelectedConversation(result.id)
            }
            // Refresh conversations to get the new one
            dispatch(getConversations())
          })
          .catch((error) => {
            setIsStartingConversation(false)
            setIsNavigatingFromListing(false)
          })
      }
    }
  }, [searchParams, dispatch, isStartingConversation, uniqueConversations, hasProcessedUrlParams])

  // Handle conversation creation success
  useEffect(() => {
    if (currentConversation && !selectedConversation && hasProcessedUrlParams) {
      setSelectedConversation(currentConversation.id)
      setIsStartingConversation(false)
      
      // Refresh conversations list to ensure it's up to date
      setTimeout(() => {
        dispatch(getConversations())
      }, 500)
    }
  }, [currentConversation, selectedConversation, dispatch, hasProcessedUrlParams])

  // Prevent conversation deselection when conversations are refreshed
  useEffect(() => {
    if (selectedConversation && uniqueConversations.length > 0) {
      const conversationExists = uniqueConversations.find(conv => conv.id === selectedConversation)
      if (!conversationExists && (hasProcessedUrlParams || isNavigatingFromListing)) {
        // Don't deselect if we're still processing URL params or navigating from listing
        return
      }
    }
  }, [selectedConversation, uniqueConversations, hasProcessedUrlParams, isNavigatingFromListing])

  // Handle conversation creation error
  useEffect(() => {
    if (isStartingConversation && messagesError) {
      setIsStartingConversation(false)
    }
  }, [isStartingConversation, messagesError])

  // Load messages when conversation is selected (only once)
  useEffect(() => {
    if (selectedConversation) {
      dispatch(getMessages({ conversationId: selectedConversation }))
      dispatch(markAsRead(selectedConversation))
      // Scroll to bottom when conversation is selected
      setTimeout(() => {
        forceScrollToBottom();
      }, 200);
    }
  }, [selectedConversation, dispatch])

  // Handle socket connection for selected conversation
  useEffect(() => {
    if (selectedConversation && isConnected) {
      markAsReadSocket(selectedConversation)
      joinConversation(selectedConversation)
    }
    
    return () => {
      if (selectedConversation && isConnected) {
        leaveConversation(selectedConversation)
      }
    }
  }, [selectedConversation, isConnected, joinConversation, leaveConversation, markAsReadSocket])

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showEmojiPicker && !target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      const messageContent = newMessage.trim();
      setNewMessage("");
      
      try {
        // Send via API for persistence (backend will handle WebSocket broadcast)
        await dispatch(sendMessage({
          conversationId: selectedConversation,
          content: messageContent
        }));
        
        // Reload messages to show the new one
        dispatch(getMessages({ conversationId: selectedConversation }));
        
        // Scroll to bottom after sending message
        setTimeout(() => {
          forceScrollToBottom();
        }, 100);
        
      } catch (error) {
        // Restore message on error
        setNewMessage(messageContent);
      }
      
      if (isConnected) {
        stopTyping(selectedConversation)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    
    if (selectedConversation && isConnected) {
      if (!isTyping) {
        setIsTyping(true)
        startTyping(selectedConversation)
      }
      
      // Clear typing indicator after 3 seconds of no typing
      setTimeout(() => {
        if (isTyping) {
          setIsTyping(false)
          stopTyping(selectedConversation)
        }
      }, 3000)
    }
  }

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId)
  }

  // Emoji data
  const emojis = [
    // Smileys & Emotion
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
    '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
    '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
    '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
    
    // Hearts & Love
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤',
    '🤍', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
    '💘', '💝', '💟', '♥️', '💋', '💯', '💢', '💥',
    
    // Hand gestures
    '👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟',
    '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️',
    '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤲',
    '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶',
    
    // Music & Instruments
    '🎵', '🎶', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸',
    '🪕', '🎻', '🎤', '🎧', '📻', '🎙️', '🔊', '🔉',
    
    // Fun & Activities
    '🎉', '🎊', '🎈', '🎁', '🎀', '🏆', '🥇', '🥈',
    '🥉', '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐',
    '🏓', '🎱', '🎯', '🎮', '🕹️', '🎰', '🃏', '🀄',
    
    // Food & Drink
    '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
    '🍑', '🍒', '🥝', '🍅', '🥕', '🌽', '🌶️', '🫒',
    '🥑', '🍆', '🥔', '🍕', '🍔', '🌭', '🥪', '🌮',
    '🌯', '🥙', '🧆', '🥚', '🍳', '🥓', '🥞', '🧇',
    '☕', '🍵', '🧃', '🥤', '🧋', '🍺', '🍻', '🥂'
  ]

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  // Get selected conversation details
  const selectedConversationDetails = uniqueConversations.find(conv => conv.id === selectedConversation)

  // Remove duplicate messages by ID
  const uniqueMessages = currentMessages.filter((message, index, self) =>
    index === self.findIndex(m => m.id === message.id)
  )

  // Track message count changes for sound notifications
  useEffect(() => {
    const currentMessageCount = uniqueMessages.length;
    if (prevMessageCount.current > 0 && currentMessageCount > prevMessageCount.current) {
      // Check if the last message is from another user before playing sound
      const lastMessage = uniqueMessages[uniqueMessages.length - 1];
      if (lastMessage && lastMessage.senderId !== user?._id) {
        // New message arrived from another user, play sound
        playNotificationSound(0.5);
      }
    }
    prevMessageCount.current = currentMessageCount;
  }, [uniqueMessages.length, user?._id])

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Dün'
    } else {
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
    }
  }

  // Scroll to bottom function - only scroll the messages container
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  // Force scroll to bottom function (for immediate scroll) - only scroll the messages container
  const forceScrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'auto'
      })
    }
  }

  // Auto scroll to bottom only when user sends a message
  // We'll handle this in handleSendMessage instead

  // Auto scroll to bottom when conversation changes or messages change
  useEffect(() => {
    if (selectedConversation) {
      // Use force scroll for immediate positioning
      setTimeout(() => {
        forceScrollToBottom();
      }, 100);
    }
  }, [selectedConversation, uniqueMessages.length])

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-background border-b border-border flex-shrink-0">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Mesajlar</h1>
              <p className="text-sm text-muted-foreground">Diğer müzisyenlerle iletişim kurun</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-muted-foreground">
                {isConnected ? 'Bağlı' : 'Bağlantı yok'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 lg:px-4 py-2 lg:py-4 max-w-7xl flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-4 h-full">
          {/* Conversations List */}
          <div className={`lg:col-span-1 bg-card rounded-xl border border-border shadow-sm flex flex-col overflow-hidden ${
            selectedConversation ? 'hidden lg:flex' : 'flex'
          }`}>
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Mesajlarda ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {messagesLoading && conversations.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <p className="text-muted-foreground text-center">
                    {searchQuery ? 'Arama kriterlerinize uygun konuşma bulunamadı' : 'Henüz konuşmanız yok'}
                  </p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border ${
                      selectedConversation === conversation.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => handleConversationSelect(conversation.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          {conversation.avatar ? (
                            <img 
                              src={conversation.avatar} 
                              alt={conversation.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <User className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        {isUserOnline(conversation.otherParticipant._id) && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-card-foreground truncate">
                            {conversation.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(conversation.timestamp)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.listing && (
                          <div className="flex items-center space-x-2 mt-1 cursor-pointer hover:bg-muted/30 rounded p-1 -m-1 transition-colors"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 const slug = createTitleSlug(conversation.listing.title);
                                 window.open(`/ilan-detay/${slug}`, '_blank');
                               }}>
                            <div className="w-4 h-4 rounded overflow-hidden bg-muted flex-shrink-0">
                              <img 
                                src={conversation.listing.image} 
                                alt={conversation.listing.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs text-muted-foreground truncate block">
                                {conversation.listing.title}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`lg:col-span-2 bg-card rounded-xl border border-border shadow-sm flex flex-col overflow-hidden ${
            selectedConversation ? 'flex' : 'hidden lg:flex'
          }`}>
            {selectedConversation && selectedConversationDetails ? (
              <>
                {/* Chat Header */}
                <div className="p-3 lg:p-4 border-b border-border flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Mobile Back Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          {selectedConversationDetails?.avatar ? (
                            <img 
                              src={selectedConversationDetails.avatar} 
                              alt={selectedConversationDetails?.name || 'Kullanıcı'}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <User className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        {selectedConversationDetails?.otherParticipant?._id && isUserOnline(selectedConversationDetails.otherParticipant._id) && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">
                          {selectedConversationDetails?.name || 'Konuşma'}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {selectedConversationDetails?.otherParticipant?._id && isUserOnline(selectedConversationDetails.otherParticipant._id) ? 'Çevrimiçi' : 'Son görülme: ' + formatTimestamp(selectedConversationDetails?.timestamp || '')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Listing Information */}
                  {selectedConversationDetails?.listing && (
                    <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                         onClick={() => {
                           const slug = createTitleSlug(selectedConversationDetails.listing.title);
                           window.open(`/ilan-detay/${slug}`, '_blank');
                         }}>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img 
                            src={selectedConversationDetails.listing.image} 
                            alt={selectedConversationDetails.listing.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-card-foreground truncate">
                            {selectedConversationDetails.listing.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Bu ilan hakkında konuşuyorsunuz - Tıklayarak ilanı görüntüleyin
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4 scroll-smooth min-h-0"
                >
                  {messagesLoading && uniqueMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : uniqueMessages.length === 0 && !messagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Henüz mesaj yok. İlk mesajı siz gönderin!</p>
                    </div>
                  ) : uniqueMessages.length > 0 ? (
                    <>
                      {uniqueMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.senderId === user?._id ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            {/* Avatar - only show for other users */}
                            {message.senderId !== user?._id && (
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mb-1">
                                {message.sender?.picture ? (
                                  <img 
                                    src={message.sender.picture} 
                                    alt={message.sender.name || 'Kullanıcı'}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <User className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                            )}
                            
                            {/* Message bubble */}
                            <div
                              className={`px-4 py-2 rounded-lg ${
                                message.senderId === user?._id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {/* Sender name - only show for other users */}
                              {message.senderId !== user?._id && message.sender && (
                                <div className="text-xs font-medium mb-1 opacity-80">
                                  {message.sender.name} {message.sender.surname}
                                </div>
                              )}
                              
                              <p className="text-sm">{message.content}</p>
                              <div className="flex items-center justify-end mt-1 space-x-1">
                                <span className="text-xs opacity-70">
                                  {message.timestamp}
                                </span>
                                {message.senderId === user?._id && (
                                  <div className="flex items-center">
                                    {message.isRead ? (
                                      <CheckCheck className="w-3 h-3" />
                                    ) : (
                                      <Check className="w-3 h-3" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Typing Indicator */}
                      {typingUsers.length > 0 && (
                        <div className="flex justify-start">
                          <div className="flex items-end space-x-2">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mb-1">
                              <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg">
                              <p className="text-sm">
                                {typingUsers.join(', ')} yazıyor...
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Scroll anchor */}
                      <div ref={messagesEndRef} />
                    </>
                  ) : null}
                </div>

                {/* Message Input */}
                <div className="p-3 lg:p-4 border-t border-border flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Mesajınızı yazın..."
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="pr-12"
                        disabled={messagesLoading}
                      />
                      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 emoji-picker-container">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          disabled={messagesLoading}
                        >
                          <Smile className="w-4 h-4" />
                        </Button>
                        
                        {/* Emoji Picker Popover */}
                        {showEmojiPicker && (
                          <div className="absolute bottom-12 right-0 z-50 bg-card border border-border rounded-lg shadow-lg p-4 w-80 max-h-64 overflow-y-auto">
                            <h3 className="text-sm font-medium text-foreground mb-3">Emoji Seçin</h3>
                            <div className="grid grid-cols-8 gap-2">
                              {emojis.map((emoji, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleEmojiSelect(emoji)}
                                  className="w-8 h-8 text-xl hover:bg-muted rounded transition-all duration-200 flex items-center justify-center hover:scale-110"
                                  title={emoji}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || messagesLoading}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {messagesLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  {isStartingConversation ? (
                    <>
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                      </div>
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">
                        Konuşma başlatılıyor...
                      </h3>
                      <p className="text-muted-foreground">
                        Lütfen bekleyin
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">
                        Bir konuşma seçin
                      </h3>
                      <p className="text-muted-foreground">
                        Sol taraftan bir konuşma seçerek mesajlaşmaya başlayın
                      </p>
                    </>
                  )}
                  {messagesError && (
                    <p className="text-red-500 text-sm mt-2">
                      {messagesError}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagesPage
