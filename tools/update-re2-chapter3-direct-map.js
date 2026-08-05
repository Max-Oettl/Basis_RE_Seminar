const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const mapPath = path.join(root, "analysis", "rebuild-plans", "RE2_source-reference-map.json");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));

const slugs = {
  20: "fta_acronym",
  21: "fta_top_down_hierarchy",
  22: "fta_fault_tree_principle",
  23: "fta_types",
  24: "fta_process_overview",
  25: "fta_step1_focus",
  26: "fta_step1_system_methods",
  27: "fta_step1_recap",
  28: "fta_step2_focus",
  29: "fta_top_event_approaches",
  30: "fta_preventive_corrective",
  31: "fta_step2_recap",
  32: "fta_step3_focus",
  33: "fta_failure_mode_classes",
  34: "fta_motor_example_paths",
  35: "fta_step3_recap",
  36: "fta_step4_focus",
  37: "fta_logic_gates",
  38: "fta_motor_top_event",
  39: "fta_motor_failure_paths",
  40: "fta_motor_primary_causes",
  41: "fta_motor_secondary_causes",
  42: "fta_motor_commanded_causes",
  43: "fta_motor_complete_tree",
  44: "fta_undeveloped_event",
  45: "fta_basic_event",
  46: "fta_not_investigated_event",
  47: "fta_transfer_gate",
  48: "fta_step4_recap",
  49: "fta_step5_focus",
  50: "fta_critical_paths",
  51: "fta_minimal_cut_sets",
  52: "fta_aircraft_landing_gear",
  53: "fta_aircraft_top_event",
  54: "fta_aircraft_group_failures",
  55: "fta_aircraft_tire_failures",
  56: "fta_aircraft_critical_paths",
  57: "fta_aircraft_common_mode",
  58: "fta_hospital_power_system",
  59: "fta_hospital_power_tree",
  60: "fta_hospital_common_mode",
  61: "fta_hospital_extended_causes",
  62: "fta_hospital_common_cause",
};

const directMappings = Object.entries(slugs).map(([key, slug]) => {
  const n = Number(key);
  const lesson = n <= 22 ? 1 : n === 23 ? 2 : n <= 51 ? 3 : 4;
  return {
    work_unit: `slide_${String(n).padStart(3, "0")}`,
    scene_id: `re2_ch3_${slug}`,
    chapter: 3,
    lesson,
    output_slide_number: n,
    source_slides: [n],
    primary_source_slide: n,
    mapping_type: "direct",
    rationale: "Eigenständiger, quelltreuer Zielzustand; Kapitel 3 wird ausdrücklich Folie für Folie umgesetzt.",
  };
});

const firstChapter3 = map.mappings.findIndex((entry) => entry.chapter === 3);
const firstChapter4 = map.mappings.findIndex((entry) => entry.chapter === 4);
if (firstChapter3 < 0 || firstChapter4 < 0 || firstChapter4 <= firstChapter3) {
  throw new Error("Chapter boundaries could not be resolved in RE2 source-reference map.");
}

map.mappings.splice(firstChapter3, firstChapter4 - firstChapter3, ...directMappings);
map.updated_at = "2026-07-24";
map.planning_status = "module_plan_ready_chapter_02_completed_chapter_03_direct_mapping";
fs.writeFileSync(mapPath, `${JSON.stringify(map, null, 2)}\n`, "utf8");
process.stdout.write(`Replaced chapter 3 with ${directMappings.length} direct source mappings.\n`);
