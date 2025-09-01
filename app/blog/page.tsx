"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User,
  ArrowLeft,
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { 
  blogPosts, 
  getCategories, 
  searchPosts, 
  getPostsByCategory,
  BlogPost 
} from "@/lib/blogData";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState(6);
  const postsPerLoad = 6;

  const categories = getCategories();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setVisiblePosts(6);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category === "all" ? "" : category);
    setVisiblePosts(6);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("");
    setVisiblePosts(6);
  }, []);

  const loadMore = useCallback(() => {
    setVisiblePosts(prev => prev + postsPerLoad);
  }, []);

  // Filter posts based on search and category
  const filteredPosts = useCallback(() => {
    let posts = blogPosts;

    if (searchQuery) {
      posts = searchPosts(searchQuery);
    }

    if (selectedCategory) {
      posts = posts.filter(post => post.category === selectedCategory);
    }

    return posts;
  }, [searchQuery, selectedCategory]);

  const posts = filteredPosts();
  const displayedPosts = posts.slice(0, visiblePosts);
  const hasMorePosts = visiblePosts < posts.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Müzik dünyasından en güncel haberler, ipuçları ve rehberler. 
            Müzisyenler için hazırlanmış kapsamlı içerikler.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl p-8 mb-12 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Blog yazılarında ara..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 h-12 text-lg border-border focus:border-ring rounded-xl bg-background/50 backdrop-blur"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-72">
              <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-12 text-lg border-border focus:border-ring rounded-xl bg-background/50 backdrop-blur">
                  <SelectValue placeholder="Tüm kategoriler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm kategoriler</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6 border-border hover:bg-accent rounded-xl"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filtreler
            </Button>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory) && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="h-12 px-6 text-muted-foreground hover:text-foreground rounded-xl"
              >
                Filtreleri Temizle
              </Button>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-lg text-muted-foreground">
            <span className="font-semibold text-foreground">{posts.length}</span> yazı bulundu
            {searchQuery && (
              <span className="text-muted-foreground/70"> "{searchQuery}" için</span>
            )}
            {selectedCategory && (
              <span className="text-muted-foreground/70"> "{selectedCategory}" kategorisinde</span>
            )}
            {hasMorePosts && (
              <span className="text-muted-foreground/70"> ({displayedPosts.length} gösteriliyor)</span>
            )}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {displayedPosts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayedPosts.map((post) => (
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
                            <Badge 
                              variant="outline" 
                              className="text-sm border-border font-medium hover:bg-accent transition-colors cursor-pointer"
                            >
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

            {/* Load More Button */}
            {hasMorePosts && (
              <div className="text-center mb-12">
                <Button
                  onClick={loadMore}
                  className="bg-primary hover:bg-primary/90 px-8 py-4 text-lg rounded-xl"
                >
                  <ChevronDown className="h-5 w-5 mr-2" />
                  {posts.length - displayedPosts.length} Yazı Daha Göster
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Sonuç bulunamadı</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Arama kriterlerinize uygun blog yazısı bulunamadı. 
              Farklı anahtar kelimeler deneyebilir veya filtreleri temizleyebilirsiniz.
            </p>
            <Button onClick={clearFilters} className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg rounded-xl">
              Filtreleri Temizle
            </Button>
          </div>
        )}

        {/* Show All Posts Button when filtered */}
        {(searchQuery || selectedCategory) && posts.length > 0 && (
          <div className="text-center mb-12">
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-border hover:bg-accent px-8 py-4 text-lg rounded-xl"
            >
              Tüm Yazıları Göster
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
