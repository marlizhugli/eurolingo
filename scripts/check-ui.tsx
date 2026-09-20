import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Header } from '../src/components/Header';
import { MapGalaxy } from '../src/components/MapGalaxy';
import { SpeechStudio } from '../src/components/SpeechStudio';
import { FalseFriendsGame } from '../src/components/FalseFriendsGame';
import { MetaphorsGallery } from '../src/components/MetaphorsGallery';
import { BirdChatbot } from '../src/components/BirdChatbot';
import { FALSE_FRIENDS_DECK } from '../src/data/falseFriends';
import { copyText } from '../src/utils/clipboard';

// A denied storage API must not prevent the quiz from rendering.
Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Storage denied'); } });
const noop = () => {};
for (const view of [
  <Header activeTab="map" setActiveTab={noop} isMuted={false} setIsMuted={noop} />,
  <MapGalaxy />, <SpeechStudio />, <FalseFriendsGame />, <MetaphorsGallery />,
  <BirdChatbot isOpen={true} onToggle={noop} onClose={noop} />,
]) {
  assert.ok(renderToString(view).length > 0);
}
for (const question of FALSE_FRIENDS_DECK) {
  assert.ok(question.correctOptionIndex >= 0 && question.correctOptionIndex < question.options.length);
  assert.equal(new Set(question.options).size, question.options.length);
}
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {} });
assert.equal(await copyText('test'), false);
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { clipboard: { writeText: async () => { throw new Error('Denied'); } } } });
assert.equal(await copyText('test'), false);
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { clipboard: { writeText: async () => {} } } });
assert.equal(await copyText('test'), true);
console.log('All six views render; quiz data and denied storage/clipboard checks pass. This does not test browser layout.');
