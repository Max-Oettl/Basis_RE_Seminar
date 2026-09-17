"""RE3 confidence lesson assets. Reproducible illustrations, not measured data."""
from __future__ import annotations

import argparse
import json
import math
import hashlib
from pathlib import Path
import xml.etree.ElementTree as ET
import numpy as np
import matplotlib
from matplotlib.text import Text
from re3_feedback_plots import ROOT, NS, C, paper, save, normalize_asset, plt, apply_reltest_style
from weibull_confidence_plot import bootstrap_confidence_limits
from weibull_probability_plot import median_ranks, weibull_y, linear_fit

MODEL = {'beta': 2.2, 'eta': 8.0, 'n': 12, 'samples': 5000, 'seed': 42}


class FormulaText(Text):
    """Export only mathematical labels as glyph paths, keeping prose searchable."""
    def draw(self, renderer):
        with matplotlib.rc_context({'svg.fonttype':'path'}):
            super().draw(renderer)


def formula_text(ax, x, y, text, **kwargs):
    transform=kwargs.pop('transform',ax.transData)
    artist=FormulaText(x=x,y=y,text=text,transform=transform,clip_on=False,**kwargs)
    ax.add_artist(artist)
    return artist


def animate_groups(output, groups):
    tree = ET.parse(output)
    root = tree.getroot()
    for name, ids in groups.items():
        nodes = [root.find(f'.//*[@id="{i}"]') for i in ids]
        nodes = [n for n in nodes if n is not None]
        if not nodes:
            raise ValueError(f'Empty animation group: {name}')
        group = ET.Element(f'{{{NS}}}g', {'id': name, 'data-anim-target': 'true', 'data-anim-label': name.replace('_', ' ')})
        parent = next(p for p in root.iter() if nodes[0] in list(p))
        for node in nodes:
            current = next(p for p in root.iter() if node in list(p))
            current.remove(node)
            group.append(node)
        parent.append(group)
    tree.write(output, encoding='utf-8', xml_declaration=True)
    normalize_asset(output, 'probability-plot')


def model_plot(output, *, size=(6.8, 5.5), bounds=True, prefix='sample', portrait=False, alternatives=False):
    fig, ax = paper(size, (.3, 40), [.01, .1, .5, .9, .99])
    fig.subplots_adjust(left=.24 if portrait else .19, right=.96, bottom=.18, top=.96)
    ax.set_xticks([1, 10], ['1', '10'])
    ax.tick_params(axis='x', which='minor', labelbottom=False)
    beta, eta = MODEL['beta'], MODEL['eta']
    slope = beta * math.log(10)
    intercept = -beta * math.log(eta)
    xs = np.geomspace(.3, 40, 180)
    ax.plot(xs, beta*np.log(xs/eta), color=C['ink'], lw=2.2)[0].set_gid(prefix+'_fit_line')
    ax.text(.42 if portrait else 1.65, .1 if portrait else -.45, 'Median' if prefix.startswith('population') else 'Weibullgerade', fontsize=18, color=C['ink'],
            bbox={'facecolor':'white', 'edgecolor':'none', 'pad':2}).set_gid(prefix+'_fit_label')
    groups = {prefix+'_fit':[prefix+'_fit_line', prefix+'_fit_label']}
    if portrait:
        ax.set_xlabel('Lebensdauer t [10⁶ LC]', fontsize=18, labelpad=12)
    if bounds:
        lo, hi = bootstrap_confidence_limits(MODEL['n'], beta, eta, slope, intercept, np.log10(xs), .05, .95, MODEL['samples'], MODEL['seed'])
        for name, vals in [('lower', lo), ('upper', hi)]:
            ax.plot(xs, vals, color=C['data'], lw=2, ls=(0,(5,4)))[0].set_gid(prefix+'_'+name)
        for name, vals, xpos, offset, label in [('lower',lo,13,-.55,'5 %'),('upper',hi,.9,.38,'95 %')]:
            ypos=float(np.interp(np.log10(xpos),np.log10(xs),vals))+offset
            ax.text(xpos,ypos,label,fontsize=18,color=C['data'],bbox={'facecolor':'white','edgecolor':'none','pad':1}).set_gid(prefix+'_'+name+'_label')
        groups[prefix+'_limits']=[prefix+'_lower', prefix+'_upper', prefix+'_lower_label', prefix+'_upper_label']
    if alternatives:
        rng=np.random.default_rng(730)
        ids=[]
        for i in range(4):
            times=np.sort(eta*rng.weibull(beta,size=MODEL['n']))
            m,c=linear_fit(np.log10(times),[weibull_y(p) for p in median_ranks(len(times))])
            ident=f'{prefix}_alternative_{i}'
            ax.plot(xs,c+m*np.log10(xs),color=C['muted'],lw=1.2,alpha=.7)[0].set_gid(ident)
            ids.append(ident)
        groups[prefix+'_alternatives']=ids
    save(fig, output)
    animate_groups(output, groups)


def sample_population(folder):
    model_plot(folder/'plots/sample-fit.svg', bounds=False, prefix='population_sample')
    model_plot(folder/'plots/population-confidence.svg', prefix='population_estimate')
    write_data(folder, {'source':'RE3 Folie15.SVG and Folie16.SVG', 'role':'Illustrative model, no measured sample claimed', **MODEL})


def meaning(folder):
    model_plot(folder/'plots/meaning-portrait.svg',size=(6.4,8.7),prefix='meaning',portrait=True,alternatives=True)
    write_data(folder, {'source':'RE3 Folie17–19.SVG', 'role':'Illustrative model and four alternate sample fits; no coverage count is claimed', 'alternative_seed':730, **MODEL})


def comparison(output, variants):
    fig,ax=paper((9,5.8),(.3,40),[.01,.1,.5,.9,.99])
    fig.subplots_adjust(left=.16,right=.97,bottom=.2,top=.97)
    ax.set_xticks([1,10],['1','10'])
    ax.set_xlabel('Lebensdauer t [10⁶ LC]',fontsize=18,labelpad=10)
    ax.tick_params(axis='x',which='minor',labelbottom=False)
    xs=np.geomspace(.3,40,180)
    beta,eta=MODEL['beta'],MODEL['eta']
    slope=beta*math.log(10);intercept=-beta*math.log(eta)
    ax.plot(xs,beta*np.log(xs/eta),color=C['ink'],lw=2)
    groups={}
    for prefix,n,lower,upper,color,dashed in variants:
        lo,hi=bootstrap_confidence_limits(n,beta,eta,slope,intercept,np.log10(xs),lower,upper,MODEL['samples'],MODEL['seed'])
        ids=[]
        for name,vals in [('lower',lo),('upper',hi)]:
            ident=prefix+'_'+name
            ax.plot(xs,vals,color=color,lw=2,ls=(0,(6,4)) if dashed else '-')[0].set_gid(ident)
            ids.append(ident)
        groups[prefix]=ids
    save(fig,output)
    animate_groups(output,groups)


def drivers(folder):
    comparison(folder/'plots/level-comparison.svg',[
        ('level_90',12,.05,.95,C['support'],True),
        ('level_80',12,.1,.9,C['data'],False),
    ])
    comparison(folder/'plots/sample-comparison.svg',[
        ('sample_small',12,.05,.95,C['support'],True),
        ('sample_large',48,.05,.95,C['data'],False),
    ])
    write_data(folder,{'source':'RE3 Folie20–22.SVG and section_006','role':'Controlled illustrative comparison; identical model and axes, only confidence quantiles or sample count change',**MODEL,'confidence_levels':[.9,.8],'sample_counts':[12,48]})


def surface(folder):
    asset=ROOT/'analysis/re3-assets/plots/probability-surface.svg'
    if not asset.exists():
        raise FileNotFoundError('The user-approved surface asset must be present; do not silently regenerate it.')
    write_data(folder,{'source':'RE3 Folie23.SVG','role':'Reuse the existing user-approved Python surface asset without modifying its geometry, color, type or data', 'asset':asset.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(asset.read_bytes()).hexdigest()})


def beta_cdf(x):
    return 252*sum((-1)**k*math.comb(6,k)*float(x)**(k+3)/(k+3) for k in range(7))


def quantile(p, reliability=False):
    lo,hi=0.,1.
    for _ in range(70):
        mid=(lo+hi)/2
        cdf=1-beta_cdf(1-mid) if reliability else beta_cdf(mid)
        if cdf<p:lo=mid
        else:hi=mid
    return (lo+hi)/2


def density(output, prefix, kind='two', reliability=False, compact=False):
    apply_reltest_style()
    plt.rcParams['svg.hashsalt']='re3-confidence-density-2026-09-17'
    fig,ax=plt.subplots(figsize=(6.4,4.8) if compact else (8.5,5.6))
    fig.subplots_adjust(left=.13,right=.95,bottom=.26,top=.92)
    x=np.linspace(0,1,1401)
    pdf=lambda v:252*((1-v)**2*v**6 if reliability else v**2*(1-v)**6)
    y=pdf(x);maximum=float(y.max())
    variable='R' if reliability else 'F'
    ax.plot(x,y,color=C['ink'],lw=2.5,zorder=4)
    ax.set_xlim(0,1);ax.set_ylim(0,maximum*1.18)
    ax.set_xticks([]);ax.set_yticks([]);ax.grid(False)
    ax.set_ylabel(f'Dichte f({variable})',fontsize=20,labelpad=10)
    ax.text(1.01 if compact else 1.025,-.025,variable,transform=ax.transAxes,fontsize=20,ha='left',va='top',color=C['ink'])
    for side in ('top','right'):ax.spines[side].set_visible(False)
    for side in ('left','bottom'):ax.spines[side].set_color(C['ink']);ax.spines[side].set_linewidth(1.4)
    lower_p,upper_p={'two':(.05,.95),'left':(0,.9),'right':(.1,1)}[kind]
    lower=quantile(lower_p,reliability) if lower_p else 0
    upper=quantile(upper_p,reliability) if upper_p<1 else 1
    area_x=np.linspace(lower,upper,900)
    ax.fill_between(area_x,0,pdf(area_x),color=C['data'],alpha=.25,zorder=1).set_gid(prefix+'_area')
    region=[prefix+'_area'];values=[]
    for name,at,p in [('lower',lower,lower_p),('upper',upper,upper_p)]:
        if p in (0,1):continue
        ax.plot([at,at],[0,pdf(at)],color=C['data'],lw=2,zorder=5)[0].set_gid(prefix+'_'+name)
        suffix='u' if name=='lower' else 'o'
        formula_text(ax,at,-.05,rf'${variable}_{suffix}$',transform=ax.get_xaxis_transform(),ha='center',va='top',fontsize=21,color=C['ink']).set_gid(prefix+'_'+name+'_symbol')
        ax.text(at,-.18,f'{round(p*100)}-%-Grenze',transform=ax.get_xaxis_transform(),ha='center',va='top',fontsize=18,color=C['ink']).set_gid(prefix+'_'+name+'_quantile')
        region += [prefix+'_'+name,prefix+'_'+name+'_symbol']
        values += [prefix+'_'+name+'_quantile']
    center=quantile(.5,reliability)
    formula_text(ax,center,maximum*.35,r'$P_A=90\,\%$',fontsize=24 if not compact else 21,color=C['ink'],ha='center').set_gid(prefix+'_confidence')
    values.append(prefix+'_confidence')
    tails=[('left',lower/2,lower_p),('right',(upper+1)/2,1-upper_p)]
    for name,at,p in tails:
        if p<.001:continue
        ax.text(at,maximum*.65,f'{round(p*100)} %',ha='center',fontsize=18,color=C['muted']).set_gid(prefix+'_tail_'+name)
        values.append(prefix+'_tail_'+name)
    save(fig,output)
    animate_groups(output,{prefix+'_region':region,prefix+'_values':values})
    return {'kind':kind,'variable':variable,'model':'Beta(7,3) = 1-F' if reliability else 'Beta(3,7)','lower_quantile':lower_p,'upper_quantile':upper_p,'lower_coordinate':lower,'upper_coordinate':upper,'area':upper_p-lower_p}


def two_sided(folder):
    data=density(folder/'plots/two-sided-density.svg','two')
    write_data(folder,{'source':'RE3 Folie24–26.SVG','role':'Illustrative bounded skewed density, exact calculated quantiles; percentages are density quantiles, not failure-rate coordinate values','density':data})


def left_sided(folder):
    reference=density(folder/'plots/two-sided-reference.svg','left_reference')
    current=density(folder/'plots/left-sided-density.svg','left','left')
    write_data(folder,{'source':'RE3 Folie27–28.SVG','role':'Same bounded density and axes as scene24; left-sided 90% region and two-sided comparison','reference':reference,'current':current})


def right_sided(folder):
    reference=density(folder/'plots/two-sided-reference.svg','right_reference',compact=True)
    failure=density(folder/'plots/right-failure.svg','right_failure','right',compact=True)
    reliability=density(folder/'plots/right-reliability.svg','right_reliability','right',reliability=True,compact=True)
    write_data(folder,{'source':'RE3 Folie29–30.SVG','role':'Bounded 90% density areas; reliability R=1-F uses the mirrored density and its own 10% quantile, not a renamed F axis','reference':reference,'failure':failure,'reliability':reliability})


def write_data(folder, data):
    (folder/'data').mkdir(parents=True, exist_ok=True)
    (folder/'data/confidence-feedback.json').write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--scene', type=int, required=True)
    args=parser.parse_args()
    folder=ROOT/'rebuild-proposals/svg/RE3'/f'slide_{args.scene:03d}'
    {15:sample_population,17:meaning,20:drivers,23:surface,24:two_sided,27:left_sided,29:right_sided}[args.scene](folder)


if __name__ == '__main__':
    main()
