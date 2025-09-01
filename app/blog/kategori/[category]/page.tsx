"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User,
  ArrowRight
} from "lucide-react";
import { getPostsByCategory, getCategories, BlogPost, blogPosts } from "@/lib/blogData";
import { notFound } from "next/navigation";

export default function BlogCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.category as string;

  // Create a mapping from categorySlug to category name
  const categorySlugToName: { [key: string]: string } = {
    "produksiyon": "Prodüksiyon",
    "grup-muzigi": "Grup Müziği",
    "enstruman": "Enstrüman",
    "muzik-teorisi": "Müzik Teorisi",
    "performans": "Performans",
    "dijital-muzik": "Dijital Müzik",
    "egitim": "Eğitim",
    "saglik": "Sağlık",
    "jazz": "Jazz",
    "hukuk": "Hukuk",
    "kultur": "Kültür"
  };

  const category = categorySlugToName[categorySlug];
  const categories = getCategories();
  const posts = category ? getPostsByCategory(category) : [];

  if (!category || !categories.includes(category)) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryDescription = (cat: string) => {
    const descriptions: { [key: string]: string } = {
      "Prodüksiyon": "Müzik prodüksiyonu, kayıt teknikleri ve stüdyo teknolojileri hakkında detaylı rehberler.",
      "Grup Müziği": "Grup kurma, yönetim ve grup içi iletişim konularında pratik ipuçları.",
      "Enstrüman": "Enstrüman seçimi, bakımı ve öğrenme süreçleri hakkında kapsamlı bilgiler.",
      "Müzik Teorisi": "Müzik teorisinin temelleri ve pratik uygulamaları.",
      "Performans": "Sahne performansı, sahne korkusu ve performans teknikleri.",
      "Dijital Müzik": "Dijital platformlar, teknoloji ve modern müzik endüstrisi.",
      "Eğitim": "Müzik eğitimi ve öğrenme süreçleri hakkında rehberler.",
      "Sağlık": "Müzik terapisinin sağlığa katkıları ve uygulamaları.",
      "Jazz": "Jazz müziği ve improvisasyon teknikleri.",
      "Hukuk": "Müzik endüstrisinde telif hakları ve yasal konular.",
      "Kültür": "Dünya müzikleri ve kültürel müzik türleri."
    };
    return descriptions[cat] || `${cat} kategorisindeki en güncel yazılar ve rehberler.`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground text-lg px-6 py-3"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Geri Dön
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Category Header */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <Badge variant="outline" className="text-lg border-border font-medium px-6 py-3">
                {category}
              </Badge>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              {category} Kategorisi
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {getCategoryDescription(category)}
            </p>
            <p className="text-lg text-muted-foreground mt-4">
              <span className="font-semibold text-foreground">{posts.length}</span> yazı bulundu
            </p>
          </div>

          {/* Blog Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <Link 
                            href={`/blog/kategori/${post.categorySlug}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Badge variant="outline" className="text-sm border-border font-medium hover:bg-accent transition-colors cursor-pointer">
                              {post.category}
                            </Badge>
                          </Link>
                          {post.featured && (
                            <Badge className="text-sm bg-primary text-primary-foreground font-medium">
                              Öne Çıkan
                            </Badge>
                          )}
                        </div>
                        
                        <h2 className="text-2xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                          {post.title}
                        </h2>
                        
                        <p className="text-muted-foreground text-base mb-6 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border/50">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">{post.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(post.publishedDate)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Henüz yazı yok</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Bu kategoride henüz yazı bulunmuyor. Diğer kategorileri inceleyebilir veya ana blog sayfasına dönebilirsiniz.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/blog">
                  <Button className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg rounded-xl">
                    Tüm Yazılar
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Other Categories */}
          <section className="border-t border-border/50 pt-16">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Diğer Kategoriler</h2>
              <p className="text-lg text-muted-foreground">Farklı konularda yazılarımızı keşfedin.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.filter(cat => cat !== category).map((cat) => {
                const categoryPosts = getPostsByCategory(cat);
                const catSlug = blogPosts.find(post => post.category === cat)?.categorySlug || cat.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link key={cat} href={`/blog/kategori/${catSlug}`}>
                    <div className="bg-card/50 backdrop-blur border border-border/50 p-6 hover:shadow-lg transition-all duration-300 group rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className="text-sm border-border font-medium">
                          {cat}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {cat}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {getCategoryDescription(cat)}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {categoryPosts.length} yazı
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
