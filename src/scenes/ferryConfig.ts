import type {Obstacle} from './promenade';
export const FERRY_TIMING={cruise:30,approach:14,docking:4};
export const FERRY={width:1280,height:720,startX:412,startY:580,crossingSeconds:FERRY_TIMING.cruise+FERRY_TIMING.approach+FERRY_TIMING.docking};
export const DECK_BOUNDS={minX:66,maxX:1208,minY:506,maxY:638};
export const DECK_OBSTACLES:Obstacle[]=[
 {id:'cabin',left:-100,right:342,top:200,bottom:535},
 {id:'bench',left:568,right:719,top:537,bottom:557},
 {id:'seated-passenger',left:636,right:670,top:552,bottom:569},
 {id:'equipment',left:1048,right:1098,top:526,bottom:552},
 {id:'standing-passenger',left:880,right:905,top:507,bottom:521},
 {id:'deck-lamp-left',left:385,right:395,top:493,bottom:501},
 {id:'deck-lamp-right',left:1007,right:1017,top:493,bottom:501},
 {id:'rear-rail',left:-100,right:1400,top:-1000,bottom:499},
];
export const DECK_LIGHTS=[{x:190,y:377},{x:390,y:332},{x:1012,y:374}];
export function deckLight(x:number,y:number){return Math.min(1,DECK_LIGHTS.reduce((value,lamp)=>value+Math.exp(-Math.pow((x-lamp.x)/155,2)-Math.pow((y-556)/120,2)),0));}
export function deckLightOrigin(x:number){return DECK_LIGHTS.reduce((a,b)=>Math.abs(a.x-x)<Math.abs(b.x-x)?a:b).x;}
/** Story clue: an empty paper cup of milk just in front of the deck bench. */
export const MILK_CUP={x:596,y:559};
/** The standing passenger saw something white leap aboard. */
export const PASSENGER_WITNESS={x:893,y:517};
