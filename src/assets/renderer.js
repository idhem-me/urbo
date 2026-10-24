import {resolveAsset,assetRect,BUILDING_ASSETS} from './manifest.js';
export function createAssetRenderer({onReady=()=>{},createImage=()=>new Image(),registry=BUILDING_ASSETS}={}){
 const cache=new Map();let disposed=false;
 function load(src){
  if(cache.has(src))return cache.get(src);
  const record={status:'loading',image:createImage()};cache.set(src,record);
  record.image.onload=()=>{if(disposed)return;record.status='ready';onReady();};
  record.image.onerror=()=>{if(disposed)return;record.status='error';onReady();};
  record.image.decoding='async';record.image.src=src;return record;
 }
 return {
  draw(ctx,{type,level,x,y,unit,night=false}){
   const asset=resolveAsset(type,level,night,registry);if(!asset||disposed)return false;
   const record=load(asset.src);if(record.status!=='ready')return false;
   const rect=assetRect(asset,x,y,unit);ctx.save();
   // An explicit night asset takes priority; this is a temporary subdued fallback.
   if(asset.nightFallback)ctx.filter='brightness(.55) saturate(.7)';
   ctx.drawImage(record.image,rect.x,rect.y,rect.width,rect.height);ctx.restore();return true;
  },
  preload(){for(const levels of Object.values(registry))for(const asset of Object.values(levels)){load(asset.src);if(asset.nightSrc)load(asset.nightSrc);}},
  dispose(){disposed=true;for(const {image} of cache.values()){image.onload=null;image.onerror=null;}cache.clear();},
 };
}
