"""One source-aligned object/time system for RE3 scenes 34 through 42.

Positions are illustrative, preserving source identities and ordering; not data.
"""
from __future__ import annotations
import argparse
import json
from pathlib import Path
from matplotlib.patches import FancyArrowPatch
from object_time_diagram_plot import create_object_time_axes
from re3_feedback_plots import ROOT, C, save
from re3_confidence_feedback_plots import animate_groups

COMPLETE = [49, 38, 69, 78, 42, 54]
TYPE_ONE = [49, 38, 62, 62, 42, 54]
TYPE_TWO = [49, 38, 62, 62, 42, 62]
MULTIPLE = [42, 23, 67, 27, 40, 54]
MECHANISMS = ['B', 'A', 'B', 'B', 'A', 'A']
INTERVALS = [(42,56), (23,39), (67,89), (27,46), (41,52), (55,74)]


def diagram(folder, filename, prefix, mode, *, size=(9,5.8)):
    fig, ax = create_object_time_axes(figsize=size)
    groups = {}
    times = COMPLETE if mode=='complete' else TYPE_ONE if mode=='type_one' else TYPE_TWO if mode=='type_two' else MULTIPLE
    def add(group, artist):
        ids=groups.setdefault(prefix+'_'+group, [])
        uid=f'{prefix}_{group}_element_{len(ids)}'
        artist.set_gid(uid); ids.append(uid)
    def stroke(group, xs, ys, color=C['ink'], lw=1.8, **kwargs):
        add(group, ax.plot(xs,ys,color=color,lw=lw,**kwargs)[0])
    def failure(group,t,obj,color):
        add(group,ax.plot(t,obj,'x',color=color,ms=10,mew=2.2,zorder=5)[0])
    def censor(group,t,obj):
        add(group,ax.plot(t,obj,'|',color=C['support'],ms=16,mew=2.2,zorder=5)[0])
        arrow=FancyArrowPatch((t+1,obj),(t+8,obj),arrowstyle='->',mutation_scale=13,color=C['support'],lw=1.8,zorder=5)
        ax.add_patch(arrow)
        add(group,arrow)
    for obj,t in enumerate(times,1):
        if mode=='interval':
            lo,hi=INTERVALS[obj-1]
            key='example' if obj==2 else 'others'
            stroke(key,[0,lo],[obj,obj])
            add(key,ax.fill_between([lo,hi],obj-.20,obj+.20,color=C['support'],alpha=.12))
            stroke(key,[lo,hi],[obj,obj],C['support'],2)
            add(key,ax.plot([lo,hi],[obj,obj],'|',color=C['support'],ms=18,mew=2.2)[0])
            add(key,ax.text((lo+hi)/2,obj+.06,'?',ha='center',va='bottom',fontsize=19,color=C['accent'],weight='bold'))
            continue
        is_competing=mode in ['observed','analysis_a','analysis_b']
        mechanism=MECHANISMS[obj-1]
        censored=(obj in [3,4] if mode in ['type_one','type_two'] else obj in [1,3,4] if mode=='multiple' else mode=='analysis_a' and mechanism=='B' or mode=='analysis_b' and mechanism=='A')
        key=('a' if mechanism=='A' else 'b') if is_competing else 'censored' if censored else 'failures'
        if mode=='type_two' and obj==6: key='stop_event'
        stroke(key,[0,t],[obj,obj])
        if censored: censor(key,t,obj)
        else: failure(key,t,obj,C['data'] if is_competing and mechanism=='B' else C['accent'])
    if mode in ['type_one','type_two']:
        stroke('stop',[62,62],[0,6.45],C['support'] if mode=='type_one' else C['accent'],1.4,ls=(0,(3,3)),zorder=0)
        add('stop',ax.text(62,6.70,'vorgegebene Zeit' if mode=='type_one' else '4. Ausfall → Stopp',ha='center',fontsize=18,color=C['ink']))
    if mode=='complete':
        stroke('stop',[82,82],[0,6.45],C['muted'],1.3,ls=(0,(3,3)),zorder=0)
        add('stop',ax.text(82,6.70,'Versuchsende',ha='center',fontsize=18,color=C['ink']))
    output=folder/'plots'/filename
    save(fig,output)
    animate_groups(output,groups)
    return {'mode':mode,'file':filename,'prefix':prefix,'times':times if mode!='interval' else None,'intervals':INTERVALS if mode=='interval' else None,'mechanisms':MECHANISMS if mode in ['observed','analysis_a','analysis_b'] else None,'public_targets':list(groups)}


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--scene',type=int,required=True);args=parser.parse_args()
    folder=ROOT/f'rebuild-proposals/svg/RE3/slide_{args.scene:03}'
    configs={34:[('complete.svg','complete','complete')],35:[('type-one.svg','type_one','type_one')],36:[('type-one.svg','compare_one','type_one'),('type-two.svg','compare_two','type_two')],38:[('multiple.svg','multiple','multiple')],39:[('observed.svg','observed','observed'),('analysis-a.svg','analysis_a','analysis_a'),('analysis-b.svg','analysis_b','analysis_b')],42:[('interval.svg','interval','interval')]}
    snapshots=[diagram(folder,*c,size=(7.2,5.8) if args.scene==39 else (9,5.8)) for c in configs[args.scene]]
    (folder/'data').mkdir(parents=True,exist_ok=True)
    (folder/'data/object-time.json').write_text(json.dumps({'role':'illustrative_irregular_timeline','source_slides':{34:[34],35:[35,36],36:[36,37],38:[38],39:[39,40,41],42:[42]}[args.scene],'source_unit':'No numeric times provided; common normalized time scale preserves geometry and ordering.','common_axes':{'x':[0,100],'y':[0,6.6],'objects_bottom_to_top':[1,2,3,4,5,6],'origin':0},'plots':snapshots},indent=2),encoding='utf-8')

if __name__=='__main__': main()
