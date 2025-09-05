"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAllBlogs } from "@/redux/actions/blogActions";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BlogSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading } = useSelector((state: RootState) => state.blog);
  const router = useRouter();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  // Get recent published blogs (max 6)
  const blogPosts = blogs
    .filter(blog => blog.status === 'published')
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, 6);

  // Fetch blogs on component mount
  useEffect(() => {
    dispatch(getAllBlogs({}));
  }, [dispatch]);

  // Auto-scroll effect
  useEffect(() => {
    if (!isDragging && blogPosts.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.max(1, blogPosts.length - 3));
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [blogPosts.length, isDragging]);

  // Mouse/Touch event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if clicking on empty space, not on links
    if ((e.target as HTMLElement).closest('a')) return;
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(currentIndex * 25);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    const newIndex = Math.round((scrollLeft - walk) / 25);
    setCurrentIndex(Math.max(0, Math.min(newIndex, blogPosts.length - 4)));
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only start dragging if touching empty space, not on links
    if ((e.target as HTMLElement).closest('a')) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(currentIndex * 25);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    const newIndex = Math.round((scrollLeft - walk) / 25);
    setCurrentIndex(Math.max(0, Math.min(newIndex, blogPosts.length - 4)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-16 bg-muted/10">
      <div className="container mx-auto">
        <div className="max-w-8xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">İlginizi Çekebilecek Bilgiler</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Blog bölümünde ilginizi çekebilecek yazılar bulabilirsiniz.
            </p>
          </div>

          {/* Blog Posts Carousel */}
          <div className="relative">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-muted-foreground">Yükleniyor...</div>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-muted-foreground">Henüz blog yazısı bulunmuyor.</div>
              </div>
            ) : (
              <div 
                ref={carouselRef}
                className="overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
              <div 
                className="flex transition-transform duration-700 ease-in-out select-none"
                style={{ 
                  transform: `translateX(-${currentIndex * 25}%)`,
                  pointerEvents: isDragging ? 'none' : 'auto'
                }}
              >
                {blogPosts.map((post) => (
                  <div key={post._id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-3">
                    <div className="h-full bg-card border border-border rounded-lg overflow-hidden">
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <Link href={`/${createTitleSlug(post.title)}`}>
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        {/* Read Time - Top Right */}
                        <div className="absolute top-3 right-3">
                          <div className="flex items-center gap-1 text-xs text-foreground bg-background/90 px-2 py-1 rounded">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/blog/kategori/${createCategorySlug(post.category)}`);
                            }}
                            className="focus:outline-none"
                          >
                            <Badge 
                              variant="outline" 
                              className="text-xs border-border cursor-pointer hover:bg-muted"
                            >
                              {post.category}
                            </Badge>
                          </button>
                        </div>
                        
                        <Link href={`/${createTitleSlug(post.title)}`}>
                          <h3 className="font-semibold text-lg leading-tight mb-3 line-clamp-2 text-foreground">
                            {post.title}
                          </h3>
                        </Link>
                        
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(post.publishedDate).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button variant="outline" size="default" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-300 border-border">
                Tüm Yazıları Gör
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
