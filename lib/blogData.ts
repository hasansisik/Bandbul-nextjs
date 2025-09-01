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
  tags: string[];
  image: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Müzik Prodüksiyonunda Yeni Teknolojiler",
    slug: "muzik-produksiyonunda-yeni-teknolojiler",
    excerpt: "Günümüzde müzik prodüksiyonu alanında kullanılan en son teknolojiler ve bunların müzisyenlere sağladığı avantajlar hakkında detaylı bir rehber.",
    content: `
      <p>Müzik prodüksiyonu alanında teknoloji her geçen gün daha da gelişiyor. Artık ev stüdyolarında bile profesyonel kalitede kayıtlar yapmak mümkün. Bu yazımızda müzik prodüksiyonunda kullanılan en son teknolojileri ve bunların avantajlarını ele alacağız.</p>
      
      <h2>Dijital Ses İşleme (DSP) Teknolojileri</h2>
      <p>Modern dijital ses işleme teknolojileri, müzisyenlere daha önce hiç olmadığı kadar esneklik sağlıyor. Yapay zeka destekli eklentiler, otomatik mastering araçları ve gerçek zamanlı ses işleme yazılımları artık standart hale geldi.</p>
      
      <h3>Yapay Zeka Destekli Eklentiler</h3>
      <p>Yapay zeka teknolojisi, müzik prodüksiyonunda devrim yaratıyor. AI destekli eklentiler şunları yapabiliyor:</p>
      <ul>
        <li>Otomatik ses temizleme</li>
        <li>Akıllı kompresyon</li>
        <li>Dinamik dengeleme</li>
        <li>Otomatik mastering</li>
      </ul>
      
      <h3>Bulut Tabanlı Prodüksiyon</h3>
      <p>Bulut teknolojisi sayesinde artık dünyanın her yerinden projelerinize erişebilir, işbirlikçi çalışmalar yapabilirsiniz. Bu teknoloji özellikle uzaktan çalışan müzisyenler için büyük avantaj sağlıyor.</p>
      
      <h2>Gelecekte Müzik Prodüksiyonu</h2>
      <p>Gelecekte müzik prodüksiyonunda göreceğimiz teknolojiler:</p>
      <ul>
        <li>Sanal gerçeklik stüdyoları</li>
        <li>3D ses teknolojileri</li>
        <li>Blockchain tabanlı telif hakları yönetimi</li>
        <li>Daha gelişmiş AI destekli kompozisyon araçları</li>
      </ul>
      
      <p>Bu teknolojiler müzisyenlere daha yaratıcı olma imkanı sunarken, aynı zamanda prodüksiyon sürecini de hızlandırıyor.</p>
    `,
    author: "Ahmet Yılmaz",
    publishedDate: "2024-01-15",
    readTime: "8 dk",
    category: "Prodüksiyon",
    tags: ["prodüksiyon", "teknoloji", "AI", "müzik"],
    image: "/blogexample.jpg",
    featured: true
  },
  {
    id: 2,
    title: "Grup Kurarken Dikkat Edilmesi Gerekenler",
    slug: "grup-kurarken-dikkat-edilmesi-gerekenler",
    excerpt: "Başarılı bir müzik grubu kurmanın püf noktaları ve grup üyeleri arasında uyum sağlamanın yolları.",
    content: `
      <p>Başarılı bir müzik grubu kurmak sadece iyi müzisyenler bulmakla bitmiyor. Grup dinamikleri, iletişim ve ortak hedefler de en az müzik kalitesi kadar önemli. Bu yazımızda grup kurarken dikkat edilmesi gereken noktaları ele alacağız.</p>
      
      <h2>Müziksel Uyum</h2>
      <p>Grup üyelerinin müziksel tarzları ve yetenekleri uyumlu olmalı. Ancak bu, herkesin aynı tarzda çalması gerektiği anlamına gelmiyor. Farklı tarzların birleşmesi bazen çok daha ilginç sonuçlar verebilir.</p>
      
      <h3>Repertuar Seçimi</h3>
      <p>Grup repertuarını belirlerken şu faktörleri göz önünde bulundurun:</p>
      <ul>
        <li>Grup üyelerinin ortak beğenileri</li>
        <li>Hedef kitlenin beklentileri</li>
        <li>Teknik seviye uyumu</li>
        <li>Müzik türü çeşitliliği</li>
      </ul>
      
      <h2>İletişim ve Organizasyon</h2>
      <p>Grup içi iletişim, başarılı bir grubun temel taşlarından biridir. Düzenli toplantılar, açık iletişim kanalları ve net beklentiler belirlemek önemlidir.</p>
      
      <h3>Rol Dağılımı</h3>
      <p>Grupta her üyenin net bir rolü olmalı:</p>
      <ul>
        <li>Liderlik (müziksel ve organizasyonel)</li>
        <li>Teknik sorumluluklar</li>
        <li>İletişim ve pazarlama</li>
        <li>Finansal yönetim</li>
      </ul>
      
      <h2>Hedef Belirleme</h2>
      <p>Grup üyelerinin ortak hedefleri olmalı. Kimi sadece hobi olarak müzik yapmak isterken, kimi profesyonel kariyer hedefliyor olabilir. Bu farklılıklar başlangıçta net bir şekilde konuşulmalı.</p>
      
      <h2>Pratik ve Performans</h2>
      <p>Düzenli pratik yapmak ve performans deneyimi kazanmak grup gelişimi için kritiktir. Küçük mekanlarda başlayarak deneyim kazanmak, daha büyük fırsatlara hazırlanmanın en iyi yoludur.</p>
    `,
    author: "Zeynep Kaya",
    publishedDate: "2024-01-10",
    readTime: "6 dk",
    category: "Grup Müziği",
    tags: ["grup", "müzik", "organizasyon", "iletişim"],
    image: "/blogexample.jpg",
    featured: true
  },
  {
    id: 3,
    title: "Enstrüman Seçerken Nelere Dikkat Etmeli?",
    slug: "enstruman-secerken-nelere-dikkat-etmeli",
    excerpt: "İlk enstrümanınızı seçerken dikkat etmeniz gereken faktörler ve doğru seçim yapmanın yolları.",
    content: `
      <p>İlk enstrümanınızı seçmek heyecan verici ama aynı zamanda zorlu bir süreç. Bu karar müzik yolculuğunuzu şekillendirecek. Bu yazımızda enstrüman seçerken dikkat etmeniz gereken faktörleri ele alacağız.</p>
      
      <h2>Kişisel Tercihler</h2>
      <p>Enstrüman seçerken öncelikle kendi tercihlerinizi göz önünde bulundurun. Hangi müzik türlerini seviyorsunuz? Hangi enstrümanların sesini beğeniyorsunuz?</p>
      
      <h3>Fiziksel Uygunluk</h3>
      <p>Enstrüman seçerken fiziksel özelliklerinizi de düşünün:</p>
      <ul>
        <li>Boy ve el büyüklüğü</li>
        <li>Parmak uzunluğu</li>
        <li>Fiziksel güç</li>
        <li>Sağlık durumu</li>
      </ul>
      
      <h2>Bütçe ve Kalite</h2>
      <p>Enstrüman fiyatları çok geniş bir aralıkta değişiyor. Başlangıç seviyesi enstrümanlar genellikle uygun fiyatlıdır, ancak çok ucuz enstrümanlar öğrenmeyi zorlaştırabilir.</p>
      
      <h3>Kalite Faktörleri</h3>
      <p>İyi bir enstrüman seçerken şunlara dikkat edin:</p>
      <ul>
        <li>Malzeme kalitesi</li>
        <li>İşçilik</li>
        <li>Ses kalitesi</li>
        <li>Dayanıklılık</li>
        <li>Garanti</li>
      </ul>
      
      <h2>Öğrenme Kolaylığı</h2>
      <p>Bazı enstrümanlar diğerlerine göre öğrenmesi daha kolaydır. Başlangıç seviyesi için önerilen enstrümanlar:</p>
      <ul>
        <li>Ukulele</li>
        <li>Melodika</li>
        <li>Basit perküsyon enstrümanları</li>
        <li>Elektronik klavye</li>
      </ul>
      
      <h2>Uzun Vadeli Düşünün</h2>
      <p>Enstrüman seçerken sadece bugünü değil, geleceği de düşünün. Hangi enstrümanla ileride neler yapmak istiyorsunuz? Bu soru size doğru yönü gösterecektir.</p>
      
      <h2>Profesyonel Danışmanlık</h2>
      <p>Mümkünse bir müzik mağazasında profesyonel danışmanlık alın. Deneyimli satıcılar size en uygun enstrümanı bulmanızda yardımcı olabilir.</p>
    `,
    author: "Mehmet Demir",
    publishedDate: "2024-01-05",
    readTime: "7 dk",
    category: "Enstrüman",
    tags: ["enstrüman", "seçim", "başlangıç", "müzik"],
    image: "/blogexample.jpg"
  },
  {
    id: 4,
    title: "Müzik Teorisi: Temel Kavramlar",
    slug: "muzik-teorisi-temel-kavramlar",
    excerpt: "Müzik teorisinin temel kavramları ve bu bilgilerin pratik müzik yapımında nasıl kullanılacağı.",
    content: `
      <p>Müzik teorisi, müziği anlamanın ve yaratmanın temelidir. Bu yazımızda müzik teorisinin temel kavramlarını ve bunların pratik uygulamalarını ele alacağız.</p>
      
      <h2>Notalar ve Gamlar</h2>
      <p>Müzik teorisinin temeli notalardır. Batı müziğinde 7 temel nota vardır: Do, Re, Mi, Fa, Sol, La, Si.</p>
      
      <h3>Gamlar (Diziler)</h3>
      <p>Gamlar, notaların belirli bir düzende sıralanmasıdır. En yaygın gamlar:</p>
      <ul>
        <li>Majör gam</li>
        <li>Minör gam</li>
        <li>Pentatonik gam</li>
        <li>Blues gamı</li>
      </ul>
      
      <h2>Akorlar ve Armoni</h2>
      <p>Akorlar, birden fazla notanın aynı anda çalınmasıdır. Temel akor türleri:</p>
      <ul>
        <li>Majör akorlar</li>
        <li>Minör akorlar</li>
        <li>Diminished akorlar</li>
        <li>Augmented akorlar</li>
      </ul>
      
      <h3>Akor İlerlemeleri</h3>
      <p>Akor ilerlemeleri, bir şarkının temel yapısını oluşturur. Yaygın akor ilerlemeleri:</p>
      <ul>
        <li>I-IV-V (majör)</li>
        <li>I-V-vi-IV (pop)</li>
        <li>ii-V-I (jazz)</li>
      </ul>
      
      <h2>Ritim ve Metrik</h2>
      <p>Ritim, müziğin zaman içindeki düzenidir. Temel ritim kavramları:</p>
      <ul>
        <li>Vuruş (beat)</li>
        <li>Ölçü (measure)</li>
        <li>Tempo</li>
        <li>Metrik</li>
      </ul>
      
      <h2>Dinamik ve Artikülasyon</h2>
      <p>Dinamik, müziğin ses seviyesini belirler:</p>
      <ul>
        <li>Pianissimo (pp) - çok yumuşak</li>
        <li>Piano (p) - yumuşak</li>
        <li>Mezzo-piano (mp) - orta yumuşak</li>
        <li>Mezzo-forte (mf) - orta güçlü</li>
        <li>Forte (f) - güçlü</li>
        <li>Fortissimo (ff) - çok güçlü</li>
      </ul>
      
      <h2>Pratik Uygulama</h2>
      <p>Müzik teorisini öğrenirken pratik yapmak çok önemlidir. Teorik bilgileri enstrümanınızda uygulayarak pekiştirin.</p>
    `,
    author: "Elif Özkan",
    publishedDate: "2023-12-28",
    readTime: "10 dk",
    category: "Müzik Teorisi",
    tags: ["teori", "nota", "akor", "ritim", "müzik"],
    image: "/blogexample.jpg"
  },
  {
    id: 5,
    title: "Sahne Performansı İçin İpuçları",
    slug: "sahne-performansi-icin-ipuclari",
    excerpt: "Sahne korkusunu yenmek ve etkileyici performanslar sergilemek için pratik ipuçları ve teknikler.",
    content: `
      <p>Sahne performansı, birçok müzisyenin en büyük korkularından biridir. Ancak doğru tekniklerle bu korkuyu yenebilir ve etkileyici performanslar sergileyebilirsiniz. Bu yazımızda sahne performansı için pratik ipuçlarını paylaşacağız.</p>
      
      <h2>Sahne Korkusunu Yenme</h2>
      <p>Sahne korkusu normal bir duygudur. Hatta profesyonel müzisyenler bile bu duyguyu yaşar. Önemli olan bu korkuyu kontrol altına almak.</p>
      
      <h3>Nefes Teknikleri</h3>
      <p>Sahne korkusunu yenmek için nefes teknikleri çok etkilidir:</p>
      <ul>
        <li>Derin nefes alma</li>
        <li>4-7-8 tekniği</li>
        <li>Diyafram nefesi</li>
      </ul>
      
      <h2>Hazırlık Süreci</h2>
      <p>İyi bir performans için hazırlık çok önemlidir. Performans öncesi yapmanız gerekenler:</p>
      <ul>
        <li>Yeterli pratik</li>
        <li>Teknik kontrol</li>
        <li>Ekipman kontrolü</li>
        <li>Mental hazırlık</li>
      </ul>
      
      <h3>Pratik Stratejileri</h3>
      <p>Performans öncesi pratik yaparken:</p>
      <ul>
        <li>Yavaş tempoda başlayın</li>
        <li>Zorlu pasajları tekrarlayın</li>
        <li>Metronom kullanın</li>
        <li>Kayıt alıp dinleyin</li>
      </ul>
      
      <h2>Sahne Varlığı</h2>
      <p>Sahne varlığı, izleyiciyle bağ kurmanızı sağlar. Bunun için:</p>
      <ul>
        <li>Göz teması kurun</li>
        <li>Vücut dilinize dikkat edin</li>
        <li>Enerjinizi koruyun</li>
        <li>Doğal olun</li>
      </ul>
      
      <h2>Teknik Hazırlık</h2>
      <p>Performans öncesi teknik hazırlık:</p>
      <ul>
        <li>Enstrümanınızı kontrol edin</li>
        <li>Yedek ekipman bulundurun</li>
        <li>Ses kontrolü yapın</li>
        <li>Işık ayarlarını kontrol edin</li>
      </ul>
      
      <h2>İzleyici Etkileşimi</h2>
      <p>İzleyiciyle etkileşim kurmak performansınızı güçlendirir:</p>
      <ul>
        <li>Selamlayın</li>
        <li>Şarkılar arası konuşun</li>
        <li>İzleyici tepkilerine yanıt verin</li>
        <li>Teşekkür edin</li>
      </ul>
      
      <h2>Hata Yapma Korkusu</h2>
      <p>Hata yapmaktan korkmayın. Hatalar doğaldır ve genellikle izleyici tarafından fark edilmez. Önemli olan hatanızı düzgün bir şekilde yönetmektir.</p>
    `,
    author: "Can Yıldız",
    publishedDate: "2023-12-20",
    readTime: "9 dk",
    category: "Performans",
    tags: ["sahne", "performans", "korku", "teknik"],
    image: "/blogexample.jpg"
  },
  {
    id: 6,
    title: "Dijital Müzik Platformları ve Müzisyenler",
    slug: "dijital-muzik-platformlari-ve-muzisyenler",
    excerpt: "Dijital müzik platformlarının müzisyenlere sunduğu fırsatlar ve bu platformları etkili kullanma yöntemleri.",
    content: `
      <p>Dijital müzik platformları, müzisyenlerin müziklerini dünyaya ulaştırmasını sağlayan güçlü araçlardır. Bu yazımızda bu platformları nasıl etkili kullanabileceğinizi ele alacağız.</p>
      
      <h2>Platform Seçimi</h2>
      <p>Farklı dijital müzik platformları farklı avantajlar sunar. Platform seçerken şunları göz önünde bulundurun:</p>
      <ul>
        <li>Hedef kitleniz</li>
        <li>Platform popülerliği</li>
        <li>Telif hakları oranları</li>
        <li>Platform özellikleri</li>
      </ul>
      
      <h3>Popüler Platformlar</h3>
      <p>En popüler dijital müzik platformları:</p>
      <ul>
        <li>Spotify</li>
        <li>Apple Music</li>
        <li>YouTube Music</li>
        <li>Amazon Music</li>
        <li>Deezer</li>
      </ul>
      
      <h2>İçerik Optimizasyonu</h2>
      <p>Platformlarda başarılı olmak için içeriğinizi optimize edin:</p>
      <ul>
        <li>Kaliteli ses dosyaları</li>
        <li>Çekici kapak tasarımları</li>
        <li>Etkili başlıklar</li>
        <li>Doğru etiketler</li>
      </ul>
      
      <h3>Metadata Optimizasyonu</h3>
      <p>Metadata, müziğinizin bulunabilirliğini artırır:</p>
      <ul>
        <li>Doğru sanatçı adı</li>
        <li>Albüm bilgileri</li>
        <li>Tarih bilgileri</li>
        <li>Kategori seçimi</li>
      </ul>
      
      <h2>Promosyon Stratejileri</h2>
      <p>Platformlarda başarılı olmak için promosyon yapın:</p>
      <ul>
        <li>Sosyal medya kullanımı</li>
        <li>Playlist pitching</li>
        <li>Influencer işbirlikleri</li>
        <li>Canlı performanslar</li>
      </ul>
      
      <h2>Analitik Takibi</h2>
      <p>Platform analitiklerini takip ederek performansınızı ölçün:</p>
      <ul>
        <li>Dinlenme sayıları</li>
        <li>Coğrafi dağılım</li>
        <li>Dinleyici demografisi</li>
        <li>Popülerlik trendleri</li>
      </ul>
      
      <h2>Gelir Optimizasyonu</h2>
      <p>Platformlardan gelir elde etmek için:</p>
      <ul>
        <li>Çoklu platform kullanımı</li>
        <li>Merchandise satışı</li>
        <li>Canlı performanslar</li>
        <li>Özel içerikler</li>
      </ul>
      
      <h2>Gelecek Trendleri</h2>
      <p>Dijital müzik platformlarının geleceği:</p>
      <ul>
        <li>Yapay zeka önerileri</li>
        <li>Sanal gerçeklik deneyimleri</li>
        <li>Blockchain tabanlı telif hakları</li>
        <li>Daha kişiselleştirilmiş deneyimler</li>
      </ul>
    `,
    author: "Selin Arslan",
    publishedDate: "2023-12-15",
    readTime: "11 dk",
    category: "Dijital Müzik",
    tags: ["platform", "dijital", "müzik", "promosyon"],
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
    tags: ["eğitim", "teknoloji", "online", "uygulama"],
    image: "/blogexample.jpg"
  },
  {
    id: 8,
    title: "Klasik Müzikten Modern Müziğe Geçiş",
    slug: "klasik-muzikten-modern-muzige-gecis",
    excerpt: "Klasik müzik eğitimi alan müzisyenlerin modern müzik türlerine geçiş yaparken dikkat etmesi gerekenler.",
    content: `
      <p>Klasik müzik eğitimi, sağlam bir temel oluşturur ancak modern müzik türlerine geçiş yaparken farklı yaklaşımlar gerektirir. Bu yazımızda bu geçiş sürecini ele alacağız.</p>
      
      <h2>Temel Farklılıklar</h2>
      <p>Klasik ve modern müzik arasındaki temel farklılıklar:</p>
      <ul>
        <li>Ritim yaklaşımları</li>
        <li>Harmonik yapılar</li>
        <li>İmprovisasyon teknikleri</li>
        <li>Dinamik kullanımı</li>
      </ul>
      
      <h2>Geçiş Stratejileri</h2>
      <p>Başarılı bir geçiş için öneriler:</p>
      <ul>
        <li>Farklı müzik türlerini dinleyin</li>
        <li>Yeni teknikler öğrenin</li>
        <li>İmprovisasyon pratiği yapın</li>
        <li>Modern ekipmanları deneyin</li>
      </ul>
    `,
    author: "Mert Özkan",
    publishedDate: "2023-12-05",
    readTime: "8 dk",
    category: "Müzik Teorisi",
    tags: ["klasik", "modern", "geçiş", "teori"],
    image: "/blogexample.jpg"
  },
  {
    id: 9,
    title: "Müzik Terapisi ve İyileştirici Gücü",
    slug: "muzik-terapisi-ve-iyilestirici-gucu",
    excerpt: "Müziğin terapötik etkileri ve müzik terapisinin fiziksel ve ruhsal sağlığa katkıları.",
    content: `
      <p>Müzik, insan sağlığı üzerinde güçlü etkilere sahiptir. Bu yazımızda müzik terapisinin faydalarını ve uygulama alanlarını ele alacağız.</p>
      
      <h2>Müzik Terapisinin Faydaları</h2>
      <p>Müzik terapisinin sağlığa katkıları:</p>
      <ul>
        <li>Stres azaltma</li>
        <li>Anksiyete yönetimi</li>
        <li>Ağrı kontrolü</li>
        <li>Hafıza geliştirme</li>
        <li>Motor beceri iyileştirme</li>
      </ul>
      
      <h2>Uygulama Alanları</h2>
      <p>Müzik terapisinin kullanıldığı alanlar:</p>
      <ul>
        <li>Hastaneler ve klinikler</li>
        <li>Okullar ve eğitim kurumları</li>
        <li>Yaşlı bakım merkezleri</li>
        <li>Rehabilitasyon merkezleri</li>
      </ul>
    `,
    author: "Ayşe Demir",
    publishedDate: "2023-11-30",
    readTime: "6 dk",
    category: "Sağlık",
    tags: ["terapi", "sağlık", "iyileştirme", "psikoloji"],
    image: "/blogexample.jpg"
  },
  {
    id: 10,
    title: "Jazz Müziğinde İmprovisasyon Teknikleri",
    slug: "jazz-muziginde-improvisasyon-teknikleri",
    excerpt: "Jazz müziğinde improvisasyon yapmanın temel teknikleri ve geliştirme yöntemleri.",
    content: `
      <p>Jazz müziğinin en önemli özelliklerinden biri improvisasyondur. Bu yazımızda jazz improvisasyon tekniklerini ve geliştirme yöntemlerini ele alacağız.</p>
      
      <h2>Temel İmprovisasyon Teknikleri</h2>
      <p>Jazz improvisasyonunun temel teknikleri:</p>
      <ul>
        <li>Gamları öğrenme ve uygulama</li>
        <li>Akor ilerlemelerini analiz etme</li>
        <li>Motif geliştirme</li>
        <li>Dinamik ve artikülasyon kullanımı</li>
      </ul>
      
      <h2>Geliştirme Yöntemleri</h2>
      <p>İmprovisasyon becerilerini geliştirmek için:</p>
      <ul>
        <li>Düzenli pratik yapın</li>
        <li>Farklı stil ve müzisyenleri dinleyin</li>
        <li>Transkripsiyon çalışın</li>
        <li>Grup çalışmalarına katılın</li>
      </ul>
    `,
    author: "Burak Yılmaz",
    publishedDate: "2023-11-25",
    readTime: "9 dk",
    category: "Jazz",
    tags: ["jazz", "improvisasyon", "teknik", "müzik"],
    image: "/blogexample.jpg"
  },
  {
    id: 11,
    title: "Müzik Endüstrisinde Telif Hakları",
    slug: "muzik-endustrisinde-telif-haklari",
    excerpt: "Müzik endüstrisinde telif hakları, lisanslama ve müzisyenlerin haklarını koruma yöntemleri.",
    content: `
      <p>Telif hakları, müzisyenlerin eserlerini korumak ve gelir elde etmek için kritik öneme sahiptir. Bu yazımızda telif hakları konusunu detaylı olarak ele alacağız.</p>
      
      <h2>Telif Hakları Türleri</h2>
      <p>Müzik endüstrisinde telif hakları:</p>
      <ul>
        <li>Beste telif hakları</li>
        <li>Söz telif hakları</li>
        <li>Yorum telif hakları</li>
        <li>Prodüksiyon telif hakları</li>
      </ul>
      
      <h2>Hakları Koruma Yöntemleri</h2>
      <p>Telif haklarınızı korumak için:</p>
      <ul>
        <li>Eserlerinizi kayıt altına alın</li>
        <li>Telif hakları kuruluşlarına üye olun</li>
        <li>Lisans anlaşmalarını dikkatli inceleyin</li>
        <li>Hukuki danışmanlık alın</li>
      </ul>
    `,
    author: "Zeynep Arslan",
    publishedDate: "2023-11-20",
    readTime: "8 dk",
    category: "Hukuk",
    tags: ["telif", "hukuk", "endüstri", "haklar"],
    image: "/blogexample.jpg"
  },
  {
    id: 12,
    title: "Müzik ve Kültür: Dünya Müzikleri",
    slug: "muzik-ve-kultur-dunya-muzikleri",
    excerpt: "Dünya müziklerinin kültürel kökenleri ve farklı toplumlarda müziğin rolü.",
    content: `
      <p>Müzik, her kültürün ayrılmaz bir parçasıdır. Bu yazımızda dünya müziklerinin kültürel kökenlerini ve toplumlardaki rolünü ele alacağız.</p>
      
      <h2>Kültürel Müzik Türleri</h2>
      <p>Dünya genelinde farklı müzik türleri:</p>
      <ul>
        <li>Afrika müzikleri</li>
        <li>Asya müzikleri</li>
        <li>Latin Amerika müzikleri</li>
        <li>Ortadoğu müzikleri</li>
        <li>Avrupa halk müzikleri</li>
      </ul>
      
      <h2>Müziğin Kültürel Rolü</h2>
      <p>Müziğin toplumlardaki işlevleri:</p>
      <ul>
        <li>Dini törenler</li>
        <li>Toplumsal kutlamalar</li>
        <li>Hikaye anlatımı</li>
        <li>İletişim aracı</li>
      </ul>
    `,
    author: "Ece Kaya",
    publishedDate: "2023-11-15",
    readTime: "7 dk",
    category: "Kültür",
    tags: ["kültür", "dünya", "müzik", "toplum"],
    image: "/blogexample.jpg"
  }
];

export function getRecentPosts(limit?: number): BlogPost[] {
  const sorted = [...blogPosts].sort((a, b) => 
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category === category);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getCategories(): string[] {
  return [...new Set(blogPosts.map(post => post.category))];
}

export function searchPosts(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}
