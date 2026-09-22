import Phaser from 'phaser';
import {texture,polygon,line,ellipse,label} from '../utils/drawing';
export function createFerryTexture(scene:Phaser.Scene){texture(scene,'ferry',400,160,c=>{
 // Double-ended Şehir Hatları silhouette: dark hull, two cream decks, one funnel.
 polygon(c,[[12,126],[370,126],[387,116],[374,139],[346,150],[51,150],[23,140]],'#101e26','#6b7776');
 polygon(c,[[28,112],[357,112],[373,126],[17,126]],'#8d9587');
 line(c,22,127,370,127,'#788575',3);line(c,40,145,352,145,'#775c48',2);
 polygon(c,[[53,75],[312,75],[337,111],[42,111]],'#828f86','#222f31');
 c.fillStyle='#253637';c.fillRect(50,91,277,12);
 for(let x=60;x<320;x+=18){c.fillStyle=x%36?'#d6b77b':'#b2a776';c.fillRect(x,92,11,9);line(c,x+4,92,x+4,101,'#64644e',1);}
 polygon(c,[[95,54],[289,54],[306,75],[75,75]],'#9ca18e');
 for(let x=101;x<285;x+=19){polygon(c,[[x,59],[x+12,59],[x+14,70],[x,70]],'#d6bb83');}
 polygon(c,[[73,75],[310,75],[314,80],[65,80]],'#223036');
 c.fillStyle='#b7b398';c.fillRect(93,51,198,4);
 // Wheelhouse at the bow, open aft deck, lifeboat and ventilation cowls.
 polygon(c,[[86,49],[126,49],[132,55],[82,55]],'#283c40');
 c.fillStyle='#73867e';c.fillRect(91,40,32,10);c.fillStyle='#d0ba83';c.fillRect(94,42,10,6);c.fillRect(108,42,10,6);line(c,88,39,124,39,'#a9af95',2);
 polygon(c,[[222,47],[262,47],[256,52],[229,52]],'#c2be9c','#415755');
 for(const x of [151,217]){line(c,x,50,x,38,'#87978b',3);ellipse(c,x-2,38,4,3,'#758980');}
 for(let x=141;x<283;x+=12)line(c,x,42,x,50,'#72877b',.7);line(c,139,42,285,42,'#a6ad96',.8);

 c.fillStyle='#28373b';c.fillRect(178,23,27,28);c.fillStyle='#9e8052';c.fillRect(178,32,27,12);c.fillStyle='#172730';c.fillRect(174,21,35,5);
 line(c,256,52,256,6,'#4b5c5e',2);line(c,239,24,272,24,'#637271',1);line(c,256,11,318,82,'#78827860');line(c,256,11,217,50,'#78827860');
 line(c,64,79,64,110,'#77867c',2);polygon(c,[[64,80],[47,81],[49,91],[64,91]],'#863e37');ellipse(c,56,86,3,3,'#c5bdae');ellipse(c,55,85,2.5,2.5,'#863e37');
 for(let x=39;x<352;x+=13)line(c,x,107,x,117,'#535f5b',1);line(c,39,107,352,107,'#b7b69a');
 for(const x of [72,304]){ellipse(c,x,113,6,6,'#c5bd9f');ellipse(c,x,113,3.3,3.3,'#314343');}
 for(const x of [46,337])ellipse(c,x,132,6,8,'#09161c');
 c.fillStyle='#233b4140';c.fillRect(131,92,5,9);c.fillRect(239,92,5,9);
 label(c,'İSTANBUL',173,119,7,'#263c3d','sans-serif',1);ellipse(c,310,77,2,2,'#cb8558');
 });}
