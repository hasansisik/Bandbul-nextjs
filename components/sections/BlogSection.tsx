"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getRecentPosts } from "@/lib/blogData";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const BlogSection = () => {
  const blogPosts = getRecentPosts(6);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.max(1, blogPosts.length - 3));
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [blogPosts.length, isDragging]);

  // Mouse/Touch event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
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
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">İlginizi Çekebilecek Bilgiler</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Blog bölümünde ilginizi çekebilecek yazılar bulabilirsiniz.
            </p>
          </div>

          {/* Blog Posts Carousel */}
          <div className="relative">
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
                  <div key={post.id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-3">
                    <Link href={`/blog/${post.slug}`}>
                      <div className="group h-full bg-card/50 backdrop-blur transition-all duration-300 overflow-hidden border border-border/50 shadow-sm pb-2 rounded-lg">
                        {/* Image Container */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Category Badge Overlay */}
                          <div className="absolute top-3 left-3">
                            <Link href={`/blog/kategori/${post.categorySlug}`}>
                              <Badge variant="secondary" className="text-xs font-medium bg-background/90 text-foreground border-0 hover:bg-accent transition-colors cursor-pointer">
                                {post.category}
                              </Badge>
                            </Link>
                          </div>
                          {/* Read Time Overlay */}
                          <div className="absolute top-3 right-3">
                            <div className="flex items-center gap-1 text-xs text-foreground bg-background/20 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Clock className="h-3 w-3" />
                              {post.readTime}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          {/* Title */}
                          <h3 className="font-semibold text-lg leading-tight mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2 text-foreground">
                            {post.title}
                          </h3>
                          
                          {/* Excerpt */}
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          
                          {/* Footer */}
                          <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.publishedDate).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-1">
              {Array.from({ length: Math.max(1, blogPosts.length - 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary w-4' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button variant="outline" size="lg" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-300 border-border">
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
