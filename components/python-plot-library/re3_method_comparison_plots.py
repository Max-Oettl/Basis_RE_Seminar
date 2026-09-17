"""Source 43: reproducible illustrative least-squares and Weibull likelihood plots."""
from __future__ import annotations
import argparse
import json
import numpy as np
import matplotlib
from re3_feedback_plots import ROOT, C, save, plt, apply_reltest_style
from re3_confidence_feedback_plots import animate_groups, formula_text


def least_squares(folder):
    apply_reltest_style()
    x = np.array([1.1, 2.0, 3.2, 4.0, 5.8, 7.2])
    y = np.array([1.0, 1.4, 1.7, 4.1, 4.5, 4.8])
    m, c = np.polyfit(x, y, 1)
    fitted = m*x+c
    fig, ax = plt.subplots(figsize=(7.4, 4.0))
    fig.subplots_adjust(left=.19, right=.95, bottom=.18, top=.94)
    ax.set(xlim=(0, 8.3), ylim=(0, 6.1), xticks=[], yticks=[])
    ax.grid(False)
    ax.spines[['top', 'right']].set_visible(False)
    ax.set_facecolor('none')
    groups = {}
    def add(group, artist):
        gid = f'{group}_part_{len(groups.setdefault(group, []))}'
        artist.set_gid(gid)
        groups[group].append(gid)
    formula_text(ax, 8.25, -.67, r'$x(t)$', fontsize=19, ha='right', color=C['ink'])
    formula_text(ax, -.12, 6.15, r'$y(F)$', fontsize=19, ha='right', color=C['ink'])
    add('mls_points', ax.plot(x, y, 'o', ms=7, color=C['accent'], zorder=5)[0])
    add('mls_fit', ax.plot([0, 8], [c, m*8+c], color=C['ink'], lw=2.2)[0])
    add('mls_fit', formula_text(ax, 1.25, 5.55, r'$y(x(t)) = m\,x(t)+c$', fontsize=20, color=C['ink']))
    for xi, yi, fi in zip(x, y, fitted):
        add('mls_residuals', ax.plot([xi, xi], [yi, fi], color=C['data'], lw=2.2, zorder=4)[0])
    i = 3
    add('mls_residuals', ax.plot([0, x[i], x[i]], [y[i], y[i], 0], color=C['muted'], lw=1.0, ls=(0, (3, 4)))[0])
    add('mls_residuals', ax.plot([0, x[i]], [fitted[i], fitted[i]], color=C['muted'], lw=1.0, ls=(0, (3, 4)))[0])
    add('mls_residuals', ax.plot(x[i], fitted[i], 'o', ms=6, mfc='white', mec=C['data'], mew=1.6, zorder=6)[0])
    for xx, yy, value, ha in [(-.15, y[i]-.08, r'$y(F_i)$', 'right'),
                              (-.15, fitted[i]-.08, r'$y(x(t_i))$', 'right'),
                              (x[i], -.67, r'$x(t_i)$', 'center'),
                              (x[i]+.35, (y[i]+fitted[i])/2-.1, r'$r_i$', 'left')]:
        add('mls_residuals', formula_text(ax, xx, yy, value, fontsize=18, ha=ha, color=C['data'] if value==r'$r_i$' else C['ink']))
    output = folder/'plots'/'mls-regression.svg'
    save(fig, output)
    animate_groups(output, groups)
    residual = y-fitted
    assert abs(residual.sum()) < 1e-10 and abs(np.dot(x, residual)) < 1e-10
    return {'x_transformed': x.tolist(), 'y_transformed': y.tolist(), 'slope': float(m),
            'intercept': float(c), 'residual_sum_squares': float(residual@residual),
            'selected_observation': i+1, 'normal_equations_verified': True}


def likelihood(folder):
    apply_reltest_style()
    failures = np.array([8., 12., 17., 24., 31., 46.])
    censored = np.array([35., 50.])
    times = np.r_[failures, censored]
    d = len(failures)
    def score(b):
        weights = times**b
        return d/b + np.log(failures).sum() - d*np.dot(weights, np.log(times))/weights.sum()
    lo, hi = .1, 10.
    assert score(lo)>0 and score(hi)<0
    for _ in range(90):
        mid = (lo+hi)/2
        if score(mid)>0: lo=mid
        else: hi=mid
    b_opt = (lo+hi)/2
    t_opt = (np.sum(times**b_opt)/d)**(1/b_opt)
    def log_likelihood(t, b):
        return d*np.log(b)-d*b*np.log(t)+(b-1)*np.log(failures).sum()-np.sum((times/t[...,None])**b[...,None], axis=-1)
    ts = np.linspace(.65*t_opt, 1.5*t_opt, 29)
    bs = np.linspace(.48*b_opt, 1.8*b_opt, 27)
    tt, bb = np.meshgrid(ts, bs)
    zz = log_likelihood(tt, bb)
    maximum = float(log_likelihood(np.array(t_opt), np.array(b_opt)))
    floor = float(zz.min())-1.2
    fig = plt.figure(figsize=(7.4, 4.0))
    ax = fig.add_subplot(projection='3d')
    fig.subplots_adjust(left=.03, right=.95, bottom=.01, top=1.)
    ax.set_box_aspect((1.3, 1.05, .68), zoom=1.12)
    ax.view_init(elev=24, azim=-53)
    ax.set(xlim=(ts[0],ts[-1]), ylim=(bs[0],bs[-1]), zlim=(floor,maximum+1.8), xticks=[], yticks=[], zticks=[])
    ax.set_facecolor('none')
    for axis in [ax.xaxis, ax.yaxis, ax.zaxis]:
        axis.pane.fill=False
        axis.pane.set_edgecolor(C['grid_minor'])
        axis.pane.set_facecolor(C['grid_minor'])
        axis.line.set_color(C['ink'])
        axis.line.set_linewidth(1.1)
    ax.grid(False)
    groups={}
    def add(group, artist):
        gid=f'{group}_part_{len(groups.setdefault(group, []))}'
        artist.set_gid(gid); groups[group].append(gid)
    add('mle_surface', ax.plot_wireframe(tt, bb, zz, rstride=2, cstride=2, color=C['ink'], alpha=.45, linewidth=.7))
    ax.text(ts[0]-2.5, bs[0]-.12, floor, 'T', fontsize=19, ha='right', color=C['ink'])
    ax.text(ts[-1]+2.5, bs[-1], floor, 'b', fontsize=19, ha='left', color=C['ink'])
    # A horizontal mathematical label remains legible at lesson-player scale.
    formula_text(ax, .05, .89, r'$\ln L(T,b)$', transform=ax.transAxes, fontsize=20, color=C['ink'])
    add('mle_maximum', ax.plot([t_opt,t_opt], [b_opt,b_opt], [floor,maximum], color=C['data'], lw=2, ls=(0,(3,3)))[0])
    add('mle_maximum', ax.plot([t_opt,t_opt,ts[-1]], [bs[0],b_opt,b_opt], [floor,floor,floor], color=C['data'], lw=2, ls=(0,(3,3)))[0])
    add('mle_maximum', ax.plot([t_opt], [b_opt], [maximum], marker='o', ms=8, color=C['data'])[0])
    add('mle_maximum', ax.text(t_opt, b_opt, maximum+1.1, 'Maximum', fontsize=18, ha='center', color=C['data'], weight='bold'))
    add('mle_maximum', ax.text(t_opt, bs[0]-.12, floor-.6, r'$T_{\mathrm{opt}}$', fontsize=18, ha='center', va='top', color=C['data']))
    add('mle_maximum', ax.text(ts[-1]+2.5, b_opt, floor-.6, r'$b_{\mathrm{opt}}$', fontsize=18, ha='left', va='top', color=C['data']))
    output=folder/'plots'/'mle-likelihood.svg'
    with matplotlib.rc_context({'svg.fonttype':'path'}):
        save(fig, output)
    animate_groups(output, groups)
    nearby=[float(log_likelihood(np.array(t_opt*dt),np.array(b_opt*db))) for dt,db in [(.99,1),(1.01,1),(1,.99),(1,1.01)]]
    assert abs(score(b_opt))<1e-10 and all(v<maximum for v in nearby)
    return {'failures':failures.tolist(), 'right_censored':censored.tolist(), 'T_opt':float(t_opt),
            'b_opt':float(b_opt), 'log_likelihood_max':maximum, 'profile_score':float(score(b_opt)),
            'nearby_log_likelihoods':nearby, 'local_maximum_verified':True,
            'formula':'d ln(b) - d b ln(T) + (b-1) sum_fail ln(t) - sum_all (t/T)^b'}


def objective(folder, name, expression):
    fig, ax=plt.subplots(figsize=(7.4,.68))
    ax.set_axis_off()
    formula_text(ax,.5,.45,expression,transform=ax.transAxes,fontsize=26,ha='center',va='center',color=C['ink'])
    save(fig,folder/'plots'/name)


def main():
    parser=argparse.ArgumentParser(); parser.add_argument('--scene',type=int,default=43); args=parser.parse_args()
    if args.scene!=43: raise ValueError('This generator implements scene 43 only.')
    folder=ROOT/'rebuild-proposals/svg/RE3/slide_043'
    data={'role':'illustrative_models_not_observed_seminar_data', 'source_slide':43,
          'mls':least_squares(folder),'mle':likelihood(folder)}
    objective(folder,'mls-objective.svg',r'$\sum_i r_i^{\,2}\;\longrightarrow\;\min$')
    objective(folder,'mle-objective.svg',r'$\ln L(T,b)\;\longrightarrow\;\max$')
    (folder/'data').mkdir(parents=True,exist_ok=True)
    (folder/'data'/'method-comparison.json').write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')


if __name__=='__main__': main()
