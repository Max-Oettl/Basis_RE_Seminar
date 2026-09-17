"use strict";
const fs=require('node:fs');
const path=require('node:path');
const theme=require('./reltest-education-theme');
const {text,lines,line,rect,g,step,plot}=require('./re3-feedback-builders');
const {heading,plate,label}=require('./re3-confidence-feedback-builders');
const C=theme.colors;
const reviewRoot='analysis/render-checks/RE3/feedback-31-42-2026-09-17';
const feedbackAudit='analysis/rebuild-plans/RE3_scenes_031_042_feedback_2026-09-17.md';
function pack(scene,body,steps,dependencies={}){
  // Short labels paraphrase the exact source narration; references remain local.
  body=body.replace(/<text\b(?![^>]*data-source-evidence)/g,`<text data-source-evidence="spoken_text" data-source-reference="${scene.source_text_section_id}; source slides ${scene.source_slides.join(',')}; ${feedbackAudit}"`);
  return {body,steps,dependencies,density:[31,39,42].includes(scene.output_slide_number)?'dense':'normal',feedbackRevision:true,reviewRoot,feedbackAudit,reviewKind:'life-data'};
}
function note(x,y,title,ss,w=640){return heading(x,y,title,34)+lines(x,y+53,ss,30,500,C.text,'start',42);}
function sources(scene){
 const xs=[112,550,988,1426],w=384;
 const motifs=['extreme-test','laboratory-test','test-drive','customer-use'];
 const head=(i,ss)=>{
   const local=`media/${motifs[i]}.png`;
   const href='data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'../rebuild-proposals/svg/RE3/slide_031',local)).toString('base64');
   const icon=`<image href="${href}" x="${xs[i]+104}" y="322" width="176" height="176" preserveAspectRatio="xMidYMid meet" aria-hidden="true" data-source-media="true" data-pictogram-asset="${local}" data-pictogram-asset-type="generated_png" data-pictogram-style="reltest-education-minimal-v1" data-pictogram-kind="endurance-${motifs[i]}" data-pictogram-size="176" data-pictogram-semantic-role="concept-anchor"/>`;
   return icon+plate(xs[i],494,w,106,lines(xs[i]+22,537,ss,30,600,C.surface,'start',40),true);
 };
 let body=g('data_origin','Produktentwicklungsprozess',text(112,193,'Produktentwicklungsprozess',27,600)+line(580,184,1810,184,C.accent,2.5,true))
  +g('data_uncertainty','Unsicherheit',note(112,264,'Unsicherheit',['Streuung und Kontrollierbarkeit'],740))
  +g('data_representative','Repräsentativität',note(1000,264,'Repräsentativität',['Nähe zum tatsächlichen Einsatz'],780))
  +g('data_extreme','Stark beschleunigte Versuche',head(0,['Stark beschleunigte','Lebensdauerversuche']))
  +g('data_extreme_load','Extreme Belastung',lines(xs[0],644,['Hohe Temperatur','Starke Vibration','Überhöhte Spannung'],27,500,C.text,'start',40))
  +g('data_extreme_result','Schnelle Schwachstellensuche',lines(xs[0],804,['Schnelle Ergebnisse','Übertragbarkeit unsicher'],27,600,C.accent,'start',42))
  +g('data_lab','Versuche im Labor',head(1,['Lebensdauerversuche','im Labor']))
  +g('data_lab_normal','Unbeschleunigter Versuch',lines(xs[1],644,['Unbeschleunigt:','normaler Einsatz, lange Dauer'],26,500,C.text,'start',38))
  +g('data_lab_fast','Beschleunigter Versuch',lines(xs[1],740,['Beschleunigt:','höhere Last, kürzere Dauer'],26,500,C.text,'start',38))
  +g('data_lab_tradeoff','Moderate Beschleunigung',lines(xs[1],836,['Moderat beschleunigt:','Kompromiss zur Realitätsnähe'],26,600,C.accent,'start',38))
  +g('data_drive','Versuchsfahrten',head(2,['Versuchsfahrten']))
  +g('data_drive_detail','Überwachter realer Einsatz',lines(xs[2],644,['Reales Umfeld','Definiert und überwacht'],27,500,C.text,'start',40))
  +g('data_drive_variation','Mehr Störfaktoren',lines(xs[2],804,['Mehr Störfaktoren','als im Labor'],27,600,C.accent,'start',42))
  +g('data_field','Felddaten',head(3,['Felddaten /','Feldversuche']))
  +g('data_field_use','Kunde und Serie',lines(xs[3],644,['Einsatz beim Kunden','oder im Serienbetrieb'],27,500,C.text,'start',40))
  +g('data_field_variation','Unkontrollierte Einflüsse',lines(xs[3],804,['Sehr repräsentativ','Viele Einflüsse unkontrolliert'],27,600,C.accent,'start',42))
  +g('data_trend_uncertainty','Zunahme der Unsicherheit',text(112,944,'Unsicherheit nimmt zu',27,600)+line(580,935,1810,935,C.accent,2,true))
  +g('data_trend_representative','Zunahme der Repräsentativität',text(112,1000,'Repräsentativität nimmt zu',27,600)+line(580,991,1810,991,C.educationAccent,2.5,true));
 const content=pack(scene,body,[
  step('data_origin','Bevor wir mit einer Lebensdauerdatenanalyse'),
  ...['data_extreme','data_lab','data_drive','data_field'].map(id=>step(id,'Lebensdauerdaten können auf verschiedene Weise')),
  step('data_origin','entlang des Entwicklungsprozesses eines Produkts','highlight'),
  step('data_uncertainty','Die Unsicherheit bezieht sich hierbei'),step('data_representative','Repräsentativität bedeutet, wie gut'),
  step('data_extreme','An erster Stelle stehen','highlight'),step('data_extreme_load','gezielt extremen Belastungen ausgesetzt'),step('data_extreme_result','Ziel ist es, in kürzester Zeit'),step('data_extreme_result','hohe Unsicherheit hinsichtlich ihrer Übertragbarkeit','highlight'),
  step('data_lab','Es folgen beschleunigte oder unbeschleunigte','highlight'),step('data_lab_normal','Bei unbeschleunigten Tests werden Produkte'),step('data_lab_fast','Deshalb werden in der Praxis'),step('data_lab_fast','Je stärker die Beschleunigung','highlight'),step('data_lab_tradeoff','Moderat beschleunigte Tests stellen'),
  step('data_drive','Danach folgen Versuchsfahrten','highlight'),step('data_drive_detail','im realen Umfeld, aber noch'),step('data_drive_variation','von mehr Störfaktoren beeinflusst'),
  step('data_field','Abschließend betrachten wir Felddaten','highlight'),step('data_field_use','während des echten Einsatzes'),step('data_field_variation','Die Repräsentativität dieser Daten'),step('data_field_variation','mit der größten Unsicherheit behaftet','highlight'),
  step('data_trend_representative','desto repräsentativer werden die Daten'),step('data_trend_uncertainty','gleichzeitig nimmt jedoch auch die Unsicherheit zu'),step('data_origin','die Herkunft der Daten zu kennen','highlight')
 ],{data_extreme_load:['data_extreme'],data_extreme_result:['data_extreme'],data_lab_normal:['data_lab'],data_lab_fast:['data_lab'],data_lab_tradeoff:['data_lab'],data_drive_detail:['data_drive'],data_field_use:['data_field']});
 content.reviewRoot='analysis/render-checks/RE3/feedback-31-pictograms-2026-09-17';
 content.feedbackAudit='analysis/rebuild-plans/RE3_scene_031_pictograms_2026-09-17.md';
 content.reviewKind='life-data-pictograms';
 return content;
}
function cross(x,y,color=C.failure){return line(x-9,y-9,x+9,y+9,color,3)+line(x-9,y+9,x+9,y-9,color,3);}
function censorMark(x,y){return line(x,y-12,x,y+12,C.technical,3)+line(x+6,y,x+40,y,C.technical,2.5,true);}
function failureLegend(x,y,s='Ausfall'){return cross(x,y)+text(x+28,y+9,s,26);}
function censorLegend(x,y,s='Bei Herausnahme intakt'){return censorMark(x,y)+text(x+55,y+9,s,26);}
function complete(scene){
 const body=g('complete_context','Sechs Objekte',label(112,226,880,'Sechs Objekte im Versuch')+plot(scene,'complete.svg',112,316,900,580))
  +g('complete_legend','Ausfallmarker',failureLegend(255,927))
  +g('complete_known','Exakte Ausfallzeit',note(1110,435,'Für jedes Objekt bekannt',['Der genaue Ausfallzeitpunkt.']))
  +g('complete_definition','Vollständige Daten',label(1110,226,700,'Vollständige Daten'))
  +g('complete_uncensored','Keine Zensierung',note(1110,585,'Keine Zensierung',['Auch: unzensierte Daten.']))
  +g('complete_stop_note','Versuchsende',note(1110,741,'Ende nach letztem Ausfall',['Alle sechs Ausfallzeiten liegen vor.']))
  +g('complete_practice','Praxis',lines(1110,928,['Praxis: häufig vorzeitiger Abbruch'],28,600));
 return pack(scene,body,[step('complete_context','Stellen wir uns dazu vor'),step('complete_failures','bis es ausfällt'),step('complete_known','Das bedeutet: Wir kennen'),step('complete_legend','anhand der roten Kreuze'),step('complete_definition','sprechen wir von vollständigen Daten'),step('complete_uncensored','Es liegt also keine Zensierung'),step('complete_stop','erst nach dem letzten Ausfall'),step('complete_stop_note','erst nach dem letzten Ausfall'),step('complete_known','besonders einfach auszuwerten','highlight'),step('complete_practice','Denn viele Versuche werden'),step('complete_stop','noch bevor alle Objekte ausgefallen sind','highlight')],{complete_failures:['complete_context'],complete_stop:['complete_failures']});
}
function rightCensored(scene){
 const body=g('censored_context','Beispiel Typ 1',label(112,226,880,'Beispiel · Rechtszensierung Typ 1')+plot(scene,'type-one.svg',112,316,900,580))
  +g('censored_failure_legend','Ausfall',failureLegend(215,927))
  +g('censored_intact_legend','Zensierung',censorLegend(460,927))
  +g('censored_known','Beobachtungsdauer bekannt',label(1110,226,700,'Was wissen wir?')+note(1110,411,'Beobachtungsdauer bekannt',['Bis zur Herausnahme funktionsfähig.']))
  +g('censored_unknown','Ausfallzeit unbekannt',note(1110,585,'Ausfallzeit unbekannt',['Sie liegt nach dem Beobachtungsende.']))
  +g('censored_record','Korrekt erfassen',note(1110,759,'Für die Auswertung',['Zensierungszeit korrekt erfassen.']))
  +g('censored_later','Noch intakte Objekte',lines(1110,928,['Objekte 3 und 4 sind noch intakt.'],28,600));
 const content=pack(scene,body,[step('censored_context','In der Statistik spricht man'),step('type_one_stop','bis zum Ende der Beobachtungszeit'),step('type_one_failures','der Ausfall eines Objekts'),step('censored_failure_legend','der Ausfall eines Objekts'),step('censored_known','Das bedeutet: Wir wissen nur'),step('type_one_censored','bis zu einem bestimmten Zeitpunkt'),step('censored_intact_legend','bis zu einem bestimmten Zeitpunkt'),step('censored_unknown','aber nicht, wann es tatsächlich ausfallen wird'),step('censored_record','jeden dieser Zensierungszeitpunkte korrekt zu erfassen'),step('censored_unknown','Liegen alle unbekannten Ausfallzeiten','highlight'),step('type_one_censored','sprechen wir von einer Rechtszensierung','highlight'),step('censored_intact_legend','an den blauen Pfeilen','highlight'),step('censored_later','noch Objekte im Betrieb'),step('censored_unknown','dieser Zeitpunkt ist aber unbekannt','highlight'),step('type_one_stop','Die Zensierungszeit ist daher immer','highlight')],{type_one_stop:['censored_context'],type_one_failures:['censored_context'],type_one_censored:['censored_context']});
 content.body=content.body.replace(/<text\b[^>]*>Beispiel · Rechtszensierung Typ 1<\/text>/,m=>m.replace('data-source-evidence="spoken_text"','data-source-evidence="user_request"').replace(/data-source-reference="[^"]+"/,'data-source-reference="Nutzerfeedback: Bei 35 sollte dann ja Typ 1 stehen; Quellfolie36 definiert den festen Zeitstopp"'));
 return content;
}
function censoringTypes(scene){
 const body=g('types_one_context','Typ 1',label(112,214,810,'Typ 1 · Zeit vorgegeben')+plot(scene,'type-one.svg',112,322,810,522))
  +g('types_one_random','Zufällige Ausfallzahl',heading(112,899,'Ausfallzahl ist zufällig',32))
  +g('types_two_context','Typ 2',label(1000,214,810,'Typ 2 · Ausfallzahl vorgegeben')+plot(scene,'type-two.svg',1000,322,810,522))
  +g('types_two_random','Zufällige Versuchsdauer',heading(1000,899,'Versuchsdauer ist zufällig',32))
  +g('types_failure_legend','Ausfall',failureLegend(620,982))
  +g('types_censor_legend','Bei Stopp intakt',censorLegend(890,982));
 return pack(scene,body,[
  step('types_one_context','Beginnen wir mit der Rechtszensierung'),step('compare_one_failures','Beginnen wir mit der Rechtszensierung'),step('types_failure_legend','Beginnen wir mit der Rechtszensierung'),
  step('compare_one_stop','nach einer vorher festgelegten Zeit'),step('compare_one_censored','noch funktionieren, gelten als rechtszensiert'),step('types_censor_legend','noch funktionieren, gelten als rechtszensiert'),
  step('types_one_random','ist dabei eine Zufallsgröße'),step('compare_one_stop','zu einem festen Zeitpunkt abgeschlossen','highlight'),step('compare_one_censored','Mindestens ein Testobjekt bleibt','highlight'),
  step('types_two_context','Im Gegensatz dazu steht'),step('compare_two_failures','Im Gegensatz dazu steht'),step('compare_two_stop_event','sobald eine bestimmte Anzahl'),step('compare_two_stop','sobald eine bestimmte Anzahl'),
  step('types_two_random','die Versuchszeit eine Zufallsgröße'),step('compare_two_censored','zu diesem Zeitpunkt noch intakt sind'),step('compare_two_stop_event','genau definierte Anzahl an Ausfallereignissen','highlight'),
  step('compare_one_censored','Beide Varianten haben gemeinsam','highlight'),step('compare_two_censored','Beide Varianten haben gemeinsam','highlight')
 ],{compare_one_failures:['types_one_context'],compare_one_stop:['types_one_context'],compare_one_censored:['compare_one_stop'],compare_two_failures:['types_two_context'],compare_two_stop_event:['compare_two_failures'],compare_two_stop:['compare_two_stop_event'],compare_two_censored:['compare_two_stop']});
}
function multipleCensoring(scene){
 const body=g('multiple_context','Gemeinsamer Start',label(112,226,880,'Sechs Objekte · gemeinsamer Start')+plot(scene,'multiple.svg',112,316,900,580))
  +g('multiple_failure_legend','Ausfall',failureLegend(215,927))
  +g('multiple_censor_legend','Zensierung',censorLegend(460,927))
  +g('multiple_endings','Verschiedene Beobachtungsenden',label(1110,226,700,'Individuelle Beobachtungsenden')+note(1110,420,'Intakt aus dem Versuch',['Zu unterschiedlichen Zeitpunkten.']))
  +g('multiple_random','Zufällige Zeitpunkte',note(1110,580,'Zufällige Zensierungszeitpunkte',['Nicht vorher festgelegt.']))
  +g('multiple_reasons','Gründe für die Herausnahme',heading(1110,759,'Gründe für die Herausnahme',32)+lines(1110,813,['• Organisatorische Gründe','• Technische Gründe','• Wirtschaftliche Gründe'],29,500,C.text,'start',44));
 return pack(scene,body,[step('multiple_context','Bei der sogenannten Multiplen Zensierung'),step('multiple_failures','Auch hier sind nicht alle Objekte'),step('multiple_failure_legend','Auch hier sind nicht alle Objekte'),step('multiple_censored','zu unterschiedlichen Zeitpunkten'),step('multiple_censor_legend','zu unterschiedlichen Zeitpunkten'),step('multiple_endings','zu unterschiedlichen Zeitpunkten'),step('multiple_random','Diese Zeitpunkte sind nicht vorher festgelegt'),step('multiple_censored','zwischen verschiedenen Ausfällen liegen können','highlight'),step('multiple_reasons','aus organisatorischen, technischen oder wirtschaftlichen Gründen')],{multiple_failures:['multiple_context'],multiple_censored:['multiple_context']});
}
function competingRisks(scene){
 const xs=[112,712,1312],pw=510;
 const body=g('observed_context','Gemeinsame Beobachtung',label(xs[0],226,pw,'Beobachtung: A und B')+plot(scene,'observed.svg',92,362,550,443))
  +g('observed_legend_a','Mechanismus A',failureLegend(158,841,'Mechanismus A'))
  +g('observed_legend_b','Mechanismus B',cross(158,889,C.educationAccent)+text(186,898,'Mechanismus B',26))
  +g('analysis_a_context','Analyse A',label(xs[1],226,pw,'Analyse A')+plot(scene,'analysis-a.svg',692,362,550,443))
  +g('analysis_a_legend_a','A als Ausfall',failureLegend(758,841,'A: Ausfall'))
  +g('analysis_a_legend_b','B als Zensierung',censorLegend(758,889,'B: zensiert'))
  +g('analysis_a_meaning','Bis dahin intakt bezüglich A',lines(712,970,['Bis dahin in Bezug auf A intakt.'],26,600))
  +g('analysis_b_context','Analyse B',label(xs[2],226,pw,'Analyse B')+plot(scene,'analysis-b.svg',1292,362,550,443))
  +g('analysis_b_legend_b','B als Ausfall',cross(1358,841,C.educationAccent)+text(1386,850,'B: Ausfall',26))
  +g('analysis_b_legend_a','A als Zensierung',censorLegend(1358,889,'A: zensiert'))
  +g('analysis_b_meaning','Bis dahin intakt bezüglich B',lines(1312,970,['Bis dahin in Bezug auf B intakt.'],26,600))
  +g('observed_identity','Gleiche Objekte und Zeiten',lines(112,961,['Gleiche Objekte.','Gleiche Ereigniszeitpunkte.'],26,600,C.text,'start',35));
 return pack(scene,body,[
  step('observed_context','Ein praktisches Beispiel ergibt sich'),step('observed_a','Einige sind durch Ausfallmechanismus A'),step('observed_legend_a','Einige sind durch Ausfallmechanismus A'),step('observed_b','Andere durch Ausfallmechanismus B'),step('observed_legend_b','Andere durch Ausfallmechanismus B'),
  step('analysis_a_context','Wenn wir nun gezielt'),step('analysis_a_a','Wenn wir nun gezielt'),step('analysis_a_legend_a','Wenn wir nun gezielt'),step('analysis_a_b','als Zensierungszeitpunkte nutzen'),step('analysis_a_legend_b','als Zensierungszeitpunkte nutzen'),step('observed_b','als Zensierungszeitpunkte nutzen','highlight'),
  step('analysis_a_meaning','noch funktionsfähig. Wann es'),step('analysis_a_b','bleibt unbekannt. Das gleiche','highlight'),
  step('analysis_b_context','Wenn wir Mechanismus B untersuchen'),step('analysis_b_b','Wenn wir Mechanismus B untersuchen'),step('analysis_b_legend_b','Wenn wir Mechanismus B untersuchen'),step('analysis_b_a','als Zensurzeitpunkte betrachtet werden'),step('analysis_b_legend_a','als Zensurzeitpunkte betrachtet werden'),step('analysis_b_meaning','als Zensurzeitpunkte betrachtet werden'),step('observed_a','als Zensurzeitpunkte betrachtet werden','highlight'),
  step('observed_identity','So entstehen multiple, zufällige Zensierungen')
 ],{observed_a:['observed_context'],observed_b:['observed_context'],analysis_a_a:['analysis_a_context'],analysis_a_b:['analysis_a_context','observed_b'],analysis_b_b:['analysis_b_context'],analysis_b_a:['analysis_b_context','observed_a']});
}
function intervalCensoring(scene){
 const body=g('interval_context','Sechs beobachtete Objekte',label(112,226,880,'Sechs beobachtete Objekte')+plot(scene,'interval.svg',112,316,900,580))
  +g('interval_detail_context','Beispiel Objekt 2',label(1110,226,700,'Beispiel: Objekt 2'))
  +g('interval_window','Zwei bekannte Grenzen',rect(1200,488,490,64,C.accentSoft)+line(1200,520,1690,520,C.technical,3)+line(1200,477,1200,563,C.technical,3)+line(1690,477,1690,563,C.technical,3)+text(1200,609,'Untere Grenze',28,600,C.text,'middle')+text(1690,609,'Obere Grenze',28,600,C.text,'middle'))
  +g('interval_unknown','Zeitpunkt innerhalb unbekannt',text(1445,465,'?',46,600,C.failure,'middle')+text(1445,673,'Ausfallzeitpunkt unbekannt',30,600,C.text,'middle'))
  +g('interval_controls','Erfolgreiche Prüfung und Defekt',lines(1200,403,['Letzte erfolgreiche','Prüfung'],27,600,C.text,'middle',36)+lines(1690,403,['Erste Kontrolle','mit Defekt'],27,600,C.text,'middle',36))
  +g('interval_legend','Unbekannter Ausfall im Intervall',line(230,927,310,927,C.technical,3)+line(230,914,230,940,C.technical,3)+line(310,914,310,940,C.technical,3)+text(270,915,'?',24,600,C.failure,'middle')+text(340,936,'Ausfall innerhalb des Intervalls',26))
  +g('interval_resolution','Beobachtungsauflösung',heading(1110,775,'Beobachtungsauflösung',32)+text(1110,824,'Kann bei allen Datentypen auftreten:',28)+lines(1110,874,['• Vollständige Daten','• Rechtszensierte Daten','• Multipel zensierte Daten'],27,500,C.text,'start',40));
 return pack(scene,body,[
  step('interval_context','Eine weitere Form der Zensierung'),step('interval_example','nicht bekannt ist'),step('interval_detail_context','innerhalb eines bestimmten Zeitintervalls'),step('interval_window','innerhalb eines bestimmten Zeitintervalls'),step('interval_unknown','aber nicht, wann genau'),step('interval_legend','aber nicht, wann genau'),
  step('interval_controls','nicht kontinuierlich überwacht werden'),step('interval_window','zwischen der letzten erfolgreichen Prüfung','highlight'),step('interval_others','Der tatsächliche Ausfallzeitpunkt bleibt'),
  step('interval_resolution','auf die Genauigkeit unserer Beobachtung'),step('interval_resolution','sowohl in Fällen vollständigen Daten','highlight'),step('interval_window','zeitliche Auflösung nicht unendlich klein ist','highlight'),step('interval_unknown','Selbst kleinste Intervalle führen dazu','highlight'),step('interval_resolution','wie genau wir über den Zeitpunkt','highlight')
 ],{interval_example:['interval_context'],interval_window:['interval_detail_context'],interval_unknown:['interval_window'],interval_controls:['interval_window'],interval_others:['interval_example']});
}
module.exports={builders:{life_data_sources:sources,complete_data:complete,right_censored:rightCensored,censoring_types:censoringTypes,multiple_censoring:multipleCensoring,competing_risks:competingRisks,interval_censoring:intervalCensoring},pack,note};
