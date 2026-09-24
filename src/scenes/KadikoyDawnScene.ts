import Phaser from 'phaser';
import {createEnvironment,addPierObjects} from '../assets/environment';
import {createBoardingArt} from '../assets/boarding';
import {Player} from '../entities/Player';
import {Ay,createDefneTextures} from '../entities/StoryCharacters';
import {Water} from '../systems/Water';
import {Atmosphere} from '../systems/Atmosphere';
import {Interaction} from '../systems/Interaction';
import {Dawn} from '../systems/Dawn';
import {StoryBeat} from '../story/StoryBeat';
import {BEATS,CLOSING,PROMPTS,STORY_TIMES} from '../story/lines';
import {locationCaption} from '../utils/sceneUi';
import {PIER,PARALLAX} from './config';
import {BOARDING} from './boardingConfig';
import {OBSTACLES,promenadeDepth,type Obstacle} from './promenade';

/** Defne waits by the lamp where her poster was taped. */
export const DEFNE={x:1800,y:556,noticeRange:260,giveRadius:80};
export const defneBox=():Obstacle=>({id:'defne',left:DEFNE.x-10,right:DEFNE.x+10,top:DEFNE.y-7,bottom:DEFNE.y+7});
/** Off the first ferry and down the gangway, the reverse of the night's boarding walk. */
export const DISEMBARK_PATH=[{x:BOARDING.cabinX,y:BOARDING.deckY},{x:BOARDING.gateX,y:525},{x:BOARDING.gateX,y:BOARDING.approachY}];

/** Kadıköy in the morning: the rain has stopped, the moon has gone, and Ay goes home. */
export class KadikoyDawnScene extends Phaser.Scene{
 private player!:Player;
 private water!:Water;
 private atmosphere!:Atmosphere;
 private interaction!:Interaction;
 private ay!:Ay;
 private defne!:Phaser.GameObjects.Image;
 private ferry!:Phaser.GameObjects.Image;
 private noticeBeat!:StoryBeat;
 private step=0;
 private given=false;
 private elapsed=0;
 constructor(){super('KadikoyDawnScene');}
 init(){this.step=0;this.given=false;this.elapsed=0;}
 create(){
  document.title='SON VAPUR — Kadıköy, sabah';
  createEnvironment(this);
  this.add.image(0,0,'sky').setOrigin(0).setScrollFactor(0);
  new Dawn(this,{glowX:null,moon:false}).progress=1;
  this.add.image(0,0,'distant-city').setOrigin(0).setDepth(.8).setScrollFactor(.15);
  this.add.image(0,0,'skyline').setOrigin(0).setDepth(2.1).setScrollFactor(PARALLAX.skyline);
  this.water=new Water(this);
  this.add.image(0,0,'pier').setOrigin(0).setDepth(10);
  addPierObjects(this);
  this.add.image(0,0,'foreground').setOrigin(0).setDepth(30).setScrollFactor(PARALLAX.foreground);
  ({ferry:this.ferry}=createBoardingArt(this,BOARDING,{ferryKey:'kadikoy-ferry',route:'KADIKÖY',sign:'KARAKÖY',signKey:'boarding-sign'}));
  this.player=new Player(this,{startX:BOARDING.cabinX+10,startY:BOARDING.deckY,facing:-1,obstacles:[...OBSTACLES,defneBox()],light:()=>0});
  this.player.boardingTarget=DISEMBARK_PATH[0];
  this.atmosphere=new Atmosphere(this);this.atmosphere.daylight=1;
  this.ay=new Ay(this,0,0);this.ay.pickUp();
  createDefneTextures(this);
  this.defne=this.add.image(DEFNE.x,DEFNE.y,'defne').setOrigin(.5,82/84).setDepth(promenadeDepth(DEFNE.y)).setFlipX(true).setName('defne');
  this.interaction=new Interaction(this,[{x:DEFNE.x-12,y:DEFNE.y+6,radius:DEFNE.giveRadius,prompt:PROMPTS.give,onLook:()=>this.give()}]);
  this.noticeBeat=new StoryBeat(this,this.interaction,BEATS.defneNotices,p=>Math.abs(p.x-DEFNE.x)<DEFNE.noticeRange,{x:DEFNE.x,y:DEFNE.y-92});
  locationCaption(this,'K A D I K Ö Y',STORY_TIMES.morning);
  this.cameras.main.setBounds(0,0,PIER.width,PIER.height).setScroll(0,0);
  this.input.keyboard!.resetKeys();
  this.game.canvas.setAttribute('tabindex','0');
  this.game.canvas.setAttribute('aria-label','Son Vapur. Kadıköy in the morning. WASD or arrow keys to walk. E by the girl at the far lamp to give her the cat.');
  this.cameras.main.fadeIn(1400,8,21,30);
 }
 update(_time:number,delta:number){
  if(!this.player)return;const dt=Math.min(delta/1000,.05);this.elapsed+=dt;
  const target=this.player.boardingTarget;
  if(!this.given&&target&&Math.hypot(this.player.x-target.x,this.player.y-target.y)<.8){
   this.player.x=target.x;this.player.y=target.y;this.step++;
   this.player.boardingTarget=DISEMBARK_PATH[this.step];
   if(!this.player.boardingTarget)this.input.keyboard!.resetKeys();
  }
  this.player.update(dt);this.ay.update(dt,this.player);
  this.ferry.setY(BOARDING.ferryY+Math.sin(this.elapsed*.75)*.3);
  this.defne.setScale(1,1+Math.sin(this.elapsed*1.6)*.006);
  const camera=this.cameras.main,follow=Phaser.Math.Clamp(this.player.x-PIER.viewWidth*.48,0,PIER.width-PIER.viewWidth);
  camera.scrollX=Phaser.Math.Linear(camera.scrollX,follow,1-Math.exp(-dt*1.8));
  this.water.update(dt,camera.scrollX);this.atmosphere.update(dt);
  if(this.player.boardingTarget)return;
  this.noticeBeat.update(this.player);
  if(this.noticeBeat.done&&this.player.x<DEFNE.x)this.defne.setFlipX(true);
  this.interaction.update(this.player);
 }
 private give(){
  if(this.given||!this.noticeBeat.done)return;this.given=true;
  this.player.boardingTarget={x:this.player.x,y:this.player.y};
  this.ay.release();this.defne.setTexture('defne-ay');
  this.interaction.say(BEATS.defneGive(),()=>this.time.delayedCall(900,()=>this.closing()));
 }
 /** A quiet closing card over the morning. */
 private closing(){
  const veil=this.add.rectangle(640,360,1280,720,0x070f16,1).setDepth(90).setScrollFactor(0).setAlpha(0).setName('closing');
  const title=this.add.text(640,318,CLOSING.title,{fontFamily:'Georgia, serif',fontSize:'34px',color:'#d6d4c2'}).setOrigin(.5).setDepth(91).setScrollFactor(0).setAlpha(0);
  const lines=this.add.text(640,372,CLOSING.lines.join('\n'),{fontFamily:'Georgia, serif',fontSize:'17px',fontStyle:'italic',color:'#a9a88f',align:'center',lineSpacing:6}).setOrigin(.5,0).setDepth(91).setScrollFactor(0).setAlpha(0);
  const hint=this.add.text(640,650,CLOSING.hint,{fontFamily:'Arial, sans-serif',fontSize:'10px',color:'#6f8086'}).setOrigin(.5).setDepth(91).setScrollFactor(0).setAlpha(0);
  this.tweens.add({targets:veil,alpha:1,duration:2200,onComplete:()=>{
   this.tweens.add({targets:title,alpha:1,duration:1400});
   this.tweens.add({targets:lines,alpha:1,duration:1400,delay:900});
   this.tweens.add({targets:hint,alpha:.8,duration:1000,delay:2600});
  }});
 }
}
