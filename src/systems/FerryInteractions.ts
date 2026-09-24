import Phaser from 'phaser';
import {lookPrompt,observationLine,placePrompt,playLines} from '../utils/sceneUi';
import {Player} from '../entities/Player';
import {FERRY_LINES} from '../story/lines';
import {MILK_CUP} from '../scenes/ferryConfig';
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
  let target:'rail'|'cabin'|'cup'|'exit'|undefined;
  if(player.x>1104&&player.y>539&&player.y<620)target='exit';
  else if(player.x>730&&player.x<850&&player.y<553)target='rail';
  else if(Math.hypot(player.x-270,player.y-553)<69)target='cabin';
  else if(Math.hypot(player.x-MILK_CUP.x,player.y-MILK_CUP.y-20)<52)target='cup';
  this.prompt.setAlpha(target&&!this.activeLine?1:0);
  this.prompt.setText(target==='rail'||target==='cup'?'[E]  Bak':target==='cabin'?'[E]  Salon':arrived?'[E]  Karaköy iskelesi':'[E]  Karaköy');
  placePrompt(this.scene,this.prompt,player.x,player.y-116);
  if(!target||!pressed||this.activeLine)return;
  if(target==='rail')this.say(FERRY_LINES.railing);
  else if(target==='cabin')this.say(FERRY_LINES.cabin);
  else if(target==='cup')this.say(FERRY_LINES.cup);
  else if(!arrived)this.say(FERRY_LINES.exitUnderway);
  else if(!this.exitUsed){this.exitUsed=true;this.disembark();}
 }
 say(lines:string|readonly string[],done?:()=>void){
  this.prompt.setAlpha(0);this.activeLine=true;
  playLines(this.scene,this.line,typeof lines==='string'?[lines]:lines,()=>{this.activeLine=false;done?.();});
 }
}
