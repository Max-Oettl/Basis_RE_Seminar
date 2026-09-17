"use strict";
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const reviewRoot='analysis/render-checks/RE4/feedback-31-48-2026-09-17';
function partitionNarration(){
  const file=path.join(root,'analysis/rebuild-plans/RE4_scene-plan.json');
  const plan=JSON.parse(fs.readFileSync(file,'utf8'));
  const map=require('../analysis/inventories/RE4_svg-text-map.json');
  const original=map.mappings.find(m=>m.source_slide_number===31).spoken_text;
  const numbers=[31,33,39,41,44];
  const cuts=['Grundsätzlich unterscheiden wir zwei Basisstrukturen','Hat man das Zuverlässigkeitsblockdiagramm eines Systems erstellt','In der Praxis bestehen Systeme oft nicht nur','Wir benötigen hierfür also nur das Zuverlässigkeitsblockdiagramm.'];
  const indexes=[0,...cuts.map(c=>{if(original.indexOf(c)!==original.lastIndexOf(c))throw Error('Non-unique boundary');return original.indexOf(c);}),original.length];
  if(indexes.some(i=>i<0))throw Error('Missing narration boundary');
  const raw=numbers.map((_,i)=>original.slice(indexes[i],indexes[i+1]));
  if(raw.join('')!==original)throw Error('Lossy partition');
  numbers.forEach((n,i)=>{const s=plan.scenes.find(s=>s.output_slide_number===n);s.spoken_text=raw[i].trim();s.narration_partition={method:'verbatim_contiguous_source_span',source_text_section_id:s.source_text_section_id,start:indexes[i],end:indexes[i+1]};});
  for(const n of [...numbers,48]){const s=plan.scenes.find(s=>s.output_slide_number===n);s.internal_manifest=`rebuild-proposals/svg/RE4/slide_${String(n).padStart(3,'0')}/scene.animation.v1.json`;}
  plan.scenes.find(s=>s.output_slide_number===48).spoken_text=map.mappings.find(m=>m.source_slide_number===48).spoken_text;
  fs.writeFileSync(file,JSON.stringify(plan,null,2)+'\n');
  fs.writeFileSync(path.join(root,reviewRoot,'narration-partition.json'),JSON.stringify({scenes:numbers,lossless:true,sourceLength:original.length,spans:indexes},null,2)+'\n');
}
if(require.main===module)partitionNarration();
module.exports={partitionNarration,reviewRoot};
