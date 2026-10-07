# Angled laptop frame

- Input: owner-supplied screenshot `codex-clipboard-c7999316-fe7e-40e7-9f46-5a12a1723afd.png`
- Processing: built-in imagegen edit, 2026-10-07 (transparent cutout, screen content removed)
- Output: `angled-laptop-frame-v1.png`, 1492 × 1054, original output alpha retained
- SHA-256: `fe328e329013e868ca1786358efc22d7fd12a078a91bda67858328ac6adf444a`
- Screen corners (TL, TR, BR, BL): `(424,155)`, `(1385,99)`, `(1307,825)`, `(321,760)`
- The live video is fitted without cropping to a 3:2 surface and projectively mapped onto these corners. The cutout is overlaid above it.
- Previous front-facing frame files are retained for history; no longer used by this player.

## Final prompt (built-in imagegen, transparent_background=true)

Use case: background-extraction / precise-object-edit. Image 1 is the EDIT TARGET. Extract exactly the silver premium detachable laptop/tablet with keyboard pictured in the screenshot, retaining its precise slightly angled perspective, black bezel, webcam, kickstand, keyboard and metallic detail. Remove all surrounding white webpage/UI/thumbnails/circles. Remove EVERYTHING currently displayed INSIDE its screen: Japanese advertisement, green leaves, price, people, all lettering. Make the entire inner display quadrilateral a true alpha-transparent HOLE, not white, black, a checkerboard drawing, or a new scene. The outer background must also be genuinely alpha-transparent. Preserve all device edges and screen geometry; do not redesign the device or turn it front-on. A clean photorealistic cutout for overlaying a live HTML video behind the empty screen. Keep the complete device including keyboard and kickstand, no clipping, with tight but safe margins. Output one landscape PNG with alpha transparency, no extra objects, no text, no watermark. No cat image should be inserted: the live video will be composited by code later.
