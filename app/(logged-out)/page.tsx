import HeroSection from "@/components/sections/HeroSection";
import LatestListings from "@/components/sections/LatestListings";
import BlogSection from "@/components/sections/BlogSection";
import SupportSection from "@/components/sections/SupportSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <HeroSection />
      <LatestListings />
      <BlogSection />
      <SupportSection />
    </main>
  );
}
