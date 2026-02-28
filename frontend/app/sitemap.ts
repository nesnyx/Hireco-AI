import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hireco.nadinata.org'

  // 1. Halaman Statis (Halaman utama, about, kontak, dll)
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // 2. Halaman Dinamis (Contoh: Daftar Lowongan Kerja/Profil)
  // Kamu bisa fetch data dari API atau DB kamu di sini
  /*
  const jobs = await fetch('https://api.nadinata.org/jobs').then(res => res.json())
  const dynamicRoutes = jobs.map((job: any) => ({
    url: `${baseUrl}/jobs/${job.slug}`,
    lastModified: new Date(job.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  */

  return [
    ...staticRoutes,
    // ...dynamicRoutes // Buka comment ini jika sudah ada data dinamis
  ]
}