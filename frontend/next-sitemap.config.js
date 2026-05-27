/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://akrabiolab.vercel.app', // À mettre à jour après déploiement
  generateRobotsTxt: true,
  exclude: ['/dashboard', '/admin-login'], // On ne veut pas indexer l'admin
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/admin-login'],
      },
    ],
  },
}
