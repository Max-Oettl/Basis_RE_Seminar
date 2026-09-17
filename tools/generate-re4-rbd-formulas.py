"""Controlled formula glyph assets for the revised RBD comparison and derivation."""
import argparse
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'components/formula-library'))
sys.path.insert(0, str(ROOT / 'components/python-plot-library'))
from render_formula_svg import render_formula_svg
from re3_feedback_plots import normalize_asset

FORMULAS = {
    39: {
        'series-product': r'$R_S(t)=\prod_{i=1}^{n}R_i(t)$',
        'parallel-product': r'$R_S(t)=1-\prod_{i=1}^{n}[1-R_i(t)]$',
        'series-example': r'$0{,}9\cdot0{,}9\cdot0{,}9=0{,}729$',
        'parallel-example': r'$1-(1-0{,}9)^3=0{,}999$',
    },
    41: {
        'subsystem': r'$R_{2,3}=1-(1-R_2)\cdot(1-R_3)$',
        'series-reduced': r'$R_S=R_1\cdot R_{2,3}$',
        'system': r'$R_S=R_1\cdot[1-(1-R_2)\cdot(1-R_3)]$',
    },
}
parser = argparse.ArgumentParser()
parser.add_argument('--slide', type=int, choices=FORMULAS, required=True)
args = parser.parse_args()
for name, formula in FORMULAS[args.slide].items():
    output = ROOT / f'rebuild-proposals/svg/RE4/slide_{args.slide:03}/formulas' / (name + '.svg')
    render_formula_svg(formula, output, fontsize=32, color='#142452', fontset='stix')
    normalize_asset(output, 'formula-asset')
    print(output.name)
