export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface SupportItem {
  id: number;
  title: string;
  description: string;
  contact: string;
}

export const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Bandbul'da nasıl ilan verebilirim?",
    answer: "Bandbul'da ilan vermek için önce üye olmanız gerekmektedir. Üye olduktan sonra 'İlan Ver' butonuna tıklayarak ilanınızı oluşturabilirsiniz. İlanınızda kategori, başlık, açıklama ve iletişim bilgilerinizi belirtmeniz gerekmektedir."
  },
  {
    id: 2,
    question: "İlanımı nasıl düzenleyebilir veya silebilirim?",
    answer: "Profil sayfanızdan 'İlanlarım' bölümüne giderek ilanlarınızı görüntüleyebilir, düzenleyebilir veya silebilirsiniz. İlan düzenleme ve silme işlemleri sadece ilan sahibi tarafından yapılabilir."
  },
  {
    id: 3,
    question: "İlanlara nasıl başvurabilirim?",
    answer: "İlanlara başvurmak için ilan detay sayfasındaki 'İletişim' butonuna tıklayarak ilan sahibi ile iletişime geçebilirsiniz. Mesaj gönderebilir veya telefon numarası varsa arayabilirsiniz."
  },
  {
    id: 4,
    question: "Üyelik ücretli mi?",
    answer: "Bandbul'da temel üyelik ücretsizdir. Ancak premium özellikler ve gelişmiş ilan seçenekleri için ücretli paketler bulunmaktadır."
  },
  {
    id: 5,
    question: "Hesabımı nasıl silebilirim?",
    answer: "Hesabınızı silmek için destek birimi ile iletişime geçmeniz gerekmektedir. Hesap silme işlemi geri alınamaz ve tüm verileriniz kalıcı olarak silinir."
  },
  {
    id: 6,
    question: "İlan kuralları nelerdir?",
    answer: "İlanlarınızda uygun dil kullanmanız, doğru bilgi vermeniz ve yasalara uygun içerik paylaşmanız gerekmektedir. Detaylı kurallar için 'İlan Kuralları' sayfasını inceleyebilirsiniz."
  }
];

export const listingRulesData = {
  title: "İlan Kuralları",
  description: "Bandbul platformunda ilan verirken uymanız gereken kurallar ve yönergeler.",
  rules: [
    {
      id: 1,
      title: "Genel Kurallar",
      content: "Tüm ilanlar Türkçe dilinde yazılmalıdır. İlan içerikleri yasalara uygun olmalı ve uygunsuz içerik barındırmamalıdır. Spam, reklam veya yanıltıcı bilgi içeren ilanlar kaldırılır."
    },
    {
      id: 2,
      title: "İlan Kategorileri",
      content: "İlanlarınızı doğru kategoriye yerleştirmeniz gerekmektedir. Yanlış kategorilendirme yapılan ilanlar düzeltilir veya kaldırılabilir."
    },
    {
      id: 3,
      title: "İletişim Bilgileri",
      content: "İlanlarınızda doğru ve güncel iletişim bilgileri bulunmalıdır. Yanlış veya eksik bilgi veren ilanlar kaldırılabilir."
    },
    {
      id: 4,
      title: "Fiyat Bilgileri",
      content: "Fiyat bilgisi verilen ilanlarda net ve doğru fiyatlar belirtilmelidir. Gizli ücretler veya yanıltıcı fiyatlandırma yapılmamalıdır."
    },
    {
      id: 5,
      title: "İlan Güncelleme",
      content: "İlanlarınızı düzenli olarak güncellemeniz önerilir. Süresi dolmuş veya geçersiz ilanlar otomatik olarak kaldırılabilir."
    },
    {
      id: 6,
      title: "Yasaklı İçerikler",
      content: "Yasadışı faaliyetler, uygunsuz içerik, spam, reklam ve yanıltıcı bilgi içeren ilanlar kesinlikle yasaktır ve kaldırılır."
    }
  ]
};

export const supportData: SupportItem[] = [
  {
    id: 1,
    title: "Teknik Destek",
    description: "Platform kullanımı ile ilgili teknik sorunlarınız için destek alabilirsiniz.",
    contact: "teknik@bandbul.com"
  },
  {
    id: 2,
    title: "İlan Desteği",
    description: "İlan verme, düzenleme ve yönetimi ile ilgili sorularınız için destek alabilirsiniz.",
    contact: "ilan@bandbul.com"
  },
  {
    id: 3,
    title: "Üyelik Desteği",
    description: "Üyelik işlemleri, hesap yönetimi ve ödeme konularında destek alabilirsiniz.",
    contact: "uyelik@bandbul.com"
  },
  {
    id: 4,
    title: "Genel Destek",
    description: "Genel sorularınız ve önerileriniz için bizimle iletişime geçebilirsiniz.",
    contact: "destek@bandbul.com"
  }
];

export const privacyPolicyData = {
  title: "Gizlilik Sözleşmesi",
  content: `Kişisel Verilere İlişkin Bilgilendirme

İşbu Kişisel Veriler Bilgilendirme Metni ile yürürlükteki yasal mevzuata uygun olarak ve 6698 sayılı Kişisel Verilerin Korunması Kanunu ("Kanun") kapsamında "Veri Sorumlusu" sıfatıyla Bandbul Şirketi'ne ("Şirket") ait ve Şirket tarafından işletilen bandbul alan adlı internet sitesinin ve bu sitenin kullanması ile bağlantılı olarak ilgili hizmetlerin sunulabilmesi adına tarafınızca tarafımıza sağlanan verilerin toplanması, işlenmesi ve kullanım türü, derecesi ve amacı ile ilgili olarak siz kullanıcılarımıza bilgilendirme yapılması amaçlanmaktadır.

Kişisel verilerinizin, gizli bilgilerinizin korunmasını ve gizli tutulmasını ciddiye almaktayız. Kanun ve ilgili mevzuat hükümlerine tarafımızca, çalışanlarımızca ve servis sağlayıcılarımızca görevlerini yerlerine getirirlerken gizliliklerine mutlaka dikkat edilmesini ve yalnızca sizlere bildirdiğimiz amaçlarla kullanılmasını sağlamak üzere gerekli teknik ve idari önlemleri almaktayız.

İnternet sitemizin kullanılması aşamasında kendinizle iletişime geçilmesi kapsamında tarafımıza sağladığınız bilgileriniz, buna ek olarak internet sitemizde gezinmeniz sırasında çerezler ve benzeri yöntemler aracılığı tarafımızca elde edinilen bilgiler; bizim tarafımızdan, mevcut ve ilerideki iştiraklerimiz, bağlı şirketlerimiz, hissedarlarımız, iş ortaklarımız, haleflerimiz, hizmet ve faaliyetlerimiz ile yan hizmetlerimizi yürütmek üzere hizmet aldığımız, işbirliği yaptığımız, yurt içinde ve/veya yurtdışında faaliyet gösteren program ortağı kuruluşlar ve diğer üçüncü kişiler tarafından muhtelif mal ve hizmetlerin sağlanması, sağlanan mal ve hizmetlerin herhangi bir ücrete tabi olması halinde ödeme alınması için gerekli işlemlerin gerçekleştirilmesi, sunulan hizmetlere ilişkin sizlere yapacağımız her türlü bilgilendirme, özel kampanyalardan faydalanabilmenize ve sürpriz çekilişlere katılabilmenize imkan sağlama, sorularınıza yanıt verebilme, bilgilendirme amaçlı yapılacak elektronik iletişimler için, Şirketimiz ile aranızda sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili ve gerekli olması, Şirket'in yasal sorumluluğunu yerine getirebilmesi için zorunlu olması, kişisel veriye bağlı ilgili hakkın ileri sürülebilmesi veya savunmanın tesis edilmesi amaçlarıyla, belirtilenler ve halefleri nezdinde kullanılma amacı ile sınırlı olarak ve bu amaç ile orantılı süre ile kayda alınabilecek, basılı/manyetik arşivlerde saklanabilecek, gerekli görülen hallerde güncellenebilecek, paylaşılabilecek, aktarılabilecek, transfer edilebilecek, kullanılabilecek ve Kanun'un 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları dahilinde işlenebilecektir.

Paylaştığınız tüm bilgiler, her ne sebeple olursa olsun doğrudan veya dolaylı olarak üçüncü bir kişinin yararına kullanılmayacak; kullanıcının açık yazılı izni olmaksızın işbu metinde belirtilen amaçlar dışında herhangi bir üçüncü şahısla, firmayla veya kurumla paylaşılmayacak, kısmen veya tamamen kopyalanmayacak ve yayınlanmayacaktır.

Çerezler (Cookie)
İnternet sitemizde; IP adresi, kullanılan tarayıcı, bilgisayarınızdaki işletim sistemi, internet bağlantınız, site kullanımları hakkındaki bilgiler gibi belirli verileri otomatik olarak elde etmemize yardımcı olan çerezler (cookie) bulunmaktadır. Söz konusu çerezler bir internet sayfası sunucusu tarafından sabit sürücünüze iletilen küçük metin dosyalarıdır ve sitemizde bulunan çerezler, bilgisayarınız için zararlı sayılabilecek virüsler göndermek için kullanılmamaktadır.`
};

export const kvkkData = {
  title: "Kişisel Verilerin Korunması Kanunu (KVKK)",
  content: `Kişisel Verilerin Korunması Kanunu Kapsamında Bilgilendirme

6698 sayılı Kişisel Verilerin Korunması Kanunu ("Kanun") uyarınca, Bandbul Şirketi ("Şirket") olarak, kişisel verilerinizin işlenmesi konusunda aşağıdaki bilgilendirmeyi yapmaktayız:

1. Kişisel Verilerin İşlenme Amacı
Kişisel verileriniz, aşağıdaki amaçlarla işlenmektedir:
• Hizmetlerimizin sunulması ve geliştirilmesi
• Müşteri ilişkilerinin yönetimi
• Yasal yükümlülüklerin yerine getirilmesi
• İletişim faaliyetlerinin yürütülmesi
• Güvenliğin sağlanması

2. Kişisel Verilerin Aktarılması
Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda, aşağıdaki taraflara aktarılabilecektir:
• İş ortaklarımız
• Hizmet sağlayıcılarımız
• Yasal yükümlülükler gereği kamu kurum ve kuruluşları
• Yetkili mahkemeler ve icra müdürlükleri

3. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi
Kişisel verileriniz, aşağıdaki yöntemlerle toplanmaktadır:
• Web sitesi üzerinden form doldurulması
• Çerezler aracılığıyla otomatik toplama
• E-posta ve telefon yoluyla iletişim
• Sosyal medya platformları üzerinden

4. Kişisel Veri Sahibinin Hakları
Kanun'un 11. maddesi uyarınca, kişisel veri sahibi olarak aşağıdaki haklara sahipsiniz:
• Kişisel verilerinizin işlenip işlenmediğini öğrenme
• Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme
• Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme
• Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme
• Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme
• Kişisel verilerinizin işlenmesini gerektiren sebeplerin ortadan kalkması halinde kişisel verilerinizin silinmesini veya yok edilmesini isteme
• Kişisel verilerinizin aktarıldığı üçüncü kişilere yukarıda sayılan düzeltme, silme veya yok etme işlemlerinin bildirilmesini isteme
• İşlenen verilerinizin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme
• Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararınızın giderilmesini talep etme

5. Başvuru Hakkı
Yukarıda belirtilen haklarınızı kullanmak için, kimliğinizi tespit edebileceğimiz gerekli bilgiler ile birlikte yazılı olarak veya kayıtlı elektronik posta (KEP) adresi, güvenli elektronik imza, mobil imza ya da tarafınızdan Şirketimize daha önce bildirilen ve sistemimizde kayıtlı bulunan elektronik posta adresinizi kullanmak suretiyle başvurabilirsiniz.

6. İletişim
Kişisel verilerinizin işlenmesi ile ilgili her türlü soru ve talepleriniz için aşağıdaki iletişim kanallarından bize ulaşabilirsiniz:

E-posta: info@bandbul.com

Bu bilgilendirme metni, Kanun'un 10. maddesi gereğince hazırlanmış olup, kişisel verilerinizin işlenmesi konusunda sizleri bilgilendirmek amacıyla hazırlanmıştır.`
};
