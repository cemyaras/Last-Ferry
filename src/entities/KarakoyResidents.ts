import Phaser from 'phaser';
import {texture,polygon,line,ellipse} from '../utils/drawing';
import {promenadeDepth} from '../scenes/promenade';

/** Two quiet residents; their fixed ground footprints live in karakoyConfig. */
export class KarakoyResidents{
 private waiting:Phaser.GameObjects.Image;
 private keeper:Phaser.GameObjects.Image;
 private elapsed=0;
 constructor(scene:Phaser.Scene){
  texture(scene,'karakoy-resident',66,114,c=>{
   ellipse(c,33,109,23,3,'#071b2699');
   line(c,27,80,26,106,'#142a34',8);line(c,40,80,41,106,'#182f36',8);
   line(c,24,108,32,108,'#081d28',5);line(c,40,108,48,108,'#081d28',5);
   polygon(c,[[23,33],[43,33],[49,84],[17,84]],'#354841','#80907855');
   line(c,23,38,17,64,'#3a5047',7);line(c,43,38,49,60,'#3a5047',7);
   line(c,49,60,40,66,'#8f967c',3);ellipse(c,33,22,8,11,'#92917a');
   polygon(c,[[23,22],[24,12],[39,11],[43,20]],'#1b343d');line(c,22,18,45,18,'#152e38',3);
   line(c,23,34,43,34,'#8a8f73',4);
  });
  texture(scene,'karakoy-keeper',62,112,c=>{
   ellipse(c,30,107,21,3,'#061b2699');line(c,24,76,24,105,'#192f37',8);line(c,38,76,38,105,'#192f37',8);
   line(c,22,108,30,108,'#081c28',4);line(c,37,108,45,108,'#081c28',4);
   polygon(c,[[20,33],[39,33],[44,79],[15,79]],'#51594a','#92967b66');
   polygon(c,[[24,40],[36,40],[39,75],[20,75]],'#293f3c');
   ellipse(c,29,23,8,10,'#9d987c');polygon(c,[[20,23],[21,15],[30,12],[39,19],[35,23]],'#263c3d');
   line(c,21,39,14,54,'#505a49',7);line(c,14,54,18,65,'#92967a',4);
   line(c,39,39,48,31,'#505a49',7);line(c,48,31,46,14,'#939b7e',4);ellipse(c,46,13,3,3,'#a6a484');
  });
  this.waiting=scene.add.image(347,541,'karakoy-resident').setOrigin(.5,1).setDepth(promenadeDepth(540));
  this.keeper=scene.add.image(952,538,'karakoy-keeper').setOrigin(.5,1).setDepth(promenadeDepth(536));
 }
 update(dt:number){this.elapsed+=dt;this.waiting.setScale(1,1+Math.sin(this.elapsed*.9)*.003);this.keeper.setRotation(Math.sin(this.elapsed*.65)*.004);}
}
