import {TYPES} from './engine.js';
export const PRIMARY_CATEGORIES=['Résidence','Commerce','Industrie','Bureaux','Services'];
export const PRIMARY_ICONS={'Résidence':'house','Commerce':'shop','Industrie':'factory','Bureaux':'office','Services':'townhall'};
export const FAMILY_LABELS={residential:'Résidence',commerce:'Commerce',office:'Bureaux',industry:'Industrie',services:'Services'};
export const CATEGORY_FAMILIES={'Logements':'residential','Résidence':'residential','Commerce':'commerce','Éducation':'office','Bureaux':'office','Industrie':'industry','Ressources':'industry','Énergie':'industry','Administration':'services','Secours':'services','Loisirs':'services','Services':'services'};
export function buildingFamilies(type){if(type==='mixedShop')return ['residential','commerce'];if(type==='office')return ['office'];if(type==='school')return ['services'];return [CATEGORY_FAMILIES[TYPES[type].category]];}
export const buildingCategories=type=>buildingFamilies(type).map(f=>FAMILY_LABELS[f]);
export const catalogFamily=(type,category)=>type==='mixedShop'&&category==='Résidence'?'residential':buildingFamilies(type).at(-1);
const normalize=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').trim();
export function searchCatalog(category,query='',{global=false}={}){
 const terms=normalize(query).split(/\s+/).filter(Boolean);
 return Object.keys(TYPES).filter(type=>{
  if(!global&&!buildingCategories(type).includes(category))return false;
  const haystack=normalize([TYPES[type].name,TYPES[type].category,...buildingCategories(type)].join(' '));
  return terms.every(term=>haystack.includes(term));
 });
}
