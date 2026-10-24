// Register final artwork here. Keys match engine TYPES; levels are 1, 2 and 3.
// Do not map district examples to individual buildings.
export const BUILDING_ASSETS={};
export const EXAMPLE_DISTRICT={
 src:'/assets/examples/quartier-a.svg',kind:'district',
 viewBox:{width:1024,height:640},
 // Ground diamond: left 64, right 960, top 64, bottom 512.
 ground:{centerX:512,centerY:288,width:896,height:448},
 footprint:{columns:16,rows:16},
};
export function resolveAsset(type,level=1,night=false,registry=BUILDING_ASSETS){
 const entry=registry[type]?.[level];
 if(!entry)return null; // Missing level keeps the existing procedural drawing.
 return {...entry,src:night&&entry.nightSrc?entry.nightSrc:entry.src,nightFallback:night&&!entry.nightSrc};
}
export function assetRect(asset,x,y,unit){
 const scale=2*unit/asset.ground.width;
 return {x:x-asset.ground.centerX*scale,y:y-asset.ground.centerY*scale,
  width:asset.viewBox.width*scale,height:asset.viewBox.height*scale};
}
