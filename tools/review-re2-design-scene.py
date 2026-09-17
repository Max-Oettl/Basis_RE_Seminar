"""Produce and technically review one design-only scene before visual approval."""
import argparse
import json
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
REVIEW = ROOT / 'analysis/render-checks/RE2/design-harmonization-2026-09-17'

def run(args, known_baseline_bounds=False):
    result = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, encoding='utf-8', errors='replace')
    if result.returncode:
        if known_baseline_bounds:
            report=json.loads((REVIEW/'qa-071/svg-qa-report.json').read_text(encoding='utf-8'))
            errors=[i for i in report['issues'] if i['severity']=='error']
            expected={'circle min: -173.523,722.292','circle max: -29.522999999999996,866.292'}
            source=ET.parse(REVIEW/'baseline/slide_071/slide_071.svg')
            target=ET.parse(ROOT/'rebuild-proposals/svg/RE2/slide_071/slide_071.svg')
            circles=lambda doc:[e.attrib for e in doc.iter() if e.tag.endswith('}circle')]
            if len(errors)==2 and all(e['rule']=='viewbox-bounds' for e in errors) and {e['detail'] for e in errors}==expected and circles(source)==circles(target) and report['layout']['summary']['errors']==0:
                (REVIEW/'qa-071/accepted-baseline-finding.json').write_text(json.dumps({'reason':'The static bounds rule ignores the existing circle transform. Geometry and transform are identical to the approved baseline. Browser layout checks pass and the circle is inside the rendered slide.','issues':errors},indent=2)+'\n',encoding='utf-8')
                return result.stdout.strip()+'\nAccepted: two unchanged raw-coordinate findings; rendered bounds pass.'
        print(result.stdout); print(result.stderr); raise SystemExit(result.returncode)
    return result.stdout.strip()

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    parser=argparse.ArgumentParser(); parser.add_argument('--slide', type=int, required=True); args=parser.parse_args()
    n=args.slide; name=f'slide_{n:03}'
    print(run([sys.executable,'tools/harmonize-re2-design.py','--slide',str(n)]), flush=True)
    print(run([sys.executable,'tools/verify-re2-design-preservation.py','--slide',str(n)]), flush=True)
    run(['node','tools/render-svg-previews.js','--module','RE2','--slides',str(n),'--output-dir',str(REVIEW/'after')])
    run(['node','tools/render-svg-animation-states.js','--module','RE2','--slides',str(n),'--output-dir',str(REVIEW/'states'),'--sample-highlights','true'])
    print(run(['node','tools/svg-rebuild-qa.js',str(ROOT/'rebuild-proposals/svg/RE2'/name),'--strict-design','--layout','--layout-strict','--report-dir',str(REVIEW/f'qa-{n:03}')], known_baseline_bounds=n==71), flush=True)
    frames=sorted((REVIEW/'states'/name).glob('*.png'))
    columns=min(3,max(1,len(frames))); rows=(len(frames)+columns-1)//columns
    sheet=Image.new('RGB',(640*columns,390*rows),'#eef0f5'); draw=ImageDraw.Draw(sheet)
    for i,p in enumerate(frames):
        frame=Image.open(p).convert('RGB');frame.thumbnail((640,360))
        x=(i%columns)*640;y=(i//columns)*390
        sheet.paste(frame,(x,y+25));draw.text((x+12,y+7),p.stem[:75],fill='#142452')
    sheet.save(REVIEW/'after'/f'{name}-states.png')
    print(f'{name}: ready for visual review ({len(frames)} states)',flush=True)

if __name__=='__main__': main()
