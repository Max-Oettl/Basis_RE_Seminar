"use strict";
const fs=require('node:fs');
const path=require('node:path');
const test=require('node:test');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../rebuild-proposals/svg/RE3');
const folder=n=>path.join(root,`slide_${String(n).padStart(3,'0')}`);
const data=n=>JSON.parse(fs.readFileSync(path.join(folder(n),'data/object-time.json'),'utf8'));

test('censoring comparisons retain the source object identities and stopping rules',()=>{
 const complete=data(34).plots[0];
 const order=complete.times.map((t,i)=>({t,obj:i+1})).sort((a,b)=>a.t-b.t).map(x=>x.obj);
 assert.deepEqual(order,[2,5,1,6,3,4]);
 const typeOne=data(35).plots[0], [one,two]=data(36).plots;
 assert.deepEqual(typeOne.times,one.times);
 assert.equal(one.times[2],one.times[3]);
 assert.ok([0,1,4,5].every(i=>one.times[i]<one.times[2]));
 assert.equal(two.times[5],two.times[2]);
 assert.equal(two.times[5],two.times[3]);
 const views=data(39).plots;
 for(const view of views){
   assert.deepEqual(view.times,views[0].times);
   assert.deepEqual(view.mechanisms,['B','A','B','B','A','A']);
 }
 for(const n of [34,35,36,38,39,42]){
   assert.deepEqual(data(n).common_axes,{x:[0,100],y:[0,6.6],objects_bottom_to_top:[1,2,3,4,5,6],origin:0});
 }
});

test('blue censoring arrows and interval marks stay inside their semantic animation groups',()=>{
 let checked=0;
 for(const n of [35,36,38,39,42]) for(const plot of data(n).plots){
   const source=fs.readFileSync(path.join(folder(n),'plots',plot.file),'utf8');
   const stack=[];
   for(const match of source.matchAll(/<\/?[A-Za-z][^>]*>/g)){
     const tag=match[0];
     if(tag.startsWith('</')){stack.pop();continue;}
     if(/^<(?:path|use)\b/.test(tag)&&/#0c84b4/i.test(tag)){
       checked++;
       assert.ok(stack.some(parent=>/data-anim-target="true"/.test(parent)),`${n}/${plot.file}: detached blue marker`);
     }
     if(!tag.endsWith('/>'))stack.push(tag);
   }
 }
 assert.ok(checked>20,'Censoring/interval geometry was actually inspected.');
});
