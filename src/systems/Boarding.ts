import Phaser from 'phaser';
import {Player} from '../entities/Player';
import {BOARDING as B,withinBoardingReach} from '../scenes/boardingConfig';
import {createBoardingArt} from '../assets/boarding';

/** One terminal interaction leading to the playable ferry deck. */
export class Boarding{
 state:'waiting'|'boarding'|'aboard'='waiting';
 private prompt:Phaser.GameObjects.Text;
 private key:Phaser.Input.Keyboard.Key;
 private ferry:Phaser.GameObjects.Image;
 private waterReflection:Phaser.GameObjects.Graphics;
 private elapsed=0;
 private waypoint=0;
 private near=false;
 private readonly path=[{x:B.gateX,y:B.approachY},{x:B.gateX,y:525},{x:B.cabinX,y:B.deckY},{x:B.cabinX+10,y:B.deckY}];
 constructor(private scene:Phaser.Scene,private player:Player,private onBegin:()=>void){
  this.ferry=createBoardingArt(scene);
  this.waterReflection=scene.add.graphics().setDepth(6.5);
  this.key=scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  this.prompt=scene.add.text(B.gateX,410,'[E]  Karaköy vapuruna bin',{fontFamily:'Georgia, serif',fontSize:'15px',color:'#e0d5b2',backgroundColor:'#14262dd9',padding:{x:11,y:7}}).setOrigin(.5).setDepth(60).setAlpha(0);
 }
 update(dt:number){
  const pressed=Phaser.Input.Keyboard.JustDown(this.key);
  this.elapsed+=dt;
  // The moored ferry moves only a fraction of a pixel against its gangway.
  this.ferry.y=B.ferryY+Math.sin(this.elapsed*.75)*.3;
  const g=this.waterReflection;g.clear();
  for(let j=0;j<10;j++)for(let k=0;k<8;k++){
   const x=B.ferryX-145+k*39+Math.sin(j*2+k+this.elapsed)*4;
   g.lineStyle(1,0xc8af78,(1-j/11)*.1);g.lineBetween(x,477+j*2.6,x+12,477+j*2.6);
  }
  if(this.state==='waiting'){
   const near=withinBoardingReach(this.player.x,this.player.y);
   if(near!==this.near){this.near=near;this.scene.tweens.killTweensOf(this.prompt);this.scene.tweens.add({targets:this.prompt,alpha:near?1:0,duration:250});}
   if(near&&pressed){
    this.state='boarding';this.scene.tweens.killTweensOf(this.prompt);this.prompt.setAlpha(0);this.onBegin();
    this.player.boardingTarget=this.path[0];
   }
  }else if(this.state==='boarding'){
   const destination=this.path[this.waypoint];
   if(Math.hypot(this.player.x-destination.x,this.player.y-destination.y)<.8){
    this.waypoint++;
    if(this.waypoint<this.path.length)this.player.boardingTarget=this.path[this.waypoint];
    else this.finish();
   }
  }
  return pressed;
 }
 private finish(){
  if(this.state!=='boarding')return;
  this.state='aboard';this.player.finishBoarding();
  this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,()=>this.scene.scene.start('FerryScene'));
  this.scene.cameras.main.fadeOut(850,8,21,30);
 }
}
