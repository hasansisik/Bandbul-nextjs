export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  readTime: string;
  category: string;
  categorySlug: string; // Add categorySlug for URL-safe category names
  tags: string[];
  image: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Müzik Prodüksiyonunda Temel Teknikler",
    slug: "muzik-produksiyonunda-temel-teknikler",
    excerpt: "Modern müzik prodüksiyonunda kullanılan temel teknikler ve yazılımlar hakkında detaylı bir rehber.",
    content: `
      <p>Müzik prodüksiyonu, günümüzde teknolojinin gelişmesiyle birlikte çok daha erişilebilir hale geldi. Bu yazımızda temel prodüksiyon tekniklerini ele alacağız.</p>
      
      <h2>DAW Seçimi</h2>
      <p>Digital Audio Workstation (DAW) seçimi prodüksiyon sürecinin en önemli adımlarından biridir. Popüler seçenekler:</p>
      <ul>
        <li>Ableton Live - Canlı performans ve elektronik müzik için ideal</li>
        <li>Logic Pro - Mac kullanıcıları için kapsamlı çözüm</li>
        <li>Pro Tools - Profesyonel stüdyo standardı</li>
        <li>FL Studio - Başlangıç seviyesi için uygun</li>
      </ul>
      
      <h2>Mikrofon Teknikleri</h2>
      <p>Doğru mikrofon seçimi ve yerleştirme, kaliteli kayıt için kritik öneme sahiptir:</p>
      <ul>
        <li>Dinamik mikrofonlar - Yüksek ses seviyeleri için</li>
        <li>Kondenser mikrofonlar - Hassas kayıtlar için</li>
        <li>Ribbon mikrofonlar - Vintage ses karakteri için</li>
      </ul>
      
      <h2>Mixing ve Mastering</h2>
      <p>Mixing sürecinde dikkat edilmesi gerekenler:</p>
      <ul>
        <li>Frekans dengesi</li>
        <li>Dinamik aralık kontrolü</li>
        <li>Stereo görüntü</li>
        <li>Reverb ve delay kullanımı</li>
      </ul>
    `,
    author: "Mehmet Yılmaz",
    publishedDate: "2024-01-15",
    readTime: "8 dk",
    category: "Prodüksiyon",
    categorySlug: "produksiyon",
    tags: ["prodüksiyon", "müzik", "kayıt", "mixing"],
    image: "/blogexample.jpg",
    featured: true
  },
  {
    id: 2,
    title: "Grup Müziğinde İletişim ve Uyum",
    slug: "grup-muziginde-iletisim-ve-uyum",
    excerpt: "Bir müzik grubunda başarılı olmak için gerekli iletişim becerileri ve grup uyumu konuları.",
    content: `
      <p>Grup müziği, bireysel yeteneklerin yanı sıra kolektif uyum gerektiren bir sanat formudur. Bu yazımızda grup içi iletişimi ele alacağız.</p>
      
      <h2>Grup Dinamikleri</h2>
      <p>Başarılı bir grup için gerekli unsurlar:</p>
      <ul>
        <li>Açık iletişim</li>
        <li>Karşılıklı saygı</li>
        <li>Ortak hedefler</li>
        <li>Esneklik ve uyum</li>
      </ul>
      
      <h2>Prova Teknikleri</h2>
      <p>Verimli prova için öneriler:</p>
      <ul>
        <li>Düzenli program</li>
        <li>Net hedefler</li>
        <li>Geri bildirim kültürü</li>
        <li>Teknik gelişim odaklı çalışma</li>
      </ul>
    `,
    author: "Ayşe Demir",
    publishedDate: "2024-01-10",
    readTime: "6 dk",
    category: "Grup Müziği",
    categorySlug: "grup-muzigi",
    tags: ["grup", "iletişim", "prova", "uyum"],
    image: "/blogexample.jpg"
  },
  {
    id: 3,
    title: "Enstrüman Seçiminde Dikkat Edilecekler",
    slug: "enstruman-seciminde-dikkat-edilecekler",
    excerpt: "İlk enstrümanınızı seçerken dikkat etmeniz gereken faktörler ve öneriler.",
    content: `
      <p>Enstrüman seçimi, müzik yolculuğunuzun en önemli kararlarından biridir. Bu rehber size doğru seçimi yapmanızda yardımcı olacak.</p>
      
      <h2>Başlangıç Seviyesi Enstrümanlar</h2>
      <p>Yeni başlayanlar için önerilen enstrümanlar:</p>
      <ul>
        <li>Gitar - Erişilebilir ve çok yönlü</li>
        <li>Piyano - Müzik teorisi için ideal</li>
        <li>Ukulele - Küçük ve taşınabilir</li>
        <li>Flüt - Nefesli enstrümanlar için giriş</li>
      </ul>
      
      <h2>Seçim Kriterleri</h2>
      <p>Enstrüman seçerken düşünmeniz gerekenler:</p>
      <ul>
        <li>Bütçe</li>
        <li>Fiziksel uygunluk</li>
        <li>Müzik türü tercihi</li>
        <li>Öğrenme süresi</li>
      </ul>
    `,
    author: "Can Özkan",
    publishedDate: "2024-01-05",
    readTime: "5 dk",
    category: "Enstrüman",
    categorySlug: "enstruman",
    tags: ["enstrüman", "seçim", "başlangıç", "öğrenme"],
    image: "/blogexample.jpg"
  },
  {
    id: 4,
    title: "Müzik Teorisinin Temelleri",
    slug: "muzik-teorisinin-temelleri",
    excerpt: "Müzik teorisinin temel kavramları ve pratik uygulamaları hakkında kapsamlı rehber.",
    content: `
      <p>Müzik teorisi, müziği anlamak ve yaratmak için gerekli temel bilgileri sağlar. Bu yazımızda temel kavramları ele alacağız.</p>
      
      <h2>Nota Sistemi</h2>
      <p>Batı müziği nota sistemi:</p>
      <ul>
        <li>Do, Re, Mi, Fa, Sol, La, Si</li>
        <li>Bemol ve diyez işaretleri</li>
        <li>Oktav kavramı</li>
        <li>Anahtar işaretleri</li>
      </ul>
      
      <h2>Akorlar ve Armoni</h2>
      <p>Temel akor yapıları:</p>
      <ul>
        <li>Majör akorlar</li>
        <li>Minör akorlar</li>
        <li>Dominant yedili</li>
        <li>Akor ilerlemeleri</li>
      </ul>
    `,
    author: "Zeynep Kaya",
    publishedDate: "2023-12-28",
    readTime: "10 dk",
    category: "Müzik Teorisi",
    categorySlug: "muzik-teorisi",
    tags: ["teori", "nota", "akor", "armoni"],
    image: "/blogexample.jpg"
  },
  {
    id: 5,
    title: "Sahne Performansı ve Sahne Korkusu",
    slug: "sahne-performansi-ve-sahne-korkusu",
    excerpt: "Sahne performansında başarılı olmak için teknikler ve sahne korkusuyla başa çıkma yöntemleri.",
    content: `
      <p>Sahne performansı, birçok müzisyen için hem heyecan verici hem de korkutucu bir deneyimdir. Bu yazımızda bu konuları ele alacağız.</p>
      
      <h2>Sahne Korkusuyla Başa Çıkma</h2>
      <p>Yaygın teknikler:</p>
      <ul>
        <li>Nefes egzersizleri</li>
        <li>Görselleştirme teknikleri</li>
        <li>Düzenli prova</li>
        <li>Profesyonel destek</li>
      </ul>
      
      <h2>Performans Teknikleri</h2>
      <p>Başarılı performans için öneriler:</p>
      <ul>
        <li>İyi hazırlık</li>
        <li>Fiziksel rahatlık</li>
        <li>Seyirci ile iletişim</li>
        <li>Hata yönetimi</li>
      </ul>
    `,
    author: "Elif Yıldız",
    publishedDate: "2023-12-20",
    readTime: "7 dk",
    category: "Performans",
    categorySlug: "performans",
    tags: ["performans", "sahne", "korku", "teknik"],
    image: "/blogexample.jpg"
  },
  {
    id: 6,
    title: "Dijital Müzik Platformları ve Teknoloji",
    slug: "dijital-muzik-platformlari-ve-teknoloji",
    excerpt: "Modern müzik endüstrisinde dijital platformların rolü ve teknolojik gelişmeler.",
    content: `
      <p>Dijital teknoloji, müzik endüstrisini köklü bir şekilde değiştirdi. Bu yazımızda bu değişimleri ve fırsatları ele alacağız.</p>
      
      <h2>Streaming Platformları</h2>
      <p>Popüler platformlar:</p>
      <ul>
        <li>Spotify - En büyük streaming servisi</li>
        <li>Apple Music - Yüksek kalite odaklı</li>
        <li>YouTube Music - Video içerik entegrasyonu</li>
        <li>Bandcamp - Bağımsız sanatçılar için</li>
      </ul>
      
      <h2>Teknolojik Trendler</h2>
      <p>Güncel gelişmeler:</p>
      <ul>
        <li>Yapay zeka destekli müzik üretimi</li>
        <li>VR/AR konser deneyimleri</li>
        <li>Blockchain tabanlı telif hakları</li>
        <li>Sosyal medya entegrasyonu</li>
      </ul>
    `,
    author: "Deniz Arslan",
    publishedDate: "2023-12-15",
    readTime: "9 dk",
    category: "Dijital Müzik",
    categorySlug: "dijital-muzik",
    tags: ["dijital", "teknoloji", "platform", "streaming"],
    image: "/blogexample.jpg"
  },
  {
    id: 7,
    title: "Müzik Eğitiminde Teknoloji Kullanımı",
    slug: "muzik-egitiminde-teknoloji-kullanimi",
    excerpt: "Modern teknolojinin müzik eğitiminde nasıl kullanılabileceği ve dijital araçların öğrenme sürecine katkıları.",
    content: `
      <p>Teknoloji, müzik eğitimini daha etkili ve erişilebilir hale getiriyor. Bu yazımızda müzik eğitiminde kullanılan teknolojik araçları ve bunların avantajlarını ele alacağız.</p>
      
      <h2>Online Eğitim Platformları</h2>
      <p>Online eğitim platformları, müzik öğrenmeyi herkes için erişilebilir kılıyor. Bu platformlar şunları sağlar:</p>
      <ul>
        <li>Esnek öğrenme zamanları</li>
        <li>Kişiselleştirilmiş müfredat</li>
        <li>İnteraktif dersler</li>
        <li>Gerçek zamanlı geri bildirim</li>
      </ul>
      
      <h2>Müzik Uygulamaları</h2>
      <p>Müzik öğrenmeyi destekleyen uygulamalar:</p>
      <ul>
        <li>Metronom ve tuner uygulamaları</li>
        <li>Müzik teorisi öğrenme uygulamaları</li>
        <li>Enstrüman simülatörleri</li>
        <li>Kayıt ve analiz araçları</li>
      </ul>
    `,
    author: "Deniz Kaya",
    publishedDate: "2023-12-10",
    readTime: "7 dk",
    category: "Eğitim",
    categorySlug: "egitim",
    tags: ["eğitim", "teknoloji", "online", "uygulama"],
    image: "/blogexample.jpg"
  },
  {
    id: 8,
    title: "Klasik Müzikten Modern Müziğe Geçiş",
    slug: "klasik-muzikten-modern-muzige-gecis",
    excerpt: "Klasik müzik eğitimi alan müzisyenlerin modern müzik türlerine geçiş sürecinde yaşadıkları deneyimler ve öneriler.",
    content: `
      <p>Klasik müzik eğitimi, sağlam bir temel oluşturur ancak modern müzik türlerine geçiş bazen zorlayıcı olabilir. Bu yazımızda bu geçiş sürecini ele alacağız.</p>
      
      <h2>Klasik Eğitimin Avantajları</h2>
      <p>Klasik müzik eğitiminin modern müziğe katkıları:</p>
      <ul>
        <li>Güçlü teknik temel</li>
        <li>Müzik teorisi bilgisi</li>
        <li>Disiplinli çalışma alışkanlığı</li>
        <li>Nota okuma becerisi</li>
      </ul>
      
      <h2>Geçiş Sürecinde Dikkat Edilecekler</h2>
      <p>Modern müziğe geçerken önemli noktalar:</p>
      <ul>
        <li>Farklı ritim yapılarını öğrenme</li>
        <li>Improvisasyon becerilerini geliştirme</li>
        <li>Elektronik enstrümanlara adaptasyon</li>
        <li>Farklı müzik kültürlerini anlama</li>
      </ul>
    `,
    author: "Ahmet Yılmaz",
    publishedDate: "2023-12-05",
    readTime: "8 dk",
    category: "Eğitim",
    categorySlug: "egitim",
    tags: ["klasik", "modern", "geçiş", "eğitim"],
    image: "/blogexample.jpg"
  },
  {
    id: 9,
    title: "Müzik Terapisinin Sağlığa Katkıları",
    slug: "muzik-terapisinin-sagliga-katkilari",
    excerpt: "Müzik terapisinin fiziksel ve ruhsal sağlığa olan olumlu etkileri ve uygulama alanları.",
    content: `
      <p>Müzik terapisinin sağlığa olan olumlu etkileri bilimsel araştırmalarla kanıtlanmıştır. Bu yazımızda müzik terapisinin farklı alanlardaki uygulamalarını ele alacağız.</p>
      
      <h2>Fiziksel Sağlık Etkileri</h2>
      <p>Müzik terapisinin fiziksel faydaları:</p>
      <ul>
        <li>Ağrı yönetimi</li>
        <li>Motor becerilerin gelişimi</li>
        <li>Solunum kontrolü</li>
        <li>Kas gevşetme</li>
      </ul>
      
      <h2>Ruhsal Sağlık Etkileri</h2>
      <p>Müzik terapisinin psikolojik faydaları:</p>
      <ul>
        <li>Stres azaltma</li>
        <li>Anksiyete yönetimi</li>
        <li>Depresyon tedavisi</li>
        <li>Duygusal ifade</li>
      </ul>
    `,
    author: "Selin Demir",
    publishedDate: "2023-11-30",
    readTime: "6 dk",
    category: "Sağlık",
    categorySlug: "saglik",
    tags: ["terapi", "sağlık", "psikoloji", "tedavi"],
    image: "/blogexample.jpg"
  },
  {
    id: 10,
    title: "Jazz Improvisasyon Teknikleri",
    slug: "jazz-improvisasyon-teknikleri",
    excerpt: "Jazz müziğinde improvisasyon yapmanın temel teknikleri ve geliştirme yöntemleri.",
    content: `
      <p>Jazz improvisasyonu, müziğin en özgür ve yaratıcı formlarından biridir. Bu yazımızda jazz improvisasyonunun temel tekniklerini ele alacağız.</p>
      
      <h2>Temel Improvisasyon Teknikleri</h2>
      <p>Jazz improvisasyonunda kullanılan teknikler:</p>
      <ul>
        <li>Modal improvisasyon</li>
        <li>Chord tone targeting</li>
        <li>Scale patterns</li>
        <li>Rhythmic variation</li>
      </ul>
      
      <h2>Geliştirme Yöntemleri</h2>
      <p>Improvisasyon becerilerini geliştirmek için:</p>
      <ul>
        <li>Transcription çalışması</li>
        <li>Backing track ile pratik</li>
        <li>Melodic development</li>
        <li>Rhythmic complexity</li>
      </ul>
    `,
    author: "Burak Özkan",
    publishedDate: "2023-11-25",
    readTime: "9 dk",
    category: "Jazz",
    categorySlug: "jazz",
    tags: ["jazz", "improvisasyon", "teknik", "müzik"],
    image: "/blogexample.jpg"
  },
  {
    id: 11,
    title: "Müzik Endüstrisinde Telif Hakları",
    slug: "muzik-endustrisinde-telif-haklari",
    excerpt: "Müzik endüstrisinde telif hakları, lisanslama ve yasal konular hakkında detaylı bilgi.",
    content: `
      <p>Müzik endüstrisinde telif hakları, sanatçıların eserlerini korumak için kritik öneme sahiptir. Bu yazımızda telif hakları konusunu detaylı olarak ele alacağız.</p>
      
      <h2>Telif Hakları Türleri</h2>
      <p>Müzik endüstrisinde farklı telif hakları:</p>
      <ul>
        <li>Kompozisyon hakları</li>
        <li>Kayıt hakları</li>
        <li>Performans hakları</li>
        <li>Yayın hakları</li>
      </ul>
      
      <h2>Lisanslama Süreçleri</h2>
      <p>Müzik lisanslama türleri:</p>
      <ul>
        <li>Mechanical licenses</li>
        <li>Synchronization licenses</li>
        <li>Performance licenses</li>
        <li>Print licenses</li>
      </ul>
    `,
    author: "Merve Yıldız",
    publishedDate: "2023-11-20",
    readTime: "10 dk",
    category: "Hukuk",
    categorySlug: "hukuk",
    tags: ["telif", "hukuk", "lisans", "endüstri"],
    image: "/blogexample.jpg"
  },
  {
    id: 12,
    title: "Dünya Müzikleri ve Kültürel Zenginlik",
    slug: "dunya-muzikleri-ve-kulturel-zenginlik",
    excerpt: "Farklı kültürlerin müzik gelenekleri ve dünya müziklerinin zenginliği hakkında keşif.",
    content: `
      <p>Dünya müzikleri, insanlığın kültürel zenginliğinin en güzel örneklerinden biridir. Bu yazımızda farklı kültürlerin müzik geleneklerini keşfedeceğiz.</p>
      
      <h2>Afrika Müzikleri</h2>
      <p>Afrika kıtasının zengin müzik gelenekleri:</p>
      <ul>
        <li>Geleneksel ritimler</li>
        <li>Vokal teknikleri</li>
        <li>Enstrüman çeşitliliği</li>
        <li>Topluluk müziği</li>
      </ul>
      
      <h2>Asya Müzikleri</h2>
      <p>Asya'nın çeşitli müzik kültürleri:</p>
      <ul>
        <li>Hint klasik müziği</li>
        <li>Çin operası</li>
        <li>Japon geleneksel müziği</li>
        <li>Orta Doğu müzikleri</li>
      </ul>
    `,
    author: "Kaan Arslan",
    publishedDate: "2023-11-15",
    readTime: "8 dk",
    category: "Kültür",
    categorySlug: "kultur",
    tags: ["kültür", "dünya", "gelenek", "müzik"],
    image: "/blogexample.jpg"
  }
];

export const getRecentPosts = (count: number = 6): BlogPost[] => {
  return blogPosts
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, count);
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const searchPosts = (query: string): BlogPost[] => {
  const lowercaseQuery = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.author.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getCategories = (): string[] => {
  return [...new Set(blogPosts.map(post => post.category))];
};

export const getPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(post => post.category === category);
};

export const getCategoryDescription = (category: string): string => {
  const descriptions: { [key: string]: string } = {
    "Prodüksiyon": "Müzik prodüksiyonu, kayıt teknikleri ve stüdyo teknolojileri hakkında detaylı rehberler.",
    "Grup Müziği": "Grup kurma, yönetim ve grup içi iletişim konularında pratik ipuçları.",
    "Enstrüman": "Enstrüman seçimi, bakımı ve öğrenme süreçleri hakkında kapsamlı bilgiler.",
    "Müzik Teorisi": "Müzik teorisinin temelleri ve pratik uygulamaları.",
    "Performans": "Sahne performansı, sahne korkusu ve performans teknikleri.",
    "Dijital Müzik": "Dijital platformlar, teknoloji ve modern müzik endüstrisi.",
    "Eğitim": "Müzik eğitimi ve öğrenme süreçleri hakkında rehberler.",
    "Sağlık": "Müzik terapisinin sağlığa katkıları ve uygulamaları.",
    "Jazz": "Jazz müziği ve improvisasyon teknikleri.",
    "Hukuk": "Müzik endüstrisinde telif hakları ve yasal konular.",
    "Kültür": "Dünya müzikleri ve kültürel müzik türleri."
  };
  return descriptions[category] || `${category} kategorisindeki en güncel yazılar ve rehberler.`;
};
