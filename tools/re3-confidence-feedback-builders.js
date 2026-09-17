"use strict";
const theme=require('./reltest-education-theme');
const {text,lines,rect,line,g,step,plot}=require('./re3-feedback-builders');
const C=theme.colors;
const reviewRoot='analysis/render-checks/RE3/feedback-15-29-2026-09-17';
const feedbackAudit='analysis/rebuild-plans/RE3_scenes_015_029_feedback_2026-09-17.md';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function heading(x,y,s,size=36,color=C.accent){return text(x,y,s,size,600,color).replace('<text ',`<text style="font-family:${theme.displayFontFamily.replaceAll('"','')}" `);}
function plate(x,y,w,h,body,dark=false){
  return `<path data-role="concept-panel" d="M${x+8} ${y} H${x+w} V${y+h-20} L${x+w-20} ${y+h} H${x} V${y+8} Q${x} ${y} ${x+8} ${y}Z" fill="${dark?C.accent:C.accentSoft}"/>`+body;
}
function label(x,y,w,s){return plate(x,y,w,66,heading(x+24,y+44,s,32,C.surface),true);}
function focus(x,y,w,ss,size=28){return plate(x,y,w,ss.length*41+36,line(x+20,y+22,x+20,y+ss.length*41+14,C.educationAccent,4)+lines(x+44,y+42,ss,size,550,C.accent,'start',41));}
function packageContent(body,steps,dependencies={}){
  const evidence={
    'Eine begrenzte Auswahl':'section_004: eine begrenzte Anzahl von Datenpunkten',
    'liefert unsere Daten.':'section_004: das ist unsere Stichprobe',
    'berücksichtigt Unsicherheit.':'section_004: müssen wir die Unsicherheit berücksichtigen',
    'Schätzung aus einer Stichprobe':'section_005: nur auf einer Stichprobe der Grundgesamtheit basieren',
    'Die Ausfalldaten liefern':'section_005: aus unseren Ausfalldaten eine Weibullgerade ermittelt',
    'schließen den Bereich ein.':'section_005: Dieser wird durch zwei Vertrauensgrenzen definiert',
    'Andere Stichprobe':'section_005: eine andere Stichprobe aus derselben Grundgesamtheit analysieren',
    'Andere Daten → andere Schätzung':'section_005: eine andere Stichprobe aus derselben Grundgesamtheit analysieren, würde die berechnete Weibullgerade',
    'Auch bezeichnet als: Aussagesicherheit':'section_005: Aussagewahrscheinlichkeit oder auch Aussagesicherheit',
    '90 %: 5-%- und 95-%-Grenze':'section_006: neunzigprozentigen Vertrauensbereich, der durch die fünf-Prozent- und die fünfundneunzig-Prozent-Vertrauensgrenze definiert ist',
    '80 %: 10-%- und 90-%-Grenze':'section_006: achtzigprozentigen Vertrauensbereich anzeigen lassen, der zwischen der zehn-Prozent- und der neunzig-Prozent-Vertrauensgrenze liegt',
    'Kleinere Stichprobe · 90-%-Bereich':'section_006: Eine kleine Stichprobe hingegen führt zu einer höheren Unsicherheit',
    'Größere Stichprobe · 90-%-Bereich':'section_006: Je größer die Stichprobe, desto präziser ist die Schätzung',
    'Weniger Aussagewahrscheinlichkeit → enger':'section_006: Je kleiner der Vertrauensbereich gewählt wird, desto enger rücken die Vertrauensgrenzen zusammen',
    'Mehr Daten → präzisere Schätzung':'section_006: Je größer die Stichprobe, desto präziser ist die Schätzung',
    'Vertrauensbereiche helfen, Fehleinschätzungen zu vermeiden.':'section_006: das Risiko von Fehleinschätzungen zu minimieren',
    'Aussagewahrscheinlichkeit':'section_005: Aussagewahrscheinlichkeit oder auch Aussagesicherheit; section_006: neunzigprozentigen Vertrauensbereich',
    'Stichprobenumfang':'section_006: Auch die Größe unserer Stichprobe hat einen starken Einfluss',
    'ist mit Unsicherheit behaftet.':'section_007: Aufgrund der Unsicherheit in unserer Stichprobe',
    'Die Dichte macht sie sichtbar.':'section_007: als Dichtefunktion auf der Z-Achse darstellen',
    'Mediane verbinden':'section_007: Verbindet man die Mediane über die verschiedenen Zeitpunkte hinweg',
    'Daraus entsteht':'section_007: entsteht die Weibullgerade',
    'darüber':'section_007: oberhalb unserer berechneten Linie',
    'Am jeweiligen Zeitpunkt':'section_007: für einen bestimmten Zeitpunkt; Der Median jeder dieser Verteilungen',
    'Nächster Blick:':'section_007: von vorne betrachten, sehen wir die Dichtefunktion',
    'Dichtefunktion von vorn':'section_007: von vorne betrachten, sehen wir die Dichtefunktion',
    'Zwei Grenzen':'section_008: sowohl die untere als auch die obere Grenze',
    'Unsicherheit in':'section_008: Unsicherheiten in beide Richtungen berücksichtigt',
    'beide Richtungen berücksichtigen.':'section_008: Unsicherheiten in beide Richtungen berücksichtigt',
    'Zwei Grenzen für Unsicherheit':'section_008: sowohl die untere als auch die obere Grenze',
    'in beide Richtungen.':'section_008: Unsicherheiten in beide Richtungen berücksichtigt',
    'Zweiseitig · F':'section_008: zweiseitigen Vertrauensbereich; Grenzen der Ausfallwahrscheinlichkeit',
    'Zum Vergleich':'section_008: Während der zweiseitige Vertrauensbereich Unsicherheiten in beide Richtungen berücksichtigt, ermöglichen einseitige Vertrauensbereiche gezielte Aussagen',
    'Rechtsseitig · F':'section_008: Dichtefunktion der Ausfallwahrscheinlichkeit, ist ein rechtsseitiger Vertrauensbereich',
    'Rechtsseitig · R':'section_008: statt der Ausfallwahrscheinlichkeit die Zuverlässigkeit, macht eine untere Vertrauensgrenze wieder Sinn',
    'meist wenig hilfreich.':'section_008: allerdings wenig sinnvoll',
    'gezielt nachweisen.':'section_008: eine minimale Zuverlässigkeit nachweisen',
    'Die Fragestellung entscheidet.':'section_008: Die Wahl des passenden Vertrauensbereichs hängt immer von der konkreten Fragestellung ab',
    'Als Nächstes: Arten von Lebensdauerdaten':'section_008: In der nächsten Lektion; welche verschiedenen Arten von Lebensdauerdaten es gibt',
  };
  body=body.replace(/<text\b([^>]*)>([^<]*)<\/text>/g,(all,attrs,s)=>evidence[s]?`<text${attrs} data-source-evidence="spoken_text" data-source-reference="${esc(evidence[s])}">${s}</text>`:all);
  return {body,steps,dependencies,density:'dense',feedbackRevision:true,reviewRoot,feedbackAudit,revisionLabel:'Feedbackrevision 17.09.2026 – Vertrauensbereiche'};
}

function samplePopulation(scene){
  const chosen=[3,8,17,22,30,37];
  const dots=Array.from({length:40},(_,i)=>`<circle data-role="population-unit" cx="${152+(i%8)*53}" cy="${355+Math.floor(i/8)*51}" r="10" fill="${C.accent}" opacity=".36"/>`).join('');
  const selections=chosen.map(i=>`<circle data-role="sample-selection" cx="${152+(i%8)*53}" cy="${355+Math.floor(i/8)*51}" r="15" fill="${C.educationAccent}" stroke="${C.surface}" stroke-width="3"/>`).join('');
  const body=g('population_context','Grundgesamtheit',label(112,198,510,'Grundgesamtheit')+lines(112,303,['Alle möglichen Einheiten'],28)+dots)
    +g('population_selection','Begrenzte Stichprobe',selections+line(140,633,140,669,C.educationAccent,4)+heading(165,660,'Stichprobe',32)+lines(112,718,['Eine begrenzte Auswahl','liefert unsere Daten.'],28,500,C.text,'start',40))
    +g('population_analysis','Analyse der Stichprobe',label(712,198,510,'Weibull-Analyse')+line(643,482,691,482,C.accent,2.5,true)+plot(scene,'sample-fit.svg',680,323,550,408))
    +g('population_limit','Gültigkeit der Schätzung',focus(712,770,510,['Beschreibt zunächst','unsere Stichprobe.']))
    +g('population_inference','Schluss auf die Grundgesamtheit',label(1312,198,510,'Grundgesamtheit')+line(1243,482,1291,482,C.accent,2.5,true)+plot(scene,'population-confidence.svg',1280,323,550,408))
    +g('population_uncertainty','Unsicherheit berücksichtigen',focus(1312,770,510,['Vertrauensbereich','berücksichtigt Unsicherheit.']))
    +g('population_bound_labels','Beide Vertrauensgrenzen',line(1335,302,1375,302,C.educationAccent,2,false,'7 5')+text(1390,310,'5-%- und 95-%-Grenze',25))
    +g('population_return','Rückschluss auf die gesamte Population',line(1567,183,1567,158,C.accent,2)+line(1567,158,367,158,C.accent,2)+line(367,158,367,183,C.accent,2,true));
  return packageContent(body,[
    step('population_context','Bisher haben wir uns'),
    step('population_context','Sie umfasst alle möglichen Einheiten','highlight'),
    step('population_selection','eine begrenzte Anzahl von Datenpunkten'),
    step('population_analysis','führen wir eine Weibull-Analyse durch'),
    step('population_sample_fit','Das Ergebnis ist eine Weibullverteilung'),
    step('population_limit','gilt zunächst nur für die Stichprobe selbst'),
    step('population_inference','Aussagen über die Grundgesamtheit treffen möchten'),
    step('population_estimate_fit','Aussagen über die Grundgesamtheit treffen möchten'),
    step('population_uncertainty','müssen wir die Unsicherheit berücksichtigen'),
    step('population_estimate_limits','Genau hier kommt der Vertrauensbereich'),
    step('population_bound_labels','Genau hier kommt der Vertrauensbereich'),
    step('population_return','Genau hier kommt der Vertrauensbereich'),
    step('population_uncertainty','Doch was genau bedeutet ein Vertrauensbereich','highlight'),
  ],{population_selection:['population_context'],population_analysis:['population_selection'],population_sample_fit:['population_analysis'],population_estimate_fit:['population_inference'],population_estimate_limits:['population_estimate_fit'],population_return:['population_context','population_inference']});
}

function confidenceMeaning(scene){
  const body=g('meaning_plot','Weibullnetz',plot(scene,'meaning-portrait.svg',1100,175,680,790))
    +g('meaning_sample','Schätzung aus einer Stichprobe',label(112,214,820,'Schätzung aus einer Stichprobe')+lines(112,345,['Die Ausfalldaten liefern','eine Weibullgerade.'],34,500,C.text,'start',47))
    +g('meaning_bounds_note','Zwei Vertrauensgrenzen',line(117,448,167,448,C.educationAccent,3,false,'7 5')+heading(188,459,'Zwei Vertrauensgrenzen',34)+lines(188,510,['schließen den Bereich ein.'],29))
    +g('meaning_level','90 Prozent Aussagewahrscheinlichkeit',plate(112,566,820,162,heading(146,672,'90 %',88,C.educationAccent)+text(390,624,'Aussagewahrscheinlichkeit',30,600)+text(390,675,'5-%- und 95-%-Grenze',28)))
    +g('meaning_resampling','Eine weitere Stichprobe',heading(112,804,'Andere Stichprobe',34)+lines(112,855,['Andere Daten → andere Schätzung'],29))
    +g('meaning_vocabulary','Bezeichnung Aussagesicherheit',text(112,943,'Auch bezeichnet als: Aussagesicherheit',28,600));
  return packageContent(body,[
    step('meaning_plot','Nehmen wir an'),step('meaning_fit','Nehmen wir an'),step('meaning_sample','Nehmen wir an'),
    step('meaning_sample','nur auf einer Stichprobe der Grundgesamtheit','highlight'),
    step('meaning_limits','durch zwei Vertrauensgrenzen definiert'),step('meaning_bounds_note','durch zwei Vertrauensgrenzen definiert'),
    step('meaning_level','Ein neunzigprozentiger Vertrauensbereich bedeutet'),
    step('meaning_alternatives','eine andere Stichprobe aus derselben Grundgesamtheit'),step('meaning_resampling','eine andere Stichprobe aus derselben Grundgesamtheit'),
    step('meaning_vocabulary','Man spricht in diesem Zusammenhang'),
  ],{meaning_fit:['meaning_plot'],meaning_limits:['meaning_fit'],meaning_alternatives:['meaning_limits']});
}

function legend(x,y,s,color,dashed=false){return line(x,y-9,x+50,y-9,color,3,false,dashed?'8 5':'')+text(x+72,y,s,27,550);}
function confidenceDrivers(scene){
  const body=g('drivers_level_context','Vergleich der Aussagewahrscheinlichkeit',label(112,195,820,'Aussagewahrscheinlichkeit')+plot(scene,'level-comparison.svg',92,378,850,462))
    +g('drivers_90_label','90 Prozent und ihre Grenzen',legend(146,313,'90 %: 5-%- und 95-%-Grenze',C.technical,true))
    +g('drivers_80_label','80 Prozent und ihre Grenzen',legend(146,361,'80 %: 10-%- und 90-%-Grenze',C.educationAccent))
    +g('drivers_level_rule','Engerer Bereich bei kleinerem Niveau',focus(112,846,820,['Weniger Aussagewahrscheinlichkeit → enger']))
    +g('drivers_sample_context','Vergleich des Stichprobenumfangs',label(1020,195,800,'Stichprobenumfang')+plot(scene,'sample-comparison.svg',995,378,850,462))
    +g('drivers_small_label','Kleinere Stichprobe',legend(1054,313,'Kleinere Stichprobe · 90-%-Bereich',C.technical,true))
    +g('drivers_large_label','Größere Stichprobe',legend(1054,361,'Größere Stichprobe · 90-%-Bereich',C.educationAccent))
    +g('drivers_sample_rule','Präzision durch mehr Daten',focus(1020,846,800,['Mehr Daten → präzisere Schätzung']))
    +g('drivers_risk','Fehleinschätzungen vermeiden',line(118,956,118,995,C.educationAccent,4)+text(144,985,'Vertrauensbereiche helfen, Fehleinschätzungen zu vermeiden.',30,600));
  return packageContent(body,[
    step('drivers_level_context','Aber was bedeutet das'),
    step('level_90','In diesem Fall betrachten wir'),step('drivers_90_label','In diesem Fall betrachten wir'),
    step('level_80','Alternativ könnten wir auch'),step('drivers_80_label','Alternativ könnten wir auch'),
    step('drivers_level_rule','Je kleiner der Vertrauensbereich gewählt wird'),step('level_80','Je kleiner der Vertrauensbereich gewählt wird','highlight'),
    step('level_90','Umgekehrt gilt: Je größer','highlight'),
    step('drivers_sample_context','Auch die Größe unserer Stichprobe'),
    step('sample_large','Je größer die Stichprobe'),step('drivers_large_label','Je größer die Stichprobe'),step('drivers_sample_rule','Je größer die Stichprobe'),
    step('sample_small','Eine kleine Stichprobe hingegen'),step('drivers_small_label','Eine kleine Stichprobe hingegen'),
    step('drivers_risk','Ohne ihn könnten wir'),
    step('drivers_sample_context','deutlich kürzer oder länger sein könnte','highlight'),
    step('drivers_risk','das Risiko von Fehleinschätzungen zu minimieren','highlight'),
  ],{level_90:['drivers_level_context'],level_80:['drivers_level_context'],sample_small:['drivers_sample_context'],sample_large:['drivers_sample_context']});
}

function probabilitySurface(){
  const body=g('surface_visual','Dichtefunktionen über der Lebensdauer','<image href="../../../../analysis/re3-assets/plots/probability-surface.svg" x="100" y="170" width="1120" height="790" preserveAspectRatio="xMidYMid meet" aria-label="Unverändertes freigegebenes 3D-Diagramm der Dichtefunktionen"/>')
    +g('surface_uncertainty','Verteilung je Zeitpunkt',label(1290,206,530,'Für einen Zeitpunkt')+lines(1314,335,['Die Ausfallwahrscheinlichkeit','ist mit Unsicherheit behaftet.'],29,500,C.text,'start',42))
    +g('surface_density','Dichte der möglichen Werte',text(1314,443,'Die Dichte macht sie sichtbar.',29,600))
    +g('surface_medians','Mediane verbinden',line(1314,520,1364,520,C.technical,3)+heading(1384,531,'Mediane verbinden',31)+lines(1314,590,['Daraus entsteht','die Weibullgerade.'],29,500,C.text,'start',41))
    +g('surface_halves','Median je Zeitpunkt',plate(1290,706,530,138,heading(1318,775,'50 %',54,C.educationAccent)+lines(1510,756,['darunter','darüber'],28,550,C.text,'start',43))+text(1314,688,'Am jeweiligen Zeitpunkt',26,600))
    +g('surface_front','Übergang zur Frontansicht',line(1295,882,1295,963,C.educationAccent,4)+lines(1320,912,['Nächster Blick:','Dichtefunktion von vorn'],28,550,C.text,'start',42));
  return packageContent(body,[
    step('surface_visual','Um das Konzept des Vertrauensbereiches'),
    step('surface_uncertainty','für einen bestimmten Zeitpunkt keine exakt festgelegte'),
    step('surface_density','als Dichtefunktion auf der Z-Achse darstellen'),
    step('surface_medians','Verbindet man die Mediane'),
    step('surface_uncertainty','lediglich auf den Stichprobendaten basiert','highlight'),
    step('surface_halves','In fünfzig Prozent der Fälle'),
    step('surface_halves','unsere Schätzung genau in der Mitte','highlight'),
    step('surface_front','für einen bestimmten Zeitpunkt von vorne betrachten'),
  ]);
}

function twoSided(scene){
  const body=g('two_context','Zweiseitiger Vertrauensbereich',label(112,200,1010,'Zweiseitiger Vertrauensbereich')+plot(scene,'two-sided-density.svg',108,327,1030,590))
    +g('two_boundaries','Untere und obere Grenze',heading(1240,316,'Zwei Grenzen',40)+lines(1240,382,['Untere und obere Grenze','der Ausfallwahrscheinlichkeit'],30,500,C.text,'start',44))
    +g('two_probability','90 Prozent Aussagewahrscheinlichkeit',plate(1220,491,600,186,heading(1254,594,'90 %',84,C.educationAccent)+text(1254,646,'Aussagewahrscheinlichkeit',29,600)))
    +g('two_rule','Unsicherheit in beide Richtungen',focus(1220,746,600,['Unsicherheit in','beide Richtungen berücksichtigen.']));
  return packageContent(body,[
    step('two_context','Bereits kennengelernt haben wir'),
    step('two_region','sowohl die untere als auch die obere Grenze'),step('two_boundaries','sowohl die untere als auch die obere Grenze'),
    step('two_values','Die Aussagewahrscheinlichkeit von neunzig Prozent'),step('two_probability','Die Aussagewahrscheinlichkeit von neunzig Prozent'),
    step('two_rule','Unsicherheiten in beide Richtungen berücksichtigt'),
  ],{two_region:['two_context'],two_values:['two_region']});
}

function leftSided(scene){
  const body=g('left_reference_context','Bekannter zweiseitiger Bereich',label(112,205,805,'Zweiseitiger Vertrauensbereich')+plot(scene,'two-sided-reference.svg',102,309,820,535))
    +g('left_context','Linksseitiger Vertrauensbereich',label(1015,205,805,'Linksseitiger Vertrauensbereich')+plot(scene,'left-sided-density.svg',1005,309,820,535))
    +g('left_application','Maximale Ausfallwahrscheinlichkeit',focus(1015,858,805,['Eine obere Grenze für die','maximale Ausfallwahrscheinlichkeit.']))
    +g('left_reference_rule','Vergleich der zweiseitigen Grenzen',focus(112,858,805,['Zwei Grenzen für Unsicherheit','in beide Richtungen.']));
  return packageContent(body,[
    step('left_reference_context','Zusätzlich gibt es auch einseitige Vertrauensbereiche'),step('left_reference_region','Zusätzlich gibt es auch einseitige Vertrauensbereiche'),step('left_reference_values','Zusätzlich gibt es auch einseitige Vertrauensbereiche'),
    step('left_context','Beim linksseitigen Vertrauensbereich'),
    step('left_region','wird nur eine obere Grenze betrachtet'),
    step('left_application','wenn wir eine maximale Ausfallwahrscheinlichkeit'),
    step('left_region','die Definition der Grenzen die Aussagewahrscheinlichkeit beeinflusst','highlight'),
    step('left_reference_rule','Um beim zweiseitigen Vertrauensbereich'),step('left_reference_values','fünf Prozent und eine fünfundneunzig Prozent','highlight'),
    step('left_values','Um beim linksseitigen Vertrauensbereich'),
  ],{left_reference_region:['left_reference_context'],left_reference_values:['left_reference_region'],left_region:['left_context'],left_values:['left_region']});
}

function rightSided(scene){
  const body=g('right_reference_context','Bekannter zweiseitiger Bereich',label(112,210,510,'Zweiseitig · F')+text(136,323,'Zum Vergleich',27,550)+plot(scene,'two-sided-reference.svg',90,367,550,415))
    +g('right_failure_context','Rechtsseitige Ausfallgrenze',label(712,210,510,'Rechtsseitig · F')+text(736,323,'Ausfallwahrscheinlichkeit',27,550)+plot(scene,'right-failure.svg',690,367,550,415))
    +g('right_reliability_context','Rechtsseitige Zuverlässigkeitsgrenze',label(1312,210,510,'Rechtsseitig · R')+text(1336,323,'Zuverlässigkeit',27,550)+plot(scene,'right-reliability.svg',1290,367,550,415))
    +g('right_failure_caution','Begrenzter Nutzen der unteren Ausfallgrenze',focus(712,803,510,['Minimale Ausfallwahrscheinlichkeit','meist wenig hilfreich.'],26))
    +g('right_reliability_use','Minimale Zuverlässigkeit nachweisen',focus(1312,803,510,['Minimale Zuverlässigkeit','gezielt nachweisen.']))
    +g('right_reference_meaning','Unsicherheit in beide Richtungen',focus(112,803,510,['Unsicherheit in','beide Richtungen.']))
    +g('right_choice','Fragestellung entscheidet',line(118,955,118,995,C.educationAccent,4)+text(144,984,'Die Fragestellung entscheidet.',30,600))
    +g('right_next','Überleitung zu Lebensdauerdaten',text(1020,984,'Als Nächstes: Arten von Lebensdauerdaten',28,550));
  return packageContent(body,[
    step('right_reference_context','Analog dazu gibt es auch'),step('right_reference_region','Analog dazu gibt es auch'),step('right_reference_values','Analog dazu gibt es auch'),
    step('right_failure_context','den rechtsseitigen Vertrauensbereich'),
    step('right_failure_region','nur eine untere Grenze'),
    step('right_failure_values','eine zehn-Prozent-Vertrauensgrenze verwendet'),
    step('right_failure_caution','allerdings wenig sinnvoll'),
    step('right_failure_region','oft deutlich höher sein könnte','highlight'),
    step('right_reliability_context','statt der Ausfallwahrscheinlichkeit die Zuverlässigkeit'),
    step('right_reliability_region','macht eine untere Vertrauensgrenze wieder Sinn'),
    step('right_reliability_values','eine minimale Zuverlässigkeit nachweisen'),step('right_reliability_use','eine minimale Zuverlässigkeit nachweisen'),
    step('right_choice','Die Wahl des passenden Vertrauensbereichs'),
    step('right_reference_meaning','Während der zweiseitige Vertrauensbereich'),step('right_reference_region','Während der zweiseitige Vertrauensbereich','highlight'),
    step('right_reliability_region','ermöglichen einseitige Vertrauensbereiche gezielte Aussagen','highlight'),
    step('right_choice','diese Konzepte in der Praxis noch anwenden','highlight'),
    step('right_next','In der nächsten Lektion'),
  ],{right_reference_region:['right_reference_context'],right_reference_values:['right_reference_region'],right_failure_region:['right_failure_context'],right_failure_values:['right_failure_region'],right_reliability_region:['right_reliability_context'],right_reliability_values:['right_reliability_region']});
}

module.exports={builders:{sample_population:samplePopulation,confidence_meaning:confidenceMeaning,confidence_drivers:confidenceDrivers,probability_surface:probabilitySurface,confidence_two_sided:twoSided,confidence_left_sided:leftSided,confidence_right_sided:rightSided},heading,plate,label,focus,packageContent};
