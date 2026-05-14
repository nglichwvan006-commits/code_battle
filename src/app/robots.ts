import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/character/'],
    },
    sitemap: 'https://codeadventurerpg.com/sitemap.xml',
  };
}
