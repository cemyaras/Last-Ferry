import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
const output=mkdtempSync(join(tmpdir(),'son-vapur-movement-'));
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','--target','ES2022','--module','commonjs','--skipLibCheck','--outDir',output,'src/entities/movement.ts','src/scenes/ferryConfig.ts','src/scenes/karakoyConfig.ts','src/scenes/galataBridgeConfig.ts','src/scenes/eminonuConfig.ts','src/systems/FerryJourney.ts','src/story/lines.ts']);
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

const {STREET_BOUNDS,STREET_OBSTACLES,STREET_LOOKS,ARRIVAL_PATH,KARAKOY,BRIDGE_EXIT}=require(join(output,'scenes/karakoyConfig.js'));
test('Karaköy arrival walk leaves the terminal door through open ground and ends at the lane spawn',()=>{
 const last=ARRIVAL_PATH.at(-1);
 assert.deepEqual(last,{x:KARAKOY.startX,y:KARAKOY.startY});
 for(let i=1;i<ARRIVAL_PATH.length;i++){
  const a=ARRIVAL_PATH[i-1],b=ARRIVAL_PATH[i];
  for(let t=0;t<=1;t+=.02){
   const x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;
   assert.ok(x>=STREET_BOUNDS.minX&&x<=STREET_BOUNDS.maxX&&y>=STREET_BOUNDS.minY&&y<=STREET_BOUNDS.maxY);
   for(const o of STREET_OBSTACLES)assert.ok(!(x>o.left-FOOTPRINT.halfWidth&&x<o.right+FOOTPRINT.halfWidth&&y>o.top-FOOTPRINT.halfDepth&&y<o.bottom+FOOTPRINT.halfDepth),o.id);
  }
 }
});
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

test('Karaköy lane end leads to the bridge without catching the ferry arrival walk',()=>{
 const end=moveOnPromenade(220,600,-400,0,STREET_OBSTACLES,STREET_BOUNDS);
 assert.equal(end.x,STREET_BOUNDS.minX);
 assert.ok(Math.hypot(end.x-BRIDGE_EXIT.x,end.y-BRIDGE_EXIT.y)<BRIDGE_EXIT.radius);
 for(const p of ARRIVAL_PATH)assert.ok(Math.hypot(p.x-BRIDGE_EXIT.x,p.y-BRIDGE_EXIT.y)>BRIDGE_EXIT.radius);
});
const {BRIDGE,BRIDGE_BOUNDS,BRIDGE_OBSTACLES,BRIDGE_LOOKS,STAIRS}=require(join(output,'scenes/galataBridgeConfig.js'));
test('Galata Bridge stays bounded, footprints are solid and all three looks are reachable',()=>{
 const move=(x,y,dx,dy)=>moveOnPromenade(x,y,dx,dy,BRIDGE_OBSTACLES,BRIDGE_BOUNDS);
 assert.equal(move(1000,600,0,-1000).y,BRIDGE_BOUNDS.minY);
 assert.equal(move(1000,600,0,1000).y,BRIDGE_BOUNDS.maxY);
 assert.equal(move(1800,600,10000,0).x,BRIDGE_BOUNDS.maxX);
 assert.equal(move(1800,570,-10000,0).x,BRIDGE_BOUNDS.minX);
 for(const box of BRIDGE_OBSTACLES.filter(b=>(b.left+b.right)/2>=BRIDGE_BOUNDS.minX&&b.id!=='stairwell')){
  const x=(box.left+box.right)/2;
  assert.ok(move(x,625,0,-500).y>=Math.max(BRIDGE_BOUNDS.minY,box.bottom+FOOTPRINT.halfDepth),box.id);
 }
 for(const point of BRIDGE_LOOKS){const near=move(point.x,600,0,-200);assert.ok(Math.hypot(near.x-point.x,near.y-point.y)<point.radius,point.id);}
 assert.equal(move(600,530,200,0).x,800,'behind the fisherman standing back from the rail');
 assert.equal(move(600,600,200,0).x,800,'in front of him');
 assert.equal(move(260,530,100,0).x,306-FOOTPRINT.halfWidth,'the fisherman at the rail blocks the rail edge');
 assert.equal(move(1240,600,0,-100).y,552,'bench');
});
test('Bridge walk-in starts beyond the Karaköy edge and crosses open walkway',()=>{
 assert.ok(BRIDGE.entryX>BRIDGE_BOUNDS.maxX&&BRIDGE.startX<=BRIDGE_BOUNDS.maxX);
 for(let x=BRIDGE.startX;x<=BRIDGE.entryX;x+=2)for(const o of BRIDGE_OBSTACLES)
  assert.ok(!(x>o.left-FOOTPRINT.halfWidth&&x<o.right+FOOTPRINT.halfWidth&&BRIDGE.startY>o.top-FOOTPRINT.halfDepth&&BRIDGE.startY<o.bottom+FOOTPRINT.halfDepth),o.id);
});

const story=require(join(output,'story/lines.js'));
test('every story line fits on one screen line and every beat is short',()=>{
 const lines=[...Object.values(story.LOOKS),...Object.values(story.FERRY_LINES)];
 for(const beat of Object.values(story.BEATS))for(const seen of [false,true]){const sequence=beat(seen);assert.ok(sequence.length>=1&&sequence.length<=3);lines.push(...sequence);}
 for(const line of lines)assert.ok(line.length<=72,line);
 assert.ok(Object.values(story.STORY_TIMES).every(time=>/^\d\d:\d\d$/.test(time)));
});

test('Bridge stairs: solid opening, reachable top step, open walkway behind, descent below the kerb lip',()=>{
 const move=(x,y,dx,dy)=>moveOnPromenade(x,y,dx,dy,BRIDGE_OBSTACLES,BRIDGE_BOUNDS);
 const top=move(520,614,-300,0);
 assert.equal(top.x,STAIRS.right+FOOTPRINT.halfWidth);
 assert.ok(Math.hypot(top.x-STAIRS.entry.x,top.y-STAIRS.entry.y)<STAIRS.entry.radius);
 assert.equal(move(520,570,-400,0).x,BRIDGE_BOUNDS.minX);
 assert.equal(move(330,580,0,100).y,STAIRS.back-FOOTPRINT.halfDepth,'no way into the opening from behind');
 assert.equal(STAIRS.path[0].x,STAIRS.entry.x-10);
 assert.ok(STAIRS.path.at(-1).y>STAIRS.lip+40&&STAIRS.path.at(-1).x>STAIRS.left);
 for(let i=1;i<STAIRS.path.length;i++){assert.ok(STAIRS.path[i].x<STAIRS.path[i-1].x);assert.ok(STAIRS.path[i].y>=STAIRS.path[i-1].y);}
});
const eminonu=require(join(output,'scenes/eminonuConfig.js'));
const {withinBoardingReach}=require(join(output,'scenes/boardingConfig.js'));
test('Eminönü quay: bounds, solid props, the stair exit, the bench wait, Ay and the gangway are all reachable',()=>{
 const {EMINONU_BOUNDS:B,EMINONU_OBSTACLES:O,EMINONU_STAIRS:S,EMINONU_LOOKS:L,EMINONU_BOARDING:G,AY,ayBox,simitciBox,gorevliBox}=eminonu;
 const dawn=[...O,ayBox(),simitciBox(),gorevliBox()];
 const move=(x,y,dx,dy,obstacles=O)=>moveOnPromenade(x,y,dx,dy,obstacles,B);
 assert.equal(move(900,600,0,-1000).y,B.minY);assert.equal(move(900,600,0,1000).y,B.maxY);
 assert.equal(move(900,580,-10000,0).x,B.minX);assert.equal(move(1700,600,10000,0).x,B.maxX);
 for(const box of O.filter(b=>b.id!=='stairwell')){const x=Math.max(B.minX,Math.min(B.maxX,(box.left+box.right)/2));assert.ok(move(x,625,0,-500).y>=Math.max(B.minY,box.bottom+FOOTPRINT.halfDepth),box.id);}
 assert.equal(move(320,610,-300,0).x,S.right+FOOTPRINT.halfWidth,'stairwell is solid from the quay');
 const top=S.path.at(-1);
 for(const box of dawn)assert.ok(!(top.x>box.left-11&&top.x<box.right+11&&top.y>box.top-4&&top.y<box.bottom+4),box.id);
 for(let i=1;i<S.path.length;i++){assert.ok(S.path[i].x>S.path[i-1].x);assert.ok(S.path[i].y<=S.path[i-1].y);}
 assert.ok(S.path[0].y>S.lip+40);
 const bench=move(L.wait.x,620,0,-200);assert.ok(Math.hypot(bench.x-L.wait.x,bench.y-L.wait.y)<L.wait.radius);
 const boat=move(L.boat.x,620,0,-200);assert.ok(Math.hypot(boat.x-L.boat.x,boat.y-L.boat.y)<L.boat.radius);
 const ay=move(L.pickUp.x,620,0,-200,dawn);assert.ok(Math.hypot(ay.x-L.pickUp.x,ay.y-L.pickUp.y)<L.pickUp.radius);
 assert.ok(Math.hypot(ay.x-AY.x,ay.y-AY.y)<AY.revealRange);
 assert.ok(withinBoardingReach(G.gateX,G.approachY,G)&&!withinBoardingReach(G.gateX,G.approachY));
 assert.equal(eminonu.clockText(eminonu.WAIT_MINUTES.from),'01:35');assert.equal(eminonu.clockText(eminonu.WAIT_MINUTES.to),'05:50');
});
