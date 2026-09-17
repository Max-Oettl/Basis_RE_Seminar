"""Controlled formula assets for the concluding RE4 reference scenes."""
import argparse
import sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'components/formula-library'))
sys.path.insert(0,str(ROOT/'components/python-plot-library'))
from render_formula_svg import render_formula_svg
from re3_feedback_plots import normalize_asset
FORMULAS={54:{'boolean-variables':r'$x_i,y\in\{0,1\}$'},58:{
    'case-working-line1':r'$R_{\mathrm{I}}=R_5\cdot[1-(1-R_1)(1-R_2)]$',
    'case-working-line2':r'$\qquad\cdot[1-(1-R_3)(1-R_4)]$',
    'case-failed-line1':r'$R_{\mathrm{II}}=(1-R_5)$',
    'case-failed-line2':r'$\qquad\cdot\{1-[1-R_1R_3][1-R_2R_4]\}$',
},63:{
    'series-product':r'$R_S(t)=\prod_{i=1}^{n}R_i(t)$',
    'parallel-product':r'$R_S(t)=1-\prod_{i=1}^{n}[1-R_i(t)]$',
    'parallel-failure':r'$F_S(t)=\prod_{i=1}^{n}F_i(t)$',
    'mixed-product':r'$R_S=R_1[1-(1-R_2)(1-R_3)]$',
    'series-example':r'$R_S=0{,}9^3=0{,}729$',
    'parallel-example':r'$R_S=1-0{,}1^3=0{,}999$',
},65:{'identical-series':r'$R_S(t)=[R_B(t)]^n$'}}
parser=argparse.ArgumentParser()
parser.add_argument('--slide',type=int,choices=FORMULAS,required=True)
args=parser.parse_args()
for name,formula in FORMULAS[args.slide].items():
    output=ROOT/f'rebuild-proposals/svg/RE4/slide_{args.slide:03}/formulas/{name}.svg'
    render_formula_svg(formula,output,fontsize=32,color='#142452',fontset='stix')
    normalize_asset(output,'formula-asset')
    print(output.name)
