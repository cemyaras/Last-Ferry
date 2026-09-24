import Phaser from 'phaser';
import {texture,random,glow,polygon,line} from '../utils/drawing';
import {LAMPS,PIER} from '../scenes/config';
/** Slow wind gusts shared by rain and any wind-driven scene detail. */
export function windGust(t:number){return 1+Math.sin(t*.23)*.28+Math.sin(t*.71+1)*.12;}
/** `wind` is the horizontal rain drift per unit fall speed; when set, it also gusts gently. */
export interface AtmosphereEnvironment{width:number;lamps:readonly {x:number;y:number}[];texturePrefix:string;terminalGlow?:boolean;wind?:number;}
export class Atmosphere{
 private rain:Phaser.GameObjects.Graphics[];
 private wetLight:Phaser.GameObjects.Graphics;
 private lampHalos:Phaser.GameObjects.Image[]=[];
 private ripples:Phaser.GameObjects.Graphics;
 private gulls:Phaser.GameObjects.Graphics;
 private clouds:Phaser.GameObjects.Image;
 private haze:Phaser.GameObjects.Image;
 private drops:{x:number;y:number;speed:number;length:number;alpha:number;layer:number}[]=[];
 private splashes:{x:number;y:number;phase:number}[]=[];
 private elapsed=0;
 private lampLight:Phaser.GameObjects.Image[]=[];
 /** 0 is night; 1 is dawn with the lamps off and the rain stopped. */
 daylight=0;
 constructor(scene:Phaser.Scene,private environment:AtmosphereEnvironment={width:PIER.width,lamps:LAMPS,texturePrefix:'',terminalGlow:true}){
  const {width,lamps,texturePrefix}=environment;
  const key=(name:string)=>texturePrefix+name;
  this.clouds=scene.add.image(-160,70,'clouds').setOrigin(0).setDepth(.5).setAlpha(.7).setScrollFactor(.1);
  texture(scene,key('haze'),width,170,c=>{c.save();c.scale(1,.12);glow(c,790,710,680,'#afbbb11a');glow(c,1780,710,580,'#afbbb111');c.restore();});
  this.haze=scene.add.image(-110,278,key('haze')).setOrigin(0).setDepth(5).setScrollFactor(.4);
  texture(scene,key('lighting'),width,720,c=>{
   for(const {x,y} of lamps){
    
    const beam=c.createLinearGradient(0,y,0,600);beam.addColorStop(0,'#dabe7b0b');beam.addColorStop(.7,'#dbb96b06');beam.addColorStop(1,'#d7b36200');
    c.fillStyle=beam;c.beginPath();c.moveTo(x,y+10);c.lineTo(x+95,582);c.lineTo(x-95,582);c.closePath();c.fill();
    c.save();c.translate(x,567);c.scale(1,.24);glow(c,0,0,139,'#d7b66a38');c.restore();
   }
   if(environment.terminalGlow)glow(c,150,474,147,'#d4b57212');
  });
  this.lampLight.push(scene.add.image(0,0,key('lighting')).setOrigin(0).setDepth(25));
  texture(scene,'lamp-halo',240,240,c=>{glow(c,120,120,112,'#e7bd6725');glow(c,120,120,35,'#ffd58b38');glow(c,120,120,12,'#f8daa153');});
  for(const {x,y} of lamps)this.lampHalos.push(scene.add.image(x,y+6,'lamp-halo').setDepth(26));
  this.wetLight=scene.add.graphics().setDepth(13);
  texture(scene,key('reflections'),width,720,c=>{
   const r=random(823);for(const {x} of lamps)for(let i=0;i<100;i++){const y=528+r()*159,w=2+r()*((y-515)*.28+5),xx=x+(r()-.5)*((y-505)*.38);line(c,xx-w,y,xx+w,y,`rgba(193,165,106,${(.025+r()*.11)*(1-(y-528)/200)})`,1+r());}
   if(environment.terminalGlow)for(let i=0;i<150;i++){const x=30+r()*267,y=525+r()*115;line(c,x,y,x+4+r()*28,y,`rgba(190,161,99,${(1-(y-525)/130)*.12})`,1+r());}
   // Long softly broken shadows from the railing.
   for(let x=413;x<width;x+=48)polygon(c,[[x,519],[x+2,519],[x+(x-780)*.16,603],[x+(x-780)*.16-3,603]],'#0314210d');
  });
  this.lampLight.push(scene.add.image(0,0,key('reflections')).setOrigin(0).setDepth(12));
  this.rain=[6,24,40].map(depth=>scene.add.graphics().setDepth(depth).setScrollFactor(0));this.ripples=scene.add.graphics().setDepth(14);this.gulls=scene.add.graphics().setDepth(1.5).setScrollFactor(.2);
  const r=random(270);for(let layer=0;layer<3;layer++)for(let i=0;i<[105,66,8][layer];i++)this.drops.push({x:r()*1340,y:r()*720,speed:135+layer*125+r()*60,length:4+layer*6+r()*5,alpha:.045+layer*.022+r()*.035,layer});
  for(let i=0;i<48;i++)this.splashes.push({x:r()*width,y:530+r()*158,phase:r()*6});
  texture(scene,'finish',1280,720,c=>{
   const v=c.createRadialGradient(660,357,230,640,350,750);v.addColorStop(0,'#020a1000');v.addColorStop(.65,'#020a1009');v.addColorStop(1,'#0208108c');c.fillStyle=v;c.fillRect(0,0,1280,720);
   const rr=random(712);for(let i=0;i<43000;i++){c.fillStyle=rr()>.5?'#d5e1d807':'#0209130c';c.fillRect(rr()*1280,rr()*720,1,1);}
  });scene.add.image(0,0,'finish').setOrigin(0).setDepth(50).setScrollFactor(0);
 }
 update(dt:number){this.elapsed+=dt;const t=this.elapsed;this.clouds.x=-160+Math.sin(t*.018)*90;this.haze.x=-110+Math.sin(t*.04)*32;
  for(const layer of this.rain)layer.clear();
  const night=1-this.daylight;for(const image of this.lampLight)image.setAlpha(night);
  const wind=this.environment.wind,drift=wind?wind*windGust(t):.12,slant=drift/.12;
  for(const d of this.drops){d.y+=d.speed*dt;d.x-=d.speed*drift*dt;if(d.y>745){d.y=-20;d.x=(d.x+421)%1340;}if(d.x< -10)d.x=1300;const g=this.rain[d.layer];g.lineStyle(.45+d.layer*.22,0xb8ced3,d.alpha*night);g.lineBetween(d.x,d.y,d.x-(1.6+d.layer)*slant,d.y+d.length);}
  this.wetLight.clear();
  this.environment.lamps.forEach(({x},i)=>{
   // A rare, small voltage dip; no regular pulsing.
   const phase=(t+i*19)%83;const dip=phase>57&&phase<57.42?Math.sin((phase-57)/.42*Math.PI)**2*.13:0;
   this.lampHalos[i].setAlpha((1-dip)*night);
   for(let j=0;j<49;j++){
    const y=530+j*3.05;const wave=Math.sin(t*.9+j*2.13+i)*3.2;
    const width=3+(y-520)*.22;const offset=Math.sin(j*23.1+i)*width;
    const alpha=(.045+Math.sin(j*7.4+t*.75)**2*.07)*(1-j/60)*(1-dip)*night;
    this.wetLight.lineStyle(.8+(j%3)*.3,0xd6b579,alpha);
    this.wetLight.lineBetween(x+offset-width*.6+wave,y,x+offset+width*.6+wave,y);
   }
  });
  this.ripples.clear();for(const s of this.splashes){const p=(t*.65+s.phase)%3;if(p<1){this.ripples.lineStyle(.7,0x9aafa9,(1-p)*.14*night);this.ripples.strokeEllipse(s.x,s.y,2+p*12,1+p*3);}}
  this.gulls.clear();const cycle=t%38;if(cycle>12&&cycle<29){for(let i=0;i<2;i++){const x=1750-(cycle-12)*115-i*32,y=203+i*21+Math.sin(t*.9+i)*4,wing=Math.sin(t*4+i)*3;this.gulls.lineStyle(1.2,0x101f29,.65);this.gulls.beginPath();this.gulls.moveTo(x-6,y-wing);this.gulls.lineTo(x,y);this.gulls.lineTo(x+6,y-wing);this.gulls.strokePath();}}
 }
}
