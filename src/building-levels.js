// Gameplay rules are small and independent from the artwork manifest.
const THREE_LEVELS=new Set(['house','tower','mixedShop','office']);
export const maxLevel=type=>THREE_LEVELS.has(type)?3:2;
// Two-stage districts retain late-game capacity without needing a phantom level 3.
export const capacityLevel=(type,level)=>maxLevel(type)===2&&level>=2?3:level;
export const upgradeFactor=(type,level)=>maxLevel(type)===2&&level===2?2.4:1.8**(level-1);
