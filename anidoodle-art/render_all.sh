#!/bin/bash
STYLES=("beeSumi" "beeStipple" "beeWoodcut" "beeOil" "beeBlueprint" "beePixel")
for STYLE in "${STYLES[@]}"; do
  echo -e "import { $STYLE } from '../canvas-core/drawBeeStyles';\nimport { mountFilm } from './page';\nmountFilm($STYLE);" > src/hosts/page-character.ts
  node tools/render.mjs character --out out/${STYLE}.mp4
done
