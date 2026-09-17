"""Controlled glyph-path formulas for the logic inversion comparison."""
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'components/formula-library'))
sys.path.insert(0, str(ROOT / 'components/python-plot-library'))
from render_formula_svg import render_formula_svg
from re3_feedback_plots import normalize_asset

FORMULAS = {
    'failure-mapping': r'$F_S=f(F_1,\ldots,F_n)$',
    'reliability-mapping': r'$R_S=f(R_1,\ldots,R_n)$',
    'complement': r'$R(t)=1-F(t)$',
}
for name, formula in FORMULAS.items():
    output = ROOT / 'rebuild-proposals/svg/RE4/slide_023/formulas' / (name + '.svg')
    render_formula_svg(formula, output, fontsize=32, color='#142452', fontset='stix')
    normalize_asset(output, 'formula-asset')
    print(output.name)
