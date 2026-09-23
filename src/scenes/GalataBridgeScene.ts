import Phaser from 'phaser';
import {createEnvironment} from '../assets/environment';
import {createGalataBridge} from '../assets/galataBridge';
import {Player} from '../entities/Player';
import {BridgeLocals} from '../entities/BridgeLocals';
import {Atmosphere} from '../systems/Atmosphere';
import {Water} from '../systems/Water';
import {Interaction,type LookPoint} from '../systems/Interaction';
import {Ambience} from '../systems/Ambience';
import {BridgeMotion} from '../systems/BridgeMotion';
import {locationCaption} from '../utils/sceneUi';
import {BRIDGE,BRIDGE_BOUNDS,BRIDGE_OBSTACLES,BRIDGE_LIGHTS,BRIDGE_LOOKS,bridgeLight,bridgeLightOrigin} from './galataBridgeConfig';

type ScreenLayer={object:Phaser.GameObjects.Components.Transform;x:number;y:number;scaleX:number;scaleY:number};

/** Galata Bridge from Karaköy toward Eminönü; the closed walkway at the far end is the current content boundary. */
export class GalataBridgeScene extends Phaser.Scene{
 private player!:Player;
 private water!:Water;
 private atmosphere!:Atmosphere;
 private interaction!:Interaction;
 private locals!:BridgeLocals;
 private motion!:BridgeMotion;
 private ambience!:Ambience;
 private arriving=false;
 private widening=false;
 private widenMix=0;
 private screenLayers:ScreenLayer[]=[];
 private appliedZoom=1;
 constructor(){super('GalataBridgeScene');}
 init(data:{from?:string}={}){this.arriving=data.from==='KarakoyScene';this.widening=false;this.widenMix=0;this.appliedZoom=1;}
 preload(){this.ambience=new Ambience(this);this.ambience.preload();}
 create(){
  document.title='SON VAPUR — Galata Köprüsü';
  createEnvironment(this);
  this.add.image(0,0,'sky').setOrigin(0).setScrollFactor(0);
  this.water=new Water(this);
  createGalataBridge(this);
  const start=this.arriving?BRIDGE.entryX:BRIDGE.startX;
  this.player=new Player(this,{startX:start,startY:BRIDGE.startY,facing:-1,bounds:BRIDGE_BOUNDS,obstacles:BRIDGE_OBSTACLES,light:bridgeLight,lightOrigin:bridgeLightOrigin});
  // Walks in from the Karaköy end on the shared authored-path movement, then controls resume.
  if(this.arriving)this.player.boardingTarget={x:BRIDGE.startX,y:BRIDGE.startY};
  this.locals=new BridgeLocals(this);
  this.motion=new BridgeMotion(this);
  this.atmosphere=new Atmosphere(this,{width:BRIDGE.width,lamps:BRIDGE_LIGHTS,texturePrefix:'bridge-',terminalGlow:false,wind:.3});
  const points:LookPoint[]=BRIDGE_LOOKS.map(point=>point.id==='middle'?{...point,onLook:()=>this.widen()}:point);
  this.interaction=new Interaction(this,points);
  locationCaption(this,'G A L A T A   K Ö P R Ü S Ü');
  // Vertical margin lets the brief wide view zoom out around the horizon instead of clamping upward.
  this.cameras.main.setZoom(1).setBounds(0,-80,BRIDGE.width,BRIDGE.height+160).setScroll(BRIDGE.width-1280,0);
  this.input.keyboard!.resetKeys();
  this.game.canvas.setAttribute('tabindex','0');
  this.game.canvas.setAttribute('aria-label','Son Vapur. Galata Bridge toward Eminönü. WASD or arrow keys to walk. E to look over the railing, talk to a fisherman or look out from the middle of the bridge.');
  this.input.once('pointerdown',()=>this.ambience.start());this.input.keyboard!.once('keydown',()=>this.ambience.start());
  this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.ambience.destroy());
  this.screenLayers=this.children.list.map(object=>object as unknown as Phaser.GameObjects.Image).filter(object=>object.scrollFactorX===0&&object.scrollFactorY===0)
   .map(object=>({object,x:object.x,y:object.y,scaleX:object.scaleX,scaleY:object.scaleY}));
  this.cameras.main.fadeIn(1000,8,21,30);
 }
 update(_time:number,delta:number){
  if(!this.player)return;const dt=Math.min(delta/1000,.05);
  const target=this.player.boardingTarget;
  if(target&&Math.hypot(this.player.x-target.x,this.player.y-target.y)<.8){this.player.x=target.x;this.player.y=target.y;this.player.boardingTarget=undefined;this.input.keyboard!.resetKeys();}
  this.player.update(dt);
  const camera=this.cameras.main;
  const follow=Phaser.Math.Clamp(this.player.x-640,0,BRIDGE.width-1280);
  camera.scrollX=Phaser.Math.Linear(camera.scrollX,Phaser.Math.Linear(follow,BRIDGE.midX-640,this.widenMix),1-Math.exp(-dt*1.8));
  this.holdScreenLayers();
  this.water.update(dt,camera.scrollX);this.atmosphere.update(dt);this.motion.update(dt);this.locals.update(dt,this.motion.gust);
  if(!this.player.boardingTarget)this.interaction.update(this.player);
 }
 /** From the opening span, the view briefly widens to hold both shores, then settles back. */
 private widen(){
  if(this.widening)return;this.widening=true;
  const camera=this.cameras.main;
  this.tweens.addCounter({from:0,to:1,duration:1900,hold:2500,yoyo:true,ease:'Sine.easeInOut',
   onUpdate:tween=>{this.widenMix=tween.getValue()??0;camera.setZoom(1-this.widenMix*(1-BRIDGE.widenZoom));},
   onComplete:()=>{this.widenMix=0;camera.setZoom(1);this.widening=false;}});
 }
 /** Screen-fixed sky, rain, vignette and type keep their size while the camera zooms. */
 private holdScreenLayers(){
  const zoom=this.cameras.main.zoom;if(zoom===this.appliedZoom)return;this.appliedZoom=zoom;
  for(const layer of this.screenLayers)layer.object.setPosition(640+(layer.x-640)/zoom,360+(layer.y-360)/zoom).setScale(layer.scaleX/zoom,layer.scaleY/zoom);
 }
}
