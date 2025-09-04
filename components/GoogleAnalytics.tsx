"use client";

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default function GoogleAnalytics() {
  const { settings, loading } = useSelector((state: RootState) => state.settings);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    // Don't load scripts if settings are still loading or already loaded
    if (loading || scriptsLoaded) return;

    // Initialize Google Tag Manager
    if (settings?.seo?.googleTagManager) {
      const gtmId = settings.seo.googleTagManager;
      
      // Check if GTM is already loaded
      if (!document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${gtmId}"]`)) {
        // Add GTM script to head
        const gtmScript = document.createElement('script');
        gtmScript.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `;
        document.head.appendChild(gtmScript);

        // Add GTM noscript to body
        const gtmNoscript = document.createElement('noscript');
        gtmNoscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.insertBefore(gtmNoscript, document.body.firstChild);
      }
    }

    // Initialize Google Analytics
    if (settings?.seo?.googleAnalytics) {
      const gaId = settings.seo.googleAnalytics;
      
      // Check if GA is already loaded
      if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`)) {
        // Add GA script to head
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(gaScript);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
          window.dataLayer.push(args);
        }
        window.gtag = gtag;
        
        gtag('js', new Date());
        gtag('config', gaId, {
          page_title: document.title,
          page_location: window.location.href,
        });
      }
    }

    setScriptsLoaded(true);
  }, [settings?.seo?.googleTagManager, settings?.seo?.googleAnalytics, loading, scriptsLoaded]);

  return null;
}
