import Phaser from 'phaser';
import {type Ctx,texture,random,polygon,line,ellipse,glow,label} from '../utils/drawing';
import {bench,lamp,railing} from './environment';
import {createKarakoyWaterfront} from './karakoy';
import {createStairwell} from './stairs';
import {promenadeDepth} from '../scenes/promenade';
import {EMINONU,EMINONU_LIGHTS,EMINONU_BOARDING as EB,EMINONU_STAIRS,BENCH,TERMINAL} from '../scenes/eminonuConfig';

const W=EMINONU.width;
/** Centre of the terminal clock; its hands are drawn live by the scene. */
export const TERMINAL_CLOCK={x:1785,y:292,r:15};

function paving(c:Ctx,width:number,seed:number){
 const g=c.createLinearGradient(0,509,0,720);g.addColorStop(0,'#283b42');g.addColorStop(.3,'#243139');g.addColorStop(1,'#101b25');c.fillStyle=g;c.fillRect(0,513,width,207);
 c.fillStyle='#121f29';c.fillRect(0,502,width,12);line(c,0,512,width,512,'#647175',2);line(c,0,518,width,518,'#0e1d26',3);
 const r=random(seed);for(const y of [535,563,602,654,718]){line(c,0,y,width,y,'#0b182773');line(c,0,y+1,width,y+1,'#8a9b9a0c');}
 for(let row=0;row<5;row++){const ys=[519,535,563,602,654,720];for(let x=-160;x<width+120;x+=96+row*25){const xx=x+(row%2)*58;line(c,xx,ys[row],xx+(xx-960)*.024,ys[row+1],'#0a18294f');}}
 for(let i=0;i<2000;i++){const x=r()*width,y=522+r()*198;line(c,x,y,x+1+r()*13,y,r()>.5?'#82958f0d':'#000c141d');}
 for(let i=0;i<24;i++){const x=r()*width,y=539+r()*150,w=15+r()*100;polygon(c,[[x-w,y],[x-w*.55,y-2],[x+w*.7,y-3],[x+w,y],[x+w*.6,y+3],[x-w*.8,y+2]],'#40515a22');line(c,x-w*.6,y+3,x+w*.5,y+3,'#859b9b19');}
}
function terminal(c:Ctx){
 const L=TERMINAL.left,{x:cx,y:cy,r:cr}=TERMINAL_CLOCK;
 // Pitched tile roof, with a small clock gable over the centre.
 polygon(c,[[L-24,336],[W,336],[W,382],[L-50,382]],'#17242b','#536068');
 for(let y=342;y<378;y+=7)line(c,L-30-(y-336)*.55,y,W,y,'#43505155');
 for(let x=L-20;x<W;x+=17)line(c,x,338,x-14,380,'#0a1b2480');
 c.fillStyle='#233036';c.fillRect(cx-44,262,88,76);polygon(c,[[cx-52,264],[cx,236],[cx+52,264]],'#15232b','#556064');
 line(c,cx-44,263,cx+44,263,'#7e827155',2);
 ellipse(c,cx,cy,cr+4,cr+4,'#141f25');ellipse(c,cx,cy,cr,cr,'#c9bd92');
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2;line(c,cx+Math.cos(a)*(cr-4),cy+Math.sin(a)*(cr-4),cx+Math.cos(a)*(cr-1.5),cy+Math.sin(a)*(cr-1.5),'#3d4540',i%3?1:2);}
 polygon(c,[[L-52,378],[W,378],[W,388],[L-52,388]],'#090f18');line(c,L-50,379,W,379,'#7e827166',2);
 c.fillStyle='#263239';c.fillRect(L,388,W-L,124);
 c.fillStyle='#364044';c.fillRect(L+12,392,W-L-12,23);line(c,L+10,416,W,416,'#94937a60');
 label(c,'E M İ N Ö N Ü',L+62,409,16,'#c3bda1','Georgia');
 for(let x=L+22;x<W-40;x+=88){
  const g=c.createLinearGradient(x,428,x+62,505);g.addColorStop(0,'#b69d66');g.addColorStop(.5,'#7f754e');g.addColorStop(1,'#3d4640');
  c.fillStyle=g;c.beginPath();c.moveTo(x,505);c.lineTo(x,449);c.quadraticCurveTo(x,424,x+31,424);c.quadraticCurveTo(x+62,424,x+62,449);c.lineTo(x+62,505);c.closePath();c.fill();
  line(c,x+31,428,x+31,505,'#18252a',3);line(c,x,458,x+62,458,'#263031',3);
  c.fillStyle='#111e2780';c.fillRect(x+5,489,22,16);c.fillRect(x+36,489,21,16);line(c,x-3,447,x-3,508,'#91917b52',2);
 }
 for(const x of [L+4,L+96,L+184,W-12]){c.fillStyle='#3a4243';c.fillRect(x,418,9,94);line(c,x,418,x,511,'#83908265',1);c.fillStyle='#1b292f';c.fillRect(x-3,503,15,9);}
 polygon(c,[[L-6,511],[W,511],[W,521],[L-12,521]],'#111f28');line(c,L-6,513,W,513,'#73807875');
 // Route boards by the entrance.
 c.fillStyle='#16282f';c.fillRect(L-44,398,40,46);c.strokeStyle='#69756b';c.strokeRect(L-44,398,40,46);
 label(c,'KADIKÖY',L-41,414,6,'#abb1a2');label(c,'ÜSKÜDAR',L-41,426,6,'#8d978c');label(c,'06:00',L-37,439,8,'#c0b58a','Georgia');
 line(c,L-24,444,L-24,512,'#101c24',3);
}
export function createEminonu(scene:Phaser.Scene){
 texture(scene,'eminonu-far',1760,390,c=>{
  // Beyoğlu's hill behind Karaköy, falling away to the open Bosphorus and the low Asian shore.
  const r=random(1908),hill=(x:number)=>350-96*Math.exp(-Math.pow((x-520)/360,2))-10*Math.exp(-Math.pow((x-900)/200,2));
  c.beginPath();c.moveTo(0,358);for(let x=0;x<=1180;x+=8)c.lineTo(x,hill(x));c.lineTo(1180,358);c.closePath();c.fillStyle='#2a3e48';c.fill();
  for(let x=0;x<1160;){const w=6+r()*9,y=hill(x),h=3+r()*10;c.fillStyle=r()>.5?'#2c414b':'#293d46';c.fillRect(x,y-h,w,358-y+h);if(r()>.55){c.fillStyle=r()>.4?'#b99e6b55':'#dcc39166';c.fillRect(x+2,y+3+r()*Math.max(1,346-y),1.5,2);}x+=w+1;}
  const asia=(x:number)=>349-6*Math.sin(x*.012)-5*Math.exp(-Math.pow((x-1500)/160,2));
  c.beginPath();c.moveTo(1180,358);for(let x=1180;x<=1760;x+=8)c.lineTo(x,asia(x));c.lineTo(1760,358);c.closePath();c.fillStyle='#2b3f49';c.fill();
  for(let x=1190;x<1760;x+=5+r()*9)if(r()>.5){c.fillStyle=r()>.5?'#c2a56f60':'#9aa39455';c.fillRect(x,asia(x)+2+r()*5,1.3,1.6);}
  // Kız Kulesi on its rock, far off in the strait.
  c.fillStyle='#31434c';c.fillRect(1362,334,32,18);c.fillRect(1370,312,16,22);polygon(c,[[1367,313],[1378,292],[1389,313]],'#31434c');line(c,1378,292,1378,286,'#4a5a5c',1);ellipse(c,1378,353,26,3,'#253740');
  c.fillStyle='#d6b77a99';c.fillRect(1375,318,3,5);c.fillRect(1366,340,2,3);c.fillRect(1388,340,2,3);glow(c,1378,320,16,'#d4b87626');
  line(c,0,356,1760,356,'#83908733');
 });
 scene.add.image(-200,0,'eminonu-far').setOrigin(0).setDepth(.8).setScrollFactor(.15);
 createKarakoyWaterfront(scene);
 // Karaköy's waterfront across the Horn, smaller and cooler with distance.
 scene.add.image(-40,144,'karakoy-waterfront').setOrigin(0).setScale(.62).setDepth(2.1).setScrollFactor(.3).setTint(0x94a4a6).setAlpha(.9);
 texture(scene,'eminonu-shore',760,120,c=>{
  // The European shore beyond Karaköy, falling away toward the strait.
  const r=random(1840),top=(x:number)=>18+x*.105+Math.sin(x*.05)*3;
  c.beginPath();c.moveTo(0,120);for(let x=0;x<=760;x+=6)c.lineTo(x,top(x));c.lineTo(760,120);c.closePath();c.fillStyle='#253a43';c.fill();
  for(let x=0;x<740;){const w=10+r()*18,h=4+r()*14*(1-x/760),y=top(x);c.fillStyle=r()>.5?'#283d46':'#223741';c.fillRect(x,y-h,w,120-y+h);if(r()>.4){c.fillStyle=r()>.5?'#b99f6b55':'#9aa39448';c.fillRect(x+3,y-h+3+r()*8,1.5,2);}x+=w+1;}
  line(c,0,112,760,112,'#82908840',1);
 });
 scene.add.image(846,238,'eminonu-shore').setOrigin(0).setDepth(2.05).setScrollFactor(.3).setAlpha(.85);
 texture(scene,'eminonu-bridge',420,150,c=>{
  // Galata Bridge seen end-on, receding across the water toward Karaköy, its lower level still lit.
  const top=(t:number)=>92-58*t,bottom=(t:number)=>110-74*t,x=(t:number)=>t*360;
  polygon(c,[[0,bottom(0)],[360,bottom(1)],[360,bottom(1)+2],[0,bottom(0)+24]],'#172a33');
  for(let t=.02;t<.98;t+=.018){const h=Math.max(1,22*(1-t)),y=bottom(t)+2;c.fillStyle=t*50%2<1?'#c8a26a88':'#1c2f37';c.fillRect(x(t),y,Math.max(1,6*(1-t)),h*.55);}
  polygon(c,[[0,top(0)],[360,top(1)],[360,bottom(1)],[0,bottom(0)]],'#223540','#71807a55');
  line(c,0,top(0),360,top(1),'#8d9b9660',1.5);
  for(let t=.06;t<.97;t+=.09){const px=x(t),h=44*(1-t)+4,y=top(t);line(c,px,y,px,y-h,'#0e1d25',Math.max(1,3*(1-t)));ellipse(c,px,y-h,Math.max(1,3*(1-t)),Math.max(1,2.4*(1-t)),'#e0c38a');glow(c,px,y-h,18*(1-t)+4,'#d9b87628');}
  for(let t=.1;t<1;t+=.22){const px=x(t);c.fillStyle='#142630';c.fillRect(px-3*(1-t),bottom(t)+22*(1-t),6*(1-t)+1,30*(1-t)+4);}
  for(let t=.06;t<.97;t+=.09){const px=x(t),y=bottom(t)+30*(1-t)+10;for(let j=0;j<6;j++)line(c,px-2+Math.sin(j*2.3)*2,y+j*3.2,px+2+Math.sin(j*2.3)*2,y+j*3.2,'#c6ab7530',1);}
 });
 scene.add.image(-40,320,'eminonu-bridge').setOrigin(0).setDepth(3.2).setScrollFactor(.3);
 texture(scene,'eminonu-boat',340,140,c=>{
  // A gilded balık-ekmek boat, closed for the night: canopy down, lanterns dark.
  polygon(c,[[8,92],[332,92],[312,128],[26,128]],'#1c3438','#8a8457');
  for(let x=30;x<310;x+=26){c.strokeStyle='#8f7d4a88';c.lineWidth=1.3;c.beginPath();c.moveTo(x,104);c.quadraticCurveTo(x+13,96,x+26,104);c.stroke();}
  line(c,10,96,330,96,'#a38f55',2);line(c,22,122,316,122,'#6d3b35aa',3);
  for(const x of [40,110,180,250,300])line(c,x,92,x,40,'#3e4a40',3);
  polygon(c,[[20,40],[320,40],[334,54],[6,54]],'#4f3432','#9c8a58');
  for(let x=10;x<330;x+=16){c.fillStyle='#42302d';c.beginPath();c.arc(x+8,54,8,0,Math.PI);c.fill();}
  line(c,6,54,334,54,'#a8955e',1.5);
  c.fillStyle='#2a3f3c';c.fillRect(120,58,100,16);label(c,'BALIK EKMEK',128,70,10,'#c9b77f','Georgia',1);
  for(const x of [30,76,264,310]){line(c,x,54,x,62,'#1a2a2a',1);ellipse(c,x,66,4,5,'#3b4a41');ellipse(c,x,64,2,2,'#6c6a52');}
  c.fillStyle='#1e2d31';c.fillRect(260,72,40,20);line(c,280,72,280,58,'#26363a',4);
  polygon(c,[[40,62],[300,62],[300,92],[40,92]],'#23383c88');
 });
 const boat=scene.add.image(438,512,'eminonu-boat').setOrigin(0,1).setDepth(7).setTint(0xc8d0c8);
 texture(scene,'eminonu-quay',W,720,c=>{
  paving(c,W,1453);
  railing(c,0,TERMINAL.left,EB.gateLeft,EB.gateRight);
  terminal(c);
  // Plate on the rail by the stairs, pointing back to the bridge's lower level.
  c.fillStyle='#142a32';c.fillRect(290,392,112,30);c.strokeStyle='#647271';c.strokeRect(290.5,392.5,112,30);
  label(c,'← GALATA KÖPRÜSÜ',298,405,8,'#a5b4ae','sans-serif',.6);label(c,'VAPUR İSKELESİ →',298,417,8,'#8d9e98','sans-serif',.6);
  line(c,346,422,346,505,'#0b1a22',4);
 });
 scene.add.image(0,0,'eminonu-quay').setOrigin(0).setDepth(10);
 createStairwell(scene,'eminonu',EMINONU_STAIRS,'quay');
 EMINONU_LIGHTS.forEach(({x,y},i)=>{
  const crop={x:x-32,y:y-20,width:65,height:540-y},key=`eminonu-lamp-${i}`;
  texture(scene,key,crop.width,crop.height,c=>{c.translate(-crop.x,-crop.y);lamp(c,x,y);});
  scene.add.image(crop.x,crop.y,key).setOrigin(0).setDepth(promenadeDepth(517));
 });
 const crop={x:BENCH.x-24,y:500,width:140,height:55};
 texture(scene,'eminonu-bench',crop.width,crop.height,c=>{c.translate(-crop.x,-crop.y);bench(c,BENCH.x,BENCH.y);});
 scene.add.image(crop.x,crop.y,'eminonu-bench').setOrigin(0).setDepth(promenadeDepth(BENCH.y)).setName('eminonu-bench');
 texture(scene,'eminonu-gate',58,52,c=>{
  // A folding iron gate across the gangway opening, shut until the first ferry.
  for(let i=0;i<7;i++){const x=3+i*8.4;line(c,x,4,x+8.4,48,'#15282f',1.6);line(c,x+8.4,4,x,48,'#15282f',1.6);}
  line(c,1,3,57,3,'#0d1c25',3);line(c,1,49,57,49,'#0d1c25',3);line(c,2,2,2,50,'#0d1c25',3);line(c,56,2,56,50,'#0d1c25',3);line(c,1,2,57,2,'#74848760',1);
 });
 const gate=scene.add.image(EB.gateLeft,456,'eminonu-gate').setOrigin(0).setDepth(10.3);
 texture(scene,'eminonu-gate-plate',44,20,c=>{polygon(c,[[1,2],[43,1],[43,19],[1,19]],'#7a6f58','#3b3a30');label(c,'İLK VAPUR',4,9,6,'#1d2a2c','sans-serif',.4);label(c,'06:00',11,17,7,'#1d2a2c','sans-serif',.6);});
 const plate=scene.add.image(EB.gateX-2,478,'eminonu-gate-plate').setDepth(10.31).setRotation(.03);
 texture(scene,'eminonu-foreground',W+160,720,c=>{
  polygon(c,[[0,702],[W+160,690],[W+160,720],[0,720]],'#09131c');line(c,0,702,W+160,690,'#43515845',2);
  for(let x=0;x<W+160;x+=114)line(c,x,703,x+7,720,'#172730',2);
  for(const bx of [760,1480]){ellipse(c,bx,688,40,7,'#08131b99');polygon(c,[[bx-18,692],[bx-15,671],[bx-24,663],[bx-23,657],[bx+20,657],[bx+23,663],[bx+13,670],[bx+16,692]],'#07121b','#24333b');ellipse(c,bx-2,658,22,5,'#25343a');}
  c.strokeStyle='#4d544c';c.lineWidth=3;c.beginPath();c.moveTo(770,676);c.bezierCurveTo(800,668,830,694,870,686);c.stroke();
 });
 scene.add.image(-60,0,'eminonu-foreground').setOrigin(0).setDepth(30).setScrollFactor(1.06);
 return {boat,gate,plate};
}
/** Two quiet figures of the Eminönü morning; each texture's feet sit at its bottom edge. */
export function createEminonuFigures(scene:Phaser.Scene){
 texture(scene,'eminonu-gorevli',60,112,c=>{
  // Pier attendant in a navy coat and peaked cap.
  ellipse(c,30,108,20,3,'#06172099');line(c,24,76,24,105,'#142633',8);line(c,36,76,36,105,'#142633',8);line(c,20,107,28,107,'#07161f',5);line(c,32,107,40,107,'#07161f',5);
  polygon(c,[[17,32],[43,32],[46,82],[14,82]],'#223449','#6f807955');line(c,30,35,30,80,'#0f1f2b');for(const y of [44,56,68])ellipse(c,33,y,1.2,1.2,'#b9a870');
  line(c,18,38,14,64,'#223449',7);line(c,42,38,46,64,'#223449',7);ellipse(c,14,66,3,3,'#9b957b');ellipse(c,46,66,3,3,'#9b957b');
  ellipse(c,30,22,8,10,'#9b957b');polygon(c,[[20,16],[22,9],[38,9],[40,16]],'#1a2a3a');line(c,18,17,44,17,'#0f1b27',3);ellipse(c,30,12,2,1.2,'#b9a870');
 });
 texture(scene,'eminonu-simitci',104,112,c=>{
  // Simitçi pushing his glass-sided cart, the first simits of the day stacked inside.
  ellipse(c,52,108,46,3.4,'#06172099');
  line(c,20,78,19,105,'#1c2c33',8);line(c,31,78,32,105,'#1c2c33',8);line(c,15,107,23,107,'#07161f',5);line(c,28,107,36,107,'#07161f',5);
  polygon(c,[[13,34],[37,34],[40,84],[10,84]],'#3b4745','#7c847055');polygon(c,[[16,52],[36,52],[38,86],[14,86]],'#b9b4a0','#8a867a');
  line(c,34,42,50,58,'#3b4745',7);ellipse(c,51,59,3,3,'#9b957b');ellipse(c,25,24,8,10,'#9b957b');polygon(c,[[17,19],[18,13],[33,13],[34,19]],'#6b665a');
  line(c,50,58,58,58,'#2a2a26',3);
  polygon(c,[[56,52],[100,52],[100,92],[56,92]],'#6b2f2c','#a0544b');polygon(c,[[58,54],[98,54],[98,80],[58,80]],'#c9ad7a55');
  for(let y=60;y<78;y+=6)for(let x=62;x<96;x+=10){c.strokeStyle='#b07a44';c.lineWidth=2.2;c.beginPath();c.ellipse(x+4,y,4,2.4,0,0,Math.PI*2);c.stroke();}
  polygon(c,[[54,46],[102,46],[100,52],[56,52]],'#4b2422');line(c,58,92,58,104,'#1a1d1e',2);line(c,98,92,98,104,'#1a1d1e',2);ellipse(c,64,104,6,6,'#101518');ellipse(c,94,104,6,6,'#101518');
 });
}
