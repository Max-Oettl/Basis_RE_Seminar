"use strict";
const theme=require('./reltest-education-theme');
const {text,lines,rect,g}=require('./re3-feedback-builders');
const C=theme.colors;
const wire=d=>`<path d="${d}" fill="none" stroke="${C.accent}" stroke-width="2.5" stroke-linejoin="round" data-role="connector"/>`;
const N={
  system:[960,210,330,72,['Getriebe defekt'],['Getriebe funktionsfähig']],
  torque:[650,395,400,76,['Kein Drehmoment','wird übertragen'],['Drehmoment wird','übertragen']],leak:[1490,395,310,76,['Leckage'],['Dichtheit gegeben']],
  input:[350,575,240,84,['Eingangswelle','defekt'],['Eingangswelle','funktionsfähig']],output:[650,575,240,84,['Ausgangswelle','defekt'],['Ausgangswelle','funktionsfähig']],flow:[960,575,240,84,['Teile im Kraftfluss','defekt'],['Teile im Kraftfluss','funktionsfähig']],more:[1130,575,65,84,['…'],['…']],
  static:[1280,575,240,84,['Statische','Dichtungen defekt'],['Statische Dichtungen','funktionsfähig']],dynamic:[1630,575,260,84,['Dynamische','Dichtungen defekt'],['Dynamische Dichtungen','funktionsfähig']],
  fracture:[350,763,240,72,['Bruch'],['Kein Bruch']],jam:[650,763,220,72,['Klemmt'],['Klemmt nicht']],
  fatigue:[230,938,218,68,['Ermüdung'],['Keine Ermüdung']],material:[490,938,238,68,['Materialfehler'],['Kein Materialfehler']],flow_base:[960,763,200,72,['…'],['…']],static_base:[1280,763,200,72,['…'],['…']],wear:[1490,763,210,72,['Verschleiß'],['Kein Verschleiß']],thermal:[1715,763,220,72,['Thermische','Alterung'],['Keine thermische','Alterung']],
};
const edges={system:['torque','leak'],torque:['input','output','flow','more'],leak:['static','dynamic'],input:['fracture','jam'],fracture:['fatigue','material'],flow:['flow_base'],static:['static_base'],dynamic:['wear','thermal']};
const basic=['fatigue','material','flow_base','static_base','wear','thermal'];
const symbols=['E','M','…','…','V','T'];
const percentages=['2 %','0,1 %','1 %','0 %','1 %','1 %'];
function eventNode(id,functional=false){const [cx,y,baseW,h,negative,positive]=N[id];const w=baseW+(functional&&id==='dynamic'?30:0);const ss=functional?positive:negative;const dark=basic.includes(id)||id==='system';return `<g data-node-id="${id}">`+(id==='more'?'':rect(cx-w/2,y,w,h,dark?C.accent:C.surface,C.accent))+lines(cx,y+h/2-(ss.length-1)*14+8,ss,id==='system'?(functional?26:29):functional?22:24,600,dark?C.surface:C.accent,'middle',28)+'</g>';}
function fork(parent,functional=false){const [cx,y,,h]=N[parent];const children=edges[parent],top=Math.min(...children.map(id=>N[id][1]));const bus=top-25;let body='';if(children.length>1){const gy=y+h+18;body=wire(`M${cx} ${y+h} V${gy} M${cx} ${gy+50} V${bus} M${Math.min(...children.map(id=>N[id][0]))} ${bus} H${Math.max(...children.map(id=>N[id][0]))}`)+rect(cx-33,gy,66,50,functional?C.educationAccentSoft:C.accentSoft,C.accent)+text(cx,gy+33,functional?'&':'≥1',27,600,functional?C.educationAccent:C.accent,'middle')+children.map(id=>wire(`M${N[id][0]} ${bus} V${N[id][1]}`)).join('');}else{const child=N[children[0]];body=wire(`M${cx} ${y+h} V${bus} H${child[0]} V${child[1]}`);}return `<g data-gate-parent="${parent}" data-gate-kind="${functional?'AND':'OR'}" data-child-ids="${children.join(' ')}">${body}</g>`;}
function indexed(x,y,base,sub,tail='',color=C.accent,size=29){return `<text x="${x}" y="${y}" font-family="Archivo,Arial,sans-serif" font-size="${size}" font-weight="600" fill="${color}" text-anchor="middle" data-qc-role="text">${base}<tspan baseline-shift="sub" font-size="70%">${sub}</tspan><tspan baseline-shift="baseline">${tail}</tspan></text>`;}
function tree(prefix='tree',functional=false){const group=(suffix,label,body)=>g(`${prefix}_${suffix}`,label,body);return {
  top:group('top','Top-Ereignis',eventNode('system',functional)),
  causes:group('causes','Drehmoment und Dichtheit',fork('system',functional)+['torque','leak'].map(id=>eventNode(id,functional)).join('')),
  components:group('components','Unmittelbare Ursachen der Komponenten',fork('torque',functional)+fork('leak',functional)+['input','output','flow','more','static','dynamic'].map(id=>eventNode(id,functional)).join('')),
  modes:group('modes','Bruch oder Klemmen der Eingangswelle',fork('input',functional)+['fracture','jam'].map(id=>eventNode(id,functional)).join('')),
  basics:group('basics','Sechs Basisereignisse',fork('fracture',functional)+fork('flow',functional)+fork('static',functional)+fork('dynamic',functional)+basic.map(id=>eventNode(id,functional)).join('')),
};}
function values(prefix='tree',functional=false,numeric=false){return basic.map((id,i)=>{const[cx,y,,h]=N[id];return g(`${prefix}_value_${id}`,`Kennwert ${id}`,indexed(cx,y+h+37,functional?'R':'F',symbols[i],numeric?` ≈ ${percentages[i]}`:'',C.educationAccent));}).join('');}
module.exports={tree,values,indexed,N,edges,basic,percentages,eventNode,fork};
