"""Series reliability versus component count; source contract RE4 source 065."""
from pathlib import Path
import json
import xml.etree.ElementTree as ET
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.text import Text, Annotation
from reltest_plot_style import apply_reltest_style, style_axes, save_figure, RELTEST_COLORS as C
from re3_feedback_plots import normalize_asset

ROOT = Path(__file__).resolve().parents[2]
VALUES = [.999, .995, .99, .95]

class FormulaText(Text):
    def draw(self, renderer):
        with matplotlib.rc_context({'svg.fonttype':'path'}):
            super().draw(renderer)

class FormulaAnnotation(Annotation):
    def draw(self, renderer):
        with matplotlib.rc_context({'svg.fonttype':'path'}):
            super().draw(renderer)

def generate(output_dir):
    output_dir = Path(output_dir)
    apply_reltest_style()
    plt.rcParams.update({'svg.hashsalt':'re4-series-component-count', 'mathtext.fontset':'stix', 'axes.labelweight':'normal'})
    fig, ax = plt.subplots(figsize=(7.4, 8.8))
    fig.subplots_adjust(left=.20, right=.96, bottom=.13, top=.97)
    ax.set_xlim(0,300)
    ax.set_ylim(0,100)
    ax.set_xticks(np.arange(0,301,50))
    ax.set_yticks(np.arange(0,101,20))
    ax.set_yticks(np.arange(10,100,20), minor=True)
    style_axes(ax, 'Anzahl der Komponenten n', r'Systemzuverlässigkeit $R_S(t)$ [%]')
    ax.yaxis.label.__class__=FormulaText
    ax.set_axisbelow(True)
    ax.tick_params(labelsize=18)
    n=np.arange(0,301)
    records=[]
    labels=['99,9 %','99,5 %','99 %','95 %']
    positions=[(185,91),(160,49),(115,34),(63,14)]
    anchor_n=[200,175,135,50]
    styles=['solid','dashed','dashdot','dotted']
    for r,label,color,pos,anchor,style in zip(VALUES,labels,[C['data'],C['support'],C['ink'],C['accent']],positions,anchor_n,styles):
        values=100*np.power(r,n)
        gid='reliability_'+str(r).replace('.','_')
        curve,=ax.plot(n,values,color=color,lw=2.3,ls=style)
        curve.set_gid(gid+'_curve')
        annotation=FormulaAnnotation(r'$R_B$ = '+label,xy=(anchor,100*r**anchor),xytext=pos,
            fontsize=18,color=C['ink'],ha='left',va='center',
            bbox={'facecolor':'white','edgecolor':'none','pad':2},
            arrowprops={'arrowstyle':'-','color':color,'linewidth':1.2})
        ax.add_artist(annotation)
        annotation.set_gid(gid+'_label')
        records.append({'component_reliability':r,'label':label,'n':n.tolist(),'system_reliability_percent':values.tolist()})
    output=output_dir/'plots/series-component-count.svg'
    save_figure(fig,output,transparent=True)
    plt.close(fig)
    normalize_asset(output,'series-component-count-plot')
    # Curve and its direct label are a single semantic unit for future narrated reuse.
    ns='{http://www.w3.org/2000/svg}'
    tree=ET.parse(output); root=tree.getroot()
    for r in VALUES:
        gid='reliability_'+str(r).replace('.','_')
        members=[e for e in root.iter() if e.get('id') in [gid+'_curve',gid+'_label']]
        parents={child:parent for parent in root.iter() for child in parent}
        group=ET.Element(ns+'g',{'id':gid,'data-anim-target':'true','data-anim-label':f'Bauteilzuverlässigkeit {r}'})
        parent=parents[members[0]]
        for member in members: parents[member].remove(member);group.append(member)
        parent.append(group)
    tree.write(output,encoding='unicode')
    data=output_dir/'data/series-component-count.json'; data.parent.mkdir(parents=True,exist_ok=True)
    data.write_text(json.dumps({'source':'RE4 source 065','formula':'R_S(t) = R_B(t)^n',
        'assumptions':['independent components','identical component reliability','series structure'],
        'x_limits':[0,300],'y_limits_percent':[0,100],'figure_inches':[7.4,8.8],
        'axes_width_height_ratio':(.76*7.4)/(.84*8.8),'series':records},indent=2)+'\n',encoding='utf-8')
    print(output)

if __name__=='__main__':
    generate(ROOT/'rebuild-proposals/svg/RE4/slide_065')
