# Elite Math New (patched)

This directory ships a patched copy of [Elite Math New](https://github.com/alanparmenter/Elite-Math-Font) by Alan Parmenter, licensed under GPL-3.0.

## Why patched

The upstream TTF (verified at commit HEAD on 2026-05-11, md5 `e861575b59385ca09f8585001b65288b`) has valid `cmap` entries for ~470 codepoints that point to **empty glyphs** — the glyphs have advance width but no outline data (`contours=0, bounds=None`). Browsers reserve the advance but draw nothing, so those characters render as blank gaps on the front end.

See [Linear THEME-147](https://linear.app/a8c/issue/THEME-147) (the apostrophe symptom that surfaced the bug) and [THEME-148](https://linear.app/a8c/issue/THEME-148) (the broader scope).

## What the patch does

`patch-elite-math-new.py` uses `fontTools` to copy outlines from working source glyphs into empty target slots, in two passes:

1. **Curly quotes** (THEME-147) — copy `quotesingle` (U+0027) into the empty `quoteright` (U+2019) and `quoteleft` (U+2018) slots. WordPress's `wptexturize()` rewrites every straight apostrophe to U+2019 on output, so this is needed to restore visible contractions and possessives.

2. **Latin diacritics** (THEME-148) — for each base Latin letter (A-Z, a-z), copy its outline into the empty accented variant slots (Á Â Ã Ä Å Ā Ă Ą Ǻ ...). The accent mark itself is not synthesized; the patched glyph is the base letter without its diacritic. Stylistically faithful for a typewriter font that historically only had ASCII, and far better than a blank gap. Covers Western European, Polish, Czech, Slovak, Hungarian, Romanian, Turkish, Croatian, Lithuanian, and Latvian Latin-script content.

The patch is **idempotent** — it refuses to overwrite already-populated glyphs and refuses to copy from an empty source. No font tables are added or removed; only `cmap`, `glyf`, `loca`, `hmtx`, and the auto-computed `head` checksum/timestamp change.

The following are intentionally left empty and handled by the `unicodeRange` directive on the `@font-face` declaration in `theme.json` (browser falls back to the next family in the `fontFamily` stack — `ui-monospace, Menlo, monospace`):

- Stroke / bar / hook variants — Ł ł Đ đ Ħ ħ Ŧ ŧ ƒ
- Ligatures — Æ æ Œ œ Ĳ ĳ ﬁ ﬂ ﬀ ﬃ ﬄ
- Special letters — ß Þ ð (no plausible base outline)
- Symbols — © ® ½ ¼ ¾ × ÷ € † ‡ … ‰ ‹ › ™
- Cyrillic (U+0400-04FF) and Greek (U+0370-03FF) — fully out of scope; the font has no coverage to recover from

## How to regenerate

Requires Python 3 with `fontTools` and `brotli` installed.

```sh
# From an upstream copy of Elite Math New.ttf
python3 patch-elite-math-new.py path/to/upstream-Elite-Math-New.ttf elite-math-new-v3.ttf
```

The script is idempotent against the *same* `DIACRITIC_MAP`: re-running with identical inputs is a no-op and exits 0 (safe for CI / `set -e` pipelines). Editing `DIACRITIC_MAP` and re-running patches any newly-mapped variants that are still empty, but will not unwind prior patches — to recover from a mistaken patch, regenerate from the upstream binary. Re-running against a future upstream that ships additional glyphs natively will simply patch fewer of them.

Coverage is intentionally limited to Latin diacritics where the base letter is a recognizable stand-in for the accented variant. Stroke / bar / hook variants (Ł Đ Ŧ Ħ ƒ), ligatures (Æ Œ ﬁ), special letters (ß Þ ð), Pinyin tone marks (Ǎ ǎ Ǐ ǐ Ǒ ǒ Ǔ ǔ), and Irish lenited consonants (Ḃ Ḋ Ḟ Ṁ Ṗ Ṡ Ṫ) are NOT patched — the base-letter outline is not a faithful stand-in for those forms. They fall back to the next font in the stack via `unicodeRange`.

If you change `DIACRITIC_MAP` in the patch script, also regenerate the `unicodeRange` string in `theme.json` so it stays in sync with the actual coverage. A small generator script is available in the THEME-148 PR description.

## Cache busting

When the patched binary changes, **bump the filename** (`-v2`, `-v3`, …) and update the `src` in `theme.json` to match. Do **not** append a `?ver=` query string to the `file:` URL — WordPress's `file:` font-face scheme does not load a query-stringed path, so the font silently fails to render. A new filename is what makes the WP.com CDN treat it as a fresh resource.

## Accessibility

The patch operates at the glyph-outline layer only. The `cmap` codepoint mapping is unchanged — `Müller` is still `U+004D U+00FC U+006C U+006C U+0065 U+0072` in the DOM, in the rendered font's character map, and in the page source. As a result:

- Screen readers (VoiceOver, NVDA, JAWS, TalkBack) read the codepoint, not the rendered outline, and pronounce the word correctly assuming the surrounding markup has the right `lang` attribute and the TTS has the language installed.
- Copy / paste preserves the original codepoint with its diacritic intact.
- Search-in-page (Cmd/Ctrl-F) matches the original codepoint.
- Translation services and screen-readers' text-extraction layers see the original text.

The tradeoff is purely visual: the rendered glyph for an accented Latin letter shows the base letter without its diacritic, and any unpatched codepoint (Cyrillic, Greek, ß, Æ, Ł, etc.) renders in the monospace fallback font rather than the typewriter face. **Do not select this font as a body font for sites whose primary content is in any language where diacritics carry phonemic or semantic distinction** (German, Polish, Czech, Slovak, Hungarian, Romanian, Turkish, Vietnamese, etc.) — sighted readers will perceive the diacritic loss as a misspelling or, in homograph cases (Spanish `año` / `ano`, French `à` / `a`), as a meaning change.

For multilingual sites: ensure `lang` attributes are correctly set on the relevant content. The patched font's visual output makes it easy to overlook that the underlying text is non-English; correct `lang` attribution is what allows screen readers and translation tools to handle the content correctly.
