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
  Share2,
  Tag,
  ChevronRight
} from "lucide-react";
import { getPostBySlug, getRecentPosts, BlogPost } from "@/lib/blogData";
import { notFound } from "next/navigation";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const post = getPostBySlug(slug);
  const recentPosts = getRecentPosts(3).filter(p => p.slug !== slug);

  if (!post) {
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopyalandı!');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-5">
        {/* Modern Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-5">
          <span 
            onClick={() => router.push('/blog')} 
            className="hover:text-foreground cursor-pointer transition-colors duration-200 hover:underline"
          >
            Blog
          </span>
          <ChevronRight className="h-4 w-4" />
          <span 
            onClick={() => router.push(`/blog/kategori/${post.categorySlug}`)} 
            className="hover:text-foreground cursor-pointer transition-colors duration-200 hover:underline"
          >
            {post.category}
          </span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-semibold truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="max-w-12xl mx-auto">
                      {/* Article Header */}
            <article className="mb-16">

            {/* Title */}
            <h1 className="text-5xl font-bold text-foreground mb-8 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-8 text-base text-muted-foreground mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <span>{formatDate(post.publishedDate)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{post.readTime}</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-[5/2] rounded-3xl overflow-hidden mb-12">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Excerpt */}
            <div className="bg-card/50 backdrop-blur rounded-3xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                Özet
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed italic">
                {post.excerpt}
              </p>
            </div>

            {/* Content */}
            <div className="bg-card/50 backdrop-blur rounded-3xl p-12">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                İçerik
              </h2>
              <div 
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-headings:font-bold prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6 prose-ul:text-muted-foreground prose-li:mb-2 dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-12 border-t border-border/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg font-semibold text-foreground">Etiketler:</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm border-primary/20 px-4 py-2 hover:bg-primary/10 transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Share Button */}
            <div className="mt-12 pt-12 border-t border-border/30">
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-primary/20 hover:bg-primary/10 px-8 py-3 text-lg rounded-2xl transition-all duration-200 hover:scale-105"
              >
                <Share2 className="h-5 w-5 mr-3" />
                Paylaş
              </Button>
            </div>
          </article>

          {/* Related Posts */}
          {recentPosts.length > 0 && (
            <section className="border-t border-border/30 pt-16">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  Benzer Yazılar
                </h2>
                <p className="text-lg text-muted-foreground">Bu yazıyı beğendiyseniz, aşağıdaki yazılar da ilginizi çekebilir.</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {recentPosts.map((relatedPost) => (
                  <article key={relatedPost.id} className="bg-card/50 backdrop-blur rounded-3xl overflow-hidden border border-border/30">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <Link href={`/${relatedPost.slug}`}>
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      {/* Read Time - Top Right */}
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-1 text-xs text-foreground bg-background/95 px-3 py-2 rounded-2xl backdrop-blur-sm">
                          <Clock className="h-3 w-3" />
                          {relatedPost.readTime}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Link href={`/blog/kategori/${relatedPost.categorySlug}`}>
                          <Badge variant="outline" className="text-xs border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer">
                            {relatedPost.category}
                          </Badge>
                        </Link>
                      </div>
                      
                      <Link href={`/${relatedPost.slug}`} className="block">
                        <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 hover:text-primary transition-colors leading-tight">
                          {relatedPost.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                          {relatedPost.excerpt}
                        </p>
                      </Link>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/30">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-primary/10 rounded-full">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                          <span className="font-medium">{relatedPost.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-primary/10 rounded-full">
                            <Calendar className="h-3 w-3 text-primary" />
                          </div>
                          <span className="font-medium">{formatDate(relatedPost.publishedDate)}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
