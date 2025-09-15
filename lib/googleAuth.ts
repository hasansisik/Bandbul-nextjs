// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ;
import { safeJWTDecode } from './jwtUtils';

// For client-side OAuth, we need to add the current origin to allowed origins


export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  verified_email: boolean;
}

export const initializeGoogleAuth = () => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google Auth can only be initialized on client side'));
      return;
    }

    // Check if Google is already loaded
    if (window.google && window.google.accounts) {
      resolve();
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.accounts) {
        resolve();
      } else {
        reject(new Error('Failed to load Google Identity Services'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Google Identity Services script'));
    document.head.appendChild(script);
  });
};

export const signInWithGoogle = (): Promise<GoogleUser> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.google || !window.google.accounts) {
      reject(new Error('Google Auth not initialized'));
      return;
    }

    // Initialize Google Identity Services
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: any) => {
        try {
          // Decode the JWT token with proper UTF-8 handling
          const payload = safeJWTDecode(response.credential);
          
          const googleUser: GoogleUser = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            given_name: payload.given_name,
            family_name: payload.family_name,
            verified_email: payload.email_verified,
          };

          resolve(googleUser);
        } catch (error) {
          console.error('Error decoding Google response:', error);
          reject(new Error('Failed to decode Google response'));
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Render the button and handle the click
    const buttonElement = document.getElementById('google-signin-button');
    if (buttonElement) {
      window.google.accounts.id.renderButton(buttonElement, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: '100%',
      });
    } else {
      // Fallback: prompt the user to sign in
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // User closed the popup or skipped
          reject(new Error('Google sign-in was cancelled'));
          return;
        }
      });
    }
  });
};

// Declare global types for Google Identity Services
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}
