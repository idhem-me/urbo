import {initial,restore} from './engine.js';
export const LEGACY_KEY='rivage-v1';
export const GUEST='guest';
export function cityId(){if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=globalThis.crypto?.getRandomValues?globalThis.crypto.getRandomValues(new Uint8Array(1))[0]&15:Math.floor(Math.random()*16);return (c==='x'?r:(r&3)|8).toString(16);});}
export function sameState(a,b){const stable=value=>Array.isArray(value)?value.map(stable):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,stable(value[k])])):value;return JSON.stringify(stable(a))===JSON.stringify(stable(b));}
const uuid=value=>typeof value==='string'&&/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(value);
export class CityStore {
 constructor({storage,owner=GUEST,now=()=>Date.now(),idFactory=cityId}={}){
  this.storage=storage;this.owner=owner;this.now=now;this.idFactory=idFactory;this.key='urbo-cities-v1:'+owner;this.data={version:1,activeId:null,cities:[]};this.error=null;
  try{const raw=storage?.getItem(this.key);if(raw){const data=JSON.parse(raw);if(data.version!==1||!Array.isArray(data.cities)||data.cities.some(c=>!uuid(c.id)||!c.state||typeof c.state!=='object'||!Number.isSafeInteger(c.localRevision)||c.localRevision<0||!Number.isSafeInteger(c.serverRevision)||c.serverRevision<0)||new Set(data.cities.map(c=>c.id)).size!==data.cities.length)throw Error('Sauvegarde de villes invalide');this.data=data;}}
  catch(error){this.error=error;this.readOnly=true;}
 }
 commit(change){const before=structuredClone(this.data);try{const result=change();this.persist();return result;}catch(error){this.data=before;throw error;}}
 get cities(){return this.data.cities;}
 get active(){return this.cities.find(c=>c.id===this.data.activeId)||this.cities[0]||null;}
 persist(){if(!this.storage)throw Error('Stockage indisponible');if(this.readOnly)throw this.error;try{this.storage?.setItem(this.key,JSON.stringify(this.data));this.error=null;}catch(error){this.error=error;throw error;}}
 ensureGuest(){if(this.cities.length||this.owner!==GUEST)return;let raw=null;try{raw=this.storage?.getItem(LEGACY_KEY);}catch{}this.create(raw?restore(raw,this.now()):initial(this.now()));}
 create(state=initial(this.now()),originId=null,{persist=true}={}){if(this.readOnly)throw this.error;const entry={id:this.idFactory(),state:structuredClone(state),createdAt:new Date(this.now()).toISOString(),updatedAt:new Date(this.now()).toISOString(),localRevision:1,serverRevision:0,dirty:true,originId};const add=()=>{this.cities.push(entry);this.data.activeId=entry.id;return entry;};return persist?this.commit(add):add();}
 save(state){const entry=this.active;if(!entry)throw Error('Aucune ville active');return this.commit(()=>{entry.state=structuredClone(state);entry.updatedAt=new Date(this.now()).toISOString();entry.localRevision++;entry.dirty=true;return entry;});}
 select(id){const entry=this.cities.find(c=>c.id===id);if(!entry)throw Error('Ville introuvable');this.commit(()=>{this.data.activeId=id;});return restore(JSON.stringify(entry.state),this.now());}
 activeState(){if(!this.active)throw Error('Aucune ville active');return restore(JSON.stringify(this.active.state),this.now());}
 ack(id,serverRevision,sentRevision){const entry=this.cities.find(c=>c.id===id);if(!entry)return;this.commit(()=>{entry.serverRevision=serverRevision;if(entry.localRevision===sentRevision)entry.dirty=false;});}
 merge(rows){return this.commit(()=>{let copies=0;for(const remote of rows){if(!uuid(remote.id)||!remote.state||typeof remote.state!=='object'||!Number.isSafeInteger(remote.revision)||remote.revision<1)throw Error('Ville distante invalide');const entry=this.cities.find(c=>c.id===remote.id);
   if(entry&&entry.dirty&&remote.revision>entry.serverRevision){
    if(sameState(entry.state,remote.state)){this.ack(entry.id,remote.revision,entry.localRevision);continue;}
    const previousActive=this.data.activeId,active=this.active?.id===entry.id,copy=this.create({...structuredClone(entry.state),cityName:[...(entry.state.cityName||'Ma ville')].slice(0,20).join('')+' (copie locale)'},null,{persist:false});copies++;if(!active)this.data.activeId=previousActive;else this.data.activeId=copy.id;
   }else if(entry&&(entry.dirty||remote.revision<=entry.serverRevision))continue;
   const value={id:remote.id,state:structuredClone(remote.state),createdAt:remote.created_at||new Date(this.now()).toISOString(),updatedAt:remote.updated_at||new Date(this.now()).toISOString(),localRevision:entry?.localRevision||0,serverRevision:remote.revision,dirty:false,originId:remote.imported_from||null};
   if(entry)this.cities[this.cities.indexOf(entry)]=value;else this.cities.push(value);
  }if(!this.cities.some(c=>c.id===this.data.activeId)&&this.cities.length)this.data.activeId=this.cities[0].id;return copies;});}
 importGuest(guest){return this.commit(()=>{let count=0;for(const entry of guest.cities){if(this.cities.some(c=>c.originId===entry.id))continue;this.create(entry.state,entry.id,{persist:false});count++;}return count;});}
}
