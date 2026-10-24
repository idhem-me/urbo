import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {budgetStatus,incomeStatus,coverageStatus,energyStatus,stockStatus,statusBadge} from './src/status.js';
assert.equal(budgetStatus(0,100),'danger');
assert.equal(budgetStatus(400,-100),'danger');
assert.equal(budgetStatus(500,-100),'warning');
assert.equal(budgetStatus(1000,0),'warning');
assert.equal(budgetStatus(1000,10),'success');
assert.equal(incomeStatus(-1),'danger');assert.equal(incomeStatus(0),'warning');assert.equal(incomeStatus(1),'success');
assert.equal(coverageStatus(39),'danger');assert.equal(coverageStatus(40),'warning');assert.equal(coverageStatus(79),'warning');assert.equal(coverageStatus(80),'success');
assert.equal(energyStatus(.59),'danger');assert.equal(energyStatus(.6),'warning');assert.equal(energyStatus(1),'success');
assert.equal(stockStatus(0),'neutral');
assert.equal(stockStatus(0,{needed:50}),'danger');
assert.equal(stockStatus(49,{needed:50}),'danger');
assert.equal(stockStatus(50,{needed:50}),'warning');
assert.equal(stockStatus(100,{needed:50}),'success');
assert.equal(stockStatus(19,{rate:10}),'danger');
assert.equal(stockStatus(20,{rate:10}),'warning');
assert.equal(stockStatus(100,{rate:10}),'success');
for(const [status,label] of [['success','OK'],['warning','À surveiller'],['danger','Critique']]){
 const markup=statusBadge(status);assert.ok(markup.includes(`aria-label="${label}"`));assert.ok(!markup.includes(`<span>${label}</span>`));assert.ok(markup.includes('<svg'));assert.ok(markup.includes(`data-status="${status}"`));
}
assert.ok(statusBadge('unknown').includes('data-status="neutral"'));
const css=readFileSync(new URL('./src/style.css',import.meta.url),'utf8');
const token=name=>{const match=css.match(new RegExp(`--${name}:\\s*(#[a-fA-F0-9]{3,6})(?:;|\\s)`));assert.ok(match,`token ${name}`);return match[1];};
function luminance(hex){let h=hex.slice(1);if(h.length===3)h=[...h].map(x=>x+x).join('');const rgb=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
for(const status of ['success','warning','danger']){
 assert.ok(contrast(token(status+'-text'),token(status+'-background'))>=4.5,`${status} soft contrast`);
 assert.ok(contrast(token(status+'-foreground'),token(status))>=4.5,`${status} solid contrast`);
 for(const suffix of ['','-foreground','-text','-background','-border','-ring','-icon'])assert.ok(css.includes(`--color-${status}${suffix}:var(--${status}${suffix})`));
}
assert.ok(css.includes('--destructive:var(--danger)'));
console.log('États : seuils, stock optionnel, libellés, icônes, tokens et contrastes AA validés.');

assert.ok(statusBadge('warning','Stock < 20 & urgent').includes('Stock &lt; 20 &amp; urgent'));
