"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { 
  getAllContacts, 
  getContactById, 
  updateContactStatus, 
  deleteContact,
  getContactStats 
} from "@/redux/actions/contactActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  MessageSquare, 
  Filter,
  BarChart3,
  Mail,
  Phone,
  Calendar,
  User
} from "lucide-react";

export default function ContactManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    contacts, 
    currentContact, 
    stats, 
    loading, 
    error, 
    message, 
    pagination 
  } = useSelector((state: RootState) => state.contact);

  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    search: "",
    page: 1,
    limit: 20
  });
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    status: "",
    priority: "",
    adminNotes: ""
  });

  useEffect(() => {
    dispatch(getAllContacts(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(getContactStats());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      // Auto-hide message after 3 seconds
      setTimeout(() => {
        // You can add a toast notification here
      }, 3000);
    }
  }, [message]);

  const handleFilterChange = (key: string, value: string) => {
    // Convert "all" to empty string for backend API
    const apiValue = value === "all" ? "" : value;
    setFilters(prev => ({ ...prev, [key]: apiValue, page: 1 }));
  };

  const handleViewContact = async (contact: any) => {
    setSelectedContact(contact);
    setIsViewDialogOpen(true);
    // Mark as read if status is new
    if (contact.status === 'new') {
      try {
        await dispatch(updateContactStatus({
          id: contact._id,
          formData: { status: 'read' }
        })).unwrap();
      } catch (error) {
        console.error('Status update error:', error);
      }
    }
  };

  const handleEditContact = (contact: any) => {
    setSelectedContact(contact);
    setEditForm({
      status: contact.status,
      priority: contact.priority,
      adminNotes: contact.adminNotes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateContact = async () => {
    if (selectedContact) {
      try {
        await dispatch(updateContactStatus({
          id: selectedContact._id,
          formData: editForm
        })).unwrap();
        setIsEditDialogOpen(false);
        setSelectedContact(null);
        setEditForm({ status: "", priority: "", adminNotes: "" });
      } catch (error) {
        console.error('Update error:', error);
      }
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm("Bu iletişim mesajını silmek istediğinizden emin misiniz?")) {
      try {
        await dispatch(deleteContact(id)).unwrap();
        // Success message will be shown from Redux state
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { variant: "default", text: "Yeni" },
      read: { variant: "secondary", text: "Okundu" },
      replied: { variant: "success", text: "Yanıtlandı" },
      closed: { variant: "destructive", text: "Kapatıldı" }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge variant={config.variant as any}>{config.text}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { variant: "outline", text: "Düşük" },
      medium: { variant: "secondary", text: "Orta" },
      high: { variant: "destructive", text: "Yüksek" },
      urgent: { variant: "destructive", text: "Acil" }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    return <Badge variant={config.variant as any}>{config.text}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">İletişim Yönetimi</h1>
        <p className="text-muted-foreground">
          Gelen iletişim mesajlarını yönetin ve yanıtlayın
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Mesaj</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yeni Mesajlar</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.new || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yanıtlanan</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.replied || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acil Mesajlar</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.urgent || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtreler
            </CardTitle>
            <Button 
              variant="outline" 
              onClick={() => dispatch(getAllContacts(filters))}
              disabled={loading}
            >
              Yenile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Arama</label>
              <Input
                placeholder="İsim, e-posta, konu..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Durum</label>
              <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger disabled={loading}>
                  <SelectValue placeholder="Tümü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="new">Yeni</SelectItem>
                  <SelectItem value="read">Okundu</SelectItem>
                  <SelectItem value="replied">Yanıtlandı</SelectItem>
                  <SelectItem value="closed">Kapatıldı</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Öncelik</label>
              <Select value={filters.priority || "all"} onValueChange={(value) => handleFilterChange("priority", value)}>
                <SelectTrigger disabled={loading}>
                  <SelectValue placeholder="Tümü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="low">Düşük</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="high">Yüksek</SelectItem>
                  <SelectItem value="urgent">Acil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Sayfa Başına</label>
              <Select value={filters.limit.toString()} onValueChange={(value) => handleFilterChange("limit", value)}>
                <SelectTrigger disabled={loading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>İletişim Mesajları</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Mesajlar yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Hata: {error}</p>
              <Button onClick={() => dispatch(getAllContacts(filters))}>
                Tekrar Dene
              </Button>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Henüz Mesaj Yok</h3>
              <p className="text-muted-foreground">
                Henüz hiç iletişim mesajı gönderilmemiş.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gönderen</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Konu</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Öncelik</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {contact.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {contact.email}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{contact.subject}</TableCell>
                    <TableCell>{getStatusBadge(contact.status)}</TableCell>
                    <TableCell>{getPriorityBadge(contact.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(contact.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewContact(contact)}
                              disabled={loading}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Mesaj Detayı</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Ad Soyad</label>
                                  <p className="text-sm text-muted-foreground">{contact.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">E-posta</label>
                                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                                </div>
                                {contact.phone && (
                                  <div>
                                    <label className="text-sm font-medium">Telefon</label>
                                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                                  </div>
                                )}
                                <div>
                                  <label className="text-sm font-medium">Tarih</label>
                                  <p className="text-sm text-muted-foreground">{formatDate(contact.createdAt)}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Konu</label>
                                <p className="text-sm text-muted-foreground">{contact.subject}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Mesaj</label>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contact.message}</p>
                              </div>
                              {contact.adminNotes && (
                                <div>
                                  <label className="text-sm font-medium">Admin Notları</label>
                                  <p className="text-sm text-muted-foreground">{contact.adminNotes}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditContact(contact)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteContact(contact._id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Toplam {pagination.totalItems} mesaj, sayfa {pagination.currentPage} / {pagination.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page <= 1 || loading}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Önceki
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page >= pagination.totalPages || loading}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Sonraki
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Contact Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mesaj Durumunu Güncelle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Durum</label>
              <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}>
                <SelectTrigger disabled={loading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Yeni</SelectItem>
                  <SelectItem value="read">Okundu</SelectItem>
                  <SelectItem value="replied">Yanıtlandı</SelectItem>
                  <SelectItem value="closed">Kapatıldı</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Öncelik</label>
              <Select value={editForm.priority} onValueChange={(value) => setEditForm(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger disabled={loading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Düşük</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="high">Yüksek</SelectItem>
                  <SelectItem value="urgent">Acil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Admin Notları</label>
              <Textarea
                placeholder="Not ekleyin..."
                value={editForm.adminNotes}
                onChange={(e) => setEditForm(prev => ({ ...prev, adminNotes: e.target.value }))}
                rows={3}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleUpdateContact} disabled={loading}>
                Güncelle
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Messages */}
      {message && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          {message}
        </div>
      )}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
