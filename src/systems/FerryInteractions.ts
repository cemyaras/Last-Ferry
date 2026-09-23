import Phaser from 'phaser';
import {lookPrompt,observationLine,placePrompt} from '../utils/sceneUi';
import {Player} from '../entities/Player';
export class FerryInteractions{
 private key:Phaser.Input.Keyboard.Key;
 private prompt:Phaser.GameObjects.Text;
 private line:Phaser.GameObjects.Text;
 private activeLine=false;
 private exitUsed=false;
 constructor(private scene:Phaser.Scene,private disembark:()=>void){
  this.key=scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  this.prompt=lookPrompt(scene);
  this.line=observationLine(scene);
 }
 hide(){this.scene.tweens.killTweensOf(this.line);this.line.setAlpha(0);this.prompt.setAlpha(0);this.activeLine=false;}
 get busy(){return this.activeLine;}
 update(player:Player,arrived:boolean){
  const pressed=Phaser.Input.Keyboard.JustDown(this.key);
  let target:'rail'|'cabin'|'exit'|undefined;
  if(player.x>1104&&player.y>539&&player.y<620)target='exit';
  else if(player.x>730&&player.x<850&&player.y<553)target='rail';
  else if(Math.hypot(player.x-270,player.y-553)<69)target='cabin';
  this.prompt.setAlpha(target&&!this.activeLine?1:0);
  this.prompt.setText(target==='rail'?'[E]  Bak':target==='cabin'?'[E]  Salon':arrived?'[E]  Karaköy iskelesi':'[E]  Karaköy');
  placePrompt(this.scene,this.prompt,player.x,player.y-116);
  if(!target||!pressed||this.activeLine)return;
  if(target==='rail')this.say('“Boğaz geceleri her şeyi biraz uzaklaştırıyor.”');
  else if(target==='cabin')this.say('Salon kapısı kapalı. Biraz daha güvertede kal.');
  else if(!arrived)this.say('Karaköy’ün ışıkları yaklaşıyor.');
  else if(!this.exitUsed){this.exitUsed=true;this.disembark();}
  
 }
 say(text:string){
  this.scene.tweens.killTweensOf(this.line);this.prompt.setAlpha(0);this.activeLine=true;
  this.line.setText(text).setAlpha(0);
  this.scene.tweens.add({targets:this.line,alpha:1,duration:650,hold:3400,yoyo:true,onComplete:()=>{this.activeLine=false;}});
 }
}
