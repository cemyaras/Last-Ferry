import Phaser from 'phaser';
import {texture,polygon,line,ellipse} from '../utils/drawing';
import {promenadeDepth} from '../scenes/promenade';

/** Two non-interactive passengers. Their feet share the deck's sorting rules. */
export class FerryPassengers{
 private seated:Phaser.GameObjects.Image;
 private standing:Phaser.GameObjects.Image;
 private elapsed=0;
 constructor(scene:Phaser.Scene){
  texture(scene,'passenger-seated',64,90,c=>{
   ellipse(c,33,84,23,3,'#07192380');
   line(c,27,51,43,58,'#152a35',10);line(c,43,58,46,80,'#142732',8);line(c,46,81,55,81,'#0a1b26',5);
   line(c,22,54,20,62,'#1b2f37',8);line(c,20,62,21,80,'#182d35',7);line(c,21,81,29,81,'#0a1b26',5);
   polygon(c,[[17,22],[34,20],[43,54],[19,60],[13,49]],'#374746','#7b827145');
   ellipse(c,24,16,8,10,'#918a70');polygon(c,[[15,16],[14,9],[20,4],[28,4],[33,10],[32,17],[24,10]],'#253a40');
   line(c,18,28,19,44,'#506053',7);line(c,19,44,35,50,'#506053',6);ellipse(c,35,50,3,2,'#a4997c');
   polygon(c,[[30,49],[43,48],[44,56],[32,57]],'#273b3a','#78816b');
  });
  texture(scene,'passenger-standing',62,108,c=>{
   ellipse(c,30,103,20,3,'#06182070');
   line(c,25,72,25,100,'#182d36',8);line(c,37,72,37,100,'#142b34',8);line(c,23,102,31,102,'#0a1c27',5);line(c,35,102,43,102,'#0a1c27',5);
   polygon(c,[[19,30],[39,29],[44,77],[15,77]],'#283c43','#6d807154');
   line(c,20,36,15,55,'#35494b',7);line(c,15,55,17,61,'#89917b',3);
   line(c,39,36,44,53,'#30434a',7);line(c,44,53,40,59,'#89917b',3);
   ellipse(c,29,20,8,10,'#8f907b');polygon(c,[[21,23],[19,15],[24,10],[33,11],[39,17],[34,23]],'#142c35');
   line(c,20,30,38,30,'#73816e',4);
  });
  this.seated=scene.add.image(649,568,'passenger-seated').setOrigin(.5,1).setDepth(promenadeDepth(559));
  this.standing=scene.add.image(893,517,'passenger-standing').setOrigin(.5,1).setDepth(promenadeDepth(517));
 }
 update(dt:number){this.elapsed+=dt;this.seated.setRotation(Math.sin(this.elapsed*.6)*.005);this.standing.setScale(1,1+Math.sin(this.elapsed*1.1)*.003);}
}
