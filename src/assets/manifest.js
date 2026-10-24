import {DISTRICT_ASSETS} from './districts.js';
// One gameplay cell represents one illustrated district; economics stay unchanged.
export const BUILDING_ASSETS={};
export const SCENERY_ASSETS={};
for(const asset of DISTRICT_ASSETS){const target=asset.kind==='building'?BUILDING_ASSETS:SCENERY_ASSETS;(target[asset.type]??={})[asset.level]=asset;}
export const GAME_ASSETS={...BUILDING_ASSETS,...SCENERY_ASSETS};
export const EXAMPLE_DISTRICT={
 src:'/assets/examples/quartier-a.svg',kind:'district',
 viewBox:{width:1024,height:640},
 // Ground diamond: left 64, right 960, top 64, bottom 512.
 ground:{centerX:512,centerY:288,width:896,height:448},
 footprint:{columns:16,rows:16},
};
export function resolveAsset(type,level=1,night=false,registry=BUILDING_ASSETS){
 const levels=registry[type];
 const available=Object.keys(levels||{}).map(Number).filter(n=>n<=level).sort((a,b)=>b-a)[0];
 const entry=levels?.[available];
 if(!entry)return null; // Unknown type keeps the procedural drawing.
 return {...entry,src:night&&entry.nightSrc?entry.nightSrc:entry.src,nightFallback:night&&!entry.nightSrc};
}
export function assetRect(asset,x,y,unit){
 const scale=2*unit/asset.ground.width;
 return {x:x-(asset.ground.centerX-(asset.viewBox.x||0))*scale,y:y-(asset.ground.centerY-(asset.viewBox.y||0))*scale,
  width:asset.viewBox.width*scale,height:asset.viewBox.height*scale};
}
