"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const scenePlanPath = path.join(repoRoot, "analysis", "rebuild-plans", "RE1_scene-plan.json");
const outputRoot = path.join(repoRoot, "rebuild-proposals", "svg", "RE1");
const scenePlan = JSON.parse(fs.readFileSync(scenePlanPath, "utf8"));

const backgroundGroup = {
  groupId: "brand_background",
  label: "RelTest-Education-Hintergrund",
  role: "background",
  members: ["Education-Farbverlauf", "ruhiges technisches Raster"],
  initialState: "static_decorative",
  firstRelevantBeatId: "pre_narration",
  initialVisibilityEvidence: "Der Markenrahmen enthaelt keine konkrete Fachinformation und darf vor der Narration sichtbar sein.",
  dependsOn: [],
  groupingRationale: "Der Hintergrund ist ruhiger Markenrahmen und trägt keine vorweggenommene Fachinformation.",
};

function group(groupId, label, role, members, initialState, dependsOn, groupingRationale, relevance = {}) {
  return { groupId, label, role, members, initialState, dependsOn, groupingRationale, ...relevance };
}

function beat(beatId, claim, sourceText, requiredContext, revealTogether, learnerStateBefore, learnerStateAfter) {
  return {
    beatId,
    claim,
    sourceText,
    occurrence: 1,
    requiredContext,
    revealTogether,
    learnerStateBefore,
    learnerStateAfter,
  };
}

function animationStep(stepId, beatId, targetId, action, rationale, effect = null) {
  const resolvedEffect = effect || (
    action === "show"
      ? { enterFrames: 16 }
      : action === "draw"
        ? { drawDurFrames: 42, direction: "leftToRight" }
        : action === "hide"
          ? { exitFrames: 14 }
          : action === "highlight"
            ? { highlightDurFrames: 30 }
            : { durFrames: 45 }
  );
  return { stepId, beatId, targetId, action, effect: resolvedEffect, rationale };
}

const specs = {
  1: {
    decision: "animated",
    animationRationale: "Die allgemeinen Einleitungsbeats bleiben ohne konkretes Fallmotiv. Foto, technische Ursache und Quellenbezug erscheinen erst gemeinsam mit der Einführung des A320neo-Beispiels; die wirtschaftliche Wirkung folgt danach.",
    initialStateRationale: "Der Sprecher beginnt allgemein mit Zuverlässigkeit und Rückrufaktionen. Das konkrete Triebwerksmotiv würde das spätere Beispiel vorwegnehmen; deshalb bleibt nur der Downstream-/Markenrahmen sichtbar.",
    groups: [
      group("a320_case_context", "A320neo-Fall mit technischer Ursache", "case_context", ["vollständiges A320neo-Triebwerksfoto", "Medienkontur", "Ursachenkarte", "Materialmangel", "Prozessfehler", "Einschlüsse und Haltbarkeitsfolge", "Quellenzeile"], "hidden_until_trigger", [], "Bild, Quelle, Ursache und technische Folge bilden das erstmals eingeführte konkrete Fallbeispiel.", {
        firstRelevantBeatId: "introduce_a320_case",
        initialVisibilityEvidence: "Vor diesem Beat spricht der Text nur allgemein über unzuverlässige Produkte, Rückrufe und Luftfahrtsicherheit.",
      }),
      group("a320_business_impact", "Ausmaß und Geschäftswirkung", "result", ["drei vollständige Kennzahlkarten", "Herstellerhinweis"], "hidden_until_trigger", ["a320_case_context"], "Umfang, Kosten und Herstellerbezug bilden gemeinsam die Wirkungsebene.", {
        firstRelevantBeatId: "show_a320_impact",
        initialVisibilityEvidence: "Kennzahlen und Herstellerwirkung werden erst im letzten Sprecherabschnitt genannt.",
      }),
    ],
    beats: [
      beat("general_reliability_intro", "Unzuverlässige Produkte und ihre Auswirkungen werden allgemein eingeführt.", "Bevor wir näher auf den Begriff", [], [], "Nur der ruhige Marken- und Downstream-Rahmen ist sichtbar.", "Noch kein konkretes Beispiel ist sichtbar."),
      beat("general_recall_intro", "Rückrufaktionen werden als allgemein bekanntes Phänomen eingeordnet.", "Jeder hier hat bestimmt schon einmal", [], [], "Noch kein konkretes Beispiel ist sichtbar.", "Die allgemeine Einordnung bleibt ohne vorweggenommenes Produktmotiv."),
      beat("aviation_safety_intro", "Die Bedeutung der Sicherheit in der Luftfahrt wird allgemein erklärt.", "Gerade das Thema Sicherheit spielt in der Luftfahrtindustrie", [], [], "Die Content-Ebene bleibt frei von einem konkreten Fall.", "Der Luftfahrtkontext ist gesprochen, aber das A320neo-Beispiel noch nicht eingeführt."),
      beat("introduce_a320_case", "Der A320neo-Rückruf wird als konkreter technischer Fall eingeführt.", "Ein Fall aus der jüngsten Vergangenheit", [], ["a320_case_context"], "Noch ist kein konkretes Triebwerkbeispiel sichtbar.", "Foto, Quelle, Ursache und technische Folge sind gemeinsam sichtbar."),
      beat("show_a320_impact", "Der technische Fehler erzeugt erheblichen wirtschaftlichen Schaden.", "Die Auswirkungen erstrecken sich auf die Hersteller", ["a320_case_context"], ["a320_business_impact"], "Der technische Fall ist erklärt.", "Umfang, Kosten und Herstellerbezug ergänzen den Fall."),
    ],
    steps: [
      animationStep("show_a320_case_context", "introduce_a320_case", "a320_case_context", "show", "Das konkrete Triebwerksfoto, der Quellenbezug und die vollständige Ursachenkarte werden bei der ersten Fallnennung gemeinsam eingeblendet."),
      animationStep("show_a320_business_impact", "show_a320_impact", "a320_business_impact", "show", "Alle wirtschaftlichen Kennzahlen erscheinen gemeinsam als Ergebnisblock."),
    ],
  },
  2: {
    decision: "animated",
    animationRationale: "Achsen und Legende schaffen Orientierung; die beiden vergleichbaren Datenserien erscheinen gemeinsam und die Schlusskennzahlen erst bei der gesprochenen Entwicklung.",
    initialStateRationale: "Der Diagrammrahmen ist notwendig, um die folgende offizielle Statistik einordnen zu können; Daten und Ergebnis bleiben zunächst verborgen.",
    groups: [
      group("recall_chart_frame", "Diagrammrahmen", "context", ["Achsen", "Skalen", "Raster", "Legende"], "visible_context", [], "Achsen, Skalen und Legende bilden den gemeinsamen Interpretationsrahmen."),
      group("recall_actions_series", "Rückrufaktionen 2009 bis 2019", "data_series", ["elf Jahresbalken der Rückrufaktionen"], "hidden_until_trigger", ["recall_chart_frame"], "Alle Jahresbalken bilden eine zusammengehörige Zeitreihe."),
      group("affected_vehicles_series", "Betroffene Fahrzeuge 2009 bis 2019", "data_series", ["Linie", "Jahresmarker", "zugehörige Serienlogik"], "hidden_until_trigger", ["recall_chart_frame"], "Linie und Marker werden als eine Datenserie wahrgenommen."),
      group("recall_key_figures", "Schlüsselwerte und Zehnjahresentwicklung", "result", ["Kennzahl 125", "Kennzahl 390", "Schlussfolgerung größer als dreifach"], "hidden_until_trigger", ["recall_actions_series", "affected_vehicles_series"], "Die drei Karten verdichten denselben Zeitvergleich."),
    ],
    beats: [
      beat("introduce_official_data", "Das KBA liefert offizielle Rückrufdaten.", "Das Kraftfahrt-Bundesamt liefert jedoch offizielle Daten", ["recall_chart_frame"], ["recall_actions_series", "affected_vehicles_series"], "Nur Achsen, Skalen und Legende sind sichtbar.", "Beide Datenserien sind gleichzeitig lesbar."),
      beat("summarize_ten_year_change", "Die Rückrufaktionen haben sich mehr als verdreifacht.", "In den letzten zehn Jahren hat sich", ["recall_chart_frame", "recall_actions_series", "affected_vehicles_series"], ["recall_key_figures"], "Der vollständige Datenverlauf ist sichtbar.", "Startwert, Endwert und Schlussfolgerung sind hervorgehoben."),
    ],
    steps: [
      animationStep("draw_recall_actions_series", "introduce_official_data", "recall_actions_series", "draw", "Die Balkenreihe entsteht entlang der Zeitachse."),
      animationStep("draw_affected_vehicles_series", "introduce_official_data", "affected_vehicles_series", "draw", "Die Fahrzeuglinie startet im selben Triggerfenster wie die Balken."),
      animationStep("show_recall_key_figures", "summarize_ten_year_change", "recall_key_figures", "show", "Die Schlusskennzahlen erscheinen erst nach sichtbarer Datengrundlage."),
    ],
  },
  3: {
    decision: "animated",
    animationRationale: "Das Quellfoto bleibt Orientierung; Ursache und Verletzungsfolge werden vor Ausmaß und Konsequenzen eingeführt.",
    initialStateRationale: "Das Airbagfoto etabliert Produkt und Fehlerkontext, ohne den späteren Umfang vorwegzunehmen.",
    groups: [
      group("case_media_003", "Takata-Airbagfoto", "context", ["vollständiges Airbagfoto", "Medienkontur"], "visible_context", [], "Foto und Kontur bilden ein untrennbares Quellmedium."),
      group("takata_case_context", "Ursache und Verletzungsfolge", "case_context", ["Ursachenkarte", "Gasgenerator", "Metallfragmente", "Verletzungsgefahr"], "hidden_until_trigger", ["case_media_003"], "Defekt und unmittelbare Sicherheitsfolge gehören fachlich zusammen."),
      group("takata_scope_and_consequences", "Ausmaß und Konsequenzen", "result", ["34-Millionen-Kennzahl", "finanzielle Belastung", "Recht und Imageschaden"], "hidden_until_trigger", ["takata_case_context"], "Umfang und Folgewirkungen bilden die zweite Erklärungsebene."),
    ],
    beats: [
      beat("introduce_takata_case", "Der Takata-Rückruf wird als großer Sicherheitsfall eingeordnet.", "Der Rückruf im Zusammenhang mit den Takata-Airbags", ["case_media_003"], ["takata_case_context"], "Nur der Airbag ist sichtbar.", "Defekt und Verletzungsfolge sind vollständig sichtbar."),
      beat("show_takata_scope", "Das Problem betrifft Millionen Fahrzeuge und erzeugt erhebliche Konsequenzen.", "Das Ausmaß dieses Problems zeigt sich", ["case_media_003", "takata_case_context"], ["takata_scope_and_consequences"], "Der technische Fall ist erklärt.", "Ausmaß und Konsequenzen sind ergänzt."),
    ],
    steps: [
      animationStep("show_takata_case_context", "introduce_takata_case", "takata_case_context", "show", "Die Ursachenkarte erscheint als vollständige Einheit."),
      animationStep("show_takata_scope_and_consequences", "show_takata_scope", "takata_scope_and_consequences", "show", "Alle Wirkungskennzahlen erscheinen gemeinsam."),
    ],
  },
  4: {
    decision: "animated",
    animationRationale: "Der Produktkontext bleibt sichtbar; Rückrufauslöser und Geschäftswirkung werden als zwei vollständige Sinnabschnitte aufgebaut.",
    initialStateRationale: "Das Gerätefoto stellt den Fall sofort her, ohne Ursache oder Ergebnis vorwegzunehmen.",
    groups: [
      group("case_media_004", "Galaxy-Note-7-Foto", "context", ["vollständiges Gerätefoto", "Medienkontur"], "visible_context", [], "Foto und Kontur bilden ein untrennbares Quellmedium."),
      group("note7_case_context", "Akkufehler und Brandfolge", "case_context", ["Ursachenkarte", "Designfehler", "Akkubrand", "Rückruf"], "hidden_until_trigger", ["case_media_004"], "Auslöser und unmittelbare Folge werden gemeinsam verstanden."),
      group("note7_business_impact", "Ausmaß und Geschäftswirkung", "result", ["2,5-Millionen-Kennzahl", "5,3-Milliarden-Kennzahl", "Vertrauensschaden"], "hidden_until_trigger", ["note7_case_context"], "Die drei Karten bilden die vollständige Geschäftswirkung."),
    ],
    beats: [
      beat("introduce_note7_case", "Samsung startet den großen Note-7-Rückruf.", "Samsung initiierte im September Zweitausendsechzehn", ["case_media_004"], ["note7_case_context"], "Nur das Produktfoto ist sichtbar.", "Auslöser und Brandfolge sind sichtbar."),
      beat("show_note7_impact", "Der Rückruf führt zu hohen Kosten und Vertrauensverlust.", "Die Konsequenzen für Samsung waren erheblich", ["case_media_004", "note7_case_context"], ["note7_business_impact"], "Der technische Fall ist erklärt.", "Umfang, Verlust und Vertrauensschaden sind sichtbar."),
    ],
    steps: [
      animationStep("show_note7_case_context", "introduce_note7_case", "note7_case_context", "show", "Der vollständige Fehlerkontext wird eingeblendet."),
      animationStep("show_note7_business_impact", "show_note7_impact", "note7_business_impact", "show", "Alle Konsequenzkarten erscheinen gemeinsam."),
    ],
  },
  5: {
    decision: "animated",
    animationRationale: "Die gemeinsame Wurzel bleibt sichtbar; jeder Konsequenzast erscheint vollständig mit eigenem Verbinder und Endpunkt.",
    initialStateRationale: "Die Wurzel benennt den Gegenstand. Die drei Klassen würden spätere Sprecherabschnitte vorwegnehmen.",
    groups: [
      group("consequence_root", "Folgen fehlerhafter Produkte", "context", ["dunkle Wurzelkarte", "weißer Wurzeltext"], "visible_context", [], "Karte und Text bilden den gemeinsamen Ausgangspunkt."),
      group("nonlegal_consequences", "Nicht-rechtliche Folgen", "concept_relationship_bundle", ["linker Verbinder", "vollständige Wirtschaftskarte", "alle drei wirtschaftlichen Folgen"], "hidden_until_trigger", ["consequence_root"], "Verbinder, Endpunkt und Inhalt dürfen nicht getrennt erscheinen."),
      group("civil_consequences", "Zivilrechtliche Folgen", "concept_relationship_bundle", ["mittlerer Verbinder", "vollständige Zivilrechtskarte", "Gewährleistung", "Produkthaftung"], "hidden_until_trigger", ["consequence_root"], "Verbinder, Endpunkt und Inhalt dürfen nicht getrennt erscheinen."),
      group("criminal_consequences", "Strafrechtliche Folgen", "concept_relationship_bundle", ["rechter Verbinder", "vollständige Strafrechtskarte", "alle drei Sanktionen"], "hidden_until_trigger", ["consequence_root"], "Verbinder, Endpunkt und Inhalt dürfen nicht getrennt erscheinen."),
    ],
    beats: [
      beat("show_nonlegal_branch", "Nicht-rechtliche Folgen treffen Wirtschaft und Image.", "Zu den nicht-rechtlichen Folgen zählen beispielsweise wirtschaftliche Verluste", ["consequence_root"], ["nonlegal_consequences"], "Nur die gemeinsame Wurzel ist sichtbar.", "Der vollständige linke Ast ist sichtbar."),
      beat("show_civil_branch", "Zivilrechtliche Folgen umfassen Gewährleistung und Produkthaftung.", "Zudem stehen Unternehmen vor zivilrechtlichen Konsequenzen", ["consequence_root", "nonlegal_consequences"], ["civil_consequences"], "Wurzel und wirtschaftlicher Ast sind sichtbar.", "Der zivilrechtliche Ast ist ergänzt."),
      beat("show_criminal_branch", "Schwere Fälle können strafrechtliche Sanktionen auslösen.", "In besonders schwerwiegenden Fällen können auch strafrechtliche Sanktionen", ["consequence_root", "nonlegal_consequences", "civil_consequences"], ["criminal_consequences"], "Wirtschaftliche und zivilrechtliche Folgen sind sichtbar.", "Alle drei Konsequenzklassen sind vollständig."),
    ],
    steps: [
      animationStep("show_nonlegal_consequences", "show_nonlegal_branch", "nonlegal_consequences", "show", "Der linke Ast erscheint atomar inklusive Verbinder."),
      animationStep("show_civil_consequences", "show_civil_branch", "civil_consequences", "show", "Der mittlere Ast erscheint atomar inklusive Verbinder."),
      animationStep("show_criminal_consequences", "show_criminal_branch", "criminal_consequences", "show", "Der rechte Ast erscheint atomar inklusive Verbinder."),
    ],
  },
  6: {
    decision: "animated",
    animationRationale: "Das Bezugszentrum ist ab Frame 0 sichtbar; drei vollständige Einflussfamilien folgen der Sprecherreihenfolge.",
    initialStateRationale: "Zuverlässigkeit ist der notwendige Orientierungsanker. Einzelne Einflüsse würden spätere Aussagen vorwegnehmen.",
    groups: [
      group("reliability_core", "Zuverlässigkeit als Bezugszentrum", "context", ["beide Ellipsen", "Text Zuverlässigkeit"], "visible_context", [], "Bezugsfläche, Kontur und Begriff bilden eine Einheit."),
      group("development_pressure", "Entwicklungszeit und Entwicklungskosten", "concept_relationship_bundle", ["zwei vollständige Labels", "zwei zugehörige Pfeile"], "hidden_until_trigger", ["reliability_core"], "Pfeile und ihre Ausgangslabels erscheinen als gemeinsamer Einflussblock."),
      group("complexity_pressure", "Komplexität und Funktionsumfang", "concept_relationship_bundle", ["zwei vollständige Labels", "zwei zugehörige Pfeile"], "hidden_until_trigger", ["reliability_core"], "Beide Faktoren werden im selben Satz eingeführt."),
      group("counteracting_demands", "Gegenläufige Anforderungen", "concept_relationship_bundle", ["drei vollständige Labels", "drei zugehörige Pfeile"], "hidden_until_trigger", ["reliability_core"], "Haftung, Fehlerkosten und Kundenanforderungen bilden den gemeinsamen Kontrastblock."),
    ],
    beats: [
      beat("show_development_pressure", "Entwicklungszeit und Entwicklungskosten erzeugen Absicherungsdruck.", "Wichtige Einflussgrößen auf die Zuverlässigkeit sind", ["reliability_core"], ["development_pressure"], "Nur das Bezugszentrum ist sichtbar.", "Der Entwicklungsblock ist vollständig sichtbar."),
      beat("show_complexity_pressure", "Komplexität und Funktionsumfang verstärken den Druck.", "Zusätzlich steigen auch Komplexität und Funktionsumfang", ["reliability_core", "development_pressure"], ["complexity_pressure"], "Zentrum und Entwicklungsdruck sind sichtbar.", "Der zweite negative Einflussblock ist ergänzt."),
      beat("show_counteracting_demands", "Haftung, Fehlerkosten und Kundenanforderungen wirken gegenläufig.", "Dem gegenüber stehen die steigende Produkthaftung", ["reliability_core", "development_pressure", "complexity_pressure"], ["counteracting_demands"], "Die belastenden Einflüsse sind sichtbar.", "Das gesamte Spannungsfeld ist sichtbar."),
    ],
    steps: [
      animationStep("show_development_pressure", "show_development_pressure", "development_pressure", "show", "Labels und Pfeile erscheinen gemeinsam."),
      animationStep("show_complexity_pressure", "show_complexity_pressure", "complexity_pressure", "show", "Labels und Pfeile erscheinen gemeinsam."),
      animationStep("show_counteracting_demands", "show_counteracting_demands", "counteracting_demands", "show", "Alle drei Gegenkräfte erscheinen gemeinsam."),
    ],
  },
  7: {
    decision: "static",
    animationRationale: "Der Sprechertext liest den Gesamtvergleich; ein schrittweiser Aufbau würde den direkten Mehrjahresvergleich verschlechtern.",
    initialStateRationale: "Die vollständige Statistik ist der kleinste sinnvolle Vergleichszustand.",
    groups: [
      group("purchase_chart_context", "Mehrjahresvergleich der Kaufkriterien", "context", ["Top-2-Hinweise", "vollständiger Balkenplot", "Legende", "Achsen"], "visible_context", [], "Alle Reihen und Kategorien müssen gleichzeitig vergleichbar sein."),
    ],
    beats: [],
    steps: [],
  },
  8: {
    decision: "animated",
    animationRationale: "Die Szene beginnt mit einer allgemeinen Lebensdaueraussage. Anlagenkontext, Zitatkörper, zitierte Schlusszeile und praktische Bedeutung folgen deshalb erst an ihren jeweils gesprochenen Stellen.",
    initialStateRationale: "Vor der SKF-Nennung bleibt die Content-Ebene leer. Das konkrete Anlagenmotiv würde den folgenden Service-Programm-Kontext sonst vorwegnehmen.",
    groups: [
      group("motivation_media_context", "Industrieller Anlagenkontext", "context", ["vollständiges Anlagenfoto", "ruhige Marine-Überlagerung"], "hidden_until_trigger", [], "Foto und Tonwertüberlagerung erscheinen gemeinsam mit der ersten SKF-Nennung.", { firstRelevantBeatId: "show_media_context", initialVisibilityEvidence: "Vor der SKF-Nennung bleibt die Szene allgemein; das konkrete Anlagenmotiv wäre verfrüht." }),
      group("forecast_quote_setup", "Zitat zum Unvorhersehbaren", "quote", ["vollständige Zitatkarte", "SKF-Kontextlabel", "Anführungszeichen", "Zitatkörper bis Maschine"], "hidden_until_trigger", ["motivation_media_context"], "Zitatkarte, Marke und gesprochener Zitatkörper bilden einen Leseblock.", { firstRelevantBeatId: "show_quote_setup", initialVisibilityEvidence: "Der Zitatkörper wird erst ab der gesprochenen ersten Zitatzeile benötigt." }),
      group("forecast_quote_conclusion", "Schlusszeile des SKF-Zitats", "quote", ["Trennlinie innerhalb der Zitatkarte", "Originalzeile Machen Sie zwei daraus", "schließendes Anführungszeichen"], "hidden_until_trigger", ["forecast_quote_setup"], "Die Pointe bleibt räumlich und typografisch Bestandteil desselben Zitats, wird aber erst an ihrer gesprochenen Stelle sichtbar.", { firstRelevantBeatId: "show_quote_conclusion", initialVisibilityEvidence: "Die Schlusszeile darf den Aufbau des Zitats nicht vorwegnehmen." }),
      group("forecast_quote_implication", "Praktische Bedeutung des Zitats", "result", ["vollständige Ergebniskarte", "Vorhersage- und Austauschziel"], "hidden_until_trigger", ["forecast_quote_conclusion"], "Die Interpretation ist vom direkten Zitat getrennt und folgt erst mit der gesprochenen Intention.", { firstRelevantBeatId: "show_quote_implication", initialVisibilityEvidence: "Die Interpretation folgt erst nach dem vollständigen direkten Zitat." }),
    ],
    beats: [
      beat("introduce_lifetime_relevance", "Eine ausreichende Lebensdauer wird allgemein als Schlüsselelement eingeführt.", "Ein Schlüsselelement in diesem Bestreben", [], [], "Nur der ruhige Marken- und Downstream-Rahmen ist sichtbar.", "Noch kein konkreter SKF- oder Anlagenkontext ist sichtbar."),
      beat("show_media_context", "SKF und sein Service-Programm führen in den konkreten Maschinenkontext.", "bewirbt SKF ihr Trouble-Free Operation Service Program", [], ["motivation_media_context"], "Die allgemeine Lebensdaueraussage ist gesprochen.", "Das vollständige Anlagenmotiv ist sichtbar."),
      beat("show_quote_setup", "Drei Ereignisse gelten als nicht vorhersagbar.", "Drei Dinge kann keiner voraussagen", ["motivation_media_context"], ["forecast_quote_setup"], "Nur die Anlage ist sichtbar.", "Zitatkarte und Zitatkörper sind sichtbar."),
      beat("show_quote_conclusion", "Die Schlusszeile reduziert die drei unvorhersagbaren Ereignisse auf zwei.", "Mach zwei daraus", ["motivation_media_context", "forecast_quote_setup"], ["forecast_quote_conclusion"], "Der Zitatkörper ist sichtbar.", "Die originale Schlusszeile vervollständigt dasselbe Zitat."),
      beat("show_quote_implication", "Das Lebensdauer-Ende soll vorhersagbar und ein Austausch vor dem Ausfall möglich werden.", "Die Intention dahinter ist klar", ["motivation_media_context", "forecast_quote_setup", "forecast_quote_conclusion"], ["forecast_quote_implication"], "Das vollständige Zitat ist sichtbar.", "Die praktische Bedeutung ist klar vom Zitat getrennt ergänzt."),
    ],
    steps: [
      animationStep("show_motivation_media_context", "show_media_context", "motivation_media_context", "show", "Das konkrete Anlagenbild erscheint erst bei der SKF-Nennung."),
      animationStep("show_forecast_quote_setup", "show_quote_setup", "forecast_quote_setup", "show", "Zitatkarte und gesprochener Hauptsatz erscheinen als vollständiger Leseblock."),
      animationStep("show_forecast_quote_conclusion", "show_quote_conclusion", "forecast_quote_conclusion", "show", "Die Schlusszeile wird innerhalb der bestehenden Zitatkarte ergänzt."),
      animationStep("show_forecast_quote_implication", "show_quote_implication", "forecast_quote_implication", "show", "Die praktische Bedeutung erscheint erst nach dem vollständigen Zitat."),
    ],
  },
  9: {
    decision: "animated",
    animationRationale: "Der PKW ist fester Systemanker; Hierarchie, Funktionen und Fehlerwirkung werden in fachlicher Abhängigkeit aufgebaut.",
    initialStateRationale: "Der PKW genügt als Bezugsobjekt für die einleitende Fragestellung. Untergeordnete Ebenen würden die Erklärung vorwegnehmen.",
    groups: [
      group("vehicle_root", "PKW als Systembezug", "context", ["dunkle PKW-Karte", "Fahrzeugpiktogramm", "PKW-Label"], "visible_context", [], "Karte, Icon und Begriff bilden den Systemanker."),
      group("vehicle_system_hierarchy", "Systemstruktur eines PKW", "concept_relationship_bundle", ["alle orthogonalen Verbinder", "Motor, Getriebe und Fahrwerk", "vier Motorkomponenten"], "hidden_until_trigger", ["vehicle_root"], "Alle Verbinder erscheinen gleichzeitig mit ihren Endpunkten."),
      group("function_examples", "Funktionen der Systemelemente", "relationship", ["Funktionslabels an allen Knoten", "vollständiger Funktionszusammenhang"], "hidden_until_trigger", ["vehicle_root", "vehicle_system_hierarchy"], "Funktionen benötigen die bereits sichtbare Systemstruktur."),
      group("failure_propagation", "Fehlerwirkung vom Kolben bis zum PKW", "relationship", ["Ausfallmarker am Kolben", "vollständige Fehlerwirkungskette", "beide Fehlerpfeile"], "hidden_until_trigger", ["vehicle_system_hierarchy", "function_examples"], "Fehlerwirkung setzt Struktur und Normalfunktion voraus."),
    ],
    beats: [
      beat("show_vehicle_hierarchy", "Der PKW wird in Teilsysteme und Komponenten zerlegt.", "schauen wir uns zunächst einmal die System-Struktur", ["vehicle_root"], ["vehicle_system_hierarchy"], "Nur der PKW ist sichtbar.", "Der vollständige Systembaum ist sichtbar."),
      beat("show_functions", "Jede Systemebene erfüllt eine notwendige Funktion.", "Im Falle eines PKWs ist die entsprechende Funktion", ["vehicle_root", "vehicle_system_hierarchy"], ["function_examples"], "Die reine Struktur ist sichtbar.", "Alle Funktionsbeziehungen sind ergänzt."),
      beat("show_failure_propagation", "Der Kolbenausfall wirkt bis zur Fahrfunktion.", "Verliert nun beispielsweise der Kolben", ["vehicle_system_hierarchy", "function_examples"], ["failure_propagation"], "Struktur und Normalfunktion sind sichtbar.", "Die vollständige Fehlerfortpflanzung ist sichtbar."),
    ],
    steps: [
      animationStep("show_vehicle_system_hierarchy", "show_vehicle_hierarchy", "vehicle_system_hierarchy", "show", "Knoten und Verbinder erscheinen als vollständiger Baum."),
      animationStep("show_function_examples", "show_functions", "function_examples", "show", "Alle Funktionslabels und die Beziehungskette erscheinen gemeinsam."),
      animationStep("show_failure_propagation", "show_failure_propagation", "failure_propagation", "show", "Marker, Pfeile und Fehlertexte erscheinen gemeinsam."),
    ],
  },
  10: {
    decision: "animated",
    animationRationale: "Der Plotrahmen ist Startkontext; Verteilungen erscheinen jeweils gemeinsam mit ihrer Einflusskarte, danach Überlappung und Folgen.",
    initialStateRationale: "Achsen und Skalen sind für die statistische Erklärung notwendig. Kurven und Ergebnis würden spätere Aussagen vorwegnehmen.",
    groups: [
      group("ssi_plot_frame", "Stress-Strength-Diagrammrahmen", "context", ["Achsen", "Skalen", "Raster", "Achsenlabels"], "visible_context", [], "Der Rahmen ist gemeinsamer Bezug für beide Verteilungen.", { firstRelevantBeatId: "pre_narration", initialVisibilityEvidence: "Achsen und Raster enthalten noch kein fachliches Ergebnis und dienen nur der Orientierung." }),
      group("stress_distribution", "Belastungsverteilung", "data_series", ["Belastungskurve", "Belastungsfläche", "direktes Kurvenlabel"], "hidden_until_trigger", ["ssi_plot_frame"], "Kurve, Fläche und Label bilden eine Datenserie.", { firstRelevantBeatId: "show_stress_context", initialVisibilityEvidence: "Die Belastungsverteilung wird erst im ersten Modellschritt erklärt." }),
      group("stress_influences", "Einflüsse auf die Belastung", "context_card", ["vollständige Belastungskarte", "alle drei Einflussgrößen"], "hidden_until_trigger", ["ssi_plot_frame"], "Karte und alle Listeneinträge bilden eine Einheit.", { firstRelevantBeatId: "show_stress_context", initialVisibilityEvidence: "Die Einflussgrößen gehören zur Einführung der Belastung und erscheinen mit ihr." }),
      group("strength_distribution", "Belastbarkeitsverteilung", "data_series", ["Belastbarkeitskurve", "Belastbarkeitsfläche", "direktes Kurvenlabel"], "hidden_until_trigger", ["ssi_plot_frame"], "Kurve, Fläche und Label bilden eine Datenserie.", { firstRelevantBeatId: "show_strength_context", initialVisibilityEvidence: "Die Belastbarkeit ist der zweite Modellschritt und bleibt zuvor verborgen." }),
      group("strength_influences", "Einflüsse auf die Belastbarkeit", "context_card", ["vollständige Belastbarkeitskarte", "alle drei Einflussgrößen"], "hidden_until_trigger", ["ssi_plot_frame"], "Karte und alle Listeneinträge bilden eine Einheit.", { firstRelevantBeatId: "show_strength_context", initialVisibilityEvidence: "Die Einflussgrößen werden zusammen mit der Belastbarkeit eingeführt." }),
      group("failure_overlap", "Ausfallverteilung im Überlappungsbereich", "result", ["weich auslaufende korallfarbene Glockenkurve", "sichtbare Verteilungskontur", "freistehendes Ausfalllabel mit Führungslinie"], "hidden_until_trigger", ["stress_distribution", "strength_distribution"], "Glockenkurve, Füllung, Führungslinie und Label bilden gemeinsam die Ausfallverteilung im sichtbaren Überlappungsbereich.", { firstRelevantBeatId: "show_failure_overlap", initialVisibilityEvidence: "Die Ausfallverteilung setzt beide vollständig sichtbaren Hauptverteilungen voraus." }),
      group("failure_consequences", "Ausfallfolgen", "result", ["Kostenkarte", "Haftungskarte", "Kundenzufriedenheitskarte"], "hidden_until_trigger", ["failure_overlap"], "Alle drei Folgen bilden den gemeinsamen Wirkungsausgang.", { firstRelevantBeatId: "show_failure_consequences", initialVisibilityEvidence: "Die Folgen werden erst nach Erklärung der Ausfälle benötigt." }),
    ],
    beats: [
      beat("show_stress_context", "Belastung ist statistisch verteilt und nutzungsabhängig.", "Zunächst einmal wirkt auf ein Produkt", ["ssi_plot_frame"], ["stress_distribution", "stress_influences"], "Nur der Diagrammrahmen ist sichtbar.", "Belastungskurve und Einflusskarte sind gemeinsam sichtbar."),
      beat("show_strength_context", "Belastbarkeit ist ebenfalls statistisch verteilt.", "Dem gegenüber steht die Belastbarkeit", ["ssi_plot_frame", "stress_distribution", "stress_influences"], ["strength_distribution", "strength_influences"], "Die Belastungsseite ist erklärt.", "Beide Verteilungen und beide Einflusskarten sind sichtbar."),
      beat("show_failure_overlap", "Ausfälle entstehen, wenn Belastung die Belastbarkeit übersteigt.", "Zwischen den Verteilungen von Belastung und Belastbarkeit", ["stress_distribution", "strength_distribution"], ["failure_overlap"], "Beide Verteilungen sind sichtbar.", "Der Ausfallbereich ist eindeutig markiert."),
      beat("show_failure_consequences", "Ausfälle führen zu Kosten, Haftung und Kundenunzufriedenheit.", "Diese Ausfälle wiederum führen zu Kundenunzufriedenheit", ["failure_overlap"], ["failure_consequences"], "Der Ausfallbereich ist sichtbar.", "Die drei Folgen sind ergänzt."),
    ],
    steps: [
      animationStep("draw_stress_distribution", "show_stress_context", "stress_distribution", "draw", "Die Belastungskurve entsteht entlang der x-Achse."),
      animationStep("show_stress_influences", "show_stress_context", "stress_influences", "show", "Die Einflusskarte startet gleichzeitig mit der Kurve."),
      animationStep("draw_strength_distribution", "show_strength_context", "strength_distribution", "draw", "Die Belastbarkeitskurve entsteht entlang derselben Achse."),
      animationStep("show_strength_influences", "show_strength_context", "strength_influences", "show", "Die Einflusskarte startet gleichzeitig mit der Kurve."),
      animationStep("show_failure_overlap", "show_failure_overlap", "failure_overlap", "show", "Der Ergebnisbereich erscheint erst nach beiden Verteilungen."),
      animationStep("show_failure_consequences", "show_failure_consequences", "failure_consequences", "show", "Alle Folgen erscheinen als gemeinsame Ergebnisgruppe."),
    ],
  },
  11: {
    decision: "animated",
    animationRationale: "Die gestrichelte Ausgangslage bleibt sichtbar; die Zielkurve vollzieht eine fachlich begründete Rechtsverschiebung und erst danach erscheint der reduzierte Ausfallbereich.",
    initialStateRationale: "Belastung, Achsen und gestrichelte Ausgangslage sind notwendig, damit die Verschiebung als Zustandsänderung lesbar ist.",
    groups: [
      group("shift_plot_context", "Vorher-Zustand des Stress-Strength-Modells", "context", ["Achsen", "Belastungsverteilung", "gestrichelte Vergleichskurve", "Kurvenlabels"], "visible_context", [], "Alle Bestandteile definieren den fachlichen Vorher-Zustand; die gestrichelte Kurve bleibt ohne zusätzliches Innenlabel eindeutig.", { firstRelevantBeatId: "pre_narration", initialVisibilityEvidence: "Der Vorher-Zustand ist notwendiger Vergleichsanker für die unmittelbar erklärte Verschiebung." }),
      group("shifted_strength_distribution", "Nach rechts bewegte Belastbarkeit", "state_change", ["Belastbarkeitskurve", "Belastbarkeitsfläche", "direktes Label"], "hidden_until_trigger", ["shift_plot_context"], "Kurve, Fläche und Label müssen sich als dasselbe Objekt bewegen.", { firstRelevantBeatId: "move_strength_right", initialVisibilityEvidence: "Die Zielkurve darf erst mit der beschriebenen Qualitätsverbesserung erscheinen." }),
      group("shifted_strength_explanation", "Belastbarkeit erhöhen", "annotation", ["vollständige Erklärungskarte", "Richtungspfeil"], "hidden_until_trigger", ["shifted_strength_distribution"], "Erklärung und Richtungspfeil beschreiben dieselbe Zustandsänderung.", { firstRelevantBeatId: "move_strength_right", initialVisibilityEvidence: "Richtungspfeil und Erklärung gehören zur sichtbaren Kurvenbewegung." }),
      group("failure_overlap", "Reduzierte Ausfallverteilung", "result", ["schmalere weich auslaufende Glockenkurve", "sichtbare Verteilungskontur", "freistehendes Ausfalllabel mit Führungslinie"], "hidden_until_trigger", ["shifted_strength_distribution"], "Breite und Höhe der glockenförmigen Ausfallverteilung reduzieren sich als Ergebnis der sichtbaren Verschiebung; Führungslinie und Label erscheinen mit ihr.", { firstRelevantBeatId: "show_reduced_overlap", initialVisibilityEvidence: "Das Ergebnis darf die Wirkung der Verschiebung nicht vorwegnehmen." }),
      group("reduced_overlap_explanation", "Kleinerer Ausfallbereich", "annotation", ["vollständige grüne Ergebnisbox"], "hidden_until_trigger", ["failure_overlap"], "Ergebnisbox und Ausfallbereich werden gemeinsam gelesen.", { firstRelevantBeatId: "show_reduced_overlap", initialVisibilityEvidence: "Die Ergebnisbox erscheint gemeinsam mit der reduzierten Ausfallverteilung." }),
    ],
    beats: [
      beat("move_strength_right", "Höhere Belastbarkeit verschiebt die Kurve nach rechts.", "wodurch dessen Kurve nach rechts verschoben wird", ["shift_plot_context"], ["shifted_strength_distribution", "shifted_strength_explanation"], "Die gestrichelte Ausgangslage ist sichtbar.", "Die neue Kurve steht rechts und die Richtung ist erklärt."),
      beat("show_reduced_overlap", "Die Rechtsverschiebung verkleinert den Ausfallbereich.", "Die Folge ist ein kleinerer Überlappungsbereich", ["shift_plot_context", "shifted_strength_distribution"], ["failure_overlap", "reduced_overlap_explanation"], "Vorher- und Nachherlage sind vergleichbar.", "Der kleinere Ausfallbereich und seine Aussage sind sichtbar."),
    ],
    steps: [
      animationStep("move_shifted_strength_distribution", "move_strength_right", "shifted_strength_distribution", "transform", "Die Bewegung zeigt die reale Änderung desselben fachlichen Objekts.", { durFrames: 45, fromTranslateX: -74.8, fromTranslateY: 0, fromScale: 1, translateX: 0, translateY: 0, scale: 1, transformOrigin: "center" }),
      animationStep("show_shifted_strength_explanation", "move_strength_right", "shifted_strength_explanation", "show", "Erklärung und Bewegung starten im selben Triggerfenster."),
      animationStep("show_reduced_failure_overlap", "show_reduced_overlap", "failure_overlap", "show", "Der Ausfallbereich erscheint erst nach der Verschiebung."),
      animationStep("show_reduced_overlap_explanation", "show_reduced_overlap", "reduced_overlap_explanation", "show", "Ergebnisbox und Bereich starten gemeinsam."),
    ],
  },
  12: {
    decision: "animated",
    animationRationale: "Der bekannte Diagrammkontext bleibt sichtbar; die neue Information ist der vollständige Zielkonflikt aus Ausfällen und Kosten.",
    initialStateRationale: "Das bekannte Stress-Strength-Modell ist der notwendige Bezugsrahmen. Die Waage würde den Schluss vorwegnehmen.",
    groups: [
      group("tradeoff_plot_context", "Bekannter Stress-Strength-Kontext", "context", ["vollständiger statischer Plot", "Belastungslabel", "Belastbarkeitslabel"], "visible_context", [], "Der Plot ist aus den vorherigen Szenen bekannt und bleibt stabil.", { firstRelevantBeatId: "pre_narration", initialVisibilityEvidence: "Der bekannte Plot ist notwendiger Ausgangskontext für die unmittelbar folgende Kostenabwägung." }),
      group("quality_cost_tradeoff", "Zielkonflikt aus Ausfällen und Kosten", "result", ["vollständige Zielkonfliktkarte", "beide Kennzahlkarten", "Waagenasset", "Zielkorridor"], "hidden_until_trigger", ["tradeoff_plot_context"], "Kennzahlen, Waage und Zieltext bilden eine unteilbare Abwägung.", { firstRelevantBeatId: "show_quality_cost_tradeoff", initialVisibilityEvidence: "Die Kostenabwägung wird erst bei der gesprochenen Mehrkosten-Aussage relevant." }),
    ],
    beats: [
      beat("show_quality_cost_tradeoff", "Höhere Belastbarkeit senkt Ausfälle, erhöht aber Kosten.", "Durch die Qualitätserhöhung entstehen aber auch deutliche Mehrkosten", ["tradeoff_plot_context"], ["quality_cost_tradeoff"], "Nur der bekannte Diagrammkontext ist sichtbar.", "Der vollständige Zielkonflikt ist sichtbar."),
    ],
    steps: [
      animationStep("show_quality_cost_tradeoff", "show_quality_cost_tradeoff", "quality_cost_tradeoff", "show", "Die gesamte Abwägung erscheint als eine fachliche Einheit."),
    ],
  },
  13: {
    decision: "animated",
    animationRationale: "Die Definition ist eine unteilbare fachliche Aussage und erscheint vollständig mit dem ersten Definitionssatz.",
    initialStateRationale: "Vor dem unmittelbar beginnenden Definitionssatz bleibt nur der ruhige Markenrahmen sichtbar; einzelne Begriffe würden die Definition fragmentieren.",
    groups: [
      group("reliability_definition", "Definition der Zuverlässigkeit", "definition", ["vertikale Definitionsspur", "fünf Piktogramme", "vollständiger Definitionssatz", "alle Hervorhebungen"], "hidden_until_trigger", [], "Satzstruktur, Icons und Schlüsselbegriffe bilden eine einzige Definition."),
    ],
    beats: [
      beat("show_reliability_definition", "Zuverlässigkeit wird als Wahrscheinlichkeit des ausfallfreien Funktionserhalts definiert.", "Die Zuverlässigkeit ist die Wahrscheinlichkeit dafür", [], ["reliability_definition"], "Nur der ruhige Markenrahmen ist sichtbar.", "Die vollständige Definition ist sichtbar."),
    ],
    steps: [
      animationStep("show_reliability_definition", "show_reliability_definition", "reliability_definition", "show", "Die Definition wird nicht in Wortfragmente zerlegt."),
    ],
  },
};

function parseSlides(argv) {
  const index = argv.indexOf("--slides");
  if (index < 0) return new Set(Object.keys(specs).map(Number));
  const value = argv[index + 1];
  if (!value) throw new Error("--slides requires a slide number or range.");
  const slides = new Set();
  for (const token of value.split(",")) {
    const match = token.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!match) throw new Error(`Invalid slide selection: ${token}`);
    const start = Number(match[1]);
    const end = Number(match[2] || match[1]);
    for (let slide = Math.min(start, end); slide <= Math.max(start, end); slide += 1) slides.add(slide);
  }
  return slides;
}

function buildStateReview(spec) {
  const visible = [backgroundGroup, ...spec.groups]
    .filter((item) => ["visible_context", "static_decorative"].includes(item.initialState))
    .map((item) => item.groupId);
  const reviews = [{
    stateId: "initial",
    afterBeatId: null,
    visibleGroups: [...visible],
    reviewStatus: "planned",
    notes: spec.initialStateRationale,
  }];

  for (const narrativeBeat of spec.beats) {
    reviews.push({
      stateId: `before_${narrativeBeat.beatId}`,
      afterBeatId: null,
      visibleGroups: [...visible],
      reviewStatus: "planned",
      notes: narrativeBeat.learnerStateBefore,
    });
    for (const groupId of narrativeBeat.revealTogether) {
      if (!visible.includes(groupId)) visible.push(groupId);
    }
    reviews.push({
      stateId: `after_${narrativeBeat.beatId}`,
      afterBeatId: narrativeBeat.beatId,
      visibleGroups: [...visible],
      reviewStatus: "planned",
      notes: narrativeBeat.learnerStateAfter,
    });
  }

  reviews.push({
    stateId: "end",
    afterBeatId: spec.beats.at(-1)?.beatId || null,
    visibleGroups: [backgroundGroup, ...spec.groups]
      .filter((item) => item.initialState !== "excluded")
      .map((item) => item.groupId),
    reviewStatus: "planned",
    notes: "Der vollständige statische Endzustand bleibt ohne Animation fachlich verständlich.",
  });
  return reviews;
}

function main() {
  const selected = parseSlides(process.argv);
  for (const slideNumber of [...selected].sort((left, right) => left - right)) {
    const spec = specs[slideNumber];
    if (!spec) throw new Error(`No chapter-one dramaturgy spec for slide ${slideNumber}.`);
    const scene = scenePlan.scenes.find((candidate) => Number(candidate.output_slide_number) === slideNumber);
    if (!scene) throw new Error(`Scene plan entry missing for slide ${slideNumber}.`);

    const plan = {
      schemaVersion: "svgAnimationDramaturgyPlan/v1",
      sceneId: scene.scene_id,
      svgPath: `rebuild-proposals/svg/RE1/${scene.work_unit}/${scene.work_unit}.svg`,
      spokenText: scene.spoken_text,
      animationDecision: spec.decision,
      animationRationale: spec.animationRationale,
      runtimeProfile: {
        manifestSchema: "svgAnimationManifest/v1",
        supportedActions: ["show", "hide", "highlight", "draw", "transform"],
        initialVisibleAnimatedTargetsSupported: false,
        entranceMotionRenderedInReviewer: false,
        blurSupported: false,
        notes: [
          "Show wird als reines Fade bewertet.",
          "Gleiche sourceText-Phrase startet alle Schritte derselben Triggergruppe gleichzeitig.",
        ],
      },
      initialStateRationale: spec.initialStateRationale,
      semanticGroups: [backgroundGroup, ...spec.groups],
      narrativeBeats: spec.beats,
      steps: spec.steps,
      unsupportedEffectRequests: [],
      stateReview: buildStateReview(spec),
    };

    const outputPath = path.join(outputRoot, scene.work_unit, "animation-dramaturgy-plan.json");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
    process.stdout.write(`Wrote ${path.relative(repoRoot, outputPath)}\n`);
  }
}

main();
