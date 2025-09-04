"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAllBlogs } from "@/redux/actions/blogActions";
import { getAllBlogCategories } from "@/redux/actions/blogCategoryActions";
import { BlogPost } from "@/redux/actions/blogActions";
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
import { notFound } from "next/navigation";

export default function BlogCategoryPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { blogs, loading, error } = useSelector((state: RootState) => state.blog)
  const { categories: blogCategories } = useSelector((state: RootState) => state.blogCategory)
  
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.category as string;
  const [category, setCategory] = useState<any>(null);

  // Function to create title slug for URL
  const createTitleSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Function to create category slug for URL
  const createCategorySlug = (categoryName: string) => {
    return categoryName.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-');
  };

  useEffect(() => {
    // Load blogs and categories
    if (blogs.length === 0) {
      dispatch(getAllBlogs({}));
    }
    if (blogCategories.length === 0) {
      dispatch(getAllBlogCategories({}));
    }
  }, [dispatch, blogs.length, blogCategories.length]);

  useEffect(() => {
    // Find category by slug from blogs array
    if (blogs.length > 0) {
      // Get unique categories from blogs
      const uniqueCategories = [...new Set(blogs.map(blog => blog.category))];
      
      const foundCategory = uniqueCategories.find(catName => {
        const catSlug = createCategorySlug(catName);
        return catSlug === categorySlug;
      });
      
      if (foundCategory) {
        setCategory({ name: foundCategory });
      }
    }
  }, [categorySlug, blogs]);

  const posts = category ? blogs.filter(post => post.category === category.name) : [];

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground text-lg">Kategori yükleniyor...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Kategori bulunamadı.</p>
          </div>
        </div>
      </main>
    );
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
    return `${cat} kategorisindeki en güncel yazılar ve rehberler.`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">

        <div className="max-w-6xl mx-auto">
          {/* Category Header */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <Badge variant="outline" className="text-lg border-border font-medium px-4 py-1 rounded-full">
                {category.name}
              </Badge>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              {category.name} Kategorisi
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {category.description || getCategoryDescription(category.name)}
            </p>
            <p className="text-lg text-muted-foreground mt-4">
              <span className="font-semibold text-foreground">{posts.length}</span> yazı bulundu
            </p>
          </div>

          {/* Blog Posts Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-muted-foreground">Yükleniyor...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-destructive">Hata: {error}</div>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <article key={post._id} className="group">
                  <Link href={`/${createTitleSlug(post.title)}`}>
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
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/blog/kategori/${createCategorySlug(post.category)}`);
                            }}
                            className="focus:outline-none"
                          >
                            <Badge variant="outline" className="text-sm border-border font-medium hover:bg-accent transition-colors cursor-pointer">
                              {post.category}
                            </Badge>
                          </button>
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
              {blogs
                .map(blog => blog.category)
                .filter((catName, index, arr) => arr.indexOf(catName) === index) // Get unique categories
                .filter(catName => catName !== category.name)
                .map((catName) => {
                const categoryPosts = blogs.filter(post => post.category === catName);
                const catSlug = createCategorySlug(catName);
                return (
                  <Link key={catName} href={`/blog/kategori/${catSlug}`}>
                    <div className="bg-card/50 backdrop-blur border border-border/50 p-6 hover:shadow-lg transition-all duration-300 group rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className="text-sm border-border font-medium">
                          {catName}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {catName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {getCategoryDescription(catName)}
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
