"use strict";
const theme=require('./reltest-education-theme');
const {text,lines,line,g,step,plot}=require('./re3-feedback-builders');
const {heading,plate}=require('./re3-confidence-feedback-builders');
const C=theme.colors;
const reviewRoot='analysis/render-checks/RE3/feedback-43-2026-09-17';
const feedbackAudit='analysis/rebuild-plans/RE3_scene_043_feedback_2026-09-17.md';
function methodHeader(x,abbreviation,name){
  return plate(x,184,810,145,
    heading(x+30,285,abbreviation,86,C.surface)
    +lines(x+245,249,name,32,600,C.surface,'start',44),true);
}
function methods(scene){
  let body=g('mls_heading','MLS – Methode der kleinsten Quadrate',methodHeader(112,'MLS',['Methode der','kleinsten Quadrate']))
    +g('mle_heading','MLE – Maximum-Likelihood-Methode',methodHeader(1000,'MLE',['Maximum-Likelihood-','Methode']))
    +g('mls_context','Regression im Weibull-Papier',plot(scene,'mls-regression.svg',142,354,740,400))
    +g('mle_context','Likelihood über den Parametern T und b',plot(scene,'mle-likelihood.svg',1030,354,740,400))
    +g('mls_objective','Summe der quadrierten Abweichungen minimieren',plot(scene,'mls-objective.svg',142,762,740,68)+text(517,855,'Quadratische Abweichungen minimieren',29,500,C.text,'middle'))
    +g('mle_objective','Likelihood maximieren',plot(scene,'mle-objective.svg',1030,762,740,68)+text(1405,855,'Parameter am Maximum bestimmen',29,500,C.text,'middle'))
    +g('mls_simple','Einfach und nachvollziehbar',line(112,881,922,881,C.border,1.5)+heading(142,921,'Einfach und nachvollziehbar',31))
    +g('mls_data','Nur vollständige Daten',text(142,966,'Nur vollständige Daten',29,500))
    +g('mle_data','Vollständige und zensierte Daten',line(1000,881,1810,881,C.border,1.5)+heading(1030,921,'Vollständige und zensierte Daten',31))
    +g('mle_complex','Mathematisch komplexer',text(1030,966,'Mathematisch komplexer',29,500))
    +g('methods_software','Beide Verfahren mit Statistiksoftware',text(112,1030,'Beide Verfahren: mit Statistiksoftware anwendbar',25,500,C.muted))
    +g('methods_expert','Vertiefung im Experten-Seminar',text(1810,1030,'Vertiefung: Experten-Seminar',25,500,C.muted,'end'));
  body=body.replace(/<text\b(?![^>]*data-source-evidence)/g,`<text data-source-evidence="spoken_text" data-source-reference="${scene.source_text_section_id}; Quellfolie 43; ${feedbackAudit}"`);
  return {body,feedbackRevision:true,reviewRoot,feedbackAudit,reviewKind:'method-comparison',density:'dense',steps:[
    step('mls_heading','Es gibt jedoch auch rechnerische Verfahren'),step('mle_heading','Es gibt jedoch auch rechnerische Verfahren'),
    step('mls_heading','Die Methode der kleinsten Quadrate','highlight'),step('mle_heading','und die Maximum-Likelihood-Methode','highlight'),
    step('mls_context','basiert auf dem Prinzip'),step('mls_points','basiert auf dem Prinzip'),
    step('mls_fit','eine möglichst gute Gerade','draw'),
    step('mls_residuals','die Abweichungen der Punkte zur Geraden'),step('mls_objective','Summe der Abweichungen im Quadrat'),
    step('mls_simple','Die Methode ist einfach anzuwenden'),step('mls_data','keine Zensierungsinformationen berücksichtigen kann'),
    step('mle_context','Anders verhält es sich'),step('mle_surface','Anders verhält es sich'),
    step('mle_maximum','die Parameter so bestimmt'),step('mle_objective','mit maximaler Wahrscheinlichkeit'),
    step('mle_data','sowohl vollständige als auch zensierte Daten'),step('mle_complex','ist aber mathematisch komplexer'),
    step('methods_software','Beide Verfahren lassen sich heute'),
    step('mls_data','die Unterschiede zu kennen','highlight'),step('mle_data','die Unterschiede zu kennen','highlight'),
    step('methods_expert','Experten-Seminar zur Lebensdauerdatenanalyse'),
  ],dependencies:{mls_context:['mls_heading'],mls_points:['mls_context'],mls_fit:['mls_points'],mls_residuals:['mls_points','mls_fit'],mls_objective:['mls_residuals'],mle_context:['mle_heading'],mle_surface:['mle_context'],mle_maximum:['mle_surface'],mle_objective:['mle_maximum']}};
}
module.exports={builders:{mls_mle:methods}};
