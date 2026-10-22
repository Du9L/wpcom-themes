# Image provenance

The images in this directory were generated with AI in Midjourney (see the
image credits in `readme.txt`). `screenshot.png` shows neither of them, so it
carries no marker.

## Machine-readable marking (EU AI Act §50(2) alignment)

The files listed below carry the IPTC digital source type marker
(`XMP-iptcExt:DigitalSourceType = trainedAlgorithmicMedia`), applied
2026-10-16 with exiftool after the WebP conversion stripped the original
metadata.

To tag a newly added AI-generated image:

    exiftool -overwrite_original \
      "-XMP-iptcExt:DigitalSourceType=http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia" \
      <file.webp>

…and add it to the list below.

## AI-generated (tagged)

- memoriam-hero-1024x771.webp
- memoriam-image-1024x683.webp

## Human-designed (untagged)

None.
