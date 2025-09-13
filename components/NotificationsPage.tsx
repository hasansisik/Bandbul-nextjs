"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
  XCircle,
  Clock,
  Archive,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/redux/hook"
import { 
  getUserNotifications, 
  markAsRead,
  markAllAsRead, 
  deleteNotification,
  getNotificationStats 
} from "@/redux/actions/notificationActions"
import { useSocket } from "@/hooks/useSocket"

export function NotificationsPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { notifications, loading, error, stats, pagination } = useAppSelector((state) => state.notification)
  const { user } = useAppSelector((state) => state.user)
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [currentPage, setCurrentPage] = useState(1)

  // WebSocket event handlers
  const lastNotificationIdRef = useRef<string | null>(null);
  
  const handleNewNotification = useCallback((notification: any) => {
    // Check if this is a new notification (not already processed)
    if (notification._id && notification._id !== lastNotificationIdRef.current) {
      lastNotificationIdRef.current = notification._id;
      
      // Add new notification to the list
      dispatch({
        type: 'notification/addNotification',
        payload: notification
      })
      // Update stats only for new notifications
      dispatch(getNotificationStats())
    }
  }, [dispatch])

  const handleNotificationStatsUpdate = useCallback((newStats: any) => {
    // Update stats in Redux store
    dispatch({
      type: 'notification/updateStats',
      payload: newStats
    })
  }, [dispatch])

  // Initialize WebSocket connection
  useSocket({
    token: user?.accessToken || null,
    userId: user?._id || null,
    onNewNotification: handleNewNotification,
    onNotificationStatsUpdate: handleNotificationStatsUpdate
  })

  // Load notifications on component mount
  useEffect(() => {
    dispatch(getUserNotifications({ page: currentPage, limit: 20 }))
  }, [dispatch, currentPage])

  // Fetch stats only once when component mounts
  useEffect(() => {
    dispatch(getNotificationStats())
  }, [dispatch])

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

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page)
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePreviousPage = () => {
    if (pagination && currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.isRead)
    : notifications

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

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
      type === "listing_pending" ? "text-yellow-500" :
      type === "listing_archived" ? "text-gray-500" :
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
      case 'listing_pending':
        return <Clock className={iconClass} />
      case 'listing_archived':
        return <Archive className={iconClass} />
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
              className={filter === "all" 
                ? "bg-background text-foreground hover:bg-background hover:text-foreground" 
                : "hover:bg-background hover:text-foreground"
              }
            >
              Tümü
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("unread")}
              className={filter === "unread" 
                ? "bg-background text-foreground hover:bg-background hover:text-foreground" 
                : "hover:bg-background hover:text-foreground"
              }
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
            <div className="flex items-center justify-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-destructive font-medium">Bir hata oluştu</p>
            </div>
            <p className="text-sm text-destructive/80">
              {error.includes('mongoose') || error.includes('MongoDB') 
                ? "Sunucu bağlantısında geçici bir sorun yaşanıyor. Lütfen sayfayı yenileyin."
                : error
              }
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => window.location.reload()}
            >
              Sayfayı Yenile
            </Button>
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
                                className="text-xs text-primary hover:text-primary hover:bg-primary/10"
                                onClick={() => handleViewMessage(notification.conversationId)}
                              >
                                Mesajı Görüntüle
                              </Button>
                            )}
                            {notification.listingId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-primary hover:text-primary hover:bg-primary/10"
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
                              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                              title="Okundu işaretle"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification._id)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Sil"
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

        {/* Pagination */}
        {!loading && !error && pagination && pagination.totalPages > 1 && filteredNotifications.length > 0 && (
          <div className="mt-8">
            {/* Mobile Pagination */}
            <div className="flex flex-col items-center space-y-4 md:hidden">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage <= 1}
                  className="flex items-center space-x-1 hover:bg-primary hover:text-primary-foreground"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Önceki</span>
                </Button>
                
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-muted-foreground">
                    {currentPage} / {pagination.totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= pagination.totalPages}
                  className="flex items-center space-x-1 hover:bg-primary hover:text-primary-foreground"
                >
                  <span>Sonraki</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                {pagination.totalItems} toplam bildirim
              </div>
            </div>

            {/* Desktop Pagination */}
            <div className="hidden md:flex items-center justify-center">
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage <= 1}
                  className="flex items-center space-x-1 hover:bg-primary hover:text-primary-foreground"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Önceki</span>
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {(() => {
                    const pages = []
                    const totalPages = pagination.totalPages
                    const current = currentPage
                    
                    // Always show first page
                    if (current > 3) {
                      pages.push(
                        <Button
                          key={1}
                          variant={current === 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(1)}
                          className="w-8 h-8 p-0 hover:bg-primary hover:text-primary-foreground"
                        >
                          1
                        </Button>
                      )
                      if (current > 4) {
                        pages.push(
                          <span key="ellipsis1" className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )
                      }
                    }

                    // Show pages around current page
                    const start = Math.max(1, current - 2)
                    const end = Math.min(totalPages, current + 2)
                    
                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={current === i ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(i)}
                          className="w-8 h-8 p-0 hover:bg-primary hover:text-primary-foreground"
                        >
                          {i}
                        </Button>
                      )
                    }

                    // Always show last page
                    if (current < totalPages - 2) {
                      if (current < totalPages - 3) {
                        pages.push(
                          <span key="ellipsis2" className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )
                      }
                      pages.push(
                        <Button
                          key={totalPages}
                          variant={current === totalPages ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className="w-8 h-8 p-0 hover:bg-primary hover:text-primary-foreground"
                        >
                          {totalPages}
                        </Button>
                      )
                    }

                    return pages
                  })()}
                </div>

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= pagination.totalPages}
                  className="flex items-center space-x-1 hover:bg-primary hover:text-primary-foreground"
                >
                  <span>Sonraki</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Page Info */}
              <div className="ml-6 text-sm text-muted-foreground">
                Sayfa {currentPage} / {pagination.totalPages} 
                <span className="ml-2">
                  ({pagination.totalItems} toplam bildirim)
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
