import Phaser from 'phaser';
import {createEnvironment} from '../assets/environment';
import {createKarakoyWaterfront} from '../assets/karakoy';
import {FerryJourney} from '../systems/FerryJourney';
import {createFerryDeck} from '../assets/ferryDeck';
import {Player} from '../entities/Player';
import {FerryPassengers} from '../entities/FerryPassengers';
import {Water} from '../systems/Water';
import {FerryWeather} from '../systems/FerryWeather';
import {FerryInteractions} from '../systems/FerryInteractions';
import {Ambience} from '../systems/Ambience';
import {locationCaption} from '../utils/sceneUi';
import {FERRY,DECK_BOUNDS,DECK_OBSTACLES,MILK_CUP,PASSENGER_WITNESS,deckLight,deckLightOrigin} from './ferryConfig';
import {promenadeDepth} from './promenade';
import {createClueTextures} from '../assets/clues';
import {StoryBeat} from '../story/StoryBeat';
import {BEATS,FERRY_LINES,STORY_TIMES} from '../story/lines';
import {hasFlag} from '../story/state';

export class FerryScene extends Phaser.Scene{
 private player!:Player;
 private water!:Water;
 private weather!:FerryWeather;
 private passengers!:FerryPassengers;
 private interactions!:FerryInteractions;
 private ambience!:Ambience;
 private skyline!:Phaser.GameObjects.Image;
 private distant!:Phaser.GameObjects.Image;
 private route!:Phaser.GameObjects.Text;
 private elapsed=0;
 private journey=new FerryJourney();
 private waterfront!:Phaser.GameObjects.Image;
 private exitLight!:Phaser.GameObjects.Graphics;
 private hornSounded=false;
 private drift=0;
 private arrived=false;
 private leaving=false;
 private arrivalAnnounced=false;
 private witnessBeat!:StoryBeat;
 constructor(){super('FerryScene');}
 preload(){this.ambience=new Ambience(this,{},true);this.ambience.preload();}
 create(){
  this.journey=new FerryJourney();this.hornSounded=false;this.elapsed=0;this.drift=0;this.arrived=false;this.leaving=false;this.arrivalAnnounced=false;
  document.title='SON VAPUR — Kadıköy → Karaköy';
  createEnvironment(this);
  this.add.image(0,0,'sky').setOrigin(0);
  this.distant=this.add.image(0,-15,'distant-city').setOrigin(0).setDepth(.8);
  this.skyline=this.add.image(0,0,'skyline').setOrigin(0).setDepth(2.1);
  this.water=new Water(this,{showFerry:false,planeHeight:390,hullWash:true});
  createKarakoyWaterfront(this);
  this.waterfront=this.add.image(190,12,'karakoy-waterfront').setOrigin(0).setDepth(5.5).setAlpha(0).setScale(.8);
  createFerryDeck(this);
  this.exitLight=this.add.graphics().setDepth(14);
  this.player=new Player(this,{startX:FERRY.startX,startY:FERRY.startY,facing:1,bounds:DECK_BOUNDS,obstacles:DECK_OBSTACLES,light:deckLight,lightOrigin:deckLightOrigin});
  this.passengers=new FerryPassengers(this);this.weather=new FerryWeather(this);
  this.interactions=new FerryInteractions(this,()=>this.disembark());
  createClueTextures(this);
  this.add.image(MILK_CUP.x,MILK_CUP.y,'clue-cup').setOrigin(.5,14/16).setDepth(promenadeDepth(MILK_CUP.y));
  this.witnessBeat=new StoryBeat(this,this.interactions,()=>BEATS.ferryPassenger(hasFlag(this,'sawPoster')),p=>Math.abs(p.x-PASSENGER_WITNESS.x)<88,{x:PASSENGER_WITNESS.x,y:PASSENGER_WITNESS.y-120});
  this.route=locationCaption(this,'KADIKÖY  →  KARAKÖY',STORY_TIMES.ferry);
  this.input.keyboard!.resetKeys();
  this.game.canvas.setAttribute('aria-label','Son Vapur ferry deck. WASD or arrow keys to walk. E to look by the railing, under the bench, at the cabin door or the Karaköy exit.');
  this.input.once('pointerdown',()=>this.ambience.start());this.input.keyboard!.once('keydown',()=>this.ambience.start());
  this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.ambience.destroy());
  this.cameras.main.fadeIn(1000,8,21,30);
  this.time.delayedCall(1200,()=>this.interactions.say(FERRY_LINES.intro));
 }
 update(_time:number,delta:number){
  if(!this.player)return;
  const dt=Math.min(delta/1000,.05);this.elapsed+=dt;
  if(!this.leaving)this.player.update(dt);
  this.journey.update(dt);
  const speed=this.journey.speed,approach=this.journey.approach,docking=this.journey.docking;
  this.drift=this.journey.distance;
  const reveal=approach*approach*(3-2*approach);
  this.waterfront.setAlpha(reveal*.92).setScale(.8+reveal*.16).setPosition(190-reveal*240,12+reveal*5);
  if(approach>.12&&!this.hornSounded){this.hornSounded=true;this.ambience.play('ferry-horn');}
  this.exitLight.clear();if(this.arrived){this.exitLight.fillStyle(0xd2b577,.075);this.exitLight.fillEllipse(1155,580,95,31);}
  this.skyline.x=-this.drift;this.distant.x=-this.drift*.4;
  // The ship stays grounded for movement, while the distant horizon rises and
  // falls slightly against its structure. Tiny engine vibration fades on arrival.
  const engine=Math.min(1,speed/2),underway=.2+.8*engine;
  const roll=Math.sin(this.elapsed*.64)*.0013*underway;
  this.skyline.setY(Math.sin(this.elapsed*.64)*1.35*underway).setRotation(roll);
  this.distant.setY(-15+Math.sin(this.elapsed*.64)*.85*underway).setRotation(roll*.7);
  this.water.update(dt,-this.drift/.3,speed*8);this.weather.update(dt,underway);this.passengers.update(dt);
  const mooring=docking>0&&docking<1?Math.sin(docking*Math.PI*4)*(1-docking)*.0018:0;
  this.cameras.main.setRotation(Math.sin(this.elapsed*.42)*.0006*underway+Math.sin(this.elapsed*13)*.00006*engine+mooring);
  // The witness speaks when the traveller walks past, or by the time the waterfront appears.
  if(!this.leaving){this.witnessBeat.update(this.player,approach>.2);this.interactions.update(this.player,this.arrived);}
  if(!this.arrived&&this.journey.arrived){this.arrived=true;this.route.setText('KARAKÖY İSKELESİ');}
  if(this.arrived&&!this.arrivalAnnounced&&!this.interactions.busy){this.arrivalAnnounced=true;this.interactions.say(FERRY_LINES.arrival);}
 }
 private disembark(){
  if(this.leaving||!this.arrived)return;
  this.leaving=true;
  this.player.update(0);this.interactions.hide();
  this.game.events.emit('karakoy-arrival',{from:'FerryScene'});
  this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,()=>this.scene.start('KarakoyScene',{from:'FerryScene'}));
  this.cameras.main.fadeOut(850,8,21,30);
 }
}
