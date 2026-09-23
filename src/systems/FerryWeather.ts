import Phaser from 'phaser';
import {random,texture,glow} from '../utils/drawing';
import {DECK_LIGHTS} from '../scenes/ferryConfig';
export class FerryWeather{
 private rain:Phaser.GameObjects.Graphics[];
 private wet:Phaser.GameObjects.Graphics;
 private gulls:Phaser.GameObjects.Graphics;
 private clouds:Phaser.GameObjects.Image;
 private haze:Phaser.GameObjects.Image;
 private t=0;
 private drops:{x:number;y:number;speed:number;size:number;alpha:number;layer:number}[]=[];
 constructor(scene:Phaser.Scene){
  this.clouds=scene.add.image(-130,58,'clouds').setOrigin(0).setDepth(.5).setAlpha(.65);
  texture(scene,'deck-haze',1500,180,c=>{c.save();c.scale(1,.15);glow(c,800,550,640,'#b2c3b918');c.restore();});
  this.haze=scene.add.image(-90,300,'deck-haze').setOrigin(0).setDepth(5);
  this.rain=[6,24,40].map(depth=>scene.add.graphics().setDepth(depth));this.wet=scene.add.graphics().setDepth(14);this.gulls=scene.add.graphics().setDepth(6);
  const r=random(816);for(let layer=0;layer<3;layer++)for(let i=0;i<[105,66,8][layer];i++)this.drops.push({x:r()*1340,y:r()*720,speed:135+layer*125+r()*60,size:4+layer*6+r()*5,alpha:.045+layer*.022+r()*.035,layer});
  texture(scene,'deck-vignette',1280,720,c=>{const v=c.createRadialGradient(650,360,250,640,360,750);v.addColorStop(0,'#07131c00');v.addColorStop(1,'#030e1780');c.fillStyle=v;c.fillRect(0,0,1280,720);const rr=random(321);for(let i=0;i<23000;i++){c.fillStyle=rr()>.5?'#d6e1c907':'#0710180c';c.fillRect(rr()*1280,rr()*720,1,1);}});
  scene.add.image(0,0,'deck-vignette').setOrigin(0).setDepth(50);
 }
 update(dt:number,underway=1){
  this.t+=dt;const t=this.t;this.clouds.x=-130+Math.sin(t*.018)*65;this.haze.x=-90+Math.sin(t*.05)*20;this.haze.y=300+Math.sin(t*.64)*underway;
  for(const layer of this.rain)layer.clear();
  for(const d of this.drops){d.x-=dt*d.speed*.12;d.y+=dt*d.speed;if(d.y>745){d.y=-20;d.x=(d.x+421)%1340;}if(d.x< -10)d.x=1300;const g=this.rain[d.layer];g.lineStyle(.45+d.layer*.22,0xb8ced3,d.alpha);g.lineBetween(d.x,d.y,d.x-1.6-d.layer,d.y+d.size);}
  this.wet.clear();for(const {x} of DECK_LIGHTS)for(let j=0;j<41;j++){const y=543+j*2.9,off=Math.sin(j*8.3+t*.8)*7+Math.sin(t*.64)*underway*2,width=4+j*.55;this.wet.lineStyle(1,0xcbb77b,(1-j/45)*(.03+Math.sin(j*7+t*.6)**2*.055));this.wet.lineBetween(x+off-width,y,x+off+width,y);}
  // Long, broken amber bands from the rounded cabin windows across the wet boards.
  for(const x of [53,153,270])for(let j=0;j<30;j++){
   const y=540+j*3.2,w=12+j*.3,off=Math.sin(j*3.3+t*.7)*3;
   this.wet.lineStyle(1.3,0xd6bd82,(1-j/34)*(.04+Math.sin(j*9+t*.45)**2*.05));this.wet.lineBetween(x+off-w,y,x+off+w,y);
  }
  for(let i=0;i<14;i++){const phase=(t*.7+i*.79)%3;if(phase<1){this.wet.lineStyle(.6,0xa4b6ae,(1-phase)*.14);this.wet.strokeEllipse(392+i*57,578+(i%4)*15,2+phase*10,1+phase*2);}}
  this.gulls.clear();const phase=t%31;if(phase>7&&phase<20){for(let i=0;i<2;i++){const x=1350-(phase-7)*110-i*28,y=222+i*17+Math.sin(t+i)*3,wing=Math.sin(t*4+i)*3;this.gulls.lineStyle(1,0x122732,.7);this.gulls.beginPath();this.gulls.moveTo(x-5,y-wing);this.gulls.lineTo(x,y);this.gulls.lineTo(x+5,y-wing);this.gulls.strokePath();}}
 }
}
