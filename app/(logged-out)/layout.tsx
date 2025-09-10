import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Footer />
          
          {/* Fixed Scroll to Top Button - Bottom Right */}
          <ScrollToTop />
          
          {/* Fixed WhatsApp Button - Bottom Left */}
          <WhatsAppFloatingButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
