

export interface ListingItem {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  image: string;
  author: string;
  rating: number;
  isFavorite: boolean;
  postedDate: string;
  experience: string;
  instrument?: string;
  type?: string;
}

export const listingsData: ListingItem[] = [
  {
    id: 1,
    title: "DENEYİMLİ TROMPETÇİ ARANIYOR!!",
    description: "Profesyonel orkestra için deneyimli trompetçi arıyoruz. Klasik müzik geçmişi olan, nota okuyabilen müzisyenler tercih edilir.",
    category: "Müzisyen Arıyorum",
    location: "Bayburt",
    image: "/blogexample.jpg",
    author: "Ahmet Yılmaz",
    rating: 4.8,
    isFavorite: false,
    postedDate: "2 saat önce",
    experience: "İleri",
    instrument: "Trompet",
    type: "Müzisyen Arıyorum"
  },
  {
    id: 2,
    title: "Kadın vokal, jazz stili, downtempo, lounge",
    description: "Jazz ve downtempo müzik yapan grubumuz için kadın vokalist arıyoruz. Deneyimli ve tutkulu müzisyenler aranıyor.",
    category: "Müzisyen Arıyorum",
    location: "İstanbul",
    image: "/blogexample.jpg",
    author: "Zeynep Kaya",
    rating: 4.9,
    isFavorite: true,
    postedDate: "1 gün önce",
    experience: "Profesyonel",
    instrument: "Vokal",
    type: "Müzisyen Arıyorum"
  },
  {
    id: 3,
    title: "İstanbul Trip-hop grubu veya dj arıyorum (duo tercih)",
    description: "Trip-hop ve elektronik müzik yapan duo arıyoruz. DJ veya enstrüman çalabilen müzisyenler tercih edilir.",
    category: "Müzisyen Arıyorum",
    location: "İstanbul",
    image: "/blogexample.jpg",
    author: "Mehmet Demir",
    rating: 4.7,
    isFavorite: false,
    postedDate: "3 gün önce",
    experience: "Orta",
    instrument: "Klavye",
    type: "Müzisyen Arıyorum"
  },
  {
    id: 4,
    title: "İleri seviye gitar dersi",
    description: "İleri seviye gitar dersi almak istiyorum. Rock, blues ve jazz tarzlarında eğitim verebilecek öğretmen arıyorum.",
    category: "Ders Almak İstiyorum",
    location: "İzmir",
    image: "/blogexample.jpg",
    author: "Can Yıldız",
    rating: 4.6,
    isFavorite: false,
    postedDate: "1 hafta önce",
    experience: "İleri",
    instrument: "Gitar",
    type: "Ders Almak İstiyorum"
  },
  {
    id: 5,
    title: "Gitar Dersi Verilir",
    description: "Klasik ve akustik gitar dersi veriyorum. Başlangıç seviyesinden ileri seviyeye kadar. Evinize gelebilirim.",
    category: "Ders Veriyorum",
    location: "İstanbul",
    image: "/blogexample.jpg",
    author: "Elif Özkan",
    rating: 4.9,
    isFavorite: true,
    postedDate: "2 gün önce",
    experience: "Profesyonel",
    instrument: "Gitar",
    type: "Ders Veriyorum"
  },
  {
    id: 6,
    title: "Hobi projeye bass gitarist aranıyor",
    description: "Hobi amaçlı rock grubu için bass gitarist arıyoruz. Haftada 1-2 gün prova yapabiliriz.",
    category: "Müzisyen Arıyorum",
    location: "İstanbul",
    image: "/blogexample.jpg",
    author: "Selin Arslan",
    rating: 4.5,
    isFavorite: false,
    postedDate: "4 gün önce",
    experience: "Orta",
    instrument: "Bas Gitar",
    type: "Müzisyen Arıyorum"
  },
  {
    id: 7,
    title: "Hobi projeye vokal aranıyor",
    description: "Pop müzik yapan hobi grubumuz için vokalist arıyoruz. Kadın vokalist tercih edilir.",
    category: "Müzisyen Arıyorum",
    location: "İstanbul",
    image: "/blogexample.jpg",
    author: "Burak Kaya",
    rating: 4.4,
    isFavorite: false,
    postedDate: "5 gün önce",
    experience: "Başlangıç",
    instrument: "Vokal",
    type: "Müzisyen Arıyorum"
  },
  {
    id: 8,
    title: "Hardcore, Metalcore grup arıyorum",
    description: "Hardcore ve metalcore müzik yapan grubumuz için gitarist arıyoruz. Deneyimli ve tutkulu müzisyenler aranıyor.",
    category: "Grup Arıyorum",
    location: "İstanbul",
    image: "/blogexample.jpg",
    author: "Deniz Yılmaz",
    rating: 4.3,
    isFavorite: false,
    postedDate: "1 hafta önce",
    experience: "İleri",
    instrument: "Gitar",
    type: "Grup Arıyorum"
  },
  {
    id: 9,
    title: "Davulcu ilanı",
    description: "Rock grubu için davulcu arıyoruz. Deneyimli ve ritim duygusu güçlü müzisyenler tercih edilir.",
    category: "Grup Arıyorum",
    location: "İstanbul",
    image: "/blogexample.jpg",
    author: "Kemal Demir",
    rating: 4.2,
    isFavorite: false,
    postedDate: "2 hafta önce",
    experience: "Orta",
    instrument: "Davul",
    type: "Grup Arıyorum"
  },
  {
    id: 10,
    title: "Ankara grup arıyorum",
    description: "Ankara'da müzik yapmak isteyen grup arıyoruz. Her türlü enstrüman çalabilen müzisyenler aranıyor.",
    category: "Grup Arıyorum",
    location: "Ankara",
    image: "/blogexample.jpg",
    author: "Ayşe Kaya",
    rating: 4.1,
    isFavorite: false,
    postedDate: "3 hafta önce",
    experience: "Başlangıç",
    instrument: "Gitar",
    type: "Grup Arıyorum"
  },
  {
    id: 11,
    title: "Rock Grubu için Gitarist Arıyoruz",
    description: "Deneyimli gitarist arıyoruz. Rock müzik yapmak istiyoruz. Haftada 2-3 gün prova yapabiliriz.",
    category: "Grup Arıyorum",
    location: "İstanbul, Kadıköy",
    image: "/blogexample.jpg",
    author: "Ahmet Yılmaz",
    rating: 4.8,
    isFavorite: false,
    postedDate: "2 saat önce",
    experience: "Orta",
    instrument: "Gitar",
    type: "Grup Arıyorum"
  },
  {
    id: 12,
    title: "Piyano Dersi Veriyorum",
    description: "Klasik piyano dersi veriyorum. Başlangıç seviyesinden ileri seviyeye kadar. Evinize gelebilirim.",
    category: "Ders Veriyorum",
    location: "İstanbul, Beşiktaş",
    image: "/blogexample.jpg",
    author: "Zeynep Kaya",
    rating: 4.9,
    isFavorite: true,
    postedDate: "1 gün önce",
    experience: "İleri",
    instrument: "Piyano",
    type: "Ders Veriyorum"
  },
  {
    id: 13,
    title: "Jazz Grubu için Bas Gitarist",
    description: "Jazz müzik yapan grubumuz için bas gitarist arıyoruz. Deneyimli ve tutkulu müzisyenler aranıyor.",
    category: "Grup Arıyorum",
    location: "Ankara, Çankaya",
    image: "/blogexample.jpg",
    author: "Mehmet Demir",
    rating: 4.7,
    isFavorite: false,
    postedDate: "3 gün önce",
    experience: "Profesyonel",
    instrument: "Bas Gitar",
    type: "Grup Arıyorum"
  },
  {
    id: 14,
    title: "Fender Stratocaster Satılık",
    description: "2019 model Fender Stratocaster. Çok az kullanılmış, mükemmel durumda. Orijinal kutusu ile birlikte.",
    category: "Enstrüman Satıyorum",
    location: "İzmir, Konak",
    image: "/blogexample.jpg",
    author: "Can Yıldız",
    rating: 4.6,
    isFavorite: false,
    postedDate: "1 hafta önce",
    experience: "Orta",
    instrument: "Gitar",
    type: "Enstrüman Satıyorum"
  },
  {
    id: 15,
    title: "Stüdyo Kiralıyorum",
    description: "Profesyonel kayıt stüdyosu. Tam ekipmanlı, akustik odalar. Saatlik veya günlük kiralanır.",
    category: "Stüdyo Kiralıyorum",
    location: "İstanbul, Şişli",
    image: "/blogexample.jpg",
    author: "Elif Özkan",
    rating: 4.9,
    isFavorite: true,
    postedDate: "2 gün önce",
    experience: "Profesyonel",
    instrument: "Stüdyo",
    type: "Stüdyo Kiralıyorum"
  }
];

// Utility functions
export const getRecentListings = (count: number = 10): ListingItem[] => {
  return listingsData.slice(0, count);
};

export const getListingsByCategory = (category: string): ListingItem[] => {
  if (category === "all") return listingsData;
  return listingsData.filter(listing => listing.category === category);
};

export const getListingsByType = (type: string): ListingItem[] => {
  if (type === "all") return listingsData;
  return listingsData.filter(listing => listing.type === type);
};

export const searchListings = (query: string): ListingItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return listingsData.filter(listing => 
    listing.title.toLowerCase().includes(lowercaseQuery) ||
    listing.description.toLowerCase().includes(lowercaseQuery) ||
    listing.location.toLowerCase().includes(lowercaseQuery) ||
    listing.instrument?.toLowerCase().includes(lowercaseQuery)
  );
};

export const getCategories = () => {
  const categories = Array.from(new Set(listingsData.map(listing => listing.category)));
  return categories.map(category => ({
    value: category,
    label: category,
    count: listingsData.filter(listing => listing.category === category).length
  }));
};

export const getTypes = () => {
  const types = Array.from(new Set(listingsData.map(listing => listing.type).filter(Boolean)));
  return types.map(type => ({
    value: type,
    label: type,
    count: listingsData.filter(listing => listing.type === type).length
  }));
};
