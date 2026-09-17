"use strict";
const fs = require("node:fs");
const path = require("node:path");
const theme = require("./reltest-education-theme");
const C = theme.colors;
const root = path.resolve(__dirname, "..");
const esc = x => String(x).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const text = (x,y,s,size=30,weight=500,color=C.text,anchor="start") => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}" data-qc-role="text">${esc(s)}</text>`;
const lines = (x,y,ss,size=30,weight=500,color=C.text,anchor="start",gap=40) => ss.map((s,i)=>text(x,y+i*gap,s,size,weight,color,anchor)).join("");
const rect = (x,y,w,h,fill=C.accentSoft,stroke="none") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
const line = (x1,y1,x2,y2,color=C.accent,width=2,arrow=false,dash="")=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${arrow?` marker-end="url(#arrow_${color.slice(1)})"`:""}${dash?` stroke-dasharray="${dash}"`:""} data-role="connector"/>`;
const g=(id,label,body)=>`<g id="${id}" data-anim-target="true" data-anim-label="${esc(label)}" data-qc-group="${id}">${body}</g>`;
const step=(id,sourceText,action="show",extra={})=>({targetId:id,sourceText,action,...(action==="highlight"?{stroke:C.educationAccent,strokeWidth:2}:{}),...extra});
function plot(scene,file,x,y,w,h) {
  const rel=`rebuild-proposals/svg/${scene.module_id||'RE3'}/${scene.work_unit}/plots/${file}`;
  let svg=fs.readFileSync(path.join(root,rel),"utf8");
  const vb=svg.match(/viewBox="([^"]+)"/)[1];
  svg=svg.slice(svg.indexOf('>',svg.indexOf('<svg'))+1,svg.lastIndexOf('</svg>'))
    .replace(/<metadata[\s\S]*?<\/metadata>/g,"")
    .replace(/font-family: 'Archivo'/g,"font-family: Archivo, Arial, Helvetica, sans-serif")
    .replace(/<(path|circle|rect|line)\b(?![^>]*data-role=)/g,'<$1 data-role="plot-geometry"');
  const publicIds=new Set([...svg.matchAll(/<[^>]*\bid="([^"]+)"[^>]*data-anim-target="true"[^>]*>/g)].map(m=>m[1]));
  const prefix=file.replace(/\.svg$/i,"").replaceAll("-","_");
  const ids=new Map([...svg.matchAll(/\bid="([^"]+)"/g)].filter(m=>!publicIds.has(m[1])).map(m=>[m[1],`${prefix}_${m[1]}`]));
  svg=svg.replace(/\bid="([^"]+)"/g,(m,id)=>`id="${ids.get(id)||id}"`).replace(/url\(#([^)]+)\)/g,(m,id)=>`url(#${ids.get(id)||id})`).replace(/href="#([^"]+)"/g,(m,id)=>`href="#${ids.get(id)||id}"`);
  return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb}" xmlns:xlink="http://www.w3.org/1999/xlink" data-plot-asset="${rel}" preserveAspectRatio="xMidYMid meet">${svg}</svg>`;
}
const formula=(file,x,y,w,h,label)=>`<image href="formulas/${file}" x="${x}" y="${y}" width="${w}" height="${h}" data-formula-asset="formulas/${file}" aria-label="${esc(label)}"/>`;
function buildIntro(scene) {
  const body = g("intro_1","Ausfallzeiten",rect(112,190,850,96,C.accent)+text(537,252,"Ausfallzeiten",38,650,C.surface,"middle"))
    +g("intro_2","Auswertung von Ausfallzeiten",`<path d="M150 380 L336 315 L522 380 H463 V580 H522 L336 645 L150 580 H209 V380Z" fill="${C.accentSoft}" stroke="${C.border}" stroke-width="1.5"/>`+lines(336,466,["Auswertung von","Ausfallzeiten"],29,550,C.text,"middle",40))
    +g("intro_3","Statistische Methoden",`<path d="M590 325 H870 V490 H930 L730 608 L530 490 H590Z" fill="${C.accentSoft}" stroke="${C.accent}" stroke-width="2"/>`+lines(730,410,["Statistische","Methoden"],32,600,C.text,"middle",43))
    +g("intro_4","Verteilungsparameter",rect(112,668,850,82,C.accentSoft,C.accent)+text(537,720,"Verteilungsparameter",30,600,C.text,"middle"))
    +g("intro_relation","Ziel der Auswertung",rect(112,773,850,137,C.accent)+text(146,816,"Ziel",24,600,C.surface)+lines(146,856,["Ausfallverhalten von Komponenten","und Systemen abschätzen"],30,500,C.surface,"start",39))
    +g("intro_5","Weibullverteilung",line(990,709,1120,709,C.accent,2,true)+plot(scene,"intro-weibull.svg",1130,155,570,660))
    +g("intro_formula","Weibull-Funktion",formula("weibull-function.svg",1240,820,380,84,"F(t) = 1 minus e hoch minus (t/T) hoch b"))
    +g("intro_parameter_t","Charakteristische Lebensdauer",text(1200,941,"T",28,650)+text(1250,941,"charakteristische Lebensdauer",25))
    +g("intro_parameter_b","Formparameter",text(1200,981,"b",28,650)+text(1250,981,"Formparameter",25));
  return {body, feedbackRevision:true, steps:[
    step("intro_1","In diesem Abschnitt lernen wir"),
    step("intro_2","können wir sie auswerten"),
    step("intro_relation","Das Ziel ist es"),
    step("intro_3","Dafür wenden wir geeignete statistische Methoden an"),
    step("intro_4","die Parameter der zugrundeliegenden Lebensdauerverteilung"),
    step("intro_5","In diesem Fall nutzen wir die Weibullverteilung"),
    step("intro_formula","mithilfe einer mathematischen Formel beschreiben"),
    step("intro_parameter_t","Die charakteristische Lebensdauer"),
    step("intro_parameter_b","während der Formparameter"),
    step("intro_5","Vergleiche anstellen, Berechnungen durchführen und Prognosen erstellen","highlight"),
    step("intro_3","Dafür nutzen wir die grafische Methode","highlight"),
  ]};
}
const subs=["₁","₂","₃","₄","₅","₆","₇"];
function failureMark(x,y,color=C.accent,kind="x",radius=9){
  return kind==="x"?line(x-radius,y-radius,x+radius,y+radius,color,3)+line(x-radius,y+radius,x+radius,y-radius,color,3):line(x-radius,y,x+radius,y,color,3)+line(x,y-radius,x,y+radius,color,3);
}
function timeline(x,y,w,values,label,color=C.accent,kind="x") {
  return text(x,y-54,label,28,600,color)+line(x,y,x+w,y,C.accent,2,true)+values.map(v=>{
    const px=x+w*v.pos;
    return failureMark(px,y,v.color||color,v.kind||kind)+text(px,y+41,`t${subs[v.id-1]}`,24,500,v.color||color,"middle");
  }).join("")+text(x+w,y+41,"t",24,500,C.text,"end");
}
function buildMechanisms(scene) {
  const ts=[12,20,35,57,72,108];
  const vals=ts.map((v,i)=>({id:i+1,pos:.06+.81*v/108,color:[1,3,6].includes(i+1)?C.accent:C.technical,kind:[1,3,6].includes(i+1)?"x":"+"}));
  const body=g("mechanisms_joint","Gemeinsame Ausfallzeiten",timeline(112,326,650,vals,"Gemeinsame Ausfallzeiten")+failureMark(122,422,C.accent)+text(145,431,"Mechanismus A",25,500)+failureMark(420,422,C.technical,"+")+text(443,431,"Mechanismus B",25,500,C.technical))
    +g("mechanisms_split","Nach Mechanismus trennen",line(818,325,940,325,C.accent,2,true)+timeline(1040,258,710,vals.filter(v=>[1,3,6].includes(v.id)),"Ausfallmechanismus A")+timeline(1040,425,710,vals.filter(v=>[2,4,5].includes(v.id)),"Ausfallmechanismus B",C.technical,"+"))
    +g("mechanisms_plot","Getrennte Auswertung im Weibullnetz",plot(scene,"mechanisms.svg",112,526,1150,438))
    +g("mechanism_a_label","Weibullgerade A",line(1340,597,1400,597,C.accent,3)+text(1420,607,"Mechanismus A",28,600))
    +g("mechanism_b_label","Weibullgerade B",line(1340,670,1400,670,C.technical,3)+text(1420,680,"Mechanismus B",28,600,C.technical))
    +g("mechanisms_total","Gesamtzuverlässigkeit",line(1340,756,1780,756,C.border,1.5)+lines(1340,813,["Verteilungen wieder","zur Gesamtzuverlässigkeit","zusammenführen"],28,550,C.text,"start",43));
  return {body,feedbackRevision:true,steps:[step("mechanisms_joint","Als erstes müssen uns Lebensdauerdaten"),step("mechanisms_split","getrennt voneinander erfolgen"),step("mechanisms_plot","zwei Ausfallmechanismen A und B vorliegen"),step("mechanism_a","Eine für den Ausfallmechanismus A"),step("mechanism_a_label","Eine für den Ausfallmechanismus A"),step("mechanism_b","und eine für den Ausfallmechanismus B"),step("mechanism_b_label","und eine für den Ausfallmechanismus B"),step("mechanisms_total","Diese können dann wieder miteinander verrechnet werden")],dependencies:{mechanisms_split:["mechanisms_joint"],mechanism_a:["mechanisms_plot"],mechanism_b:["mechanisms_plot"],mechanisms_total:["mechanism_a","mechanism_b"]}};
}
function buildCensored(scene) {
  const vals=[18,33,57,69].map((t,i)=>({id:i+1,pos:t/102,color:C.failure}));
  const body=g("censored_timeline","Beobachtete Ausfälle",timeline(112,340,870,vals,"Beobachtete Ausfälle",C.failure))
    +g("censored_cutoff","Testabbruch",line(828,309,828,368,C.technical,4)+line(835,340,864,340,C.technical,3,true)+text(828,440,"Testabbruch",26,600,C.technical,"middle"))
    +g("censored_plot","Zuordnung zu sechs Objekten",line(1010,340,1090,340,C.accent,2,true)+plot(scene,"objects.svg",1090,186,690,398))
    +g("censored_context","Bekannte Überlebensdauer",text(1180,639,"Bekannt",27,650)+text(1180,683,"Bis zum Testabbruch funktionsfähig",27))
    +g("censored_unknown","Unbekannter Ausfallzeitpunkt",text(1180,761,"Unbekannt",27,650)+text(1180,805,"Der spätere Ausfallzeitpunkt",27))
    +g("censored_evaluation","Auswertung berücksichtigt Zensierungen",plot(scene,"evaluation.svg",112,560,885,409)+line(1180,855,1790,855,C.border,1.5)+lines(1180,900,["Zensierte Informationen gehören","in die Auswertung."],29,600,C.text,"start",42));
  return {body,feedbackRevision:true,steps:[step("censored_timeline","Außerdem müssen Lebensdauerdaten nicht zwingend"),step("censored_cutoff","den Test vorzeitig abbrechen"),step("censored_plot","wenn manche Objekte noch nicht ausgefallen sind"),step("censored_context","eine bestimmte Lebensdauer überlebt hat"),step("censored_unknown","Hierbei spricht man von Zensierung"),step("censored_evaluation","in der Auswertung mitberücksichtigen"),step("censored_plot","welche Arten von Zensierung es gibt","highlight")],dependencies:{censored_cutoff:["censored_timeline"],censored_plot:["censored_cutoff"],censored_evaluation:["censored_context","censored_unknown"]}};
}
function buildMethods(scene) {
  const body=g("method_graphical","Grafische Methode",text(112,224,"Grafische Methode",38,650)+text(112,278,"Median-Rang-Verfahren",28)+plot(scene,"graphical-method.svg",105,324,780,380)+text(112,748,"Anschaulich im Weibullnetz",29,600))
    +g("method_calculation","Berechnungsmethoden",text(1040,224,"Berechnungsmethoden",38,650)+text(1040,278,"Analytisch oder numerisch",28))
    +g("method_accuracy","Höhere Genauigkeit",text(1040,345,"Höhere Genauigkeit",30,600))
    +g("method_mls","Methode der kleinsten Quadrate",text(1040,454,"MLS",54,650)+lines(1040,516,["Methode der","kleinsten Quadrate"],28,500,C.text,"start",39))
    +g("method_mle","Maximum-Likelihood-Schätzung",text(1500,454,"MLE",54,650)+lines(1500,516,["Maximum-Likelihood-","Schätzung"],28,500,C.text,"start",39))
    +g("method_complexity","Mathematische Komplexität",line(1040,633,1795,633,C.border,1.5)+text(1040,690,"Mathematisch komplexer",30,600))
    +g("method_software","Software übernimmt die Berechnung",rect(112,819,1686,87,C.accentSoft)+text(146,874,"Software übernimmt die Berechnung.",30,600))
    +g("method_understanding","Methoden bewusst anwenden",text(112,964,"Du verstehst die Hintergründe und wählst die passende Methode.",31,600));
  return {body,feedbackRevision:true,steps:[step("method_graphical","Bisher haben wir die grafische Methode"),step("method_calculation","Es gibt jedoch auch Berechnungs-Methoden"),step("method_accuracy","eine höhere Genauigkeit bieten"),step("method_mls","die Methode der kleinsten Quadrate"),step("method_mle","sowie die Maximum-Likelihood-Schätzung"),step("method_complexity","Der Nachteil dieser Methoden"),step("method_software","dafür gibt es Software"),step("method_understanding","Dennoch ist es wichtig"),step("method_understanding","fehlerhafte oder ungenaue Ergebnisse entstehen","highlight"),step("method_understanding","Sei dir also immer bewusst","highlight")],dependencies:{method_accuracy:["method_calculation"],method_mls:["method_calculation"],method_mle:["method_calculation"],method_complexity:["method_mls","method_mle"]}};
}
function buildConfidence(scene) {
  const vals=[12,20,35,57,72,108].map((t,i)=>({id:i+1,pos:.06+.81*t/108}));
  const body=g("confidence_data","Ausfalldaten als Ausgangspunkt",timeline(200,258,890,vals,"Ausfalldaten"))
    +g("confidence_plot","Weibull-Schätzung",plot(scene,"confidence.svg",112,395,1135,565))
    +g("confidence_estimate","Weibullverteilung als Punktschätzung",line(1330,466,1400,466,C.accent,3)+text(1420,476,"Weibullverteilung",32,650)+lines(1330,538,["Schätzung aus den","beobachteten Ausfällen"],28,500,C.text,"start",41))
    +g("confidence_bounds","Zusätzlicher Vertrauensbereich",line(1330,666,1400,666,C.technical,3,false,"8 6")+text(1420,676,"Vertrauensbereich",32,650,C.technical)+lines(1330,738,["5-%- und 95-%-Grenze","ergänzen die Schätzung"],28,500,C.text,"start",41))
    +g("confidence_next","Überleitung zur nächsten Lektion",line(1330,843,1795,843,C.border,1.5)+lines(1330,889,["Warum du ihn brauchst,","zeigt die nächste Lektion."],28,550,C.text,"start",41));
  return {body,feedbackRevision:true,steps:[step("confidence_data","Aber keine Sorge"),step("confidence_plot","im Laufe dieses Trainings erhältst du"),step("confidence_estimate","die Weibullverteilung nur einen Teil des Ergebnisses"),step("confidence_limits","zusätzlich einen sogenannten Vertrauensbereich"),step("confidence_bounds","zusätzlich einen sogenannten Vertrauensbereich"),step("confidence_next","Warum dieser notwendig ist"),step("confidence_bounds","welche Aussagekraft er besitzt","highlight")],dependencies:{confidence_plot:["confidence_data"],confidence_limits:["confidence_plot"],confidence_bounds:["confidence_limits"]}};
}
const builders = {intro:buildIntro,mechanisms_overview:buildMechanisms,censored_overview:buildCensored,method_choice:buildMethods,confidence_intro:buildConfidence};
function refineWorkflow(content) {
  const pairPhrase="für jeden Ausfallzeitpunkt einen Wert";
  const transfers=["Im Anschluss können","wir unsere Ausfallzeiten","zusammen mit den","entsprechenden Ausfallwahrscheinlichkeiten als","Punkte in das","Weibull-Wahrscheinlichkeits-Papier mit doppellogarithmischer","doppellogarithmischer Darstellung eintragen"];
  const steps=[step("workflow_timeline","Ausfalldaten in Form unterschiedlicher Zeitwerte"),step("workflow_timeline","Diese müssen zunächst der Größe nach","highlight"),step("workflow_formula","Näherungsformel des Median-Rang-Verfahrens"),step("workflow_probability_map",pairPhrase),...Array.from({length:7},(_,i)=>step(`workflow_pair_${i+1}`,pairPhrase)),step("workflow_weibull_plot",transfers[0])];
  for(let i=0;i<7;i++) steps.push(step(`workflow_pair_${i+1}`,transfers[i],"highlight"),step(`workflow_point_${i+1}`,transfers[i]));
  steps.push(step("plot_weibull_fit","eine Ausgleichsgerade durch die Punkte","draw"),step("workflow_parameters","Sobald die Gerade festgelegt ist"),step("workflow_result","Damit haben wir die Weibullverteilung bestimmt"),step("workflow_timeline","wie man aus Ausfallzeiten eine Weibullverteilung ermittelt","highlight"),step("workflow_result","Prognosen für zukünftige Ausfälle erstellen","highlight"));
  return {...content,feedbackRevision:true,steps,dependencies:Object.fromEntries(Array.from({length:7},(_,i)=>[`workflow_point_${i+1}`,["workflow_weibull_plot",`workflow_pair_${i+1}`]]))};
}
function annotateEvidence(body,scene) {
  const narration={
    "und Systemen abschätzen":"das Ausfallverhalten der Komponente oder des Systems abzuschätzen",
    "Gemeinsame Ausfallzeiten":"mehrere Ausfallmechanismen einer Komponente verfügbar sein",
    "Verteilungen wieder":"Diese können dann wieder miteinander verrechnet werden",
    "zur Gesamtzuverlässigkeit":"um die Gesamtzuverlässigkeit der Komponente zu erhalten",
    "zusammenführen":"Diese können dann wieder miteinander verrechnet werden",
    "Beobachtete Ausfälle":"nicht zwingend ausschließlich als Ausfallzeiten",
    "Testabbruch":"den Test vorzeitig abbrechen",
    "Bekannt":"eine bestimmte Lebensdauer überlebt hat und noch funktioniert",
    "Bis zum Testabbruch funktionsfähig":"eine bestimmte Lebensdauer überlebt hat und noch funktioniert",
    "Unbekannt":"wenn manche Objekte noch nicht ausgefallen sind",
    "Der spätere Ausfallzeitpunkt":"wenn manche Objekte noch nicht ausgefallen sind",
    "Zensierte Informationen gehören":"Diese zensierten Informationen sind für uns ebenfalls relevant",
    "in die Auswertung.":"in der Auswertung mitberücksichtigen",
    "Berechnungsmethoden":"Es gibt jedoch auch Berechnungs-Methoden",
    "Mathematisch komplexer":"Der Nachteil dieser Methoden ist ihre mathematische Komplexität",
    "Software übernimmt die Berechnung.":"dafür gibt es Software",
    "Du verstehst die Hintergründe und wählst die passende Methode.":"die Hintergründe zu verstehen. Nur so können wir sicherstellen, dass die richtige Methode angewendet wurde",
    "Schätzung aus den":"die Weibullverteilung nur einen Teil des Ergebnisses darstellt",
    "beobachteten Ausfällen":"Immer wenn wir Lebensdauerdaten auswerten",
    "ergänzen die Schätzung":"benötigen wir zusätzlich einen sogenannten Vertrauensbereich",
    "Warum du ihn brauchst,":"Warum dieser notwendig ist",
    "zeigt die nächste Lektion.":"erfährst du in der nächsten Lektion",
  };
  return body.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/g,(all,attrs,inner)=>{
    if(attrs.includes("data-source-evidence="))return all;
    const value=inner.replace(/<[^>]*>/g,"").trim();
    let evidence,reference;
    if(narration[value]){evidence="spoken_text";reference=`${scene.source_text_section_id}: ${narration[value]}`;}
    else if(value==="Anschaulich im Weibullnetz"){evidence="orientation";reference="RE3 Folie13.SVG: grafische Methode im dargestellten Wahrscheinlichkeitspapier";}
    else if(/^(?:[\d,.]+(?:\s*%)?|t[₁₂₃₄₅₆₇ₙ]|F\(t[₁₂₃₄₅₆₇ᵢ]\)|t₁ ≤|F\(tᵢ\) aus|hier: n|bei F\(t\)|0[1-5] ·|WEIBULL-FUNKTION ANWENDEN|Beispiel aus der Quelle|Beobachtungszeit t)/.test(value)){
      evidence="orientation";reference=`RE3 Quellen ${scene.source_slides.join(",")}; Achsenskalierung / Rangzuordnung, Formeln und lokale data/ des ${scene.work_unit}`;
    }else if(["5-%-Grenze","95-%-Grenze","5-%- und 95-%-Grenze","Ausfalldaten","Weibullgerade","Lebensdauer t [10⁶ LC]"].includes(value)){
      evidence="orientation";reference=`source-materials/basis-seminar/powerpoint-svg/RE3/SVG/Folie${scene.primary_source_slide}.SVG: ursprüngliche Diagrammbegriffe und Einheiten`;
    }
    return evidence?`<text${attrs} data-source-evidence="${evidence}" data-source-reference="${esc(reference)}">${inner}</text>`:all;
  });
}
module.exports={builders, refineWorkflow, annotateEvidence, plot, text, lines, rect, line, g, step, formula};
