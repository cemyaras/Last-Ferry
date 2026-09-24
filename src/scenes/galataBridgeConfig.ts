import type {Obstacle} from './promenade';
import {LOOKS} from '../story/lines';

/** About 1.7 screens. The traveller enters from Karaköy (right) and walks toward Eminönü (left),
 * looking west up the Golden Horn: Eminönü and Süleymaniye ahead, Galata behind. */
export const BRIDGE={width:2176,height:720,midX:1088,startX:2076,startY:592,entryX:2186,widenZoom:.84};
export const BRIDGE_BOUNDS={minX:226,maxX:2112,minY:522,maxY:628};
/** The first lamp stands beyond the closed barrier and only lights the continuing walkway. */
export const BRIDGE_LIGHTS=[{x:66,y:302},{x:480,y:296},{x:890,y:290},{x:1390,y:290},{x:1860,y:298}];

export type FisherLook='beanie'|'cap'|'hood';
/** Rod grip and tip are offsets from the feet; tips reach out over the railing. */
export interface Fisher{id:string;x:number;y:number;seated:boolean;look:FisherLook;grip:{x:number;y:number};tip:{x:number;y:number};}
export const FISHERS:Fisher[]=[
 {id:'fisher-eminonu',x:318,y:530,seated:false,look:'beanie',grip:{x:-6,y:-60},tip:{x:-78,y:-160}},
 // A step back from the rail, so the traveller can pass behind him as well as in front.
 {id:'fisher-talk',x:656,y:548,seated:false,look:'cap',grip:{x:7,y:-60},tip:{x:88,y:-176}},
 {id:'fisher-seated',x:1556,y:540,seated:true,look:'hood',grip:{x:-9,y:-42},tip:{x:-96,y:-166}},
];
export const WALKER={id:'umbrella-walker',x:1345,y:528};
/** Spare rods wedged against the rail, their butts on the deck edge. */
export const PROPPED_RODS=[{x:760,tipX:812,tipY:374},{x:1626,tipX:1588,tipY:370}];
export type BridgeProp={id:string;kind:'bucket'|'tackle'|'bench';x:number;y:number};
export const BRIDGE_PROPS:BridgeProp[]=[
 {id:'bucket-eminonu',kind:'bucket',x:352,y:543},
 {id:'bucket-talk',kind:'bucket',x:700,y:554},
 {id:'tackle-box',kind:'tackle',x:1600,y:548},
 {id:'bridge-bench',kind:'bench',x:1196,y:539},
];
const box=(id:string,left:number,right:number,top:number,bottom:number):Obstacle=>({id,left,right,top,bottom});
export const BRIDGE_OBSTACLES:Obstacle[]=[
 ...BRIDGE_LIGHTS.map(({x},i)=>box(`bridge-lamp-${i}`,x-9,x+9,510,520)),
 box('fisher-eminonu',306,330,522,536),
 box('fisher-talk',644,668,541,555),
 box('fisher-seated',1538,1574,524,546),
 box('umbrella-walker',1333,1357,521,535),
 box('bucket-eminonu',342,362,536,548),
 box('bucket-talk',690,710,547,559),
 box('tackle-box',1585,1615,541,553),
 box('bridge-bench',1185,1300,532,548),
 box('eminonu-barrier',-100,206,0,720),
];
/** Barrier panels across the walkway, sorted by their own ground contact. */
export const BARRIER_PANELS=[{x:168,y:531},{x:160,y:575},{x:152,y:620}];
export const BRIDGE_LOOKS=[
 {id:'railing',x:1770,y:524,radius:50,text:LOOKS.bridgeRailing},
 {id:'middle',x:BRIDGE.midX,y:560,radius:78,text:LOOKS.bridgeMiddle},
 {id:'fisher',x:656,y:548,radius:70,prompt:'[E]  Konuş',text:LOOKS.bridgeFisher},
];
export function bridgeLight(x:number,y:number){return Math.min(1,BRIDGE_LIGHTS.reduce((sum,l)=>sum+Math.exp(-Math.pow((x-l.x)/140,2)-Math.pow((y-563)/100,2)),0));}
export function bridgeLightOrigin(x:number){return BRIDGE_LIGHTS.reduce((a,b)=>Math.abs(a.x-x)<Math.abs(b.x-x)?a:b).x;}
/** Story clues: the fisherman who feeds Ay, a fish head left behind, and prints passing under the barrier. */
export const FISHER_WITNESS={x:656,y:548,range:110};
export const FISH_HEAD={x:604,y:590};
export const BRIDGE_PAW_TRAIL=[[590,594],[420,600],[240,606],[120,610],[20,612]] as const;
export const BARRIER_CLUE_X=330;
