"""Verify the design-only RE2 contract against the frozen approved baseline."""
import argparse
import hashlib
import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REVIEW = ROOT / 'analysis/render-checks/RE2/design-harmonization-2026-09-17'
NS = '{http://www.w3.org/2000/svg}'

def local(e): return e.tag.split('}')[-1]
def signature(root, tag):
    parents = {c: p for p in root.iter() for c in p}
    items = []
    for e in root.iter(NS + tag):
        chain = []
        p = e
        while p in parents:
            if p.get('id'): chain.append(p.get('id'))
            p = parents[p]
        if tag == 'text': value = ''.join(e.itertext())
        elif tag == 'image': value = dict(e.attrib)
        else: value = None
        items.append((value, chain))
    return items

def verify(entry):
    work = entry['work_unit']
    base = REVIEW / 'baseline' / work
    dest = ROOT / 'rebuild-proposals/svg/RE2' / work
    old = ET.parse(base / (work + '.svg')).getroot()
    new = ET.parse(dest / (work + '.svg')).getroot()
    errors = []
    for tag in ['text', 'image']:
        if signature(old, tag) != signature(new, tag): errors.append(tag + ' content, order, asset or group ancestry changed')
    old_ids = [e.get('id') for e in old.iter() if e.get('id')]
    new_ids = [e.get('id') for e in new.iter() if e.get('id')]
    if old_ids != new_ids: errors.append('Stable SVG IDs or their ordering changed')
    # Original technical geometry remains byte-for-byte; new paths only restyle
    # existing surfaces or add decorative accents. Original paths stay present.
    for tag, attrs in [('path', ['d']), ('line', ['x1','y1','x2','y2']), ('polyline',['points']), ('polygon',['points']), ('circle',['cx','cy','r']), ('ellipse',['cx','cy','rx','ry'])]:
        remaining = [tuple(e.get(a) for a in attrs) for e in new.iter(NS + tag)]
        for e in old.iter(NS + tag):
            value = tuple(e.get(a) for a in attrs)
            if value in remaining: remaining.remove(value)
            else: errors.append('Original ' + tag + ' geometry missing or changed'); break
    for filename, digest in entry['files'].items():
        if filename.endswith('.svg'): continue
        if hashlib.sha256((dest / filename).read_bytes()).hexdigest() != digest:
            errors.append(filename + ' changed')
    old_groups = [(e.get('id'), e.get('transform'), e.get('data-anim-target')) for e in old.iter(NS+'g')]
    new_groups = [(e.get('id'), e.get('transform'), e.get('data-anim-target')) for e in new.iter(NS+'g')]
    if old_groups != new_groups: errors.append('Group topology, transforms or animation targets changed')
    return {'output': entry['output'], 'work_unit': work, 'text_nodes': len(signature(old,'text')), 'images': len(signature(old,'image')), 'errors': errors}

if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    parser = argparse.ArgumentParser(); parser.add_argument('--slide', type=int); args=parser.parse_args()
    entries=json.loads((REVIEW/'baseline.json').read_text(encoding='utf-8'))
    if args.slide is not None: entries=[e for e in entries if e['work_unit']==f'slide_{args.slide:03}']
    results=[verify(e) for e in entries]
    target=REVIEW/('preservation.json' if args.slide is None else f'preservation-{args.slide:03}.json')
    target.write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    errors=[f"{e['work_unit']}: {error}" for e in results for error in e['errors']]
    print(json.dumps({'scenes':len(results),'text_nodes':sum(e['text_nodes'] for e in results),'images':sum(e['images'] for e in results),'errors':errors},ensure_ascii=False))
    sys.exit(bool(errors))
