import {DISTRICT_ASSETS} from './districts.js';
const gallery=document.getElementById('gallery'),cards=[];
for(const asset of DISTRICT_ASSETS){
 const card=document.createElement('figure'),link=document.createElement('a'),img=document.createElement('img'),caption=document.createElement('figcaption'),name=document.createElement('b'),info=document.createElement('small');
 link.href=asset.src;link.target='_blank';link.rel='noopener';img.src=asset.src;img.alt=asset.label;img.loading='lazy';img.decoding='async';link.append(img);
 name.textContent=asset.label;info.textContent=`${asset.type} · ${Math.round(asset.bytes/1024)} Ko · ${asset.viewBox.width} × ${asset.viewBox.height}`;
 caption.append(name,info);card.append(link,caption);gallery.append(card);cards.push({card,label:asset.label});
}
function search(){const text=document.getElementById('search').value.toLocaleLowerCase('fr').normalize('NFD').replace(/\p{Diacritic}/gu,'');let count=0;for(const {card,label} of cards){card.hidden=!label.toLocaleLowerCase('fr').normalize('NFD').replace(/\p{Diacritic}/gu,'').includes(text);if(!card.hidden)count++;}document.getElementById('result').textContent=`${count} / 61 assets`;}
document.getElementById('search').addEventListener('input',search);search();
document.getElementById('theme').onclick=e=>{const dark=document.body.classList.toggle('night');e.currentTarget.setAttribute('aria-pressed',String(dark));e.currentTarget.textContent=dark?'Mode jour':'Mode nuit';};
