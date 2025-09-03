"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { 
  Users, 
  Trash2, 
  Eye, 
  User
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

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'inactive' | 'banned';
  joinedAt: Date;
  lastLogin?: Date;
  avatar?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  // Mock data - in real app this would come from an API
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "Ahmet Yılmaz",
        email: "ahmet@example.com",
        role: "admin",
        status: "active",
        joinedAt: new Date("2024-01-15"),
        lastLogin: new Date("2024-12-20T10:30:00"),
        avatar: "/avatars/ahmet.jpg"
      },
      {
        id: "2",
        name: "Ayşe Demir",
        email: "ayse@example.com",
        role: "moderator",
        status: "active",
        joinedAt: new Date("2024-02-20"),
        lastLogin: new Date("2024-12-19T15:45:00"),
        avatar: "/avatars/ayse.jpg"
      },
      {
        id: "3",
        name: "Mehmet Kaya",
        email: "mehmet@example.com",
        role: "user",
        status: "active",
        joinedAt: new Date("2024-03-10"),
        lastLogin: new Date("2024-12-18T09:15:00"),
        avatar: "/avatars/mehmet.jpg"
      },
      {
        id: "4",
        name: "Fatma Özkan",
        email: "fatma@example.com",
        role: "user",
        status: "inactive",
        joinedAt: new Date("2024-04-05"),
        lastLogin: new Date("2024-11-25T14:20:00"),
        avatar: "/avatars/fatma.jpg"
      },
      {
        id: "5",
        name: "Ali Çelik",
        email: "ali@example.com",
        role: "user",
        status: "banned",
        joinedAt: new Date("2024-05-12"),
        lastLogin: new Date("2024-10-15T11:30:00"),
        avatar: "/avatars/ali.jpg"
      },
      {
        id: "6",
        name: "Zeynep Arslan",
        email: "zeynep@example.com",
        role: "moderator",
        status: "active",
        joinedAt: new Date("2024-06-08"),
        lastLogin: new Date("2024-12-20T08:45:00"),
        avatar: "/avatars/zeynep.jpg"
      },
      {
        id: "7",
        name: "Mustafa Yıldız",
        email: "mustafa@example.com",
        role: "user",
        status: "active",
        joinedAt: new Date("2024-07-22"),
        lastLogin: new Date("2024-12-19T16:20:00"),
        avatar: "/avatars/mustafa.jpg"
      },
      {
        id: "8",
        name: "Elif Korkmaz",
        email: "elif@example.com",
        role: "user",
        status: "inactive",
        joinedAt: new Date("2024-08-14"),
        lastLogin: new Date("2024-11-30T13:10:00"),
        avatar: "/avatars/elif.jpg"
      }
    ];
    setUsers(mockUsers);
  }, []);



  const handleDelete = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
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

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

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

  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const activeUsers = users.filter(user => user.status === 'active').length;
  const inactiveUsers = users.filter(user => user.status === 'inactive').length;
  const bannedUsers = users.filter(user => user.status === 'banned').length;
  const totalUsers = users.length;

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



      {/* Users List */}
      <div className="mb-2">

        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Gösterilecek kullanıcı bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {currentUsers.map((user) => (
              <Card key={user.id} className="border-2 border-border/60 hover:border-border/80 transition-all duration-200">
                <CardContent className="p-4">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-base mb-1">{user.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{user.email}</p>
                    <div className="flex justify-center gap-2 mb-3">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Kayıt: {formatDate(user.joinedAt)}
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
                            onClick={() => handleDelete(user.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Ad Soyad</label>
                    <p className="font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">E-posta</label>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Rol</label>
                    <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Durum</label>
                    <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Kayıt Tarihi</label>
                  <p className="font-medium">{selectedUser.joinedAt.toLocaleDateString('tr-TR')}</p>
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
                          handleDelete(selectedUser.id);
                          setSelectedUser(null);
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            {startIndex + 1}-{Math.min(endIndex, users.length)} / {users.length} kullanıcı
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
