/**
 * Safely decode JWT token with proper UTF-8 handling
 * This function properly handles Turkish characters and other UTF-8 characters
 * that might be corrupted by the standard atob() function
 */
export function safeJWTDecode(token: string): any {
  try {
    // Split the JWT token into its three parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    // Get the payload part (middle part)
    const base64Url = parts[1];
    
    // Convert base64url to base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if necessary
    const paddedBase64 = base64 + '='.repeat((4 - base64.length % 4) % 4);
    
    // Decode base64 to binary string
    const binaryString = atob(paddedBase64);
    
    // Convert binary string to UTF-8 string
    const utf8String = decodeURIComponent(
      binaryString
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    // Parse the JSON
    return JSON.parse(utf8String);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    throw new Error('Failed to decode JWT token');
  }
}

/**
 * Alternative method using TextDecoder (more modern approach)
 * This is the preferred method for modern browsers
 */
export function safeJWTDecodeModern(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64 + '='.repeat((4 - base64.length % 4) % 4);
    
    // Use TextDecoder for better UTF-8 handling
    const binaryString = atob(paddedBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const decoder = new TextDecoder('utf-8');
    const utf8String = decoder.decode(bytes);
    
    return JSON.parse(utf8String);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    throw new Error('Failed to decode JWT token');
  }
}
