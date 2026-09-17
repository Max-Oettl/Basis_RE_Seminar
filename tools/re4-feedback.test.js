"use strict";
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const selected=[1,5,7,13,17,21,23,25,31,33,39,41,44,48,55,58];
const file=(n,name)=>path.join(root,'rebuild-proposals/svg/RE4',`slide_${String(n).padStart(3,'0')}`,name);
const svg=n=>fs.readFileSync(file(n,`slide_${String(n).padStart(3,'0')}.svg`),'utf8');
test('same source fault-tree topology is preserved through 13, 17, 21 and its complement in 25',()=>{
  const expected={system:['torque','leak'],torque:['input','output','flow','more'],leak:['static','dynamic'],input:['fracture','jam'],fracture:['fatigue','material'],flow:['flow_base'],static:['static_base'],dynamic:['wear','thermal']};
  for(const n of [13,17,21,25]){const actual={};for(const m of svg(n).matchAll(/data-gate-parent="([^"]+)" data-gate-kind="([^"]+)" data-child-ids="([^"]+)"/g)){actual[m[1]]=m[3].split(' ');assert.equal(m[2],n===25?'AND':'OR');}assert.deepEqual(actual,expected,`scene ${n}`);}
});

test('component-count plot preserves source extent, probabilities and series multiplication',()=>{
  const data=JSON.parse(fs.readFileSync(file(65,'data/series-component-count.json')));
  assert.deepEqual(data.x_limits,[0,300]);
  assert.deepEqual(data.y_limits_percent,[0,100]);
  assert.ok(data.axes_width_height_ratio<1,'source portrait aspect');
  assert.deepEqual(data.series.map(s=>s.component_reliability),[.999,.995,.99,.95]);
  for(const series of data.series){
    assert.equal(series.n.length,301);
    assert.equal(series.system_reliability_percent[0],100);
    for(let i=1;i<301;i++){
      assert.ok(series.system_reliability_percent[i]<series.system_reliability_percent[i-1]);
      assert.ok(Math.abs(series.system_reliability_percent[i]-100*series.component_reliability**i)<1e-10);
    }
  }
});

test('separation formula matches the five-component network state probabilities',()=>{
  for(const r of [[.9,.9,.9,.9,.9],[.4,.7,.8,.3,.6],[1,0,0,1,.2],[.1,.2,.3,.4,0],[.1,.2,.3,.4,1]]){
    let exhaustive=0;
    for(let mask=0;mask<32;mask++){
      const w=n=>Boolean(mask&(1<<(n-1)));
      if((w(1)&&w(3))||(w(2)&&w(4))||(w(1)&&w(5)&&w(4))||(w(2)&&w(5)&&w(3)))
        exhaustive+=r.reduce((p,ri,i)=>p*(w(i+1)?ri:1-ri),1);
    }
    const [a,b,c,d,e]=r;
    const separated=e*(1-(1-a)*(1-b))*(1-(1-c)*(1-d))+(1-e)*(1-(1-a*c)*(1-b*d));
    assert.ok(Math.abs(separated-exhaustive)<1e-12);
  }
});
test('six source probabilities and their leaf identities are unchanged',()=>{
  const s=svg(17);for(const [id,p] of Object.entries({fatigue:'2 %',material:'0,1 %',flow_base:'1 %',static_base:'0 %',wear:'1 %',thermal:'1 %'})){const group=s.match(new RegExp('<g id="basis_value_'+id+'"[\\s\\S]*?</g>'))?.[0];assert.ok(group?.includes('≈ '+p),id);}
  assert.ok(svg(7).match(/id="aggregation_gears"[\s\S]*?R ≈ 99 %/));
});
test('RE4 scene 5 reuses both accepted RE3 scene 15 assets byte for byte',()=>{
  for(const name of ['sample-fit.svg','population-confidence.svg']){const original=fs.readFileSync(path.join(root,'rebuild-proposals/svg/RE3/slide_015/plots',name));const reused=fs.readFileSync(file(5,'plots/'+name));assert.equal(crypto.createHash('sha256').update(original).digest('hex'),crypto.createHash('sha256').update(reused).digest('hex'));}
});
test('narration partition loses no words and every cue remains unique and ordered',()=>{
  const map=require('../analysis/inventories/RE4_svg-text-map.json'),plan=require('../analysis/rebuild-plans/RE4_scene-plan.json');const clean=s=>s.replace(/\s+/g,' ').trim();
  for(const group of [[1,5,7],[21,23,25],[31,33,39,41,44]])assert.equal(clean(group.map(n=>plan.scenes.find(s=>s.output_slide_number===n).spoken_text).join(' ')),clean(map.mappings.find(m=>m.source_slide_number===group[0]).spoken_text));
  for(const n of selected){const narration=plan.scenes.find(s=>s.output_slide_number===n).spoken_text;const m=JSON.parse(fs.readFileSync(file(n,'scene.animation.v1.json')));let last=-1;for(const step of m.steps){const index=narration.indexOf(step.sourceText);assert.ok(index>=last&&index>=0,`${n}: ${step.sourceText}`);assert.equal(index,narration.lastIndexOf(step.sourceText));last=index;}}
});
test('both De Morgan pairs map to the corresponding RBD structures',()=>{
  for(const n of [23,25,44]){const s=svg(n);for(const gate of ['OR','AND'])for(const polarity of ['failure','function'])assert.ok(s.includes(`data-logic="${gate}" data-event-polarity="${polarity}"`));}
  for(const type of ['series','parallel'])assert.ok(svg(25).includes(`data-rbd-structure="${type}"`));
  assert.doesNotMatch(svg(25),/≥1ODER|&amp;UND/);
});

test('the five-component bridge implements all four minimal working paths over all 32 states',()=>{
  const edges=[...svg(48).matchAll(/data-component="(\d)" data-from="([^"]+)" data-to="([^"]+)"/g)].map(m=>({component:Number(m[1]),from:m[2],to:m[3]}));
  assert.equal(edges.length,5);
  assert.equal(new Set(edges.map(e=>e.component)).size,5);
  for(let mask=0;mask<32;mask++){
    const works=n=>Boolean(mask&(1<<(n-1)));
    const visited=new Set(['E']);let changed=true;
    while(changed){changed=false;for(const e of edges){if(!works(e.component))continue;if(visited.has(e.from)&&!visited.has(e.to)){visited.add(e.to);changed=true;}if(visited.has(e.to)&&!visited.has(e.from)){visited.add(e.from);changed=true;}}}
    const expected=(works(1)&&works(3))||(works(2)&&works(4))||(works(1)&&works(5)&&works(4))||(works(2)&&works(5)&&works(3));
    assert.equal(visited.has('A'),expected,`component state ${mask.toString(2).padStart(5,'0')}`);
  }
});
