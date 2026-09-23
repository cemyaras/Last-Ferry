import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
const output=mkdtempSync(join(tmpdir(),'son-vapur-movement-'));
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','--target','ES2022','--module','commonjs','--skipLibCheck','--outDir',output,'src/entities/movement.ts','src/scenes/ferryConfig.ts','src/scenes/karakoyConfig.ts','src/systems/FerryJourney.ts']);
const require=createRequire(import.meta.url);
const {moveOnPromenade, movementTarget}=require(join(output,'entities/movement.js'));
const {OBSTACLES,PIER_OBJECTS,WALK_AREA,FOOTPRINT,promenadeDepth}=require(join(output,'scenes/promenade.js'));

test('depth movement is slower and all diagonal directions stay normalized',()=>{
 assert.equal(movementTarget(0,1).y,55);
 for(const x of [-1,0,1])for(const y of [-1,0,1]){
  const v=movementTarget(x,y);
  assert.ok(Math.hypot(v.x,v.y)<=105+1e-9);
  assert.ok((v.x/105)**2+(v.y/55)**2<=1+1e-9);
 }
});
test('promenade and rail edges prevent entering water or foreground equipment',()=>{
 assert.equal(moveOnPromenade(620,582,0,-10000).y,WALK_AREA.minY);
 assert.equal(moveOnPromenade(620,582,0,10000).y,WALK_AREA.maxY);
 assert.equal(moveOnPromenade(620,582,-10000,0).x,WALK_AREA.minX);
 assert.equal(moveOnPromenade(620,582,10000,0).x,WALK_AREA.maxX);
});
test('terminal and every solid object block approach from the promenade',()=>{
 for(const box of OBSTACLES){
  const x=Math.max(WALK_AREA.minX,Math.min(WALK_AREA.maxX,(box.left+box.right)/2));
  const moved=moveOnPromenade(x,600,0,-1000);
  assert.ok(moved.y>=Math.max(WALK_AREA.minY,box.bottom+FOOTPRINT.halfDepth),box.id);
  assert.ok(moved.blockedY,box.id);
 }
});
test('bench can be passed behind or in front, never through its footprint',()=>{
 const bench=PIER_OBJECTS.find(o=>o.id==='bench-0').footprint;
 assert.equal(moveOnPromenade(770,522,200,0).x,970);
 assert.equal(moveOnPromenade(770,580,200,0).x,970);
 assert.equal(moveOnPromenade(770,539,200,0).x,bench.left-FOOTPRINT.halfWidth);
 assert.equal(moveOnPromenade(970,539,-200,0).x,bench.right+FOOTPRINT.halfWidth);
 assert.equal(moveOnPromenade(866,522,0,100).y,bench.top-FOOTPRINT.halfDepth);
 assert.equal(moveOnPromenade(866,600,0,-100).y,bench.bottom+FOOTPRINT.halfDepth);
});
test('swept movement cannot tunnel through thin footprints with large steps',()=>{
 for(const {footprint:b} of PIER_OBJECTS){
  const y=(b.top+b.bottom)/2;
  const moved=moveOnPromenade(b.left-30,y,300,0,[b]);
  assert.equal(moved.x,b.left-FOOTPRINT.halfWidth,b.id);
 }
});
test('contact permits tangent sliding and moving away without sticking',()=>{
 const x=813-FOOTPRINT.halfWidth;
 const slide=moveOnPromenade(x,539,4,8);
 assert.equal(slide.x,x);assert.equal(slide.y,547);
 const away=moveOnPromenade(x,539,-5,0);
 assert.equal(away.x,x-5);
});
test('walking routes never penetrate solids, including at obstacle corners',()=>{
 let x=617,y=582;let seed=847;
 for(let i=0;i<15000;i++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const v=movementTarget((seed%3)-1,((seed>>>8)%3)-1);
  ({x,y}=moveOnPromenade(x,y,v.x*.05,v.y*.05));
  for(const b of OBSTACLES)assert.ok(!(x>b.left-11+1e-8&&x<b.right+11-1e-8&&y>b.top-4+1e-8&&y<b.bottom+4-1e-8),b.id);
 }
});
test('render depth changes across the same furniture footprint',()=>{
 for(const o of PIER_OBJECTS){
  assert.ok(promenadeDepth(o.footprint.top-5)<promenadeDepth(o.sortY),o.id);
  assert.ok(promenadeDepth(o.footprint.bottom+5)>promenadeDepth(o.sortY),o.id);
 }
});

const {DECK_BOUNDS,DECK_OBSTACLES}=require(join(output,'scenes/ferryConfig.js'));
test('ferry deck stays bounded and every prop blocks approach',()=>{
 const move=(x,y,dx,dy)=>moveOnPromenade(x,y,dx,dy,DECK_OBSTACLES,DECK_BOUNDS);
 assert.equal(move(800,600,0,-1000).y,DECK_BOUNDS.minY);
 assert.equal(move(800,600,0,1000).y,DECK_BOUNDS.maxY);
 assert.equal(move(800,610,10000,0).x,DECK_BOUNDS.maxX);
 assert.equal(move(800,610,-10000,0).x,DECK_BOUNDS.minX);
 for(const box of DECK_OBSTACLES){
  const x=Math.max(DECK_BOUNDS.minX,Math.min(DECK_BOUNDS.maxX,(box.left+box.right)/2));
  assert.ok(move(x,625,0,-500).y>=Math.max(DECK_BOUNDS.minY,box.bottom+4),box.id);
 }
});

const {STREET_BOUNDS,STREET_OBSTACLES,STREET_LOOKS}=require(join(output,'scenes/karakoyConfig.js'));
test('Karaköy route, three observations and closed uphill boundary stay accessible and solid',()=>{
 const move=(x,y,dx,dy)=>moveOnPromenade(x,y,dx,dy,STREET_OBSTACLES,STREET_BOUNDS);
 let p={x:220,y:592};
 for(let i=0;i<320;i++)p=move(p.x,p.y,5,0);
 assert.equal(p.x,STREET_BOUNDS.maxX);
 assert.equal(move(p.x,p.y,100,0).x,STREET_BOUNDS.maxX);
 for(const point of STREET_LOOKS){const near=move(point.x,592,0,-100);assert.ok(Math.hypot(near.x-point.x,near.y-point.y)<point.radius);}
 for(const box of STREET_OBSTACLES.filter(b=>b.id!=='closed-end')){
  const x=(box.left+box.right)/2;
  assert.ok(move(x,630,0,-500).y>=box.bottom+4,box.id);
 }
 assert.equal(move(1620,592,0,-200).y,530);
 assert.equal(move(1080,565,170,0).x,1116);
 assert.equal(move(1080,600,170,0).x,1250);
});
const {FerryJourney}=require(join(output,'systems/FerryJourney.js'));
test('ferry allows exploration, eases into port, docks and never skips on resume',()=>{
 const trip=new FerryJourney();
 for(let i=0;i<590;i++)trip.update(.05);
 assert.equal(trip.phase,'cruising');assert.equal(trip.approach,0);assert.equal(trip.arrived,false);
 trip.update(10000);assert.ok(trip.elapsed<30); // background-tab stalls cannot teleport to port
 let speed=trip.speed,distance=trip.distance;
 while(trip.elapsed<44){trip.update(.05);assert.ok(trip.speed<=speed+1e-8);assert.ok(trip.distance>=distance);speed=trip.speed;distance=trip.distance;}
 assert.equal(trip.phase,'docking');assert.equal(trip.arrived,false);assert.equal(trip.speed,0);
 while(trip.elapsed<48)trip.update(.05);
 assert.equal(trip.phase,'moored');assert.equal(trip.arrived,true);
 const docked=trip.distance;for(let i=0;i<100;i++)trip.update(.05);assert.equal(trip.distance,docked);
 const sixty=new FerryJourney();for(let i=0;i<48*60+1;i++)sixty.update(1/60);
 assert.equal(sixty.phase,'moored');assert.ok(Math.abs(sixty.distance-trip.distance)<1e-8);
});
