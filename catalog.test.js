import assert from 'node:assert/strict';
import {money} from './src/units.js';
import {buildingCategories,buildingFamilies,catalogFamily} from './src/catalog.js';
assert.equal(money(80000,true),'80 k€');assert.equal(money(1e6,true),'1 M€');assert.equal(money(1e9,true),'1 Md€');assert.equal(money(999950,true),'1 M€');assert.equal(money(999950000,true),'1 Md€');assert.equal(money(-1e9,true),'-1 Md€');
assert.deepEqual(buildingCategories('mixedShop'),['Logements','Commerce']);assert.deepEqual(buildingFamilies('mixedShop'),['residential','commerce']);assert.equal(catalogFamily('mixedShop','Logements'),'residential');assert.equal(catalogFamily('mixedShop','Commerce'),'commerce');assert.deepEqual(buildingFamilies('office'),['office']);assert.deepEqual(buildingFamilies('school'),['services']);
console.log('Catalogue : catégories mixtes, familles et formats k€/M€/Md€ validés.');
