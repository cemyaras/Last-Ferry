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
import {KARAKOY,STREET_BOUNDS,STREET_OBSTACLES,STREET_LIGHTS,STREET_LOOKS,streetLight,streetLightOrigin} from './karakoyConfig';

/** First waterfront lane only; its closed uphill gate is the current content boundary. */
export class KarakoyScene extends Phaser.Scene{
 private player!:Player;
 private water!:Water;
 private atmosphere!:Atmosphere;
 private interaction!:Interaction;
 private residents!:KarakoyResidents;
 private ambience!:Ambience;
 constructor(){super('KarakoyScene');}
 preload(){this.ambience=new Ambience(this);this.ambience.preload();}
 create(){
  document.title='SON VAPUR — Karaköy';
  createEnvironment(this);
  this.add.image(0,0,'sky').setOrigin(0).setScrollFactor(0);
  this.add.image(-500,0,'distant-city').setOrigin(0).setDepth(.8).setScrollFactor(.15);
  // From this bank, the historical peninsula sits across the water; Galata is uphill.
  this.add.image(-470,0,'skyline').setOrigin(0).setDepth(2.1).setAlpha(.7).setScrollFactor(.28);
  this.water=new Water(this,{showFerry:false});
  createKarakoy(this);
  this.player=new Player(this,{startX:KARAKOY.startX,startY:KARAKOY.startY,facing:1,bounds:STREET_BOUNDS,obstacles:STREET_OBSTACLES,light:streetLight,lightOrigin:streetLightOrigin});
  this.residents=new KarakoyResidents(this);
  this.atmosphere=new Atmosphere(this,{width:KARAKOY.width,lamps:STREET_LIGHTS,texturePrefix:'karakoy-',terminalGlow:false});
  this.interaction=new Interaction(this,STREET_LOOKS);
  locationCaption(this,'K A R A K Ö Y');
  this.cameras.main.setBounds(0,0,KARAKOY.width,KARAKOY.height).setScroll(0,0);
  this.input.keyboard!.resetKeys();
  this.game.canvas.setAttribute('tabindex','0');
  this.game.canvas.setAttribute('aria-label','Son Vapur. Karaköy. WASD or arrow keys to walk. E to look at the ferry terminal, closed shop or uphill street.');
  this.input.once('pointerdown',()=>this.ambience.start());this.input.keyboard!.once('keydown',()=>this.ambience.start());
  this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.ambience.destroy());
  this.cameras.main.fadeIn(1000,8,21,30);
 }
 update(_time:number,delta:number){
  if(!this.player)return;const dt=Math.min(delta/1000,.05);
  this.player.update(dt);
  const camera=this.cameras.main,target=Phaser.Math.Clamp(this.player.x-1280*.44,0,KARAKOY.width-1280);
  camera.scrollX=Phaser.Math.Linear(camera.scrollX,target,1-Math.exp(-dt*1.8));
  this.water.update(dt,camera.scrollX);this.atmosphere.update(dt);this.residents.update(dt);this.interaction.update(this.player);
 }
}
