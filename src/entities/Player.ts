import Phaser from 'phaser';
import {createCharacterTextures} from '../assets/character';
import {PIER,lampStrength,nearestLamp} from '../scenes/config';
import {promenadeDepth} from '../scenes/promenade';
import {movementTarget,moveOnPromenade} from './movement';
import {BOARDING} from '../scenes/boardingConfig';
export class Player {
 x=PIER.startX; y=PIER.walkY; velocity=0; velocityY=0; facing=-1; private phase=0;private idleTime=0;
 boardingTarget?:{x:number;y:number};
 private aboard=false;
 readonly visual:Phaser.GameObjects.Image;
 private reflection:Phaser.GameObjects.Image;
 private rim:Phaser.GameObjects.Image;
 private warmth:Phaser.GameObjects.Image;
 private shadow:Phaser.GameObjects.Ellipse;
 private keys:Record<string,Phaser.Input.Keyboard.Key>;
 constructor(scene:Phaser.Scene){
  createCharacterTextures(scene);
  this.reflection=scene.add.image(this.x,this.y+4,'traveller-0').setOrigin(.5,1).setScale(.98,-.29).setAlpha(.11).setTint(0x6f8a8f).setDepth(15);
  this.shadow=scene.add.ellipse(this.x,this.y+1,36,7,0x08131d,.5).setDepth(16);
  this.visual=scene.add.image(this.x,this.y,'traveller-0').setOrigin(.5,109/112).setScale(.98).setDepth(20);
  this.rim=scene.add.image(this.x,this.y,'traveller-rim-0').setOrigin(.5,109/112).setScale(.98).setDepth(20.2).setAlpha(0);
  this.warmth=scene.add.image(this.x,this.y,'traveller-0').setOrigin(.5,109/112).setScale(.98).setDepth(20.1).setTintFill(0xd9b779).setAlpha(0);
  this.keys=scene.input.keyboard!.addKeys('A,D,W,S,LEFT,RIGHT,UP,DOWN') as typeof this.keys;
  scene.game.events.on(Phaser.Core.Events.BLUR,this.releaseKeys,this);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>scene.game.events.off(Phaser.Core.Events.BLUR,this.releaseKeys,this));
 }
 private releaseKeys(){for(const key of Object.values(this.keys))key.reset();this.velocity=0;this.velocityY=0;}
 finishBoarding(){
  this.aboard=true;this.boardingTarget=undefined;this.releaseKeys();
  for(const image of [this.visual,this.rim,this.warmth,this.shadow,this.reflection])image.setVisible(false);
 }
 update(dt:number){
  if(this.aboard)return;
  const previousX=this.x,previousY=this.y;
  if(this.boardingTarget){
   // Only the authored boarding path may cross the otherwise solid rail boundary.
   const dx=this.boardingTarget.x-this.x,dy=this.boardingTarget.y-this.y,distance=Math.hypot(dx,dy);
   const step=Math.min(distance,dt*47);
   if(distance>0){this.x+=dx/distance*step;this.y+=dy/distance*step;}
   this.velocity=0;this.velocityY=0;
  }else{
   const horizontal=Number(this.keys.D.isDown||this.keys.RIGHT.isDown)-Number(this.keys.A.isDown||this.keys.LEFT.isDown);
   const vertical=Number(this.keys.S.isDown||this.keys.DOWN.isDown)-Number(this.keys.W.isDown||this.keys.UP.isDown);
   const target=movementTarget(horizontal,vertical),smoothing=1-Math.exp(-dt*9);
   this.velocity=Phaser.Math.Linear(this.velocity,target.x,smoothing);
   this.velocityY=Phaser.Math.Linear(this.velocityY,target.y,smoothing);
   const next=moveOnPromenade(this.x,this.y,this.velocity*dt,this.velocityY*dt);
   this.x=next.x;this.y=next.y;
   if(next.blockedX)this.velocity=0;
   if(next.blockedY)this.velocityY=0;
  }
  const travelled=Math.hypot(this.x-previousX,this.y-previousY);
  const walking=dt>0&&travelled/dt>4;
  if(walking){if(Math.abs(this.x-previousX)>.01)this.facing=Math.sign(this.x-previousX);this.phase+=travelled*.071;}
  this.idleTime+=dt;
  const frame=walking?1+Math.floor(this.phase/(Math.PI*2)*12)%12:0;
  this.visual.setTexture(`traveller-${frame}`).setPosition(this.x,this.y+(walking?Math.sin(this.phase*2)*.35:Math.sin(this.idleTime*1.4)*.65)).setFlipX(this.facing<0);
  const light=lampStrength(this.x)*Math.exp(-Math.pow((this.y-567)/85,2));
  // In warm pools the coat catches a restrained rim and the shadow falls away from the lamp.
  const idleScale=walking?1:1+Math.sin(this.idleTime*1.4)*.004;
  const perspective=this.boardingTarget?Phaser.Math.Linear(.98,.44,Phaser.Math.Clamp((525-this.y)/(525-BOARDING.deckY),0,1)):.98;
  const entranceAlpha=this.boardingTarget&&this.y<=BOARDING.deckY+.8?1-Phaser.Math.Clamp((this.x-BOARDING.cabinX)/10,0,1):1;
  this.visual.setAlpha(entranceAlpha);
  this.visual.setScale(perspective,perspective*idleScale).setRotation(walking?Math.sin(this.phase)*.004:Math.sin(this.idleTime*.7)*.007);
  this.rim.setTexture(`traveller-rim-${frame}`).setPosition(this.visual.x,this.visual.y).setFlipX(this.facing<0).setScale(this.visual.scaleX,this.visual.scaleY).setRotation(this.visual.rotation).setAlpha((.06+light*.42)*entranceAlpha);
  this.warmth.setTexture(`traveller-${frame}`).setPosition(this.visual.x,this.visual.y).setFlipX(this.facing<0).setScale(this.visual.scaleX,this.visual.scaleY).setRotation(this.visual.rotation).setAlpha(light*.075*entranceAlpha);
  const depth=promenadeDepth(this.y);
  this.visual.setDepth(depth);this.warmth.setDepth(depth+.001);this.rim.setDepth(depth+.002);
  this.shadow.setScale(1+light*.65,1).setAlpha(.4+light*.18);
  this.reflection.setAlpha(.09+light*.09);
  this.shadow.setVisible(!this.boardingTarget||this.y>=525);this.reflection.setVisible(!this.boardingTarget||this.y>=525);
  this.reflection.setTexture(`traveller-${frame}`).setPosition(this.x,this.y+4).setFlipX(this.facing<0);this.shadow.setPosition(this.x+(this.x-nearestLamp(this.x).x)*light*.1,this.y+1);
 }
}
