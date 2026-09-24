import Phaser from 'phaser';

/** Anything that can show a short line sequence without overlapping its own text. */
export interface StoryVoice{readonly busy:boolean;say(lines:readonly string[],done?:()=>void):void;}
type Point={x:number;y:number};

/** A one-time moment that arrives by itself as the traveller passes; it never blocks movement or exits. */
export class StoryBeat{
 private played=false;
 private marker?:Phaser.GameObjects.Text;
 constructor(private scene:Phaser.Scene,private voice:StoryVoice,private lines:()=>readonly string[],private when:(player:Point)=>boolean,speaker?:Point,private onPlay?:()=>void){
  // A quiet ellipsis above whoever is speaking, so spoken lines have a source.
  if(speaker)this.marker=scene.add.text(speaker.x,speaker.y,'···',{fontFamily:'Georgia, serif',fontSize:'18px',color:'#d5cfb5'}).setOrigin(.5).setDepth(60).setAlpha(0);
 }
 get done(){return this.played;}
 /** `force` plays the beat as soon as the voice is free, wherever the traveller is. */
 update(player:Point,force=false){
  if(this.played||this.voice.busy||!(force||this.when(player)))return;
  this.played=true;this.onPlay?.();
  if(this.marker)this.scene.tweens.add({targets:this.marker,alpha:.85,duration:400});
  this.voice.say(this.lines(),()=>{if(this.marker)this.scene.tweens.add({targets:this.marker,alpha:0,duration:500});});
 }
}
