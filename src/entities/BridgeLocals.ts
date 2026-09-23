import Phaser from 'phaser';
import {type Ctx,texture,polygon,line,ellipse} from '../utils/drawing';
import {promenadeDepth} from '../scenes/promenade';
import {FISHERS,WALKER,PROPPED_RODS,type FisherLook} from '../scenes/galataBridgeConfig';

const HEAD:Record<FisherLook,(c:Ctx,x:number,y:number)=>void>={
 beanie:(c,x,y)=>{polygon(c,[[x-9,y-2],[x-8,y-11],[x,y-14],[x+8,y-11],[x+9,y-2]],'#4a3d35');line(c,x-9,y-3,x+9,y-3,'#5f4d40',3);},
 cap:(c,x,y)=>{polygon(c,[[x-9,y-4],[x-7,y-11],[x+7,y-11],[x+9,y-4]],'#2d3e3b');line(c,x-11,y-4,x+11,y-4,'#1a2b2f',3);},
 hood:(c,x,y)=>polygon(c,[[x-11,y+6],[x-10,y-8],[x,y-14],[x+10,y-8],[x+11,y+6]],'#2a3d3a','#6e7b6c44'),
};
/** Seen from behind, facing the water, as the traveller walks past. */
function standing(c:Ctx,coat:string,look:FisherLook){
 ellipse(c,30,107,21,3,'#06172099');
 line(c,24,74,23,104,'#132833',8);line(c,36,74,37,104,'#172c35',8);line(c,19,106,27,106,'#07161f',5);line(c,33,106,41,106,'#07161f',5);
 polygon(c,[[16,31],[44,31],[48,80],[12,80]],coat,'#7c847055');line(c,30,34,30,78,'#0f222b55');
 line(c,17,37,21,58,'#26363688',6);line(c,43,37,39,58,'#26363688',6);
 ellipse(c,30,24,8,9,'#1f3137');ellipse(c,21.5,25,1.5,3,'#8f8a72');ellipse(c,38.5,25,1.5,3,'#8f8a72');
 HEAD[look](c,30,24);line(c,19,32,41,32,'#56605a',4);
}
function seated(c:Ctx){
 ellipse(c,36,88,26,3,'#06172099');
 line(c,22,88,48,64,'#445244',2.5);line(c,50,88,24,64,'#445244',2.5);line(c,19,64,53,64,'#58665a',4);
 line(c,24,62,16,76,'#172c35',8);line(c,16,76,18,87,'#172c35',7);line(c,48,62,56,76,'#172c35',8);line(c,56,76,54,87,'#172c35',7);
 line(c,12,88,21,88,'#07161f',5);line(c,51,88,60,88,'#07161f',5);
 polygon(c,[[21,24],[49,24],[53,66],[17,66]],'#34443f','#77826e55');line(c,22,30,17,50,'#2b3a3888',6);line(c,48,30,52,48,'#2b3a3888',6);
 ellipse(c,35,17,8,9,'#1f3137');HEAD.hood(c,35,17);
 // A tulip glass of tea keeps warm on the deck beside him.
 polygon(c,[[64,79],[68,79],[67,83],[68,88],[64,88],[65,83]],'#b4854f','#e0c38a66');
}

type Rod={tipX:number;tipY:number;phase:number;graphics?:Phaser.GameObjects.Graphics;gripX?:number;gripY?:number};
/** Three fishermen and one pedestrian; all quiet, mostly still and non-interactive. */
export class BridgeLocals{
 private figures:Phaser.GameObjects.Image[]=[];
 private umbrella:Phaser.GameObjects.Image;
 private gull:Phaser.GameObjects.Image;
 private lines:Phaser.GameObjects.Graphics;
 private rods:Rod[]=[];
 private elapsed=0;
 constructor(scene:Phaser.Scene){
  texture(scene,'galata-fisher-beanie',60,112,c=>standing(c,'#3b4744','beanie'));
  texture(scene,'galata-fisher-cap',60,112,c=>standing(c,'#45493f','cap'));
  texture(scene,'galata-fisher-seated',72,92,seated);
  texture(scene,'galata-walker',60,114,c=>{
   ellipse(c,30,109,20,3,'#06172099');line(c,25,82,25,106,'#12262f',7);line(c,35,82,35,106,'#12262f',7);line(c,21,108,28,108,'#07161f',4);line(c,33,108,40,108,'#07161f',4);
   polygon(c,[[17,32],[43,32],[47,88],[13,88]],'#2e3d45','#6f807955');line(c,40,36,37,52,'#2a3940',6);
   ellipse(c,30,23,8,10,'#1d2f36');ellipse(c,30,31,9,3,'#6d4f45');
  });
  texture(scene,'galata-umbrella',92,88,c=>{
   c.fillStyle='#1d3139';c.beginPath();c.moveTo(4,34);c.quadraticCurveTo(46,-6,88,34);c.closePath();c.fill();
   for(const x of [4,25,46,67,88])line(c,46,4,x,34,'#3b5057');
   c.strokeStyle='#6f817a88';c.lineWidth=1.2;for(let x=4;x<88;x+=21){c.beginPath();c.moveTo(x,34);c.quadraticCurveTo(x+10.5,39,x+21,34);c.stroke();}
   line(c,46,6,46,1,'#566a68',2);line(c,46,34,46,84,'#15262d',2);c.strokeStyle='#15262d';c.lineWidth=2.5;c.beginPath();c.arc(42,84,4,0,Math.PI);c.stroke();
  });
  texture(scene,'galata-gull',20,14,c=>{
   ellipse(c,10,8,6,3.4,'#a9b4ad');polygon(c,[[5,6],[15,5],[17,9],[8,10]],'#58666566');ellipse(c,15,5,2.6,2.4,'#b6c0b9');
   polygon(c,[[17,5],[20,6],[17,6.5]],'#b39a5c');line(c,9,11,9,14,'#6c6e5c');line(c,12,11,12,14,'#6c6e5c');
  });
  this.lines=scene.add.graphics().setDepth(9);
  FISHERS.forEach((f,i)=>{
   const key=f.seated?'galata-fisher-seated':f.look==='cap'?'galata-fisher-cap':'galata-fisher-beanie';
   const image=scene.add.image(f.x,f.y,key).setOrigin(.5,f.seated?88/92:107/112).setDepth(promenadeDepth(f.y)).setName(f.id);
   this.figures.push(image);
   this.rods.push({tipX:f.x+f.tip.x,tipY:f.y+f.tip.y,phase:i*2.3,gripX:f.x+f.grip.x,gripY:f.y+f.grip.y,graphics:scene.add.graphics().setDepth(image.depth+.003)});
  });
  for(const rod of PROPPED_RODS)this.rods.push({tipX:rod.tipX,tipY:rod.tipY,phase:rod.x*.01});
  const walker=scene.add.image(WALKER.x,WALKER.y,'galata-walker').setOrigin(.5,109/114).setDepth(promenadeDepth(WALKER.y)).setName(WALKER.id);
  this.figures.push(walker);
  this.umbrella=scene.add.image(WALKER.x+7,WALKER.y-57,'galata-umbrella').setOrigin(.5,84/88).setDepth(walker.depth+.002);
  this.gull=scene.add.image(1690,450,'galata-gull').setOrigin(.5,1).setDepth(10.3);
 }
 update(dt:number,gust=1){
  this.elapsed+=dt;const t=this.elapsed;
  this.figures.forEach((figure,i)=>figure.setScale(1,1+Math.sin(t*(.8+i*.13)+i)*.003));
  // The umbrella leans into the wind and gives a little with each gust.
  this.umbrella.setRotation(.05+(gust-1)*.12+Math.sin(t*1.7)*.012);
  this.gull.setY(450+(Math.sin(t*2.2)>.93?-1:0));
  this.lines.clear();
  this.rods.forEach((rod,i)=>{
   // A rare, small nibble at one rod tip; otherwise only the wind moves the line.
   const cycle=(t+i*5.3)%14,nibble=cycle<.5?Math.sin(cycle/.5*Math.PI*3)*(1-cycle/.5)*3:0;
   const tipX=rod.tipX+Math.sin(t*.9+rod.phase)*1.2*gust,tipY=rod.tipY+Math.sin(t*1.6+rod.phase)*.9+nibble;
   const sway=(gust-1)*-14+Math.sin(t*.8+rod.phase)*2.5;
   this.lines.lineStyle(.7,0xa9b8ae,.3);this.lines.beginPath();this.lines.moveTo(tipX,tipY);this.lines.lineTo(tipX+sway,(tipY+515)/2);this.lines.lineTo(tipX+sway*.6,515);this.lines.strokePath();
   if(!rod.graphics)return;
   const g=rod.graphics,gx=rod.gripX!,gy=rod.gripY!,mx=(gx+tipX)/2,my=(gy+tipY)/2+5;
   g.clear();g.lineStyle(1.8,0x0d1c24,.95);g.beginPath();g.moveTo(gx,gy);g.lineTo(mx,my);g.lineTo(tipX,tipY);g.strokePath();
   g.lineStyle(.7,0x9aa597,.35);g.lineBetween(gx,gy-1,mx,my-1);
   g.fillStyle(0x5c6a63,1);g.fillEllipse(gx+(tipX-gx)*.08,gy+(tipY-gy)*.08+3,5,4);
  });
 }
}
