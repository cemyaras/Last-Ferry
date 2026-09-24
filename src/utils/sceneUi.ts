import Phaser from 'phaser';
import {SCENE_TIME} from '../scenes/config';

/** Shared typography and safe placement for the existing scenes. */
export function locationCaption(scene:Phaser.Scene,label:string,time=SCENE_TIME){
 scene.add.text(49,650,time,{fontFamily:'Georgia, serif',fontSize:'25px',color:'#d6d4c2'}).setDepth(60).setScrollFactor(0);
 return scene.add.text(50,684,label,{fontFamily:'Arial, sans-serif',fontSize:'10px',color:'#99abae'}).setDepth(60).setScrollFactor(0);
}
/** Shows lines one after another in the same screen-fixed text; each holds longer the longer it is. */
export function playLines(scene:Phaser.Scene,text:Phaser.GameObjects.Text,lines:readonly string[],done?:()=>void,companions:Phaser.GameObjects.GameObject[]=[]){
 const targets=[text,...companions];scene.tweens.killTweensOf(targets);
 const next=(i:number)=>{
  if(i>=lines.length){done?.();return;}
  text.setText(lines[i]);for(const target of targets)(target as Phaser.GameObjects.Text).setAlpha(0);
  scene.tweens.add({targets,alpha:1,duration:550,hold:1500+lines[i].length*45,yoyo:true,onComplete:()=>next(i+1)});
 };
 next(0);
}
export function lookPrompt(scene:Phaser.Scene){
 return scene.add.text(0,0,'[E]  Bak',{fontFamily:'Georgia, serif',fontSize:'15px',color:'#d5cfb5',backgroundColor:'#15242bbb',padding:{x:10,y:6}}).setOrigin(.5).setDepth(60).setAlpha(0);
}
export function observationLine(scene:Phaser.Scene){
 return scene.add.text(640,635,'',{fontFamily:'Georgia, serif',fontSize:'22px',fontStyle:'italic',color:'#e1d8bc',shadow:{offsetX:0,offsetY:2,color:'#06111b',blur:8,fill:true}}).setOrigin(.5).setDepth(60).setAlpha(0).setScrollFactor(0);
}
export function placePrompt(scene:Phaser.Scene,prompt:Phaser.GameObjects.Text,x:number,y:number){
 const camera=scene.cameras.main,margin=prompt.width/2+18;
 prompt.setPosition(Phaser.Math.Clamp(x,camera.scrollX+margin,camera.scrollX+camera.width-margin),y);
}
