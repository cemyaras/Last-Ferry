import {type Ctx,polygon,line,ellipse,random,label} from '../utils/drawing';
import {PIER} from '../scenes/config';

/** Sparse, grounded details. All positions belong to this same continuous quay. */
export function groundDetails(c:Ctx){
 const r=random(486);
 for(const [x,y,w] of [[518,594,95],[970,620,126],[1460,566,78],[1830,616,99],[224,640,69]]){
  polygon(c,[[x-w,y],[x-w*.6,y-5],[x-14,y-3],[x+21,y-8],[x+w*.8,y-5],[x+w,y],[x+w*.4,y+7],[x-25,y+6]],'#45606b25');
  line(c,x-w*.6,y+4,x+w*.4,y+5,'#8bada734');line(c,x-w*.7,y-3,x-30,y-4,'#718e932d');
 }
 // Narrow drains inset in the paving, with wet metal lips.
 for(const x of [389,1038,1549,1940]){polygon(c,[[x,550],[x+53,550],[x+56,558],[x-2,558]],'#091a24','#475952');for(let j=3;j<50;j+=5)line(c,x+j,551,x+j+1,556,'#4c626260');line(c,x-2,560,x+56,560,'#829a8623');}
 // Service covers and repaired stone interrupt the regular paving rhythm.
 for(const x of [730,1585]){polygon(c,[[x,601],[x+52,601],[x+58,616],[x-5,616]],'#182b33','#52625d55');for(let j=6;j<49;j+=7)line(c,x+j,605,x+j+2,612,'#42534f60');}
 for(let i=0;i<42;i++){const x=70+r()*(PIER.width-140),y=525+r()*125;line(c,x,y,x+3+r()*9,y+.5,'#91a29a25');}
 // Two rain-soaked tickets and a few leaves; deliberately not a scatter of clutter.
 polygon(c,[[690,553],[700,551],[704,555],[695,558]],'#93978a80');line(c,695,553,701,553,'#4d656377');
 polygon(c,[[1532,588],[1543,586],[1540,592],[1533,593]],'#8a938366');
 for(const [x,y] of [[385,562],[963,541],[1453,568],[1466,572],[1965,546]])polygon(c,[[x-3,y],[x,y-2],[x+5,y+1],[x+1,y+3]],'#7b6d4860');
 }
/** These existing objects are drawn separately so feet-Y can sort them. */
export function furniture(c:Ctx,kind:'bin'|'cabinet'|'reel'){
 if(kind==='bin'){bin(c,1392,539);return;}
 if(kind==='cabinet'){
  polygon(c,[[1940,475],[1974,475],[1978,538],[1938,538]],'#213038','#51615a');line(c,1957,480,1957,534,'#0c202b');label(c,'İSKELE',1944,491,6,'#a0a38a');
  for(let y=501;y<525;y+=4)line(c,1945,y,1951,y,'#526362');
 }else{
  ellipse(c,1997,537,20,4,'#0a172099');ellipse(c,1996,521,12,15,'#293b3e');ellipse(c,1996,521,8,11,'#666752');ellipse(c,1996,521,3,4,'#172932');
 }
}

export function foregroundDetails(c:Ctx){
 // Near objects frame the walkway and pass slightly faster than the traveller.
 bollard(c,202,680,.9);bollard(c,1664,687,1.05);bollard(c,2200,677,1);
 c.strokeStyle='#62664d';c.lineWidth=2;c.beginPath();c.moveTo(201,669);c.bezierCurveTo(229,697,290,681,275,674);c.bezierCurveTo(246,663,222,688,267,691);c.bezierCurveTo(308,695,327,680,361,683);c.stroke();
 line(c,199,670,207,682,'#aa9f7348',1);
 // A partial foreground rail: not a barrier across the player's route.
 for(const x of [-12,38]){line(c,x,635,x,715,'#07141d',10);line(c,x+3,640,x+3,710,'#52646180',1);ellipse(c,x,633,7,4,'#405659');}
 line(c,-20,645,65,645,'#0a1a23',7);line(c,-20,642,64,642,'#70847f80',1);
 // Small wet highlights, not another layer of opaque furniture.
 for(const [x,y] of [[173,688],[1155,689],[1640,693],[2140,691]]){line(c,x,y,x+58,y-1,'#8a9e8740');line(c,x+12,y+3,x+39,y+3,'#718e9035');}
}
function bollard(c:Ctx,x:number,y:number,s:number){c.save();c.translate(x,y);c.scale(s,s);ellipse(c,0,0,32,6,'#050f1899');polygon(c,[[-16,0],[-13,-20],[-21,-25],[-20,-32],[20,-32],[21,-25],[13,-20],[17,0]],'#0b1a24','#34494b');ellipse(c,0,-32,21,4,'#415252');ellipse(c,0,-33,17,2,'#73807565');line(c,-11,-24,-13,-3,'#61787365');c.restore();}
function bin(c:Ctx,x:number,y:number){ellipse(c,x,y,20,4,'#081a2299');polygon(c,[[x-14,y-42],[x+14,y-42],[x+12,y],[x-12,y]],'#1a3038','#526661');for(let i=-8;i<12;i+=5)line(c,x+i,y-32,x+i,y-4,'#40524e');ellipse(c,x,y-42,16,4,'#4e625c');ellipse(c,x,y-43,11,2,'#0c202a');line(c,x-13,y-35,x+13,y-35,'#8c92714f');}
