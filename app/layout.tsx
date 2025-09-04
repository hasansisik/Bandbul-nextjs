import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

import { ScrollToTop } from "@/components/ScrollToTop";
import { Providers } from "@/redux/provider";
import { UserLoader } from "@/components/UserLoader";
import { getSettings } from "@/redux/actions/settingsActions";
import { server } from "@/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Dynamic metadata function
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch settings from the API directly (since this runs on the server)
    const response = await fetch(`${server}/settings/public`);
    const data = await response.json();
    
    if (data.success && data.settings) {
      return {
        title: data.settings.metadata?.title || "Bandbul - Müzik için her şey",
        description: data.settings.metadata?.description || "Müzisyen arayışları, grup ilanları, müzik dersleri ve daha fazlası için Bandbul'u ziyaret edin.",
        keywords: data.settings.metadata?.keywords || "müzik, müzisyen, grup, ilan, ders, enstrüman",
        authors: [{ name: data.settings.metadata?.author || "Bandbul" }],
        openGraph: {
          title: data.settings.metadata?.title || "Bandbul - Müzik için her şey",
          description: data.settings.metadata?.description || "Müzisyen arayışları, grup ilanları, müzik dersleri ve daha fazlası için Bandbul'u ziyaret edin.",
          type: "website",
          locale: "tr_TR",
          siteName: data.settings.metadata?.title || "Bandbul",
        },
        twitter: {
          card: "summary_large_image",
          title: data.settings.metadata?.title || "Bandbul - Müzik için her şey",
          description: data.settings.metadata?.description || "Müzisyen arayışları, grup ilanları, müzik dersleri ve daha fazlası için Bandbul'u ziyaret edin.",
        },
        robots: {
          index: true,
          follow: true,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching settings for metadata:', error);
  }
  
  // Fallback metadata if settings fetch fails
  return {
    title: "Bandbul - Müzik için her şey",
    description: "Müzisyen arayışları, grup ilanları, müzik dersleri ve daha fazlası için Bandbul'u ziyaret edin.",
    keywords: "müzik, müzisyen, grup, ilan, ders, enstrüman",
    authors: [{ name: "Bandbul" }],
    openGraph: {
      title: "Bandbul - Müzik için her şey",
      description: "Müzisyen arayışları, grup ilanları, müzik dersleri ve daha fazlası için Bandbul'u ziyaret edin.",
      type: "website",
      locale: "tr_TR",
      siteName: "Bandbul",
    },
    twitter: {
      card: "summary_large_image",
      title: "Bandbul - Müzik için her şey",
      description: "Müzisyen arayışları, grup ilanları, müzik dersleri ve daha fazlası için Bandbul'u ziyaret edin.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* Dynamic favicon will be handled by generateMetadata */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <UserLoader />
            {children}
            
            {/* Fixed Scroll to Top Button - Bottom Right */}
            <ScrollToTop />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
