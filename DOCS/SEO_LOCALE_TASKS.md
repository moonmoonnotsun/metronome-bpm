# Metronome locale tasks

Source: `locales/landing-phrases.json`. Every title already has BPM and the local word for metronome. Do not replace `节拍器`, `メトロノーム`, `метроном`, or `Máy đếm nhịp` with the English word `metronome`.

The builder ships FAQ 1, 5, and 6. FAQ 3 strings such as Chinese `有节奏吗？` and Arabic `هل لديها وتيرة الصنبور؟` are in the JSON and are not on the page. Fix them anyway, before a later template starts printing FAQ 3.

## Do once

1. Give es-MX its own block. It currently matches es in title, description, hero, and all six FAQs.
2. Give fr-CA its own block. It currently matches fr in every content field.
3. zh-Hans `faq3Q` is `有节奏吗？` and zh-Hant is `有節奏嗎？`. That asks "is there rhythm?". Write `有敲击测速吗？` and `有敲擊測速嗎？`.
4. Arabic `faq3Q`: replace `وتيرة الصنبور` with `إيقاع بالنقر`. `صنبور` is a faucet.

## Per locale

| Locale | Key | Now | Write |
|---|---|---|---|
| hu | `metaDescription` | `ütésenként percenként` | `ütés percenként`. The tagline on the same page already says that. BPM in the title stays. |
| el | `faq5A` | `Εξοικονομήστε συνδυασμούς BPM, υπογραφή χρόνου` | `Αποθηκεύστε συνδυασμούς BPM και μέτρου`. `Εξοικονομήστε` means save money. `υπογραφή χρόνου` is a calque of time signature. |
| fi | `metaDescription` and the same sentence in the tagline | `napauta tahti` | `napauta tahtia` |
| fi | `faqSubtitle` | `Androidn` | `Androidin` |
| pt-PT | `faqSubtitle`, `faq2Q` | `aplicativo metrônomo` | `aplicação de metrónomo`. The title spelling `Metrónomo` is already right. Do not copy the Brazilian FAQ. |
| ar | `faqTitle` or the heading source that renders `التعليمات` | `التعليمات` | `الأسئلة الشائعة` |
| es | leave the title | `Metrónomo - app BPM \| Gratis para iPhone y Android` | no keyword change |
| es-MX | `metaTitle`, `metaDescription`, hero, FAQ | identical to es | `Metrónomo - app BPM \| Gratis para iPhone y Android en México`. Rewrite the six FAQ answers in Mexican Spanish so they are not the same strings. |
| fr | leave the title | `Métronome - app BPM \| Gratuit pour iPhone et Android` | no keyword change |
| fr-CA | whole block | identical to fr | `Métronome - app BPM \| Gratuit pour iPhone et Android`. Change `faqSubtitle` to `Questions fréquentes sur notre métronome pour iPhone et Android` and use `toucher` where France says `taper`, if that pair exists. The two pages must not share description text. |
| zh-Hant | whole block | script convert of zh-Hans | Keep `節拍器` and `BPM`. Change `faqSubtitle` so it is not only a character conversion of the simplified page. |
| he | `faqSubtitle` | Android dropped | add `ולאנדרואיד` beside iPhone |
| it, ca, hi, ms, ro, vi, th | `faq5A` | a word-for-word "time signature" | use the music term: it `indicazione metrica`, ca `compàs`, hi `ताल`, ms `tanda masa`, ro `măsură`, vi `nhịp`, th `อัตราจังหวะ`. Keep BPM in the same sentence. |
| en, de, ru, ja, nl, da, id | none | copy is clean | no text change |

pt-PT title stays `Metrónomo - app BPM | Grátis para iPhone e Android`. Only the FAQ moves to European Portuguese.

Rebuild `hu/index.html` and `el/index.html`. The Hungarian description must say `ütés percenként`. The Greek FAQ must not say `Εξοικονομήστε`.
