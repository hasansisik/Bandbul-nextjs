/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://bandbul.com',
  generateRobotsTxt: true,
  exclude: [
    '/dashboard',
    '/dashboard/*',
    '/kayitol',
    '/sifremi-unuttum',
    '/yeni-sifre',
    '/dogrulama',
    '/profil-duzenle',
    '/mesajlar',
    '/bildirimler',
    '/giris'
 ],
  additionalPaths: async (config) => [
    { loc: '/profil', priority: 0.7, changefreq: 'daily', lastmod: new Date().toISOString() },
    // Diğer özel sayfalar eklenebilir
  ],
}