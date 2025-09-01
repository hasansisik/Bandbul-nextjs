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
  Tag
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

        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <article className="mb-16">
            {/* Category and Featured Badge */}
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="outline" className="text-sm border-border font-medium px-4 py-2">
                {post.category}
              </Badge>
              {post.featured && (
                <Badge className="text-sm bg-primary text-primary-foreground font-medium px-4 py-2">
                  Öne Çıkan
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold text-foreground mb-8 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-8 text-base text-muted-foreground mb-8">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(post.publishedDate)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5" />
                <span className="font-medium">{post.readTime}</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-12 shadow-lg">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Excerpt */}
            <div className="bg-card/50 backdrop-blur rounded-2xl p-8 mb-12 border border-border/50 shadow-sm">
              <p className="text-xl text-muted-foreground leading-relaxed italic">
                {post.excerpt}
              </p>
            </div>

            {/* Content */}
            <div className="bg-card/50 backdrop-blur rounded-2xl p-12 border border-border/50 shadow-sm">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-headings:font-bold prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6 prose-ul:text-muted-foreground prose-li:mb-2 dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-12 border-t border-border/50">
                <div className="flex items-center gap-3 mb-6">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-semibold text-foreground">Etiketler:</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm border-border px-4 py-2">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Share Button */}
            <div className="mt-12 pt-12 border-t border-border/50">
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-border hover:bg-accent px-8 py-3 text-lg rounded-xl"
              >
                <Share2 className="h-5 w-5 mr-3" />
                Paylaş
              </Button>
            </div>
          </article>

          {/* Related Posts */}
          {recentPosts.length > 0 && (
            <section className="border-t border-border/50 pt-16">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Benzer Yazılar</h2>
                <p className="text-lg text-muted-foreground">Bu yazıyı beğendiyseniz, aşağıdaki yazılar da ilginizi çekebilir.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {recentPosts.map((relatedPost) => (
                  <article key={relatedPost.id} className="group">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <div className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-xs border-border">
                              {relatedPost.category}
                            </Badge>
                          </div>
                          
                          <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                            {relatedPost.title}
                          </h3>
                          
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                            {relatedPost.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span className="font-medium">{relatedPost.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="font-medium">{relatedPost.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
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
