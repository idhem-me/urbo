const numbers=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:1});
const thousands=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:3});
export function money(value){
 if(value===0)return '0 €';
 const amount=Math.abs(value),scales=[{value:1e3,label:'k€'},{value:1e6,label:'M€'},{value:1e9,label:'Md€'}];
 let index=amount>=1e9?2:amount>=1e6?1:0;
 // Keep small amounts readable without ever displaying a nonzero balance as zero.
 if(index===0&&amount<1000){const scaled=value/1000;return `${Math.abs(scaled)<.001?(value<0?'−< 0,001':'< 0,001'):thousands.format(scaled)} k€`;}
 if(index<2&&Math.round(amount/scales[index].value*10)/10>=1000)index++;
 return `${numbers.format(value/scales[index].value)} ${scales[index].label}`;
}
export const tonnes=value=>`${numbers.format(value)} t`;
