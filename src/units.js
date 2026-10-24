const numbers=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:1});
const euros=new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',minimumFractionDigits:0,maximumFractionDigits:2});
export const money=(value,compact=false)=>{if(!compact)return euros.format(value);const amount=Math.abs(value);return amount>=1e6?`${numbers.format(value/1e6)} M€`:amount>=1e3?`${numbers.format(value/1e3)} k€`:euros.format(value);};
export const tonnes=value=>`${numbers.format(value)} t`;
