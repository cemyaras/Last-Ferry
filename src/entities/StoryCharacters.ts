import Phaser from 'phaser';
import {type Ctx,texture,polygon,line,ellipse} from '../utils/drawing';
import type {Player} from './Player';
import {promenadeDepth} from '../scenes/promenade';

const FUR='#e4e0d4',SHADE='#b3b1a6',EAR='#1b262b';
/** Ay: white, one black ear. Seen only at the end of the night. */
function sitting(c:Ctx,looking:boolean){
 ellipse(c,14,29,11,2.2,'#06151e88');
 c.strokeStyle=SHADE;c.lineWidth=3;c.beginPath();c.moveTo(6,27);c.quadraticCurveTo(0,20,6,15);c.stroke();
 polygon(c,[[7,28],[8,17],[13,11],[19,12],[22,19],[22,28]],FUR,'#8f8e8566');
 polygon(c,[[9,28],[10,21],[14,26]],SHADE);
 if(looking){
  ellipse(c,16,9,6.2,5.4,FUR);polygon(c,[[10,7],[11,1],[14,5]],EAR);polygon(c,[[18,5],[21,1],[22,7]],FUR,'#9c9a9055');
  ellipse(c,14,9,1,1.2,'#6d7a4f');ellipse(c,18.4,9,1,1.2,'#6d7a4f');ellipse(c,16.2,11.2,.8,.5,'#a2807a');
 }else{
  ellipse(c,19,9,5.8,5,FUR);polygon(c,[[16,6],[17,0],[20,4]],EAR);polygon(c,[[20,5],[23,1],[24,7]],FUR,'#9c9a9055');
  line(c,22,9,24,9.5,'#56615a',1);
 }
}
export class Ay{
 readonly sitter:Phaser.GameObjects.Image;
 private carried:Phaser.GameObjects.Image;
 private elapsed=0;
 held=false;
 constructor(private scene:Phaser.Scene,x:number,y:number){
  texture(scene,'ay-sitting',28,32,c=>sitting(c,false));
  texture(scene,'ay-looking',28,32,c=>sitting(c,true));
  texture(scene,'ay-carried',30,20,c=>{
   // Curled against the traveller's chest, tail over the arm.
   ellipse(c,15,11,11,6.5,FUR);ellipse(c,12,13,6,3,SHADE);
   ellipse(c,24,7,5.4,4.8,FUR);polygon(c,[[21,4],[22,-1],[25,3]],EAR);polygon(c,[[25,4],[28,0],[29,6]],FUR,'#9c9a9055');
   c.strokeStyle=SHADE;c.lineWidth=2.4;c.beginPath();c.moveTo(5,13);c.quadraticCurveTo(2,18,8,18);c.stroke();
  });
  this.sitter=scene.add.image(x,y,'ay-sitting').setOrigin(.5,29/32).setDepth(promenadeDepth(y)).setAlpha(0).setName('ay');
  this.carried=scene.add.image(0,0,'ay-carried').setOrigin(.5).setVisible(false).setName('ay-carried');
 }
 get visible(){return this.sitter.alpha>.5||this.held;}
 appear(duration=900){this.scene.tweens.add({targets:this.sitter,alpha:1,duration});}
 look(){this.sitter.setTexture('ay-looking');}
 pickUp(){this.held=true;this.sitter.setVisible(false);this.carried.setVisible(true);}
 /** Carried: follows the traveller's chest, including the perspective and fade of a gangway walk. */
 update(dt:number,player:Player){
  this.elapsed+=dt;
  if(!this.held){this.sitter.setScale(1,1+Math.sin(this.elapsed*1.3)*.012);return;}
  const v=player.visual,facing=v.flipX?-1:1;
  this.carried.setPosition(v.x+facing*4*v.scaleX,v.y-50*v.scaleY).setScale(v.scaleX/.98,v.scaleY/.98).setFlipX(facing<0)
   .setAlpha(v.alpha).setVisible(v.visible).setDepth(v.depth+.003).setRotation(Math.sin(this.elapsed*1.1)*.02);
 }
 release(){this.held=false;this.carried.setVisible(false);}
}

/** Defne, eight, in a mustard raincoat and red boots; she holds her poster, then the cat. */
export function createDefneTextures(scene:Phaser.Scene){
 const body=(c:Ctx)=>{
  ellipse(c,22,82,15,2.6,'#06172099');
  line(c,18,64,18,78,'#1f2c33',5);line(c,26,64,26,78,'#1f2c33',5);
  polygon(c,[[14,76],[21,76],[21,81],[13,81]],'#7d3a33');polygon(c,[[23,76],[30,76],[31,81],[23,81]],'#7d3a33');
  polygon(c,[[13,30],[31,30],[35,66],[9,66]],'#9a8544','#c3ad6a66');line(c,22,32,22,64,'#6d5d2e88');
  polygon(c,[[12,30],[22,26],[32,30],[31,34],[13,34]],'#85743b');
  ellipse(c,22,19,7.5,8.5,'#a39a80');polygon(c,[[14,18],[15,10],[22,8],[29,10],[30,18],[27,13],[17,13]],'#2a2622');
  line(c,14,20,12,32,'#2a2622',3);line(c,30,20,32,32,'#2a2622',3);ellipse(c,12,33,1.6,1.6,'#7d3a33');ellipse(c,32,33,1.6,1.6,'#7d3a33');
 };
 texture(scene,'defne',44,84,c=>{
  body(c);
  polygon(c,[[10,40],[34,39],[35,56],[11,57]],'#c9c2aa','#7a7866');line(c,13,44,31,43,'#7a3f37',1.6);ellipse(c,22,50,3.2,3,'#e4dec6');
  line(c,12,38,10,48,'#9a8544',4);line(c,32,38,34,48,'#9a8544',4);
 });
 texture(scene,'defne-ay',44,84,c=>{
  body(c);
  ellipse(c,22,46,10,6,FUR);ellipse(c,19,48,5,2.6,SHADE);ellipse(c,30,41,4.6,4.2,FUR);polygon(c,[[28,38],[29,34],[31,37]],EAR);polygon(c,[[31,38],[33,34],[34,39]],FUR);
  line(c,12,38,14,50,'#9a8544',4);line(c,32,38,30,50,'#9a8544',4);
 });
}
