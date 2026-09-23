import Phaser from 'phaser';
import {type Ctx,texture,polygon,line,ellipse,glow,label,random} from '../utils/drawing';
import {promenadeDepth} from '../scenes/promenade';
import {DECK_LIGHTS} from '../scenes/ferryConfig';

export function createFerryDeck(scene:Phaser.Scene){
 texture(scene,'deck-floor',1280,720,c=>{
  // A rounded ship-side deck, with narrow fore/aft boards rather than paving slabs.
  c.save();c.beginPath();c.moveTo(0,494);c.lineTo(1192,494);c.quadraticCurveTo(1268,493,1270,557);c.lineTo(1261,621);c.quadraticCurveTo(1241,674,1140,693);c.lineTo(0,711);c.closePath();c.clip();
  const ground=c.createLinearGradient(0,488,0,710);ground.addColorStop(0,'#3c4b48');ground.addColorStop(.4,'#2d3c3e');ground.addColorStop(1,'#172a33');c.fillStyle=ground;c.fillRect(0,488,1280,232);
  const r=random(651);
  for(let x=-180;x<1450;x+=23){const far=640+(x-640)*.83;line(c,far,496,x,714,'#091d287c');line(c,far+1,496,x+1,714,'#a2a78d20');
   // Staggered short plank joins; no repeating city-pavement grid.
   const y=526+Math.floor(r()*5)*32,t=(y-496)/218,xx=far+(x-far)*t;
   line(c,xx,y,xx+21,y,'#11283380');
  }
  line(c,0,503,1195,503,'#82918461',3);
  for(let i=0;i<130;i++){const x=r()*1280,y=518+r()*183;line(c,x,y,x+1,y+8+r()*24,'#9ca28b12');}
  for(let i=0;i<750;i++){const x=r()*1280,y=510+r()*171;line(c,x,y,x+r()*25,y,'#9bb3a413');}
  for(const [x,y,w] of [[465,605,90],[858,586,78],[1110,621,65],[244,629,120]]){polygon(c,[[x-w,y],[x-25,y-4],[x+30,y-2],[x+w,y-6],[x+w*.8,y+3],[x-w*.6,y+5]],'#627a7829');line(c,x-w*.6,y+5,x+w*.6,y+2,'#a1aca132');}
  for(const x of [422,819,1160]){c.fillStyle='#102832';c.fillRect(x,610,40,7);for(let n=2;n<40;n+=5)line(c,x+n,611,x+n,616,'#5c716a',1);}
  // Flush inspection plate and anti-slip strips, all below the walking surface.
  polygon(c,[[920,597],[990,597],[1000,625],[917,625]],'#293f43','#83908460');
  for(const x of [924,984]){ellipse(c,x,602,1.4,1,'#b4b59670');ellipse(c,x+3,620,1.4,1,'#b4b59670');}
  for(let y=543;y<561;y+=5)line(c,223,y,324,y,'#a49e6960',2);
  c.restore();
 });
 texture(scene,'deck-rail',1280,592,c=>{
  // Cream-painted tubular stanchions, teak handrail, and the curved end of the vessel.
  for(let x=360;x<1200;x+=51){line(c,x,413,x,501,'#70827a',3);line(c,x+1,414,x+1,500,'#c2c8ac65',1);ellipse(c,x,500,6,2,'#334d50');}
  line(c,350,411,1189,411,'#413f32',7);line(c,350,408,1189,408,'#b5a17a',2);
  for(const y of [446,478])line(c,350,y,1196,y,'#acb69a9c',1.5);
  for(const offset of [0,35,67]){c.strokeStyle=offset?'#9cae939c':'#a79b76';c.lineWidth=offset?1.5:3;c.beginPath();c.moveTo(1188,411+offset);c.quadraticCurveTo(1257,412+offset,1259,461+offset);c.lineTo(1259,515+offset);c.stroke();}
  for(const [x,y] of [[1227,422],[1253,446],[1259,483]]){line(c,x,y,x,y+83,'#7d9388',3);line(c,x+1,y,x+1,y+83,'#c1c8ad55');}
  polygon(c,[[350,488],[1197,488],[1202,501],[350,501]],'#354e54','#7f95886b');
  lifeRing(c,788,448);lifeRing(c,1170,447);
 });
 texture(scene,'deck-cabin',370,552,c=>{
  polygon(c,[[0,261],[323,261],[350,290],[350,535],[0,535]],'#626e66','#b1b69b80');
  polygon(c,[[0,250],[333,250],[366,272],[366,289],[0,289]],'#20373e','#8b9d89');
  line(c,0,272,366,272,'#c4c2a18c',4);line(c,0,288,354,288,'#101f2b',4);
  for(let x=10;x<340;x+=28)ellipse(c,x,284,1,1,'#bcc3a573');
  c.fillStyle='#324b4e';c.fillRect(7,299,197,5);line(c,209,297,209,526,'#92a08a66');
  for(let y=309;y<518;y+=29){ellipse(c,6,y,1.2,1.2,'#c2c4a771');ellipse(c,337,y,1.2,1.2,'#c2c4a771');}

  c.fillStyle='#25373d';c.fillRect(0,480,343,48);line(c,0,479,345,479,'#b5b69a77',3);
  for(const x of [20,118]){
   // Rounded metal ship windows, deep seals, amber light and rain-streaked glazing.
   const g=c.createLinearGradient(x,310,x+72,444);g.addColorStop(0,'#dbc38c');g.addColorStop(.55,'#a09262');g.addColorStop(1,'#465c53');
   c.fillStyle='#b1b69c';c.beginPath();c.roundRect(x-6,306,82,142,12);c.fill();
   c.fillStyle='#152c34';c.beginPath();c.roundRect(x-3,309,76,136,10);c.fill();
   c.save();c.beginPath();c.roundRect(x,312,70,131,8);c.clip();c.fillStyle=g;c.fillRect(x,312,70,131);
   c.fillStyle='#2b413b66';c.fillRect(x+9,405,19,38);c.fillRect(x+43,416,19,27);
   line(c,x+35,313,x+35,442,'#657365',2);line(c,x,386,x+70,386,'#31483f',2);
   for(let j=0;j<8;j++){const xx=x+6+j*8,yy=321+j%3*13;line(c,xx,yy,xx-1,yy+22+j*3,'#f4e4b531',.7);}
   polygon(c,[[x+5,313],[x+20,313],[x+51,443],[x+36,443]],'#f5db9820');c.restore();
   line(c,x-5,450,x+77,450,'#142d33',3);line(c,x-5,449,x+77,449,'#c5c7a593');
   for(const dx of [-3,73])for(const yy of [314,440])ellipse(c,x+dx,yy,1,1,'#e1d9b688');
  }
  // Closed interior door; it is a prop, never a second ship area.
  polygon(c,[[223,315],[315,315],[315,530],[223,530]],'#1a3038','#829083');
  c.fillStyle='#a89e70';c.beginPath();c.roundRect(236,331,66,77,12);c.fill();c.strokeStyle='#bec1a4';c.lineWidth=2;c.stroke();line(c,240,369,298,369,'#4e6353',2);line(c,302,447,302,463,'#ddc992',3);
  c.strokeStyle='#697c70';c.strokeRect(236,422,65,81);line(c,302,447,302,463,'#d3ba7f',3);
  label(c,'SALON',248,311,10,'#c6c7aa','sans-serif',1.7);
  c.fillStyle='#233e46';c.fillRect(15,457,192,24);line(c,15,457,207,457,'#c5c3a08c');label(c,'KADIKÖY → KARAKÖY',28,473,10,'#ded5af','sans-serif',.75);
  polygon(c,[[218,530],[324,530],[332,539],[212,539]],'#1d313b','#899084');
 });
 texture(scene,'deck-bench',182,75,c=>{
  ellipse(c,90,67,87,5,'#07182388');
  for(let y=8;y<=34;y+=7){polygon(c,[[8,y],[166,y],[166,y+5],[8,y+5]],'#656451');line(c,8,y,166,y,'#a3a08265');}
  polygon(c,[[8,42],[164,42],[177,50],[0,50]],'#555947','#99a08050');
  for(const x of [18,151]){line(c,x,16,x,65,'#667e74',5);line(c,x,50,x-7,69,'#667e74',4);line(c,x-7,31,x+9,31,'#adb298',3);line(c,x-13,69,x+4,69,'#8b9c8b',3);ellipse(c,x-10,69,1.3,1,'#d6c99b');ellipse(c,x+1,69,1.3,1,'#d6c99b');}
 });
 texture(scene,'deck-equipment',67,82,c=>{
  ellipse(c,33,75,32,5,'#081a2488');polygon(c,[[8,14],[54,14],[58,75],[5,75]],'#30454a','#79877b');
  polygon(c,[[4,14],[13,5],[52,5],[60,14]],'#52645b','#a0a58c66');
  for(let y=26;y<58;y+=6)line(c,15,y,48,y,'#102c35',2);label(c,'GÜVERTE',12,69,6,'#a9b095');
 });
 texture(scene,'deck-close-rail',1280,720,c=>{
  // Thick coaming, visible hull skin and rubbing strake wrap around the near corner.
  c.beginPath();c.moveTo(0,676);c.lineTo(1119,662);c.quadraticCurveTo(1229,652,1265,609);c.lineTo(1270,644);c.quadraticCurveTo(1234,701,1130,712);c.lineTo(0,731);c.closePath();c.fillStyle='#0d2631';c.fill();
  c.beginPath();c.moveTo(0,676);c.lineTo(1119,662);c.quadraticCurveTo(1229,652,1265,609);c.strokeStyle='#83998c';c.lineWidth=6;c.stroke();
  c.beginPath();c.moveTo(0,680);c.lineTo(1119,667);c.quadraticCurveTo(1229,657,1265,616);c.strokeStyle='#c1c1a380';c.lineWidth=1;c.stroke();
  for(let x=25;x<1140;x+=87){ellipse(c,x,696-x*.012,1.4,1.4,'#829b8a70');line(c,x,704-x*.012,x+28,704-x*.012,'#071722',3);}
  for(const x of [18,42,1240,1270]){line(c,x,611,x,700,'#233f47',8);line(c,x+2,612,x+2,694,'#b6be9c80',1);}
  line(c,0,608,95,608,'#3e4235',7);line(c,0,605,95,605,'#baa27b99',2);
  line(c,1234,608,1280,608,'#3e4235',7);line(c,1234,605,1280,605,'#baa27b99',2);
  // Small cleat and a secured coil, tucked out of the walking area.
  line(c,1120,682,1142,681,'#526e6c',5);line(c,1132,681,1133,692,'#334f56',5);
  c.strokeStyle='#9a977566';c.lineWidth=1.5;for(let i=0;i<3;i++){c.beginPath();c.ellipse(1176,685,16+i*4,3+i*1.3,-.1,0,Math.PI*2);c.stroke();}
 });
 texture(scene,'deck-light',1280,720,c=>{
  for(const {x,y} of DECK_LIGHTS){glow(c,x,y,85,'#d9b87620');c.save();c.translate(x,565);c.scale(1,.25);glow(c,0,0,160,'#dcc0832f');c.restore();}
  glow(c,170,430,175,'#dbb9751d');
  for(const x of [52,152]){c.save();c.translate(x+15,563);c.scale(1,.27);glow(c,0,0,104,'#d8ba7131');c.restore();}
 });
 texture(scene,'deck-fixtures',1280,720,c=>{
  for(const {x,y} of DECK_LIGHTS.slice(1)){
   // Slender upper-deck supports and caged bulkhead lamps, not street lamps.
   line(c,x,275,x,501,'#455e5e',5);line(c,x+2,278,x+2,498,'#b0b89c75');
   line(c,x,300,x+28,278,'#566f68',3);ellipse(c,x,y,12,7,'#233f47');ellipse(c,x,y,9,4,'#dfc88e');
   for(const dx of [-5,0,5])line(c,x+dx,y-5,x+dx,y+5,'#4e6052',1);
  }
  c.fillStyle='#17323b';c.fillRect(1082,378,128,28);c.strokeStyle='#789185';c.strokeRect(1082,378,128,28);label(c,'KARAKÖY  →',1094,397,11,'#c2c7ad','sans-serif',.9);
 });
 texture(scene,'deck-superstructure',1280,310,c=>{
  // A glimpse of the ochre-banded funnel and upper-deck rail establishes the vessel immediately.
  polygon(c,[[62,239],[65,151],[110,151],[117,239]],'#20363e','#52665f');
  polygon(c,[[65,176],[113,176],[114,202],[64,202]],'#9b8256');
  polygon(c,[[59,149],[115,149],[118,158],[58,158]],'#101f29','#667b70');
  line(c,246,234,246,154,'#748b7c',2);
  polygon(c,[[247,159],[276,165],[294,160],[290,183],[270,188],[247,181]],'#7c443c');ellipse(c,263,172,6,6,'#c9c5a7');ellipse(c,265,171,5,5,'#7c443c');label(c,'✦',271,177,8,'#c9c5a7');
  for(let x=0;x<334;x+=33)line(c,x,216,x,247,'#809389',2);
  line(c,0,215,330,215,'#b4baa0',2);line(c,0,232,330,232,'#8c9c8b80');
  polygon(c,[[0,246],[329,246],[366,260],[1280,260],[1280,276],[360,276],[329,260],[0,260]],'#263e46','#9fac9480');
  line(c,365,276,1280,276,'#122a35',4);line(c,366,262,1280,262,'#c1c4a476',2);
  for(let x=400;x<1280;x+=94){line(c,x,264,x,273,'#687f7266');ellipse(c,x+4,270,1,1,'#a9b19450');}
  label(c,'İSTANBUL VAPURU',34,253,8,'#c7c7a5','sans-serif',1.7);
 });
 scene.add.image(0,0,'deck-superstructure').setOrigin(0).setDepth(13);
 scene.add.image(0,0,'deck-floor').setOrigin(0).setDepth(10);
 scene.add.image(0,0,'deck-rail').setOrigin(0).setDepth(11);
 scene.add.image(0,0,'deck-cabin').setOrigin(0).setDepth(12);
 scene.add.image(555,493,'deck-bench').setOrigin(0).setDepth(promenadeDepth(547)).setName('ferry-bench');
 scene.add.image(1038,477,'deck-equipment').setOrigin(0).setDepth(promenadeDepth(544)).setName('deck-equipment');
 scene.add.image(0,0,'deck-fixtures').setOrigin(0).setDepth(16.9);
 scene.add.image(0,0,'deck-light').setOrigin(0).setDepth(25);
 scene.add.image(0,0,'deck-close-rail').setOrigin(0).setDepth(30);
}
function lifeRing(c:Ctx,x:number,y:number){
 c.lineWidth=6;c.strokeStyle='#a18165';c.beginPath();c.arc(x,y,17,0,Math.PI*2);c.stroke();
 c.strokeStyle='#c9c7a6';for(let i=0;i<4;i++){c.beginPath();c.arc(x,y,17,i*Math.PI/2-.18,i*Math.PI/2+.18);c.stroke();}
 line(c,x-22,y-22,x+22,y-22,'#849381',1);line(c,x-22,y-22,x-21,y+21,'#84938188',1);line(c,x+22,y-22,x+21,y+21,'#84938188',1);
}
