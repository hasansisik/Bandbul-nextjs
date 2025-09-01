"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Bell, 
  Check, 
  X, 
  MessageCircle, 
  UserPlus, 
  Music
} from "lucide-react"

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: "message",
    title: "Yeni Mesaj",
    message: "Ayşe Demir size bir mesaj gönderdi",
    timestamp: "5 dakika önce",
    isRead: false,
    icon: MessageCircle,
    action: "Mesajı Görüntüle"
  },
  {
    id: 2,
    type: "listing",
    title: "İlanınız Yayınlandı",
    message: "Gitar Dersi ilanınız başarıyla yayınlandı",
    timestamp: "1 saat önce",
    isRead: false,
    icon: Music,
    action: "İlanı Görüntüle"
  },
  {
    id: 3,
    type: "welcome",
    title: "Aramıza Hoşgeldiniz",
    message: "Bandbul'a hoşgeldiniz! İlk ilanınızı oluşturmaya başlayabilirsiniz",
    timestamp: "2 gün önce",
    isRead: true,
    icon: UserPlus,
    action: "İlan Oluştur"
  },
  {
    id: 4,
    type: "message",
    title: "Yeni Mesaj",
    message: "Mehmet Kaya size bir mesaj gönderdi",
    timestamp: "3 saat önce",
    isRead: true,
    icon: MessageCircle,
    action: "Mesajı Görüntüle"
  },
  {
    id: 5,
    type: "listing",
    title: "İlanınız Yayınlandı",
    message: "Piyano Dersi ilanınız başarıyla yayınlandı",
    timestamp: "1 gün önce",
    isRead: true,
    icon: Music,
    action: "İlanı Görüntüle"
  },
  {
    id: 6,
    type: "message",
    title: "Yeni Mesaj",
    message: "Zeynep Yılmaz size bir mesaj gönderdi",
    timestamp: "2 gün önce",
    isRead: true,
    icon: MessageCircle,
    action: "Mesajı Görüntüle"
  }
]

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, isRead: true }
        : notification
    ))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => 
      ({ ...notification, isRead: true })
    ))
  }

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id))
  }

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.isRead)
    : notifications

  const getNotificationIcon = (icon: any, type: string) => {
    const IconComponent = icon
    const iconClass = `w-5 h-5 ${
      type === "message" ? "text-blue-500" :
      type === "listing" ? "text-purple-500" :
      type === "welcome" ? "text-green-500" :
      type === "reminder" ? "text-orange-500" :
      type === "system" ? "text-blue-600" :
      type === "warning" ? "text-red-600" :
      "text-muted-foreground"
    }`
    
    return <IconComponent className={iconClass} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Bildirimler</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : "Tüm bildirimler okundu"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleMarkAllAsRead}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Tümünü Okundu İşaretle
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-background text-foreground" : ""}
            >
              Tümü
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("unread")}
              className={filter === "unread" ? "bg-background text-foreground" : ""}
            >
              Okunmamış
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-card rounded-xl border border-border shadow-sm p-4 transition-all duration-200 hover:shadow-md ${
                  !notification.isRead ? 'ring-2 ring-primary/20' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.icon, notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-card-foreground">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-primary hover:text-primary"
                          >
                            {notification.action}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-4">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card rounded-xl border border-border shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {filter === "unread" ? "Okunmamış bildirim yok" : "Henüz bildirim yok"}
              </h3>
              <p className="text-muted-foreground">
                {filter === "unread" 
                  ? "Tüm bildirimlerinizi okudunuz" 
                  : "Yeni bildirimler geldiğinde burada görünecek"
                }
              </p>
            </div>
          )}
        </div>


      </div>
    </div>
  )
}
