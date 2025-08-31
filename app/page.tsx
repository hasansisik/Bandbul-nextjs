import Header from "@/components/sections/Header";
import HeroSection from "@/components/sections/HeroSection";
import LatestListings from "@/components/sections/LatestListings";
import BlogSection from "@/components/sections/BlogSection";
import SupportSection from "@/components/sections/SupportSection";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <LatestListings />
      <BlogSection />
      <SupportSection />
      <Footer />
    </main>
  );
}
