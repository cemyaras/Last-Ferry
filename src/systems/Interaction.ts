import Phaser from 'phaser';
import {Player} from '../entities/Player';
import {PIER} from '../scenes/config';
import {PIER_OBJECTS} from '../scenes/promenade';
const BENCH=PIER_OBJECTS.find(object=>object.id==='bench-0')!;
/** One proximity interaction; intentionally no dialogue tree or quest state. */
export class Interaction{
 private prompt:Phaser.GameObjects.Text;
 private quote:Phaser.GameObjects.Text;
 private ornament:Phaser.GameObjects.Text;
 private key:Phaser.Input.Keyboard.Key;
 private showing=false;
 private near=false;
 constructor(private scene:Phaser.Scene){
  this.key=scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  this.prompt=scene.add.text(PIER.benchX,478,'[E]  Bak',{fontFamily:'Georgia, serif',fontSize:'15px',color:'#d5cfb5',backgroundColor:'#15242bbb',padding:{x:10,y:6}}).setOrigin(.5).setDepth(60).setAlpha(0);
  this.quote=scene.add.text(640,635,'“Şehir gece olunca başka türlü konuşuyor.”',{fontFamily:'Georgia, serif',fontSize:'22px',fontStyle:'italic',color:'#e1d8bc',shadow:{offsetX:0,offsetY:2,color:'#06111b',blur:8,fill:true}}).setOrigin(.5).setDepth(60).setAlpha(0);
  this.quote.setScrollFactor(0);
  this.ornament=scene.add.text(640,608,'—',{fontFamily:'Georgia, serif',fontSize:'18px',color:'#a79774'}).setOrigin(.5).setDepth(60).setAlpha(0).setScrollFactor(0);
 }
 hide(){this.scene.tweens.killTweensOf([this.prompt,this.quote,this.ornament]);this.prompt.setAlpha(0);this.quote.setAlpha(0);this.ornament.setAlpha(0);}
 update(player:Player){
  const near=Math.hypot(player.x-PIER.benchX,player.y-BENCH.sortY)<PIER.interactionRadius;
  if(near)this.prompt.setY(Math.min(478,player.y-116));
  if(near!==this.near){this.near=near;this.scene.tweens.killTweensOf(this.prompt);this.scene.tweens.add({targets:this.prompt,alpha:near&&!this.showing?1:0,duration:300});}
  if(near&&!this.showing&&Phaser.Input.Keyboard.JustDown(this.key)){this.showing=true;this.prompt.setAlpha(0);
   this.scene.tweens.add({targets:[this.quote,this.ornament],alpha:1,duration:900,hold:4200,yoyo:true,onComplete:()=>{this.showing=false;if(this.near)this.scene.tweens.add({targets:this.prompt,alpha:1,duration:400});}});
  }
 }
}
