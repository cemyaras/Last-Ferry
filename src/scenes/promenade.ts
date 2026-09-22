import {LAMPS,PIER} from './config';

/** Foot positions, not the top of the character. The rail and near-edge equipment
 * remain outside this shallow side-view walking strip. */
export const WALK_AREA={minX:PIER.minX,maxX:PIER.maxX,minY:522,maxY:628};
export const FOOTPRINT={halfWidth:11,halfDepth:4};
export type Obstacle={id:string;left:number;right:number;top:number;bottom:number};
export type PierObject={id:string;kind:'bench'|'lamp'|'bin'|'cabinet'|'reel'|'mooring';x:number;y:number;sortY:number;crop:{x:number;y:number;width:number;height:number};footprint:Obstacle};
const obstacle=(id:string,left:number,right:number,top:number,bottom:number):Obstacle=>({id,left,right,top,bottom});
export const PIER_OBJECTS:PierObject[]=[
 ...[824,1586].map((x,i):PierObject=>({id:`bench-${i}`,kind:'bench',x,y:539,sortY:539,crop:{x:x-24,y:500,width:140,height:55},footprint:obstacle(`bench-${i}`,x-11,x+104,532,548)})),
 ...LAMPS.map(({x,y},i):PierObject=>({id:`lamp-${i}`,kind:'lamp',x,y,sortY:517,crop:{x:x-32,y:y-20,width:65,height:540-y},footprint:obstacle(`lamp-${i}`,x-9,x+9,510,520)})),
 {id:'bin',kind:'bin',x:1392,y:539,sortY:539,crop:{x:1369,y:491,width:46,height:54},footprint:obstacle('bin',1378,1406,532,542)},
 {id:'cabinet',kind:'cabinet',x:1958,y:538,sortY:538,crop:{x:1935,y:472,width:48,height:71},footprint:obstacle('cabinet',1938,1978,530,540)},
 {id:'reel',kind:'reel',x:1996,y:537,sortY:537,crop:{x:1974,y:503,width:45,height:40},footprint:obstacle('reel',1984,2008,531,540)},
 {id:'mooring',kind:'mooring',x:345,y:539,sortY:539,crop:{x:327,y:514,width:55,height:38},footprint:obstacle('mooring',333,355,532,543)},
];
export const OBSTACLES:Obstacle[]=[
 obstacle('terminal',-100,332,250,526),
 obstacle('water-and-railings',-100,PIER.width+100,-1000,513),
 obstacle('direction-sign',1151,1159,497,512),
 obstacle('boarding-sign-left',382,390,508,516),
 obstacle('boarding-sign-right',499,507,508,516),
 ...PIER_OBJECTS.map(object=>object.footprint),
];
/** Reserve the existing 17–22 depth band between ground effects and light/rain. */
export const promenadeDepth=(feetY:number)=>17+(feetY-500)*.035;
