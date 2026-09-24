import type {Obstacle} from './promenade';
import {LOOKS} from '../story/lines';

export const KARAKOY={width:1920,height:720,startX:220,startY:592};
/** Arriving passengers step out of the lit terminal door onto the lane. */
export const ARRIVAL_PATH=[{x:168,y:546},{x:192,y:572},{x:KARAKOY.startX,y:KARAKOY.startY}];
/** The dock behind the terminal, its open side door hidden by the building. */
export const MOORED_FERRY={x:318,y:494,scale:.82};
/** The lane's left end, past the terminal, continues onto Galata Bridge. */
export const BRIDGE_EXIT={x:118,y:600,radius:52};
export const BRIDGE_EXIT_WALK_X=-36;
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
 {x:236,y:557,radius:83,text:LOOKS.karakoyTerminal},
 {x:866,y:543,radius:74,text:LOOKS.karakoyShop},
 {x:1658,y:542,radius:87,text:LOOKS.karakoyUphill},
];
export function streetLight(x:number,y:number){return Math.min(1,STREET_LIGHTS.reduce((sum,l)=>sum+Math.exp(-Math.pow((x-l.x)/136,2)-Math.pow((y-563)/100,2)),0));}
export function streetLightOrigin(x:number){return STREET_LIGHTS.reduce((a,b)=>Math.abs(a.x-x)<Math.abs(b.x-x)?a:b).x;}
/** Story clues: the resident waiting by the terminal, an empty bowl at the watchmaker's, and prints to the bridge. */
export const RESIDENT_WITNESS={x:347,y:541,range:150};
export const FOOD_BOWL={x:886,y:548};
export const KARAKOY_PAW_TRAIL=[[872,556],[760,574],[560,590],[380,598],[130,602],[30,604]] as const;
