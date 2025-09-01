"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  Send, 
  MoreVertical, 
  Smile, 
  User,
  Clock,
  Check,
  CheckCheck
} from "lucide-react"

// Mock data for conversations
const mockConversations = [
  {
    id: 1,
    name: "Ayşe Demir",
    avatar: null,
    lastMessage: "Gitar dersi için ne zaman uygun olursunuz?",
    timestamp: "10:30",
    unreadCount: 2,
    isOnline: true
  },
  {
    id: 2,
    name: "Mehmet Kaya",
    avatar: null,
    lastMessage: "Piyano dersi hakkında bilgi almak istiyorum",
    timestamp: "09:15",
    unreadCount: 0,
    isOnline: false
  },
  {
    id: 3,
    name: "Zeynep Özkan",
    avatar: null,
    lastMessage: "Rock grubumuz için gitarist arıyoruz",
    timestamp: "Dün",
    unreadCount: 1,
    isOnline: true
  },
  {
    id: 4,
    name: "Can Yılmaz",
    avatar: null,
    lastMessage: "Davul dersi veriyor musunuz?",
    timestamp: "2 gün önce",
    unreadCount: 0,
    isOnline: false
  }
]

// Mock messages for selected conversation
const mockMessages = [
  {
    id: 1,
    senderId: 1,
    content: "Merhaba! Gitar dersi veriyor musunuz?",
    timestamp: "10:00",
    isRead: true
  },
  {
    id: 2,
    senderId: 0, // Current user
    content: "Evet, gitar dersi veriyorum. Hangi seviyede ders almak istiyorsunuz?",
    timestamp: "10:05",
    isRead: true
  },
  {
    id: 3,
    senderId: 1,
    content: "Başlangıç seviyesindeyim. Haftada kaç saat ders alabilirim?",
    timestamp: "10:15",
    isRead: true
  },
  {
    id: 4,
    senderId: 0,
    content: "Haftada 2-3 saat ideal olur. Size uygun günler neler?",
    timestamp: "10:20",
    isRead: true
  },
  {
    id: 5,
    senderId: 1,
    content: "Gitar dersi için ne zaman uygun olursunuz?",
    timestamp: "10:30",
    isRead: false
  }
]

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const currentConversation = mockConversations.find(conv => conv.id === selectedConversation)
  const conversationMessages = mockMessages

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, this would send message to API
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Mesajlar</h1>
          <p className="text-muted-foreground">Diğer müzisyenlerle iletişim kurun</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-card rounded-xl border border-border shadow-sm flex flex-col">
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
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border ${
                    selectedConversation === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
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
                      {conversation.isOnline && (
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
                            {conversation.timestamp}
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm flex flex-col">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {currentConversation.avatar ? (
                          <img 
                            src={currentConversation.avatar} 
                            alt={currentConversation.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <User className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      {currentConversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">
                        {currentConversation.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {currentConversation.isOnline ? 'Çevrimiçi' : 'Son görülme: ' + currentConversation.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 0 ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === 0
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-end mt-1 space-x-1">
                          <span className="text-xs opacity-70">
                            {message.timestamp}
                          </span>
                          {message.senderId === 0 && (
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
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Mesajınızı yazın..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pr-12"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      >
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    Bir konuşma seçin
                  </h3>
                  <p className="text-muted-foreground">
                    Sol taraftan bir konuşma seçerek mesajlaşmaya başlayın
                  </p>
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
