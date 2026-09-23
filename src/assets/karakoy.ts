import Phaser from 'phaser';
import {type Ctx,texture,random,polygon,line,ellipse,glow,label} from '../utils/drawing';
import {KARAKOY,STREET_LIGHTS} from '../scenes/karakoyConfig';
import {promenadeDepth} from '../scenes/promenade';

/** The same waterfront silhouettes appear from the arriving boat and on shore. */
export function createKarakoyWaterfront(scene:Phaser.Scene){
 texture(scene,'karakoy-waterfront',1500,380,c=>{
  const r=random(573);
  for(let x=0;x<1500;x+=73){const h=90+r()*100,y=338-h;
   c.fillStyle=['#293c42','#334548','#38474a'][Math.floor(r()*3)];c.fillRect(x,y,70,h);
   line(c,x,y,x+70,y,'#72807855',3);line(c,x+4,y+7,x+65,y+7,'#0e26324a',2);
   for(let wy=y+21;wy<321;wy+=30)for(let wx=x+12;wx<x+65;wx+=23){c.fillStyle=r()>.7?'#b2a27488':'#162e39';c.fillRect(wx,wy,10,17);line(c,wx-2,wy+19,wx+13,wy+19,'#66746d55',2);}
  }
  // Galata's cylindrical body, gallery and unmistakable conical roof.
  c.fillStyle='#43534f';c.fillRect(1055,111,46,119);ellipse(c,1078,112,23,6,'#56615a');
  polygon(c,[[1052,110],[1078,46],[1104,110]],'#273c44','#78817a66');line(c,1078,46,1078,34,'#788579',1);
  c.fillStyle='#6d746157';c.fillRect(1050,144,57,8);for(let x=1062;x<1100;x+=12){c.fillStyle='#c6aa7477';c.fillRect(x,126,5,13);}
  c.fillStyle='#18303a';c.fillRect(0,333,1500,26);line(c,0,337,1500,337,'#82928a66',2);
  polygon(c,[[570,312],[765,312],[786,329],[550,329]],'#21353b','#758077');c.fillStyle='#455552';c.fillRect(561,329,215,36);
  for(let x=571;x<770;x+=23){c.fillStyle='#bba47788';c.fillRect(x,337,14,20);}
  label(c,'K A R A K Ö Y',607,324,9,'#c4b88f');
  for(let x=20;x<1480;x+=97){line(c,x,324,x,354,'#1a3038',2);ellipse(c,x,324,2,2,'#dfc186aa');glow(c,x,324,14,'#d4b87615');}
 });
}

function window(c:Ctx,x:number,y:number,w:number,h:number,lit:boolean){
 c.fillStyle='#152831';c.fillRect(x-4,y-3,w+8,h+9);c.fillStyle=lit?'#8b825e':'#273c42';c.fillRect(x,y,w,h);
 if(lit){const g=c.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#c7ae7870');g.addColorStop(1,'#46555177');c.fillStyle=g;c.fillRect(x,y,w,h);}
 line(c,x+w/2,y,x+w/2,y+h,'#263a3c',3);line(c,x,y+h*.53,x+w,y+h*.53,'#23383b',3);
 line(c,x-6,y+h+5,x+w+6,y+h+5,'#87908455',3);
 // Tall narrow shutters and small hinges belong to the building, not a UI frame.
 for(const sx of [x-13,x+w+4]){c.fillStyle='#293d3c';c.fillRect(sx,y,9,h);for(let yy=y+4;yy<y+h;yy+=5)line(c,sx,yy,sx+9,yy,'#72807133');}
}
function facade(c:Ctx,x:number,w:number,roof:number,color:string,shop:string,lit=false){
 const r=random(x+32);
 c.fillStyle=color;c.fillRect(x,roof,w,522-roof);
 c.fillStyle='#112631';c.fillRect(x+w-10,roof,10,522-roof);
 for(const y of [roof+7,roof+103,roof+203,385]){line(c,x-3,y,x+w+3,y,'#9aa08c35',4);line(c,x,y+5,x+w,y+5,'#13273099',3);}
 for(let y=roof+27;y<346;y+=99)for(let xx=x+31;xx<x+w-31;xx+=66)window(c,xx,y,31,53,r()>.83);
 // Fine plaster damage and damp streaking break the large colour fields.
 for(let i=0;i<160;i++){const xx=x+8+r()*(w-21),y=roof+r()*(520-roof);line(c,xx,y,xx+r()*6,y+3+r()*14,r()>.5?'#b0ac8d0d':'#091d2825');}
 c.fillStyle='#182d35';c.fillRect(x+16,398,w-38,113);
 c.fillStyle='#45534c';c.fillRect(x+12,387,w-31,25);line(c,x+12,388,x+w-19,388,'#93937b66');
 label(c,shop,x+25,404,11,'#c0b797','Georgia, serif',1.1);
 const sw=(w-53)/2;
 for(let n=0;n<2;n++){const sx=x+22+n*(sw+8);c.fillStyle=lit?'#696b51':'#344346';c.fillRect(sx,421,sw,83);
  for(let y=424;y<503;y+=5){line(c,sx,y,sx+sw,y,lit?'#243b3a77':'#0e252b99',1);line(c,sx,y+1,sx+sw,y+1,'#9a9e8022');}
  if(lit){c.fillStyle='#bca16b55';c.fillRect(sx,491,sw,6);}line(c,sx+sw/2-7,487,sx+sw/2+7,487,'#a0a48b55',2);
 }
 line(c,x+12,516,x+w-20,516,'#8b94835c',3);
 line(c,x+w-13,roof+5,x+w-13,517,'#122a33',4);line(c,x+w-11,roof+5,x+w-11,517,'#85918344');
}
export function createKarakoy(scene:Phaser.Scene){
 const w=KARAKOY.width;
 texture(scene,'karakoy-street',w,720,c=>{
  // A shallow, continuous walking strip; uphill geometry begins beyond it.
  const g=c.createLinearGradient(0,510,0,720);g.addColorStop(0,'#344247');g.addColorStop(.5,'#25353c');g.addColorStop(1,'#111f29');c.fillStyle=g;c.fillRect(0,511,w,209);
  const r=random(231);
  for(let row=0;row<9;row++){const y=522+row*16+row*row*.52,h=15+row;
   for(let x=-50;x<w;x+=55+row*3){const xx=x+(row%2)*29;polygon(c,[[xx,y],[xx+51+row*3,y-1],[xx+57+row*3,y+h],[xx+1,y+h]],r()>.5?'#57635e16':'#0a1d2829');line(c,xx,y,xx+50+row*3,y,'#9aab9a18');}}
  for(let i=0;i<1200;i++){const x=r()*w,y=524+r()*180;line(c,x,y,x+2+r()*17,y,r()>.6?'#a4b2a619':'#06192633');}
  for(const [x,y,size] of [[300,609,95],[687,584,126],[1002,617,104],[1455,573,120],[1680,600,64]]){polygon(c,[[x-size,y],[x-size/2,y-3],[x+size*.7,y-5],[x+size,y],[x+size*.5,y+4],[x-size*.7,y+2]],'#61787528');line(c,x-size*.6,y+3,x+size*.5,y+3,'#a7b8a52e');}
  // Drainage follows the lane towards the receding stair entrance.
  line(c,487,523,1820,521,'#89968750',2);line(c,488,527,1820,525,'#071c28',3);
  for(const x of [382,734,1326,1718]){c.fillStyle='#0b202b';c.fillRect(x,608,36,8);for(let j=2;j<36;j+=5)line(c,x+j,609,x+j,615,'#61736b',1);}
 });
 texture(scene,'karakoy-buildings',w,540,c=>{
  // Open water is still visible through the left-hand gap beside the terminal.
  polygon(c,[[57,363],[275,363],[298,388],[40,388]],'#1c3039','#7a897b55');c.fillStyle='#485650';c.fillRect(61,388,222,149);
  for(const x of [80,201]){c.fillStyle='#122c36';c.fillRect(x,414,62,115);line(c,x,529,x+62,529,'#839585',2);}
  c.fillStyle='#9e956c';c.fillRect(148,414,41,80);line(c,168,414,168,494,'#2b423f',3);
  label(c,'KARAKÖY İSKELESİ',77,406,12,'#c2bc9b','Georgia, serif');label(c,'ÇIKIŞ',93,433,9,'#8faaa3');
  for(let x=0;x<480;x+=43){line(c,x,490,x,518,'#162d37',3);line(c,x,487,x+43,487,'#64797166',2);}
  facade(c,488,210,121,'#36464a','R I H T I M');
  facade(c,699,282,75,'#414b48','SAATÇİ  ·  1926');
  facade(c,982,231,139,'#304247','KİTAP & KÂĞIT');
  facade(c,1214,320,93,'#454d46','KAHVE',true);
  // Canvas shop awnings, old number plates and a modest hanging clock sign.
  polygon(c,[[1219,384],[1522,384],[1536,417],[1208,417]],'#263c39','#7e887455');
  for(let x=1221;x<1530;x+=25)line(c,x,386,x-6,416,'#a5a17c21',9);
  line(c,1208,418,1536,418,'#122a32',3);
  for(const [x,n] of [[684,'14'],[965,'18'],[1198,'22']]){c.fillStyle='#2b4548';c.fillRect(Number(x)-16,368,19,15);label(c,String(n),Number(x)-12,379,9,'#b8baa0');}
  line(c,721,341,687,341,'#102a34',3);line(c,690,341,690,363,'#102a34',2);
  ellipse(c,690,375,14,16,'#1b343c');ellipse(c,690,375,11,13,'#8c8e70');line(c,690,375,690,367,'#293c3b',1.5);line(c,690,375,695,379,'#293c3b',1.5);
  // Projecting wooden bay, iron balcony, worn masonry and small enamel signs.
  polygon(c,[[736,186],[887,186],[901,263],[727,263]],'#31423f','#88917b66');
  for(let x=749;x<888;x+=45)window(c,x,198,25,47,false);
  for(let x=1004;x<1180;x+=14)line(c,x,279,x,311,'#102b34',2);line(c,997,278,1189,278,'#728279',2);line(c,998,312,1190,312,'#102b34',5);
  c.fillStyle='#213b40';c.fillRect(1244,364,96,18);label(c,'GALATA ↗',1254,377,10,'#b4b59b');
  // A compressed uphill lane, with stairs ending at a shut iron gate.
  polygon(c,[[1534,523],[1849,523],[1761,235],[1638,235]],'#24373d');
  polygon(c,[[1534,523],[1582,519],[1654,222],[1603,192]],'#354640','#7e897953');
  polygon(c,[[1813,523],[1919,531],[1919,181],[1764,207]],'#283c3e');
  for(let i=0;i<15;i++){const y=514-i*14.3,left=1570+i*5.5,right=1821-i*3.7;polygon(c,[[left,y],[right,y],[right-3,y-8],[left+3,y-8]],i%2?'#46554c':'#3a4c46');line(c,left,y,right,y,'#9ca08755',1.5);}
  // Gate across the actual playable boundary, with the continuation visible beyond.
  for(let x=1554;x<1850;x+=15)line(c,x,461,x,525,'#0d2530',3);
  line(c,1551,466,1852,466,'#7c8c7a77',2);line(c,1551,515,1852,515,'#122b33',3);
  c.fillStyle='#263e41';c.fillRect(1640,477,112,20);label(c,'GEÇİŞ KAPALI',1650,491,10,'#a8b09b');
  for(const x of [1570,1790]){line(c,x,445,x,530,'#1a3239',6);ellipse(c,x,444,5,3,'#839380');}
  // The lane continues visually into old masonry, without opening another area.
  polygon(c,[[1644,304],[1771,304],[1759,219],[1659,215]],'#35463f');
  c.fillStyle='#152c33';c.fillRect(1681,236,59,68);c.beginPath();c.arc(1710,238,29,Math.PI,0);c.fill();
  line(c,1683,305,1739,305,'#97a08755',2);
  for(let x=1689;x<1739;x+=9)line(c,x,238,x,302,'#63756555',2);
  glow(c,1708,259,63,'#cbb57813');ellipse(c,1708,242,3,5,'#d4c18a');
  line(c,1651,308,1581,486,'#8b957455',2);line(c,1769,306,1813,486,'#6f846655',2);
  for(let i=0;i<8;i++){const y=242+i*32;line(c,1614-i*6,y,1632-i*7,y+8,'#91a08627',2);line(c,1800+i*4,y,1900,y-12,'#8a957521',2);}
  // End wall prevents walking around the stair gate into an empty district.
  polygon(c,[[1789,526],[1920,533],[1920,720],[1810,720],[1789,634]],'#23373b','#50665d');
  c.save();c.strokeStyle='#132b34';c.lineWidth=2;
  for(let y=60;y<350;y+=55){c.beginPath();c.moveTo(479,y);c.quadraticCurveTo(1040,y+113,1640,y+12);c.stroke();}c.restore();
  line(c,802,75,799,25,'#132b34',2);line(c,778,38,825,38,'#132b34');
 });
 // The boundary wall extends below the facade texture; render as a separate solid.
 texture(scene,'karakoy-endwall',140,210,c=>{polygon(c,[[0,0],[140,6],[140,210],[21,210],[0,108]],'#24383b','#586b5f');for(let y=17;y<210;y+=23)line(c,4,y,140,y+3,'#142c3466');});
 scene.add.image(0,0,'karakoy-buildings').setOrigin(0).setDepth(10.5);
 scene.add.image(0,0,'karakoy-street').setOrigin(0).setDepth(10);
 scene.add.image(1789,526,'karakoy-endwall').setOrigin(0).setDepth(29);
 texture(scene,'karakoy-lamp',60,265,c=>{line(c,30,30,30,260,'#102733',5);line(c,32,33,32,258,'#84957b55');polygon(c,[[15,12],[44,12],[40,37],[20,37]],'#bfb181','#364943');polygon(c,[[11,13],[30,0],[48,13]],'#263b40','#708271');line(c,20,13,23,36,'#304646');line(c,38,13,35,36,'#304646');ellipse(c,30,261,10,3,'#172e36');});
 for(const l of STREET_LIGHTS)scene.add.image(l.x,l.y-9,'karakoy-lamp').setOrigin(.5,0).setDisplaySize(46,529-l.y+9).setDepth(promenadeDepth(529));
 texture(scene,'karakoy-bollard',50,55,c=>{ellipse(c,25,50,21,4,'#061a2599');polygon(c,[[17,49],[19,16],[13,10],[15,5],[35,5],[38,10],[31,17],[34,49]],'#21343b','#687d70');ellipse(c,25,7,13,4,'#5a6f65');});
 scene.add.image(449,569,'karakoy-bollard').setOrigin(.5,1).setDepth(promenadeDepth(563)).setName('karakoy-bollard');
 texture(scene,'karakoy-planter',90,99,c=>{ellipse(c,45,94,44,4,'#071c2799');polygon(c,[[8,54],[82,54],[73,93],[17,93]],'#3d4c44','#79816a');line(c,12,62,79,62,'#172e34',2);const r=random(672);for(let i=0;i<34;i++){const x=20+r()*51,y=8+r()*50;line(c,44,64,x,y,'#263d37',2);ellipse(c,x,y,4+r()*4,2+r()*5,r()>.5?'#45564a':'#2e463e');}});
 scene.add.image(1160,577,'karakoy-planter').setOrigin(.5,1).setDepth(promenadeDepth(570)).setName('karakoy-planter');
 texture(scene,'karakoy-foreground',w+100,720,c=>{
  polygon(c,[[0,691],[w,677],[w+100,720],[0,720]],'#071721');line(c,0,690,w,676,'#81948628',2);
  // Close awning corners and ironwork frame the lane without hiding its route.
  polygon(c,[[0,0],[346,0],[160,88],[0,112]],'#0c1e28');line(c,0,111,162,87,'#657b6944',2);
  polygon(c,[[1460,0],[w+100,0],[w+100,139],[1684,86]],'#0b202a');
  for(const x of [77,1361]){line(c,x,659,x,716,'#0a1d27',7);ellipse(c,x,658,7,3,'#52695d');}
 });
 scene.add.image(0,0,'karakoy-foreground').setOrigin(0).setDepth(35).setScrollFactor(1.025);
}
