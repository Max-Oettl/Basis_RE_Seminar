"use strict";
const fs=require('node:fs');
const path=require('node:path');
const C=require('./reltest-education-theme').colors;
const {text,lines,rect,line,g,step}=require('./re3-feedback-builders');
const {heading,label,plate}=require('./re3-confidence-feedback-builders');
const {wire,node}=require('./re4-feedback-builders');
const {pack:basePack,block,terminal,seriesParts,parallel,mixedParts,transient,note}=require('./re4-rbd-feedback-builders');
const reviewRoot='analysis/render-checks/RE4/feedback-54-66-2026-09-17';
const pack=(body,steps=[],dependencies={})=>({...basePack(body,steps,dependencies),reviewRoot,feedbackAudit:'analysis/rebuild-plans/RE4_feedback_54_66_2026-09-17.md',referenceLock:['RE4::39','RE4::41','RE4::48']});
const formula=(name,x,y,w,h,description)=>`<image href="formulas/${name}.svg" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" data-formula-asset="formulas/${name}.svg" data-qc-role="formula" aria-label="${description}"/>`;
function booleanDefinition(){
  const body=label(112,159,1040,'Definition: Boolesches Modell')
    +heading(112,319,'Eine einfache, gebräuchliche Methode',36)
    +lines(112,384,['Systemelemente werden über logische Beziehungen','zwischen Ereignissen oder Zuständen verknüpft.'],31,500,C.text,'start',45)
    +heading(112,542,'Zuverlässigkeit vorhersagen',36)
    +lines(112,604,['Die Zuverlässigkeit des Systems wird','mit Hilfe der booleschen Algebra bestimmt.'],31,500,C.text,'start',45)
    +plate(112,768,1010,145,heading(140,813,'Boolesche Variablen',31)+formula('boolean-variables',145,830,410,65,'x_i und y sind Elemente von 0 und 1')+lines(650,830,['xᵢ: Komponentenzustand','y: Systemzustand'],27,500,C.text,'start',39))
    +heading(1270,319,'Positivlogik',36)
    +rect(1270,392,88,88,C.educationAccentSoft)+heading(1297,454,'1',52,C.educationAccent)+text(1390,449,'Funktionsfähig',32,600)
    +rect(1270,544,88,88,C.accentSoft)+heading(1297,606,'0',52,C.failure)+text(1390,601,'Ausgefallen',32,600);
  return pack(body);
}
function bridge(x,y,w=650,h=300){
  const left=x+48,right=x+w-48,mid=x+w/2,b1=left+35,b3=right-163,cy=y+h/2;
  return wire(`M${x} ${cy}H${left} M${left} ${y}V${y+h} M${right} ${y}V${y+h} M${right} ${cy}H${x+w} M${left} ${y}H${b1} M${b1+128} ${y}H${b3} M${b3+128} ${y}H${right} M${left} ${y+h}H${b1} M${b1+128} ${y+h}H${b3} M${b3+128} ${y+h}H${right} M${mid} ${y}V${cy-31} M${mid} ${cy+31}V${y+h}`)
    +terminal(x,cy,'E')+terminal(x+w,cy,'A')+block(b1,y-31,'1')+block(b1,y+h-31,'2')+block(b3,y-31,'3')+block(b3,y+h-31,'4')+block(mid-64,cy-31,'5');
}
function separation(){
  const body=g('separation_bridge','Brückenschaltung',label(112,159,730,'Brückenschaltung')+bridge(160,385,650,300))
    +g('separation_limit','Keine direkte Reduktion',heading(1010,272,'Keine direkte Reduktion',36)+lines(1010,326,['Mit Reihen- und Parallelformeln','allein nicht lösbar.'],31,500,C.text,'start',43))
    +g('separation_hub','Zwei exakte Berechnungsmethoden',label(1010,440,798,'Zwei exakte Berechnungsmethoden'))
    +g('separation_method','Methode der Separation',wire('M1409 506V562H1200V620')+plate(1010,620,374,128,heading(1037,666,'1 · Separation',32)+text(1037,713,'Komponente isolieren',27,500)))
    +g('multilinear_method','Methode der Multilinearform',wire('M1409 506V562H1605V620')+heading(1450,666,'2 · Multilinearform',31))
    +g('separation_selection','Separation in diesem Modul',note(1010,832,'In diesem Modul: Separation',[]))
    +g('separation_key','Schlüsselrolle der Komponente 5',`<rect x="415" y="498" width="140" height="74" rx="8" fill="none" stroke="${C.educationAccent}" stroke-width="4"/>`+note(160,807,'Komponente 5 verbindet die beiden Pfade',['Sie macht die Struktur zur Brückenschaltung.']));
  return pack(body,[step('separation_bridge','Bei einer Brückenschaltung lässt sich'),step('separation_limit','mit den einfachen Formeln'),step('separation_hub','es gibt zwei Methoden'),step('separation_method','Erstens: die Methode der Separation.'),step('multilinear_method','Und Zweitens: die Methode der Multilinearform.'),step('separation_selection','In diesem Modul schauen wir'),step('separation_key','Komponente fünf nimmt eine Schlüsselrolle ein.')],{separation_limit:['separation_bridge'],separation_method:['separation_hub'],multilinear_method:['separation_hub'],separation_selection:['separation_method'],separation_key:['separation_bridge']});
}
function separated(x,y,working){
  const w=630,left=x+50,right=x+w-50,a=x+92,b=x+410,mid=x+w/2,cy=y+64;
  let s=wire(`M${x} ${cy}H${left} M${left} ${y}V${y+128} M${right} ${y}V${y+128} M${right} ${cy}H${x+w}`)+terminal(x,cy,'E')+terminal(x+w,cy,'A');
  for(const [i,yy] of [y,y+128].entries())s+=wire(`M${left} ${yy}H${a} M${a+128} ${yy}H${b} M${b+128} ${yy}H${right}`)+block(a,yy-31,String(i+1))+block(b,yy-31,String(i+3));
  if(working)s+=wire(`M${mid} ${y}V${y+128}`);
  return s;
}
function separationCases(){
  const body=g('case_working_head','Komponente 5 funktioniert',label(112,159,770,'Fall I · funktionsfähig')+text(112,278,'Komponente 5 funktioniert ständig.',29,600,C.educationAccent))
    +g('case_failed_head','Komponente 5 fällt aus',label(1038,159,770,'Fall II · ausgefallen')+text(1038,278,'Komponente 5 ist ständig ausgefallen.',29,600,C.failure))
    +g('case_working_rbd','Zwei Parallelschaltungen in Serie',separated(178,361,true)+text(178,567,'Zwei Parallelschaltungen in Serie',29,600))
    +g('case_failed_rbd','Zwei Serienpfade parallel',separated(1104,361,false)+text(1104,567,'Zwei Serienpfade parallel',29,600))
    +transient('case_working_formula','Gewichtete Zuverlässigkeit bei Funktion',heading(112,668,'Fallgewicht R₅',30,C.educationAccent)+formula('case-working-line1',112,706,770,62,'R_I gleich R_5 mal 1 minus (1 minus R_1)(1 minus R_2)')+formula('case-working-line2',112,786,770,62,'mal 1 minus (1 minus R_3)(1 minus R_4)'))
    +transient('case_failed_formula','Gewichtete Zuverlässigkeit bei Ausfall',heading(1038,668,'Fallgewicht 1 − R₅',30,C.failure)+formula('case-failed-line1',1038,706,770,62,'R_II gleich 1 minus R_5')+formula('case-failed-line2',1038,786,770,62,'mal 1 minus (1 minus R_1 R_3)(1 minus R_2 R_4)'))
    +g('separation_total','Vollständige Systemzuverlässigkeit',line(112,626,1808,626,C.border,1.5)+heading(112,692,'Beide Teilergebnisse addieren',33)+formula('bridge-total',112,732,420,72,'R_S gleich R_I plus R_II')+formula('bridge-expanded-working',610,686,1198,65,'R_S gleich R_5 mal zwei parallele Teilzuverlässigkeiten')+formula('bridge-expanded-failed',610,772,1198,65,'plus 1 minus R_5 mal Zuverlässigkeit der parallelen Serienpfade'))
    +g('separation_theorem','Satz der totalen Wahrscheinlichkeit',note(112,895,'Satz der totalen Wahrscheinlichkeit',['Zwei sich gegenseitig ausschließende Fälle ergeben die exakte Systemzuverlässigkeit.']));
  return pack(body,[step('case_working_head','Erstens, Komponente fünf ist ständig funktionsfähig.'),step('case_failed_head','Und zweitens, Komponente fünf ist ständig ausgefallen.'),step('case_working_rbd','Ist die Komponente fünf ständig funktionsfähig,'),step('case_failed_rbd','Und ist die Komponente fünf ständig ausgefallen,'),step('case_working_formula','Im ersten Fall, also wenn'),step('case_working_formula','einfach mit der restlichen Systemzuverlässigkeit multipliziert.','highlight'),step('case_failed_formula','Im zweiten Fall, also wenn'),step('case_failed_formula','Diese ergibt sich einfach zu eins minus','highlight'),step('case_working_formula','Am Ende addieren wir beide Teilergebnisse,','hide'),step('case_failed_formula','Am Ende addieren wir beide Teilergebnisse,','hide'),step('separation_total','um die gesamte Systemzuverlässigkeit zu berechnen.'),step('separation_theorem','Satz der totalen Wahrscheinlichkeit'),step('separation_theorem','große Vorteil der Methode:Man','highlight')],{case_working_rbd:['case_working_head'],case_failed_rbd:['case_failed_head'],case_working_formula:['case_working_rbd'],case_failed_formula:['case_failed_rbd'],separation_total:['case_working_rbd','case_failed_rbd'],separation_theorem:['separation_total']});
}
function methodOverview(){
  const body=label(112,159,720,'Methoden')+label(1010,159,798,'Einsatz und Rechenaufwand')
    +heading(140,333,'Systemtheorie nach Boole',35)+line(809,320,940,320,C.accent,2.5,true)
    +heading(1038,313,'Einfach und praxisgerecht',34)+text(1038,361,'Für die Praxis ausreichend.',30)
    +line(112,415,1808,415,C.border,1.5)
    +lines(140,487,['Markov-Theorie','Petri-Netze','Monte-Carlo-Simulation','Momenten-Methode'],33,600,C.accent,'start',77)
    +wire('M817 455H846V734H817 M846 594H940')
    +heading(1038,558,'Für komplexere Systeme',34)+lines(1038,613,['Zum Beispiel für Systeme mit','reparierbaren Komponenten.'],30,500,C.text,'start',43)
    +line(112,777,1808,777,C.border,1.5)
    +heading(140,867,'Mellin-Transformation',35)+line(809,854,940,854,C.accent,2.5,true)
    +heading(1038,847,'Analytisch korrekte Methode',34)+text(1038,895,'Komplexe Berechnung.',30);
  return pack(body);
}
const icon=(name,x,y)=>`<image href="media/${name}.png" x="${x}" y="${y}" width="124" height="124" preserveAspectRatio="xMidYMid meet" data-pictogram-source="approved-png-library"/>`;
function booleanSummary(){
  const body=label(112,159,510,'01 · Zwei Zustände')+icon('shield',112,284)
    +text(112,490,'1 · funktionsfähig',32,600,C.educationAccent)+text(112,555,'0 · ausgefallen',32,600,C.failure)
    +lines(112,659,['Jedes Bauelement nimmt','genau einen der beiden','Zustände an.'],29,500,C.text,'start',43)
    +label(705,159,510,'02 · Nicht reparierbar')+icon('wrench-alert',705,284)
    +heading(705,490,'Ausfall bleibt bestehen',31)
    +lines(705,555,['Der erste Systemausfall','beendet die Lebensdauer','des Systems.'],29,500,C.text,'start',43)
    +label(1298,159,510,'03 · Unabhängig')+icon('layers',1298,284)
    +heading(1298,490,'Keine Wechselwirkung',31)
    +lines(1298,555,['Das Ausfallverhalten eines','Bauelements wird durch','andere nicht beeinflusst.'],29,500,C.text,'start',43)
    +note(112,858,'Voraussetzungen vor der Berechnung prüfen',[]);
  return {...pack(body),pictograms:[['shield.png','shield','Funktionszustand'],['wrench-alert.png','wrenchAlert','Nicht reparierbar'],['layers.png','layers','Unabhängige Komponenten']]};
}
function structureReference(){
  const boundary=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${C.muted}" stroke-width="1.5" stroke-dasharray="7 6"/>`;
  const body=label(112,159,510,'Serie')+label(705,159,510,'Parallel')+label(1298,159,510,'Gemischt')
    +boundary(154,315,430,184)+text(154,289,'Systemgrenze',24,500,C.muted)
    +wire('M128 410H168 M262 410H294 M388 410H420 M455 410H486 M580 410H608')+terminal(128,410,'E')+terminal(608,410,'A')
    +block(168,382,'1',{w:94,h:56})+block(294,382,'2',{w:94,h:56})+block(486,382,'n',{w:94,h:56})+text(437,418,'…',28,600,C.accent,'middle')
    +boundary(773,286,370,270)+text(773,271,'Systemgrenze',24,500,C.muted)
    +wire('M752 420H816 M816 325V515 M1098 325V515 M1098 420H1162 M816 325H893 M1021 325H1098 M816 401H893 M1021 401H1098 M816 515H893 M1021 515H1098')
    +terminal(752,420,'E')+terminal(1162,420,'A')+block(893,294,'1')+block(893,370,'2')+block(893,484,'n')+text(957,469,'⋮',29,500,C.accent,'middle')
    +`<g transform="translate(1248 316) scale(.8)">${mixedParts(100,0)}</g>`
    +formula('series-product',126,573,482,110,'R_S(t) ist das Produkt der R_i(t) von i gleich 1 bis n')
    +formula('parallel-product',705,573,510,110,'R_S(t) gleich 1 minus Produkt der 1 minus R_i(t) von i gleich 1 bis n')
    +formula('parallel-failure',755,699,410,85,'F_S(t) ist das Produkt der F_i(t) von i gleich 1 bis n')
    +formula('mixed-product',1298,599,510,70,'R_S gleich R_1 mal 1 minus (1 minus R_2)(1 minus R_3)')
    +lines(1298,739,['Zuerst Parallelteil 2 und 3,','dann mit Komponente 1','in Serie verknüpfen.'],28,500,C.text,'start',40)
    +text(112,826,'Beispiel: 3 unabhängige Komponenten mit je Rᵢ = 0,9',27,600)
    +formula('series-example',135,853,464,67,'R_S gleich 0,9 hoch 3 gleich 0,729')
    +formula('parallel-example',717,853,486,67,'R_S gleich 1 minus 0,1 hoch 3 gleich 0,999')
    +text(112,972,'Alle Komponenten erforderlich.',27,600)
    +text(705,972,'Ein funktionsfähiger Pfad genügt.',27,600)
    +text(1298,972,'Teilstruktur zuerst reduzieren.',27,600);
  return pack(body);
}
function componentCount(){
  const body=label(112,159,680,'Serienstruktur')
    +heading(112,329,'Mehr Bauteile,',42)+heading(112,385,'geringere Systemzuverlässigkeit',38)
    +lines(112,472,['Mit jedem weiteren Bauteil wird','ein zusätzlicher Zuverlässigkeitswert','in das Produkt aufgenommen.'],30,500,C.text,'start',44)
    +formula('identical-series',132,627,600,96,'R_S(t) gleich R_B(t) hoch n')
    +lines(112,780,['Für unabhängige Bauteile mit gleicher','Bauteilzuverlässigkeit.'],28,500,C.text,'start',41)
    +lines(112,909,['Je geringer die Bauteilzuverlässigkeit,','desto stärker der Abfall.'],29,600,C.text,'start',40)
    +`<image href="plots/series-component-count.svg" x="960" y="143" width="848" height="842" preserveAspectRatio="xMidYMid meet" data-plot-asset="plots/series-component-count.svg" aria-label="Systemzuverlässigkeit über 0 bis 300 Komponenten; Bauteilzuverlässigkeiten 99,9, 99,5, 99 und 95 Prozent"/>`;
  return pack(body);
}
function sourceCrop(id,x,y,w,h,crop){
  return `<svg id="${id}" x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${crop}" preserveAspectRatio="xMidYMid meet" overflow="hidden" data-source-asset="RE4 source 067 img4.png"><image href="media/freilauf-ableitung.png" width="621" height="701"/></svg>`;
}
function freewheel(){
  const body=label(112,159,660,'1 · Konstruktion und Funktion')+label(860,159,948,'2 · Ausfallursachen unterscheiden')
    +heading(112,282,'Konstruktionszeichnung: Freilauf',29)
    +sourceCrop('freewheel_construction',130,303,622,231,'35 0 570 202')
    +heading(112,590,'Prinzipskizze des Systems',29)
    +sourceCrop('freewheel_principle',130,607,622,176,'80 211 520 145')
    +heading(860,303,'Unterbrechung (U) · Serienstruktur',32)
    +seriesParts(1010,360,['F1 | U','F2 | U'],{w:650}).body
    +heading(860,526,'Klemmen (K) · Parallelstruktur',32)
    +parallel(1100,570,['F1 | K','F2 | K'],{w:480,row:95})
    +line(112,797,1808,797,C.border,1.5)
    +heading(112,858,'3 · RBD ableiten',33)+lines(112,908,['Zuverlässigkeitsschaltbild','für das System „Freilauf“'],28,500,C.text,'start',40)
    +wire('M735 901H790 M918 901H995 M1123 901H1195 M1195 851V951 M1195 851H1300 M1195 951H1300 M1428 851H1580 M1428 951H1580 M1580 851V951 M1580 901H1750')
    +terminal(735,901,'E')+terminal(1750,901,'A')+block(790,870,'F1 | U')+block(995,870,'F2 | U')+block(1300,820,'F1 | K')+block(1300,920,'F2 | K');
  return pack(body);
}
module.exports={builders:{boolean_states:booleanDefinition,bridge_separation:separation,bridge_separation_cases:separationCases,method_overview:methodOverview,boolean_summary:booleanSummary,structure_reference:structureReference,component_count_plot:componentCount,freewheel_transfer:freewheel},pack,formula};
