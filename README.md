# ABS Law Office - Optimized Static Site

Versi ini memecah file 1 halaman menjadi struktur production-ready tanpa mengubah desain visual utama:
- Tailwind tidak lagi memakai CDN runtime.
- CSS dan JS dipisah dan diminify.
- Font Google diself-host melalui package `@fontsource`.
- Font Awesome disajikan lokal dari npm, bukan CDN.
- Gambar bisa otomatis dikonversi ke WebP dan AVIF saat build.
- Siap deploy ke Vercel dengan output directory `dist`.

## Struktur

```txt
.
├── src/
│   ├── index.html
│   ├── css/input.css
│   └── js/main.js
├── public/
│   ├── assets/images/
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vercel.json
```

## Yang perlu Anda copy dari project lama

Copy folder gambar lama Anda ke:

```txt
public/assets/images/
```

Contoh hasilnya:

```txt
public/assets/images/logo.png
public/assets/images/team-andi.jpg
public/assets/images/activity-1/1.jpg
```

## Hero image

Kode lama memakai gambar Unsplash eksternal. Untuk performa terbaik, simpan gambar hero sebagai:

```txt
public/assets/images/hero.jpg
```

Anda bisa memakai gambar yang sama dari kode lama, lalu rename menjadi `hero.jpg`.

## Install

```bash
npm install
```

## Build lokal

```bash
npm run build
```

Hasil production ada di:

```txt
dist/
```

## Preview lokal

```bash
npm run preview
```

Buka URL yang muncul di terminal.

## Deploy ke Vercel

Di Vercel Project Settings:

```txt
Framework Preset: Other
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Atau deploy via CLI:

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

## Ganti domain SEO

Edit di `src/index.html`:

```html
<link rel="canonical" href="https://example.com/">
<meta property="og:image" content="https://example.com/assets/images/og-image.jpg">
<meta property="og:url" content="https://example.com/">
```

Edit juga:

```txt
public/robots.txt
public/sitemap.xml
```

ganti `https://example.com/` menjadi domain asli Anda.
