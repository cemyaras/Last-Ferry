import Phaser from 'phaser';
import {type Ctx,texture,random,polygon,line,ellipse,label} from '../utils/drawing';
import {POSTER} from '../story/lines';

type Point=readonly [number,number];
const HAND="'Comic Sans MS','Chalkboard SE','Marker Felt',cursive";

/** Small wet paw prints along a path; they shrink slightly with distance up the walkway. */
export function addPawTrail(scene:Phaser.Scene,key:string,points:readonly Point[],depth:number,seed:number){
 const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),left=Math.min(...xs)-10,top=Math.min(...ys)-10;
 texture(scene,key,Math.max(...xs)-left+20,Math.max(...ys)-top+20,c=>{
  const r=random(seed);let side=1,carry=0;
  for(let i=1;i<points.length;i++){
   const [ax,ay]=points[i-1],[bx,by]=points[i],length=Math.hypot(bx-ax,by-ay),nx=-(by-ay)/length,ny=(bx-ax)/length;
   for(let d=carry;d<length;d+=17){
    const t=d/length,x=ax+(bx-ax)*t-left+nx*side*3.2,y=ay+(by-ay)*t-top+ny*side*1.4+(r()-.5),s=.75+(ay+(by-ay)*t-520)/400;
    paw(c,x,y,s);side=-side;carry=d+17-length;
   }
  }
 });
 return scene.add.image(left,top,key).setOrigin(0).setDepth(depth);
}
function paw(c:Ctx,x:number,y:number,s:number){
 ellipse(c,x+.5*s,y+.6*s,2.4*s,1.5*s,'#9fb4aa1c');ellipse(c,x,y,2.4*s,1.6*s,'#07151db0');
 for(const [dx,dy] of [[-2.3,-1.9],[0,-2.6],[2.3,-1.9]])ellipse(c,x+dx*s,y+dy*s,.9*s,.7*s,'#07151da0');
}
/** A child's drawing: a round white shape that could be the moon, or a curled-up cat. */
function drawing(c:Ctx,x:number,y:number,r:number){
 ellipse(c,x,y,r,r*.94,'#e4dec6');
 c.strokeStyle='#3d4b52';c.lineWidth=Math.max(1,r*.06);c.beginPath();c.ellipse(x,y,r,r*.94,0,0,Math.PI*2);c.stroke();
 c.beginPath();c.moveTo(x+r*.7,y+r*.6);c.quadraticCurveTo(x+r*1.25,y+r*.9,x+r*.95,y+r*.25);c.stroke();
 for(let i=0;i<5;i++)line(c,x-r*.6+i*r*.22,y-r*.35+i*r*.05,x-r*.35+i*r*.22,y-r*.5+i*r*.05,'#c9c2a633',Math.max(1,r*.05));
}
export function createClueTextures(scene:Phaser.Scene){
 texture(scene,'clue-poster',24,30,c=>{
  polygon(c,[[1,2],[23,1],[22,29],[2,28]],'#bdb7a2','#6d705f');line(c,3,1,9,3,'#8f8b7688',3);line(c,15,3,21,1,'#8f8b7688',3);
  line(c,5,7,19,7,'#7a3f37',2);drawing(c,12,15,4.5);for(const y of [22,25])line(c,5,y,19,y,'#2f465688',1);
 });
 texture(scene,'clue-poster-card',250,310,c=>{
  polygon(c,[[6,10],[244,4],[240,302],[10,306]],'#d8d1b8','#8d8a76');
  for(const [x,y] of [[30,8],[204,4]])polygon(c,[[x,y-6],[x+34,y-9],[x+36,y+7],[x+2,y+10]],'#a9a48c99');
  label(c,POSTER.title,44,56,34,'#8a3b33',HAND,2);
  drawing(c,125,124,44);
  POSTER.body.forEach((text,i)=>label(c,text,30,212+i*25,17,'#27405a',HAND));
  label(c,POSTER.signature,110,292,14,'#3a4f62',HAND);
 });
 texture(scene,'clue-cup',14,16,c=>{ellipse(c,7,14,6,1.6,'#06151e88');polygon(c,[[2,3],[12,3],[10.5,14],[3.5,14]],'#b9b5a2','#6f7568');ellipse(c,7,3,5,1.6,'#e1dcc7');ellipse(c,7,3,3.8,1,'#ccc6ae');line(c,3,8,11,8,'#8a5a4b88',1.2);});
 texture(scene,'clue-bowl',28,12,c=>{ellipse(c,14,9,13,2.6,'#06151e99');polygon(c,[[2,4],[26,4],[22,10],[6,10]],'#4a5a57','#8c998a');ellipse(c,14,4,12,2.4,'#2c3c3e');ellipse(c,14,4,9.5,1.6,'#15252c');ellipse(c,9,4,1.4,.6,'#a4b1a655');});
 texture(scene,'clue-fishhead',26,12,c=>{ellipse(c,13,9,11,2.2,'#06151e88');polygon(c,[[3,6],[12,2],[17,5],[17,8],[12,10]],'#8f9a92','#c1c8bd66');for(let x=17;x<24;x+=2)line(c,x,6.5,x+1.5,5+((x/2)%2)*3,'#b8c0b499',1);ellipse(c,7,5.5,1,1,'#11232b');});
}
