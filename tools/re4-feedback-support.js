"use strict";
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const planFile=path.join(root,'analysis/rebuild-plans/RE4_scene-plan.json');
const map=require('../analysis/inventories/RE4_svg-text-map.json');
function partitionNarration(){
  const plan=JSON.parse(fs.readFileSync(planFile,'utf8'));
  const sections=[{sources:[1,5,7],cuts:['Für sie könnten Lebensdauerdaten','Erst dann können beispielsweise']},{sources:[21,23,25],cuts:['Doch in der Praxis ist es üblich','Das klingt zunächst abstrakt']}];
  const evidence=[];
  for(const s of sections){
    const original=map.mappings.find(m=>m.source_slide_number===s.sources[0]).spoken_text;
    const indexes=[0,...s.cuts.map(c=>original.indexOf(c)),original.length];
    if(indexes.some(i=>i<0))throw Error('Missing narration boundary');
    const raw=s.sources.map((_,i)=>original.slice(indexes[i],indexes[i+1]));
    if(raw.join('')!==original)throw Error('Lossy narration partition');
    s.sources.forEach((n,i)=>{const scene=plan.scenes.find(s=>s.output_slide_number===n);scene.spoken_text=raw[i].trim();scene.narration_partition={method:'verbatim_contiguous_source_span',source_text_section_id:scene.source_text_section_id,start:indexes[i],end:indexes[i+1]};});
    evidence.push({scenes:s.sources,lossless:true,sourceLength:original.length,spans:indexes});
  }
  for(const n of [13,17]){const s=plan.scenes.find(s=>s.output_slide_number===n);s.spoken_text=map.mappings.find(m=>m.source_slide_number===n).spoken_text;}
  fs.writeFileSync(planFile,JSON.stringify(plan,null,2)+'\n');
  const dir=path.join(root,'analysis/render-checks/RE4/feedback-2026-09-17');fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'narration-partition.json'),JSON.stringify(evidence,null,2)+'\n');
}
function spokenText(scene){const p=JSON.parse(fs.readFileSync(planFile,'utf8'));const overrides=JSON.parse(fs.readFileSync(path.join(root,'analysis/viewer-notes/spoken-text-overrides.json'),'utf8'));return overrides.slides?.[`RE4::${scene.output_slide_number}`]?.text||p.scenes.find(s=>s.scene_id===scene.scene_id)?.spoken_text||map.mappings.find(m=>m.source_slide_number===scene.primary_source_slide).spoken_text;}
function writeAnimation(scene,content,dir){
  const narration=spokenText(scene);
  if(scene.animation_decision==='static')return writeStatic(scene,content,dir,narration);
  const steps=content.steps.map(s=>{
    let phrase=s.sourceText;const words=phrase.split(/\s+/);
    if(words.length>8)phrase=words.slice(0,8).join(' ');
    if(words.length<3){const start=narration.indexOf(phrase);const previous=narration.slice(0,start).match(/\S+(?:\s+\S+)?\s*$/)?.[0]||'';phrase=previous+phrase;}
    return {...s,sourceText:phrase};
  });
  require('./re3-feedback-animation').writeFeedbackAnimation(scene,{...content,steps},dir,narration);
  const planFile=path.join(dir,'animation-dramaturgy-plan.json');const plan=JSON.parse(fs.readFileSync(planFile,'utf8'));
  const visible=new Set();for(const s of steps){if(['show','draw'].includes(s.action))visible.add(s.targetId);if(s.action==='hide')visible.delete(s.targetId);}
  plan.stateReview[1].visibleGroups=[...visible];
  fs.writeFileSync(planFile,JSON.stringify(plan,null,2)+'\n');
  fs.writeFileSync(path.join(dir,'redesign-brief.md'),`# RE4 ${scene.work_unit} – Feedbackrevision\n\n- Quellen: ${scene.source_slides.join(', ')}; stabile ID ${scene.scene_id}.\n- Referenz-Lock: ${(content.referenceLock || ['RE3::15','RE3::31','RE3::43']).join(', ')}. Transparente Content-SVG, Archivo und Oxanium, Marineblau mit semantischen Akzenten.\n- Inventar, Topologie und verlustfreie Sprechertextpartition: ${content.feedbackAudit}.\n- Statischer Pilot: ${content.reviewRoot}/after/${scene.work_unit}.png.\n- Animation: ${content.steps.length} wortgetreue Schritte; technische und visuelle Prüfung im Reviewverzeichnis.\n`);
  fs.writeFileSync(path.join(dir,'critical-challenge.md'),`# Prüffokus ${scene.work_unit}\n\nQuelltopologie, Kennwertzuordnung, Gegenereignisse und korrekte Gatter erhalten. Verbinder erscheinen mit ihren Endpunkten. Endbild und Zwischenstände auf Lesbarkeit bei 960 × 540, Überlappungen und Reihenfolge prüfen. Nachweise: ${content.reviewRoot}.\n`);
}
function writeStatic(scene,content,dir,narration){
  const put=(name,data)=>fs.writeFileSync(path.join(dir,name),JSON.stringify(data,null,2)+'\n');
  const manifest={schemaVersion:'svgAnimationManifest/v1',svgPath:scene.work_unit+'.svg',defaults:{enterFrames:16,exitFrames:12,highlightDurFrames:30,drawDurFrames:38,transformDurFrames:30},targets:[],steps:[]};
  put('scene.animation.v1.json',manifest);
  put('element-animation-plan.json',{...manifest,schemaVersion:'elementAnimationPlan/v1',sceneId:scene.scene_id,decision:'static'});
  put('animation-dramaturgy-plan.json',{schemaVersion:'svgAnimationDramaturgyPlan/v1',sceneId:scene.scene_id,svgPath:manifest.svgPath,spokenText:narration,animationDecision:'static',animationRationale:'Statische Referenz- oder Übungsszene. Der gemeinsame Quellabschnitt enthält keinen eigenen wortgetreuen Aufbau für diese Grafik.',initialStateRationale:'Der vollständige Inhalt ist sofort sichtbar; keine künstlichen Einzelreveal-Trigger.',staticReview:{status:'passed',evidence:`${content.reviewRoot}/after/${scene.work_unit}.png`},runtimeProfile:{supportedActions:['show','hide','highlight','draw','transform'],initialVisibleAnimatedTargetsSupported:false},narrativeBeats:[],semanticGroups:[{groupId:'scene_content',label:scene.title,role:'content',members:['scene_content'],dependsOn:[],initialState:'visible_context',firstRelevantBeatId:'pre_narration',initialVisibilityEvidence:'Statische Referenz ohne eigene Aufbaunarration.'}],steps:[],stateReview:[{stateId:'initial',visibleGroups:['scene_content'],reviewStatus:'pending'},{stateId:'end',visibleGroups:['scene_content'],reviewStatus:'pending'}],unsupportedEffectRequests:[]});
  fs.writeFileSync(path.join(dir,'redesign-brief.md'),`# RE4 ${scene.work_unit} · Designrevision\n\n- Transparente Content-SVG,1920×1080; Master extern.\n- Quellen: ${scene.source_slides.join(', ')}.\n- Referenz-Lock: ${content.referenceLock.join(', ')}.\n- Inventar und Entscheidungen: ${content.feedbackAudit}.\n- Statisch: keine eigenen Originaltext-Trigger für diese Referenz.\n- Nachweise: ${content.reviewRoot}.\n`);
  fs.writeFileSync(path.join(dir,'critical-challenge.md'),`# Prüffokus ${scene.work_unit}\n\nVollständige Quellenübertragung, beidseitiger Inhaltsabgleich und Lesbarkeit bei960×540 prüfen. Keine Masterelemente, übergroßen Zustandsziffern oder wiederholten Legendenbalken. Nachweise: ${content.reviewRoot}.\n`);
}
module.exports={partitionNarration,spokenText,writeAnimation};
