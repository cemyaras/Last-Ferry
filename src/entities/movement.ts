import {FOOTPRINT,OBSTACLES,WALK_AREA,type Obstacle} from '../scenes/promenade';
import {PIER} from '../scenes/config';

export function movementTarget(horizontal:number,vertical:number){
 const length=Math.max(1,Math.hypot(horizontal,vertical));
 return {x:horizontal/length*PIER.walkSpeed,y:vertical/length*PIER.depthSpeed};
}
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));

/** Sweep the feet against expanded solid footprints, then slide along the free
 * axis. Tall artwork is deliberately not treated as a top-down collision box. */
export function moveOnPromenade(x:number,y:number,dx:number,dy:number,obstacles:readonly Obstacle[]=OBSTACLES){
 let nextX=clamp(x+dx,WALK_AREA.minX,WALK_AREA.maxX);
 for(const box of obstacles){
  const left=box.left-FOOTPRINT.halfWidth,right=box.right+FOOTPRINT.halfWidth;
  if(y>box.top-FOOTPRINT.halfDepth&&y<box.bottom+FOOTPRINT.halfDepth){
   if(dx>0&&x<=left&&nextX>left)nextX=left;
   if(dx<0&&x>=right&&nextX<right)nextX=right;
  }
 }
 let nextY=clamp(y+dy,WALK_AREA.minY,WALK_AREA.maxY);
 for(const box of obstacles){
  const top=box.top-FOOTPRINT.halfDepth,bottom=box.bottom+FOOTPRINT.halfDepth;
  if(nextX>box.left-FOOTPRINT.halfWidth&&nextX<box.right+FOOTPRINT.halfWidth){
   if(dy>0&&y<=top&&nextY>top)nextY=top;
   if(dy<0&&y>=bottom&&nextY<bottom)nextY=bottom;
  }
 }
 return {x:nextX,y:nextY,blockedX:Math.abs(nextX-x-dx)>.00001,blockedY:Math.abs(nextY-y-dy)>.00001};
}
