import assert from 'node:assert/strict';
import {money} from './src/units.js';
import {buildingCategories,buildingFamilies,catalogFamily,PRIMARY_CATEGORIES,searchCatalog} from './src/catalog.js';
assert.equal(money(80000,true),'80 k€');assert.equal(money(1e6,true),'1 M€');assert.equal(money(1e9,true),'1 Md€');assert.equal(money(999950,true),'1 M€');assert.equal(money(999950000,true),'1 Md€');assert.equal(money(-1e9,true),'-1 Md€');
assert.deepEqual(buildingCategories('mixedShop'),['Résidence','Commerce']);assert.deepEqual(buildingFamilies('mixedShop'),['residential','commerce']);assert.equal(catalogFamily('mixedShop','Résidence'),'residential');assert.equal(catalogFamily('mixedShop','Commerce'),'commerce');assert.deepEqual(buildingFamilies('office'),['office']);assert.deepEqual(buildingFamilies('school'),['services']);
console.log('Catalogue : catégories mixtes, familles et formats k€/M€/Md€ validés.');

assert.deepEqual(PRIMARY_CATEGORIES,['Résidence','Commerce','Industrie','Bureaux','Services']);
for(const type of ['coal','solar','quarry','sawmill','farm','oil','factory','workshop'])assert.ok(buildingCategories(type).includes('Industrie'));
for(const type of ['school','fire','police','ambulance','hospital','park','stadium'])assert.ok(buildingCategories(type).includes('Services'));
assert.deepEqual(buildingCategories('office'),['Bureaux']);
assert.ok(searchCatalog('Résidence','hopital',{global:true}).includes('hospital'));
assert.ok(searchCatalog('Services','ECOLE').includes('school'));
assert.deepEqual(searchCatalog('Résidence','hopital'),[]);
assert.deepEqual(searchCatalog('Commerce','parking').sort(),['mall','supermarket'].sort());
assert.deepEqual(searchCatalog('Industrie','usine grande'),['largeFactory']);
assert.deepEqual(searchCatalog('Services','inexistant'),[]);

assert.equal(new Set(PRIMARY_CATEGORIES.flatMap(category=>searchCatalog(category))).size,27);

assert.equal(money(0),'0 €');assert.equal(money(100),'0,1 k€');assert.equal(money(1),'0,001 k€');assert.equal(money(-150),'−0,15 k€'.replace('−','-'));assert.equal(money(80000),'80 k€');assert.equal(money(1e6),'1 M€');assert.equal(money(0.1),'< 0,001 k€');
