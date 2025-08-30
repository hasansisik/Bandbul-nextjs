# Bandbul - Müzik için her şey

Bandbul.com sitesinin modern ve minimalist tasarımla shadcn/ui kullanılarak restore edilmiş versiyonu.

## 🎵 Özellikler

- **Modern Tasarım**: shadcn/ui component'leri ile oluşturulmuş temiz ve minimalist arayüz
- **Responsive**: Tüm cihazlarda mükemmel görünüm
- **Dark/Light Mode**: Sistem teması desteği ile otomatik tema değişimi
- **Türkçe**: Tamamen Türkçe içerik ve arayüz
- **Performans**: Next.js 15 ve Turbopack ile optimize edilmiş performans

## 🚀 Teknolojiler

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Theme**: next-themes
- **Language**: TypeScript

## 📁 Proje Yapısı

```
bandbul/
├── app/
│   ├── globals.css          # Global stiller
│   ├── layout.tsx           # Ana layout
│   └── page.tsx             # Ana sayfa
├── components/
│   ├── ui/                  # shadcn/ui component'leri
│   ├── sections/            # Sayfa bölümleri
│   │   ├── Header.tsx       # Navigasyon
│   │   ├── HeroSection.tsx  # Ana banner
│   │   ├── SearchSection.tsx # Arama/filtreleme
│   │   ├── LatestListings.tsx # En yeni ilanlar
│   │   ├── BlogSection.tsx  # Blog yazıları
│   │   ├── SupportSection.tsx # Destek formu
│   │   └── Footer.tsx       # Alt bilgiler
│   ├── ThemeProvider.tsx    # Tema provider
│   └── ThemeToggle.tsx      # Tema değiştirici
└── lib/
    └── utils.ts             # Yardımcı fonksiyonlar
```

## 🎨 Bölümler

### 1. Header (Navigasyon)
- Logo ve marka kimliği
- Ana menü linkleri
- Arama butonu
- Tema değiştirici
- Giriş/Kayıt butonları
- Mobil responsive menü

### 2. Hero Section (Ana Banner)
- "YENİ BİR İLAN VER" ana başlığı
- Açıklayıcı metin
- İlan ver butonu
- Özellik kartları (Müzik İlanları, Topluluk, Eğitim)

### 3. Search Section (Arama/Filtreleme)
- İlan türü seçimi (Grup Arıyorum, Müzisyen Arıyorum, Ders Almak İstiyorum)
- Enstrüman seçimi (Gitar, Bas Gitar, Davul, Piano, vb.)
- Şehir seçimi (Türkiye'nin tüm şehirleri)
- Filtrele butonu
- Hızlı filtre badge'leri

### 4. Latest Listings (En Yeni İlanlar)
- Kategori tab'ları (Tüm İlanlar, Grup Arıyorum, Müzisyen Arıyorum, Ders Almak İstiyorum)
- İlan kartları (başlık, şehir, tür, enstrüman)
- Hover efektleri
- "Hepsini Gör" butonu

### 5. Blog Section (Blog Yazıları)
- Müzik ile ilgili blog yazıları
- Kategori badge'leri
- Okuma süresi
- Tarih bilgisi
- "Tüm Yazıları Gör" butonu

### 6. Support Section (Destek Birimi)
- İletişim formu (Ad Soyad, E-posta, Konu, Mesaj)
- Gönder butonu
- Ek bilgiler (Hızlı Yanıt, Uzman Destek, Güvenli İletişim)

### 7. Footer (Alt Bilgiler)
- Marka bilgisi ve sosyal medya linkleri
- Ana sayfa linkleri
- İlan kategorileri
- Destek linkleri
- İletişim bilgileri
- Telif hakkı bilgisi

## 🛠️ Kurulum

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd bandbul
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

4. **Tarayıcıda açın:**
```
http://localhost:3000
```

## 📱 Responsive Tasarım

- **Desktop**: Tam özellikli arayüz
- **Tablet**: Orta boyut ekranlar için optimize edilmiş
- **Mobile**: Mobil cihazlar için özel düzenlemeler

## 🎨 Tema Desteği

- **Light Mode**: Açık tema
- **Dark Mode**: Koyu tema
- **System**: Sistem temasına göre otomatik değişim

## 🔧 Geliştirme

### Yeni Component Ekleme
```bash
npx shadcn@latest add <component-name>
```

### Yeni Section Ekleme
1. `components/sections/` klasöründe yeni component oluşturun
2. `app/page.tsx` dosyasına import edin
3. Ana sayfaya ekleyin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- **Website**: [bandbul.com](https://bandbul.com)
- **Email**: info@bandbul.com
- **Phone**: +90 212 123 45 67

---

**Bandbul** - Müzik için her şey 🎵
