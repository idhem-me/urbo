const nightPalette={
 '#cbded7':'#0b1422','#d3c9a0':'#364047','#d6deae':'#354b42',
 '#a8bf80':'#273e39','#b3c98c':'#2c453d','#d6d4bf':'#3c4650',
 '#a6b2a1':'#26343b','#859b92':'#202d35','#e7efb9':'#607064',
 '#73938a':'#f6d88c','#6f8d83':'#f6d88c','#fff8de':'#fff1c2','#fff7de':'#f6d88c',
};
export function sceneColor(color,night=false){
 if(!night||typeof color!=='string')return color;
 if(nightPalette[color])return nightPalette[color];
 if(!/^#[a-f\d]{6}([a-f\d]{2})?$/i.test(color))return color;
 const rgb=[1,3,5].map((offset,i)=>Math.min(255,Math.round(parseInt(color.slice(offset,offset+2),16)*[.36,.43,.6][i]+[5,8,15][i])));
 return '#'+rgb.map(n=>n.toString(16).padStart(2,'0')).join('')+color.slice(7);
}
