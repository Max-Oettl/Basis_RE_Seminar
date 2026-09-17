"""Design-only migration of approved RE2 scenes, one canonical work unit per run.

Always starts from the frozen, user-approved baseline. No source text, content,
assets, data geometry, scene identity or animation manifest is regenerated.
"""
import argparse
import copy
import json
import re
import sys
from pathlib import Path
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')
ROOT=Path(__file__).resolve().parents[1]
REVIEW=ROOT/'analysis/render-checks/RE2/design-harmonization-2026-09-17'
NS='http://www.w3.org/2000/svg'
ET.register_namespace('',NS)
ET.register_namespace('xlink','http://www.w3.org/1999/xlink')
TOKENS=json.loads((ROOT/'brand/reltest-education-slide-design-tokens.json').read_text(encoding='utf-8'))
NAVY=TOKENS['colors']['navy']
GREEN=TOKENS['colors']['educationGreen']
COLORS={'#031334':NAVY,'#0D173D':NAVY,'#00A754':GREEN,'#9AA1AE':'#727C97','#687185':'#727C97'}

def local(e): return e.tag.split('}')[-1]
def number(e,key,default=0):
    try:return float(e.get(key,str(default)).replace('px',''))
    except ValueError:return default
def text(e):return ''.join(e.itertext())
def fmt(v):return f'{v:g}'
def bevel(x,y,w,h):
    r=min(8,h/5);b=min(20,h/3)
    return f'M{fmt(x+r)} {fmt(y)}H{fmt(x+w)}V{fmt(y+h-b)}L{fmt(x+w-b)} {fmt(y+h)}H{fmt(x)}V{fmt(y+r)}Q{fmt(x)} {fmt(y)} {fmt(x+r)} {fmt(y)}Z'
def set_font(e,display=False):
    style=e.get('style','')
    style=re.sub(r'font-family\s*:[^;]+;?','',style)
    e.set('style',style+(';' if style and not style.endswith(';') else '')+'font-family:'+('Oxanium, Archivo, Arial, sans-serif' if display else 'Archivo, Arial, Helvetica, sans-serif'))

def migrate(n):
    name=f'slide_{n:03}'
    baseline=REVIEW/'baseline'/name/(name+'.svg')
    if not baseline.exists():raise ValueError(f'{name} is not a canonical baseline')
    source=baseline.read_text(encoding='utf-8')
    root=ET.fromstring(source)
    root.set('data-embedding-target','powerpoint-slide')
    edits=[]
    parents={child:parent for parent in root.iter() for child in parent}
    texts=[e for e in root.iter() if local(e)=='text']
    rects=[e for e in root.iter() if local(e)=='rect']
    # Token update only; identifiers and path coordinates remain unchanged.
    for e in root.iter():
        if n==75 and ((local(e)=='path' and e.get('d')=='M 402 500 H 798 L 953 680 H 247 Z') or (local(e)=='rect' and number(e,'x')==1170 and 500<number(e,'y')<650)):
            e.set('fill','#435075')
            if e.get('stroke'):e.set('stroke','#435075')
            edits.append({'kind':'preserve-team-level-contrast'})
        for attr in ['fill','stroke','color','stop-color']:
            v=e.get(attr,'').upper()
            if v in COLORS:e.set(attr,COLORS[v]);edits.append({'kind':'color','from':v,'to':COLORS[v]})
        if local(e)=='text':
            size=number(e,'font-size');weight=number(e,'font-weight',500)
            prose=text(e).strip()
            if n==88 and prose=='SYSTEMEBENE 3':
                e.set('y','654')
                edits.append({'kind':'level-label-clearance','text':prose})
            display=size>=26 and weight>=700 and len(prose)<86 and not list(e)
            # Equations, indices and technical operators retain their existing font.
            if re.search(r'[=\u220f\u222b\u03bb\u03b2\u03bc\u03c3]|R[\u209b\u1d62]|[<>]?[\u2265\u2264]',prose):display=False
            if display:
                set_font(e,True);e.set('font-weight','650');edits.append({'kind':'display-font','text':prose})
            elif size<=24 and list(e) and len(prose)>60 and weight>=600:
                e.set('font-weight','500');edits.append({'kind':'prose-weight','text':prose})
            elif weight>=550:
                e.set('font-weight','600' if weight>=750 else '500')
                edits.append({'kind':'body-weight','text':prose})
            if n in [60,61] and prose=='NOTSTROMAGGREGAT':
                # Preserve font size and all connector coordinates; give the
                # long component name 12 px of extra side padding.
                for box in parents[e]:
                    if local(box)!='rect':continue
                    bx,by,bw,bh=[number(box,k) for k in ['x','y','width','height']]
                    if bx<number(e,'x')<bx+bw and by<number(e,'y')<by+bh and 180<bw<220:
                        box.set('x',fmt(bx-12));box.set('width',fmt(bw+24))
                        edits.append({'kind':'inset-label-padding','text':prose})
    # Existing dark component/section blocks retain position and topology;
    # compact technical nodes stay rectangular, wider section labels get the CI corner.
    for e in rects:
        x,y,w,h=[number(e,k) for k in ['x','y','width','height']]
        if n==95 and y>=680 and 45<=h<=50:
            e.set('height',fmt(h+14));h+=14
            edits.append({'kind':'function-label-padding','bounds':[x,y,w,h]})
        fill=e.get('fill','').upper()
        technical_node = n==16 and y>=400
        is_goal = n==71 and parents[e].get('id')=='s71_goal'
        if fill==NAVY and w>=260 and 40<=h<=155 and not (y>=820 and w>=900) and not technical_node and not is_goal:
            attrs=dict(e.attrib)
            for a in ['x','y','width','height','rx','ry']:attrs.pop(a,None)
            attrs['d']=bevel(x,y,w,h)
            attrs['data-design-role']='existing-section-surface'
            replacement=ET.Element('{'+NS+'}path',attrs)
            p=parents[e];p.insert(list(p).index(e),replacement);p.remove(e)
            edits.append({'kind':'ci-corner','bounds':[x,y,w,h]})
        elif e.get('rx') and e.get('stroke-dasharray') is None and h>35:
            e.set('rx','8')
    # Existing comparison panels keep their semantic grouping, with one shared
    # section treatment instead of equally strong outer and internal borders.
    for panel in rects:
        x,y,w,h=[number(panel,k) for k in ['x','y','width','height']]
        normal_panel=panel.get('fill','').upper()=='#FFFFFF' and panel.get('stroke')==NAVY
        comparison_panel=n in [109,119] and panel.get('fill','').upper()=='#E8E9EE'
        if not (370<=w<=950 and 240<=h<=700 and (normal_panel or comparison_panel)):continue
        p=parents[panel]
        headings=[t for t in texts if parents[t] is p and not list(t) and t.get('text-anchor')=='middle' and abs(number(t,'x')-(x+w/2))<12 and 24<=number(t,'font-size')<=36 and 30<=number(t,'y')-y<=(72 if n==119 else 60) and len(text(t))<42]
        if len(headings)!=1:continue
        heading=headings[0]
        surface=ET.Element('{'+NS+'}path',{'d':bevel(x,y,w,56),'fill':NAVY,'data-design-role':'panel-heading','data-qc-allow-overlap':'true'})
        p.insert(list(p).index(heading),surface)
        heading.set('fill','#FFFFFF');heading.set('y',fmt(y+38));heading.set('font-weight','650');set_font(heading,True)
        panel.set('stroke','#D0D3DC');panel.set('stroke-width','1')
        if comparison_panel:panel.set('fill','#FFFFFF')
        edits.append({'kind':'panel-heading','text':text(heading),'bounds':[x,y,w,56]})
    # Presentation headings with an adjacent horizontal rule become calm CI strips.
    # Exclude navigation, captions, hierarchy/diagram labels and small table columns.
    for e in texts:
        s=text(e).strip();x,y,size=number(e,'x'),number(e,'y'),number(e,'font-size')
        if len(list(e)) or not (22<=size<=42 and 200<=y<=750 and 3<len(s)<58):continue
        if e.get('fill') not in [NAVY,'#142452','#435075','#727C97','#0C84B4']:continue
        p=parents[e]
        candidates=[]
        for rule in list(p):
            if local(rule) not in ['line','path']:continue
            if local(rule)=='line':a,b,c,d=[number(rule,k) for k in ['x1','y1','x2','y2']]
            else:
                m=re.fullmatch(r'M\s*([\d.]+)[ ,]+([\d.]+)\s*L\s*([\d.]+)[ ,]+([\d.]+)',rule.get('d',''))
                if not m:continue
                a,b,c,d=map(float,m.groups())
            if abs(b-d)>.1 or c-a<370 or not 14<=abs(b-y)<=62:continue
            anchor=e.get('text-anchor','start')
            if (anchor=='start' and abs(x-a)<16) or (anchor=='middle' and abs(x-(a+c)/2)<20):
                candidates.append((rule,a,b,c))
        if len(candidates)!=1:continue
        rule,a,b,c=candidates[0];w=c-a
        # Keep long headings within their original available width.
        new_size=min(32,max(size,27),int((w-44)/(len(s)*.68)))
        if new_size<26:continue
        y0=b if b<y and y-b>=40 else y-new_size-14
        if n in [143,147,153]:y0+=18
        h=64
        bg=ET.Element('{'+NS+'}path',{'d':bevel(a,y0,w,h),'fill':NAVY,'data-design-role':'section-label','data-qc-allow-overlap':'true','data-qa-reason':'Heading text intentionally overlays its section surface'})
        p.insert(list(p).index(e),bg)
        e.set('x',fmt(a+22));e.set('y',fmt(y0+43));e.set('text-anchor','start');e.set('font-size',fmt(new_size));e.set('fill','#FFFFFF');set_font(e,True)
        rule.set('opacity','0');rule.set('data-design-role','replaced-heading-rule')
        edits.append({'kind':'section-strip','text':s,'bounds':[a,y0,w,h]})
    # Restyle bottom callouts without dropping a single word or moving its group.
    for old in rects:
        if old not in list(parents.get(old,[])):continue
        x,y,w,h=[number(old,k) for k in ['x','y','width','height']]
        is_goal = (n==71 and parents[old].get('id')=='s71_goal') or (n==97 and parents[old].get('id')=='s99_rule')
        if not ((y>=820 or is_goal) and w>=900 and 35<=h<=155):continue
        fill=old.get('fill','').upper()
        if fill not in [NAVY,'#E8E9EE','#F6F7F9','#F5F7FA','#FFFFFF']:continue
        p=parents[old];old.set('fill','none');old.set('stroke','none')
        bar=ET.Element('{'+NS+'}path',{'d':f'M{x} {y+9}V{y+h-9}','fill':'none','stroke':GREEN,'stroke-width':'4','data-design-role':'callout-accent'})
        p.insert(list(p).index(old),bar)
        contained=[]
        for t in texts:
            tx,ty=number(t,'x'),number(t,'y')
            if x<=tx<=x+w and y<=ty<=y+h:
                contained.append(t)
                if t.get('fill','').upper() in ['#FFFFFF','#E8E9EE','#D0D3DC','#F6F7F9','#F5F7FA']:
                    t.set('fill',NAVY)
        if len(contained)==1 and contained[0].get('text-anchor')=='middle':
            t=contained[0];t.set('text-anchor','start');t.set('x',fmt(x+28))
            for span in t:
                if span.get('x') is not None:span.set('x',fmt(x+28))
        if n==19 and len(contained)==2:
            contained[1].set('x','390')
        edits.append({'kind':'open-callout','bounds':[x,y,w,h]})
    metadata=root.find('{'+NS+'}metadata')
    meta=json.loads(metadata.text)
    meta['designRevision']='RE2 design harmonization 2026-09-17'
    meta['referenceLock']=['RE4::39','RE4::61','RE4::62']
    meta['contentPreservation']='approved RE2 baseline; text, assets, topology and animation preserved'
    metadata.text=json.dumps(meta,ensure_ascii=False,separators=(',',':'))
    out=ET.tostring(root,encoding='unicode')
    out=re.sub(r'(<metadata\b[^>]*>)[\s\S]*?(</metadata>)',lambda m:m[1]+'<![CDATA['+metadata.text+']]>'+m[2],out,count=1)
    destination=ROOT/'rebuild-proposals/svg/RE2'/name/(name+'.svg')
    destination.write_text('<?xml version="1.0" encoding="UTF-8"?>\n'+out+'\n',encoding='utf-8')
    log=REVIEW/'changes';log.mkdir(exist_ok=True)
    (log/(name+'.json')).write_text(json.dumps(edits,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'{name}: {len(edits)} style edits; '+', '.join(e['text'] for e in edits if e['kind']=='section-strip'))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--slide',type=int,required=True);args=p.parse_args();migrate(args.slide)
