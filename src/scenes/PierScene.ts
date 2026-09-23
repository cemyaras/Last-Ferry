import Phaser from 'phaser';
import {createEnvironment,addPierObjects} from '../assets/environment';
import {locationCaption} from '../utils/sceneUi';
import {Player} from '../entities/Player';
import {Water} from '../systems/Water';
import {Atmosphere} from '../systems/Atmosphere';
import {Interaction} from '../systems/Interaction';
import {Boarding} from '../systems/Boarding';
import {Ambience} from '../systems/Ambience';
import {PIER,PARALLAX,SCENE_TIME} from './config';
export class PierScene extends Phaser.Scene{
 private player!:Player;
 private water!:Water;
 private atmosphere!:Atmosphere;
 private interaction!:Interaction;
 private boarding!:Boarding;
 private ambience!:Ambience;
 private movementHint!:Phaser.GameObjects.Text;
 private hintDismissed=false;
 constructor(){super('pier');}
 preload(){this.ambience=new Ambience(this);this.ambience.preload();}
 create(){
  document.title=`SON VAPUR — Kadıköy, ${SCENE_TIME}`;
  createEnvironment(this);
  this.add.image(0,0,'sky').setOrigin(0).setScrollFactor(0);
  this.add.image(0,0,'distant-city').setOrigin(0).setDepth(.8).setScrollFactor(.15);
  this.add.image(0,0,'skyline').setOrigin(0).setDepth(2.1).setScrollFactor(PARALLAX.skyline);
  this.water=new Water(this);
  this.add.image(0,0,'pier').setOrigin(0).setDepth(10);
  addPierObjects(this);
  this.add.image(0,0,'foreground').setOrigin(0).setDepth(30).setScrollFactor(PARALLAX.foreground);
  this.player=new Player(this);
  this.atmosphere=new Atmosphere(this);
  this.interaction=new Interaction(this);
  this.boarding=new Boarding(this,this.player,()=>this.interaction.hide());
  this.createType();
  this.cameras.main.setBounds(0,0,PIER.width,PIER.height);
  this.cameras.main.scrollX=Phaser.Math.Clamp(this.player.x-PIER.viewWidth*.48,0,PIER.width-PIER.viewWidth);
  const canvas=this.game.canvas;canvas.setAttribute('tabindex','0');canvas.setAttribute('aria-label','Son Vapur. W / A / S / D or arrow keys: walk along and across the promenade. E near the bench: look. E at the left ferry pier: board for Karaköy.');
  this.input.once('pointerdown',()=>this.ambience.start());
  this.input.keyboard!.once('keydown',()=>this.ambience.start());
  this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.ambience.destroy());
  this.cameras.main.fadeIn(1000,9,18,27);
 }
 private createType(){
  locationCaption(this,'K A D I K Ö Y');
  this.movementHint=this.add.text(1231,679,'W A S D  ·  ↑ ← ↓ →     Yürü',{fontFamily:'Arial, sans-serif',fontSize:'10px',color:'#8e9fa3'}).setOrigin(1,0).setDepth(60).setAlpha(.7).setScrollFactor(0);
 }
 update(_time:number,delta:number){
  if(!this.player)return;
  const dt=Math.min(delta/1000,.05);
  const interactPressed=this.boarding.update(dt);
  this.player.update(dt);
  // Frame-rate independent damping, no vertical bob transferred to the camera.
  const camera=this.cameras.main;
  const target=Phaser.Math.Clamp(this.player.x-PIER.viewWidth*.48,0,PIER.width-PIER.viewWidth);
  camera.scrollX=Phaser.Math.Linear(camera.scrollX,target,1-Math.exp(-dt*1.8));
  if(!this.hintDismissed&&Math.hypot(this.player.velocity,this.player.velocityY)>8){this.hintDismissed=true;this.tweens.add({targets:this.movementHint,alpha:0,delay:650,duration:1600});}
  this.water.update(dt,camera.scrollX);this.atmosphere.update(dt);if(this.boarding.state==='waiting')this.interaction.update(this.player,interactPressed);
 }
}
