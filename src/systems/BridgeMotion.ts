import Phaser from 'phaser';
import {windGust} from './Atmosphere';
import {FLAG_POLE} from '../assets/galataBridge';
import {BARRIER_PANELS,FISHERS} from '../scenes/galataBridgeConfig';

const ROAD_PARALLAX=1.04;
const CARS=[{speed:310,offset:0,loop:4200},{speed:360,offset:2300,loop:5200}];
const TRAM={period:34,length:880,speed:360};

/** Bounded, delta-timed movement for the open bridge; nothing here is interactive. */
export class BridgeMotion{
 gust=1;
 private t=0;
 private cars:Phaser.GameObjects.Graphics;
 private tram:Phaser.GameObjects.Graphics;
 private spill:Phaser.GameObjects.Graphics;
 private flag:Phaser.GameObjects.Graphics;
 private gulls:Phaser.GameObjects.Graphics;
 private blink:Phaser.GameObjects.Graphics;
 private shimmer:Phaser.GameObjects.Graphics;
 private ferry:Phaser.GameObjects.Image;
 constructor(private scene:Phaser.Scene){
  this.shimmer=scene.add.graphics().setDepth(6.7);
  this.gulls=scene.add.graphics().setDepth(6.3);
  this.flag=scene.add.graphics().setDepth(10.35);
  this.spill=scene.add.graphics().setDepth(13.5);
  this.blink=scene.add.graphics().setDepth(19.6);
  this.cars=scene.add.graphics().setDepth(31).setScrollFactor(ROAD_PARALLAX);
  this.tram=scene.add.graphics().setDepth(32).setScrollFactor(ROAD_PARALLAX);
  // A second, farther ferry crossing the mouth of the Horn (Water supplies the texture and the nearer one).
  this.ferry=scene.add.image(0,366,'ferry').setOrigin(.5,1).setScale(.26).setDepth(2.2).setScrollFactor(.34).setTint(0x9fb0aa).setAlpha(.82);
 }
 update(dt:number){
  this.t+=dt;const t=this.t,camera=this.scene.cameras.main,view=camera.worldView;
  this.gust=windGust(t);
  this.ferry.setPosition(((700+t*5)%2300)-300,366+Math.sin(t*.8)*.3);
  // Restaurant light from below, broken by the water just beyond the rail.
  const s=this.shimmer;s.clear();
  for(let x=Math.floor((view.x-80)/40)*40;x<view.right+80;x+=40)for(let j=0;j<4;j++){
   const y=478+j*7,w=6+j*3,off=Math.sin(t*.8+x*.13+j*2)*4;
   s.lineStyle(1,0xd2b072,(.04+Math.sin(t*.7+x*.31+j)**2*.06)*(j<3?1:.6));s.lineBetween(x+off-w,y,x+off+w,y);
  }
  // Two gulls circle the first fishermen, one the seated one; they glide more than they flap.
  const g=this.gulls;g.clear();g.lineStyle(1.2,0xb3beb8,.55);
  for(let i=0;i<3;i++){
   const cx=i<2?FISHERS[1].x-30:FISHERS[2].x,a=t*(.3+i*.04)+i*2.1;
   const x=cx+Math.cos(a)*(150+i*30),y=250+Math.sin(a)*26+i*18,flap=Math.sin(t*.9+i)>.45?Math.sin(t*9+i)*3:.8;
   g.beginPath();g.moveTo(x-6,y-flap);g.lineTo(x,y);g.lineTo(x+6,y-flap);g.strokePath();
  }
  this.drawFlag(t);
  // Warning lamps on the Eminönü barrier pulse slowly, with a wet reflection below.
  const b=this.blink;b.clear();
  BARRIER_PANELS.forEach(({x,y},i)=>{
   const v=Math.max(0,Math.sin(t*3.1+i*1.3))**2,lx=x-2,ly=y-47;
   b.fillStyle(0xe0a64f,.18+.55*v);b.fillCircle(lx,ly,2.6);b.fillStyle(0xe0a64f,.08*v);b.fillCircle(lx,ly,10);
   b.fillStyle(0xe0a64f,.06*v);b.fillRect(lx-2,y+2,4,14);
  });
  this.drawTraffic(t,camera.scrollX*ROAD_PARALLAX,camera.scrollX);
 }
 private drawFlag(t:number){
  // The wind blows toward Eminönü, so the flag flies left of its pole.
  const f=this.flag,length=26,height=17,steps=9,top:Phaser.Types.Math.Vector2Like[]=[],bottom:Phaser.Types.Math.Vector2Like[]=[];
  const wave=(i:number)=>Math.sin(t*6.5-i*.9)*1.8*(i/steps)*this.gust;
  for(let i=0;i<=steps;i++){const x=FLAG_POLE.x-i*length/steps;top.push({x,y:FLAG_POLE.y+wave(i)});bottom.unshift({x,y:FLAG_POLE.y+height+wave(i)*1.1});}
  f.clear();f.fillStyle(0x7d3b37,.95);f.fillPoints([...top,...bottom],true);
  const cx=FLAG_POLE.x-length*.36,cy=FLAG_POLE.y+height/2+wave(3.2);
  f.fillStyle(0xc9c5a7,.9);f.fillCircle(cx,cy,4.4);f.fillStyle(0x7d3b37,1);f.fillCircle(cx-1.6,cy,3.7);f.fillStyle(0xc9c5a7,.9);f.fillCircle(cx-6.2,cy,1.1);
 }
 private drawTraffic(t:number,base:number,scrollX:number){
  const c=this.cars;c.clear();
  // Cars on the nearer lane toward Eminönü: mostly light, a low dark body glimpsed over the kerb.
  for(const car of CARS){
   const x=base+1500-((t*car.speed+car.offset)%car.loop);if(x<base-500||x>base+1800)continue;
   c.fillStyle(0x0c1a22,.95);c.fillRoundedRect(x,684,120,56,8);c.fillStyle(0x16262e,.9);c.fillRoundedRect(x+26,676,62,14,5);
   c.fillStyle(0xe8dcb4,.035);c.fillEllipse(x-90,712,170,10);c.fillStyle(0xf1e6c4,.06);c.fillEllipse(x-18,702,70,12);
   c.fillStyle(0xf1e6c4,.75);c.fillEllipse(x+4,700,7,4);c.fillStyle(0xe8dcb4,.07);c.fillRect(x+1,706,6,26);
   c.fillStyle(0xa2463c,.7);c.fillEllipse(x+117,698,5,3);c.fillStyle(0xa2463c,.08);c.fillEllipse(x+124,700,26,8);
  }
  const tr=this.tram,sp=this.spill;tr.clear();sp.clear();
  const run=(t+6)%TRAM.period,dir=Math.floor((t+6)/TRAM.period)%2?1:-1,dur=(1280+TRAM.length+600)/TRAM.speed;
  if(run>=dur)return;
  // The T1 tram passes close to the viewer: roof, lit windows and headlight only.
  const p=run*TRAM.speed,left=dir<0?base+1580-p:base-300-TRAM.length+p;
  for(let m=0;m<5;m++){
   const mx=left+m*178;
   tr.fillStyle(0x1b2d35,1);tr.fillRect(mx,674,172,150);tr.lineStyle(1,0x8c9a93,.5);tr.lineBetween(mx+2,675,mx+170,675);
   for(let w=0;w<5;w++){tr.fillStyle(0xd8c99a,.42);tr.fillRect(mx+10+w*33,686,26,26);if((m*5+w)%4===1){tr.fillStyle(0x2a3a3a,.8);tr.fillEllipse(mx+23+w*33,704,9,14);}}
   tr.fillStyle(0x7a4640,.6);tr.fillRect(mx,716,172,3);tr.fillStyle(0x0c1820,1);tr.fillRect(mx+172,680,6,144);
   sp.fillStyle(0xd8c48e,.045);sp.fillEllipse(mx+86-scrollX*(ROAD_PARALLAX-1),642,170,18);
  }
  const nose=dir<0?left:left+5*178-6;
  tr.fillStyle(0xf2e4bb,.55);tr.fillEllipse(nose+(dir<0?4:-4),722,10,6);tr.fillStyle(0xf2e4bb,.05);tr.fillEllipse(nose+dir*110,730,220,16);
 }
}
