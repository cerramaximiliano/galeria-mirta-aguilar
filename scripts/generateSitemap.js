#!/usr/bin/env node

import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const SITE_URL = 'https://galeriamirtaaguilar.com';
const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5010/api';

// Páginas estáticas
const staticPages = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/biografia', changefreq: 'monthly', priority: 0.8 },
  { path: '/arte-digital', changefreq: 'weekly', priority: 0.9 },
  { path: '/contacto', changefreq: 'monthly', priority: 0.7 },
  { path: '/carrito', changefreq: 'monthly', priority: 0.6 },
];

// Función para obtener obras desde la API
async function fetchArtworks() {
  try {
    const response = await fetch(`${API_URL}/artworks?limit=1000`);
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data.map(artwork => ({
        path: `/obra/${artwork._id}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: artwork.updatedAt ? new Date(artwork.updatedAt).toISOString() : null
      }));
    }
  } catch (error) {
    console.error('Error fetching artworks:', error);
  }
  return [];
}

// Función para obtener arte digital desde la API
async function fetchDigitalArt() {
  try {
    const response = await fetch(`${API_URL}/digital-art?limit=1000`);
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data.map(artwork => ({
        path: `/arte-digital/${artwork._id}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: artwork.updatedAt ? new Date(artwork.updatedAt).toISOString() : null
      }));
    }
  } catch (error) {
    console.error('Error fetching digital art:', error);
  }
  return [];
}

// Generar XML del sitemap
function generateSitemapXML(pages) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;
  
  return xml;
}

// Función principal
async function generateSitemap() {
  console.log('🗺️  Generando sitemap...');
  
  // Obtener todas las páginas
  const artworks = await fetchArtworks();
  const digitalArt = await fetchDigitalArt();
  const allPages = [...staticPages, ...artworks, ...digitalArt];
  
  console.log(`📄 Total de páginas: ${allPages.length}`);
  console.log(`  - Páginas estáticas: ${staticPages.length}`);
  console.log(`  - Obras: ${artworks.length}`);
  console.log(`  - Arte digital: ${digitalArt.length}`);
  
  // Generar XML
  const xml = generateSitemapXML(allPages);
  
  // Guardar archivo
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outputPath, xml);
  
  console.log(`✅ Sitemap generado en: ${outputPath}`);
}

// Ejecutar
generateSitemap().catch(console.error);