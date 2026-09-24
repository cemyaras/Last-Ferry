import Phaser from 'phaser';
import {texture,glow,line,random} from '../utils/drawing';

/** `glowX` is where the sun rises on screen; `null` means it rises behind the viewer and only the sky warms. */
export interface DawnOptions{glowX:number|null;moon:boolean;}

/** A dawn sky, a pale setting moon and warm light on the water, laid over the shared night sky.
 * `progress` 0 is the unchanged night; 1 is full dawn. */
export class Dawn{
 private sky:Phaser.GameObjects.Image;
 private water:Phaser.GameObjects.Image;
 private wash:Phaser.GameObjects.Rectangle;
 private moon?:Phaser.GameObjects.Image;
 private moonLevel=1;
 private value=0;
 constructor(private scene:Phaser.Scene,options:DawnOptions){
  const side=options.glowX===null?'behind':`east-${options.glowX}`,sun=options.glowX;
  texture(scene,`dawn-sky-${side}`,1280,720,c=>{
   const g=c.createLinearGradient(0,0,0,362);
   if(sun===null){g.addColorStop(0,'#26394d');g.addColorStop(.55,'#5d6f80');g.addColorStop(.86,'#a39aa0');g.addColorStop(1,'#c3a59a');}
   else{g.addColorStop(0,'#1d3045');g.addColorStop(.55,'#4d6172');g.addColorStop(.84,'#8d8f8e');g.addColorStop(1,'#ae9985');}
   c.fillStyle=g;c.fillRect(0,0,1280,720);
   if(sun!==null){glow(c,sun,356,560,'#dca56c4a');glow(c,sun,356,200,'#efbf8466');glow(c,sun,356,60,'#f6d7a288');}
   else glow(c,640,380,700,'#c9a09a26');
   // Thin lit cloud bands low over the horizon.
   const r=random(sun??77);
   for(let i=0;i<9;i++){c.save();const x=r()*1280,y=250+r()*90;c.translate(x,y);c.scale(1,.07);glow(c,0,0,160+r()*220,sun!==null&&Math.abs(x-sun)<420?'#e6ae8a38':'#b99a9a24');c.restore();}
   for(let i=0;i<4000;i++){c.fillStyle=r()>.5?'#e9e1d404':'#1a2a3806';c.fillRect(r()*1280,r()*360,1+r()*2,1);}
  });
  this.sky=scene.add.image(0,0,`dawn-sky-${side}`).setOrigin(0).setDepth(.05).setScrollFactor(0).setAlpha(0);
  if(options.moon){
   texture(scene,'dawn-moon',60,60,c=>{
    glow(c,30,30,30,'#e8eee81c');c.fillStyle='#d9e0da';c.beginPath();c.arc(30,30,20,0,Math.PI*2);c.fill();
    c.globalCompositeOperation='destination-out';c.beginPath();c.arc(35,24,20,0,Math.PI*2);c.fill();
   });
   // Where the night sky's moon is, so one crossfades into the other.
   this.moon=scene.add.image(957,130,'dawn-moon').setDepth(.06).setScrollFactor(0).setAlpha(0);
  }
  texture(scene,`dawn-water-${side}`,1280,170,c=>{
   const g=c.createLinearGradient(0,0,0,170);g.addColorStop(0,sun===null?'#b99a9a30':'#d6a77a36');g.addColorStop(1,'#d6a77a00');c.fillStyle=g;c.fillRect(0,0,1280,170);
   if(sun!==null){
    c.save();c.translate(sun,4);c.scale(1,.35);glow(c,0,0,320,'#eab98050');c.restore();
    // A broken path of sun glitter toward the viewer.
    const r=random(sun);for(let i=0;i<70;i++){const y=4+r()*150,w=4+r()*(10+y*.2),x=sun+(r()-.5)*(30+y*.9);line(c,x-w,y,x+w,y,`rgba(244,210,160,${(.35-y/600).toFixed(3)})`,1);}
   }
  });
  this.water=scene.add.image(0,350,`dawn-water-${side}`).setOrigin(0).setDepth(3.1).setScrollFactor(0).setAlpha(0);
  this.wash=scene.add.rectangle(640,360,1280,720,sun===null?0xc6a39a:0xd2a176,1).setDepth(49).setScrollFactor(0).setAlpha(0);
 }
 get progress(){return this.value;}
 set progress(v:number){
  this.value=Phaser.Math.Clamp(v,0,1);
  this.sky.setAlpha(this.value);this.water.setAlpha(this.value);this.wash.setAlpha(this.value*.07);
  this.moon?.setAlpha(this.value*.55*this.moonLevel);
 }
 /** The moon leaves the sky; everything else stays at dawn. */
 fadeMoon(duration:number){
  this.scene.tweens.addCounter({from:this.moonLevel,to:0,duration,ease:'Sine.easeInOut',onUpdate:tween=>{this.moonLevel=tween.getValue()??0;this.progress=this.value;}});
 }
 get moonAlpha(){return this.moon?.alpha??0;}
}
