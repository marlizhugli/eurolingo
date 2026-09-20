import assert from 'node:assert/strict';
import { ADDITIONAL_LANGUAGES } from '../src/data/additionalLanguages';
import { COUNTRY_LESSONS } from '../src/data/countryLessons';
import { EUROPE_COUNTRY_PATHS } from '../src/data/europeMapPaths';
import { EUROPEAN_LANGUAGES, LANGUAGE_FAMILIES } from '../src/data/languages';

assert.equal(new Set(EUROPEAN_LANGUAGES.map((lesson) => lesson.id)).size, EUROPEAN_LANGUAGES.length);
assert.equal(COUNTRY_LESSONS.size, EUROPE_COUNTRY_PATHS.length);
for (const country of EUROPE_COUNTRY_PATHS) {
  const lesson = COUNTRY_LESSONS.get(country.code);
  assert.ok(lesson, `Missing lesson: ${country.name}`);
  assert.equal(lesson.countryCode, country.code);
  assert.equal(lesson.country, country.name);
  assert.equal(lesson.capital, country.capital);
  assert.equal(lesson.family, country.family);
  assert.ok(LANGUAGE_FAMILIES[lesson.family]);
  assert.ok(lesson.edlGreeting.native && lesson.edlGreeting.translation && lesson.edlGreeting.phonetic);
  assert.ok(lesson.historicalOrigin && lesson.funFact && lesson.linguisticTraits.length >= 2);
  assert.ok(lesson.samplePhrases.length > 0, `Missing phrases: ${country.name}`);
  for (const phrase of lesson.samplePhrases) {
    assert.ok(phrase.text && phrase.translation && phrase.phonetic && phrase.audioLang);
    assert.doesNotThrow(() => Intl.getCanonicalLocales(phrase.audioLang));
  }
}
for (const [code, language, locale] of [
  ['NO', 'norwegian', 'nb-NO'], ['RS', 'serbian', 'sr-RS'], ['AT', 'german', 'de-AT'],
  ['CH', 'german', 'de-CH'], ['BE', 'french', 'fr-BE'], ['MD', 'romanian', 'ro-RO'],
  ['SJ', 'norwegian', 'nb-NO'], ['TR', 'turkish', 'tr-TR'],
]) {
  assert.equal(COUNTRY_LESSONS.get(code)?.id, language);
  assert.equal(COUNTRY_LESSONS.get(code)?.samplePhrases[0].audioLang, locale);
}
for (const lesson of ADDITIONAL_LANGUAGES) assert.ok(lesson.samplePhrases.length >= 3);
assert.equal(COUNTRY_LESSONS.get('TR')?.family, 'Turkic');
assert.notEqual(COUNTRY_LESSONS.get('AT'), COUNTRY_LESSONS.get('DE'));
console.log(`Verified lessons and country identities for all ${COUNTRY_LESSONS.size} map markers.`);
