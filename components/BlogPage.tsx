"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAllBlogs } from "@/redux/actions/blogActions";
import { getAllBlogCategories } from "@/redux/actions/blogCategoryActions";
import { BlogPost } from "@/redux/actions/blogActions";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function BlogPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { blogs, loading, error } = useSelector((state: RootState) => state.blog)
  const { categories: blogCategories } = useSelector((state: RootState) => state.blogCategory)
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState(6);
  const postsPerLoad = 6;

  // Function to create title slug for URL
  const createTitleSlug = (title: string) => {
    if (!title) return '';
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
    if (!categoryName) return '';
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
    dispatch(getAllBlogs({}))
    dispatch(getAllBlogCategories({}))
  }, [dispatch])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);


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
    setDebouncedSearchQuery("");
    setSelectedCategory("");
    setVisiblePosts(6);
  }, []);

  const loadMore = useCallback(() => {
    setVisiblePosts(prev => prev + postsPerLoad);
  }, []);

  // Filter posts based on search and category
  const posts = useMemo(() => {
    let filteredPosts = blogs || [];

    if (debouncedSearchQuery) {
      const lowercaseQuery = debouncedSearchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post => {
        // Safe string checks to prevent undefined errors
        const title = post?.title || '';
        const excerpt = post?.excerpt || '';
        const content = post?.content || '';
        const author = post?.author || '';
        const tags = post?.tags || [];

        return title.toLowerCase().includes(lowercaseQuery) ||
          excerpt.toLowerCase().includes(lowercaseQuery) ||
          content.toLowerCase().includes(lowercaseQuery) ||
          author.toLowerCase().includes(lowercaseQuery) ||
          tags.some((tag: string) => (tag || '').toLowerCase().includes(lowercaseQuery));
      });
    }

    if (selectedCategory) {
      filteredPosts = filteredPosts.filter(post => post?.category === selectedCategory);
    }

    return filteredPosts;
  }, [debouncedSearchQuery, selectedCategory, blogs]);
  const displayedPosts = posts.slice(0, visiblePosts);
  const hasMorePosts = visiblePosts < posts.length;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Blog
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Müzik dünyasından en güncel haberler, ipuçları ve rehberler.
            Müzisyenler için hazırlanmış kapsamlı içerikler.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-card/50 backdrop-blur rounded-xl p-6 border border-border/50 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Blog yazılarında ara..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 h-12 border border-border bg-background/50 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-base text-muted-foreground">
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
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-6 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-destructive">Hata: {error}</div>
          </div>
        ) : displayedPosts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {displayedPosts.map((post) => {
                // Safe access to post properties
                const postId = post?._id || '';
                const postTitle = post?.title || '';
                const postImage = post?.image || '';
                const postReadTime = post?.readTime || '';
                const postCategory = post?.category || '';
                const postFeatured = post?.featured || false;
                const postExcerpt = post?.excerpt || '';
                const postAuthor = post?.author || '';
                const postPublishedDate = post?.publishedDate || '';

                return (
                  <article key={postId} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <div className="aspect-[4/3] overflow-hidden relative bg-muted">
                      <Link href={`/blog/${createTitleSlug(postTitle)}`} className="block w-full h-full">
                        <img
                          src={postImage || '/placeholder-blog.jpg'}
                          alt={postTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      {/* Read Time - Top Right */}
                      {postReadTime && (
                        <div className="absolute top-3 right-3">
                          <Badge className="flex items-center gap-1 text-xs bg-background/90 backdrop-blur-sm px-2 py-1 border-0 shadow-sm text-black">
                            <Clock className="h-3 w-3" />
                            {postReadTime}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {postCategory && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/blog/kategori/${createCategorySlug(postCategory)}`);
                            }}
                            className="focus:outline-none"
                          >
                            <Badge
                              variant="outline"
                              className="text-xs border-border cursor-pointer hover:bg-muted"
                            >
                              {postCategory}
                            </Badge>
                          </button>
                        )}
                        {postFeatured && (
                          <Badge className="text-xs bg-primary text-primary-foreground">
                            Öne Çıkan
                          </Badge>
                        )}
                      </div>

                      <Link href={`/blog/${createTitleSlug(postTitle)}`}>
                        <h2 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 leading-tight hover:text-primary transition-colors">
                          {postTitle}
                        </h2>
                      </Link>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                        {postExcerpt}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3 border-t border-border">
                        {postAuthor && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{postAuthor}</span>
                          </div>
                        )}
                        {postPublishedDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(postPublishedDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMorePosts && (
              <div className="text-center mb-12">
                <Button
                  onClick={loadMore}
                  className="bg-primary hover:bg-primary/90 px-8 py-4 text-lg rounded-xl"
                >
                  <ChevronDown className="h-5 w-5 mr-2" />
                  Daha Fazla
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-bold text-foreground mb-4">Sonuç bulunamadı</p>
            <p className=" text-muted-foreground mb-8 max-w-md mx-auto">
              Arama kriterlerinize uygun blog yazısı bulunamadı.
              Farklı anahtar kelimeler deneyebilir veya filtreleri temizleyebilirsiniz.
            </p>
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
