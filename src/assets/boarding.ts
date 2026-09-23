import Phaser from 'phaser';
import {texture,polygon,line,ellipse,label,glow} from '../utils/drawing';
import {createFerryTexture} from './ferry';
import {BOARDING as B} from '../scenes/boardingConfig';

/** The Karaköy-bound ferry, shared by its Kadıköy mooring and its Karaköy arrival. */
export function createMooredFerryTexture(scene:Phaser.Scene){
 createFerryTexture(scene);
 texture(scene,'karakoy-ferry',400,160,c=>{
  c.drawImage(scene.textures.get('ferry').getSourceImage() as HTMLCanvasElement,0,0);
  // One open side door, retaining the existing classic ferry silhouette.
  c.fillStyle='#162b31';c.fillRect(95,80,23,43);
  const light=c.createLinearGradient(95,0,118,0);light.addColorStop(0,'#ac955b');light.addColorStop(1,'#34423c');
  c.fillStyle=light;c.fillRect(98,83,17,39);line(c,97,81,97,123,'#dfc48b',1);
  line(c,95,123,119,123,'#d1c19b',2);c.fillStyle='#8d9587';c.fillRect(156,110,90,12);label(c,'KARAKÖY',160,118,7,'#203b3d','sans-serif',1);
 });
}
export function createBoardingArt(scene:Phaser.Scene){
 createMooredFerryTexture(scene);
 texture(scene,'boarding-ramp',135,158,c=>{
  c.translate(-B.gateX+50,-B.deckY+8);
  polygon(c,[[B.cabinX-11,447],[B.cabinX+11,447],[B.gateX+25,525],[B.gateX-25,525]],'#273b40','#78817a');
  for(let y=452;y<524;y+=6){const t=(y-447)/78,x=B.cabinX+(B.gateX-B.cabinX)*t,w=11+14*t;line(c,x-w,y,x+w,y,'#80918a55',1);}
  // Thin handrails keep the boarding path visibly connected to the quay.
  for(const side of [-1,1]){
   line(c,B.cabinX+side*11,428,B.gateX+side*25,501,'#8e9b8c',1.5);
   for(let i=0;i<4;i++){const t=i/3,x=B.cabinX+(B.gateX-B.cabinX)*t+side*(11+14*t),y=447+78*t;line(c,x,y-21,x,y,'#758781',1.2);}
  }
  line(c,B.gateX-25,525,B.gateX+25,525,'#c0af7c',2);
 });
 texture(scene,'boarding-sign',150,90,c=>{
  line(c,18,25,18,89,'#102631',4);line(c,135,25,135,89,'#102631',4);
  polygon(c,[[2,2],[148,2],[148,49],[2,49]],'#132a32','#768577');
  label(c,'KARAKÖY',28,21,13,'#d0c6a2','Georgia',1.3);label(c,'VAPURA BİNİŞ  →',17,38,8,'#9daea5','sans-serif',.8);
 });
 texture(scene,'boarding-light',200,160,c=>{c.save();c.scale(1,.4);glow(c,100,220,95,'#d4b76e24');c.restore();});
 const ferry=scene.add.image(B.ferryX,B.ferryY,'karakoy-ferry').setOrigin(.5,1).setDepth(7).setTint(0xc5cec0);
 scene.add.image(B.gateX-50,B.deckY-8,'boarding-ramp').setOrigin(0).setDepth(11);
 // Left of the bridge, so the sign points to its actual entrance.
 scene.add.image(368,426,'boarding-sign').setOrigin(0).setDepth(17.6);
 scene.add.image(B.gateX,516,'boarding-light').setDepth(13);
 // Mooring line, kept behind the ramp and traveller.
 const ropes=scene.add.graphics().setDepth(8);ropes.lineStyle(1,0x8a8a69,.5);ropes.lineBetween(472,475,487,504);ropes.lineBetween(817,475,805,503);
 return ferry;
}
