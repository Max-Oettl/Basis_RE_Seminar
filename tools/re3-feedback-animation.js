"use strict";
const fs=require("node:fs");
const path=require("node:path");
function writeFeedbackAnimation(scene,content,dir,spokenText) {
  const reviewRoot=content.reviewRoot || "analysis/render-checks/RE3/feedback-2026-09-17";
  const writeReviewDoc=(name,body)=>{
    if(content.reviewKind==='method-comparison') body=body
      .replace('- Alle numerisch nicht belegten Zeitpositionen sind illustrative_irregular_timeline.','- Beide Diagramme verwenden dokumentierte illustrative Modelle; OLS-Normalgleichungen und das numerische Likelihood-Maximum sind geprüft.')
      .replace('- Beziehungen erst mit ihren Endpunkten; Daten vor Fit; beide Vertrauensgrenzen zusammen.','- MLS: Datenpunkte vor Regressionsgerade, dann vertikale Residuen und Minimierungsziel. MLE: Fläche vor Maximum und Parameterprojektionen.')
      .replace('- Individuelle Punktübertragung enthält identische Kennziffern und gekoppelte Wertepaar-Hervorhebung.','- Beide Methoden mit gleich großen Überschriften; Zensierungsfähigkeit jeweils bei der Methode, Softwareanwendung als gemeinsame Aussage.');
    else if(content.reviewKind==='life-data-pictograms') body=body
      .replace('- Alle numerisch nicht belegten Zeitpositionen sind illustrative_irregular_timeline.','- Vier generierte PNG-Linienpiktogramme unterstützen die vier Datenquellen; alle Fachtexte und Sprecherphrasen bleiben erhalten.')
      .replace('- Beziehungen erst mit ihren Endpunkten; Daten vor Fit; beide Vertrauensgrenzen zusammen.','- PNG-Piktogramm und zugehörige Spaltenüberschrift bilden jeweils eine atomare Revealgruppe; keine interne Iconanimation.')
      .replace('- Individuelle Punktübertragung enthält identische Kennziffern und gekoppelte Wertepaar-Hervorhebung.','- Monochrome Motive bei 48px und im 960×540-Endbild prüfen; Transparenz, Kontrast und Sicherheitsränder separat validieren.');
    else if(content.reviewKind==='life-data') body=body
      .replace('- Beziehungen erst mit ihren Endpunkten; Daten vor Fit; beide Vertrauensgrenzen zusammen.','- Gleiche Objektidentitäten, gemeinsame Starts und unveränderte Ereigniszeiten über die Vergleichsansichten; Grenze vor Interpretation.')
      .replace('- Individuelle Punktübertragung enthält identische Kennziffern und gekoppelte Wertepaar-Hervorhebung.','- Legende genau einmal am Diagramm; Zensierungen und Ausfälle klar unterscheiden; Intervallgrenzen statt erfundener exakter Ausfallzeiten.');
    else if(content.reviewRoot) body=body
      .replace("- Alle numerisch nicht belegten Zeitpositionen sind illustrative_irregular_timeline.","- Illustrative Modellwerte, Quantile und Dichteflächen sind unter data/ dokumentiert; Szene 23 verwendet das bereits akzeptierte Plotasset unverändert.")
      .replace("- Individuelle Punktübertragung enthält identische Kennziffern und gekoppelte Wertepaar-Hervorhebung.","- Dichteflächen entsprechen den berechneten Quantilen; F und R liegen in [0,1]. Bei R=1−F werden Variable und Dichte gemeinsam gespiegelt.");
    fs.writeFileSync(path.join(dir,name),body
    .replaceAll("analysis/rebuild-plans/RE3_scenes_001_006_feedback_2026-09-17.md",content.feedbackAudit || "analysis/rebuild-plans/RE3_scenes_001_006_feedback_2026-09-17.md")
    .replaceAll("analysis/render-checks/RE3/feedback-2026-09-17/",reviewRoot+"/"),"utf8");
  };
  const ids=[...new Set(content.steps.map(s=>s.targetId))];
  const labels=Object.fromEntries([...content.body.matchAll(/id="([^"]+)" data-anim-target="true" data-anim-label="([^"]+)"/g)].map(m=>[m[1],m[2]]));
  const steps=content.steps.map((s,i)=>{
    if(!spokenText.includes(s.sourceText)) throw new Error(`Missing narration phrase: ${s.sourceText}`);
    if(spokenText.indexOf(s.sourceText)!==spokenText.lastIndexOf(s.sourceText)) throw new Error(`Ambiguous narration phrase: ${s.sourceText}`);
    return {stepId:`step_${String(i+1).padStart(2,"0")}_${s.targetId}`,occurrence:1,confidence:"high",...s};
  });
  for(let i=1;i<steps.length;i++) if(spokenText.indexOf(steps[i].sourceText)<spokenText.indexOf(steps[i-1].sourceText)) throw new Error(`Narration order: ${steps[i].targetId}`);
  for(const id of ids) if(!["show","draw"].includes(steps.find(s=>s.targetId===id).action)) throw new Error(`First action must reveal ${id}`);
  const targets=ids.map(id=>({targetId:id,label:labels[id]||id,status:"animated",visibleInEditor:true,render:true,confidence:"high"}));
  const defaults={enterFrames:16,exitFrames:12,highlightDurFrames:30,drawDurFrames:38,transformDurFrames:30};
  const manifest={schemaVersion:"svgAnimationManifest/v1",svgPath:`${scene.work_unit}.svg`,defaults,targets,steps};
  const put=(name,data)=>fs.writeFileSync(path.join(dir,name),JSON.stringify(data,null,2)+"\n","utf8");
  put("scene.animation.v1.json",manifest);
  put("element-animation-plan.json",{schemaVersion:"elementAnimationPlan/v1",sceneId:scene.scene_id,decision:"animated",...manifest});
  put("animation-dramaturgy-plan.json",{
    schemaVersion:"svgAnimationDramaturgyPlan/v1",sceneId:scene.scene_id,svgPath:`${scene.work_unit}.svg`,spokenText,animationDecision:"animated",
    animationRationale:"Quellaufbau und gesprochenen Erklärfluss durch semantische Reveals und gezielte Fokussierung begleiten.",
    initialStateRationale:"Der Player zeigt den Szenentitel. Der Inhaltsbereich baut sich ab der ersten inhaltlichen Einführung auf, ohne spätere Aussagen vorwegzunehmen.",
    staticReview:{status:"passed",evidence:`${reviewRoot}/after/${scene.work_unit}.png`},
    runtimeProfile:{supportedActions:["show","hide","highlight","draw","transform"],initialVisibleAnimatedTargetsSupported:false,entranceMotionRenderedInReviewer:false,blurSupported:false},
    narrativeBeats:[{beatId:"opening",sourceText:spokenText.split(/\s+/).slice(0,6).join(" "),occurrence:1,claim:"Orientierung durch den vom Player gesetzten Szenentitel",requiredContext:[],revealTogether:[]},...steps.map((s,i)=>({beatId:`beat_${i+1}`,sourceText:s.sourceText,occurrence:s.occurrence,claim:labels[s.targetId]||s.targetId,requiredContext:[],action:s.action,revealTogether:[s.targetId]}))],
    semanticGroups:targets.map(t=>({groupId:t.targetId,label:t.label,role:"content",members:[t.targetId],dependsOn:content.dependencies?.[t.targetId]||[],initialState:"hidden_until_trigger",initialVisibilityEvidence:"Erst mit der zugeordneten Originalphrase fachlich relevant.",firstRelevantBeatId:`beat_${steps.findIndex(s=>s.targetId===t.targetId)+1}`})),
    steps:steps.map((s,i)=>({...s,beatId:`beat_${i+1}`,rationale:s.action==="highlight"?"Bereits eingeführten Zusammenhang beim gesprochenen Bezug fokussieren.":"Vollständige fachliche Einheit mit ihrer Einführung sichtbar machen."})),
    stateReview:[{stateId:"initial",visibleGroups:[],reviewStatus:"pending"},{stateId:"end",visibleGroups:ids,reviewStatus:"pending"}],unsupportedEffectRequests:[]
  });
  writeReviewDoc("redesign-brief.md",`# RE3 ${scene.work_unit} – Feedbackrevision 17.09.2026\n\n- Planungsmodus: module_redesign; Artefakt: transparentes content_svg, 1920 × 1080.\n- Stabile Scene_ID: ${scene.scene_id}; Quellen: ${scene.source_slides.join(", ")}.\n- Aussage: ${scene.takeaway}\n- Referenz-Lock: aktuelle RE2-SVGs slide_016, slide_023, slide_047.\n- Stil: offene Hierarchie, Archivo, Marineblau, semantische Akzente; keine Masterelemente.\n- Sprechertext und Quellmapping bleiben unverändert.\n- Inventar, lokale Korrekturen und Assetentscheidungen: analysis/rebuild-plans/RE3_scenes_001_006_feedback_2026-09-17.md.\n- Python-Plots und Daten lokal unter plots/ und data/; Formelpfade unter formulas/, soweit erforderlich.\n- Alle numerisch nicht belegten Zeitpositionen sind illustrative_irregular_timeline.\n- Animation: ${targets.length} semantische Ziele, ${steps.length} Schritte; sourceText wortgetreu, alle Ziele vor Hervorhebung eingeführt.\n- Statischer Vergleich vor Manifestproduktion; Rendernachweise unter analysis/render-checks/RE3/feedback-2026-09-17/.\n- Fachliche und technische Prüfnachweise stehen im zugehörigen Feedbackaudit.\n\n## Zielgruppen\n\n${targets.map(t=>`- ${t.targetId}: ${t.label}`).join("\n")}\n`,"utf8");
  writeReviewDoc("critical-challenge.md",`# Review-Schwerpunkte ${scene.work_unit}\n\n- Quellinhalte, Zuordnungen und Sprecherphrasen gegen alle ${scene.source_slides.length} Quellzustände abgleichen.\n- Endzustand und alle semantischen Zwischenstände in 1920×1080 und 960×540 prüfen.\n- Beziehungen erst mit ihren Endpunkten; Daten vor Fit; beide Vertrauensgrenzen zusammen.\n- Individuelle Punktübertragung enthält identische Kennziffern und gekoppelte Wertepaar-Hervorhebung.\n- Statische und animierte QA plus unabhängige visuelle Zweitprüfung dokumentiert im Feedbackaudit.\n- Nutzerfreigabe: offen; keine finale Sperre gesetzt.\n`,"utf8");
}
module.exports={writeFeedbackAnimation};
