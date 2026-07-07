#!/usr/bin/env node
/**
 * Generate localized landing pages for metronome-bpm.app
 * Usage: node scripts/build-locale-pages.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const METADATA_PATH = path.join(ROOT, '../clarify/locales/appStoreMetadata-metronome.json');
const PHRASES_PATH = path.join(ROOT, 'locales/landing-phrases.json');
const TEMPLATE_PATH = path.join(ROOT, 'index.html');
const APP_ID = '6755417459';
const APP_SLUG = 'metronome-pro-tempo-bpm';
const BASE_URL = 'https://metronome-bpm.app';

const LOCALE_CONFIG = {
  de: { dir: 'de', hreflang: 'de', label: 'DE' },
  fr: { dir: 'fr', hreflang: 'fr', label: 'FR' },
  es: { dir: 'es', hreflang: 'es', label: 'ES' },
  ru: { dir: 'ru', hreflang: 'ru', label: 'RU' },
  pl: { dir: 'pl', hreflang: 'pl', label: 'PL' },
  ja: { dir: 'ja', hreflang: 'ja', label: 'JA' },
  'pt-BR': { dir: 'pt', hreflang: 'pt-BR', label: 'PT' },
  'zh-Hans': { dir: 'zh', hreflang: 'zh-Hans', label: 'ZH' },
  ko: { dir: 'ko', hreflang: 'ko', label: 'KO' },
  it: { dir: 'it', hreflang: 'it', label: 'IT' },
  nl: { dir: 'nl', hreflang: 'nl', label: 'NL' },
  tr: { dir: 'tr', hreflang: 'tr', label: 'TR' },
  uk: { dir: 'uk', hreflang: 'uk', label: 'UK' },
  ar: { dir: 'ar', hreflang: 'ar', label: 'AR' },
  sv: { dir: 'sv', hreflang: 'sv', label: 'SV' },
  'zh-Hant': { dir: 'zh-tw', hreflang: 'zh-Hant', label: 'TW' },
  'pt-PT': { dir: 'pt-pt', hreflang: 'pt-PT', label: 'PT-PT' },
  vi: { dir: 'vi', hreflang: 'vi', label: 'VI' },
  id: { dir: 'id', hreflang: 'id', label: 'ID' },
  th: { dir: 'th', hreflang: 'th', label: 'TH' },
  cs: { dir: 'cs', hreflang: 'cs', label: 'CS' },
  da: { dir: 'da', hreflang: 'da', label: 'DA' },
  nb: { dir: 'nb', hreflang: 'nb', label: 'NB' },
  fi: { dir: 'fi', hreflang: 'fi', label: 'FI' },
  he: { dir: 'he', hreflang: 'he', label: 'HE' },
  ca: { dir: 'ca', hreflang: 'ca', label: 'CA' },
  hr: { dir: 'hr', hreflang: 'hr', label: 'HR' },
  el: { dir: 'el', hreflang: 'el', label: 'EL' },
  hi: { dir: 'hi', hreflang: 'hi', label: 'HI' },
  hu: { dir: 'hu', hreflang: 'hu', label: 'HU' },
  ms: { dir: 'ms', hreflang: 'ms', label: 'MS' },
  'es-MX': { dir: 'es-mx', hreflang: 'es-MX', label: 'ES-MX' },
  ro: { dir: 'ro', hreflang: 'ro', label: 'RO' },
  sk: { dir: 'sk', hreflang: 'sk', label: 'SK' },
  'fr-CA': { dir: 'fr-ca', hreflang: 'fr-CA', label: 'FR-CA' },
};

const LOCALES = Object.keys(LOCALE_CONFIG);
const ALL_LOCALES = [
  { code: 'en', hreflang: 'en', path: '/', label: 'EN' },
  ...LOCALES.map((code) => ({
    code,
    hreflang: LOCALE_CONFIG[code].hreflang,
    path: `/${LOCALE_CONFIG[code].dir}/`,
    label: LOCALE_CONFIG[code].label,
  })),
];

const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf8'));
const phrases = JSON.parse(fs.readFileSync(PHRASES_PATH, 'utf8'));
let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

function appStoreUrl(country) {
  return `https://apps.apple.com/${country}/app/${APP_SLUG}/id${APP_ID}`;
}

function escapeJson(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
}

function stripHtml(str) {
  return str.replace(/<[^>]*>/g, '');
}

function normalizeDashes(str) {
  return str.replace(/[—–]/g, '-');
}

function spaceBefore(text) {
  if (!text) return '';
  return text.startsWith(' ') ? text : ` ${text}`;
}

function spaceAfter(text) {
  if (!text) return '';
  return text.endsWith(' ') ? text : `${text} `;
}

function appLink(storeUrl, appName) {
  return `<a href="${storeUrl}" class="app-store-link" target="_blank" rel="noopener noreferrer">${appName}</a>`;
}

function linkedText(before, appName, after, storeUrl) {
  return `${spaceAfter(before)}${appLink(storeUrl, appName)}${spaceBefore(after)}`;
}

function hreflangBlock() {
  const lines = ALL_LOCALES.map(
    ({ hreflang, path: p }) =>
      `    <link rel="alternate" hreflang="${hreflang}" href="${BASE_URL}${p === '/' ? '/' : p}">`,
  );
  lines.push(`    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/">`);
  return lines.join('\n');
}

function localeRedirectScript() {
  const routeEntries = ALL_LOCALES.filter(({ path: p }) => p !== '/').flatMap(({ path: p }) => {
    const dir = p.replace(/\//g, '');
    const entries = [[dir, p]];
    if (dir === 'pt') entries.push(['pt-br', p]);
    if (dir === 'zh') entries.push(['zh-cn', p], ['zh-hans', p]);
    if (dir === 'zh-tw') entries.push(['zh-hant', p], ['zh-hk', p], ['zh-tw', p]);
    if (dir === 'pt-pt') entries.push(['pt-pt', p]);
    if (dir === 'uk') entries.push(['ua', p]);
    if (dir === 'nb') entries.push(['no', p], ['nn', p]);
    if (dir === 'es-mx') entries.push(['es-mx', p]);
    if (dir === 'fr-ca') entries.push(['fr-ca', p]);
    return entries;
  });
  const routesJson = JSON.stringify(Object.fromEntries(routeEntries));
  return `    <script>
        (function () {
            var routes = ${routesJson};
            var path = window.location.pathname;
            if (path !== '/' && path !== '/index.html') return;

            var langs = navigator.languages || [navigator.language || 'en'];
            var primary = (langs[0] || 'en').toLowerCase();
            if (primary === 'en' || primary.indexOf('en-') === 0) return;

            var tag = primary;
            var base = primary.split('-')[0];
            if (routes[tag]) { window.location.replace(routes[tag]); return; }
            if (routes[base]) { window.location.replace(routes[base]); return; }
        })();
    </script>`;
}

function langSwitcherScript() {
  return `    <script>
        (function () {
            var select = document.getElementById('lang-select');
            if (!select) return;
            select.addEventListener('change', function () {
                if (!this.value) return;
                window.location.href = this.value;
            });
        })();
    </script>`;
}

function langSwitcher(currentCode, label = 'Language') {
  const options = ALL_LOCALES.map(({ code, path: p, label: localeLabel }) => {
    const selected = code === currentCode ? ' selected' : '';
    return `<option value="${p}"${selected}>${localeLabel}</option>`;
  }).join('\n                        ');
  return `                <div class="footer-lang">
                    <label for="lang-select" class="footer-lang-label">${label}</label>
                    <select id="lang-select" class="lang-select" aria-label="${label}">
                        ${options}
                    </select>
                </div>`;
}

const FOOTER_LANG_CSS = `
        .footer-lang {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            justify-self: center;
            margin: 0;
            flex-shrink: 0;
            white-space: nowrap;
        }
        .footer-lang-label {
            color: rgba(255, 255, 255, 0.55);
            font-size: 0.8125rem;
            line-height: 1;
            margin: 0;
        }
        .lang-select {
            appearance: none;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            color: #fff;
            font-size: 0.8125rem;
            line-height: 1.25;
            height: 32px;
            margin: 0;
            padding: 0 32px 0 10px;
            cursor: pointer;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 10px center;
        }
        .lang-select:focus {
            outline: 2px solid rgba(255, 255, 255, 0.25);
            outline-offset: 2px;
        }
        .footer-content {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            gap: 16px;
        }
        .footer-logo {
            justify-self: start;
        }
        .footer-links {
            justify-self: end;
        }
        @media (max-width: 768px) {
            .footer-content {
                grid-template-columns: 1fr;
                justify-items: center;
                text-align: center;
            }
            .footer-logo,
            .footer-links {
                justify-self: center;
            }
        }
`;

function localeDir(code) {
  return LOCALE_CONFIG[code].dir;
}

function buildFaqSchema(faqPairs) {
  const entities = faqPairs.map(([q, a]) => ({
    '@type': 'Question',
    name: stripHtml(q),
    acceptedAnswer: {
      '@type': 'Answer',
      text: stripHtml(a),
    },
  }));
  return `    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": ${JSON.stringify(entities, null, 12).replace(/\n/g, '\n        ')}
    }
    </script>`;
}

function buildLocalePage(code) {
  const o = phrases[code];
  const m = metadata[code];
  if (!o || !m) {
    throw new Error(`Missing phrases or metadata for locale: ${code}`);
  }
  const features = [1, 2, 3, 4, 5, 6].map((i) => ({
    title: o[`feature${i}Title`],
    desc: o[`feature${i}Desc`],
  }));
  const appName = m.name;
  const storeUrl = appStoreUrl(o.appStoreCountry);
  const dir = localeDir(code);
  const pageUrl = `${BASE_URL}/${dir}/`;
  const keywords = m.keywords.replace(/,/g, ', ');

  let html = template;

  html = html.replace(/href="assets\//g, 'href="../assets/');
  html = html.replace(/src="assets\//g, 'src="../assets/');

  const htmlAttrs = o.htmlDir
    ? `lang="${o.htmlLang}" dir="${o.htmlDir}"`
    : `lang="${o.htmlLang}"`;
  html = html.replace(/<html lang="en">/, `<html ${htmlAttrs}>`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${o.metaTitle}</title>`);
  html = html.replace(
    /<meta name="title" content="[^"]*">/,
    `<meta name="title" content="${o.metaTitle}">`,
  );
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${o.metaDescription}">`,
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${o.metaDescription}">`,
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${o.metaDescription}">`,
  );
  html = html.replace(
    /<meta name="twitter:url" content="[^"]*">/,
    `<meta name="twitter:url" content="${pageUrl}">`,
  );
  html = html.replace(
    /<meta name="keywords" content="[^"]*">/,
    `<meta name="keywords" content="${keywords}">`,
  );
  html = html.replace(
    /<meta name="language" content="[^"]*">/,
    `<meta name="language" content="${m.localeName}">`,
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${pageUrl}">`,
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*">/,
    `<meta property="og:url" content="${pageUrl}">`,
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${o.metaTitle}">`,
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${o.metaTitle}">`,
  );
  html = html.replace(
    /<meta property="og:locale" content="[^"]*">/,
    `<meta property="og:locale" content="${o.ogLocale}">`,
  );
  html = html.replace(
    /https:\/\/metronome-bpm\.app\/assets\//g,
    `${BASE_URL}/assets/`,
  );
  html = html.replace(
    /https:\/\/apps\.apple\.com\/us\/app\/metronome-pro-tempo-bpm\/id6755417459/g,
    storeUrl,
  );

  if (!html.includes('hreflang="de"')) {
    html = html.replace('</head>', `${hreflangBlock()}\n</head>`);
  } else {
    html = html.replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?/g, '');
    html = html.replace('</head>', `${hreflangBlock()}\n</head>`);
  }
  html = html.replace(/\s*<script>\s*\(function \(\) \{\s*var (supported|routes)[\s\S]*?<\/script>\s*/g, '\n');

  const inLanguage = o.htmlLang === 'zh' ? 'zh-CN' : o.htmlLang === 'zh-tw' ? 'zh-TW' : `${o.htmlLang}`;
  html = html.replace(/"inLanguage": "en-US"/, `"inLanguage": "${inLanguage}"`);
  html = html.replace(/"url": "https:\/\/metronome-bpm\.app\/"/g, `"url": "${pageUrl}"`);
  html = html.replace(
    /"name": "Metronome Pro - Tempo BPM"/,
    `"name": "${escapeJson(appName)}"`,
  );
  html = html.replace(
    /"description": "Metronome app for iPhone with precise BPM control, tap tempo, time signatures, subdivisions, and preset saving\. Built for musicians who want speed, accuracy, and zero distractions\."/,
    `"description": "${escapeJson(o.metaDescription)}"`,
  );

  const featureListJson = features.map((f) => `"${escapeJson(f.title)}"`).join(',\n            ');
  html = html.replace(
    /"featureList": \[[\s\S]*?\]/,
    `"featureList": [\n            ${featureListJson}\n        ]`,
  );

  html = html.replace(
    /"downloadUrl": "https:\/\/apps\.apple\.com\/[^"]*"/,
    `"downloadUrl": "${storeUrl}"`,
  );
  html = html.replace(
    /"installUrl": "https:\/\/apps\.apple\.com\/[^"]*"/,
    `"installUrl": "${storeUrl}"`,
  );

  html = html.replace(/<p class="app-slogan">[^<]*<\/p>/, `<p class="app-slogan">${o.heroSlogan}</p>`);
  html = html.replace(
    /<h1 class="app-title">[\s\S]*?<\/h1>/,
    `<h1 class="app-title">${o.heroH1Before}<span class="highlight-tempo">${o.heroH1Highlight}</span>${o.heroH1After}</h1>`,
  );
  html = html.replace(/<p class="app-tagline">[\s\S]*?<\/p>/, `<p class="app-tagline">${o.heroTagline}</p>`);

  html = html.replace(
    /<span class="title-line">Precise timing,<\/span>\s*<span class="title-line title-accent">zero distractions<\/span>/,
    `<span class="title-line">${o.sectionFeaturesLine1}</span>\n                    <span class="title-line title-accent">${o.sectionFeaturesLine2}</span>`,
  );
  html = html.replace(
    /<p class="section-subtitle">Everything you need for perfect timing\. From simple practice to complex rhythm training, all in one clean app\.<\/p>/,
    `<p class="section-subtitle">${o.sectionFeaturesSubtitle}</p>`,
  );

  const featureCards = [...html.matchAll(/<h3 class="feature-title">[^<]*<\/h3>\s*<p class="feature-description">[^<]*<\/p>/g)];
  featureCards.forEach((match, i) => {
    if (!features[i]) return;
    const replacement = `<h3 class="feature-title">${features[i].title}</h3>\n                    <p class="feature-description">${features[i].desc}</p>`;
    html = html.replace(match[0], replacement);
  });

  html = html.replace(/<h2 class="section-title">Screenshots<\/h2>/, `<h2 class="section-title">${o.sectionScreenshotsTitle}</h2>`);
  html = html.replace(
    /<p class="section-subtitle">Clean, modern interface built for musicians<\/p>/,
    `<p class="section-subtitle">${o.sectionScreenshotsSubtitle}</p>`,
  );

  html = html.replace(
    /<h2 class="section-title">What Is a <span class="title-accent">Metronome App<\/span>\?<\/h2>/,
    `<h2 class="section-title">${o.sectionAboutTitle}<span class="title-accent">${o.sectionAboutTitleAccent}</span>${o.sectionAboutTitleEnd}</h2>`,
  );
  html = html.replace(
    /<p class="section-subtitle about-copy">[\s\S]*?<\/p>/,
    `<p class="section-subtitle about-copy">${linkedText(o.sectionAboutCopy, appName, o.sectionAboutCopyAfter, storeUrl)}</p>`,
  );

  html = html.replace(
    /<h2 class="section-title">Metronome App <span class="title-accent">FAQ<\/span><\/h2>/,
    `<h2 class="section-title">${o.faqTitle}<span class="title-accent">${o.faqTitleAccent}</span></h2>`,
  );
  html = html.replace(
    /<p class="section-subtitle">Common questions about our metronome app for iPhone<\/p>/,
    `<p class="section-subtitle">${o.faqSubtitle}</p>`,
  );

  const faqPairs = [
    [o.faq1Q, linkedText(o.faq1A, appName, o.faq1AAfter, storeUrl)],
    [o.faq2Q, o.faq2A],
    [o.faq3Q, o.faq3A],
    [o.faq4Q, o.faq4A],
    [o.faq5Q, o.faq5A],
    [o.faq6Q, o.faq6A],
  ];
  const faqBlocks = [...html.matchAll(/<span class="faq-question-text">[^<]*<\/span>[\s\S]*?<p class="faq-answer">[\s\S]*?<\/p>/g)];
  faqBlocks.forEach((match, i) => {
    if (!faqPairs[i]) return;
    const [q, a] = faqPairs[i];
    html = html.replace(
      match[0],
      `<span class="faq-question-text">${q}</span>\n                        <svg class="faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>\n                    </summary>\n                    <div class="faq-answer-wrap">\n                        <p class="faq-answer">${a}</p>`,
    );
  });

  html = html.replace(
    /<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/,
    buildFaqSchema(faqPairs),
  );

  html = html.replace(/<h2 class="cta-title">[^<]*<\/h2>/, `<h2 class="cta-title">${o.ctaTitle}</h2>`);
  html = html.replace(
    /<p class="cta-description">[\s\S]*?<\/p>/,
    `<p class="cta-description">${linkedText(o.ctaDescription, appName, o.ctaDescriptionAfter, storeUrl)}</p>`,
  );

  html = html.replace(/<span>Download on the App Store<\/span>/g, `<span>${o.downloadAppStore}</span>`);
  html = html.replace(/<span class="btn-free">Free<\/span>/g, `<span class="btn-free">${o.free}</span>`);
  html = html.replace(/aria-label="Download on the App Store"/g, `aria-label="${o.downloadAppStore}"`);
  html = html.replace(/aria-label="Download Metronome Pro - Tempo BPM on the App Store"/g, `aria-label="${o.downloadAppStore}"`);

  html = html.replace(/<span class="logo-text">Metronome Pro - Tempo BPM<\/span>/, `<span class="logo-text">${appName}</span>`);
  html = html.replace(/>Privacy<\/a>/, `>${o.privacy}</a>`);
  html = html.replace(/>Terms<\/a>/, `>${o.terms}</a>`);
  html = html.replace(/>Support<\/a>/, `>${o.support}</a>`);
  html = html.replace(/>Contact<\/a>/, `>${o.contact}</a>`);

  html = html.replace(/<div class="footer-lang"[^>]*>[\s\S]*?<\/div>\s*/g, '');
  html = html.replace(
    /<div class="footer-links">/,
    `${langSwitcher(code, o.langSwitcherLabel || 'Language')}\n                <div class="footer-links">`,
  );

  html = html.replace(/\s*<script>\s*\(function \(\) \{\s*var select = document\.getElementById\('lang-select'\)[\s\S]*?<\/script>\s*/g, '\n');
  html = html.replace('</body>', `${langSwitcherScript()}\n</body>`);

  return normalizeDashes(html);
}

function updateEnglishIndex() {
  let html = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  html = html.replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?/g, '');
  html = html.replace(/\s*<script>\s*\(function \(\) \{\s*var (supported|routes)[\s\S]*?<\/script>\s*/g, '\n');
  html = html.replace('</head>', `${hreflangBlock()}\n${localeRedirectScript()}\n</head>`);
  html = html.replace(/<div class="footer-lang"[^>]*>[\s\S]*?<\/div>\s*/g, '');
  html = html.replace(
    /<div class="footer-links">/,
    `${langSwitcher('en')}\n                <div class="footer-links">`,
  );
  if (!html.includes('.footer-lang {')) {
    html = html.replace('</style>', `${FOOTER_LANG_CSS}    </style>`);
  } else {
    html = html.replace(
      /\.footer-lang \{[\s\S]*?\.lang-select:focus \{[\s\S]*?\}\s*/g,
      `${FOOTER_LANG_CSS.trim()}\n`,
    );
  }
  html = html.replace(/\s*<script>\s*\(function \(\) \{\s*var select = document\.getElementById\('lang-select'\)[\s\S]*?<\/script>\s*/g, '\n');
  html = html.replace('</body>', `${langSwitcherScript()}\n</body>`);
  fs.writeFileSync(TEMPLATE_PATH, normalizeDashes(html));
}

function updateSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = ALL_LOCALES.map(
    ({ code, path: p }) => {
      const alternates = ALL_LOCALES.map(
        ({ hreflang, path: altPath }) =>
          `        <xhtml:link rel="alternate" hreflang="${hreflang}" href="${BASE_URL}${altPath === '/' ? '/' : altPath}"/>`,
      ).join('\n');
      alternates.concat(`        <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/"/>`);
      const altLinks = [
        ...ALL_LOCALES.map(
          ({ hreflang, path: altPath }) =>
            `        <xhtml:link rel="alternate" hreflang="${hreflang}" href="${BASE_URL}${altPath === '/' ? '/' : altPath}"/>`,
        ),
        `        <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/"/>`,
      ].join('\n');
      return `    <url>
        <loc>${BASE_URL}${p === '/' ? '/' : p}</loc>
${altLinks}
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${p === '/' ? '1.0' : '0.9'}</priority>
    </url>`;
    },
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
}

updateEnglishIndex();
template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

for (const code of LOCALES) {
  const outDir = path.join(ROOT, localeDir(code));
  fs.mkdirSync(outDir, { recursive: true });
  const html = buildLocalePage(code);
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log(`Built ${localeDir(code)}/index.html (${code})`);
}

updateSitemap();
console.log('Updated sitemap.xml');
