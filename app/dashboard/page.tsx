import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Store, Plus, BarChart3, Users, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
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
            <CardTitle className="text-sm font-medium">Blog Yazıları</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Toplam yazı</p>
            <div className="mt-2">
              <Link href="/dashboard/blog/form">
                <Button size="sm" className="w-full">
                  <Plus className="h-3 w-3 mr-1" />
                  Yeni Yazı
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
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Toplam ilan</p>
            <div className="mt-2">
              <Link href="/dashboard/listings/form">
                <Button size="sm" className="w-full">
                  <Plus className="h-3 w-3 mr-1" />
                  Yeni İlan
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
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Kayıtlı üye</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">İletişim Formları</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
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
        {/* Recent Blog Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Son Blog Yazıları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div>
                  <p className="font-medium text-sm">Müzik Prodüksiyon İpuçları</p>
                  <p className="text-xs text-muted-foreground">2 saat önce</p>
                </div>
                <Link href="/dashboard/blog">
                  <Button variant="outline" size="sm">Görüntüle</Button>
                </Link>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div>
                  <p className="font-medium text-sm">Enstrüman Seçimi Rehberi</p>
                  <p className="text-xs text-muted-foreground">1 gün önce</p>
                </div>
                <Link href="/dashboard/blog">
                  <Button variant="outline" size="sm">Görüntüle</Button>
                </Link>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/dashboard/blog">
                <Button variant="outline" className="w-full">Tüm Blog Yazıları</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

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
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div>
                  <p className="font-medium text-sm">Gitarist Aranıyor</p>
                  <p className="text-xs text-muted-foreground">İstanbul • 1 saat önce</p>
                </div>
                <Link href="/dashboard/listings">
                  <Button variant="outline" size="sm">Görüntüle</Button>
                </Link>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div>
                  <p className="font-medium text-sm">Piyano Dersi</p>
                  <p className="text-xs text-muted-foreground">Ankara • 3 saat önce</p>
                </div>
                <Link href="/dashboard/listings">
                  <Button variant="outline" size="sm">Görüntüle</Button>
                </Link>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/dashboard/listings">
                <Button variant="outline" className="w-full">Tüm İlanlar</Button>
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
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div>
                  <p className="font-medium text-sm">Müzik Dersi Hakkında</p>
                  <p className="text-xs text-muted-foreground">Ahmet Yılmaz • 2 saat önce</p>
                </div>
                <Link href="/dashboard/forms">
                  <Button variant="outline" size="sm">Görüntüle</Button>
                </Link>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div>
                  <p className="font-medium text-sm">Konser Organizasyonu</p>
                  <p className="text-xs text-muted-foreground">Ayşe Demir • 1 gün önce</p>
                </div>
                <Link href="/dashboard/forms">
                  <Button variant="outline" size="sm">Görüntüle</Button>
                </Link>
              </div>
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
