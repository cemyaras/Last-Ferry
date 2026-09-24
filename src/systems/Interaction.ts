import Phaser from 'phaser';
import {lookPrompt,observationLine,placePrompt,playLines} from '../utils/sceneUi';
import {Player} from '../entities/Player';
import {PIER} from '../scenes/config';
import {PIER_OBJECTS} from '../scenes/promenade';
const BENCH=PIER_OBJECTS.find(object=>object.id==='bench-0')!;
/** `prompt` replaces "[E]  Bak"; `onLook` runs on E, and a point without `text` shows no line. */
export interface LookPoint{x:number;y:number;radius:number;text?:string;prompt?:string;onLook?:()=>void;}
/** One proximity interaction; intentionally no dialogue tree or quest state. */
export class Interaction{
 private prompt:Phaser.GameObjects.Text;
 private quote:Phaser.GameObjects.Text;
 private ornament:Phaser.GameObjects.Text;
 private key:Phaser.Input.Keyboard.Key;
 private showing=false;
 private near=false;
 constructor(private scene:Phaser.Scene,private points:readonly LookPoint[]=[{x:PIER.benchX,y:BENCH.sortY,radius:PIER.interactionRadius,text:'Şehir gece olunca başka türlü konuşuyor.'}]){
  this.key=scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  this.prompt=lookPrompt(scene).setPosition(PIER.benchX,478);
  this.quote=observationLine(scene).setText('“Şehir gece olunca başka türlü konuşuyor.”');
  this.ornament=scene.add.text(640,608,'—',{fontFamily:'Georgia, serif',fontSize:'18px',color:'#a79774'}).setOrigin(.5).setDepth(60).setAlpha(0).setScrollFactor(0);
 }
 hide(){this.scene.tweens.killTweensOf([this.prompt,this.quote,this.ornament]);this.prompt.setAlpha(0);this.quote.setAlpha(0);this.ornament.setAlpha(0);}
 get busy(){return this.showing;}
 /** A short line sequence in the same place as observations; prompts wait until it ends. */
 say(lines:string|readonly string[],done?:()=>void){
  this.showing=true;this.scene.tweens.killTweensOf(this.prompt);this.prompt.setAlpha(0);
  playLines(this.scene,this.quote,typeof lines==='string'?[lines]:lines,()=>{this.showing=false;if(this.near)this.scene.tweens.add({targets:this.prompt,alpha:1,duration:400});done?.();},[this.ornament]);
 }
 update(player:Player,pressed=Phaser.Input.Keyboard.JustDown(this.key)){
  const target=this.points.find(point=>Math.hypot(player.x-point.x,player.y-point.y)<point.radius);
  const near=Boolean(target);
  if(target){const label=target.prompt??'[E]  Bak';if(this.prompt.text!==label)this.prompt.setText(label);placePrompt(this.scene,this.prompt,target.x,Math.min(478,player.y-116));}
  if(near!==this.near){this.near=near;this.scene.tweens.killTweensOf(this.prompt);this.scene.tweens.add({targets:this.prompt,alpha:near&&!this.showing?1:0,duration:300});}
  if(target&&!this.showing&&pressed){
   target.onLook?.();
   if(!target.text)return;
   this.quote.setText(`“${target.text}”`);this.showing=true;this.prompt.setAlpha(0);
   this.scene.tweens.add({targets:[this.quote,this.ornament],alpha:1,duration:900,hold:4200,yoyo:true,onComplete:()=>{this.showing=false;if(this.near)this.scene.tweens.add({targets:this.prompt,alpha:1,duration:400});}});
  }
 }
}
