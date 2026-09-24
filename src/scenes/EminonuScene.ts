import Phaser from 'phaser';
import {createEnvironment} from '../assets/environment';
import {createEminonu,createEminonuFigures,TERMINAL_CLOCK} from '../assets/eminonu';
import {addPawTrail,createClueTextures} from '../assets/clues';
import {Player} from '../entities/Player';
import {Ay} from '../entities/StoryCharacters';
import {Atmosphere} from '../systems/Atmosphere';
import {Water} from '../systems/Water';
import {Interaction,type LookPoint} from '../systems/Interaction';
import {Boarding} from '../systems/Boarding';
import {Ambience} from '../systems/Ambience';
import {Dawn} from '../systems/Dawn';
import {StoryBeat} from '../story/StoryBeat';
import {BEATS,PROMPTS,STORY_TIMES} from '../story/lines';
import {locationCaption} from '../utils/sceneUi';
import {promenadeDepth,type Obstacle} from './promenade';
import {EMINONU,EMINONU_BOUNDS,EMINONU_OBSTACLES,EMINONU_LIGHTS,EMINONU_BOARDING,EMINONU_STAIRS,EMINONU_PAW_TRAIL,EMINONU_LOOKS,
 FERRY_OFFSCREEN_X,GOREVLI,SIMITCI,AY,WAIT_MINUTES,gorevliBox,simitciBox,ayBox,eminonuLight,eminonuLightOrigin,clockText} from './eminonuConfig';

type Phase='night'|'waiting'|'dawn'|'revealed'|'carrying';

/** Eminönü quay from night to dawn: the traveller waits for the first ferry, finds Ay and takes her home. */
export class EminonuScene extends Phaser.Scene{
 private player!:Player;
 private water!:Water;
 private atmosphere!:Atmosphere;
 private interaction!:Interaction;
 private boarding!:Boarding;
 private ambience!:Ambience;
 private dawn!:Dawn;
 private ay!:Ay;
 private boat!:Phaser.GameObjects.Image;
 private gate!:Phaser.GameObjects.Image;
 private plate!:Phaser.GameObjects.Image;
 private ramp!:Phaser.GameObjects.Image|undefined;
 private gorevli!:Phaser.GameObjects.Image;
 private simitci!:Phaser.GameObjects.Image;
 private hands!:Phaser.GameObjects.Graphics;
 private clock!:Phaser.GameObjects.Text;
 private gateBeat!:StoryBeat;
 private obstacles:Obstacle[]=[];
 private points:LookPoint[]=[];
 private gorevliFootprint!:Obstacle;
 private ayFootprint!:Obstacle;
 private phase:Phase='night';
 private arriving=false;
 private ascentStep=0;
 private minutes=WAIT_MINUTES.from;
 private elapsed=0;
 constructor(){super('EminonuScene');}
 init(data:{from?:string}={}){this.arriving=data.from==='GalataBridgeScene';this.phase='night';this.ascentStep=0;this.minutes=WAIT_MINUTES.from;this.elapsed=0;}
 preload(){this.ambience=new Ambience(this,{},true);this.ambience.preload();}
 create(){
  document.title='SON VAPUR — Eminönü';
  createEnvironment(this);
  this.add.image(0,0,'sky').setOrigin(0).setScrollFactor(0);
  this.dawn=new Dawn(this,{glowX:1080,moon:true});
  this.water=new Water(this,{showFerry:false});
  ({boat:this.boat,gate:this.gate,plate:this.plate}=createEminonu(this));
  createEminonuFigures(this);
  this.gorevliFootprint=gorevliBox();this.ayFootprint=ayBox();
  this.obstacles=[...EMINONU_OBSTACLES,this.gorevliFootprint];
  const start=this.arriving?EMINONU_STAIRS.path[0]:EMINONU_STAIRS.path[EMINONU_STAIRS.path.length-1];
  this.player=new Player(this,{startX:start.x,startY:start.y,facing:1,bounds:EMINONU_BOUNDS,obstacles:this.obstacles,
   light:(x,y)=>eminonuLight(x,y)*(1-this.atmosphere.daylight),lightOrigin:eminonuLightOrigin,boarding:EMINONU_BOARDING});
  if(this.arriving){this.ascentStep=1;this.player.boardingTarget=EMINONU_STAIRS.path[1];}
  this.atmosphere=new Atmosphere(this,{width:EMINONU.width,lamps:EMINONU_LIGHTS,texturePrefix:'eminonu-',terminalGlow:false});
  this.gorevli=this.add.image(GOREVLI.x,GOREVLI.y,'eminonu-gorevli').setOrigin(.5,108/112).setDepth(promenadeDepth(GOREVLI.y)).setFlipX(true).setName('gorevli');
  this.simitci=this.add.image(SIMITCI.fromX,SIMITCI.y,'eminonu-simitci').setOrigin(.5,108/112).setDepth(promenadeDepth(SIMITCI.y)).setName('simitci');
  createClueTextures(this);
  addPawTrail(this,'eminonu-paw-trail',EMINONU_PAW_TRAIL,10.6,1627);
  this.ay=new Ay(this,AY.x,AY.y);
  this.points=[EMINONU_LOOKS.boat,{...EMINONU_LOOKS.wait,prompt:PROMPTS.wait,onLook:()=>this.wait()}];
  this.interaction=new Interaction(this,this.points);
  this.gateBeat=new StoryBeat(this,this.interaction,BEATS.eminonuGate,p=>p.x>EMINONU_LOOKS.gateClueX);
  this.boarding=new Boarding(this,this.player,()=>this.interaction.hide(),{layout:EMINONU_BOARDING,prompt:PROMPTS.board,next:'KadikoyDawnScene',nextData:{from:'EminonuScene'},
   art:{ferryKey:'kadikoy-ferry',route:'KADIKÖY',sign:'KADIKÖY',signKey:'boarding-sign-kadikoy'}});
  this.boarding.enabled=false;
  // Before dawn the pier is empty: the ferry is still out on the water and the gangway is raised.
  this.boarding.ferry.setX(FERRY_OFFSCREEN_X);this.boarding.ropes.setVisible(false);
  this.ramp=this.children.list.find(child=>(child as Phaser.GameObjects.Image).texture?.key==='boarding-ramp') as Phaser.GameObjects.Image|undefined;
  this.ramp?.setAlpha(0);
  this.hands=this.add.graphics().setDepth(10.4);this.drawHands();
  locationCaption(this,'E M İ N Ö N Ü',STORY_TIMES.eminonu);
  this.clock=this.children.getByName('scene-clock') as Phaser.GameObjects.Text;
  this.cameras.main.setBounds(0,0,EMINONU.width,EMINONU.height).setScroll(0,0);
  this.input.keyboard!.resetKeys();
  this.game.canvas.setAttribute('tabindex','0');
  this.game.canvas.setAttribute('aria-label','Son Vapur. Eminönü before dawn. WASD or arrow keys to walk. E to look at the balık ekmek boat, wait on the bench for the first ferry, pick up the cat and board for Kadıköy.');
  this.input.once('pointerdown',()=>this.ambience.start());this.input.keyboard!.once('keydown',()=>this.ambience.start());
  this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.ambience.destroy());
  this.cameras.main.fadeIn(this.arriving?1600:1000,8,21,30);
 }
 update(_time:number,delta:number){
  if(!this.player)return;const dt=Math.min(delta/1000,.05);this.elapsed+=dt;
  this.advanceAscent();
  const pressed=this.boarding.update(dt);
  this.player.update(dt);
  this.ay.update(dt,this.player);
  this.boat.setY(512+Math.sin(this.elapsed*.8)*.8).setRotation(Math.sin(this.elapsed*.55)*.004);
  this.gorevli.setScale(1,1+Math.sin(this.elapsed*1.05)*.003);
  this.gorevliFootprint.left=this.gorevli.x-12;this.gorevliFootprint.right=this.gorevli.x+12;
  const camera=this.cameras.main,target=Phaser.Math.Clamp(this.player.x-640,0,EMINONU.width-1280);
  camera.scrollX=Phaser.Math.Linear(camera.scrollX,target,1-Math.exp(-dt*1.8));
  this.water.update(dt,camera.scrollX);this.atmosphere.update(dt);
  if(this.player.boardingTarget||this.boarding.state!=='waiting')return;
  if(this.phase==='night')this.gateBeat.update(this.player);
  if(this.phase==='dawn'&&!this.interaction.busy&&Math.hypot(this.player.x-AY.x,this.player.y-AY.y)<AY.revealRange)this.reveal();
  this.interaction.update(this.player,pressed);
 }
 private advanceAscent(){
  const target=this.player.boardingTarget;
  if(!this.arriving||this.ascentStep===0||!target||Math.hypot(this.player.x-target.x,this.player.y-target.y)>=.8)return;
  this.player.x=target.x;this.player.y=target.y;this.ascentStep++;
  this.player.boardingTarget=EMINONU_STAIRS.path[this.ascentStep];
  if(!this.player.boardingTarget){this.ascentStep=0;this.input.keyboard!.resetKeys();}
 }
 /** The fisherman's patience, practised: the night passes on the bench and the first ferry comes in. */
 private wait(){
  if(this.phase!=='night')return;this.phase='waiting';
  this.points.splice(this.points.findIndex(point=>point.prompt===PROMPTS.wait),1);
  this.player.boardingTarget={x:this.player.x,y:this.player.y};
  this.interaction.say(BEATS.eminonuWait());
  const passing=9000,start=1800;
  this.tweens.addCounter({from:0,to:1,delay:start,duration:passing,ease:'Sine.easeInOut',
   onUpdate:tween=>{const v=tween.getValue()??0;this.minutes=Phaser.Math.Linear(WAIT_MINUTES.from,WAIT_MINUTES.to,v);this.clock.setText(clockText(this.minutes));this.drawHands();
    this.dawn.progress=v;this.atmosphere.daylight=Phaser.Math.Clamp((v-.25)/.7,0,1);},
   onComplete:()=>this.openGate()});
  this.tweens.add({targets:this.simitci,x:SIMITCI.x,delay:start+2500,duration:6200,ease:'Sine.easeOut',onComplete:()=>this.obstacles.push(simitciBox())});
  this.tweens.add({targets:this.boarding.ferry,x:EMINONU_BOARDING.ferryX,delay:start+passing-4200,duration:4000,ease:'Cubic.easeOut',
   onStart:()=>this.ambience.play('ferry-horn'),
   onComplete:()=>{this.boarding.ropes.setVisible(true);if(this.ramp)this.tweens.add({targets:this.ramp,alpha:1,duration:700});}});
 }
 private openGate(){
  this.tweens.add({targets:this.gorevli,x:GOREVLI.gateX,y:GOREVLI.gateY,duration:1500,ease:'Sine.easeInOut',
   onUpdate:()=>this.gorevli.setDepth(promenadeDepth(this.gorevli.y)),
   onComplete:()=>{
    this.tweens.add({targets:this.plate,alpha:0,duration:300});
    this.tweens.add({targets:this.gate,scaleX:.16,duration:1100,ease:'Sine.easeInOut',onComplete:()=>{
     this.ay.appear();this.obstacles.push(this.ayFootprint);
     this.interaction.say(BEATS.eminonuGateOpens(),()=>{this.phase='dawn';this.player.boardingTarget=undefined;this.input.keyboard!.resetKeys();});
    }});
   }});
 }
 /** The first sight of Ay; the moon leaves the sky at the same moment. */
 private reveal(){
  this.phase='revealed';this.ay.look();this.dawn.fadeMoon(3400);
  this.interaction.say(BEATS.eminonuReveal(),()=>this.points.push({...EMINONU_LOOKS.pickUp,prompt:PROMPTS.pickUp,onLook:()=>this.pickUp()}));
 }
 private pickUp(){
  if(this.phase!=='revealed')return;this.phase='carrying';
  this.points.splice(this.points.findIndex(point=>point.prompt===PROMPTS.pickUp),1);
  this.obstacles.splice(this.obstacles.indexOf(this.ayFootprint),1);
  this.ay.pickUp();
  this.interaction.say(BEATS.eminonuPickUp(),()=>{this.boarding.enabled=true;});
 }
 private drawHands(){
  const {x,y,r}=TERMINAL_CLOCK,g=this.hands,m=this.minutes,hour=(m/60%12)/12*Math.PI*2-Math.PI/2,minute=(m%60)/60*Math.PI*2-Math.PI/2;
  g.clear();g.lineStyle(2,0x26302c,1);g.lineBetween(x,y,x+Math.cos(hour)*r*.5,y+Math.sin(hour)*r*.5);
  g.lineStyle(1.3,0x26302c,1);g.lineBetween(x,y,x+Math.cos(minute)*r*.78,y+Math.sin(minute)*r*.78);g.fillStyle(0x26302c,1);g.fillCircle(x,y,1.4);
 }
}
