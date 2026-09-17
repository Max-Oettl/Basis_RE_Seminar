"""Run the static or animation review phase for exactly one RE1 scene."""
import argparse
import json
import subprocess
import sys
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
REVIEW=ROOT/'analysis/render-checks/RE1/redesign-2026-09-17'
def run(args):
    r=subprocess.run(args,cwd=ROOT,capture_output=True,text=True,encoding='utf-8',errors='replace')
    print(r.stdout.strip(),flush=True)
    if r.returncode:print(r.stderr);raise SystemExit(r.returncode)
def sheet(paths,out,columns=3):
    columns=min(columns,len(paths));rows=(len(paths)+columns-1)//columns
    im=Image.new('RGB',(640*columns,390*rows),'#eef0f5');d=ImageDraw.Draw(im)
    for i,p in enumerate(paths):
        pic=Image.open(p).convert('RGB');pic.thumbnail((640,360));x=i%columns*640;y=i//columns*390
        im.paste(pic,(x,y+26));d.text((x+12,y+7),p.stem[:75],fill='#142452')
    im.save(out)
if __name__=='__main__':
    sys.stdout.reconfigure(encoding='utf-8');p=argparse.ArgumentParser();p.add_argument('--slide',type=int,required=True);p.add_argument('--phase',choices=['static','states'],required=True);a=p.parse_args();n=a.slide;name=f'slide_{n:03}'
    if a.phase=='static':
        run([sys.executable,'tools/redesign-re1-scenes.py','--slide',str(n)])
        run([sys.executable,'tools/verify-re1-redesign.py','--slide',str(n)])
        run(['node','tools/render-svg-previews.js','--module','RE1','--slides',str(n),'--output-dir',str(REVIEW/'after')])
    else:
        run(['node','tools/svg-rebuild-qa.js',str(ROOT/'rebuild-proposals/svg/RE1'/name),'--strict-design','--layout','--layout-strict','--report-dir',str(REVIEW/f'qa-{n:03}')])
        run(['node','tools/render-svg-animation-states.js','--module','RE1','--slides',str(n),'--output-dir',str(REVIEW/'states'),'--sample-highlights','true'])
        frames=sorted((REVIEW/'states'/name).glob('*.png'));sheet(frames,REVIEW/'after'/f'{name}-states.png')
        print(f'{name}: {len(frames)} states rendered',flush=True)
