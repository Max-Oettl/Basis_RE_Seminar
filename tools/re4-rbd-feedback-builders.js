"use strict";
const C=require('./reltest-education-theme').colors;
const {text,lines,rect,line,g,step}=require('./re3-feedback-builders');
const {heading,label,plate}=require('./re3-confidence-feedback-builders');
const {pack:basePack,wire}=require('./re4-feedback-builders');
const {reviewRoot}=require('./re4-rbd-feedback-support');
const pack=(body,steps,dependencies={})=>({...basePack(body,steps,dependencies),reviewRoot,feedbackAudit:'analysis/rebuild-plans/RE4_feedback_31_48_2026-09-17.md',referenceLock:['RE4::23','RE4::25','RE3::43']});
const transient=(id,name,body)=>g(id,name,body).replace(`data-qc-group="${id}"`,`data-qc-group="${id}" style="opacity:0"`);
const note=(x,y,title,ss,w=700)=>line(x,y,x,y+(ss.length?77:38),C.educationAccent,4)+heading(x+24,y+26,title,31)+lines(x+24,y+67,ss,27,500,C.text,'start',36);
const terminal=(x,y,s)=>`<circle cx="${x}" cy="${y}" r="5" fill="${C.accent}"/>`+text(x+(s==='E'?-23:23),y+9,s,26,650,C.accent,s==='E'?'end':'start');
const formula=(name,x,y,w,h,description)=>`<image href="formulas/${name}.svg" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" data-formula-asset="formulas/${name}.svg" data-qc-role="formula" aria-label="${description}"/>`;
function block(x,y,s,{w=128,h=62,state='neutral'}={}){
  const color=state==='working'?C.educationAccent:state==='failed'?C.failure:C.accent;
  return `<g data-rbd-block="${s}" data-rbd-state="${state}">`+rect(x,y,w,h,state==='working'?C.educationAccentSoft:C.surface,color)+text(x+(state==='failed'?w*.32:w/2),y+h/2+10,s,30,600,C.accent,'middle')+(state==='failed'?`<path d="M${x+w-36} ${y+21}l20 20m0-20l-20 20" stroke="${C.failure}" stroke-width="3" stroke-linecap="round" data-role="failure-marker"/>`:'')+'</g>';
}
function seriesParts(x,y,labels=['1','2','3'],{w=600,state='neutral',failed=[],general=false}={}){
  const bw=128,h=62,gap=(w-100-labels.length*bw)/(labels.length-1),cy=y+h/2;
  let blocks=terminal(x,cy,'E')+terminal(x+w,cy,'A'),wires='';let last=x;
  labels.forEach((s,i)=>{const bx=x+50+i*(bw+gap);wires+=wire(`M${last} ${cy} H${bx}`,state==='working'?C.educationAccent:C.accent);blocks+=block(bx,y,s,{state:failed.includes(i)?'failed':state});last=bx+bw;});
  wires+=wire(`M${last} ${cy} H${x+w}`,state==='working'?C.educationAccent:C.accent);
  if(general){const cx=x+50+bw+(bw+gap)*1.5;wires=wire(`M${x} ${cy}H${x+50} M${x+178} ${cy}H${x+50+bw+gap} M${x+178+bw+gap} ${cy}H${cx-22} M${cx+22} ${cy}H${x+50+2*(bw+gap)} M${x+178+2*(bw+gap)} ${cy}H${x+w}`,state==='working'?C.educationAccent:C.accent)+text(cx,cy+6,'…',30,600,C.accent,'middle');}
  return {blocks,wires,body:wires+blocks};
}
function parallel(x,y,labels=['1','2','3'],{w=500,row=92,working=[],failed=[]}={}){
  const bx=x+w/2-64,cy=y+(labels.length-1)*row/2+31,l=x+64,r=x+w-64;
  let body=wire(`M${x} ${cy} H${l} M${l} ${y+31} V${y+(labels.length-1)*row+31} M${r} ${y+31} V${y+(labels.length-1)*row+31} M${r} ${cy} H${x+w}`)+terminal(x,cy,'E')+terminal(x+w,cy,'A');
  labels.forEach((s,i)=>{const yy=y+i*row;const state=working.includes(i)?'working':failed.includes(i)?'failed':'neutral';body+=wire(`M${l} ${yy+31}H${bx} M${bx+128} ${yy+31}H${r}`,state==='working'?C.educationAccent:C.accent)+block(bx,yy,s,{state});});
  return body;
}
function intro(){
  const diagram=seriesParts(205,495,['1','2','n'],{w:925,general:true,state:'working'});
  const body=g('rbd_name','Englische Bezeichnung',label(112,169,1040,'Reliability Block Diagram · RBD'))
    +g('rbd_model','Modell der Systemzuverlässigkeit',heading(112,306,'Systemzuverlässigkeit sichtbar machen',38)+lines(112,358,['Wie wirken die Komponenten','auf die Funktion des Gesamtsystems?'],31,500,C.text,'start',43))
    +g('rbd_blocks','Blöcke und Systemgrenzen',diagram.blocks+heading(1320,305,'Blöcke',34)+lines(1320,352,['Rechtecke stehen für','einzelne Komponenten.'],29,500,C.text,'start',39))
    +g('rbd_connections','Funktionale Verbindungen',diagram.wires+heading(1320,474,'Verbindungen',34)+lines(1320,522,['Linien beschreiben','funktionale Abhängigkeiten.'],29,500,C.text,'start',39))
    +g('rbd_states','Zwei mögliche Zustände',heading(1320,650,'Zwei Zustände',34)+text(1320,701,'Funktionsfähig',29,650,C.educationAccent)+text(1320,744,'Ausgefallen',29,650,C.failure))
    +g('rbd_path','Durchgängiger Funktionspfad',note(112,760,'Ein durchgängiger Pfad von E nach A',['durch funktionsfähige Komponenten → System funktionsfähig.']))
    +g('rbd_ends','Ein- und Ausgang',text(205,614,'Eingang',26,500,C.muted,'middle')+text(1130,614,'Ausgang',26,500,C.muted,'middle'));
  return pack(body,[step('rbd_name','Das Zuverlässigkeitsblockdiagramm wird im Englischen'),step('rbd_model','Es ist ein grafisches Hilfsmittel'),step('rbd_model','welche Wirkung deren Zuverlässigkeit','highlight'),step('rbd_blocks','Das Diagramm besteht im Wesentlichen'),step('rbd_blocks','die einzelne Systemkomponenten repräsentieren','highlight'),step('rbd_connections','und den Verbindungen'),step('rbd_states','Jede Komponente, also jeder Block'),step('rbd_ends','Solange es eine ununterbrochene Verbindung'),step('rbd_ends','durchgängiger Pfad durch funktionsfähige Komponenten','highlight'),step('rbd_path','gilt das Gesamtsystem als funktionsfähig'),step('rbd_path','die Systemfunktion beeinflusst','highlight')],{rbd_connections:['rbd_blocks'],rbd_ends:['rbd_blocks'],rbd_path:['rbd_connections']});
}
function behavior(){
  const names=['1','2','3'];
  const body=g('comparison_heads','Zwei Basisstrukturen',label(112,159,770,'Serienstruktur')+label(1040,159,768,'Parallelstruktur'))
    +g('series_working','Alle Komponenten funktionieren',seriesParts(195,354,names,{w:600,state:'working'}).body+lines(195,472,['Alle Komponenten sind erforderlich.'],28,600))
    +g('series_broken','Ein Ausfall unterbricht den Pfad',seriesParts(195,666,names,{w:600,failed:[1]}).body+text(195,784,'Ein Ausfall → System ausgefallen',28,600,C.failure))
    +transient('parallel_initial','Redundante Komponenten',parallel(1160,276,names,{row:74}))
    +transient('parallel_one_failed','Eine Komponente fällt aus',parallel(1160,276,names,{row:74,failed:[0],working:[1,2]}))
    +g('parallel_survives','Ein funktionsfähiger Pfad genügt',parallel(1160,276,names,{row:74,failed:[0,2],working:[1]})+text(1130,528,'Ein Pfad bleibt funktionsfähig.',28,600,C.educationAccent))
    +g('parallel_broken','Alle Pfade ausgefallen',parallel(1160,588,names,{row:74,failed:[0,1,2]})+text(1130,846,'Alle ausgefallen → System ausgefallen',28,600,C.failure))
    +g('series_rule','Serienbedingung',note(112,887,'Serie: alle',[],740))
    +g('parallel_rule','Parallelbedingung',note(1040,887,'Parallel: mindestens einer',[],740));
  return pack(body,[step('comparison_heads','Grundsätzlich unterscheiden wir zwei Basisstrukturen'),step('series_working','In der Serienstruktur sind alle Komponenten'),step('series_working','wenn alle Komponenten funktionsfähig sind','highlight'),step('series_broken','Fällt auch nur eine Komponente aus'),step('series_rule','Es genügt also ein einziger Ausfall'),step('parallel_initial','In der Parallelstruktur hingegen gibt es Redundanz'),step('parallel_initial','Mehrere Komponenten übernehmen die gleiche Funktion','highlight'),step('parallel_initial','Das bedeutet: Fällt eine Komponente','hide'),step('parallel_one_failed','übernehmen die übrigen ihre Funktion'),step('parallel_one_failed','Dadurch bleibt das System funktionsfähig','hide'),step('parallel_survives','solange mindestens eine der Komponenten funktioniert'),step('parallel_rule','solange mindestens eine der Komponenten funktioniert'),step('parallel_broken','Erst wenn alle parallelen Komponenten gleichzeitig ausfallen'),step('parallel_rule','Durch diese Redundanz erhöht sich die Ausfallsicherheit','highlight')],{series_working:['comparison_heads'],series_broken:['series_working'],series_rule:['series_broken'],parallel_initial:['comparison_heads'],parallel_one_failed:['comparison_heads'],parallel_survives:['comparison_heads'],parallel_broken:['parallel_survives'],parallel_rule:['parallel_survives']});
}
function mathematics(){
  const body=g('math_heads','Serie und Parallelstruktur vergleichen',label(112,159,770,'Serienstruktur')+label(1040,159,768,'Parallelstruktur')+seriesParts(195,330,['1','2','3'],{w:600}).body+parallel(1160,252,['1','2','3'],{row:78}))
    +g('math_series','Produkt der Einzelzuverlässigkeiten',formula('series-product',245,488,505,104,'R_S(t) ist das Produkt von R_i(t), i von 1 bis n'))
    +g('math_parallel','Gegenwahrscheinlichkeiten multiplizieren',formula('parallel-product',1090,488,670,104,'R_S(t) gleich 1 minus Produkt von 1 minus R_i(t), i von 1 bis n'))
    +g('math_assumption','Gültigkeitsannahme der Produktformeln',text(112,619,'Für unabhängige Komponenten',24,500,C.muted))
    +g('math_example','Drei gleiche Komponenten',text(112,660,'Beispiel: drei Komponenten mit jeweils 90 % Zuverlässigkeit',29,600,C.accent))
    +g('math_series_calculation','Serienrechnung mit 0,9',formula('series-example',190,692,605,55,'0,9 mal 0,9 mal 0,9 gleich 0,729'))
    +g('math_series_result','Serienzuverlässigkeit 72,9 Prozent',heading(497,830,'72,9 %',66).replace('text-anchor="start"','text-anchor="middle"'))
    +g('math_parallel_calculation','Parallelrechnung und Ergebnis',formula('parallel-example',1120,692,610,55,'1 minus (1 minus 0,9) hoch 3 gleich 0,999')+heading(1424,830,'99,9 %',66,C.educationAccent).replace('text-anchor="start"','text-anchor="middle"'))
    +g('math_series_rule','Serienstruktur senkt den Gesamtwert',note(112,891,'Serie: Gesamtwert sinkt',['Hier unter dem kleinsten Einzelwert.']))
    +g('math_parallel_rule','Parallelstruktur erhöht den Gesamtwert',note(1040,891,'Parallel: Gesamtwert steigt',['Hier über dem größten Einzelwert.']));
  return pack(body,[step('math_heads','Hat man das Zuverlässigkeitsblockdiagramm eines Systems erstellt'),step('math_assumption','Für die Serienstruktur ergibt sich die Systemzuverlässigkeit'),step('math_series','Für die Serienstruktur ergibt sich die Systemzuverlässigkeit'),step('math_series','durch Multiplikation der Einzelzuverlässigkeiten','highlight'),step('math_parallel','In der Parallelstruktur ist die Berechnung'),step('math_parallel','zunächst die Ausfallwahrscheinlichkeit jeder Komponente','highlight'),step('math_parallel','Diese multipliziert man dann über alle Komponenten','highlight'),step('math_example','Schauen wir uns dazu ein kleines Beispiel'),step('math_example','eine Zuverlässigkeit von neunzig Prozent besitzt','highlight'),step('math_series_calculation','Bei einer Serienstruktur der drei Komponenten'),step('math_series_result','Zuverlässigkeitswert von Zweiundsiebzigkomma neun Prozent'),step('math_parallel_calculation','Bei der Parallelstruktur der drei Komponenten'),step('math_series_rule','die Serienstruktur von Komponenten reduziert'),step('math_parallel_rule','die Parallelschaltung die Zuverlässigkeit des Systems erhöht'),step('math_series_rule','kleiner als die kleinste Einzelzuverlässigkeit','highlight'),step('math_parallel_rule','größer ist als die größte Einzelzuverlässigkeit','highlight')],{math_series:['math_heads'],math_parallel:['math_heads'],math_series_calculation:['math_example','math_series'],math_series_result:['math_series_calculation'],math_parallel_calculation:['math_example','math_parallel'],math_series_rule:['math_series_result'],math_parallel_rule:['math_parallel_calculation']});
}
function mixedParts(x,y){
  const cy=y+120;
  const body=wire(`M${x} ${cy}H${x+50} M${x+178} ${cy}H${x+240} M${x+240} ${y+31}V${y+209} M${x+240} ${y+31}H${x+330} M${x+240} ${y+209}H${x+330} M${x+458} ${y+31}H${x+530} M${x+458} ${y+209}H${x+530} M${x+530} ${y+31}V${y+209} M${x+530} ${cy}H${x+580}`)+terminal(x,cy,'E')+terminal(x+580,cy,'A')+block(x+50,cy-31,'1')+block(x+330,y,'2',{state:'working'})+block(x+330,y+178,'3',{state:'working'});
  return `<g data-rbd-structure="mixed" data-component-relationship="1 series (2 parallel 3)">${body}</g>`;
}
function reduction(){
  const reduced=seriesParts(1175,479,['1','2‖3'],{w:500}).body.replace('data-rbd-block="2‖3" data-rbd-state="neutral"','data-rbd-block="2‖3" data-rbd-state="subsystem"').replace(rect(1497,479,128,62,C.surface,C.accent),rect(1497,479,128,62,C.educationAccentSoft,C.educationAccent));
  const body=g('mixed_context','Kombination der Grundstrukturen',label(112,159,1200,'Gemischte Struktur: Serie + Parallel'))
    +g('mixed_original','Komponente 1 in Serie mit 2 parallel 3',mixedParts(205,390)+text(205,699,'Komponente 1 in Serie mit dem Parallelteil 2‖3',28,500))
    +g('mixed_first','Zuerst das parallele Teilsystem',heading(112,316,'1 · Parallelteil zusammenfassen',36))
    +g('mixed_subsystem','Zuverlässigkeit des parallelen Teilsystems',formula('subsystem',142,739,730,78,'R_2,3 gleich 1 minus (1 minus R_2) mal (1 minus R_3)'))
    +g('mixed_second','Ersatzblock in Serie mit Komponente 1',heading(1060,316,'2 · Serie berechnen',36)+reduced+line(917,510,1055,510,C.accent,2.5,true)+text(1175,610,'2‖3 wird zu einem Ersatzblock.',28,500))
    +g('mixed_product','Serienzuverlässigkeit der Ersatzstruktur',formula('series-reduced',1120,739,660,78,'R_S gleich R_1 mal R_2,3'))
    +g('mixed_result','Gesamtformel der gemischten Struktur',plate(112,873,1696,116,heading(136,922,'Systemzuverlässigkeit',31)+formula('system',586,895,1190,70,'R_S gleich R_1 mal [1 minus (1 minus R_2) mal (1 minus R_3)]')));
  return pack(body,[step('mixed_context','In der Praxis bestehen Systeme oft nicht'),step('mixed_original','sondern aus einer Kombination beider Strukturen'),step('mixed_original','Dabei wird das System schrittweise vereinfacht','highlight'),step('mixed_original','In einem System ist die Komponente eins','highlight'),step('mixed_first','Zuerst berechnet man die Zuverlässigkeit des Parallelsystems'),step('mixed_subsystem','mithilfe der bekannten Formel'),step('mixed_second','Da die Parallelstruktur mit Komponente eins'),step('mixed_product','multiplizieren wir einfach nun den Zuverlässigkeitswert'),step('mixed_result','Auf diese Weise erhalten wir die Systemzuverlässigkeit'),step('mixed_result','Somit können wir auch für komplexere Systeme','highlight')],{mixed_first:['mixed_original'],mixed_subsystem:['mixed_first'],mixed_second:['mixed_subsystem'],mixed_product:['mixed_second'],mixed_result:['mixed_product']});
}
function modelMap(){
  const {boolGate,rbd}=require('./re4-feedback-builders');
  const body=g('map_headers','Drei Darstellungen derselben Logik',label(112,159,480,'Fehlerbaum')+label(722,159,480,'Funktionsbaum')+label(1322,159,486,'Blockdiagramm · RBD'))
    +g('map_rbds','Bekannte Serien- und Parallelstruktur',heading(1342,295,'Serie',33)+rbd(1342,399)+heading(1342,582,'Parallel',33)+rbd(1342,690,true))
    +g('map_function_and','UND-Verknüpfung im Funktionsbaum',boolGate(924,347,'AND')+text(1080,397,'UND',28,650,C.educationAccent))
    +g('map_series_relation','UND bedeutet Serie',line(1213,399,1298,399,C.accent,2.5,true)+text(1342,524,'Alle müssen funktionieren.',27,600))
    +g('map_function_or','ODER-Verknüpfung im Funktionsbaum',boolGate(924,638,'OR')+text(1070,688,'ODER',28,650,C.educationAccent))
    +g('map_parallel_relation','ODER bedeutet Parallelstruktur',line(1213,690,1298,690,C.accent,2.5,true)+text(1342,824,'Mindestens einer genügt.',27,600))
    +g('map_error_gates','Komplementäre Ereignisse im Fehlerbaum',boolGate(318,347,'OR',true)+boolGate(318,638,'AND',true)+text(454,397,'ODER',28,650)+text(454,688,'UND',28,650)+line(602,399,698,399,C.accent,2.5,true)+line(602,690,698,690,C.accent,2.5,true)+text(112,870,'xᵢ: Komponente funktioniert · y: System funktioniert · Überstrich: Ausfall',26,500,C.muted))
    +g('map_direct','Einfaches System direkt modellieren',note(112,938,'Einfache Systeme: RBD auch direkt aufstellen.',[]));
  return pack(body,[step('map_headers','Wir benötigen hierfür also nur das Zuverlässigkeitsblockdiagramm'),step('map_rbds','Wir benötigen hierfür also nur das Zuverlässigkeitsblockdiagramm'),step('map_function_and','Eine und-Verknüpfung im Funktionsbaum'),step('map_series_relation','entspricht dabei einer Reihenschaltung im Zuverlässigkeitsblockdiagramm'),step('map_series_relation','alle Komponenten müssen funktionieren','highlight'),step('map_function_or','Eine ODER-Verknüpfung entspricht einer Parallelschaltung'),step('map_parallel_relation','wenn mindestens eine Komponente funktioniert'),step('map_error_gates','den Umweg über Funktions- oder Fehlerbaum gehen'),step('map_direct','für einfache Systeme lassen sich Zuverlässigkeitsblockdiagramme'),step('map_direct','oft auch direkt aufstellen','highlight')],{map_rbds:['map_headers'],map_function_and:['map_headers'],map_series_relation:['map_function_and','map_rbds'],map_function_or:['map_headers'],map_parallel_relation:['map_function_or','map_rbds'],map_error_gates:['map_function_and','map_function_or'],map_direct:['map_rbds']});
}
const BRIDGE_EDGES=Object.freeze([{component:1,from:'E',to:'upper'},{component:2,from:'E',to:'lower'},{component:3,from:'upper',to:'A'},{component:4,from:'lower',to:'A'},{component:5,from:'upper',to:'lower'}]);
function bridgeParts(){
  const tagged=(n,x,y,opts={})=>{const e=BRIDGE_EDGES.find(e=>e.component===n);return `<g data-component="${n}" data-from="${e.from}" data-to="${e.to}">${block(x,y,String(n),opts)}</g>`;};
  const skeleton=wire('M1000 571 H1060 M1060 451 V691 M1060 451 H1090 M1060 691 H1090 M1218 451 H1550 M1218 691 H1550 M1678 451 H1740 M1678 691 H1740 M1740 451 V691 M1740 571 H1790')+terminal(1000,571,'E')+terminal(1790,571,'A')+tagged(1,1090,420)+tagged(2,1090,660)+tagged(3,1550,420)+tagged(4,1550,660);
  const bridge=wire('M1390 451 V515 M1390 627 V691',C.educationAccent)+tagged(5,1340,515,{w:100,h:112,state:'working'})+`<circle cx="1390" cy="451" r="5" fill="${C.educationAccent}"/><circle cx="1390" cy="691" r="5" fill="${C.educationAccent}"/>`;
  return {skeleton,bridge};
}
function prerequisites(){
  const b=bridgeParts();
  const item=(n,y,title)=>heading(112,y,n,31,C.muted)+heading(190,y,title,34);
  const body=g('assumptions_context','Modellvoraussetzungen',label(112,159,760,'Drei Voraussetzungen'))
    +g('assumptions_states','Nur zwei Komponentenzustände',item('01',314,'Zwei Zustände')+text(190,365,'1 · Funktionsfähig',29,600,C.educationAccent)+text(190,406,'0 · Ausgefallen',29,600,C.failure))
    +g('assumptions_no_middle','Keine Zwischenzustände',text(190,455,'Keine Zwischenstufen oder Wartungszustände.',27,500))
    +transient('assumptions_working','Intakte Komponenten ermöglichen die Funktion',label(952,159,856,'Zustände im Diagramm')+seriesParts(1060,441,['1','2','3'],{w:650,state:'working'}).body+lines(1025,610,['Alle benötigten Komponenten intakt:','Das System ist funktionsfähig.'],29,500,C.text,'start',41))
    +g('assumptions_no_repair','Ausgefallen bleibt ausgefallen',item('02',553,'Nicht reparierbar')+lines(190,606,['Ausgefallen bleibt ausgefallen.','Keine Reparatur im betrachteten Modell.'],28,500,C.text,'start',41))
    +transient('assumptions_failed','Ein Ausfall wird nicht repariert',label(952,159,856,'Zustände im Diagramm')+seriesParts(1060,441,['1','2','3'],{w:650,failed:[1]}).body+lines(1025,610,['Komponente 2 bleibt ausgefallen.','In dieser Serie ist der Pfad unterbrochen.'],29,500,C.text,'start',41))
    +g('assumptions_independent','Statistisch unabhängige Komponenten',item('03',748,'Unabhängige Komponenten')+lines(190,801,['Ein Ausfall verändert die anderen','Ausfallwahrscheinlichkeiten nicht.'],28,500,C.text,'start',40))
    +g('assumptions_no_coupling','Keine gemeinsamen Ursachen',lines(190,903,['Keine gemeinsamen Ursachen,','Kopplungen oder Wechselwirkungen.'],27,500,C.muted,'start',37))
    +g('assumptions_bridge','Komplexere Struktur als Anwendungsgrenze',label(952,159,856,'Brückenschaltung')+b.skeleton)
    +g('assumptions_bridge_link','Komponente 5 verbindet die mittleren Knoten',b.bridge)
    +g('assumptions_paths','Mehrere mögliche Funktionspfade',heading(990,311,'Mehrere mögliche Pfade',36))
    +g('assumptions_limit','Brücke nicht direkt reduzierbar',note(980,821,'Keine direkte Reduktion',['auf reine Serien- und Parallelteile.']))
    +g('assumptions_next','Übergang zur nächsten Lektion',text(1004,958,'Ein genaueres Verfahren folgt.',27,500,C.muted));
  return pack(body,[step('assumptions_context','Damit man ein Zuverlässigkeitsblockdiagramm sinnvoll anwenden kann'),step('assumptions_states','Erstens: Jede Komponente kann nur zwei Zustände'),step('assumptions_no_middle','Es gibt also keine Zwischenstufen'),step('assumptions_working','Nur wenn alle benötigten Komponenten intakt sind'),step('assumptions_no_repair','Zweitens: Die Komponenten sind nicht reparierbar'),step('assumptions_working','Sobald eine Komponente einmal ausgefallen ist','hide'),step('assumptions_failed','bleibt sie es auch'),step('assumptions_no_repair','Diese Annahme vereinfacht die Modellierung erheblich','highlight'),step('assumptions_independent','Und Drittens: Die Komponenten sind unabhängig voneinander'),step('assumptions_independent','der Ausfall einer Komponente beeinflusst nicht','highlight'),step('assumptions_no_coupling','Es gibt also keine gemeinsamen Ursachen'),step('assumptions_context','In der Praxis lassen sich viele Systeme','highlight'),step('assumptions_failed','Ein typisches Beispiel dafür ist','hide'),step('assumptions_bridge','die sogenannte Brückenschaltung'),step('assumptions_bridge_link','die sogenannte Brückenschaltung'),step('assumptions_paths','durch mehrere mögliche Pfade führen kann'),step('assumptions_limit','Diese Strukturen erfordern eine genauere Betrachtung'),step('assumptions_next','Wie du in solchen Fällen vorgehst')],{assumptions_no_middle:['assumptions_states'],assumptions_working:['assumptions_states'],assumptions_failed:['assumptions_no_repair'],assumptions_no_coupling:['assumptions_independent'],assumptions_bridge_link:['assumptions_bridge'],assumptions_paths:['assumptions_bridge','assumptions_bridge_link'],assumptions_limit:['assumptions_bridge','assumptions_bridge_link'],assumptions_next:['assumptions_limit']});
}
module.exports={builders:{rbd_intro:intro,series_parallel_behavior:behavior,series_parallel_math:mathematics,mixed_reduction:reduction,fta_function_rbd:modelMap,boolean_prerequisites:prerequisites},block,seriesParts,parallel,pack,transient,note,terminal,mixedParts,bridgeParts,BRIDGE_EDGES};
