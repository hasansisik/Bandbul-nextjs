"use client"

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAllUsers, deleteUser, updateUserRole } from "@/redux/actions/userActions";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { 
  Users, 
  Trash2, 
  Eye, 
  User,
  Search,
  Filter,
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    allUsers, 
    userStats, 
    usersLoading, 
    usersError, 
    message,
    user: currentUser
  } = useSelector((state: RootState) => state.user);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    page: "1",
    limit: "20"
  });

  // Load users on component mount
  useEffect(() => {
    dispatch(getAllUsers(filters));
  }, [dispatch, filters]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle success and error messages with Sonner
  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (usersError) {
      toast.error(usersError);
    }
  }, [message, usersError]);

  // Clear messages after showing them
  useEffect(() => {
    if (message || usersError) {
      const timer = setTimeout(() => {
        // Clear messages after 5 seconds
        // You can dispatch a clear action here if you have one
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, usersError]);

  // Update filters when local state changes (excluding searchTerm to prevent API calls on every keystroke)
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      role: roleFilter === "all" ? "" : roleFilter,
      status: statusFilter === "all" ? "" : statusFilter,
      page: currentPage.toString()
    }));
  }, [roleFilter, statusFilter, currentPage]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle loading state changes for refresh feedback
  useEffect(() => {
    if (!usersLoading) {
      // Dismiss loading toast when operation completes (success or error)
      toast.dismiss();
    }
  }, [usersLoading]);



  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success('Kullanıcı başarıyla silindi');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Kullanıcı silinirken bir hata oluştu');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await dispatch(updateUserRole({ id: userId, role: newRole })).unwrap();
      toast.success('Kullanıcı rolü başarıyla güncellendi');
    } catch (error) {
      console.error('Role update error:', error);
      toast.error('Rol güncellenirken bir hata oluştu');
    }
  };

  const handleRefresh = () => {
    // Dismiss any existing toasts first
    toast.dismiss();
    // Show loading toast with auto-dismiss fallback
    const loadingToast = toast.loading('Yenileniyor...');
    
    // Auto-dismiss loading toast after 10 seconds as fallback
    setTimeout(() => {
      toast.dismiss(loadingToast);
    }, 10000);
    
    dispatch(getAllUsers(filters));
  };



  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive" className="text-xs">Admin</Badge>;
      case 'moderator':
        return <Badge variant="secondary" className="text-xs">Moderatör</Badge>;
      case 'user':
        return <Badge variant="outline" className="text-xs">Kullanıcı</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="text-xs">Aktif</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="text-xs">Pasif</Badge>;
      case 'banned':
        return <Badge variant="destructive" className="text-xs">Yasaklı</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getThemeBadge = (theme: string) => {
    switch (theme) {
      case 'light':
        return <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">Açık Tema</Badge>;
      case 'dark':
        return <Badge variant="outline" className="text-xs bg-gray-800 text-gray-100 border-gray-600">Koyu Tema</Badge>;
      default:
        return <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">Açık Tema</Badge>;
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Az önce";
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} gün önce`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} hafta önce`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} ay önce`;
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} yıl önce`;
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Filter users based on search term, role, and status
  const filteredUsers = useMemo(() => {
    let users = allUsers || [];

    if (debouncedSearchTerm) {
      const lowercaseQuery = debouncedSearchTerm.toLowerCase();
      users = users.filter(user => {
        const name = user?.name || '';
        const surname = user?.surname || '';
        const email = user?.email || '';
        const fullName = `${name} ${surname}`.toLowerCase();
        
        return name.toLowerCase().includes(lowercaseQuery) ||
               surname.toLowerCase().includes(lowercaseQuery) ||
               fullName.includes(lowercaseQuery) ||
               email.toLowerCase().includes(lowercaseQuery);
      });
    }

    if (roleFilter !== "all") {
      users = users.filter(user => user?.role === roleFilter);
    }

    if (statusFilter !== "all") {
      users = users.filter(user => user?.status === statusFilter);
    }

    return users;
  }, [debouncedSearchTerm, roleFilter, statusFilter, allUsers]);

  // Pagination logic - now based on filtered results
  const totalFilteredUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalFilteredUsers / parseInt(filters.limit));
  const startIndex = (currentPage - 1) * parseInt(filters.limit);
  const endIndex = startIndex + parseInt(filters.limit);
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // User statistics from Redux state
  const activeUsers = userStats?.active || 0;
  const inactiveUsers = userStats?.inactive || 0;
  const bannedUsers = userStats?.banned || 0;
  const totalUsers = userStats?.total || 0;

  return (
    <>
      {/* Header with Sidebar Toggle */}
      <div className="flex items-center gap-4 mb-2">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Kullanıcılar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold ">Kullanıcılar</h1>
        <p className="text-muted-foreground">
          Sistemdeki tüm kullanıcıları yönetin, görüntüleyin ve düzenleyin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Tüm kullanıcılar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif</CardTitle>
            <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeUsers}
            </div>
            <p className="text-xs text-muted-foreground">Aktif kullanıcılar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pasif</CardTitle>
            <Badge className="bg-yellow-500 hover:bg-yellow-600">Pasif</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {inactiveUsers}
            </div>
            <p className="text-xs text-muted-foreground">Pasif kullanıcılar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yasaklı</CardTitle>
            <Badge className="bg-red-500 hover:bg-red-600">Yasaklı</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {bannedUsers}
            </div>
            <p className="text-xs text-muted-foreground">Yasaklı kullanıcılar</p>
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
            disabled={usersLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${usersLoading ? 'animate-spin' : ''}`} />
            Yenile
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-3">Kullanıcıları isim, e-posta, rol veya duruma göre filtreleyin</p>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="İsim, e-posta ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-2 border-border/60 focus:border-ring bg-background/50 backdrop-blur hover:border-border/80 transition-colors"
                disabled={usersLoading}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter || "all"} onValueChange={setRoleFilter} disabled={usersLoading}>
              <SelectTrigger className="w-[140px] h-10 border-2 border-border/60 bg-background/50 backdrop-blur hover:border-border/80 focus:border-ring focus:ring-2 focus:ring-ring/20">
                <SelectValue placeholder="Tüm Roller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Roller</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderatör</SelectItem>
                <SelectItem value="user">Kullanıcı</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter || "all"} onValueChange={setStatusFilter} disabled={usersLoading}>
              <SelectTrigger className="w-[140px] h-10 border-2 border-border/60 bg-background/50 backdrop-blur hover:border-border/80 focus:border-ring focus:ring-2 focus:ring-ring/20">
                <SelectValue placeholder="Tüm Durumlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Pasif</SelectItem>
                <SelectItem value="banned">Yasaklı</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>



      {/* Loading State */}
      {usersLoading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Kullanıcılar yükleniyor...</p>
        </div>
      )}

      {/* Error State */}
      {usersError && !usersLoading && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Hata: {usersError}</p>
          <Button onClick={handleRefresh}>
            Tekrar Dene
          </Button>
        </div>
      )}

      {/* Users List */}
      {!usersLoading && !usersError && (
        <div className="mb-2">

          {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {allUsers.length === 0 ? "Gösterilecek kullanıcı bulunamadı" : "Arama kriterlerinize uygun kullanıcı bulunamadı"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {currentUsers.map((user) => (
              <Card key={user._id} className="border-2 border-border/60 hover:border-border/80 transition-all duration-200">
                <CardContent className="p-4">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                      {user.profile?.picture ? (
                        <img 
                          src={user.profile.picture} 
                          alt={`${user.name} ${user.surname}`}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold text-base mb-1">{user.name} {user.surname}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{user.email}</p>
                    <div className="flex justify-center gap-2 mb-3">
                      {getRoleBadge(user.role || 'user')}
                      {getStatusBadge(user.status || 'active')}
                    </div>
                    <div className="flex justify-center gap-2 mb-3">
                      {getThemeBadge(user.theme || 'light')}
                    </div>
                    
                    {/* Role Management - Only for Admins */}
                    {currentUser?.role === 'admin' && (
                      <div className="mb-3">
                        <Select 
                          value={user.role || 'user'} 
                          onValueChange={(newRole) => handleRoleChange(user._id, newRole)}
                          disabled={usersLoading}
                        >
                          <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Kullanıcı</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      Kayıt: {formatDate(user.createdAt)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Detay
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Sil
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(user._id)}
                            className="bg-destructive text-white hover:bg-destructive/90"
                          >
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Kullanıcı Detayı</h2>
                <Button
                  variant="outline"
                  onClick={() => setSelectedUser(null)}
                >
                  Kapat
                </Button>
              </div>

              <div className="space-y-4">
                {/* User Profile Picture */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                    {selectedUser.profile?.picture ? (
                      <img 
                        src={selectedUser.profile.picture} 
                        alt={`${selectedUser.name} ${selectedUser.surname}`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Ad Soyad</label>
                    <p className="font-medium">{selectedUser.name} {selectedUser.surname}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">E-posta</label>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Rol</label>
                    <div className="mt-1">{getRoleBadge(selectedUser.role || 'user')}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Durum</label>
                    <div className="mt-1">{getStatusBadge(selectedUser.status || 'active')}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tema Tercihi</label>
                    <div className="mt-1">{getThemeBadge(selectedUser.theme || 'light')}</div>
                  </div>
                  
                  {/* Role Management in Modal - Only for Admins */}
                  {currentUser?.role === 'admin' && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Rol Yönetimi</label>
                      <div className="mt-1">
                        <Select 
                          value={selectedUser.role || 'user'} 
                          onValueChange={(newRole) => handleRoleChange(selectedUser._id, newRole)}
                          disabled={usersLoading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Kullanıcı</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Kayıt Tarihi</label>
                  <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                </div>

                {selectedUser.lastLogin && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Son Giriş</label>
                    <p className="font-medium">{selectedUser.lastLogin.toLocaleString('tr-TR')}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Kullanıcıyı Sil
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                                              <AlertDialogAction
                          onClick={() => {
                            handleDelete(selectedUser._id);
                            setSelectedUser(null);
                          }}
                          className="bg-destructive text-white hover:bg-destructive/90"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            {startIndex + 1}-{Math.min(endIndex, totalFilteredUsers)} / {totalFilteredUsers} kullanıcı
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


    </>
  );
}
