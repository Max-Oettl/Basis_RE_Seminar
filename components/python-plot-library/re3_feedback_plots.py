"""Source-aligned plot assets for the first RE3 e-learning sequence.

Uses the canonical median-rank, fit and bootstrap calculations. No raster plots.
Each invocation only produces assets for the requested scene.
"""
from __future__ import annotations

import argparse
import json
import math
import re
import sys
from pathlib import Path
import xml.etree.ElementTree as ET

import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from reltest_plot_style import apply_reltest_style, RELTEST_COLORS as C
from weibull_probability_plot import median_ranks, weibull_y, linear_fit
from weibull_confidence_plot import bootstrap_confidence_limits

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'components/formula-library'))
from render_formula_svg import render_formula_svg

TIMES = [12, 18, 27, 44, 68, 105, 160]
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')


def paper(size=(6.5, 7.8), limits=(.1, 100), ticks=None):
    apply_reltest_style()
    plt.rcParams['svg.hashsalt'] = 're3-feedback-2026-09-17'
    fig, ax = plt.subplots(figsize=size)
    ax.set_xscale('log')
    ax.set_xlim(*limits)
    ps = ticks or [.001, .003, .01, .03, .1, .3, .632, .9, .999]
    ax.set_yticks([weibull_y(p) for p in ps])
    ax.set_yticklabels([f'{p*100:g}'.replace('.', ',') for p in ps])
    ax.set_ylim(weibull_y(min(ps)), weibull_y(max(ps)))
    ax.set_xlabel('Lebensdauer t', fontsize=18, labelpad=10)
    ax.set_ylabel('Ausfallwahrscheinlichkeit F(t) [%]', fontsize=18, labelpad=10)
    ax.tick_params(labelsize=18, pad=9)
    if limits == (.1, 100):
        ax.set_xticks([.1,1,10,100], ['0,1','1','10','100'])
    ax.grid(True, which='major', color=C['grid_major'], linewidth=.7)
    ax.grid(True, which='minor', color=C['grid_minor'], linewidth=.45)
    ax.set_axisbelow(True)
    for spine in ax.spines.values():
        spine.set_linewidth(1)
        spine.set_color(C['ink'])
    fig.subplots_adjust(left=.21, right=.94, bottom=.15, top=.96)
    return fig, ax


def save(fig, output):
    output.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(output, format='svg', transparent=True, metadata={'Date': None})
    plt.close(fig)
    normalize_asset(output, 'probability-plot')


def normalize_asset(output, kind):
    source=output.read_text(encoding='utf-8')
    source=re.sub(r'<metadata[\s\S]*?</metadata>', '', source)
    meta={'artifactScope':'content-svg','embeddingTarget':'powerpoint-slide',
          'slideType':kind,'contentTitle':kind,'layoutIntent':'Reusable mathematical asset in parent scene',
          'takeaway':'Quellgetreue mathematische Darstellung','density':'normal',
          'contentMode':'transparent-content','backgroundMode':'transparent',
          'brandProfile':'reltest-education','brandVariant':'education'}
    source=re.sub(r'(<svg\b[^>]*>)',lambda m:m[1]+'<metadata id="slide_quality_metadata" type="application/json"><![CDATA['+json.dumps(meta)+']]></metadata>',source,count=1)
    source=source.replace("font-family: 'Archivo'",'font-family: Archivo, Arial, Helvetica, sans-serif')
    source=source.replace('<text>', '<text style="font-size: 18px; font-family: Archivo, Arial, Helvetica, sans-serif">')
    source=re.sub(r'<(path|rect|line|circle)\b(?![^>]*data-role=)',r'<\1 data-role="plot-geometry" data-qc-allow-overlap="true" data-qa-reason="Plot grid, curve and marker geometry intentionally share the data plane"',source)
    output.write_text(source,encoding='utf-8')


def fit(ax, times, prefix='intro', color=None, marker='o', labels=False):
    p = median_ranks(len(times))
    y = [weibull_y(v) for v in p]
    slope, intercept = linear_fit([math.log10(t) for t in times], y)
    x = np.geomspace(*ax.get_xlim(), 180)
    curve, = ax.plot(x, intercept+slope*np.log10(x), color=color or C['ink'], lw=2)
    curve.set_gid(prefix+'_fit')
    for i,(t,v) in enumerate(zip(times,y), 1):
        dot, = ax.plot(t, v, marker, mfc='white', mec=color or C['data'], mew=1.8, ms=7, zorder=5)
        dot.set_gid(prefix+f'_point_{i}')
    return slope, intercept


def intro(folder):
    fig, ax = paper((6.2, 7.8))
    # The source introduces a model, without claiming these are measured data.
    x = np.geomspace(.25, 16, 160)
    y = 1.4 * np.log(x / 7)
    curve, = ax.plot(x, y, color=C['ink'], lw=2.1)
    curve.set_gid('intro_fit')
    ax.set_xlabel('Lebensdauer t [10⁶ LC]', fontsize=18, labelpad=10)
    ax.text(.15, weibull_y(.18), 'Weibullgerade', color=C['ink'], fontsize=18,
            bbox={'facecolor':'white','edgecolor':'none','pad':3}).set_gid('intro_fit_label')
    save(fig, folder/'plots/intro-weibull.svg')
    render_formula_svg(r'$F(t)=1-e^{-\left(\frac{t}{T}\right)^b}$', folder/'formulas/weibull-function.svg', fontsize=38, color=C['ink'])
    normalize_asset(folder/'formulas/weibull-function.svg', 'formula')
    (folder/'data').mkdir(exist_ok=True)
    (folder/'data/intro.json').write_text(json.dumps({'source':'RE3/Folie1.SVG','role':'illustrative Weibull model, no measured sample','beta':1.4,'eta':7,'plot_aspect':'portrait'},indent=2),encoding='utf-8')


def workflow(folder):
    fig,ax=paper((12.8,5.4),(8,230),[.01,.05,.1,.3,.632,.9,.99])
    fig.subplots_adjust(left=.13,right=.97,bottom=.21,top=.94)
    ax.set_xticks(TIMES,[f't{str(i).translate(str.maketrans("1234567","₁₂₃₄₅₆₇"))}' for i in range(1,8)])
    ax.tick_params(axis='x',which='minor',bottom=False,labelbottom=False)
    probs=median_ranks(7)
    slope,intercept=linear_fit([math.log10(t) for t in TIMES],[weibull_y(p) for p in probs])
    xs=np.geomspace(8,230,160)
    ax.plot(xs,intercept+slope*np.log10(xs),color=C['ink'],lw=2)[0].set_gid('plot_weibull_fit')
    for i,(t,p) in enumerate(zip(TIMES,probs),1):
        ax.plot(t,weibull_y(p),'o',mfc='white',mec=C['data'],ms=8,mew=2,zorder=5)[0].set_gid(f'workflow_point_{i}')
        ax.annotate(str(i),(t,weibull_y(p)),xytext=(-6,12),textcoords='offset points',fontsize=18,color=C['ink']).set_gid(f'workflow_point_label_{i}')
    save(fig,folder/'plots/weibull-probability.svg')
    # Keep number and data marker atomic; exported IDs are addressed by the scene.
    svg=ET.parse(folder/'plots/weibull-probability.svg')
    root=svg.getroot()
    for i in range(1,8):
        p=root.find(f'.//*[@id="workflow_point_{i}"]')
        label=root.find(f'.//*[@id="workflow_point_label_{i}"]')
        parent=next(n for n in root.iter() if p in list(n))
        group=ET.Element(f'{{{NS}}}g',{'id':f'workflow_point_{i}','data-anim-target':'true','data-anim-label':f'Wertepaar {i} im Weibullnetz'})
        p.set('id',f'workflow_marker_{i}')
        parent.remove(p);parent.remove(label);group.extend([p,label]);parent.append(group)
    fitnode=root.find('.//*[@id="plot_weibull_fit"]')
    fitnode.set('data-anim-target','true');fitnode.set('data-anim-label','Ausgleichsgerade')
    svg.write(folder/'plots/weibull-probability.svg',encoding='utf-8',xml_declaration=True)
    normalize_asset(folder/'plots/weibull-probability.svg','probability-plot')
    for f in (folder/'formulas').glob('*.svg'):
        normalize_asset(f,'formula')
    (folder/'data').mkdir(exist_ok=True)
    (folder/'data/workflow.json').write_text(json.dumps({'times':TIMES,'probabilities':probs,'source':'Seven ranked failure times; illustrative time magnitudes retained from prior scene','point_ids':[f'workflow_point_{i}' for i in range(1,8)]},indent=2),encoding='utf-8')


def mechanisms(folder):
    fig,ax=paper((10.8,5.1),(8,150),[.01,.1,.5,.9,.99])
    fig.subplots_adjust(left=.15,right=.97,bottom=.18,top=.95)
    ax.tick_params(axis='x',which='both',labelbottom=False)
    fit(ax,[12,35,108],'mechanism_a',C['ink'],'x')
    fit(ax,[20,57,72],'mechanism_b',C['support'],'+')
    save(fig,folder/'plots/mechanisms.svg')
    svg=ET.parse(folder/'plots/mechanisms.svg');root=svg.getroot()
    for prefix in ['mechanism_a','mechanism_b']:
        nodes=[n for n in root.iter() if n.get('id','').startswith(prefix)]
        parent=next(n for n in root.iter() if nodes[0] in list(n))
        group=ET.Element(f'{{{NS}}}g',{'id':prefix,'data-anim-target':'true','data-anim-label':prefix.replace('_',' ')})
        for n in nodes:parent.remove(n);group.append(n)
        parent.append(group)
    svg.write(folder/'plots/mechanisms.svg',encoding='utf-8',xml_declaration=True)
    normalize_asset(folder/'plots/mechanisms.svg','probability-plot')
    (folder/'data').mkdir(exist_ok=True)
    (folder/'data/mechanisms.json').write_text(json.dumps({'source':'Folie10.SVG','time_positions':'illustrative; source membership is exact','A':{'ids':[1,3,6],'times':[12,35,108]},'B':{'ids':[2,4,5],'times':[20,57,72]}},indent=2),encoding='utf-8')


def censored(folder):
    apply_reltest_style()
    fig,ax=plt.subplots(figsize=(8.6,4.5))
    fig.subplots_adjust(left=.15,right=.97,top=.97,bottom=.20)
    times=[57,18,84,84,33,69]
    for obj,t in enumerate(times,1):
        ax.hlines(obj,0,t,color=C['ink'],lw=1.6)
        if obj in [3,4]:
            ax.plot(t,obj,'|',color=C['support'],mew=2.2,ms=14)
            ax.annotate('',(t+7,obj),(t+1,obj),arrowprops={'arrowstyle':'->','color':C['support'],'lw':1.8})
        else:
            ax.plot(t,obj,'x',color=C['accent'],mew=2.1,ms=10)
    ax.set_xlim(0,102);ax.set_ylim(.5,6.6)
    ax.set_yticks(range(1,7));ax.set_ylabel('Objekt Nr.',fontsize=20)
    ax.set_xticks([]);ax.set_xlabel('Beobachtungszeit t',fontsize=20)
    ax.tick_params(axis='y',labelsize=19,length=0,pad=10)
    ax.spines['top'].set_visible(False);ax.spines['right'].set_visible(False)
    save(fig,folder/'plots/objects.svg')
    fig,ax=paper((9,4.6),(10,120),[.1,.5,.99])
    fig.subplots_adjust(left=.16,right=.96,bottom=.18,top=.89)
    ax.tick_params(axis='x',which='both',labelbottom=False)
    xs=np.geomspace(16,100,100)
    ax.plot(xs,1.8*np.log(xs/55),color=C['ink'],lw=2)
    save(fig,folder/'plots/evaluation.svg')
    (folder/'data').mkdir(exist_ok=True)
    (folder/'data/censored.json').write_text(json.dumps({'source':'Folie11.SVG, Folie12.SVG','object_times':times,'censored_objects':[3,4],'failure_time_order_objects':[2,5,1,6],'role':'Illustrative irregular time positions, exact source object/failure ordering. Weibull curve is the source schematic evaluation symbol, not an estimated fit.'},indent=2),encoding='utf-8')


def methods(folder):
    times=[12,20,35,57,72,108]
    fig,ax=paper((9,4.7),(8,150),[.01,.1,.5,.9,.99])
    fig.subplots_adjust(left=.17,right=.96,bottom=.18,top=.9)
    ax.tick_params(axis='x',which='both',labelbottom=False)
    fit(ax,times,'method',C['ink'])
    save(fig,folder/'plots/graphical-method.svg')
    (folder/'data').mkdir(exist_ok=True)
    (folder/'data/method.json').write_text(json.dumps({'times':times,'source':'Six source events from Folie13.SVG; same illustrative data and axes as the following confidence scene'},indent=2),encoding='utf-8')


def confidence(folder):
    times=[12,20,35,57,72,108]
    fig,ax=paper((11,5.4),(8,150),[.01,.1,.5,.9,.99])
    fig.subplots_adjust(left=.16,right=.97,bottom=.18,top=.95)
    ax.tick_params(axis='x',which='both',labelbottom=False)
    slope,intercept=fit(ax,times,'confidence',C['ink'])
    xs=np.geomspace(8,150,160);logx=np.log10(xs)
    beta=slope/math.log(10);eta=math.exp(-intercept/beta)
    lower,upper=bootstrap_confidence_limits(len(times),beta,eta,slope,intercept,logx,.05,.95,5000,42)
    for name,values in [('lower',lower),('upper',upper)]:
        ax.plot(xs,values,color=C['support'],lw=1.8,ls=(0,(5,4)))[0].set_gid('confidence_'+name)
    for name,values,xpos,offset,label in [('lower',lower,65,-.6,'5-%-Grenze'),('upper',upper,13,.65,'95-%-Grenze')]:
        ypos=float(np.interp(math.log10(xpos),logx,values))+offset
        ax.text(xpos,ypos,label,fontsize=18,color=C['support'],bbox={'facecolor':'white','edgecolor':'none','pad':2}).set_gid('confidence_'+name+'_label')
    save(fig,folder/'plots/confidence.svg')
    svg=ET.parse(folder/'plots/confidence.svg');root=svg.getroot()
    parent=next(n for n in root.iter() if root.find('.//*[@id="confidence_lower"]') in list(n))
    group=ET.Element(f'{{{NS}}}g',{'id':'confidence_limits','data-anim-target':'true','data-anim-label':'Beide Vertrauensgrenzen'})
    for name in ['confidence_lower','confidence_upper','confidence_lower_label','confidence_upper_label']:
        node=root.find(f'.//*[@id="{name}"]');parent.remove(node);group.append(node)
    parent.append(group)
    svg.write(folder/'plots/confidence.svg',encoding='utf-8',xml_declaration=True)
    normalize_asset(folder/'plots/confidence.svg','probability-plot')
    (folder/'data').mkdir(exist_ok=True)
    (folder/'data/confidence.json').write_text(json.dumps({'source':'Folie14.SVG','times':times,'role':'Illustrative six-event source timeline; canonical pointwise parametric bootstrap confidence limits','bounds':[.05,.95],'bootstrap_samples':5000,'seed':42},indent=2),encoding='utf-8')


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--scene',type=int,required=True)
    args=parser.parse_args()
    folder=ROOT/'rebuild-proposals/svg/RE3'/f'slide_{args.scene:03d}'
    {1:intro,2:workflow,9:mechanisms,11:censored,13:methods,14:confidence}[args.scene](folder)

if __name__=='__main__':
    main()
