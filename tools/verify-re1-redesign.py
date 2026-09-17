"""Verify preservation of approved RE1 content through layout changes."""
import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as E

ROOT=Path(__file__).resolve().parents[1]
REVIEW=ROOT/'analysis/render-checks/RE1/redesign-2026-09-17'
def local(e):return e.tag.split('}')[-1]
def digest(f):return hashlib.sha256(f.read_bytes()).hexdigest()
def signature(root):
    texts=Counter(re.sub(r'\s+','',''.join(e.itertext())) for e in root.iter() if local(e)=='text')
    images=Counter(e.get('href',e.get('{http://www.w3.org/1999/xlink}href','')) for e in root.iter() if local(e)=='image')
    targets={e.get('id') for e in root.iter() if e.get('data-anim-target')=='true'}
    # Mathematically meaningful inline plots retain every path and text node.
    plots={e.get('id'):Counter((local(c),c.get('d',''),c.get('points','')) for c in e.iter() if local(c) in ['path','polygon','polyline']) for e in root.iter() if local(e)=='svg' and e is not root}
    return texts,images,targets,plots
def verify(n):
    name=f'slide_{n:03}';before=REVIEW/'baseline'/name;after=ROOT/'rebuild-proposals/svg/RE1'/name
    a=signature(E.parse(before/(name+'.svg')).getroot());b=signature(E.parse(after/(name+'.svg')).getroot());errors=[]
    for i,label in enumerate(['texts','image assets','animation target IDs','plot/formula geometry']):
        if a[i]!=b[i]:errors.append(label+' differs')
    for f in before.glob('*.json'):
        if digest(f)!=digest(after/f.name):errors.append(f.name+' changed')
    return {'scene':n,'texts':sum(a[0].values()),'images':sum(a[1].values()),'targets':len(a[2]),'errors':errors}
if __name__=='__main__':
    sys.stdout.reconfigure(encoding='utf-8');p=argparse.ArgumentParser();p.add_argument('--slide',type=int);args=p.parse_args()
    rows=[verify(n) for n in ([args.slide] if args.slide else range(1,78))]
    result={'scenes':len(rows),'texts':sum(r['texts'] for r in rows),'images':sum(r['images'] for r in rows),'errors':[r for r in rows if r['errors']],'results':rows}
    (REVIEW/(f'preservation-{args.slide:03}.json' if args.slide else 'preservation.json')).write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:v for k,v in result.items() if k!='results'},ensure_ascii=False));sys.exit(bool(result['errors']))
