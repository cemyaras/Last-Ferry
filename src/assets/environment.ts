import Phaser from 'phaser';
import {type Ctx,texture,random,polygon,line,ellipse,glow,label} from '../utils/drawing';
import {PIER,SCENE_TIME} from '../scenes/config';
import {groundDetails,foregroundDetails,furniture} from './pierDetails';
import {BOARDING} from '../scenes/boardingConfig';
import {PIER_OBJECTS,promenadeDepth} from '../scenes/promenade';

export function createEnvironment(scene:Phaser.Scene){
 texture(scene,'sky',1280,720,c=>{
  const g=c.createLinearGradient(0,0,0,510);g.addColorStop(0,'#0b1823');g.addColorStop(.6,'#263944');g.addColorStop(1,'#485052');c.fillStyle=g;c.fillRect(0,0,1280,720);
  glow(c,730,315,410,'#92948420');glow(c,957,130,100,'#b5c5bd0c');
  ellipse(c,957,130,20,20,'#97aaa226');ellipse(c,962,124,20,20,'#22343e');
  const r=random(11);for(let i=0;i<17000;i++){const x=r()*1280,y=r()*520;c.fillStyle=r()>.5?'#c7d8d903':'#020b1208';c.fillRect(x,y,1+r()*3,1);}
 });
 texture(scene,'clouds',1600,300,c=>{const r=random(3);for(let i=0;i<22;i++){c.save();c.scale(1,.17);glow(c,r()*1600,r()*1200,100+r()*220,'#06121d30');c.restore();}});
 texture(scene,'distant-city',PIER.width,390,c=>{
  const r=random(992);c.beginPath();c.moveTo(0,354);c.lineTo(0,330);c.bezierCurveTo(170,288,280,320,435,292);c.bezierCurveTo(620,301,710,320,840,311);c.bezierCurveTo(1030,334,1150,289,1270,289);c.bezierCurveTo(1470,305,1630,279,1730,286);c.bezierCurveTo(1930,309,2020,305,PIER.width,301);c.lineTo(PIER.width,358);c.closePath();c.fillStyle='#2c404b';c.fill();
  for(let x=0;x<PIER.width;x+=8+r()*12){const base=319+Math.sin(x*.009)*12;const h=5+r()*18;c.fillStyle='#2c414b';c.fillRect(x,base-h,8+r()*10,355-base+h);}
  // A Galata-like conical tower above the dense roofline, balanced by low aqueduct arches.
  c.fillStyle='#2a3e47';c.fillRect(433,254,21,56);polygon(c,[[429,256],[444,228],[458,256]],'#2a3e47');line(c,444,228,444,222,'#43565b');line(c,431,271,456,271,'#62716b3d');
  for(let x=437;x<453;x+=6){c.fillStyle='#9e9b7540';c.fillRect(x,261,2,5);}
  for(let x=1300;x<1450;x+=19){c.fillStyle='#293f48';c.fillRect(x,291,5,31);c.beginPath();c.arc(x+12,306,10,Math.PI,0);c.lineWidth=5;c.strokeStyle='#293f48';c.stroke();}
 });
 texture(scene,'skyline',PIER.width,390,c=>{
  const r=random(82);
  for(let layer=0;layer<3;layer++){
   const base=351+layer*4;c.fillStyle=['#344650','#263a43','#1c3039'][layer];
   for(let x=-10;x<PIER.width+10;){const w=9+r()*26,h=12+r()*39+Math.sin(x*.01)*9;const y=base-h;c.fillRect(x,y,w,h+8);polygon(c,[[x,y],[x+w*.5,y-3-r()*5],[x+w,y]],c.fillStyle as string);
    if(layer>0){for(let wx=x+4;wx<x+w-3;wx+=6)for(let wy=y+7;wy<base-3;wy+=8)if(r()>.72){c.fillStyle=r()>.4?'#b79c695e':'#dec29382';c.fillRect(wx,wy,1.5,2);c.fillStyle=layer===1?'#263a43':'#1c3039';}}
    x+=w+2;
   }
  }
  mosque(c,715,335,.91);mosque(c,1160,344,.45);mosque(c,1625,337,.63);
  line(c,0,357,PIER.width,357,'#83908740',1);
  for(let i=0;i<135;i++){const x=r()*PIER.width;ellipse(c,x,351+r()*8,.7+r(),.7,r()>.45?'#d6af7799':'#adbbac70');}
 });
 texture(scene,'pier',PIER.width,720,c=>{
  const g=c.createLinearGradient(0,509,0,720);g.addColorStop(0,'#283b42');g.addColorStop(.3,'#243139');g.addColorStop(1,'#101b25');c.fillStyle=g;c.fillRect(0,513,PIER.width,207);
  c.fillStyle='#121f29';c.fillRect(0,502,PIER.width,12);line(c,0,512,PIER.width,512,'#647175',2);line(c,0,518,PIER.width,518,'#0e1d26',3);
  // Perspective cut-stone paving, with broken glints along rain-darkened joints.
  const r=random(403);for(const y of [535,563,602,654,718]){line(c,0,y,PIER.width,y,'#0b182773');line(c,0,y+1,PIER.width,y+1,'#8a9b9a0c');}
  for(let row=0;row<5;row++){const ys=[519,535,563,602,654,720];for(let x=-160;x<PIER.width+120;x+=104+row*27){const xx=x+(row%2)*64;line(c,xx,ys[row],xx+(xx-640)*.026,ys[row+1],'#0a18294f');}}
  for(let i=0;i<2200;i++){const x=r()*PIER.width,y=522+r()*198;line(c,x,y,x+1+r()*13,y,r()>.5?'#82958f0d':'#000c141d');}
  // Puddles: irregular, horizontal ink shapes rather than round pools.
  for(let i=0;i<27;i++){const x=r()*PIER.width,y=539+r()*157,w=15+r()*105;polygon(c,[[x-w,y],[x-w*.55,y-2],[x+w*.7,y-3],[x+w,y],[x+w*.6,y+3],[x-w*.8,y+2]],'#40515a22');line(c,x-w*.6,y+3,x+w*.5,y+3,'#859b9b19');}
  railing(c,365,PIER.width);
  terminal(c);
  groundDetails(c);
  // A small ferry direction plate, enamel worn around the edges.
  c.fillStyle='#142a32';c.fillRect(1145,390,101,32);c.strokeStyle='#647271';c.strokeRect(1145.5,390.5,101,32);label(c,'← İSKELE',1156,410,10,'#a5b4ae','sans-serif',1.3);
  line(c,1155,422,1155,505,'#0b1a22',4);

 });
 texture(scene,'foreground',PIER.width+128,720,c=>{
  // Close foreground edge and iron mooring rings give the scene a second depth plane.
  polygon(c,[[0,701],[PIER.width+128,686],[PIER.width+128,720],[0,720]],'#09131c');line(c,0,701,PIER.width+128,686,'#43515845',2);
  for(let x=0;x<PIER.width;x+=114)line(c,x,702,x+7,720,'#172730',2);
  ellipse(c,1185,680,43,7,'#08131b99');polygon(c,[[1164,685],[1168,664],[1158,656],[1159,650],[1202,650],[1205,656],[1195,663],[1198,685]],'#07121b','#24333b');
  ellipse(c,1182,651,23,5,'#25343a');ellipse(c,1182,650,20,3,'#13202a');
  c.strokeStyle='#4d544c';c.lineWidth=3;c.beginPath();c.moveTo(1193,669);c.bezierCurveTo(1220,660,1239,690,1282,680);c.stroke();
  foregroundDetails(c);
 });
}
/** Preserve the art exactly, but lift solid furniture out of the baked floor. */
export function addPierObjects(scene:Phaser.Scene){
 return PIER_OBJECTS.map(object=>{
  const {crop}=object,key=`object-${object.id}`;
  texture(scene,key,crop.width,crop.height,c=>{
   c.translate(-crop.x,-crop.y);
   if(object.kind==='bench')bench(c,object.x,object.y);
   else if(object.kind==='lamp')lamp(c,object.x,object.y);
   else if(object.kind==='mooring')mooring(c);
   else furniture(c,object.kind);
  });
  return scene.add.image(crop.x,crop.y,key).setOrigin(0).setDepth(promenadeDepth(object.sortY)).setName(object.id);
 });
}
function mooring(c:Ctx){
  // Mooring hardware and rope beside the terminal.
  ellipse(c,345,540,15,5,'#08141d');polygon(c,[[336,538],[337,525],[333,522],[335,518],[353,518],[355,522],[350,525],[351,538]],'#101b22','#435055');
  c.strokeStyle='#6f6d575e';c.lineWidth=2;c.beginPath();c.ellipse(358,544,17,4,-.2,0,Math.PI*2);c.stroke();
}

export function mosque(c:Ctx,x:number,y:number,s:number){c.save();c.translate(x,y);c.scale(s,s);const ink='#192e38';
 c.fillStyle=ink;c.fillRect(-75,-30,150,42);c.fillRect(-40,-62,80,65);
 dome(c,0,-64,37,ink);dome(c,-34,-45,25,ink);dome(c,34,-45,25,ink);dome(c,-61,-25,18,ink);dome(c,61,-25,18,ink);
 for(let dx=-66;dx<=66;dx+=22){dome(c,dx,-6,10,ink);line(c,dx-9,0,dx-9,13,'#63726d25');}
 line(c,0,-102,0,-116,'#273a41',2);ellipse(c,0,-115,3,3,'#63707160');
 for(const mx of [-87,-63,63,87]){const top=Math.abs(mx)===87?-123:-103;polygon(c,[[mx-3,7],[mx-2,top],[mx,top-17],[mx+2,top],[mx+3,7]],ink);c.fillStyle=ink;c.fillRect(mx-5,top+24,10,3);c.fillRect(mx-4,top+44,8,2);line(c,mx+2,top+2,mx+2,0,'#53606435');}
 for(let wx=-30;wx<=30;wx+=12){c.fillStyle='#d4b17643';c.fillRect(wx,-42,3,7);}
 c.restore();}
function dome(c:Ctx,x:number,y:number,r:number,color:string){c.fillStyle=color;c.beginPath();c.ellipse(x,y,r,r*.82,0,Math.PI,Math.PI*2);c.fill();line(c,x-r,y,x+r,y,'#54616640');}
export function railing(c:Ctx,start:number,end:number,gateLeft=BOARDING.gateLeft,gateRight=BOARDING.gateRight){
 for(let x=start;x<end;x+=48){if(x>gateLeft&&x<gateRight)continue;line(c,x,460,x,504,'#0b1b24',4);line(c,x+1,460,x+1,502,'#586b704b',1);ellipse(c,x,458,3,2,'#617273');}
 for(const [a,b] of [[start,gateLeft],[gateRight,end]]){line(c,a,459,b,459,'#0b1b24',5);line(c,a,457,b,457,'#74848780',1);line(c,a,483,b,483,'#11262e',3);}
 for(let x=start;x<end;x+=96){if(x<gateRight&&x+48>gateLeft)continue;line(c,x,466,x+48,492,'#243942',1);line(c,x+48,466,x,492,'#243942',1);}
}
function terminal(c:Ctx){
 // Old pier pavilion: tiled roof, clerestory, stone pilasters and lit arched doors.
 polygon(c,[[0,326],[298,326],[348,374],[0,374]],'#17242b','#536068');
 for(let y=332;y<365;y+=7)line(c,0,y,298+(y-326)*1.02,y,'#43505155');
 for(let x=0;x<318;x+=17)line(c,x,328,x+22,368,'#0a1b2480');
 polygon(c,[[0,369],[351,369],[352,378],[0,378]],'#090f18');line(c,0,370,349,370,'#7e827166',2);
 c.fillStyle='#263239';c.fillRect(0,380,325,132);
 c.fillStyle='#364044';c.fillRect(18,384,291,23);line(c,15,408,310,408,'#94937a60');
 label(c,'K A D I K Ö Y',74,401,16,'#c3bda1','Georgia');
 for(let x=27;x<310;x+=88){
  const g=c.createLinearGradient(x,420,x+64,499);g.addColorStop(0,'#b69d66');g.addColorStop(.5,'#7f754e');g.addColorStop(1,'#3d4640');
  c.fillStyle=g;c.beginPath();c.moveTo(x,501);c.lineTo(x,441);c.quadraticCurveTo(x,416,x+31,416);c.quadraticCurveTo(x+62,416,x+62,441);c.lineTo(x+62,501);c.closePath();c.fill();
  line(c,x+31,420,x+31,501,'#18252a',3);line(c,x,451,x+62,451,'#263031',3);line(c,x,480,x+62,480,'#3a3d33',2);
  c.fillStyle='#111e2780';c.fillRect(x+5,485,22,16);c.fillRect(x+36,485,21,16);
  line(c,x-3,439,x-3,504,'#91917b52',2);
 }
 for(const x of [7,99,187,313]){c.fillStyle='#3a4243';c.fillRect(x,411,9,97);line(c,x,411,x,507,'#83908265',1);c.fillStyle='#1b292f';c.fillRect(x-3,499,15,13);}
 polygon(c,[[0,511],[332,511],[344,521],[0,521]],'#111f28');line(c,0,513,333,513,'#73807875');
 // Small roof turret and the Turkish flag.
 polygon(c,[[113,322],[119,307],[211,307],[222,322]],'#111e27','#536164');c.fillStyle='#27363a';c.fillRect(124,282,82,25);
 polygon(c,[[117,284],[163,259],[213,284]],'#15232b','#556064');
 line(c,163,262,163,221,'#70807a',2);polygon(c,[[164,223],[182,226],[199,222],[196,245],[179,248],[164,244]],'#7d3b37');
 ellipse(c,177,234,6,6,'#b9b8a3');ellipse(c,179,233,5,5,'#7d3b37');label(c,'✦',182,238,8,'#b9b8a3');
 for(let x=133;x<201;x+=16){c.fillStyle='#b09a6470';c.fillRect(x,290,8,10);}
 // Suspended departure plaque.
 line(c,316,377,316,402,'#101c24',2);line(c,362,377,362,402,'#101c24',2);c.fillStyle='#16282f';c.fillRect(302,400,76,47);c.strokeStyle='#69756b';c.strokeRect(302,400,76,47);label(c,'SON VAPUR',309,417,8,'#abb1a2');label(c,SCENE_TIME,316,435,15,'#c0b58a','Georgia');
}
export function bench(c:Ctx,x:number,y:number){c.save();c.translate(x,y);ellipse(c,42,5,62,5,'#08141e55');for(let i=0;i<4;i++){polygon(c,[[0,-34+i*6],[91,-34+i*6],[92,-30+i*6],[1,-30+i*6]],'#4b4b40');line(c,1,-34+i*6,90,-34+i*6,'#83827263');}
 polygon(c,[[-5,-9],[93,-9],[104,-2],[-11,-2]],'#414239');line(c,-10,-2,103,-2,'#8d8a6d65');
 for(const bx of [7,81]){line(c,bx,-33,bx,8,'#0c1a22',4);line(c,bx,-3,bx-6,11,'#0c1a22',4);c.strokeStyle='#1c2b32';c.lineWidth=3;c.beginPath();c.moveTo(bx-7,-4);c.lineTo(bx-7,-17);c.quadraticCurveTo(bx,-25,bx+9,-17);c.lineTo(bx+9,-6);c.stroke();}c.restore();}
export function lamp(c:Ctx,x:number,y:number){
 line(c,x,y+9,x,516,'#0a1922',6);line(c,x+2,y+20,x+2,510,'#526269',1);
 polygon(c,[[x-9,517],[x-6,505],[x-4,497],[x+4,497],[x+6,505],[x+9,517]],'#10212a','#3e4e55');
 c.strokeStyle='#15252d';c.lineWidth=3;c.beginPath();c.moveTo(x,y+32);c.bezierCurveTo(x-28,y+15,x-25,y-3,x-2,y-7);c.stroke();
 polygon(c,[[x-10,y-2],[x+10,y-2],[x+7,y+15],[x-7,y+15]],'#c3ae79');line(c,x,y-1,x,y+14,'#4b4b3d',1.5);
 polygon(c,[[x-14,y-3],[x,y-12],[x+14,y-3]],'#15252e','#6f7768');line(c,x,y-12,x,y-17,'#263b43',2);line(c,x-8,y+17,x+8,y+17,'#20343b',3);
}
