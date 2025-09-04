"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Bell, 
  Check, 
  X, 
  MessageCircle, 
  UserPlus, 
  Music,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/redux/hook"
import { 
  getUserNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  getNotificationStats 
} from "@/redux/actions/notificationActions"

export function NotificationsPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { notifications, loading, error, stats } = useAppSelector((state) => state.notification)
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Load notifications on component mount
  useEffect(() => {
    dispatch(getUserNotifications({ page: currentPage, limit: 20 }))
    dispatch(getNotificationStats())
  }, [dispatch, currentPage])

  const unreadCount = stats?.unread || 0

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id))
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
  }

  const handleDeleteNotification = (id: string) => {
    dispatch(deleteNotification(id))
  }

  const handleViewListing = (listingId: string) => {
    router.push(`/ilan-detay/${listingId}`)
  }

  const handleViewMessage = (conversationId: string) => {
    router.push(`/mesajlar?conversationId=${conversationId}`)
  }

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.isRead)
    : notifications

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Az önce'
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} saat önce`
    return `${Math.floor(diffInMinutes / 1440)} gün önce`
  }

  const getNotificationIcon = (type: string) => {
    const iconClass = `w-5 h-5 ${
      type === "message_received" ? "text-blue-500" :
      type === "listing_created" ? "text-purple-500" :
      type === "listing_approved" ? "text-green-500" :
      type === "listing_rejected" ? "text-red-500" :
      type === "welcome" ? "text-green-500" :
      type === "system" ? "text-blue-600" :
      "text-muted-foreground"
    }`
    
    switch (type) {
      case 'message_received':
        return <MessageCircle className={iconClass} />
      case 'listing_created':
        return <FileText className={iconClass} />
      case 'listing_approved':
        return <CheckCircle className={iconClass} />
      case 'listing_rejected':
        return <XCircle className={iconClass} />
      case 'welcome':
        return <UserPlus className={iconClass} />
      case 'system':
        return <AlertCircle className={iconClass} />
      default:
        return <Bell className={iconClass} />
    }
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

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border shadow-sm p-4 animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-5 h-5 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Notifications List */}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`bg-card rounded-xl border border-border shadow-sm p-4 transition-all duration-200 hover:shadow-md ${
                    !notification.isRead ? 'ring-2 ring-primary/20' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
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
                              {formatTimestamp(notification.createdAt)}
                            </span>
                            {notification.conversationId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-primary hover:text-primary"
                                onClick={() => handleViewMessage(notification.conversationId)}
                              >
                                Mesajı Görüntüle
                              </Button>
                            )}
                            {notification.listingId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-primary hover:text-primary"
                                onClick={() => handleViewListing(notification.listingId)}
                              >
                                İlanı Görüntüle
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-4">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification._id)}
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
        )}


      </div>
    </div>
  )
}
