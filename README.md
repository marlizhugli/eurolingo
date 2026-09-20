<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d18c614b-9ee1-45aa-854f-9d3d4d92ef31

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Europe map data

Country boundaries come from [Natural Earth 1:50m](https://www.naturalearthdata.com/downloads/50m-cultural-vectors/), a public-domain dataset. The bundled SVG geometry works offline and uses an equirectangular projection with a 54° standard parallel. Flag markers use capital longitude/latitude coordinates projected with the same formula. Neighboring countries provide geographic context in gray.

To regenerate the geometry, download `ne_50m_admin_0_countries.geojson` from the [Natural Earth repository](https://github.com/nvkelso/natural-earth-vector/tree/master/geojson), then run:

```sh
python3 scripts/generate-europe-map.py /path/to/ne_50m_admin_0_countries.geojson
```

## Map lessons

Every interactive country or territory has a lesson in `src/data/countryLessons.ts`. Shared languages retain the selected country's name, flag and capital. Additional language lessons live in `src/data/additionalLanguages.ts`. Pronunciation hints are approximate; speech support depends on the browser's installed voices. Speaker totals and rankings are omitted for new lessons without sourced figures.

Check that every marker resolves to a complete lesson with `npm run test:map`.

Language background references include [Norway's Language Council](https://sprakradet.no/nyord-og-rettskrivingsendringer/normering-av-norsk/), [Slovenia's language overview](https://www.gov.si/en/topics/official-language/), [Switzerland's language overview](https://www.aboutswitzerland.eda.admin.ch/en/language), and [Belgium's language communities](https://www.belgium.be/en/about_belgium/government/federale_staat).
