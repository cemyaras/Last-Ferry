import Phaser from 'phaser';
import {random,texture} from '../utils/drawing';
import {createFerryTexture} from '../assets/ferry';
import {PIER,PARALLAX} from '../scenes/config';
export class Water{
 private graphics:Phaser.GameObjects.Graphics;
 private ferry:Phaser.GameObjects.Image;
 private wavelets:{x:number;y:number;length:number;phase:number;alpha:number;layer:number}[]=[];
 private elapsed=0;
 constructor(scene:Phaser.Scene){
  texture(scene,'water',PIER.width,165,c=>{const g=c.createLinearGradient(0,0,0,165);g.addColorStop(0,'#314650');g.addColorStop(.23,'#233a44');g.addColorStop(1,'#112a36');c.fillStyle=g;c.fillRect(0,0,PIER.width,165);});
  scene.add.image(0,350,'water').setOrigin(0).setDepth(2).setScrollFactor(PARALLAX.water);
  this.graphics=scene.add.graphics().setDepth(3).setScrollFactor(PARALLAX.water);createFerryTexture(scene);
  // All ferry parts, its wake and reflection share one water plane, behind the opaque terminal.
  this.ferry=scene.add.image(845,427,'ferry').setOrigin(.5,1).setScale(.65).setDepth(4).setScrollFactor(PARALLAX.water).setTint(0xc4d0c8);
  const r=random(941);for(let layer=0;layer<3;layer++)for(let i=0;i<290;i++){
   const y=353+layer*44+r()*61;
   this.wavelets.push({x:r()*PIER.width,y,length:2+r()*(10+layer*15),phase:r()*6.28,alpha:.035+r()*.09,layer});
  }
 }
 update(dt:number,cameraX=0){this.elapsed+=dt;const t=this.elapsed;const g=this.graphics;g.clear();
  // A little under three pixels/second: a distant crossing, with wrapping fully offscreen.
  const route=PIER.width+400;
  const fx=((845-t*2.8+200)%route+route)%route-200;
  this.ferry.setPosition(fx,427+Math.sin(t*.85)*.45).setRotation(Math.sin(t*.37)*.0015);
  for(const w of this.wavelets){
   const x=(w.x+t*(.9+w.layer*1.8)+Math.sin(t*.35+w.phase)*3)%PIER.width;
   const y=w.y+Math.sin(t*.6+w.phase)*(.2+w.layer*.3);
   g.lineStyle(.65+w.layer*.2,0x8da6aa,w.alpha*(.65+Math.sin(t*.8+w.phase)*.35));
   g.beginPath();g.moveTo(x,y);g.lineTo(x+w.length*.35,y-.3);g.lineTo(x+w.length,y+.2);g.strokePath();
  }
  for(const lx of [82,212,374,568,693,746,1008,1177,1372,1513,1729,1910])for(let j=0;j<27;j++){
   const y=366+j*4.5;const wobble=Math.sin(j*7.3+t*.7+lx)*((y-350)*.13+2);
   g.lineStyle(1,0xc6ab75,(1-j/29)*.15*(.55+.45*Math.sin(j*4+lx+t*.75)));
   const anchor=lx+cameraX*(PARALLAX.water-PARALLAX.skyline);
   g.lineBetween(anchor+wobble-j*.17,y,anchor+wobble+j*.17+2,y);
  }
  const waterline=this.ferry.y-6.5;
  // Broken pools beneath individual cabin lights; no solid mirror stripe.
  for(let j=0;j<24;j++)for(let k=0;k<7;k++){
   const y=waterline+3+j*2.8;const off=Math.sin(j*2.7+t*1.1+k)*5;
   const x=fx-80+k*25+off;
   g.lineStyle(1.2,0xbfa575,(1-j/25)*.15*(.65+Math.sin(t+k+j)*.35));
   g.lineBetween(x-j*.14,y,x+7+j*.23,y);
  }
  // Two low, spreading wake arms trail the stern and drift with the waves.
  for(let arm=0;arm<2;arm++)for(let j=0;j<14;j++){
   const x=fx+113+j*8;const y=waterline+2+(arm?1:-1)*j*.43+Math.sin(j*.7+t)*.6;
   g.lineStyle(.8,0x9cb5b1,(1-j/14)*.17);g.lineBetween(x,y,x+5+Math.sin(t+j)*2,y+.4);
  }
 }
}
