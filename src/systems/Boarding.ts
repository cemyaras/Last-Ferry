import Phaser from 'phaser';
import {Player} from '../entities/Player';
import {BOARDING,withinBoardingReach,type BoardingLayout} from '../scenes/boardingConfig';
import {createBoardingArt,type BoardingArtOptions} from '../assets/boarding';

/** Defaults are Kadıköy's gate to FerryScene; another pier supplies its own gate, label and destination. */
export interface BoardingOptions{layout:BoardingLayout;prompt:string;next:string;nextData?:object;art?:BoardingArtOptions;}
const KADIKOY:BoardingOptions={layout:BOARDING,prompt:'[E]  Karaköy vapuruna bin',next:'FerryScene'};

/** One terminal interaction leading onto a moored ferry. */
export class Boarding{
 state:'waiting'|'boarding'|'aboard'='waiting';
 /** While false, the gate offers nothing (for example before the first ferry has docked). */
 enabled=true;
 readonly ferry:Phaser.GameObjects.Image;
 readonly ropes:Phaser.GameObjects.Graphics;
 private prompt:Phaser.GameObjects.Text;
 private key:Phaser.Input.Keyboard.Key;
 private waterReflection:Phaser.GameObjects.Graphics;
 private elapsed=0;
 private waypoint=0;
 private near=false;
 private readonly path:{x:number;y:number}[];
 constructor(private scene:Phaser.Scene,private player:Player,private onBegin:()=>void,private options:BoardingOptions=KADIKOY){
  const B=options.layout;
  this.path=[{x:B.gateX,y:B.approachY},{x:B.gateX,y:525},{x:B.cabinX,y:B.deckY},{x:B.cabinX+10,y:B.deckY}];
  ({ferry:this.ferry,ropes:this.ropes}=createBoardingArt(scene,B,options.art));
  this.waterReflection=scene.add.graphics().setDepth(6.5);
  this.key=scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  this.prompt=scene.add.text(B.gateX,410,options.prompt,{fontFamily:'Georgia, serif',fontSize:'15px',color:'#e0d5b2',backgroundColor:'#14262dd9',padding:{x:11,y:7}}).setOrigin(.5).setDepth(60).setAlpha(0);
 }
 update(dt:number){
  const pressed=Phaser.Input.Keyboard.JustDown(this.key);
  this.elapsed+=dt;const B=this.options.layout;
  // The moored ferry moves only a fraction of a pixel against its gangway.
  this.ferry.y=B.ferryY+Math.sin(this.elapsed*.75)*.3;
  const g=this.waterReflection;g.clear();
  for(let j=0;j<10;j++)for(let k=0;k<8;k++){
   const x=this.ferry.x-145+k*39+Math.sin(j*2+k+this.elapsed)*4;
   g.lineStyle(1,0xc8af78,(1-j/11)*.1);g.lineBetween(x,477+j*2.6,x+12,477+j*2.6);
  }
  if(this.state==='waiting'){
   const near=this.enabled&&withinBoardingReach(this.player.x,this.player.y,B);
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
  this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,()=>this.scene.scene.start(this.options.next,this.options.nextData));
  this.scene.cameras.main.fadeOut(850,8,21,30);
 }
}
