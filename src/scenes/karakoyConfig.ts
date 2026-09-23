import type {Obstacle} from './promenade';

export const KARAKOY={width:1920,height:720,startX:220,startY:592};
export const STREET_BOUNDS={minX:96,maxX:1778,minY:522,maxY:635};
export const STREET_LIGHTS=[{x:315,y:337},{x:782,y:319},{x:1225,y:297},{x:1670,y:278}];
export const STREET_OBSTACLES:Obstacle[]=[
 ...STREET_LIGHTS.map(({x},i)=>({id:`street-lamp-${i}`,left:x-4,right:x+4,top:527,bottom:531})),
 {id:'terminal-wall',left:60,right:285,top:200,bottom:539},
 {id:'shopfronts',left:485,right:1540,top:0,bottom:518},
 {id:'stairs',left:1550,right:1860,top:0,bottom:526},
 {id:'closed-end',left:1789,right:2000,top:0,bottom:720},
 {id:'bollard',left:439,right:459,top:555,bottom:569},
 {id:'planter',left:1127,right:1193,top:555,bottom:575},
 {id:'waiting-person',left:337,right:357,top:530,bottom:543},
 {id:'shopkeeper',left:941,right:963,top:525,bottom:540},
];
export const STREET_LOOKS=[
 {x:236,y:557,radius:83,text:'Son vapur arkamda kaldı.'},
 {x:866,y:543,radius:74,text:'Kepenk çoktan inmiş.'},
 {x:1658,y:542,radius:87,text:"Sokak Galata'ya doğru yükseliyor."},
];
export function streetLight(x:number,y:number){return Math.min(1,STREET_LIGHTS.reduce((sum,l)=>sum+Math.exp(-Math.pow((x-l.x)/136,2)-Math.pow((y-563)/100,2)),0));}
export function streetLightOrigin(x:number){return STREET_LIGHTS.reduce((a,b)=>Math.abs(a.x-x)<Math.abs(b.x-x)?a:b).x;}
