"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getBlogBySlug, getAllBlogs } from "@/redux/actions/blogActions";
import { BlogPost } from "@/redux/actions/blogActions";
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
import { notFound } from "next/navigation";

export default function BlogDetailPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { currentBlog, blogs, loading, error } = useSelector((state: RootState) => state.blog)
  
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      dispatch(getBlogBySlug(slug))
      dispatch(getAllBlogs({}))
    }
  }, [dispatch, slug])

  const post = currentBlog;
  const recentPosts = blogs
    .filter(p => p.slug !== slug)
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, 3);


  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-muted-foreground">Yükleniyor...</div>
            </div>
          </div>
        </div>
      </main>
    );
  }


  if (error || (!post && !loading)) {
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
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Minimal Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            <span 
              onClick={() => router.push('/blog')} 
              className="hover:text-foreground cursor-pointer transition-colors"
            >
              Blog
            </span>
            <ChevronRight className="h-4 w-4" />
            <span 
              onClick={() => {
                const categorySlug = post.category.toLowerCase()
                  .replace(/ğ/g, 'g')
                  .replace(/ü/g, 'u')
                  .replace(/ş/g, 's')
                  .replace(/ı/g, 'i')
                  .replace(/ö/g, 'o')
                  .replace(/ç/g, 'c')
                  .replace(/\s+/g, '-');
                router.push(`/blog/kategori/${categorySlug}`)
              }} 
              className="hover:text-foreground cursor-pointer transition-colors"
            >
              {post.category}
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium truncate max-w-xs">{post.title}</span>
          </nav>
          {/* Article Header */}
          <article className="mb-16">
            {/* Title */}
            <h1 className="text-4xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-[16/9] rounded-lg overflow-hidden mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Excerpt */}
            <div className="mb-8">
              <p className="text-lg text-muted-foreground leading-relaxed italic border-l-4 border-primary/20 pl-6">
                {post.excerpt}
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4 prose-ul:text-muted-foreground prose-li:mb-1 dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Etiketler</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Share Button */}
            <div className="mt-8 pt-8 border-t">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Paylaş
              </Button>
            </div>
          </article>

          {/* Related Posts */}
          {recentPosts.length > 0 && (
            <section className="border-t pt-12">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Benzer Yazılar
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((relatedPost) => (
                  <article key={relatedPost._id} className="group">
                    <Link href={`/${relatedPost.slug}`} className="block">
                      <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Badge variant="outline" className="text-xs">
                          {relatedPost.category}
                        </Badge>
                        
                        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                          <span>{relatedPost.author}</span>
                          <span>•</span>
                          <span>{formatDate(relatedPost.publishedDate)}</span>
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
