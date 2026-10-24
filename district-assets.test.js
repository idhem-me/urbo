import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DISTRICT_ASSETS} from './src/assets/districts.js';
import {BUILDING_ASSETS,SCENERY_ASSETS,resolveAsset,assetRect} from './src/assets/manifest.js';
import {TYPES} from './src/engine.js';
assert.equal(DISTRICT_ASSETS.length,61);assert.equal(DISTRICT_ASSETS.filter(a=>a.kind==='building').length,58);
assert.equal(Object.keys(BUILDING_ASSETS).length,Object.keys(TYPES).length);
assert.deepEqual(Object.keys(SCENERY_ASSETS).sort(),['construction','desert','forest']);
const paths=new Set();
for(const asset of DISTRICT_ASSETS){
 assert.ok(!paths.has(asset.src));paths.add(asset.src);
 const svg=readFileSync('public'+asset.src,'utf8');
 assert.equal(Buffer.byteLength(svg),asset.bytes);
 assert.ok(!/<(?:script|foreignObject|image)\b|\bon\w+\s*=|(?:href|url)\s*[=(]/i.test(svg));
 const viewBox=svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
 assert.deepEqual(viewBox,[asset.viewBox.x,asset.viewBox.y,asset.viewBox.width,asset.viewBox.height]);
 const rect=assetRect(asset,512,288,448);
 assert.equal(rect.y,asset.viewBox.y);assert.equal(rect.x,asset.viewBox.x);
 assert.equal(rect.width,1024);assert.equal(rect.height,asset.viewBox.height);
 assert.equal(asset.ground.height,asset.ground.width/2);
}
for(const type of Object.keys(TYPES))for(const level of [1,2,3]){
 const asset=resolveAsset(type,level);assert.ok(asset,`${type} level ${level}`);
 assert.ok(asset.level<=level);assert.equal(asset.type,type);
}
assert.equal(resolveAsset('fire',3).level,2);assert.equal(resolveAsset('house',3).level,3);
console.log('61 quartiers : SVG sûrs, emprises, marges hautes et couverture de tous les types validés.');
