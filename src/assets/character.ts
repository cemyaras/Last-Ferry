import Phaser from 'phaser';
import {texture,polygon,line,ellipse} from '../utils/drawing';
export function createCharacterTextures(scene:Phaser.Scene){
 for(let frame=0;frame<13;frame++)texture(scene,`traveller-${frame}`,80,112,c=>{
  const phase=frame===0?0:(frame-1)/12*Math.PI*2,step=frame===0?0:Math.sin(phase)*10,bob=frame===0?0:Math.abs(Math.cos(phase))*1.3;
  c.translate(0,-bob);
  // Far leg, near leg, slightly scuffed soles.
  c.lineCap='round';line(c,38,71,37-step*.6,89,'#0b1721',9);line(c,37-step*.6,89,37-step,105,'#0b1721',7);line(c,37-step,105,44-step,106,'#09131c',6);
  line(c,46,72,46+step*.6,90,'#182630',8);line(c,46+step*.6,90,46+step,105,'#17232d',7);line(c,46+step,105,54+step,106,'#0a141e',6);line(c,47+step,108,56+step,108,'#7e817341');
  polygon(c,[[33,34],[47,33],[54,46],[55,77],[29,78],[30,53]],'#1d2e39','#6a777975');
  polygon(c,[[33,37],[40,40],[38,68],[30,77]],'#2d3d45');line(c,48,43,51,73,'#75776845');
  // Scarf, head and wet dark hair in profile. No detailed face.
  polygon(c,[[36,31],[47,31],[47,40],[34,39]],'#646655');polygon(c,[[43,37],[49,38],[47,53],[43,49]],'#555a50');
  polygon(c,[[35,15],[44,12],[50,18],[50,23],[53,26],[49,28],[47,34],[38,33],[35,26]],'#918c76');
  polygon(c,[[33,22],[33,15],[37,10],[44,10],[49,13],[51,19],[43,18],[39,21],[38,28],[34,27]],'#0c1922');line(c,36,12,45,11,'#6d776752');
  // Canvas shoulder bag with flap and brass buckle.
  polygon(c,[[28,43],[34,45],[35,62],[23,64],[21,57],[22,47]],'#41493e','#6a6c5250');line(c,24,49,33,51,'#6c6d52',1);c.fillStyle='#a18d5d';c.fillRect(29,51,2,3);
  line(c,33,38,47,61,'#746d4e',2);line(c,49,45,48-step*.2,62,'#22313a',7);line(c,48-step*.2,62,48-step*.3,69,'#7d8170',3.5);
 });
 for(let frame=0;frame<13;frame++)texture(scene,`traveller-rim-${frame}`,80,112,c=>{
  const source=scene.textures.get(`traveller-${frame}`).getSourceImage() as HTMLCanvasElement;
  c.drawImage(source,-1,0);c.drawImage(source,1,0);c.drawImage(source,0,-1);
  c.globalCompositeOperation='destination-out';c.drawImage(source,0,0);
  c.globalCompositeOperation='source-in';c.fillStyle='#dec18e';c.fillRect(0,0,80,112);
  c.globalCompositeOperation='source-over';
 });
}
