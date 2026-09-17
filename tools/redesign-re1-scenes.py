"""Scene-specific RE1 redesign from the frozen approved content baseline.

Only the selected scene is written. Curves, formula assets, narration and
animation manifests are reused; slide layout is intentionally reworked.
"""
import argparse
import copy
import json
import re
import shutil
import textwrap
import xml.etree.ElementTree as E
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REVIEW = ROOT / 'analysis/render-checks/RE1/redesign-2026-09-17'
NS = 'http://www.w3.org/2000/svg'
E.register_namespace('', NS)
E.register_namespace('xlink', 'http://www.w3.org/1999/xlink')
TOKENS = json.loads((ROOT/'brand/reltest-education-slide-design-tokens.json').read_text(encoding='utf-8'))
NAVY = TOKENS['colors']['navy']
GREEN = TOKENS['colors']['educationGreen']
MUTED = '#435075'
BORDER = '#D0D3DC'

def tag(e): return e.tag.split('}')[-1]
def num(e, k, default=0):
    try: return float(e.get(k, str(default)).replace('px', ''))
    except ValueError: return default
def fmt(v): return f'{v:g}'
def attrs(e, **kw):
    for k,v in kw.items(): e.set(k.replace('_','-'),fmt(v) if isinstance(v,(float,int)) else str(v))
    return e
def node(kind, **kw): return attrs(E.Element('{'+NS+'}'+kind), **kw)
def by_id(root, ident): return next(e for e in root.iter() if e.get('id')==ident)
def prose(e):
    # Existing line tspans have no inter-line whitespace in the XML.
    if len(e) and all(tag(c)=='tspan' and c.get('x') is not None for c in e):
        return ' '.join(''.join(c.itertext()).strip() for c in e)
    return ''.join(e.itertext()).strip()
def family(e, display=False):
    style=re.sub(r'font-family\s*:[^;]+;?', '',e.get('style',''))
    e.set('style',style+';font-family:'+('Oxanium, Archivo, Arial, sans-serif' if display else 'Archivo, Arial, Helvetica, sans-serif'))
def position_text(e,x,y,size=None):
    attrs(e,x=x,y=y)
    if size:attrs(e,font_size=size)
    for c in e:
        if c.get('x') is not None: attrs(c,x=x)
    return e
def reflow(e,x,y,width,size=28,weight=450,fill=NAVY):
    value=prose(e);e.text=None
    for c in list(e):e.remove(c)
    lines=textwrap.wrap(value,max(12,int(width/(size*.51))),break_long_words=False,break_on_hyphens=False)
    attrs(e,x=x,y=y,font_size=size,font_weight=weight,fill=fill,text_anchor='start')
    family(e)
    for i,line in enumerate(lines):
        t=node('tspan',x=x,dy=0 if i==0 else round(size*1.32));t.text=line;e.append(t)
    return e
def bevel(x,y,w,h):
    b=min(20,h/3)
    return f'M{x+8:g} {y:g}H{x+w:g}V{y+h-b:g}L{x+w-b:g} {y+h:g}H{x:g}V{y+8:g}Q{x:g} {y:g} {x+8:g} {y:g}Z'
def surface(parent,x,y,w,h,fill=NAVY):
    e=node('path',d=bevel(x,y,w,h),fill=fill,data_design_role='section-surface',data_qc_allow_overlap='true');parent.insert(1 if len(parent) and tag(parent[0])=='title' else 0,e);return e
def rule(parent,x,y,w,color=BORDER):
    e=node('line',x1=x,y1=y,x2=x+w,y2=y,stroke=color,stroke_width=1.5);parent.insert(1,e);return e
def accent(parent,x,y,h):
    e=node('line',x1=x,y1=y,x2=x,y2=y+h,stroke=GREEN,stroke_width=4);parent.insert(1,e);return e
def native_elements(root):
    def walk(e):
        yield e
        for c in e:
            if tag(c) in ['defs','svg']:continue
            yield from walk(c)
    return list(walk(root))
def open_rect(e):attrs(e,fill='none',stroke='none')
def translate(e,dx=0,dy=0,scale=1):
    old=e.get('transform','');e.set('transform',f'translate({fmt(dx)} {fmt(dy)}) scale({fmt(scale)}) '+old)
def plot_box(e,x,y,w,h):attrs(e,x=x,y=y,width=w,height=h)

def base(root,n):
    for e in list(root):
        if e.get('id')=='brand_background':root.remove(e)
        if tag(e)=='defs':
            for c in list(e):
                if c.get('id') in ['backgroundGradient','technicalGrid']:e.remove(c)
    attrs(root,data_artifact_scope='content-svg',data_embedding_target='powerpoint-slide')
    elements=native_elements(root)
    neutral_concept=n<10 or 15<=n<=26 or n in [40,45,48,71,72,73]
    for e in elements:
        for key in ['fill','stroke','color']:
            value=e.get(key,'').upper()
            if value in ['#031334','#0D173D']:e.set(key,NAVY)
            elif value=='#00A754':e.set(key,GREEN)
            elif value=='#9AA1AE':e.set(key,'#727C97')
        if tag(e) in ['text','tspan']:
            size=num(e,'font-size');weight=num(e,'font-weight',500)
            if 0<size<18:attrs(e,font_size=18)
            if weight>650:attrs(e,font_weight=600)
            elif weight>=500:attrs(e,font_weight=450)
            if tag(e)=='text' and size>=30 and weight>=700:
                family(e,True);attrs(e,font_weight=600)
            if neutral_concept and e.get('fill') in [GREEN,'#E9B400','#EC6244']:
                e.set('fill',NAVY)
        if tag(e)=='rect' and e.get('rx'):e.set('rx','8')
    for e in elements:
        if tag(e)!='rect':continue
        x,y,w,h=[num(e,k) for k in ['x','y','width','height']]
        if w>200 and h>50 and e.get('fill') in ['#E6F6EE','#FFF5CC','#FCE7E2']:
            attrs(e,fill='#F3F4F7',stroke=BORDER)
        if e.get('fill')==NAVY and w>300 and 45<=h<=130:
            e.tag='{'+NS+'}path'
            for k in ['x','y','width','height','rx','ry']:e.attrib.pop(k,None)
            attrs(e,d=bevel(x,y,w,h))
    # Bottom notes are open, restrained statements rather than repeated cards.
    parents={c:p for p in root.iter() for c in p}
    for e in elements:
        if tag(e)!='rect':continue
        x,y,w,h=[num(e,k) for k in ['x','y','width','height']]
        if y>=820 and w>=900 and 40<=h<=155:
            open_rect(e);accent(parents[e],x,y+10,h-20)
    meta=root.find('{'+NS+'}metadata');m=json.loads(meta.text)
    if m.get('density')=='balanced':m['density']='normal'
    if n in [10,11,12,14,17,20,24,25,37,38,39,46,47,51,54,56,58,62,68,69,73,75,76,77]:m['density']='dense'
    m.update(artifactScope='content-svg',embeddingTarget='powerpoint-slide',contentMode='transparent-content',backgroundMode='transparent',brandProfile='reltest-education',designRevision='RE1 layout redesign 2026-09-17',referenceLock=['RE4::39','RE4::61','RE4::62'])
    meta.text=json.dumps(m,ensure_ascii=False,separators=(',',':'))

def palette_xml(value):
    for old,new in {'#031334':NAVY,'#0D173D':NAVY,'#25495F':NAVY,'#00A754':GREEN,'#CDD0D6':BORDER,'#687185':'#727C97','#E6E7EB':'#E8E9EE','#F3F4F7':'#F7F9FC'}.items():
        value=re.sub(re.escape(old),new,value,flags=re.I)
    return value

def refine_plot_labels(root,n):
    if n==62:
        # Retain formula geometry, highlight the introduced -t0 terms as spoken.
        uses=[e for e in root.iter() if tag(e)=='use']
        for i,e in enumerate(uses):
            href=e.get('{http://www.w3.org/1999/xlink}href',e.get('href',''))
            if href.endswith('STIXGeneral-Regular-13') and i and uses[i-1].get('{http://www.w3.org/1999/xlink}href','').endswith('STIXGeneral-Italic-57'):
                for c in uses[max(0,i-2):i+1]:attrs(c,fill='#EC6244',style='fill:#EC6244')
    if n in [57,58]:
        parents={c:p for p in root.iter() for c in p}
        for e in root.iter():
            v=re.sub(r'\s','',prose(e))
            if tag(e)=='text' and len(e)>5 and v.startswith(('b<1','b=1','b>1')):
                for bg in parents[parents[e]]:
                    if 'patch_' in bg.get('id',''):
                        for shape in bg.iter():
                            if tag(shape)=='path':attrs(shape,style='fill:none;stroke:none')
                for c in e:
                    if c.get('x'):attrs(c,x=num(c,'x')*18/14)
                attrs(e,paint_order='stroke',stroke='#FFFFFF',stroke_width=4,stroke_linejoin='round')
                attrs(parents[e],transform='translate('+('526 319' if v.startswith('b<') else '488 274' if v.startswith('b=') else '454 96')+')')
    if n in [56,57,58,59]:
        parents={c:p for p in root.iter() for c in p}
        for e in root.iter():
            if tag(e)=='text' and re.sub(r'\s','',prose(e))=='T=1':
                attrs(e,paint_order='stroke',stroke='#FFFFFF',stroke_width=4,stroke_linejoin='round')
    if n==51:
        parents={c:p for p in root.iter() for c in p}
        for e in root.iter():
            if tag(e)=='text' and len(e)>10 and prose(e).lstrip().startswith('F'):
                attrs(parents[e],transform='translate(90 96)')
                attrs(e,paint_order='stroke',stroke='#FFFFFF',stroke_width=4,stroke_linejoin='round')
                for c in e:
                    if c.get('x'):attrs(c,x=num(c,'x')*1.2)
            if tag(e)=='text' and prose(e)=='negative Ausfallzeiten':attrs(e,paint_order='stroke',stroke='#FFFFFF',stroke_width=3)
    if n in [50,51]:
        plots=[root] if root.get('viewBox')!='0 0 1920 1080' else [e for e in root.iter() if tag(e)=='svg' and e.get('data-plot-asset')]
        for plot in plots:
            for e in plot.iter():
                for key,value in list(e.attrib.items()):
                    if key in ['fill','stroke','style']:
                        # The narration explicitly calls sigma=2 the yellow curve.
                        value=re.sub('#e9b400','__SWAP__',value,flags=re.I)
                        value=re.sub('#0c84b4','#E9B400',value,flags=re.I).replace('__SWAP__','#0C84B4');e.set(key,value)
    if n==49:
        parents={c:p for p in root.iter() for c in p}
        for e in root.iter():
            if tag(e)=='text' and len(e)>10 and re.sub(r'\s','',prose(e)).startswith('Ausfallwahrscheinlichkeit'):translate(parents[e],0,8)
    if n==46:
        for e in root.iter():
            if tag(e)=='text' and prose(e).startswith('MTTF ='):attrs(e,paint_order='stroke',stroke='#FFFFFF',stroke_width=4,stroke_linejoin='round')
    if 41<=n<=44:
        for e in root.iter():
            if tag(e)=='text' and not len(e) and re.search(r't_(?:Median|modal|m)',e.text or ''):
                if n==44 and e.text=='t_m':translate(e,9,-4)
                chunks=re.split(r'(t_(?:Median|modal|m))',e.text);e.text=chunks[0]
                for i in range(1,len(chunks),2):
                    main=node('tspan');main.text='t';e.append(main)
                    source_marker=node('tspan',display='none',data_qc_allow_hidden='true',data_qa_reason='Source underscore is rendered as mathematical subscript.');source_marker.text='_';e.append(source_marker)
                    sub=node('tspan',baseline_shift='sub',style='font-size:70%');sub.text=chunks[i][2:];sub.tail=chunks[i+1];e.append(sub)
    if n==36:
        parents={c:p for p in root.iter() for c in p}
        for e in root.iter():
            if tag(e)=='text' and len(e)>3:
                value=re.sub(r'\s','',prose(e))
                if value.startswith('bisausgefallen') or value.startswith('nachintakt'):
                    attrs(parents[e],transform='translate(258 318)' if value.startswith('bis') else 'translate(475 315)')
                    for c in e:
                        if c.get('x'):attrs(c,x=num(c,'x')*18/14)
                        if c.text=='x':c.set('style',re.sub(r'font-size:[^;]+','font-size:12.6px',c.get('style','')));attrs(c,y=4)
    if n in [31,35]:
        for e in root.iter():
            if tag(e)=='text' and prose(e).startswith('Frauen'):attrs(e,paint_order='stroke',stroke='#FFFFFF',stroke_width=5,stroke_linejoin='round')
            if n==35 and tag(e)=='text' and prose(e) in ['36 %','62 %']:translate(e,75)
    if n==41:
        for e in root.iter():
            if tag(e)=='text' and prose(e).startswith('verschobener Mittelwert'):translate(e,0,-9)
            if tag(e)=='text' and prose(e).startswith('Mittelwert = Schwerpunkt'):
                attrs(e,x=num(e,'x')+24,transform='')
                e.set('style',e.get('style','').replace('text-anchor: middle','text-anchor: start'))
    if n==34:
        for e in root.iter():
            if tag(e)=='text' and prose(e).startswith('10 % →'):attrs(e,paint_order='stroke',stroke='#FFFFFF',stroke_width=5,stroke_linejoin='round')
    if n==32:
        for e in root.iter():
            if tag(e)=='text' and re.fullmatch(r'\d+ \+ \d+',prose(e)):translate(e,0,-7)
    if n==29:
        parents={c:p for p in root.iter() for c in p}
        for plot in root.iter():
            if tag(plot)=='svg' and (plot is root and root.get('data-artifact-scope')!='content-svg' or plot.get('data-plot-asset')):attrs(plot,viewBox='-85 0 700 465' if plot is root else '-85 65 700 400')
        for e in root.iter():
            if tag(e)=='path' and e.get('d','').startswith('M 462.624572'):attrs(e,transform='rotate(-31.25 334.374369 298.65058)')
            if tag(e)!='text':continue
            value=''.join(e.itertext()).strip()
            if value=='Wöhlerlinie':attrs(e,x=495,y=303,transform='')
            if value=='5.000':attrs(e,y=418,transform='')
            if value=='log (Ausfalldichte)':attrs(e,x=-57,y=167,transform='rotate(-90 -57 167)')
            if list(e) and 'Spannung' in re.sub(r'\s','',value):attrs(parents[e],transform='translate(-60 411) rotate(-68)')
    if n==28:
        parents={c:p for p in root.iter() for c in p}
        for g in list(root.iter()):
            if g.get('id','').split('__')[-1]=='density_interpretation':
                p=parents[g];p.remove(g);p.append(g)
        for g in root.iter():
            if g.get('id','').split('__')[-1] in ['histogram_label','density_curve_label']:
                for e in g.iter():
                    if tag(e)=='path':attrs(e,style='fill:none;stroke:none')
        for e in root.iter():
            if tag(e)=='text' and (prose(e).startswith('Beginn') or prose(e).startswith('vollständig ausgefallen')):
                # A small opaque text halo keeps the annotation legible where
                # it spans the descending density curve and translucent bins.
                attrs(e,paint_order='stroke',stroke='#FFFFFF',stroke_width=5,stroke_linejoin='round')
    if n>=27:
        plots=[root] if root.get('viewBox')!='0 0 1920 1080' else [e for e in root.iter() if tag(e)=='svg' and e.get('data-plot-asset')]
        for plot in plots:
            for e in plot.iter():
                if tag(e) in ['path','line','polygon','polyline','rect','circle','use']:attrs(e,data_role='functional')
                if tag(e) in ['text','tspan']:
                    attrs(e,data_qc_role='text',data_qc_layer='text',data_qc_allow_overlap='true')
                    style=e.get('style','')
                    style=re.sub(r"font-family:\s*['\"]Archivo['\"]",'font-family: Archivo, Arial, Helvetica, sans-serif',style)
                    e.set('style',style)
                    if tag(e)=='text':
                        attrs(e,font_family='Archivo, Arial, Helvetica, sans-serif',data_qc_role='text',data_qc_layer='text',data_qc_allow_overlap='true')
                        if num(e,'font-size')<18:attrs(e,font_size=18)
                        e.set('style',re.sub(r'font-size:\s*(\d+(?:\.\d+)?)px',lambda m:'font-size: '+str(max(18,float(m[1])))+'px',e.get('style','')))
            attrs(plot,data_qc_group='plot_asset',data_qc_layer='data')
            if plot is root and root.get('data-artifact-scope')!='content-svg' and not any(e.get('id')=='slide_quality_metadata' for e in root):
                source=E.parse(REVIEW/'baseline'/f'slide_{n:03}'/f'slide_{n:03}.svg').getroot()
                m=json.loads(source.find('{'+NS+'}metadata').text)
                m.update(artifactScope='content-svg',embeddingTarget='powerpoint-slide',slideType='technical-plot-asset',layoutIntent='module-local-python-plot',density='dense',contentMode='full-content-area',backgroundMode='transparent',brandProfile='reltest-education',brandVariant='education-plot-asset')
                meta=node('metadata',id='slide_quality_metadata',type='application/json');meta.text=json.dumps(m,ensure_ascii=False);root.insert(0,meta)
    if n in [10,11,12]:
        plots=[root] if root.get('data-artifact-scope')!='content-svg' else [e for e in root.iter() if tag(e)=='svg' and e.get('data-plot-asset')]
        for plot in plots:
            for e in plot.iter():
                for k,v in list(e.attrib.items()):
                    if k in ['fill','stroke','style']:
                        v=re.sub(r'#00a(?:754|653)', '#0C84B4',v,flags=re.I)
                        if '#cceddd' in v.lower():
                            v=re.sub('#cceddd','#0C84B4',v,flags=re.I)
                            attrs(e,fill_opacity=.18)
                        e.set(k,v)
    if n==11:
        for e in root.iter():
            if tag(e)=='text' and 'font-family' in e.get('style',''):
                family(e)
                attrs(e,font_family='Archivo, Arial, Helvetica, sans-serif',data_qc_role='text',data_qc_layer='text')
        if root.get('data-artifact-scope')!='content-svg':
            attrs(root,data_qc_group='plot_asset',data_qc_layer='data')
            if not any(e.get('id')=='slide_quality_metadata' for e in root):
                meta=node('metadata',id='slide_quality_metadata',type='application/json')
                meta.text=json.dumps(dict(artifactScope='content-svg',embeddingTarget='powerpoint-slide',slideType='technical-plot-asset',contentTitle='Belastbarkeit erhöhen',layoutIntent='module-local-python-plot',takeaway='Eine höhere Belastbarkeit verkleinert den Ausfallbereich.',density='dense',contentMode='full-content-area',backgroundMode='transparent',brandProfile='reltest-education'))
                data=json.loads(meta.text);data['brandVariant']='education-plot-asset';meta.text=json.dumps(data,ensure_ascii=False)
                root.insert(0,meta)
    if n in [64,66,67,77]:
        for e in root.iter():
            if tag(e)=='text' and not len(e) and re.fullmatch(r'\d+(?:[,.]\d+)?',e.text or '') and 'text-anchor: end' in e.get('style',''):
                attrs(e,font_size=12,data_qa_small_text='allowed',data_qa_reason='Secondary probability-scale ticks retain their dense logarithmic spacing; scene embedding renders them at approximately 19 px or larger.')
                e.set('style',re.sub(r'font-size:\s*[\d.]+px','font-size:12px',e.get('style','')))
    if n!=2:return
    parents={c:p for p in root.iter() for c in p}
    for e in root.iter():
        if tag(e)=='svg' and (e is root or e.get('data-plot-asset')) and e.get('viewBox','').startswith('0 0 938.'):
            vals=e.get('viewBox').split();vals[2]='963';e.set('viewBox',' '.join(vals))
        if tag(e)=='text' and prose(e)=='Betroffene Fahrzeuge [Mio.]' and num(e,'x')>900:
            translate(parents[e],18)
        if e.get('id','').split('__')[-1] in ['line2d_22','text_19']:
            translate(e,18)

def case_study(root,n):
    content=by_id(root,'scene_content');context,impact=list(content)
    for e in context.iter():
        if tag(e)=='image':attrs(e,x=112,y=180,width=650,height=536)
        if tag(e)=='rect':
            if num(e,'x')==930:attrs(e,x=112,y=180,width=650,height=536)
            if e in list(context):open_rect(e)
    texts=[e for e in context if tag(e)=='text']
    specs=[(866,222,22,600),(866,300,36,600),(866,417,21,600),(866,461,28,450),(866,598,21,600),(866,642,28,450)]
    for e,(x,y,size,weight) in zip(texts[:6],specs):reflow(e,x,y,914,size,weight)
    surface(context,842,180,966,64);texts[0].set('fill','#FFFFFF')
    for c in texts[0]:c.set('fill','#FFFFFF')
    family(texts[0],True);family(texts[1],True)
    rule(context,866,375,900);rule(context,866,556,900)
    reflow(texts[-1],112,751,690,18,400,MUTED)
    values=[e for e in impact if tag(e)=='text']
    for e in impact:
        if tag(e)=='rect':open_rect(e)
    for i in range(3):
        x=112+i*592;reflow(values[2*i],x+24,843,520,44,600);family(values[2*i],True)
        reflow(values[2*i+1],x+24,889,520,26,450,MUTED)
        accent(impact,x,808,120)
    if len(values)>6:
        reflow(values[6],130,685,610,20,550,'#FFFFFF')
        surface(impact,112,649,650,67)

def three_consequences(root,n):
    content=by_id(root,'scene_content')
    for g in list(content)[1:]:
        panel=next(e for e in g if tag(e)=='rect');x=num(panel,'x');open_rect(panel)
        texts=[e for e in g if tag(e)=='text'];heading=texts[0]
        surface(g,x,392,535,66)
        position_text(heading,x+26,435,22);attrs(heading,fill='#FFFFFF',font_weight=600);family(heading,True)
        for c in heading:c.set('fill','#FFFFFF')
        for e in g:
            if tag(e)=='circle':attrs(e,fill=GREEN,cy=num(e,'cy')+26)
            if tag(e)=='path' and e.get('stroke'):e.set('stroke-width','2')
        # Preserve subheads and full legal distinctions, with open lower areas.
        for t in texts[1:]:
            position_text(t,num(t,'x'),num(t,'y')+26)
            if num(t,'font-size')>=30:family(t,True)
        accent(g,x,516,315)

def central_influences(root,n):
    g=by_id(root,'reliability_core')
    for e in list(g):
        if tag(e)=='ellipse':g.remove(e)
    surface(g,660,489,600,132)
    t=next(e for e in g if tag(e)=='text');attrs(t,fill='#FFFFFF',font_size=42)
    for c in t:c.set('fill','#FFFFFF')
    layouts={
        'development_pressure':([(350,283),(755,283)],['M350 344L740 484','M755 344L880 484']),
        'complexity_pressure':([(1165,283),(1570,283)],['M1165 344L1040 484','M1570 344L1180 484']),
        'counteracting_demands':([(1530,817),(960,817),(390,817)],['M1530 752L1170 628','M960 752V628','M390 752L750 628'])}
    for group_id in ['development_pressure','complexity_pressure','counteracting_demands']:
        group=by_id(root,group_id)
        text_positions,paths=layouts[group_id];ti=pi=0
        for e in list(group):
            if tag(e)=='line':group.remove(e)
            if tag(e)=='path':e.set('stroke',GREEN);e.set('stroke-width','2.5')
            if tag(e)=='path':e.set('d',paths[pi]);pi+=1
            if tag(e)=='text':
                position_text(e,*text_positions[ti],31);attrs(e,font_weight=600);ti+=1
    # Seven influences retain their directed relationship to the central concept.
    for marker in root.iter():
        if tag(marker)=='marker':attrs(marker,markerWidth=7,markerHeight=7)

def method_comparison(root,n):
    for gid in ['qualitative_toolbox','quantitative_toolbox']:
        g=by_id(root,gid);rects=[e for e in g if tag(e)=='rect'];panel,header=rects[:2]
        x=num(panel,'x');open_rect(panel);open_rect(header);surface(g,x,196,810,74)
        texts=[e for e in g if tag(e)=='text']
        position_text(texts[0],x+28,246,34);attrs(texts[0],fill='#FFFFFF');family(texts[0],True)
        for c in texts[0]:c.set('fill','#FFFFFF')
        for t in texts[1:]:
            y=num(t,'y');position_text(t,num(t,'x'),y-20)
            if num(t,'font-size')==23:attrs(t,font_size=28)
        for e in g:
            if tag(e)=='circle':attrs(e,cy=num(e,'cy')-20,fill=GREEN)
            if tag(e)=='line':attrs(e,y1=num(e,'y1')-20,y2=num(e,'y2')-20)
        accent(g,x,326,475)

def definition(root,n):
    g=by_id(root,'reliability_definition')
    for e in g.iter():
        if tag(e)=='circle':attrs(e,fill='#F3F4F7')
    for e in list(g):
        if tag(e)=='line':g.remove(e)
    # One sentence, no fake process arrows: regular baseline and open spacing.
    for e in g:
        if tag(e)=='circle':attrs(e,fill='#F3F4F7')
        if tag(e)=='text':
            attrs(e,font_size=40,font_weight=450)
            for c in e:
                if c.get('fill') in ['#E9B400',GREEN]:attrs(c,fill=NAVY,font_weight=600)
    accent(g,140,244,612)

def method_bathtub(root,n):
    plot=by_id(root,'bathtub_curve_plot')
    for e in plot.iter():
        if tag(e)=='rect':attrs(e,fill='#E8E9EE',stroke='none',opacity=.34)
        if tag(e)=='circle':attrs(e,stroke=BORDER,fill='#FFFFFF')
        if tag(e)=='text':attrs(e,fill=NAVY,font_weight=500)
        if tag(e)=='path' and e.get('marker-end'):attrs(e,stroke_width=2.5)
    for e in root.iter():
        if tag(e)=='marker':attrs(e,markerWidth=7,markerHeight=7)
    for gid,x,w in [('qualitative_method_focus',164,1136),('quantitative_method_focus',1324,480)]:
        g=by_id(root,gid)
        for e in g:
            if tag(e)=='rect':open_rect(e)
        surface(g,x,194,w,88)
        texts=[e for e in g if tag(e)=='text'];attrs(texts[0],fill='#FFFFFF',font_weight=600);family(texts[0],True)
        for c in texts[0]:c.set('fill','#FFFFFF')
        t=texts[1];reflow(t,x+24,807,w-48,30 if w>500 else 26,500)
        accent(g,x,766,96)

def design_and_assurance(root,n):
    for gid,x in [('design_contribution',130),('assurance_contribution',1030)]:
        g=by_id(root,gid)
        for e in g:
            if tag(e)=='rect':open_rect(e)
        surface(g,x,370,760,116)
        texts=[e for e in g if tag(e)=='text'];attrs(texts[0],fill='#FFFFFF',font_size=32);family(texts[0],True)
        for c in texts[0]:c.set('fill','#FFFFFF')
        for e in g.iter():
            if tag(e)=='circle':attrs(e,fill='#FFFFFF')
        if gid=='design_contribution':
            t=texts[1];attrs(t,font_size=30,font_weight=450)
            for i,c in enumerate(t):c.set('dy','0' if i==0 else '64')
            position_text(t,162,591)
            for e in list(g):
                if tag(e)=='line':g.remove(e)
            accent(g,130,548,215)
        else:
            for e in list(g):
                if tag(e)=='path' and e.get('stroke'):g.remove(e)
            for t in texts[1:]:
                attrs(t,font_size=24 if num(t,'font-size')<=21 else num(t,'font-size'),font_weight=450)
            rule(g,1070,534,680)
            for x2 in [1070,1424]:accent(g,x2,555,190)
    links=by_id(root,'reliability_collaboration_links')
    for e in links:
        if tag(e)=='path':attrs(e,d='M960 300V332H500V370M960 332H1410V370',stroke_width=2.5)
    links.append(node('path',d='M910 427H1010M918 419L910 427L918 435M1002 419L1010 427L1002 435',fill='none',stroke=NAVY,stroke_width=2.5))

def lifecycle_overview(root,n):
    content=by_id(root,'scene_content')
    labels=[e for e in content if tag(e)=='text']
    for e in list(content):
        if tag(e) in ['rect','path']:content.remove(e)
    position_text(labels[0],112,220,21);attrs(labels[0],fill=NAVY,font_weight=600)
    for i,t in enumerate(labels[1:]):
        y=300+i*99;position_text(t,150,y,25);attrs(t,text_anchor='start',fill=NAVY,font_weight=500)
        content.insert(0,node('circle',cx=120,cy=y-9,r=5,fill=GREEN))
        if i<6:content.insert(0,node('line',x1=120,y1=y+6,x2=120,y2=y+74,stroke=BORDER,stroke_width=2))
    groups=[e for e in content if e.get('id','').startswith('phase_')]
    for i,g in enumerate(groups):
        y=268+i*130;texts=[e for e in g if tag(e)=='text']
        for e in list(g):
            if tag(e) in ['rect','circle','line','g']:g.remove(e)
        # Preserve the active life-cycle ranges formerly encoded by seven
        # miniature pills; draw them directly beside the corresponding stages.
        links=['M330 291H420V301H460','M340 390H390V489H340M390 431H460','M340 489H370V588H340M370 561H460','M330 687H430V691H460','M340 786H390V885H340M390 821H460']
        g.insert(1,node('path',d=links[i],fill='none',stroke='#727C97',stroke_width=2))
        surface(g,460,y,68,66)
        position_text(texts[0],494,y+44,30);attrs(texts[0],fill='#FFFFFF',font_weight=600)
        reflow(texts[1],560,y+29,420,27,600);family(texts[1],True)
        for t,x,w in [(texts[2],1010,354),(texts[3],1430,370)]:
            position_text(t,x,y+29,24);attrs(t,font_weight=450)
            # Existing lines distinguish separate tools; keep that grouping.
            if len(t):
                for j,c in enumerate(t):attrs(c,x=x,dy=0 if j==0 else 33)
            else:reflow(t,x,y+29,w,24,450)
            if i==4:reflow(t,x,y+29,w,24,450)
        rule(g,560,y+112,1240)

def phase_heading(root):
    matches=[e for e in root.iter() if e.get('id')=='management_phase_marker']
    if not matches:return
    g=matches[0]
    for e in g:
        if tag(e)=='rect':open_rect(e)
    surface(g,92,174,190,64)
    ts=[e for e in g if tag(e)=='text'];attrs(ts[0],fill='#FFFFFF');attrs(ts[1],font_size=25,font_weight=600,fill=NAVY);family(ts[1],True)

def calm_connectors(root):
    for e in native_elements(root):
        if tag(e)=='path' and e.get('marker-end'):attrs(e,stroke_width=2.5)
        if tag(e)=='circle' and e.get('data-pictogram-backdrop'):attrs(e,fill='#F7F9FC')
    for e in root.iter():
        if tag(e)=='marker':attrs(e,markerWidth=7,markerHeight=7)

def reliability_planning(root,n):
    phase_heading(root);calm_connectors(root)
    g=by_id(root,'planning_drivers');ts=[e for e in g if tag(e)=='text']
    attrs(ts[0],font_size=23)
    for i,t in enumerate(ts[1:5]):position_text(t,126+(i%2)*520,382+(i//2)*64,26);attrs(t,text_anchor='start')
    for e in g:
        if tag(e)=='rect' and num(e,'height')<60:open_rect(e)
        elif tag(e)=='path' and e.get('marker-end'):attrs(e,d='M598 486V535')
        elif tag(e)=='path' and e.get('fill')==NAVY:translate(e,200)
        elif tag(e)=='g':translate(e,200)
    position_text(ts[-1],490,588,30)
    g=by_id(root,'reliability_goal_cascade')
    for e in g:
        if tag(e)=='rect':attrs(e,fill='#F7F9FC',stroke=BORDER)
        if tag(e)=='text' and num(e,'font-size')==18:attrs(e,font_size=23)
    g=by_id(root,'representative_load_collective')
    for e in g:
        if tag(e)=='rect':open_rect(e)
    surface(g,1270,310,540,142)
    ts=[e for e in g if tag(e)=='text'];attrs(ts[0],fill='#FFFFFF',font_size=30)
    for c in ts[0]:c.set('fill','#FFFFFF')
    accent(g,1270,504,240)

def weakness_process(root,n):
    phase_heading(root);calm_connectors(root)
    groups=[by_id(root,i) for i in ['system_context','critical_system_analysis','design_improvement']]
    step=0
    for g in groups:
        ts=[e for e in g if tag(e)=='text']
        for e in list(g):
            if tag(e) in ['rect','circle']:g.remove(e)
            if tag(e)=='path' and e.get('marker-end'):
                # Connector ends at the next step; same reveal as its endpoint.
                d=e.get('d').replace('570','421')
                for old,new in [('450','166'),('880','596'),('1310','1026')]:d=d.replace(old,new)
                e.set('d',d)
        for j in range(0,len(ts),3):
            x=90+step*430;number,title,body=ts[j:j+3]
            surface(g,x,380,76,76);position_text(number,x+28,430,30);attrs(number,fill='#FFFFFF',text_anchor='start')
            position_text(title,x+20,523,32);attrs(title,font_weight=600)
            position_text(body,x+20,654,25);attrs(body,font_weight=450)
            if step==3:position_text(body,x+20,625,25)
            accent(g,x,490,335);step+=1

def methods_four(root,n):
    phase_heading(root);calm_connectors(root)
    ids=['p_diagram_method','block_diagram_method','fault_tree_method','fmea_method']
    for i,gid in enumerate(ids):
        g=by_id(root,gid);x=110+(i%2)*900;y=294+(i//2)*330
        for e in list(g):
            if tag(e) in ['rect','line','circle']:g.remove(e)
        surface(g,x,y,800,62)
        ts=[e for e in g if tag(e)=='text'];position_text(ts[0],x+28,y+41,25);attrs(ts[0],fill='#FFFFFF',text_anchor='start')
        reflow(ts[1],x+75,y+41,660,28,600,'#FFFFFF');family(ts[1],True)
        diagram=next(e for e in g if tag(e)=='g')
        diagram.set('transform',f'translate({x+95} {y+80}) scale(1.18)')
        for e in diagram.iter():
            if i==3 and tag(e)=='rect' and num(e,'width')==340:attrs(e,width=355)
            if i==3 and tag(e)=='path':e.set('d',e.get('d','').replace('H360','H375'))
            if i==3 and tag(e)=='text' and num(e,'x')==319:position_text(e,326.5,num(e,'y'))
            if tag(e) in ['rect','path','line']:translate(e,0,0);e.set('transform','scale(1.35 1)')
            if tag(e)=='rect' and e.get('fill')!=NAVY:attrs(e,fill='#F7F9FC',stroke=BORDER)
            if tag(e)=='text':
                if i==3 and num(e,'x')==292:position_text(e,284,num(e,'y'))
                attrs(e,font_size=18,font_weight=450);position_text(e,num(e,'x')*1.35,num(e,'y'))
                for j,c in enumerate(e):
                    if j:c.set('dy','21')
        if i>=2:rule(g,x,y+306,800)

def testing_branches(root,n):
    phase_heading(root);calm_connectors(root)
    for gid,x in [('weakness_testing',110),('reliability_proof_testing',1050)]:
        g=by_id(root,gid)
        for e in g:
            if tag(e)=='rect':open_rect(e)
            if tag(e)=='path' and e.get('marker-end'):attrs(e,stroke=NAVY)
        ts=[e for e in g if tag(e)=='text'];attrs(ts[0],font_size=21)
        # Text and icon establish the branch; tools are a single readable row.
        for t in ts:
            if num(t,'y')==673:attrs(t,font_size=27,font_weight=600)
            if num(t,'y')==760:attrs(t,font_size=26,font_weight=450)
        rule(g,x+40,706,680);accent(g,x,548,266)

def testing_goals(root,n):
    phase_heading(root);calm_connectors(root)
    content=by_id(root,'scene_content')
    for e in content:
        if tag(e)=='rect':open_rect(e)
        if tag(e)=='text' and num(e,'font-size')==18:attrs(e,font_size=26,text_anchor='start',x=150)
    surface(content,100,300,510,106)
    ts=[e for e in content if tag(e)=='text'];attrs(ts[0],fill='#FFFFFF',font_size=29,y=364)
    for e in content:
        if tag(e)=='g' and any(tag(c)=='image' for c in e):translate(e,0,-16)
    for i,gid in enumerate(['test_goal_improvement','test_goal_measurement','test_goal_comparison']):
        g=by_id(root,gid)
        for e in g:
            if tag(e)=='rect':open_rect(e)
            if tag(e)=='text' and num(e,'font-size')<30:attrs(e,font_size=27)
        accent(g,700,325+i*200,112);rule(g,740,466+i*200,1050)

def production_methods(root,n):
    phase_heading(root);calm_connectors(root)
    for i,gid in enumerate(['production_risk_prevention','production_process_optimization','production_screening_monitoring']):
        g=by_id(root,gid);x=110+i*600
        for e in g:
            if tag(e)=='rect':open_rect(e)
        surface(g,x,360,500,155)
        ts=[e for e in g if tag(e)=='text']
        for t in ts[:2]:attrs(t,fill='#FFFFFF')
        for t in ts[2:]:attrs(t,font_size=26,font_weight=450)
        for e in g.iter():
            if tag(e)=='circle':attrs(e,fill='#FFFFFF')
        accent(g,x,570,125)
    content=by_id(root,'scene_content')
    for e in content:
        if tag(e)=='rect':open_rect(e)
        if tag(e)=='text':attrs(e,font_size=28)
    rule(by_id(root,'production_screening_monitoring'),350,807,1220)

def systematic_testing(root,n):
    calm_connectors(root)
    g=by_id(root,'functional_testing')
    for e in g:
        if tag(e)=='rect':open_rect(e)
        if tag(e)=='text':attrs(e,fill='#FFFFFF')
    surface(g,180,210,1560,120)
    for gid,x in [('qualitative_product_assurance',120),('quantitative_product_assurance',1260)]:
        g=by_id(root,gid)
        for e in list(g):
            if tag(e)=='rect' and num(e,'width')>400:open_rect(e)
            if tag(e)=='line':
                e.tag='{'+NS+'}path'
                for k in ['x1','x2','y1','y2','stroke-dasharray']:e.attrib.pop(k,None)
                attrs(e,d='M960 330V395H400V455',fill='none',stroke=GREEN,stroke_width=2.5)
            if tag(e)=='rect' and num(e,'width')<400:attrs(e,fill='#F7F9FC',stroke=BORDER)
        surface(g,x,455,560,160)
        ts=[e for e in g if tag(e)=='text'];attrs(ts[0],fill='#FFFFFF',font_size=28)
        for c in ts[0]:c.set('fill','#FFFFFF')
        position_text(ts[1],x+30,684,25)
        for c in ts[1]:
            if c.get('dy')!='0':c.set('dy','36')
        accent(g,x,648,142)

def production_sample(root,n):
    phase_heading(root);calm_connectors(root)
    content=by_id(root,'scene_content')
    for e in content:
        if tag(e)=='rect':open_rect(e)
    labels=[e for e in content if tag(e)=='text'];attrs(labels[0],font_size=22)
    for t in labels[1:]:
        if num(t,'font-size')<25:attrs(t,font_size=25)
    surface(content,100,349,850,88)
    attrs(labels[1],fill='#FFFFFF');position_text(labels[2],150,491,25)
    position_text(labels[3],150,661,30);position_text(labels[4],150,709,25)
    accent(content,100,614,150)
    g=by_id(root,'series_production_preparation')
    for e in g:
        if tag(e)=='rect':open_rect(e)
    ts=[e for e in g if tag(e)=='text'];attrs(ts[0],font_size=22)
    surface(g,1050,340,760,128)
    for t in ts[1:3]:attrs(t,fill='#FFFFFF')
    for t in ts[3:5]:attrs(t,font_size=25)
    attrs(ts[-1],font_size=24)
    g=by_id(root,'representative_series_sample')
    for e in g:
        if tag(e)=='rect':open_rect(e)
    ts=[e for e in g if tag(e)=='text'];attrs(ts[0],font_size=32)
    # The sample enters the quantitative test stage below the explanation.
    t=ts[-1];reflow(t,727,848,300,24,500)
    for e in g:
        if tag(e)=='path':attrs(e,d='M1050 720H990V812H560V756',stroke_width=2.5)
    accent(g,1050,655,130)

def field_feedback(root,n):
    phase_heading(root);calm_connectors(root)
    for gid,x,y,w,h in [('field_observation',100,340,470,154),('field_reliability_assessment',690,300,590,154),('next_generation_learning_loop',1360,340,460,154)]:
        g=by_id(root,gid)
        for e in g:
            if tag(e)=='rect':open_rect(e)
            if tag(e)=='path' and e.get('stroke')=='#E9B400':attrs(e,stroke=GREEN,marker_end='url(#arrow_00A754)')
        surface(g,x,y,w,h)
        ts=[e for e in g if tag(e)=='text'];attrs(ts[0],fill='#FFFFFF',font_size=30)
        for c in ts[0]:c.set('fill','#FFFFFF')
        if gid=='field_reliability_assessment':attrs(ts[1],fill='#FFFFFF')
        for t in ts[1:]:
            if t.get('fill')!='#FFFFFF':attrs(t,font_size=max(num(t,'font-size'),25),font_weight=450)
        accent(g,x,y+h+36,185)
        if gid=='field_reliability_assessment':
            translate(g,0,40)
            for e in g:
                if tag(e)=='path' and e.get('marker-end'):attrs(e,d='M570 490H690')
        if gid=='next_generation_learning_loop':
            for t in ts[1:3]:position_text(t,num(t,'x'),num(t,'y')+20)
            t=ts[-1];position_text(t,790,866,25);attrs(t,text_anchor='middle')
            g.insert(1,node('rect',x=360,y=818,width=860,height=76,rx=8,fill='#F7F9FC',stroke=BORDER,stroke_width=1.5,data_qc_allow_overlap='true'))
            for e in g:
                if tag(e)=='path' and '1590' in e.get('d',''):attrs(e,d='M1590 720V856H1220')

def function_navigation(root):
    matches=[e for e in root.iter() if e.get('id')=='reliability_function_rail']
    if not matches:return
    for g in matches[0]:
        rect=next(e for e in g if tag(e)=='rect');x=num(rect,'x');active=rect.get('fill')!='#FFFFFF'
        open_rect(rect)
        for e in g:
            if tag(e)=='circle':attrs(e,fill='none')
            if tag(e)=='text':attrs(e,fill=NAVY,font_weight=500)
        rule(g,x,230,400,GREEN if active else BORDER)
        if active:
            line=next(e for e in g if tag(e)=='line');attrs(line,stroke_width=4)
            for e in g:
                if tag(e)=='text':attrs(e,font_weight=600)

def woehler_introduction(root,n):
    function_navigation(root)
    for e in native_elements(root):
        if tag(e)=='circle' and e.get('fill') in ['#FCE7E2','#E6F6EE']:attrs(e,fill='#F7F9FC')
    plot_box(by_id(root,'woehler_plot'),584,268,1236,670)
    g=by_id(root,'statistical_description_task')
    for e in g:
        if tag(e)=='rect':open_rect(e)
    surface(g,98,272,446,100)
    ts=[e for e in g if tag(e)=='text'];attrs(ts[0],fill='#FFFFFF')
    for c in ts[0]:c.set('fill','#FFFFFF')
    reflow(ts[1],124,431,400,31,500)
    reflow(ts[2],124,641,400,23,450,NAVY)
    g=by_id(root,'selected_640_context')
    for e in g:
        if tag(e)=='rect':open_rect(e)
        elif tag(e)=='g':translate(e,0,77)
    ts=[e for e in g if tag(e)=='text'];position_text(ts[0],210,764,22);attrs(ts[0],fill='#EC6244')
    reflow(ts[1],124,855,400,25,450)
    accent(g,98,737,153)

def chart_focus(root,n):
    function_navigation(root)
    positions={28:('histogram_density_plot',140,290,1640,618),29:('woehler_3d_plot',280,268,1360,680),31:('human_density_plot',300,276,1320,658),32:('empirical_cdf_plot',110,300,1700,560)}
    ident,x,y,w,h=positions[n];plot_box(by_id(root,ident),x,y,w,h)
    if n==32:
        g=by_id(root,'empirical_cdf_definition')
        for e in g:
            if tag(e)=='rect':open_rect(e)
            if tag(e)=='text':attrs(e,font_size=27)
        accent(g,100,874,62)
        g=by_id(root,'cumulative_transition')
        for e in g:
            if tag(e)=='text':attrs(e,font_size=23)

def plain_group(root,ident):
    g=by_id(root,ident)
    for e in g:
        if tag(e)=='rect':open_rect(e)
    return g,[e for e in g if tag(e)=='text']

def line_text(e,x,y,size,line_height=None):
    position_text(e,x,y,size);family(e)
    for i,c in enumerate(e):
        if tag(c)=='tspan':attrs(c,dy=0 if i==0 else (line_height or size*1.35))

def gearbox_density(root,n):
    function_navigation(root)
    plot_box(by_id(root,'nkw_density_plot'),80,284,1190,646)
    plain_group(root,'nkw_gearbox_image')
    g,ts=plain_group(root,'nkw_density_question')
    surface(g,1310,524,512,54);position_text(ts[0],1334,559,21);attrs(ts[0],fill='#FFFFFF')
    reflow(ts[1],1334,611,456,24)
    g,ts=plain_group(root,'nkw_density_diagnosis')
    position_text(ts[0],1334,684,21);line_text(ts[1],1334,726,24,31)
    rule(g,1310,650,512)
    g,ts=plain_group(root,'nkw_density_desired_state')
    position_text(ts[0],1334,862,21);reflow(ts[1],1334,901,450,24)
    accent(g,1310,841,95)

def cdf_formulas(root,n):
    function_navigation(root);calm_connectors(root)
    plot_box(by_id(root,'smooth_cdf_plot'),84,303,1118,606)
    for ident,fy,head,asset,w,h in [('cdf_integral_formula',266,90,'cdf_integral_asset',332,89),('cdf_derivative_formula',513,64,'cdf_derivative_asset',228,79)]:
        g,ts=plain_group(root,ident);surface(g,1235,fy,585,head)
        reflow(ts[0],1261,fy+34,450,21,600,'#FFFFFF')
        plot_box(by_id(root,asset),1280,fy+head+27,w,h)
    g,ts=plain_group(root,'cdf_statistical_meaning')
    position_text(ts[0],1362,757,21);position_text(ts[1],1362,809,25)
    reflow(ts[2],1362,850,430,24)
    rule(g,1235,721,585)

def gearbox_cdf(root,n):
    function_navigation(root);calm_connectors(root)
    plot_box(by_id(root,'nkw_cdf_plot'),90,322,1200,615)
    g,ts=plain_group(root,'nkw_cdf_gearbox_image')
    plot_box(by_id(root,'nkw_cdf_gearbox_image_asset'),1360,292,445,250)
    for ident,x,y in [('ten_percent_context',1310,599),('time_one_context',1310,786)]:
        g,ts=plain_group(root,ident)
        oldx=num(ts[0],'x');oldy=num(ts[0],'y');dx=x+102-oldx;dy=y+42-oldy
        for e in g:
            if tag(e)=='g':translate(e,dx,dy)
            elif tag(e)=='line':g.remove(e)
        position_text(ts[0],x+102,y+42,21)
        position_text(ts[1],x+22,y+103,29)
        attrs(ts[1],text_anchor='start');rule(g,x,y,512)

def human_cdf(root,n):
    function_navigation(root)
    plot_box(by_id(root,'human_cdf_plot'),100,285,1200,650)
    g,ts=plain_group(root,'human_cdf_comparison')
    for e in list(g):
        if tag(e)=='line':g.remove(e)
    surface(g,1370,333,420,65)
    position_text(ts[0],1396,376,24);attrs(ts[0],fill='#FFFFFF',text_anchor='start')
    for t,x,y,size in [(ts[1],1400,486,32),(ts[3],1400,599,32),(ts[2],1400,730,27)]:
        reflow(t,x,y,360,size,550)
    accent(g,1370,679,105)

def reliability_partition(root,n):
    function_navigation(root);calm_connectors(root)
    plot_box(by_id(root,'reliability_partition_plot'),88,302,1200,602)
    g,ts=plain_group(root,'reliability_relation')
    for e in g:
        if tag(e)=='path' and e.get('fill')==NAVY:attrs(e,d=bevel(1320,270,500,120))
        if tag(e)=='g':translate(e,1220,30)
    plot_box(by_id(root,'reliability_complement_asset'),1450,311,294,55)
    reflow(ts[0],1346,444,442,25,550)
    reflow(ts[1],1346,566,442,25,450)
    for ident,asset,y in [('failure_area_formula','failure_area_integral_asset',681),('reliability_area_formula','reliability_area_integral_asset',817)]:
        g,ts=plain_group(root,ident)
        for e in list(g):
            if tag(e)=='line':g.remove(e)
        position_text(ts[0],1350,y,21)
        a=by_id(root,asset);ratio=num(a,'height')/num(a,'width');plot_box(a,1370,y+22,330,330*ratio)
        rule(g,1320,y-31,500)

def bathtub_explanation(root,n):
    function_navigation(root);calm_connectors(root)
    plot_box(by_id(root,'bathtub_curve_standard_plot'),98,269,1165,344)
    g,ts=plain_group(root,'hazard_definition')
    for e in g:
        if tag(e)=='path' and e.get('fill')==NAVY:attrs(e,d=bevel(1320,266,502,120))
    plot_box(by_id(root,'hazard_ratio_asset'),1355,290,190,75.5)
    position_text(ts[0],1580,339,24)
    reflow(ts[1],1346,422,436,25)
    g,ts=plain_group(root,'hazard_risk_meaning')
    for e in g:
        if tag(e)=='path' and e.get('fill')==NAVY:attrs(e,fill='none')
        if tag(e)=='g':translate(e,268,198)
    position_text(ts[0],1450,500,22);attrs(ts[0],fill=NAVY)
    reflow(ts[1],1346,555,432,24)
    for i,ident in enumerate(['early_failure_region','random_failure_region','wearout_failure_region']):
        x=98+i*581;g,ts=plain_group(root,ident)
        surface(g,x,640,558,72)
        reflow(ts[0],x+23,683,504,21,600,'#FFFFFF')
        reflow(ts[1],x+23,746,500,20,600,MUTED)
        reflow(ts[2],x+23,783,494,23)
        reflow(ts[3],x+23,842,500,20,600,MUTED)
        reflow(ts[4],x+23,878,494,22)
        if i in [0,2]:
            original=E.parse(REVIEW/'baseline'/f'slide_{n:03}'/f'slide_{n:03}.svg').getroot()
            ots=[e for e in by_id(original,ident) if tag(e)=='text']
            for j,y in [(2,783),(4,878)]:
                ts[j].text=ots[j].text
                for c in list(ts[j]):ts[j].remove(c)
                for c in ots[j]:ts[j].append(copy.deepcopy(c))
                line_text(ts[j],x+23,y,23 if j==2 else 22,30)
        if len(ts)>5:reflow(ts[5],x+23,942,494,20,500)

def human_hazard(root,n):
    function_navigation(root)
    plot_box(by_id(root,'human_hazard_plot'),98,281,1195,647)
    for ident,y in [('human_hazard_early_phase',300),('human_hazard_constant_phase',510),('human_hazard_ageing_phase',722)]:
        g,ts=plain_group(root,ident);surface(g,1320,y,500,80)
        reflow(ts[0],1344,y+34,360,22,550,'#FFFFFF')
        reflow(ts[1],1344,y+124,434,25)

def gearbox_hazard(root,n):
    function_navigation(root);calm_connectors(root)
    plot_box(by_id(root,'nkw_hazard_plot'),98,321,1190,550)
    g,ts=plain_group(root,'nkw_hazard_gearbox_image')
    plot_box(by_id(root,'nkw_hazard_gearbox_image_asset'),1355,278,440,246)
    g,ts=plain_group(root,'nkw_hazard_mechanism')
    for e in g:
        if tag(e)=='g':translate(e,-75,0)
    position_text(ts[0],1420,573,22);attrs(ts[0],fill=NAVY)
    reflow(ts[1],1346,641,448,25)
    g=by_id(root,'nkw_hazard_counterexample');ts=[e for e in g if tag(e)=='text']
    position_text(ts[0],1548,839,20);attrs(ts[0],fill=NAVY)
    position_text(ts[1],205,922,26)
    for e in list(g):
        if tag(e)=='line':g.remove(e)
        if tag(e)=='g' and any(tag(c)=='image' for c in e.iter()):translate(e,0,18)
        elif tag(e)=='g':translate(e,0,20)
    accent(g,98,884,58)

def location_overview(root,n):
    calm_connectors(root);g=by_id(root,'location_measures_overview')
    for e in list(g):
        if tag(e) in ['line','circle']:g.remove(e)
        elif tag(e)=='g':translate(e,0,-45)
    ts=[e for e in g if tag(e)=='text']
    for i,x in enumerate([140,700,1260]):
        surface(g,x,468,520,84)
        position_text(ts[i*2],x+260,522,32);attrs(ts[i*2],fill='#FFFFFF');family(ts[i*2],True)
        position_text(ts[i*2+1],x+260,628,27)
        rule(g,x+220,672,80,GREEN)

def location_detail(root,n):
    calm_connectors(root);content=by_id(root,'scene_content');ts=[e for e in content if tag(e)=='text']
    surface(content,98,220,446 if n!=41 else 710,66)
    position_text(ts[0],124,263,21);attrs(ts[0],fill='#FFFFFF')
    reflow(ts[1],124,357,400 if n!=41 else 650,31 if n!=41 else 35,500)
    if n==41:
        g,fts=plain_group(root,'mean_formula');surface(g,970,220,850,66)
        position_text(fts[0],998,263,21);attrs(fts[0],fill='#FFFFFF')
        plot_box(by_id(root,'mean_formula_asset'),1010,319,520,121)
        plot_box(by_id(root,'mean_balance_plot'),110,475,1700,465)
    else:
        plot_box(by_id(root,'median_split_plot' if n==42 else 'mode_peak_plot'),584,257,1236,661)
        ident='median_formula' if n==42 else 'mode_formula';g,fts=plain_group(root,ident)
        if n==42:
            plot_box(by_id(root,'median_formula_asset'),124,514,325,57)
            g,ts=plain_group(root,'median_robustness')
            position_text(ts[0],212,714,21);position_text(ts[1],212,759,30)
            reflow(ts[2],124,825,416,25)
            rule(g,98,657,446)
        else:
            position_text(fts[0],124,587,21);attrs(fts[0],fill=NAVY)
            plot_box(by_id(root,'mode_formula_asset'),124,630,286,69)
            accent(g,98,558,150)

def location_comparison(root,n):
    calm_connectors(root);plot_box(by_id(root,'right_skew_compare_plot'),98,259,1200,652)
    g,ts=plain_group(root,'skew_measure_conclusion');surface(g,1350,270,472,116)
    icons=[e for e in g if tag(e)=='g'];translate(icons[0],-57,-21);translate(icons[1],-75,100)
    reflow(ts[0],1460,312,290,21,600,'#FFFFFF')
    for i,y,size in [(1,448,32),(2,497,26),(3,609,23),(4,654,26)]:reflow(ts[i],1378,y,400,size,500)
    position_text(ts[5],1438,834,27);attrs(ts[5],fill=NAVY)
    for e in list(g):
        if tag(e)=='line':g.remove(e)
    accent(g,1350,785,90)

def metrics_overview(root,n):
    for j,ident in enumerate(['time_average_metrics','probability_requirement_metrics']):
        g=by_id(root,ident);ts=[e for e in g if tag(e)=='text']
        for e in list(g):
            if tag(e) in ['circle','line']:g.remove(e)
        for k in range(2):
            y=280+(j*2+k)*148;numt,term,english,meaning=ts[k*4:k*4+4]
            surface(g,205,y-48,340,92)
            position_text(numt,151,y+10,25);attrs(numt,fill=MUTED)
            reflow(term,233,y+12,300,31,600,'#FFFFFF')
            reflow(english,598,y+8,630,28,500)
            reflow(meaning,1330,y+8,448,25,450)
            rule(g,598,y+65,1180)

def mttf_detail(root,n):
    calm_connectors(root);content=by_id(root,'scene_content')
    for e in content:
        if tag(e)=='rect':open_rect(e)
        if tag(e)=='text':position_text(e,220,267,32)
    g,ts=plain_group(root,'mttf_formula');surface(g,98,332,870,76)
    reflow(ts[0],126,363,795,21,550,'#FFFFFF')
    plot_box(by_id(root,'mttf_formula_asset'),126,433,775,78)
    g,ts=plain_group(root,'mttf_half_probability');accent(g,1040,343,144)
    icon=next(e for e in g if tag(e)=='g');translate(icon,146,-10)
    position_text(ts[0],1170,374,22);attrs(ts[0],fill=NAVY)
    position_text(ts[1],1170,446,29)
    g=by_id(root,'mttf_failure_observations');t=next(e for e in g if tag(e)=='text')
    reflow(t,132,557,400,21,550)
    # The shared horizontal geometry of observations and density stays intact.
    plot_box(by_id(root,'mttf_plot'),98,620,1724,315)

def mtbf_detail(root,n):
    calm_connectors(root);content=by_id(root,'scene_content');ts=[e for e in content if tag(e)=='text']
    for e in content:
        if tag(e)=='rect':open_rect(e)
    for i,x in enumerate([98,990]):
        surface(content,x,211,832,65)
        reflow(ts[i],x+28,254,770,28,550,'#FFFFFF')
        position_text(ts[i+2],x+28,317,25)
    for ident,x,w in [('mean_metric_limitation',120,820),('defined_probability_transition',1110,690)]:
        g,ts=plain_group(root,ident)
        reflow(ts[0],x+118,781,w-150,21,600)
        reflow(ts[1],x+118,839,w-144,26)
        accent(g,x,759,155)

def ppm_scale(root,n):
    calm_connectors(root);g,ts=plain_group(root,'ppm_scale_comparison');surface(g,104,220,1712,72)
    for t,x in zip(ts[:3],[204,782,1292]):position_text(t,x,267,22);attrs(t,fill='#FFFFFF')
    for e in list(g):
        if tag(e)=='circle':g.remove(e)
        if tag(e)=='line':attrs(e,x1=132,x2=1788,stroke_width=1.5)
    for i in range(3):
        for t,x,size in zip(ts[3+i*3:6+i*3],[204,782,1292],[32,36,32]):position_text(t,x,373+i*132,size);attrs(t,fill=NAVY)
    g,ts=plain_group(root,'ppm_lifetime_reference');accent(g,104,754,148)
    reflow(ts[0],236,788,960,22,600);reflow(ts[1],236,843,945,28)
    g,ts=plain_group(root,'ppm_to_bq_transition');surface(g,1448,748,368,67)
    position_text(ts[0],1632,791,21);attrs(ts[0],fill='#FFFFFF')
    position_text(ts[1],1632,858,27);attrs(ts[1],fill=NAVY)

def bq_life(root,n):
    calm_connectors(root);plot_box(by_id(root,'bq_life_plot'),86,277,1260,652)
    g,ts=plain_group(root,'bq_q_definition');surface(g,1400,246,420,104)
    reflow(ts[0],1522,314,230,41,600,'#FFFFFF')
    reflow(ts[1],1428,396,348,26)
    reflow(ts[2],1428,490,336,22)
    g,ts=plain_group(root,'bq_requirement_conclusion');surface(g,1400,588,420,96)
    icon=next(e for e in g if tag(e)=='g');translate(icon,-4,62)
    reflow(ts[0],1522,626,205,21,600,'#FFFFFF')
    for t,y,s in zip(ts[1:],[744,788,835,932],[31,27,26,23]):reflow(t,1428,y,352,s,500)

def normal_density(root,n):
    calm_connectors(root);plot_box(by_id(root,'normal_density_plot'),620,230,1200,660)
    for ident,y in [('normal_mu_meaning',244),('normal_sigma_meaning',419)]:
        g=by_id(root,ident);ts=[e for e in g if tag(e)=='text'];surface(g,98,y,440,65)
        icon=next(e for e in g if tag(e)=='g');cy=num(next(e for e in icon if tag(e)=='circle'),'cy');translate(icon,8,y+32-cy)
        position_text(ts[0],212,y+43,23);attrs(ts[0],fill='#FFFFFF')
        for i,t in enumerate(ts[1:]):reflow(t,124,y+115+i*41,416,26)
    g,ts=plain_group(root,'normal_symmetry_properties');surface(g,98,634,440,59)
    reflow(ts[0],124,674,396,21,550,'#FFFFFF')
    position_text(ts[1],124,738,29);position_text(ts[2],124,778,24)
    reflow(ts[3],124,823,394,22)
    g=by_id(root,'normal_application_fields');ts=[e for e in g if tag(e)=='text'];ls=[e for e in g if tag(e)=='line']
    for t,l,x in zip(ts,ls,[724,1187,1556]):
        position_text(t,x,934,25);attrs(l,x1=x-30,x2=x-15,y1=925,y2=925,stroke=GREEN,stroke_width=3)

def normal_limitations(root,n):
    calm_connectors(root)
    prefix='normal' if n==51 else 'exponential';active=2 if n==51 else 1
    plot_box(by_id(root,prefix+'_hazard_plot'),88,234,850,520)
    plot_box(by_id(root,prefix+'_cdf_plot'),996,234,850,520)
    g=by_id(root,'normal_wearout_mapping' if n==51 else 'exponential_random_mapping');ts=[e for e in g if tag(e)=='text'];rs=[e for e in g if tag(e)=='rect']
    for i,(r,t) in enumerate(zip(rs,ts)):
        attrs(r,fill=NAVY if i==active else '#F7F9FC',stroke='none')
        position_text(t,num(t,'x'),805,20);attrs(t,fill='#FFFFFF' if i==active else MUTED)
    position_text(ts[3],495,875,26);attrs(ts[3],fill=NAVY)
    position_text(ts[4],495,919,24)
    g,ts=plain_group(root,'normal_lifetime_limitation' if n==51 else 'exponential_lifetime_suitability');surface(g,1016,778,810,62)
    icon=next(e for e in g if tag(e)=='g');translate(icon,0,-27)
    reflow(ts[0],1140,819,630,22,550,'#FFFFFF')
    reflow(ts[1],1044,886,737,27)

def distribution_formulas(root,n):
    content=by_id(root,'scene_content');prefix={52:'normal',55:'exponential',60:'weibull'}[n]
    for e in list(content):
        if tag(e)=='rect':open_rect(e)
        if tag(e)=='line':content.remove(e)
    g,ts=plain_group(root,prefix+'_formula_parameters')
    for i,t in enumerate(ts):
        reflow(t,[124,710,1350][i],225,1080 if len(ts)==2 and i==1 else [548,590,445][i],23,500)
    rule(g,98,267,1724)
    for i,kind in enumerate(['density','failure','reliability','hazard']):
        g=by_id(root,prefix+'_'+kind+'_formula');t=next(e for e in g if tag(e)=='text');p=next(e for e in g if tag(e)=='svg');y=308+i*136
        surface(g,98,y,494,96);reflow(t,126,y+56,450,25,550,'#FFFFFF')
        vb=[float(v) for v in p.get('viewBox').split()];scale=min(1.4,1080/vb[2]);w=vb[2]*scale;h=vb[3]*scale
        plot_box(p,670,y+48-h/2,w,h)
    g,ts=plain_group(root,prefix+('_formula_transition' if n==60 else '_formula_conclusion'))
    for e in list(g):
        if tag(e)=='line':g.remove(e)
    accent(g,98,880,60)
    for t in ts:reflow(t,126,920,1668,28,500)

def exponential_density(root,n):
    calm_connectors(root);plot_box(by_id(root,'exponential_density_plot'),620,230,1200,660)
    for ident,y,h in [('exponential_shape',244,88),('exponential_lambda_meaning',485,65),('exponential_random_events',720,65)]:
        g,ts=plain_group(root,ident);surface(g,98,y,440,h)
        icon=next(e for e in g if tag(e)=='g');cy=num(next(e for e in icon if tag(e)=='circle'),'cy');translate(icon,8,y+h/2-cy)
        reflow(ts[0],212,y+(35 if h==88 else 43),285,21,550,'#FFFFFF')
        for i,t in enumerate(ts[1:]):reflow(t,124,y+h+45+i*41,416,26)
    g=by_id(root,'exponential_application_fields');ts=[e for e in g if tag(e)=='text'];ls=[e for e in g if tag(e)=='line']
    for t,l,x in zip(ts,ls,[724,1187,1514]):
        position_text(t,x,934,25);attrs(l,x1=x-30,x2=x-15,y1=925,y2=925,stroke=GREEN,stroke_width=3)

def weibull_density(root,n):
    calm_connectors(root);plot_box(by_id(root,'weibull_density_plot'),620,230,1200,645)
    for ident,y in [('weibull_eta_meaning',244),('weibull_beta_meaning',452)]:
        g,ts=plain_group(root,ident);surface(g,98,y,440,76)
        icon=next(e for e in g if tag(e)=='g');cy=num(next(e for e in icon if tag(e)=='circle'),'cy');translate(icon,0,y+38-cy)
        reflow(ts[0],212,y+48,286,22,550,'#FFFFFF')
        reflow(ts[1],124,y+125,412,27)
    g,ts=plain_group(root,'weibull_special_cases');surface(g,98,686,440,61)
    position_text(ts[0],124,727,22);attrs(ts[0],fill='#FFFFFF')
    position_text(ts[1],124,798,26);position_text(ts[2],124,846,26)
    for c in ts[1]:
        if 'b = 1' in (c.text or ''):attrs(c,fill='#0C84B4')
    g=by_id(root,'weibull_applications');ts=[e for e in g if tag(e)=='text'];ls=[e for e in g if tag(e)=='line']
    position_text(ts[0],694,893,21);attrs(ts[0],fill=NAVY)
    for t,l,x in zip(ts[1:],ls,[724,1135,1556]):
        position_text(t,x,942,25);attrs(l,x1=x-30,x2=x-15,y1=933,y2=933,stroke=GREEN,stroke_width=3)

def weibull_hazard_focus(root,n):
    plot_box(by_id(root,'weibull_hazard_plot'),280,258,1360,674)

def weibull_lifecycle(root,n):
    calm_connectors(root);plot_box(by_id(root,'weibull_hazard_plot'),88,269,988,572)
    for i,ident in enumerate(['weibull_random_mapping','weibull_early_mapping','weibull_wear_mapping']):
        g,ts=plain_group(root,ident);y=240+i*194;surface(g,1130,y,692,78)
        icon=next(e for e in g if tag(e)=='g');cy=num(next(e for e in icon if tag(e)=='circle'),'cy');translate(icon,20,y+39-cy)
        reflow(ts[0],1252,y+49,526,25,550,'#FFFFFF')
        reflow(ts[1],1158,y+128,326,26)
        position_text(ts[2],1670,y+128,21);attrs(ts[2],fill=MUTED)
    g,ts=plain_group(root,'weibull_lifecycle_conclusion');icon=next(e for e in g if tag(e)=='g');translate(icon,-116,17)
    for e in list(g):
        if tag(e)=='line':g.remove(e)
    reflow(ts[0],228,912,1540,29,500);accent(g,98,865,78)

def weibull_characteristic_life(root,n):
    plot_box(by_id(root,'weibull_cdf_plot'),620,258,1200,680)
    g,ts=plain_group(root,'weibull_eta_location');surface(g,98,260,440,101)
    line_text(ts[0],124,302,23,32);attrs(ts[0],fill='#FFFFFF')
    line_text(ts[1],124,429,26,39);attrs(ts[1],fill=NAVY)
    g,ts=plain_group(root,'weibull_eta_conclusion');accent(g,98,617,248)
    for t,y,s in zip(ts,[653,724,794,850],[30,50,27,27]):position_text(t,124,y,s);attrs(t,text_anchor='start')

def weibull_derivation(root,n):
    for i,ident in enumerate(['weibull_derivation_substitution','weibull_derivation_unit_ratio','weibull_derivation_independent']):
        g,ts=plain_group(root,ident);y=267+i*193
        for e in list(g):
            if tag(e)=='circle':g.remove(e)
        surface(g,98,y,80,92);position_text(ts[0],138,y+59,28);attrs(ts[0],fill='#FFFFFF')
        p=next(e for e in g if tag(e)=='svg');vb=[float(v) for v in p.get('viewBox').split()]
        plot_box(p,232,y+46-vb[3]*.9,vb[2]*1.8,vb[3]*1.8)
        rule(g,232,y+132,750)
    for i,ident in enumerate(['weibull_derivation_failure_result','weibull_derivation_reliability_result']):
        g,ts=plain_group(root,ident);y=242+i*317;surface(g,1114,y,708,70)
        position_text(ts[0],1142,y+46,23);attrs(ts[0],fill='#FFFFFF',text_anchor='start')
        p=next(e for e in g if tag(e)=='svg');vb=[float(v) for v in p.get('viewBox').split()]
        plot_box(p,1142,y+119,vb[2]*1.28,vb[3]*1.28)
        position_text(ts[1],1142,y+245,50);attrs(ts[1],text_anchor='start')
        if i==1:
            for e in list(g):
                if tag(e)=='line':g.remove(e)
            reflow(ts[2],126,927,1630,28,500);accent(g,98,884,60)

def weibull_three_parameters(root,n):
    calm_connectors(root)
    g,ts=plain_group(root,'weibull_two_parameter_start');surface(g,98,206,450,76)
    position_text(ts[0],126,254,23);attrs(ts[0],fill='#FFFFFF',text_anchor='start')
    position_text(ts[1],126,353,43);attrs(ts[1],text_anchor='start')
    g,ts=plain_group(root,'weibull_t0_concept');surface(g,690,206,540,76)
    icon=next(e for e in g if tag(e)=='g');translate(icon,0,-28)
    position_text(ts[0],822,254,22);attrs(ts[0],fill='#FFFFFF')
    position_text(ts[1],716,332,27);position_text(ts[2],716,380,23)
    g,ts=plain_group(root,'weibull_replacement_rule');surface(g,1372,206,450,76)
    position_text(ts[0],1400,254,22);attrs(ts[0],fill='#FFFFFF',text_anchor='start')
    for t,y in zip(ts[1:],[333,382]):position_text(t,1400,y,30);attrs(t,text_anchor='start',fill='#EC6244')
    g,ts=plain_group(root,'weibull_three_parameter_formulas')
    for e in list(g):
        if tag(e)=='line':g.remove(e)
    ps=[e for e in g if tag(e)=='svg']
    for i,(t,p) in enumerate(zip(ts[:4],ps)):
        x=98+(i%2)*892;y=441+(i//2)*222;surface(g,x,y,832,58)
        position_text(t,x+28,y+40,25);attrs(t,fill='#FFFFFF')
        vb=[float(v) for v in p.get('viewBox').split()];plot_box(p,x+28,y+88,vb[2]*1.6,vb[3]*1.6)
    reflow(ts[4],126,937,1668,28,500);accent(g,98,896,60)

def weibull_shift(root,n):
    plot_box(by_id(root,'weibull_shift_plot'),300,242,1320,660)
    g,ts=plain_group(root,'weibull_shift_probabilities')
    for e in list(g):
        if tag(e)=='line':g.remove(e)
    position_text(ts[0],960,947,30);rule(g,400,910,1120)

def weibull_paper(root,n):
    plot_box(by_id(root,'weibull_paper_plot'),98,263,1190,660)
    g,ts=plain_group(root,'weibull_paper_axes_note');surface(g,1370,240,452,64)
    position_text(ts[0],1398,282,23);attrs(ts[0],fill='#FFFFFF')
    reflow(ts[1],1398,352,383,25)
    for i,ident in enumerate(['weibull_paper_process_example','weibull_paper_process_parallel','weibull_paper_process_beta']):
        g,ts=plain_group(root,ident);y=454+i*155
        for e in list(g):
            if tag(e) in ['line','circle']:g.remove(e)
        surface(g,1370,y,64,72);position_text(ts[0],1402,y+47,26);attrs(ts[0],fill='#FFFFFF')
        reflow(ts[1],1464,y+42,336,27,500)

def recall_statistics(root,n):
    frame=by_id(root,'recall_chart_frame');plot=next(e for e in frame if tag(e)=='svg')
    plot_box(plot,92,230,1290,650)
    g=by_id(root,'recall_key_figures');texts=[e for e in g if tag(e)=='text']
    for e in g:
        if tag(e)=='rect':open_rect(e)
    for t,x,y,size in [(texts[0],1460,310,50),(texts[1],1460,355,25),(texts[2],1460,475,50),(texts[3],1460,520,25),(texts[4],1450,642,22),(texts[5],1450,734,60),(texts[6],1450,790,26)]:
        reflow(t,x,y,350,size,600 if size>=40 else 450)
    surface(g,1420,600,400,64)
    attrs(texts[4],fill='#FFFFFF')
    for c in texts[4]:c.set('fill','#FFFFFF')
    accent(g,1430,274,100);accent(g,1430,439,100)

def purchase_priorities(root,n):
    g=by_id(root,'purchase_chart_context')
    for e in g:
        if tag(e)=='svg':plot_box(e,100,322,1720,568)
        if tag(e)=='text' and num(e,'font-size')==28:
            attrs(e,font_size=32,font_weight=600);family(e,True)
    # One open evidence line, tied to the actual ranking rather than extra cards.
    accent(g,1200,195,75)

def quotation(root,n):
    for gid in ['forecast_quote_setup','forecast_quote_implication']:
        g=by_id(root,gid)
        for e in g:
            if tag(e)=='rect':open_rect(e)
    setup=by_id(root,'forecast_quote_setup');texts=[e for e in setup if tag(e)=='text']
    reflow(texts[0],880,243,920,20,550)
    reflow(texts[2],970,355,820,42,500)
    position_text(texts[1],876,400,112);attrs(texts[1],fill=GREEN)
    conclusion=by_id(root,'forecast_quote_conclusion')
    for e in list(conclusion):
        if tag(e)=='line':conclusion.remove(e)
        if tag(e)=='text':position_text(e,970,591,40);attrs(e,fill=NAVY);family(e,True)
    g=by_id(root,'forecast_quote_implication');accent(g,880,705,162)
    for t in g:
        if tag(t)=='text':position_text(t,916,num(t,'y')+16)

def ssi(root,n):
    content=by_id(root,'scene_content')
    if n==10:
        for gid in ['stress_influences','strength_influences']:
            g=by_id(root,gid);panel=next(e for e in g if tag(e)=='rect');x=num(panel,'x');open_rect(panel)
            surface(g,x,270,360,62)
            t=next(e for e in g if tag(e)=='text');position_text(t,x+24,310,22);attrs(t,fill='#FFFFFF')
            for c in t:c.set('fill','#FFFFFF')
        g=by_id(root,'failure_consequences')
        for e in g:
            if tag(e)=='rect':open_rect(e)
        rule(g,490,805,940)
    else:
        for e in content:
            if tag(e)=='rect':open_rect(e)
        ids=['shifted_strength_explanation','reduced_overlap_explanation'] if n==11 else ['quality_cost_tradeoff']
        for gid in ids:
            g=by_id(root,gid)
            for e in g:
                if tag(e)=='rect':open_rect(e)
        if n==11:
            g=by_id(root,'shifted_strength_explanation');surface(g,1400,248,410,66)
            t=next(e for e in g if tag(e)=='text');attrs(t,fill='#FFFFFF',font_size=20)
            for c in t:c.set('fill','#FFFFFF')
            accent(by_id(root,'reduced_overlap_explanation'),1434,603,95)
            for e in g:
                if tag(e)=='path' and e.get('stroke'):attrs(e,stroke_width=2.5)
            for e in root.iter():
                if tag(e)=='marker':attrs(e,markerWidth=7,markerHeight=7)
            t=next(e for e in by_id(root,'reduced_overlap_explanation') if tag(e)=='text')
            reflow(t,1462,640,310,28,600)
            curve=by_id(root,'shifted_strength_distribution')
            parent=next(p for p in root.iter() if curve in list(p));index=list(parent).index(curve)
            clip=next(e.get('id') for e in root.iter() if tag(e)=='clipPath' and e.get('id','').startswith('stress_strength_shift_plot__'))
            wrapper=node('g',id='strength_fixed_plot_clip',clip_path=f'url(#{clip})')
            parent.remove(curve);wrapper.append(curve);parent.insert(index,wrapper)
        else:
            g=by_id(root,'quality_cost_tradeoff');surface(g,1215,238,625,66)
            t=next(e for e in g if tag(e)=='text');attrs(t,fill='#FFFFFF',font_size=24)
            for c in t:c.set('fill','#FFFFFF')
            accent(g,1240,720,58)
            for t in g:
                if tag(t)=='text' and num(t,'y')==751:reflow(t,1265,742,540,22,500)

def vehicle_hierarchy(root,n):
    tree=by_id(root,'vehicle_system_hierarchy')
    paths=[e for e in tree if tag(e)=='path']
    paths[0].set('d','M960 275V305H390V340M960 305V340M960 305H1530V340')
    paths[1].set('d','M390 440V474H245V520M390 474H515V520M515 474H785V520M785 474H1055V520')
    for e in tree:
        if tag(e) in ['rect','text']:
            y=num(e,'y');dy=-50 if y<600 else -110
            if tag(e)=='text':position_text(e,num(e,'x'),y+dy)
            else:attrs(e,y=y+dy)
    vehicle=by_id(root,'vehicle_root');translate(vehicle,0,-25)
    for e in list(vehicle):
        if e.get('data-component')=='reltest-pictogram':vehicle.remove(e)
        if tag(e)=='text':position_text(e,960,num(e,'y'));attrs(e,text_anchor='middle')
    functions=by_id(root,'function_examples');texts=[e for e in functions if tag(e)=='text']
    for t in texts[:8]:
        y=num(t,'y');dy=-25 if y<300 else -50 if y<600 else -110;position_text(t,num(t,'x'),y+dy)
    position_text(texts[0],960,257);attrs(texts[0],text_anchor='middle')
    for e in list(functions):
        if tag(e) in ['rect','line']:open_rect(e) if tag(e)=='rect' else functions.remove(e)
    header=texts[8];surface(functions,112,677,1696,62);position_text(header,136,719,25);attrs(header,fill='#FFFFFF');family(header,True)
    for c in header:c.set('fill','#FFFFFF')
    for t,x in zip(texts[9:12],[570,1100,1640]):position_text(t,x,782,28)
    position_text(texts[12],112,830,21)
    for t,x in zip(texts[13:16],[570,1100,1640]):position_text(t,x,829,23)
    for e,d in zip([e for e in functions if tag(e)=='path' and e.get('stroke')],['M730 833H930','M1270 833H1470']):e.set('d',d);e.set('stroke-width','2.5')
    rule(functions,112,871,1696)
    failures=by_id(root,'failure_propagation');texts=[e for e in failures if tag(e)=='text']
    position_text(texts[0],112,919,21)
    for t,x in zip(texts[1:],[570,1100,1640]):position_text(t,x,916,23);attrs(t,fill='#EC6244')
    for e,d in zip([e for e in failures if tag(e)=='path'],['M730 921H930','M1270 921H1470']):e.set('d',d);e.set('stroke-width','2.5')
    for e in list(failures):
        if e.get('data-component')=='reltest-pictogram':failures.remove(e)
    failures.insert(1,node('rect',x=117,y=517,width=256,height=106,rx=8,fill='none',stroke='#EC6244',stroke_width=4,data_design_role='failed-component-outline'))

SPECIAL={1:case_study,2:recall_statistics,3:case_study,4:case_study,5:three_consequences,6:central_influences,7:purchase_priorities,8:quotation,9:vehicle_hierarchy,10:ssi,11:ssi,12:ssi,13:definition,14:method_bathtub,15:method_comparison,16:design_and_assurance,17:lifecycle_overview,71:definition,72:method_comparison,73:lifecycle_overview}
SPECIAL.update({18:reliability_planning,19:weakness_process,20:methods_four,21:testing_branches,22:testing_goals,23:production_methods})
SPECIAL.update({24:systematic_testing,25:production_sample,26:field_feedback})
SPECIAL.update({27:woehler_introduction,28:chart_focus,29:chart_focus,31:chart_focus,32:chart_focus})
SPECIAL.update({30:gearbox_density})
SPECIAL.update({33:cdf_formulas})
SPECIAL.update({34:gearbox_cdf,35:human_cdf})
SPECIAL.update({36:reliability_partition})
SPECIAL.update({37:bathtub_explanation})
SPECIAL.update({38:human_hazard,39:gearbox_hazard})
SPECIAL.update({40:location_overview,41:location_detail,42:location_detail,43:location_detail,44:location_comparison})
SPECIAL.update({45:metrics_overview})
SPECIAL.update({46:mttf_detail})
SPECIAL.update({47:mtbf_detail})
SPECIAL.update({48:ppm_scale})
SPECIAL.update({49:bq_life})
SPECIAL.update({50:normal_density})
SPECIAL.update({51:normal_limitations})
SPECIAL.update({52:distribution_formulas})
SPECIAL.update({53:exponential_density})
SPECIAL.update({54:normal_limitations})
SPECIAL.update({55:distribution_formulas})
SPECIAL.update({56:weibull_density})
SPECIAL.update({57:weibull_hazard_focus})
SPECIAL.update({58:weibull_lifecycle})
SPECIAL.update({59:weibull_characteristic_life})
SPECIAL.update({60:distribution_formulas})
SPECIAL.update({61:weibull_derivation})
SPECIAL.update({62:weibull_three_parameters})
SPECIAL.update({63:weibull_shift})
SPECIAL.update({64:weibull_paper})

def redesign(n):
    name=f'slide_{n:03}';src=REVIEW/'baseline'/name/(name+'.svg')
    root=E.fromstring(src.read_text(encoding='utf-8'));base(root,n)
    if n in SPECIAL:SPECIAL[n](root,n)
    refine_plot_labels(root,n)
    dest=ROOT/'rebuild-proposals/svg/RE1'/name/(name+'.svg')
    meta=root.find('{'+NS+'}metadata')
    out=E.tostring(root,encoding='unicode')
    out=re.sub(r'(<metadata\b[^>]*>)[\s\S]*?(</metadata>)',lambda m:m[1]+'<![CDATA['+meta.text+']]>'+m[2],out,count=1)
    dest.write_text('<?xml version="1.0" encoding="UTF-8"?>\n'+palette_xml(out)+'\n',encoding='utf-8')
    # Keep standalone plot/formula assets synchronized with the inline copies.
    for asset in dest.parent.rglob('*.svg'):
        if asset==dest:continue
        saved=REVIEW/'baseline'/name/asset.relative_to(dest.parent)
        if not saved.exists():
            saved.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(asset,saved)
        if n==14 and asset.name=='bathtub_curve.svg':
            # Obsolete, unreferenced plot: the complete semantic plot is native
            # in slide_014.svg. Its original remains in the frozen baseline.
            assert saved.exists() and asset.name not in out
            asset.unlink()
            continue
        asset_root=E.fromstring(saved.read_text(encoding='utf-8'));refine_plot_labels(asset_root,n)
        asset.write_text(palette_xml(E.tostring(asset_root,encoding='unicode')),encoding='utf-8')
    print(f'{name}: {SPECIAL.get(n,base).__name__}')

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--slide',required=True,type=int);a=p.parse_args();redesign(a.slide)
