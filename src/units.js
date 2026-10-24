const numbers=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:1});
const euros=new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',minimumFractionDigits:0,maximumFractionDigits:2});
export function money(value,compact=false){
 if(!compact)return euros.format(value);
 const amount=Math.abs(value),scales=[{value:1e3,label:'k€'},{value:1e6,label:'M€'},{value:1e9,label:'Md€'}];
 if(amount<1e3)return euros.format(value);
 let index=amount>=1e9?2:amount>=1e6?1:0;
 // Promote on rounding as well, so a label never reads 1 000 k€ or 1 000 M€.
 if(index<2&&Math.round(amount/scales[index].value*10)/10>=1000)index++;
 return `${numbers.format(value/scales[index].value)} ${scales[index].label}`;
}
export const tonnes=value=>`${numbers.format(value)} t`;
