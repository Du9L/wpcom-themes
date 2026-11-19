# Image provenance

All pictures in this directory, and the pictures shown in `screenshot.jpg`,
were generated with AI on Claude for this theme (see the image credits in `readme.txt`).
They show no real person.

## Machine-readable marking (EU AI Act §50(2) alignment)

The files listed below carry the IPTC digital source type marker
(`XMP-iptcExt:DigitalSourceType = trainedAlgorithmicMedia`), applied
2026-11-12 with exiftool. `screenshot.jpg` carries
`compositeWithTrainedAlgorithmicMedia`, since it is a screenshot of the theme
showing these images.

To tag a newly added AI-generated image (after any resize or conversion,
since cwebp drops XMP):

    exiftool -overwrite_original \
      "-XMP-iptcExt:DigitalSourceType=http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia" \
      <file.webp>

…and add it to the list below.

## AI-generated (tagged)

- cards/emily.webp
- cards/hero.webp
- cards/james.webp
- cards/portrait.webp
- cards/sarah.webp

## Human-designed (untagged)

None.
