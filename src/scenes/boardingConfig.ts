/** A single boarding point in Kadıköy. No destination scene is loaded yet. */
export const BOARDING={
 gateX:550,gateLeft:523,gateRight:578,approachY:559,
 ferryX:660,ferryY:484,cabinX:566,deckY:446,
 radiusX:45,radiusY:34,
};
export type BoardingLayout=typeof BOARDING;
export function withinBoardingReach(x:number,y:number,layout:BoardingLayout=BOARDING){return Math.abs(x-layout.gateX)<=layout.radiusX&&Math.abs(y-layout.approachY)<=layout.radiusY;}
