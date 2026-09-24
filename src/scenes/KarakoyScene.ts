import Phaser from 'phaser';
import {createEnvironment} from '../assets/environment';
import {createKarakoy} from '../assets/karakoy';
import {Player} from '../entities/Player';
import {KarakoyResidents} from '../entities/KarakoyResidents';
import {Atmosphere} from '../systems/Atmosphere';
import {Water} from '../systems/Water';
import {Interaction} from '../systems/Interaction';
import {Ambience} from '../systems/Ambience';
import {locationCaption} from '../utils/sceneUi';
import {promenadeDepth} from './promenade';
import {addPawTrail,createClueTextures} from '../assets/clues';
import {StoryBeat} from '../story/StoryBeat';
import {BEATS,STORY_TIMES} from '../story/lines';
import {hasFlag} from '../story/state';
import {KARAKOY,STREET_BOUNDS,STREET_OBSTACLES,STREET_LIGHTS,STREET_LOOKS,ARRIVAL_PATH,MOORED_FERRY,BRIDGE_EXIT,BRIDGE_EXIT_WALK_X,RESIDENT_WITNESS,FOOD_BOWL,KARAKOY_PAW_TRAIL,streetLight,streetLightOrigin} from './karakoyConfig';

/** First waterfront lane; its left end leads onto Galata Bridge, its closed uphill gate stays shut. */
export class KarakoyScene extends Phaser.Scene{
 private player!:Player;
 private water!:Water;
 private atmosphere!:Atmosphere;
 private interaction!:Interaction;
 private residents!:KarakoyResidents;
 private ambience!:Ambience;
 private ferry!:Phaser.GameObjects.Image;
 private arriving=false;
 private arrivalStep=0;
 private elapsed=0;
 private leaving=false;
 private witnessBeat!:StoryBeat;
 constructor(){super('KarakoyScene');}
 init(data:{from?:string}={}){this.arriving=data.from==='FerryScene';this.arrivalStep=0;this.elapsed=0;this.leaving=false;}
 preload(){this.ambience=new Ambience(this);this.ambience.preload();}
 create(){
  document.title='SON VAPUR — Karaköy';
  createEnvironment(this);
  this.add.image(0,0,'sky').setOrigin(0).setScrollFactor(0);
  this.add.image(-500,0,'distant-city').setOrigin(0).setDepth(.8).setScrollFactor(.15);
  // From this bank, the historical peninsula sits across the water; Galata is uphill.
  this.add.image(-470,0,'skyline').setOrigin(0).setDepth(2.1).setAlpha(.7).setScrollFactor(.28);
  this.water=new Water(this,{showFerry:false});
  this.ferry=createKarakoy(this);
  const start=this.arriving?ARRIVAL_PATH[0]:{x:KARAKOY.startX,y:KARAKOY.startY};
  this.player=new Player(this,{startX:start.x,startY:start.y,facing:1,bounds:STREET_BOUNDS,obstacles:STREET_OBSTACLES,light:streetLight,lightOrigin:streetLightOrigin});
  if(this.arriving){this.arrivalStep=1;this.player.boardingTarget=ARRIVAL_PATH[1];}
  this.residents=new KarakoyResidents(this);
  this.atmosphere=new Atmosphere(this,{width:KARAKOY.width,lamps:STREET_LIGHTS,texturePrefix:'karakoy-',terminalGlow:false});
  this.interaction=new Interaction(this,[{...BRIDGE_EXIT,prompt:'[E]  Galata Köprüsü',onLook:()=>this.leaveForBridge()},...STREET_LOOKS]);
  createClueTextures(this);
  this.add.image(FOOD_BOWL.x,FOOD_BOWL.y,'clue-bowl').setOrigin(.5,9/12).setDepth(promenadeDepth(FOOD_BOWL.y));
  addPawTrail(this,'karakoy-paw-trail',KARAKOY_PAW_TRAIL,10.6,319);
  this.witnessBeat=new StoryBeat(this,this.interaction,()=>BEATS.karakoyResident(hasFlag(this,'sawPoster')),p=>Math.abs(p.x-RESIDENT_WITNESS.x)<RESIDENT_WITNESS.range,{x:RESIDENT_WITNESS.x,y:RESIDENT_WITNESS.y-122});
  locationCaption(this,'K A R A K Ö Y',STORY_TIMES.karakoy);
  this.cameras.main.setBounds(0,0,KARAKOY.width,KARAKOY.height).setScroll(0,0);
  this.input.keyboard!.resetKeys();
  this.game.canvas.setAttribute('tabindex','0');
  this.game.canvas.setAttribute('aria-label','Son Vapur. Karaköy. WASD or arrow keys to walk. E to look at the ferry terminal, the empty bowl at the closed shop or the uphill street. E at the left end: walk onto Galata Bridge.');
  this.input.once('pointerdown',()=>this.ambience.start());this.input.keyboard!.once('keydown',()=>this.ambience.start());
  this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.ambience.destroy());
  this.cameras.main.fadeIn(1000,8,21,30);
 }
 update(_time:number,delta:number){
  if(!this.player)return;const dt=Math.min(delta/1000,.05);this.elapsed+=dt;
  this.advanceArrival();
  this.player.update(dt);
  this.ferry.y=MOORED_FERRY.y+Math.sin(this.elapsed*.75)*.3;
  const camera=this.cameras.main,target=Phaser.Math.Clamp(this.player.x-1280*.44,0,KARAKOY.width-1280);
  camera.scrollX=Phaser.Math.Linear(camera.scrollX,target,1-Math.exp(-dt*1.8));
  this.water.update(dt,camera.scrollX);this.atmosphere.update(dt);this.residents.update(dt);if(!this.leaving){this.witnessBeat.update(this.player);this.interaction.update(this.player);}
 }
 /** Reuses the traveller's authored-path walk; normal controls resume at the lane. */
 private advanceArrival(){
  const target=this.player.boardingTarget;
  if(this.leaving||!target||Math.hypot(this.player.x-target.x,this.player.y-target.y)>=.8)return;
  this.player.x=target.x;this.player.y=target.y;
  this.arrivalStep++;
  this.player.boardingTarget=ARRIVAL_PATH[this.arrivalStep];
  if(!this.player.boardingTarget)this.input.keyboard!.resetKeys();
 }
 /** The traveller keeps walking past the terminal toward the bridge as the lane fades. */
 private leaveForBridge(){
  if(this.leaving)return;this.leaving=true;this.interaction.hide();
  this.player.boardingTarget={x:BRIDGE_EXIT_WALK_X,y:this.player.y};
  this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,()=>this.scene.start('GalataBridgeScene',{from:'KarakoyScene'}));
  this.cameras.main.fadeOut(900,8,21,30);
 }
}
