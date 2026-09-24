export const SCENE_TIME='23:40';
export const PIER={width:2112,height:720,viewWidth:1280,waterline:350,ground:513,walkY:582,startX:1920,minX:60,maxX:2052,benchX:866,interactionRadius:78,walkSpeed:105,depthSpeed:55};
export const PARALLAX={skyline:.28,water:.58,foreground:1.08};
export const LAMPS=[{x:450,y:307},{x:1112,y:281},{x:1748,y:299}];
/** Shared by the pavement and traveller so their light responses agree. */
export function nearestLamp(x:number){return LAMPS.reduce((a,b)=>Math.abs(a.x-x)<Math.abs(b.x-x)?a:b);}
export function lampStrength(x:number){return Math.exp(-Math.pow((nearestLamp(x).x-x)/115,2));}
/** Defne's poster is taped to the lamp nearest the traveller's starting point. */
export const POSTER_SPOT={x:LAMPS[2].x,y:452,readY:532,readRadius:70,noticeRange:110};
