import {TYPES} from './engine.js';
export const FAMILY_LABELS={residential:'Logement',commerce:'Commerce',office:'Bureaux',industry:'Industrie',services:'Services'};
export const CATEGORY_FAMILIES={'Logements':'residential','Commerce':'commerce','Éducation':'office','Industrie':'industry','Ressources':'industry','Énergie':'industry','Administration':'services','Secours':'services','Loisirs':'services'};
export function buildingCategories(type){return type==='mixedShop'?['Logements','Commerce']:[TYPES[type].category];}
export function buildingFamilies(type){if(type==='mixedShop')return ['residential','commerce'];if(type==='office')return ['office'];if(type==='school')return ['services'];return [CATEGORY_FAMILIES[TYPES[type].category]];}
export function catalogFamily(type,category){return type==='mixedShop'&&category==='Logements'?'residential':buildingFamilies(type).at(-1);}
