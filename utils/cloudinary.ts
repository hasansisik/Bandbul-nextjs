// Basit Cloudinary upload fonksiyonu
// Gerçek uygulamada Cloudinary API key'leri ve cloud name kullanılmalı
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  // Simüle edilmiş upload - gerçek uygulamada Cloudinary API kullanılır
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Base64 formatında resmi döndür (test için)
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });
};
