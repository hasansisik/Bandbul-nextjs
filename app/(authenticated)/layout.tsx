import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      
      {/* Fixed Scroll to Top Button - Bottom Right */}
      <ScrollToTop />
      {/* Fixed WhatsApp Button - Bottom Left */}
      <WhatsAppFloatingButton />
    </>
  );
}
