"use client";

import { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
  MessageSquare,
  Search,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight
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

interface ContactForm {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: Date;
  status: 'new' | 'read' | 'replied';
}

export default function FormsPage() {
  const [forms, setForms] = useState<ContactForm[]>([]);
  const [filteredForms, setFilteredForms] = useState<ContactForm[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedForm, setSelectedForm] = useState<ContactForm | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 20;

  // Mock data - in real app this would come from an API
  useEffect(() => {
    const mockForms: ContactForm[] = [
      {
        id: "1",
        name: "Ahmet Yılmaz",
        email: "ahmet@example.com",
        phone: "+90 532 123 45 67",
        subject: "Müzik Dersi Hakkında",
        message: "Merhaba, gitar dersi almak istiyorum. Fiyat bilgisi ve ders programı hakkında bilgi verebilir misiniz?",
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'new'
      },
      {
        id: "2",
        name: "Ayşe Demir",
        email: "ayse@example.com",
        phone: "+90 533 987 65 43",
        subject: "Konser Organizasyonu",
        message: "Bandımız için konser organizasyonu yapıyor musunuz? 50-100 kişilik bir mekan arıyoruz.",
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'read'
      },
      {
        id: "3",
        name: "Mehmet Kaya",
        email: "mehmet@example.com",
        phone: "+90 535 456 78 90",
        subject: "Enstrüman Satışı",
        message: "İkinci el gitar satışı yapıyor musunuz? Bütçem 2000-3000 TL arası.",
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'replied'
      },
      {
        id: "4",
        name: "Fatma Özkan",
        email: "fatma@example.com",
        phone: "+90 536 789 01 23",
        subject: "Müzik Prodüksiyon",
        message: "Şarkı kaydı yapmak istiyorum. Stüdyo kiralama fiyatları nedir?",
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'new'
      },
      {
        id: "5",
        name: "Can Arslan",
        email: "can@example.com",
        phone: "+90 537 321 54 76",
        subject: "Band Üyesi Arama",
        message: "Rock grubumuz için baterist arıyoruz. Deneyimli müzisyenler başvurabilir.",
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'read'
      }
    ];
    setForms(mockForms);
    setFilteredForms(mockForms);
  }, []);

  // Handle URL parameters for status filter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const statusParam = urlParams.get('status');
    if (statusParam && ['new', 'read', 'replied'].includes(statusParam)) {
      setStatusFilter(statusParam);
    }
  }, []);

  // Filter forms based on search term and status
  useEffect(() => {
    let filtered = forms;

    if (searchTerm) {
      filtered = filtered.filter(form =>
        form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(form => form.status === statusFilter);
    }

    setFilteredForms(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, statusFilter, forms]);

  // Pagination logic
  const totalPages = Math.ceil(filteredForms.length / formsPerPage);
  const startIndex = (currentPage - 1) * formsPerPage;
  const endIndex = startIndex + formsPerPage;
  const currentForms = filteredForms.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (id: string) => {
    setForms(prev => prev.filter(form => form.id !== id));
  };

  const markAsRead = (id: string) => {
    setForms(prev => prev.map(form =>
      form.id === id ? { ...form, status: 'read' as const } : form
    ));
  };

  const markAsReplied = (id: string) => {
    setForms(prev => prev.map(form =>
      form.id === id ? { ...form, status: 'replied' as const } : form
    ));
  };

  const markAsUnread = (id: string) => {
    setForms(prev => prev.map(form =>
      form.id === id ? { ...form, status: 'new' as const } : form
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-red-500 hover:bg-red-600">Yeni</Badge>;
      case 'read':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Okundu</Badge>;
      case 'replied':
        return <Badge className="bg-green-500 hover:bg-green-600">Yanıtlandı</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Az önce";
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <>
      {/* Header with Sidebar Toggle */}
      <div className="flex items-center gap-4 mb-6">
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
            <div className="text-2xl font-bold">{forms.length}</div>
            <p className="text-xs text-muted-foreground">Tüm formlar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yeni</CardTitle>
            <Badge className="bg-red-500 hover:bg-red-600">Yeni</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forms.filter(f => f.status === 'new').length}
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
            <div className="text-2xl font-bold">
              {forms.filter(f => f.status === 'read').length}
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
            <div className="text-2xl font-bold">
              {forms.filter(f => f.status === 'replied').length}
            </div>
            <p className="text-xs text-muted-foreground">Tamamlandı</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Filtreler ve Arama</h2>
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
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-10 border-2 border-border/60 bg-background/50 backdrop-blur hover:border-border/80 focus:border-ring focus:ring-2 focus:ring-ring/20">
                <SelectValue placeholder="Tüm Durumlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="new">Yeni</SelectItem>
                <SelectItem value="read">Okundu</SelectItem>
                <SelectItem value="replied">Yanıtlandı</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Forms List */}
      {currentForms.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Gösterilecek form bulunamadı</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {currentForms.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-all duration-200 flex flex-col">
              <CardHeader className="pb-1">
                <div className="flex items-center justify-between ">
                  <h3 className="font-semibold text-sm truncate">{form.name}</h3>
                  {getStatusBadge(form.status)}
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(form.submittedAt)}</p>
              </CardHeader>

              <CardContent className="pt-0 space-y-2 flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">E-posta:</span>
                    <span className="font-medium truncate">{form.email}</span>
                  </div>
                  {form.phone && (
                    <div className="flex items-center gap-2 text-xs">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Telefon:</span>
                      <span className="font-medium truncate">{form.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs text-muted-foreground">Konu:</span>
                  <p className="text-sm font-medium mt-1 line-clamp-2">{form.subject}</p>
                </div>

                <div>
                  <span className="text-xs text-muted-foreground">Mesaj:</span>
                  <p className="text-xs mt-1 text-muted-foreground line-clamp-3">
                    {form.message}
                  </p>
                </div>
              </CardContent>

              <div className="px-6 pb-2">
                <div className="flex flex-col gap-2  border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedForm(form)}
                    className="w-full h-8 text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Detay
                  </Button>

                  {form.status === 'new' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsRead(form.id)}
                      className="w-full h-8 text-xs"
                    >
                      Okundu
                    </Button>
                  )}

                  {form.status === 'read' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsReplied(form.id)}
                      className="w-full h-8 text-xs"
                    >
                      Yanıtlandı
                    </Button>
                  )}

                  {form.status === 'replied' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsUnread(form.id)}
                      className="w-full h-8 text-xs"
                    >
                      Okunmadı
                    </Button>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="w-full h-8 text-xs">
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
                          onClick={() => handleDelete(form.id)}
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
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            {startIndex + 1}-{Math.min(endIndex, filteredForms.length)} / {filteredForms.length} form
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
      {selectedForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Form Detayı</h2>
                <Button
                  variant="outline"
                  onClick={() => setSelectedForm(null)}
                >
                  Kapat
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Ad Soyad</label>
                    <p className="font-medium">{selectedForm.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">E-posta</label>
                    <p className="font-medium">{selectedForm.email}</p>
                  </div>
                </div>

                {selectedForm.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Telefon</label>
                    <p className="font-medium">{selectedForm.phone}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Konu</label>
                  <p className="font-medium">{selectedForm.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mesaj</label>
                  <p className="whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                    {selectedForm.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Gönderim Tarihi: {selectedForm.submittedAt.toLocaleString('tr-TR')}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Durum:</span>
                  {getStatusBadge(selectedForm.status)}
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t">
                {selectedForm.status === 'new' && (
                  <Button
                    onClick={() => {
                      markAsRead(selectedForm.id);
                      setSelectedForm(null);
                    }}
                    className="flex-1"
                  >
                    Okundu İşaretle
                  </Button>
                )}

                {selectedForm.status === 'read' && (
                  <Button
                    onClick={() => {
                      markAsReplied(selectedForm.id);
                      setSelectedForm(null);
                    }}
                    className="flex-1"
                  >
                    Yanıtlandı İşaretle
                  </Button>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex-1">
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
                        onClick={() => {
                          handleDelete(selectedForm.id);
                          setSelectedForm(null);
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
