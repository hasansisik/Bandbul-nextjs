"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { 
  getAllContacts, 
  updateContactStatus, 
  deleteContact,
  getContactStats 
} from "@/redux/actions/contactActions";
import { toast } from "sonner";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
  MessageSquare,
  Search,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  RefreshCw
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function FormsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    contacts, 
    stats, 
    loading, 
    error, 
    message, 
    pagination 
  } = useSelector((state: RootState) => state.contact);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
    page: 1,
    limit: 20
  });

  // Load contacts and stats on component mount
  useEffect(() => {
    dispatch(getAllContacts(filters));
    dispatch(getContactStats());
  }, [dispatch, filters]);

  // Handle success and error messages with Sonner
  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error]);

  // Handle loading state changes for refresh feedback
  useEffect(() => {
    if (!loading && !error && message) {
      // Dismiss loading toast when operation completes
      toast.dismiss();
    }
  }, [loading, error, message]);

  // Handle URL parameters for status filter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const statusParam = urlParams.get('status');
    if (statusParam && ['new', 'read', 'replied', 'closed'].includes(statusParam)) {
      setStatusFilter(statusParam);
      setFilters(prev => ({ ...prev, status: statusParam }));
    } else {
      setStatusFilter("all");
      setFilters(prev => ({ ...prev, status: "" }));
    }
  }, []);

  // Update filters when local state changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      status: statusFilter === "all" ? "" : statusFilter,
      priority: priorityFilter === "all" ? "" : priorityFilter,
      search: searchTerm,
      page: currentPage
    }));
  }, [statusFilter, priorityFilter, searchTerm, currentPage]);

  // Filter contacts based on search term and status
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchTerm || 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || contact.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination logic
  const totalPages = pagination ? pagination.totalPages : 1;
  const startIndex = (currentPage - 1) * filters.limit;
  const endIndex = startIndex + filters.limit;
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteContact(id)).unwrap();
      toast.success('Mesaj başarıyla silindi');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Mesaj silinirken bir hata oluştu');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await dispatch(updateContactStatus({
        id,
        formData: { status: 'read' }
      })).unwrap();
      toast.success('Mesaj okundu olarak işaretlendi');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Durum güncellenirken bir hata oluştu');
    }
  };

  const markAsReplied = async (id: string) => {
    try {
      await dispatch(updateContactStatus({
        id,
        formData: { status: 'replied' }
      })).unwrap();
      toast.success('Mesaj yanıtlandı olarak işaretlendi');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Durum güncellenirken bir hata oluştu');
    }
  };

  const markAsClosed = async (id: string) => {
    try {
      await dispatch(updateContactStatus({
        id,
        formData: { status: 'closed' }
      })).unwrap();
      toast.success('Mesaj kapatıldı');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Durum güncellenirken bir hata oluştu');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-red-500 hover:bg-red-600">Yeni</Badge>;
      case 'read':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Okundu</Badge>;
      case 'replied':
        return <Badge className="bg-green-500 hover:bg-green-600">Yanıtlandı</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Kapatıldı</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="border-green-500 text-green-600">Düşük</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Orta</Badge>;
      case 'high':
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Yüksek</Badge>;
      case 'urgent':
        return <Badge variant="outline" className="border-red-500 text-red-600">Acil</Badge>;
      default:
        return <Badge variant="outline">Orta</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Az önce";
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  const handleRefresh = () => {
    toast.loading('Yenileniyor...');
    dispatch(getAllContacts(filters));
    dispatch(getContactStats());
  };

  return (
    <>
      {/* Header with Sidebar Toggle */}
      <div className="flex items-center gap-4 mb-2">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Ana Sayfa</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>İletişim Formları</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">İletişim Formları</h1>
        <p className="text-muted-foreground">
          Gelen iletişim formlarını görüntüleyin ve yönetin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Form</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Tüm formlar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yeni</CardTitle>
            <Badge className="bg-red-500 hover:bg-red-600">Yeni</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.new || 0}
            </div>
            <p className="text-xs text-muted-foreground">Yanıtlanmamış</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Okundu</CardTitle>
            <Badge className="bg-yellow-500 hover:bg-yellow-600">Okundu</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats?.read || 0}
            </div>
            <p className="text-xs text-muted-foreground">İşlemde</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yanıtlandı</CardTitle>
            <Badge className="bg-green-500 hover:bg-green-600">Yanıtlandı</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.replied || 0}
            </div>
            <p className="text-xs text-muted-foreground">Tamamlandı</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Filtreler ve Arama</h2>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Yenile
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-3">Formları isim, e-posta veya duruma göre filtreleyin</p>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="İsim, e-posta veya konu ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-2 border-border/60 focus:border-ring bg-background/50 backdrop-blur hover:border-border/80 transition-colors"
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex gap-2">
                          <Select value={statusFilter || "all"} onValueChange={setStatusFilter} disabled={loading}>
                <SelectTrigger className="w-[140px] h-10 border-2 border-border/60 bg-background/50 backdrop-blur hover:border-border/80 focus:border-ring focus:ring-2 focus:ring-ring/20">
                  <SelectValue placeholder="Tüm Durumlar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="new">Yeni</SelectItem>
                  <SelectItem value="read">Okundu</SelectItem>
                  <SelectItem value="replied">Yanıtlandı</SelectItem>
                  <SelectItem value="closed">Kapatıldı</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter || "all"} onValueChange={setPriorityFilter} disabled={loading}>
                <SelectTrigger className="w-[140px] h-10 border-2 border-border/60 bg-background/50 backdrop-blur hover:border-border/80 focus:border-ring focus:ring-2 focus:ring-ring/20">
                  <SelectValue placeholder="Tüm Öncelikler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Öncelikler</SelectItem>
                  <SelectItem value="low">Düşük</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="high">Yüksek</SelectItem>
                  <SelectItem value="urgent">Acil</SelectItem>
                </SelectContent>
              </Select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Formlar yükleniyor...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Hata: {error}</p>
          <Button onClick={handleRefresh}>
            Tekrar Dene
          </Button>
        </div>
      )}

      {/* Forms List */}
      {!loading && !error && currentContacts.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {filteredContacts.length === 0 ? "Henüz hiç iletişim formu gönderilmemiş" : "Gösterilecek form bulunamadı"}
          </p>
        </div>
      ) : (
        !loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {currentContacts.map((contact) => (
              <Card key={contact._id} className="hover:shadow-md transition-all duration-200 flex flex-col">
                <CardHeader className="pb-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm truncate">{contact.name}</h3>
                    <div className="flex flex-col gap-1 items-end">
                      {getStatusBadge(contact.status)}
                      {getPriorityBadge(contact.priority)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(contact.createdAt)}</p>
                </CardHeader>

                <CardContent className="pt-0 space-y-2 flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">E-posta:</span>
                      <span className="font-medium truncate">{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-xs">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Telefon:</span>
                        <span className="font-medium truncate">{contact.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground">Konu:</span>
                    <p className="text-sm font-medium mt-1 line-clamp-2">{contact.subject}</p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground">Mesaj:</span>
                    <p className="text-xs mt-1 text-muted-foreground line-clamp-3">
                      {contact.message}
                    </p>
                  </div>
                </CardContent>

                <div className="px-6 pb-2">
                  <div className="flex flex-col gap-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedContact(contact)}
                      className="w-full h-8 text-xs"
                      disabled={loading}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Detay
                    </Button>

                    {contact.status === 'new' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsRead(contact._id)}
                        className="w-full h-8 text-xs"
                        disabled={loading}
                      >
                        Okundu
                      </Button>
                    )}

                    {contact.status === 'read' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsReplied(contact._id)}
                        className="w-full h-8 text-xs"
                        disabled={loading}
                      >
                        Yanıtlandı
                      </Button>
                    )}

                    {contact.status === 'replied' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsClosed(contact._id)}
                        className="w-full h-8 text-xs"
                        disabled={loading}
                      >
                        Kapat
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full h-8 text-xs" disabled={loading}>
                          <Trash2 className="h-3 w-3 mr-1" />
                          Sil
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Formu Sil</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu formu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(contact._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            {startIndex + 1}-{Math.min(endIndex, filteredContacts.length)} / {filteredContacts.length} form
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => goToPage(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => goToPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => goToPage(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Form Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Form Detayı</h2>
                <Button
                  variant="outline"
                  onClick={() => setSelectedContact(null)}
                >
                  Kapat
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Ad Soyad</label>
                    <p className="font-medium">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">E-posta</label>
                    <p className="font-medium">{selectedContact.email}</p>
                  </div>
                </div>

                {selectedContact.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Telefon</label>
                    <p className="font-medium">{selectedContact.phone}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Konu</label>
                  <p className="font-medium">{selectedContact.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mesaj</label>
                  <p className="whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                    {selectedContact.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Gönderim Tarihi: {formatDate(selectedContact.createdAt)}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Durum:</span>
                    {getStatusBadge(selectedContact.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Öncelik:</span>
                    {getPriorityBadge(selectedContact.priority)}
                  </div>
                </div>

                {selectedContact.adminNotes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Admin Notları</label>
                    <p className="whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                      {selectedContact.adminNotes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t">
                                  {selectedContact.status === 'new' && (
                    <Button
                      onClick={async () => {
                        await markAsRead(selectedContact._id);
                        setSelectedContact(null);
                      }}
                      className="flex-1"
                      disabled={loading}
                    >
                      Okundu İşaretle
                    </Button>
                  )}

                                  {selectedContact.status === 'read' && (
                    <Button
                      onClick={async () => {
                        await markAsReplied(selectedContact._id);
                        setSelectedContact(null);
                      }}
                      className="flex-1"
                      disabled={loading}
                    >
                      Yanıtlandı İşaretle
                    </Button>
                  )}

                                  {selectedContact.status === 'replied' && (
                    <Button
                      onClick={async () => {
                        await markAsClosed(selectedContact._id);
                        setSelectedContact(null);
                      }}
                      className="flex-1"
                      disabled={loading}
                    >
                      Kapat
                    </Button>
                  )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex-1" disabled={loading}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Sil
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Formu Sil</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu formu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                                              <AlertDialogAction
                          onClick={async () => {
                            await handleDelete(selectedContact._id);
                            setSelectedContact(null);
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Sil
                        </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </>
  );
}
