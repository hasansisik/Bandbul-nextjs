import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Müzik Gruplarında İletişim Nasıl Olmalı?",
      excerpt: "Başarılı bir müzik grubu için üyeler arasındaki iletişimin önemi ve etkili iletişim yöntemleri...",
      category: "Grup Yönetimi",
      date: "15 Ocak 2025",
      readTime: "5 dk",
      image: "/api/placeholder/400/250"
    },
    {
      id: 2,
      title: "Enstrüman Seçerken Dikkat Edilmesi Gerekenler",
      excerpt: "Yeni başlayanlar için enstrüman seçimi rehberi ve hangi enstrümanın size uygun olduğunu nasıl anlayacağınız...",
      category: "Eğitim",
      date: "12 Ocak 2025",
      readTime: "7 dk",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "Sahne Performansı İçin İpuçları",
      excerpt: "Sahne korkusunu yenmek ve daha iyi performans sergilemek için profesyonel müzisyenlerden öneriler...",
      category: "Performans",
      date: "10 Ocak 2025",
      readTime: "6 dk",
      image: "/api/placeholder/400/250"
    }
  ];

  return (
    <section className="py-16 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">İlginizi Çekebilecek Bilgiler</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Blog bölümünde ilginizi çekebilecek yazılar bulabilirsiniz.
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="aspect-video bg-muted rounded-t-lg mb-4"></div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                    <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Tüm Yazıları Gör
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
