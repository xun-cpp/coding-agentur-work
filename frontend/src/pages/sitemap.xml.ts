import type { APIRoute } from 'astro';
import { services, site } from '../config/site';
import { locations } from '../config/locations';

type Entry = { path: string; priority: string; changefreq: string };

const staticEntries: Entry[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/leistungen/', priority: '0.9', changefreq: 'monthly' },
  { path: '/webdesign/', priority: '0.9', changefreq: 'monthly' },
  { path: '/ueber-uns/', priority: '0.8', changefreq: 'monthly' },
  { path: '/kontakt/', priority: '0.9', changefreq: 'monthly' },
  { path: '/service/', priority: '0.6', changefreq: 'yearly' },
  { path: '/security/', priority: '0.5', changefreq: 'yearly' },
];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const entries: Entry[] = [
    ...staticEntries,
    ...services.map((service) => ({ path: `/${service.slug}/`, priority: '0.9', changefreq: 'monthly' })),
    ...locations.map((location) => ({ path: `/webdesign/${location.slug}/`, priority: '0.8', changefreq: 'monthly' })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => `  <url><loc>https://${site.domain}${entry.path}</loc><lastmod>${lastmod}</lastmod><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`).join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
