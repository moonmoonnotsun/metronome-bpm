#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const APP_METADATA_PATH = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  '../../clarify/locales/appStoreMetadata-metronome.json',
);
const REFERENCE_PHRASES_PATH = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  '../../study-flashcards/locales/landing-phrases.json',
);
const OUTPUT_PATH = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  '../locales/landing-phrases.json',
);

const LOCALES = [
  'de', 'fr', 'es', 'ru', 'pl', 'ja', 'pt-BR', 'zh-Hans', 'ko', 'it', 'nl', 'tr', 'uk',
  'ar', 'sv', 'zh-Hant', 'pt-PT', 'vi', 'id', 'th', 'cs', 'da', 'nb', 'fi', 'he', 'ca',
  'hr', 'el', 'hi', 'hu', 'ms', 'es-MX', 'ro', 'sk', 'fr-CA',
];

const APP_STORE_COUNTRY = {
  de: 'de', fr: 'fr', es: 'es', ru: 'ru', pl: 'pl', ja: 'jp', 'pt-BR': 'br',
  'zh-Hans': 'cn', ko: 'kr', it: 'it', nl: 'nl', tr: 'tr', uk: 'ua', ar: 'sa', sv: 'se',
  'zh-Hant': 'tw', 'pt-PT': 'pt', vi: 'vn', id: 'id', th: 'th', cs: 'cz', da: 'dk',
  nb: 'no', fi: 'fi', he: 'il', ca: 'es', hr: 'hr', el: 'gr', hi: 'in', hu: 'hu',
  ms: 'my', 'es-MX': 'mx', ro: 'ro', sk: 'sk', 'fr-CA': 'ca',
};

const OG_LOCALE = {
  de: 'de_DE', fr: 'fr_FR', es: 'es_ES', ru: 'ru_RU', pl: 'pl_PL', ja: 'ja_JP',
  'pt-BR': 'pt_BR', 'zh-Hans': 'zh_CN', ko: 'ko_KR', it: 'it_IT', nl: 'nl_NL',
  tr: 'tr_TR', uk: 'uk_UA', ar: 'ar_SA', sv: 'sv_SE', 'zh-Hant': 'zh_TW',
  'pt-PT': 'pt_PT', vi: 'vi_VN', id: 'id_ID', th: 'th_TH', cs: 'cs_CZ', da: 'da_DK',
  nb: 'nb_NO', fi: 'fi_FI', he: 'he_IL', ca: 'ca_ES', hr: 'hr_HR', el: 'el_GR',
  hi: 'hi_IN', hu: 'hu_HU', ms: 'ms_MY', 'es-MX': 'es_MX', ro: 'ro_RO', sk: 'sk_SK',
  'fr-CA': 'fr_CA',
};

const HTML_LANG = {
  de: 'de', fr: 'fr', es: 'es', ru: 'ru', pl: 'pl', ja: 'ja', 'pt-BR': 'pt-BR',
  'zh-Hans': 'zh-CN', ko: 'ko', it: 'it', nl: 'nl', tr: 'tr', uk: 'uk', ar: 'ar',
  sv: 'sv', 'zh-Hant': 'zh-TW', 'pt-PT': 'pt-PT', vi: 'vi', id: 'id', th: 'th',
  cs: 'cs', da: 'da', nb: 'nb', fi: 'fi', he: 'he', ca: 'ca', hr: 'hr', el: 'el',
  hi: 'hi', hu: 'hu', ms: 'ms', 'es-MX': 'es-MX', ro: 'ro', sk: 'sk', 'fr-CA': 'fr-CA',
};

const TRANSLATE_TARGET = {
  'pt-BR': 'pt', 'pt-PT': 'pt', 'es-MX': 'es', 'fr-CA': 'fr',
  'zh-Hans': 'zh-CN', 'zh-Hant': 'zh-TW', nb: 'no',
};

const CTA_DOWNLOAD = {
  de: 'Lade ', fr: 'Téléchargez ', es: 'Descarga ', ru: 'Скачайте ', pl: 'Pobierz ',
  ja: '', 'pt-BR': 'Baixe ', 'zh-Hans': '', ko: '', it: 'Scarica ', nl: 'Download ',
  tr: '', uk: 'Завантажте ', ar: 'حمّل ', sv: 'Hämta ', 'zh-Hant': '', 'pt-PT': 'Transfira ',
  vi: 'Tải ', id: 'Unduh ', th: 'ดาวน์โหลด ', cs: 'Stáhněte ', da: 'Hent ', nb: 'Last ned ',
  fi: 'Lataa ', he: 'הורידו ', ca: 'Descarrega ', hr: 'Preuzmite ', el: 'Κατεβάστε ',
  hi: '', hu: 'Töltsd le ', ms: 'Muat turun ', 'es-MX': 'Descarga ', ro: 'Descarcă ',
  sk: 'Stiahnite ', 'fr-CA': 'Téléchargez ',
};

const CTA_AFTER_PATCH = {
  ja: ' をiPhoneでダウンロード - 練習とライブで正確なテンポを。',
  'zh-Hans': ' 在 iPhone 上下载 - 练习和演出所需的精准节拍。',
  ko: '을 iPhone에서 다운로드하세요 - 연습과 공연을 위한 정확한 BPM.',
  tr: "'ı iPhone'da indirin - çalışma ve sahne için doğru tempo.",
  hi: ' को iPhone पर डाउनलोड करें - अभ्यास और प्रदर्शन के लिए सटीक BPM.',
  'zh-Hant': ' 在 iPhone 上下載 - 練習和演出所需的精準節拍。',
};

const CURATED_OVERRIDES = {
  ru: {
    metaTitle: 'Метроном для iPhone - Tempo BPM | Бесплатное приложение',
    metaDescription:
      'Метроном для iPhone - точный BPM, tap tempo, размеры и субделения. Бесплатное приложение для репетиций и тренировки ритма.',
    heroSlogan: 'Метроном для iPhone',
    heroH1Before: 'Метроном для ',
    heroH1Highlight: 'музыкантов',
    heroTagline:
      'Простой современный метроном для музыкантов: быстрый BPM, tap tempo и удобные настройки без лишнего.',
    sectionFeaturesLine1: 'Точный ритм,',
    sectionFeaturesLine2: 'без отвлечений',
    sectionFeaturesSubtitle:
      'Всё для точного ритма - от простых упражнений до сложной тренировки в одном приложении.',
    sectionAboutTitle: 'Что такое ',
    sectionAboutTitleAccent: 'метроном',
    sectionAboutCopyAfter:
      ' - метроном BPM для iPhone: tap tempo, размеры, субделения, пресеты и понятный интерфейс.',
    sectionScreenshotsTitle: 'Скриншоты',
    sectionScreenshotsSubtitle: 'Простой интерфейс для музыкантов',
    sectionAboutCopy:
      'Метроном задаёт ровный темп, пока вы играете гаммы, песни или упражнения. ',
    faqTitle: 'Метроном ',
    faqTitleAccent: 'FAQ',
    faqSubtitle: 'Ответы на частые вопросы о метрономе для iPhone',
    faq3Q: 'Есть ли tap tempo?',
    faq3A: 'Да. Отбивайте ритм - приложение сразу выставит BPM.',
    faq6A:
      'Метроном BPM совмещает настройку темпа и звуковой отсчёт. Это приложение делает и то, и другое.',
    feature2Title: 'Tap tempo',
    feature2Desc: 'Отбивайте ритм - приложение сразу выставит BPM. Просто и точно.',
    ctaDescriptionAfter:
      ' на iPhone - метроном BPM для музыкантов, которым нужен точный темп в репетициях и на сцене.',
  },
  pl: {
    heroH1Before: 'Metronom dla ',
    heroH1Highlight: 'muzyków',
    sectionScreenshotsTitle: 'Zrzuty ekranu',
    sectionScreenshotsSubtitle: 'Prosty interfejs dla muzyków',
  },
  uk: {
    heroH1Before: 'Метроном для ',
    heroH1Highlight: 'музикантів',
    sectionScreenshotsTitle: 'Скріншоти',
    sectionScreenshotsSubtitle: 'Простий інтерфейс для музикантів',
    feature2Title: 'Tap tempo',
    faq3Q: 'Чи є tap tempo?',
    ctaDescriptionAfter:
      ' на iPhone - метроном BPM для музикантів, яким потрібен точний темп під час репетицій і виступів.',
  },
  cs: {
    heroH1Before: 'Metronom pro ',
    heroH1Highlight: 'hudebníky',
  },
  sk: {
    heroH1Before: 'Metronóm pre ',
    heroH1Highlight: 'hudobníkov',
  },
  hr: {
    heroH1Before: 'Metronom za ',
    heroH1Highlight: 'glazbenike',
  },
  hu: {
    heroH1Before: 'Metronóm ',
    heroH1Highlight: 'zenészeknek',
  },
};

const SOURCE_FIELDS = [
  'metaTitle', 'metaDescription', 'heroSlogan', 'heroH1Before', 'heroH1Highlight',
  'heroTagline', 'sectionFeaturesLine1', 'sectionFeaturesLine2', 'sectionFeaturesSubtitle',
  'sectionScreenshotsTitle', 'sectionScreenshotsSubtitle', 'sectionAboutTitle',
  'sectionAboutTitleAccent', 'sectionAboutCopy', 'sectionAboutCopyAfter', 'faqTitle',
  'faqTitleAccent', 'faqSubtitle', 'faq1Q', 'faq1A', 'faq1AAfter', 'faq2Q', 'faq2A',
  'faq3Q', 'faq3A', 'faq4Q', 'faq4A', 'faq5Q', 'faq5A', 'faq6Q', 'faq6A', 'ctaTitle',
  'ctaDescription', 'ctaDescriptionAfter', 'feature1Title', 'feature1Desc', 'feature2Title',
  'feature2Desc', 'feature3Title', 'feature3Desc', 'feature4Title', 'feature4Desc',
  'feature5Title', 'feature5Desc', 'feature6Title', 'feature6Desc',
];

function getMetadataName(metadata, locale) {
  return metadata[locale]?.name ?? metadata['en-US']?.name ?? 'Metronome Pro - Tempo BPM';
}

function buildEnglishTemplates() {
  return {
    metaTitle: 'Metronome App - Tempo BPM | Free Metronome for iPhone',
    metaDescription:
      'Metronome app for iPhone - precise BPM control, tap tempo, time signatures, and subdivisions. Free metronome for practice and rhythm training.',
    heroSlogan: 'Metronome App for iPhone',
    heroH1Before: 'Metronome app for ',
    heroH1Highlight: 'Musicians',
    heroTagline:
      'A clean, modern metronome for musicians who want speed, accuracy, and zero distractions. Fast BPM control with tap tempo and intuitive adjustments.',
    sectionFeaturesLine1: 'Precise timing,',
    sectionFeaturesLine2: 'zero distractions',
    sectionFeaturesSubtitle:
      'Everything you need for perfect timing. From simple practice to complex rhythm training, all in one clean app.',
    sectionScreenshotsTitle: 'Screenshots',
    sectionScreenshotsSubtitle: 'Clean, modern interface built for musicians',
    sectionAboutTitle: 'What Is a ',
    sectionAboutTitleAccent: 'Metronome App',
    sectionAboutCopy:
      'A metronome app keeps steady tempo while you practice scales, songs, or drills. ',
    sectionAboutCopyAfter:
      ' is a BPM metronome for iPhone - tap tempo, time signatures, subdivisions, presets, and a clean interface.',
    faqTitle: 'Metronome App ',
    faqTitleAccent: 'FAQ',
    faqSubtitle: 'Common questions about our metronome app for iPhone',
    faq1Q: 'What is a metronome app?',
    faq1A: 'A metronome app keeps steady tempo for practice and performance. ',
    faq1AAfter:
      ' gives you BPM control, tap tempo, time signatures, subdivisions, and presets on iPhone.',
    faq2Q: 'Is this metronome app free?',
    faq2A: 'Yes - free download on the App Store. Premium features are optional in-app purchases.',
    faq3Q: 'Does it have tap tempo?',
    faq3A: 'Yes. Tap along to any rhythm and the app sets the BPM instantly.',
    faq4Q: 'What time signatures are supported?',
    faq4A:
      '2/4, 3/4, 4/4, 5/4, 6/8, 7/8, 9/8, and 12/8 - plus subdivisions like quarter, eighth, triplet, and sixteenth notes.',
    faq5Q: 'Can I save presets?',
    faq5A: 'Yes. Save BPM, time signature, and subdivision combos for quick access during practice.',
    faq6Q: 'Metronome vs BPM app - same thing?',
    faq6A:
      'A BPM metronome app combines tempo control with a click track. This app covers both - precise BPM with a full metronome for iPhone.',
    ctaTitle: 'Download the metronome app',
    ctaDescription: 'Download ',
    ctaDescriptionAfter:
      ' on iPhone - the BPM metronome for musicians who need precise timing in practice and performance.',
    feature1Title: 'Precise BPM Control',
    feature1Desc:
      'Adjustable tempo with large, easy-to-read BPM display and intuitive +/- controls for any musical style.',
    feature2Title: 'Tap Tempo',
    feature2Desc:
      'Tap along to any rhythm and instantly set the perfect BPM. Easy to use, accurate results.',
    feature3Title: 'Time Signatures',
    feature3Desc:
      'Support for 2/4, 3/4, 4/4, 5/4, 6/8, 7/8, 9/8, and 12/8 to match any musical piece.',
    feature4Title: 'Subdivisions',
    feature4Desc:
      'Choose from Quarter, Eighth, Triplet, Sixteenth, and more. Perfect for complex rhythm practice.',
    feature5Title: 'Save Presets',
    feature5Desc:
      'Save your favorite BPM, time signature, and subdivision combinations for quick access during practice.',
    feature6Title: 'Visual and Audio',
    feature6Desc:
      'Clear visual beat indicators and crisp audio clicks. Perfect for both silent and audible practice.',
  };
}

async function translateText(text, locale) {
  const target = TRANSLATE_TARGET[locale] ?? locale;
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', target);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Translation failed (${response.status}) for ${locale}`);
  const data = await response.json();
  return data[0].map((chunk) => chunk[0]).join('');
}

function normalizeDashes(str) {
  return str.replace(/[—–]/g, '-');
}

function applyCurated(locale, item) {
  const overrides = CURATED_OVERRIDES[locale];
  if (overrides) Object.assign(item, overrides);
  for (const key of Object.keys(item)) {
    if (typeof item[key] === 'string') item[key] = normalizeDashes(item[key]);
  }
  return item;
}

function truncateAtWord(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim();
}

function normalizeLengths(item, appName) {
  if (item.metaTitle.length < 50) item.metaTitle = `${item.metaTitle} iPhone`;
  item.metaTitle = truncateAtWord(item.metaTitle, 65);
  if (item.metaDescription.length < 140) {
    item.metaDescription = `${item.metaDescription} ${appName}.`;
  }
  item.metaDescription = truncateAtWord(item.metaDescription, 160);
  return item;
}

async function main() {
  const [metadataRaw, referenceRaw] = await Promise.all([
    fs.readFile(APP_METADATA_PATH, 'utf8'),
    fs.readFile(REFERENCE_PHRASES_PATH, 'utf8'),
  ]);
  const metadata = JSON.parse(metadataRaw);
  const reference = JSON.parse(referenceRaw);
  const englishTemplates = buildEnglishTemplates();
  const output = {};

  for (const locale of LOCALES) {
    const appName = getMetadataName(metadata, locale);
    const englishValues = SOURCE_FIELDS.map((field) => englishTemplates[field]);
    const translatedValues = await Promise.all(
      englishValues.map((text) => translateText(text, locale)),
    );
    const translated = Object.fromEntries(
      SOURCE_FIELDS.map((field, i) => [field, translatedValues[i]]),
    );

    translated.sectionAboutCopy = `${translated.sectionAboutCopy.trimEnd()} `;
    if (CTA_DOWNLOAD[locale] !== undefined) translated.ctaDescription = CTA_DOWNLOAD[locale];
    if (CTA_AFTER_PATCH[locale]) translated.ctaDescriptionAfter = CTA_AFTER_PATCH[locale];

    const ref = reference[locale] ?? {};
    const item = {
      htmlLang: HTML_LANG[locale],
      ogLocale: OG_LOCALE[locale],
      appStoreCountry: APP_STORE_COUNTRY[locale],
      ...translated,
      heroH1After: '',
      sectionAboutTitleEnd: '?',
      downloadAppStore: ref.downloadAppStore ?? 'Download on the App Store',
      free: ref.free ?? 'Free',
      privacy: ref.privacy ?? 'Privacy',
      terms: ref.terms ?? 'Terms',
      support: ref.support ?? 'Support',
      contact: ref.contact ?? 'Contact',
      langSwitcherLabel: ref.langSwitcherLabel ?? 'Language',
    };

    if (locale === 'ar' || locale === 'he') item.htmlDir = 'rtl';
    output[locale] = normalizeLengths(applyCurated(locale, item), appName);
    console.log(`Generated ${locale}`);
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
