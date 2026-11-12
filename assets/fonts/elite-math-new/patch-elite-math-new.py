#!/usr/bin/env python3
"""
Patch elite-math-new.ttf to fix THEME-147 + THEME-148.

The upstream TTF (alanparmenter/Elite-Math-Font) ships valid cmap entries for
~470 codepoints that point to EMPTY glyphs (contours=0, bounds=None). The
browser reserves advance width but draws nothing, so those characters render
as blank gaps on the front end.

Two passes fix the patchable cases:

1. THEME-147 — copy the working `quotesingle` (U+0027) outline into the
   empty `quoteleft` (U+2018) and `quoteright` (U+2019) slots. WordPress's
   `wptexturize()` rewrites every straight apostrophe to U+2019 on output,
   so this restores visible contractions and possessives. U+2019 also
   appears in pasted content, post titles, and any string that bypasses
   or disables `wptexturize()`; copying the straight glyph guarantees a
   visible mark in all cases.

2. THEME-148 — for each base Latin letter (A-Z, a-z), copy its outline into
   the empty accented variant slots (Á Â Ã Ä Å Ā Ă Ą Ǻ ...). Stylistically
   faithful for a typewriter font that historically only had ASCII; the
   accent mark is missing but the letter is present, which is far better
   than the gap. Strokes/bars (Ł Đ Ŧ Ħ), ligatures (Æ Œ ﬁ), and special
   letters with no plausible base source (ß Þ ð) are intentionally left
   empty — the theme.json `unicodeRange` directive bounds the @font-face
   so the browser falls back to the next font in the stack for those.

   Cyrillic (U+0400-04FF) and Greek (U+0370-03FF) are entirely outside the
   patch's scope and are excluded from `unicodeRange` for the same reason.

The patch is idempotent against the *same* DIACRITIC_MAP: re-running with
identical inputs is a no-op. Editing DIACRITIC_MAP and re-running will
patch any newly-mapped variants that are still empty, but will not unwind
prior patches. Re-running against a future upstream that ships some of
the missing glyphs natively will simply patch fewer of them.

The patch assumes a monospace source font (every advance width identical),
which holds for Elite Math New. Pointed at a variable-width font, the
mixed "target advance + source lsb" metric strategy in `patch_pair` may
position patched glyphs slightly off-center within their advance box.

Usage:
  patch-elite-math-new.py <input.ttf> <output.ttf>
"""
import sys
import copy
from fontTools.ttLib import TTFont
from fontTools.pens.boundsPen import BoundsPen


# Map each ASCII base letter to the set of accented variants whose outline
# we can plausibly copy from the base. We include diacritic-only marks
# (acute, grave, circumflex, tilde, dieresis, ring, macron, breve, dot,
# caron, cedilla, ogonek, double-acute, comma-below) and skip:
#   - stroke / bar / hook variants (Ł Đ Ŧ Ħ ƒ) — distinct silhouettes
#   - ligatures (Æ æ Œ œ Ĳ ĳ) — composed from two letters
#   - special letters (ß Þ ð) — no shared outline with any base
#   - dotless i / j (ı ȷ) — distinct from the dotted forms
DIACRITIC_MAP = {
    # Uppercase
    "A": "ÀÁÂÃÄÅĀĂĄǺ",
    "C": "ÇĆĈĊČ",
    "D": "Ď",
    "E": "ÈÉÊËĒĔĖĘĚ",
    "G": "ĜĞĠĢ",
    "H": "Ĥ",
    "I": "ÌÍÎÏĨĪĬĮİ",
    "J": "Ĵ",
    "K": "Ķ",
    "L": "ĹĻĽĿ",
    "N": "ÑŃŅŇ",
    "O": "ÒÓÔÕÖØŌŎŐǾ",
    "R": "ŔŖŘ",
    "S": "ŚŜŞŠȘ",
    "T": "ŢŤȚ",
    "U": "ÙÚÛÜŨŪŬŮŰŲ",
    "W": "ŴẀẂẄ",
    "Y": "ÝŸŶỲ",
    "Z": "ŹŻŽ",
    # Lowercase
    "a": "àáâãäåāăąǻ",
    "c": "çćĉċč",
    "d": "ď",
    "e": "èéêëēĕėęě",
    "g": "ĝğġģ",
    "h": "ĥ",
    "i": "ìíîïĩīĭį",
    "j": "ĵ",
    "k": "ķ",
    "l": "ĺļľŀ",
    "n": "ñńņň",
    "o": "òóôõöøōŏőǿ",
    "r": "ŕŗř",
    "s": "śŝşšș",
    "t": "ţťț",
    "u": "ùúûüũūŭůűų",
    "w": "ŵẁẃẅ",
    "y": "ýÿŷỳ",
    "z": "źżž",
}

# Codepoints reported on whenever we run, so the diagnostic output covers
# the THEME-147 quote glyphs plus a representative sample of THEME-148
# diacritics we expect to patch.
REPORT_CODEPOINTS = (0x0027, 0x2018, 0x2019, 0x00C9, 0x00FC, 0x0141, 0x0410)


def glyph_is_empty(glyf, glyphSet, gname):
    """Return True if the glyph has no drawable area.

    Simple glyphs (numberOfContours > 0) are non-empty.
    Composite glyphs (numberOfContours == -1) are considered non-empty when
    BoundsPen resolves the referenced components to a bounding box — but if
    every component is itself empty, BoundsPen returns None and we treat the
    composite as empty so the patcher can overwrite it with a real outline.
    """
    pen = BoundsPen(glyphSet)
    glyphSet[gname].draw(pen)
    contours = getattr(glyf[gname], "numberOfContours", 0)
    return contours <= 0 and pen.bounds is None


def report(font, label):
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    glyphSet = font.getGlyphSet()
    glyf = font["glyf"]
    print(f"\n[{label}]")
    for cp in REPORT_CODEPOINTS:
        gname = cmap.get(cp)
        if not gname:
            print(f"  U+{cp:04X}: NOT in cmap")
            continue
        adv, lsb = hmtx[gname]
        contours = getattr(glyf[gname], "numberOfContours", 0)
        blank = glyph_is_empty(glyf, glyphSet, gname)
        print(
            f"  U+{cp:04X} -> {gname!r}: advance={adv}, lsb={lsb}, "
            f"contours={contours}, BLANK={blank}"
        )


def patch_pair(cmap, glyf, hmtx, glyphSet, src_cp, src_name, tgt_cp, label):
    """Copy src glyph outline into tgt slot if tgt is currently empty."""
    tgt_name = cmap.get(tgt_cp)
    if not tgt_name:
        return None
    if not glyph_is_empty(glyf, glyphSet, tgt_name):
        return None
    src_glyph = glyf[src_name]
    if not hasattr(src_glyph, "numberOfContours") or src_glyph.numberOfContours <= 0:
        # Source itself empty — refuse so we never blank-out a target.
        return f"  U+{tgt_cp:04X} ({tgt_name!r}): source U+{src_cp:04X} ({src_name!r}) is empty, skipping"
    glyf[tgt_name] = copy.deepcopy(src_glyph)
    src_adv, src_lsb = hmtx[src_name]
    old_adv, _ = hmtx[tgt_name]
    # Preserve the target's advance width (so cursor positioning stays
    # consistent with the font's metric tables) but copy lsb from the source
    # so the visible mark lands where it does for the base letter.
    hmtx[tgt_name] = (old_adv, src_lsb)
    return (
        f"  patched U+{tgt_cp:04X} ({tgt_name!r}) <- U+{src_cp:04X} ({src_name!r}): "
        f"kept advance={old_adv}, set lsb={src_lsb}"
    )


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(2)
    in_path, out_path = sys.argv[1], sys.argv[2]

    font = TTFont(in_path)
    report(font, "BEFORE")

    cmap = font.getBestCmap()
    glyf = font["glyf"]
    hmtx = font["hmtx"]
    glyphSet = font.getGlyphSet()

    patched_count = 0
    skipped_already_outlined = 0

    # --- THEME-147: curly quotes from quotesingle ---
    quotesingle_cp = 0x0027
    src_name = cmap.get(quotesingle_cp)
    if not src_name:
        sys.exit("Cannot find quotesingle (U+0027) — refusing to patch.")
    if glyph_is_empty(glyf, glyphSet, src_name):
        sys.exit(f"Source glyph {src_name!r} (U+0027) is empty — refusing to patch.")

    print("\n=== THEME-147: curly quotes ===")
    for tgt_cp, label in ((0x2018, "quoteleft"), (0x2019, "quoteright")):
        result = patch_pair(
            cmap, glyf, hmtx, glyphSet, quotesingle_cp, src_name, tgt_cp, label
        )
        if result is None:
            tgt_name = cmap.get(tgt_cp)
            if tgt_name and not glyph_is_empty(glyf, glyphSet, tgt_name):
                print(f"  U+{tgt_cp:04X} ({tgt_name!r}) already has outline — skipping")
                skipped_already_outlined += 1
            else:
                print(f"  U+{tgt_cp:04X} not in cmap — skipping")
        else:
            print(result)
            patched_count += 1

    # --- THEME-148: Latin diacritics from base letters ---
    print("\n=== THEME-148: Latin diacritics ===")
    for base_char, variants in DIACRITIC_MAP.items():
        base_cp = ord(base_char)
        base_name = cmap.get(base_cp)
        if not base_name:
            print(f"  base U+{base_cp:04X} ({base_char!r}) not in cmap — skipping group")
            continue
        if glyph_is_empty(glyf, glyphSet, base_name):
            print(f"  base U+{base_cp:04X} ({base_char!r}) is itself empty — skipping group")
            continue
        for variant in variants:
            tgt_cp = ord(variant)
            result = patch_pair(
                cmap, glyf, hmtx, glyphSet, base_cp, base_name, tgt_cp, variant
            )
            if result is None:
                tgt_name = cmap.get(tgt_cp)
                if tgt_name and not glyph_is_empty(glyf, glyphSet, tgt_name):
                    skipped_already_outlined += 1
                # silent skip for not-in-cmap — keeps output readable
            else:
                print(result)
                patched_count += 1

    print(
        f"\nSummary: patched {patched_count} glyphs, "
        f"skipped {skipped_already_outlined} that already had outlines."
    )

    if patched_count == 0:
        # Re-runs against an already-patched font legitimately produce no
        # work. Exit 0 so CI / `set -e` shell pipelines can verify the font
        # is up to date without registering a clean idempotent run as a
        # failure. Reserve non-zero exits for genuine errors (missing
        # source glyph, IO failures).
        print("Nothing to patch. Output is already up to date.")
        sys.exit(0)

    font.save(out_path)
    print(f"\nSaved patched font -> {out_path}")

    # Reload and verify.
    patched = TTFont(out_path)
    report(patched, "AFTER")


if __name__ == "__main__":
    main()
