import Phaser from 'phaser';
import {type Ctx,texture,random,polygon,line,ellipse,glow,label} from '../utils/drawing';
import {mosque,bench,lamp} from './environment';
import {createStairwell} from './stairs';
import {promenadeDepth} from '../scenes/promenade';
import {BRIDGE,BRIDGE_LIGHTS,BRIDGE_PROPS,BARRIER_PANELS,PROPPED_RODS,STAIRS} from '../scenes/galataBridgeConfig';

const W=BRIDGE.width,MID=BRIDGE.midX;
/** Top of the flagpole on the Eminönü-side control house of the opening span. */
export const FLAG_POLE={x:MID-92,y:256};

function ridge(c:Ctx,height:(x:number)=>number,from:number,to:number,base:number,color:string){
 c.beginPath();c.moveTo(from,base);for(let x=from;x<=to;x+=8)c.lineTo(x,height(x));c.lineTo(to,base);c.closePath();c.fillStyle=color;c.fill();
}
function litWindows(c:Ctx,r:()=>number,x:number,top:number,w:number,bottom:number,chance:number,size=[2,3]){
 for(let wy=top+6;wy<bottom-4;wy+=9)for(let wx=x+4;wx<x+w-4;wx+=7)if(r()>chance){c.fillStyle=r()>.5?'#c2a56f70':'#9aa39460';c.fillRect(wx,wy,size[0],size[1]);}
}

export function createGalataBridge(scene:Phaser.Scene){
 texture(scene,'galata-far',1760,390,c=>{
  // Looking up the Golden Horn: the historic peninsula ahead, the Beyoğlu slope behind.
  const r=random(1453);
  const peninsula=(x:number)=>341-102*Math.exp(-Math.pow((x-520)/380,2));
  const beyoglu=(x:number)=>346-104*Math.exp(-Math.pow((x-1600)/420,2));
  ridge(c,peninsula,0,1024,358,'#2a3e48');ridge(c,beyoglu,1040,1760,358,'#2a3e48');
  for(let x=0;x<1760;){
   const w=6+r()*9;if(x>1012&&x<1046){x+=w;continue;}
   const y=x<1030?peninsula(x):beyoglu(x),h=3+r()*11;c.fillStyle=r()>.5?'#2c414b':'#293d46';c.fillRect(x,y-h,w,358-y+h);
   if(r()>.55){c.fillStyle=r()>.4?'#b99e6b55':'#dcc39166';c.fillRect(x+2,y+3+r()*Math.max(1,348-y),1.5,2);}
   x+=w+1;
  }
  // Süleymaniye on its hill, softened by distance.
  c.save();c.globalAlpha=.78;mosque(c,520,250,.6);c.restore();
  // Further bridges up the Horn read only as thin strings of lamps.
  for(let x=940;x<1120;x+=7)ellipse(c,x,341+Math.sin(x*.05)*.6,.8,.7,x%3?'#d6b47a88':'#aebcae66');
  line(c,930,343,1130,343,'#7e8a8233');line(c,0,356,1760,356,'#83908733');
 });
 texture(scene,'galata-near',1900,400,c=>{
  const r=random(2207);
  // Eminönü: low waterfront blocks, the Spice Bazaar arcade, and Yeni Cami above them.
  for(let x=0;x<380;){const w=24+r()*30,h=22+r()*40;c.fillStyle=r()>.5?'#223842':'#1e333d';c.fillRect(x,354-h,w,h);litWindows(c,r,x,354-h,w,354,.72);x+=w+2;}
  c.fillStyle='#1f343e';c.fillRect(600,318,250,36);line(c,600,318,850,318,'#7f8c8340',2);
  for(let x=610;x<840;x+=19){c.fillStyle='#2e3f41';c.beginPath();c.arc(x+7,334,6,Math.PI,0);c.fill();c.fillStyle=r()>.6?'#b79e6b55':'#152b35';c.fillRect(x+2,334,10,13);}
  for(let x=626;x<840;x+=48){c.fillStyle='#1b303a';c.beginPath();c.ellipse(x,318,11,8,0,Math.PI,0);c.fill();}
  c.fillStyle='#192e38';c.fillRect(360,330,300,24);
  for(let x=372;x<650;x+=22){c.fillStyle='#d2af7440';c.beginPath();c.arc(x+8,347,6,Math.PI,0);c.fill();c.fillRect(x+2,347,12,6);}
  mosque(c,500,340,1.02);glow(c,500,300,120,'#cfae7010');
  // Behind: Karaköy's waterfront climbing toward Galata Tower.
  const slope=(x:number)=>x<1600?322-(x-1180)*.143:262-Math.min(160,x-1600)*.06+Math.max(0,x-1760)*.05;
  ridge(c,slope,1180,1900,354,'#1d323b');
  for(let x=1186;x<1900;){const w=10+r()*16,h=6+r()*12,y=slope(x);c.fillStyle=r()>.5?'#223842':'#1f343e';c.fillRect(x,y-h,w,354-y+h);if(r()>.5){c.fillStyle=r()>.5?'#b99f6b66':'#9aa39455';c.fillRect(x+3,y-h+4+r()*20,1.8,2.4);}x+=w+1;}
  // Galata Tower on the slope: stone drum, lit gallery, conical cap.
  c.fillStyle='#2e3f3f';c.fillRect(1527,198,28,66);c.fillStyle='#253535';c.fillRect(1547,198,8,66);ellipse(c,1541,199,14,3.5,'#3c4b48');
  polygon(c,[[1524,200],[1541,152],[1558,200]],'#20353d','#6f7a7255');line(c,1541,152,1541,143,'#6f7c72');
  c.fillStyle='#5b645655';c.fillRect(1522,220,38,5);
  for(let x=1530;x<1553;x+=6){c.fillStyle='#d0b27a88';c.fillRect(x,208,3,9);}
  glow(c,1541,212,34,'#d4b87616');
  for(let x=1170;x<1900;){
   const w=34+r()*40,h=34+r()*50+Math.max(0,x-1300)*.04,top=354-h;
   c.fillStyle=['#243943','#2a3e46','#213640'][Math.floor(r()*3)];c.fillRect(x,top,w,h);line(c,x,top,x+w,top,'#7584803d',2);
   for(let wy=top+7;wy<346;wy+=11)for(let wx=x+5;wx<x+w-5;wx+=9)if(r()>.7){c.fillStyle=r()>.5?'#c4a87070':'#8f9a8e55';c.fillRect(wx,wy,3,5);}
   x+=w+1;
  }
  line(c,0,354,1900,354,'#83908744',1.5);
  for(let i=0;i<90;i++){const x=r()*1900;if(x>860&&x<1170)continue;ellipse(c,x,352+r()*3,.8+r(),.7,r()>.4?'#d6af7799':'#adbbac70');}
 });
 texture(scene,'galata-underglow',W,520,c=>{
  // Light from the lower-level restaurants spills onto the water just beyond the rail.
  for(let x=30;x<W;x+=92){c.save();c.translate(x,500);c.scale(1,.22);glow(c,0,0,72,'#d6b06f3a');c.restore();}
  for(const [x,color] of [[410,'#a0584a26'],[1330,'#6fa09a1c'],[1790,'#a0584a20']] as const){c.save();c.translate(x,496);c.scale(1,.3);glow(c,0,0,55,color);c.restore();}
 });
 texture(scene,'galata-deck',W,720,c=>{
  const r=random(5521);
  // Wet granite walkway slabs, darkening toward the kerb.
  const g=c.createLinearGradient(0,506,0,664);g.addColorStop(0,'#2f3f45');g.addColorStop(.4,'#26363d');g.addColorStop(1,'#15222b');c.fillStyle=g;c.fillRect(0,506,W,158);
  const rows=[512,530,556,588,624,662];
  for(const y of rows.slice(1,5)){line(c,0,y,W,y,'#0a17226e');line(c,0,y+1,W,y+1,'#8a9b9a0d');}
  for(let row=0;row<5;row++)for(let x=-120+(row%2)*52;x<W+120;x+=104+row*14)line(c,x+(x-MID)*.012*row,rows[row],x+(x-MID)*.012*(row+1),rows[row+1],'#0a18294a');
  for(let i=0;i<2300;i++){const x=r()*W,y=516+r()*140;line(c,x,y,x+1+r()*13,y,r()>.5?'#82958f0e':'#000c141d');}
  for(let i=0;i<24;i++){const x=r()*W,y=536+r()*110,w=15+r()*95;polygon(c,[[x-w,y],[x-w*.55,y-2],[x+w*.7,y-3],[x+w,y],[x+w*.6,y+3],[x-w*.8,y+2]],'#40515a22');line(c,x-w*.6,y+3,x+w*.5,y+3,'#859b9b19');}
  // Steel expansion plates mark the opening span at the middle of the bridge.
  for(const x of [MID-128,MID+128]){polygon(c,[[x-6,512],[x+6,512],[x+9,662],[x-9,662]],'#1d2c33','#5f6e6a40');for(let y=518;y<660;y+=6)line(c,x-6-(y-512)*.02,y,x+6+(y-512)*.02,y,'#8d9a920f');}
  c.fillStyle='#394649';c.fillRect(0,650,W,14);line(c,0,650,W,650,'#93a09a55',2);line(c,0,664,W,664,'#0a141c',3);
  // Deck edge beam, then a dense baluster railing with heavy posts and a wet top rail.
  c.fillStyle='#0f1d26';c.fillRect(0,498,W,14);line(c,0,506,W,506,'#6b797b',2);line(c,0,511,W,511,'#0b1922',3);
  for(let x=0;x<W;x+=9)line(c,x,460,x,500,'#0d1c25',1.6);
  for(let x=0;x<W;x+=45){line(c,x,450,x,504,'#0b1a22',5);line(c,x+2,452,x+2,502,'#61737655');ellipse(c,x,449,3.5,2,'#6a7a79');}
  line(c,0,452,W,452,'#0b1a22',6);line(c,0,449,W,449,'#8d9b9670',1.5);line(c,0,480,W,480,'#13262f',2);line(c,0,499,W,499,'#0b1a22',4);
  for(let i=0;i<60;i++){const x=r()*W;line(c,x,449.5,x+4+r()*14,449.5,'#c4b88a44');}
  for(const rod of PROPPED_RODS){
   c.strokeStyle='#0e1d25';c.lineWidth=2;c.beginPath();c.moveTo(rod.x,509);c.quadraticCurveTo(rod.x+(rod.tipX-rod.x)*.45,440,rod.tipX,rod.tipY);c.stroke();
   ellipse(c,rod.x+(rod.tipX-rod.x)*.06,494,3,2.4,'#5c6b63');
  }
  // Direction plate on the rail beyond the closed walkway.
  line(c,124,436,124,452,'#0b1a22',3);line(c,174,436,174,452,'#0b1a22',3);
  c.fillStyle='#14303a';c.fillRect(100,412,96,24);c.strokeStyle='#6f8277';c.strokeRect(100.5,412.5,95,23);label(c,'← EMİNÖNÜ',108,429,11,'#c6c7ad','sans-serif',1);
 });
 texture(scene,'galata-span',320,270,c=>{
  // Two small control houses of the opening span, with the bridge's nameplate between them.
  for(const px of [40,224]){
   c.fillStyle='#2b3c40';c.fillRect(px,84,56,182);line(c,px,84,px+56,84,'#8d998c55',2);c.fillStyle='#233439';c.fillRect(px+48,84,8,182);
   polygon(c,[[px-6,86],[px+28,56],[px+62,86]],'#17282f','#6a7a7166');
   for(const wy of [104,150]){c.fillStyle='#152a33';c.fillRect(px+10,wy,32,30);c.fillStyle=wy===104?'#b89f6a66':'#c7ab7155';c.fillRect(px+13,wy+3,26,24);line(c,px+26,wy+3,px+26,wy+27,'#243836',2);}
   c.fillStyle='#1c2d33';c.fillRect(px-4,236,64,30);line(c,px-4,236,px+60,236,'#7d897f44',2);
  }
  line(c,96,126,102,126,'#15262d',3);line(c,218,126,224,126,'#15262d',3);
  c.fillStyle='#14303a';c.fillRect(102,116,116,22);c.strokeStyle='#768578';c.strokeRect(102.5,116.5,115,21);label(c,'GALATA KÖPRÜSÜ',109,131,10,'#cfc8a6','Georgia, serif',.6);
  line(c,68,56,68,10,'#71807a',2);ellipse(c,68,9,2,2,'#9aa596');
 });
 texture(scene,'galata-road',W+140,820,c=>{
  // The tram road nearer the viewer: a low guardrail on the kerb, wet asphalt and grooved rails.
  const r=random(7717),w=W+140;
  const g=c.createLinearGradient(0,664,0,820);g.addColorStop(0,'#131f28');g.addColorStop(1,'#070f15');c.fillStyle=g;c.fillRect(0,664,w,156);
  for(let i=0;i<900;i++){const x=r()*w,y=690+r()*125;line(c,x,y,x+3+r()*20,y,r()>.5?'#8ea4a012':'#00000066');}
  for(const y of [700,712,778,790]){line(c,0,y,w,y,'#3f4c4c',2);line(c,0,y-1,w,y-1,'#8e9b9433');}
  for(let x=0;x<w;x+=64)line(c,x,746,x+30,746,'#76807a2e',2);
  for(let x=20;x<w;x+=72){line(c,x,660,x,692,'#0a1820',5);line(c,x+2,662,x+2,690,'#5d6e6b55');}
  c.fillStyle='#22333a';c.fillRect(0,664,w,12);line(c,0,664,w,664,'#8d9b9580',1.5);line(c,0,670,w,670,'#101f27',2);line(c,0,676,w,676,'#0a1820',2);
  for(let i=0;i<70;i++){const x=r()*w;line(c,x,664.5,x+3+r()*10,664.5,'#d2c08e40');}
 });
 texture(scene,'galata-bucket',30,34,c=>{
  ellipse(c,15,31,13,3,'#06151e99');polygon(c,[[5,9],[25,9],[23,30],[7,30]],'#31464a','#7b8a7f66');
  ellipse(c,15,9,10,3,'#667568');ellipse(c,15,9,8.5,2.2,'#0d1d25');line(c,10,9,15,8,'#a9b8b055');
  c.strokeStyle='#5f6d66';c.lineWidth=1;c.beginPath();c.ellipse(15,9,10,9,0,Math.PI,Math.PI*2);c.stroke();
 });
 texture(scene,'galata-tackle',40,26,c=>{
  ellipse(c,20,23,18,3,'#06151e99');polygon(c,[[4,8],[36,8],[35,22],[5,22]],'#3f4a3a','#8a917866');
  line(c,4,12,36,12,'#1f2b28',2);line(c,15,8,17,3,'#5d6656',2);line(c,25,8,23,3,'#5d6656',2);line(c,17,3,23,3,'#5d6656',2);
 });
 texture(scene,'galata-barrier',72,56,c=>{
  // Work barrier panel: striped board on splayed feet, a warning lamp on top.
  ellipse(c,36,53,32,3,'#06151e88');
  for(const x of [10,62]){line(c,x,18,x,52,'#15262d',4);line(c,x-8,52,x+8,52,'#15262d',4);}
  c.save();c.beginPath();c.rect(4,16,64,18);c.clip();c.fillStyle='#7e7b6b';c.fillRect(4,16,64,18);for(let x=-10;x<80;x+=16)polygon(c,[[x,16],[x+8,16],[x+18,34],[x+10,34]],'#5d3632');c.restore();
  c.strokeStyle='#2a3a3e';c.strokeRect(4.5,16.5,63,17);line(c,34,16,34,9,'#15262d',2);ellipse(c,34,6,4,4,'#5e4e33');
 });
 texture(scene,'galata-closed-sign',140,96,c=>{
  ellipse(c,70,93,52,3,'#06151e88');line(c,22,44,20,94,'#122229',4);line(c,118,44,120,94,'#122229',4);
  c.fillStyle='#1a2f36';c.fillRect(4,4,132,46);c.strokeStyle='#8a8e7a';c.strokeRect(4.5,4.5,131,45);c.fillStyle='#7a4640';c.fillRect(5,5,130,6);
  label(c,'YAYA YOLU KAPALI',16,29,10,'#d8cfae','sans-serif',.4);label(c,'Köprü bakım çalışması',14,43,9,'#a3ada2','sans-serif',.2);
 });
 scene.add.image(-160,0,'galata-far').setOrigin(0).setDepth(.8).setScrollFactor(.15);
 scene.add.image(-170,0,'galata-near').setOrigin(0).setDepth(2.1).setScrollFactor(.3);
 scene.add.image(0,0,'galata-underglow').setOrigin(0).setDepth(6.6);
 scene.add.image(0,0,'galata-deck').setOrigin(0).setDepth(10);
 scene.add.image(MID-160,244,'galata-span').setOrigin(0).setDepth(10.2);
 BRIDGE_LIGHTS.forEach(({x,y},i)=>{
  const crop={x:x-32,y:y-20,width:65,height:540-y},key=`galata-lamp-${i}`;
  texture(scene,key,crop.width,crop.height,c=>{c.translate(-crop.x,-crop.y);lamp(c,x,y);});
  scene.add.image(crop.x,crop.y,key).setOrigin(0).setDepth(promenadeDepth(517)).setName(`bridge-lamp-${i}`);
 });
 for(const prop of BRIDGE_PROPS){
  if(prop.kind==='bench'){
   const crop={x:prop.x-24,y:500,width:140,height:55};
   texture(scene,'galata-bench',crop.width,crop.height,c=>{c.translate(-crop.x,-crop.y);bench(c,prop.x,prop.y);});
   scene.add.image(crop.x,crop.y,'galata-bench').setOrigin(0).setDepth(promenadeDepth(prop.y)).setName(prop.id);
  }else scene.add.image(prop.x,prop.y+3,prop.kind==='bucket'?'galata-bucket':'galata-tackle').setOrigin(.5,prop.kind==='bucket'?31/34:23/26).setDepth(promenadeDepth(prop.y)).setName(prop.id);
 }
 BARRIER_PANELS.forEach(({x,y},i)=>scene.add.image(x,y,'galata-barrier').setOrigin(.5,53/56).setDepth(promenadeDepth(y)).setName(`barrier-${i}`));
 scene.add.image(76,560,'galata-closed-sign').setOrigin(.5,93/96).setDepth(promenadeDepth(560));
 scene.add.image(-70,0,'galata-road').setOrigin(0).setDepth(30).setScrollFactor(1.04);
 createStairwell(scene,'galata',STAIRS,'kerb',['↓ ALT KAT','EMİNÖNÜ']);
}
