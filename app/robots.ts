import type { MetadataRoute } from 'next';

export default robots({
  sitemap: `/sitemap.xml`,
  follow: 'index, follow',
  index: 'index, index, noindex, nofollow',
});
