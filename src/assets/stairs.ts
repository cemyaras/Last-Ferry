import Phaser from 'phaser';
import {texture,polygon,line,label} from '../utils/drawing';
import {promenadeDepth} from '../scenes/promenade';

export interface StairwellLayout{left:number;right:number;back:number;lip:number;}
/** A stair opening in the walkway beside its near edge, descending to the left from its top step at the right.
 * The near lip is drawn above actors, so anyone walking the stair disappears below it. */
export function createStairwell(scene:Phaser.Scene,prefix:string,{left:L,right:R,back:BK,lip:LP}:StairwellLayout,edge:'kerb'|'quay',sign?:readonly [string,string]){
 const ox=L-12,oy=BK-14;
 texture(scene,`${prefix}-stairwell`,R-L+30,90,c=>{
  c.translate(-ox,-oy);
  polygon(c,[[L,BK],[R,BK],[R+2,LP+4],[L-2,LP+4]],'#050d13');
  // Each tread sinks a little further below the walkway; the lip hides their front ends.
  const steps=10,run=(R-L)/steps,hex=(v:number)=>Math.round(v).toString(16).padStart(2,'0');
  for(let i=0;i<steps;i++){
   const x1=R-i*run,x0=x1-run,top=BK+3+i*6.2;
   c.fillStyle=`#${hex(52-i*3.6)}${hex(66-i*4.2)}${hex(70-i*4.4)}`;c.fillRect(x0,top,run+.6,LP+4-top);
   line(c,x0,top,x1,top,'#8e9b9460',1);line(c,x0,top,x0,LP+4,'#03090d',1.4);
  }
  line(c,L,BK,R,BK,'#93a09a70',2);line(c,L,BK+2,R,BK+2,'#0a141c',2);
  // Handrail along the inner wall, following the stair down.
  line(c,R+2,BK-2,L+6,BK+52,'#8a9a93',1.6);for(let i=0;i<4;i++){const x=R-6-i*44,y=BK-2+(R+2-x)*.33;line(c,x,y,x,y+12,'#61736d',1.2);}
 });
 scene.add.image(ox,oy,`${prefix}-stairwell`).setOrigin(0).setDepth(10.15);
 texture(scene,`${prefix}-stairguard`,R-L+40,64,c=>{
  // Low guard rail along the back edge and the far end, with a post for the plate at the entrance corner.
  c.translate(-(L-14),-(BK-58));
  for(let x=L;x<=R;x+=40){line(c,x,BK-26,x,BK+1,'#0d1c25',3);line(c,x+1,BK-25,x+1,BK,'#61737650',1);}
  line(c,L,BK-26,R,BK-26,'#0d1c25',4);line(c,L,BK-28,R,BK-28,'#8d9b9670',1.2);line(c,L,BK-13,R,BK-13,'#13262f',2);
  line(c,L-2,BK-26,L-9,BK-8,'#0d1c25',3);
  if(sign)line(c,R+4,BK-56,R+4,BK+1,'#0b1a22',3);
 });
 scene.add.image(L-14,BK-58,`${prefix}-stairguard`).setOrigin(0).setDepth(promenadeDepth(BK)).setName('stair-guard');
 if(sign){
  texture(scene,`${prefix}-stairsign`,98,26,c=>{
   c.fillStyle='#14303a';c.fillRect(1,1,96,24);c.strokeStyle='#6f8277';c.strokeRect(1.5,1.5,95,23);
   label(c,sign[0],8,12,8,'#cdc7a6','sans-serif',.8);label(c,sign[1],8,22,8,'#95a79f','sans-serif',1.2);
  });
  scene.add.image(R+4,BK-60,`${prefix}-stairsign`).setOrigin(.93,1).setDepth(promenadeDepth(BK)+.001);
 }
 texture(scene,`${prefix}-stairlip`,R-L+24,74,c=>{
  c.translate(-(L-12),-LP);
  if(edge==='kerb'){
   // The kerb stone in front of the opening, with the road beyond.
   c.fillStyle='#1a2830';c.fillRect(L-12,LP,R-L+24,4);
   c.fillStyle='#394649';c.fillRect(L-12,LP+4,R-L+24,14);line(c,L-12,LP+4,R+12,LP+4,'#93a09a55',2);line(c,L-12,LP+18,R+12,LP+18,'#0a141c',3);
   c.fillStyle='#131f28';c.fillRect(L-12,LP+19,R-L+24,55);
  }else{
   // A worn stone edge, then the same dark quay paving as far as the foreground edge.
   c.fillStyle='#3a484b';c.fillRect(L-12,LP,R-L+24,6);line(c,L-12,LP,R+12,LP,'#93a09a50',1.5);
   const g=c.createLinearGradient(0,LP+6,0,LP+74);g.addColorStop(0,'#17242d');g.addColorStop(1,'#101b25');c.fillStyle=g;c.fillRect(L-12,LP+6,R-L+24,68);
   line(c,L-12,LP+8,R+12,LP+8,'#0a141c',2);
  }
 });
 scene.add.image(L-12,LP,`${prefix}-stairlip`).setOrigin(0).setDepth(29.9);
}
