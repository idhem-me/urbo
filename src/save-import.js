import {restore} from './engine.js';
export const MAX_SAVE_BYTES=2*1024*1024;
export async function readSaveFile(file,now=()=>Date.now()){
 if(!file||!Number.isFinite(file.size)||file.size<=0)throw new Error('Choisissez un fichier de sauvegarde JSON.');
 if(file.size>MAX_SAVE_BYTES)throw new Error('Fichier trop volumineux. Maximum : 2 Mo.');
 let text;try{text=await file.text();}catch{throw new Error('Lecture du fichier impossible. Réessayez.');}
 // Content validation matters more than file extensions, which vary across devices.
 return restore(text.replace(/^\uFEFF/,''),now(),{strict:true});
}
