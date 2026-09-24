import type {Obstacle} from './promenade';
import {BOARDING} from './boardingConfig';
import {LOOKS} from '../story/lines';

/** About 1.5 screens of Eminönü quay, looking north across the mouth of the Golden Horn:
 * Karaköy and Galata across the water, the bridge receding at the left, the Bosphorus and the sunrise at the right.
 * The traveller comes up the stairs from the bridge's lower level at the left and walks right to the ferry pier. */
export const EMINONU={width:1920,height:720};
export const EMINONU_BOUNDS={minX:60,maxX:1880,minY:522,maxY:628};
export const EMINONU_LIGHTS=[{x:470,y:300},{x:1000,y:292},{x:1560,y:302}];
/** Same gangway geometry as Kadıköy's, moved to this pier's gate. */
export const EMINONU_BOARDING={...BOARDING,gateX:1380,gateLeft:1353,gateRight:1408,ferryX:1490,cabinX:1396};
export const FERRY_OFFSCREEN_X=2420;
const box=(id:string,left:number,right:number,top:number,bottom:number):Obstacle=>({id,left,right,top,bottom});
/** Stairs up from the bridge's lower level; the traveller emerges walking right from the deepest step. */
export const EMINONU_STAIRS={left:96,right:250,back:598,lip:646,
 path:[{x:112,y:700},{x:160,y:670},{x:210,y:642},{x:258,y:618},{x:288,y:612}]};
export const BENCH={x:1040,y:539};
export const TERMINAL={left:1640};
export const GOREVLI={x:1702,y:534,gateX:1428,gateY:528};
export const SIMITCI={fromX:-80,x:560,y:548};
/** Ay sits at the foot of the gangway, between the open gate posts. */
export const AY={x:1380,y:520,revealRange:130};
export const EMINONU_OBSTACLES:Obstacle[]=[
 ...EMINONU_LIGHTS.map(({x},i)=>box(`eminonu-lamp-${i}`,x-9,x+9,510,520)),
 box('water-and-railings',-100,EMINONU.width+100,-1000,513),
 box('stairwell',EMINONU_STAIRS.left,EMINONU_STAIRS.right,598,700),
 box('bench',BENCH.x-11,BENCH.x+104,532,548),
 box('terminal',TERMINAL.left,EMINONU.width+100,250,526),
 box('boarding-sign-left',EMINONU_BOARDING.gateX-168,EMINONU_BOARDING.gateX-160,508,516),
 box('boarding-sign-right',EMINONU_BOARDING.gateX-51,EMINONU_BOARDING.gateX-43,508,516),
];
/** Footprints that move or appear during the dawn; the scene keeps them in step with their figures. */
export const gorevliBox=()=>box('gorevli',GOREVLI.x-12,GOREVLI.x+12,527,541);
export const simitciBox=()=>box('simitci',SIMITCI.x-44,SIMITCI.x+40,540,556);
export const ayBox=()=>box('ay',AY.x-12,AY.x+12,514,526);
export const EMINONU_PAW_TRAIL=[[262,616],[330,610],[520,600],[800,586],[1080,572],[1300,556],[1360,540],[1376,524],[1380,512]] as const;
export const EMINONU_LOOKS={
 boat:{x:660,y:526,radius:56,text:LOOKS.eminonuBoat},
 wait:{x:1086,y:558,radius:70},
 // Beside Ay rather than in front of her, so the traveller never hides the cat.
 pickUp:{x:AY.x-44,y:538,radius:42},
 gateClueX:1180,
};
/** Night minutes after midnight: 01:35 at arrival, 05:50 at dawn. */
export const WAIT_MINUTES={from:95,to:350};
export function eminonuLight(x:number,y:number){return Math.min(1,EMINONU_LIGHTS.reduce((sum,l)=>sum+Math.exp(-Math.pow((x-l.x)/130,2)-Math.pow((y-563)/100,2)),0));}
export function eminonuLightOrigin(x:number){return EMINONU_LIGHTS.reduce((a,b)=>Math.abs(a.x-x)<Math.abs(b.x-x)?a:b).x;}
export const clockText=(minutes:number)=>{const m=Math.round(minutes);return `${String(Math.floor(m/60)%24).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;};
