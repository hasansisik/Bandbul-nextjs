"use client"

import { useEffect } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Store, Plus, Users, Tag, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getAllListings, getAllCategories, getAllUsers } from "@/redux/actions/userActions"
import { getAllContacts, getContactStats } from "@/redux/actions/contactActions"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { 
    allListings, 
    categories, 
    allUsers, 
    userStats,
    listingsLoading,
    categoriesLoading,
    usersLoading 
  } = useAppSelector((state) => state.user)

  const { 
    contacts, 
    stats: contactStats,
    loading: contactsLoading 
  } = useAppSelector((state) => state.contact)

  useEffect(() => {
    // Load dashboard data when component mounts
    dispatch(getAllListings({ limit: '1000', status: 'all' }))
    dispatch(getAllCategories({}))
    dispatch(getAllUsers({}))
    dispatch(getAllContacts({}))
    dispatch(getContactStats())
  }, [dispatch])
  return (
    <>
      {/* Header with Sidebar Toggle */}
      <div className="flex items-center gap-4 mb-2">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Ana Sayfa</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Welcome Section */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold ">Hoş Geldiniz! 👋</h1>
        <p className="text-muted-foreground">Bandbul müzik platformunuzu yönetin</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategoriler</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categoriesLoading ? "..." : categories?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Toplam kategori</p>
            <div className="mt-2">
              <Link href="/dashboard/categories">
                <Button size="sm" className="w-full">
                  <Plus className="h-3 w-3 mr-1" />
                  Kategorileri Yönet
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Müzik İlanları</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {listingsLoading ? "..." : allListings?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Toplam ilan</p>
            <div className="mt-2">
              <Link href="/dashboard/listings">
                <Button size="sm" className="w-full">
                  <Plus className="h-3 w-3 mr-1" />
                  İlanları Yönet
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kullanıcılar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usersLoading ? "..." : userStats?.total || allUsers?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Kayıtlı üye</p>
            <div className="mt-2">
              <Link href="/dashboard/users">
                <Button size="sm" className="w-full">
                  <Users className="h-3 w-3 mr-1" />
                  Kullanıcıları Yönet
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">İletişim Formları</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contactsLoading ? "..." : contactStats?.total || contacts?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Toplam form</p>
            <div className="mt-2">
              <Link href="/dashboard/forms">
                <Button size="sm" className="w-full">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Formları Görüntüle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Recent Listings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Son İlanlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {listingsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                </div>
              ) : allListings && allListings.length > 0 ? (
                allListings.slice(0, 3).map((listing: any) => (
                  <div key={listing._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{listing.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {listing.location} • {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <Link href="/dashboard/listings">
                      <Button variant="outline" size="sm">Görüntüle</Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>Henüz ilan bulunmuyor</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/listings">
                <Button variant="outline" className="w-full">Tüm İlanlar</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Son Kullanıcılar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {usersLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                </div>
              ) : allUsers && allUsers.length > 0 ? (
                allUsers.slice(0, 3).map((user: any) => (
                  <div key={user._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{user.name} {user.surname}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email} • {user.role}
                      </p>
                    </div>
                    <Link href="/dashboard/users">
                      <Button variant="outline" size="sm">Görüntüle</Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>Henüz kullanıcı bulunmuyor</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/users">
                <Button variant="outline" className="w-full">Tüm Kullanıcılar</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Contact Forms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Son İletişim Formları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contactsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                </div>
              ) : contacts && contacts.length > 0 ? (
                contacts.slice(0, 3).map((contact: any) => (
                  <div key={contact._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{contact.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {contact.name} • {new Date(contact.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <Link href="/dashboard/forms">
                      <Button variant="outline" size="sm">Görüntüle</Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>Henüz form bulunmuyor</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/forms">
                <Button variant="outline" className="w-full">Tüm Formlar</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
