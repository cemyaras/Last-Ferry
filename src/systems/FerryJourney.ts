import {FERRY_TIMING} from '../scenes/ferryConfig';
/** Active simulation time drives travel, approach and mooring, never a scene timeout.
 * Exploration remains available throughout; reaching port never forces an exit. */
export class FerryJourney{
 readonly cruiseSeconds=FERRY_TIMING.cruise;
 readonly approachSeconds=FERRY_TIMING.approach;
 readonly dockingSeconds=FERRY_TIMING.docking;
 elapsed=0;
 distance=0;
 speed=4.4;
 phase:'cruising'|'approaching'|'docking'|'moored'='cruising';
 get approach(){return Math.max(0,Math.min(1,(this.elapsed-this.cruiseSeconds)/this.approachSeconds));}
 get docking(){return Math.max(0,Math.min(1,(this.elapsed-this.cruiseSeconds-this.approachSeconds)/this.dockingSeconds));}
 get arrived(){return this.phase==='moored';}
 update(dt:number){
  this.elapsed+=Math.max(0,Math.min(dt,.05));
  const t=this.elapsed,a=this.approach;
  // Analytic integration of a smoothstep deceleration avoids frame-rate drift.
  this.speed=t<this.cruiseSeconds?4.4:4.4*(1-a*a*(3-2*a));
  this.distance=4.4*Math.min(t,this.cruiseSeconds)+4.4*this.approachSeconds*(a-a*a*a+a*a*a*a/2);
  this.phase=t<this.cruiseSeconds?'cruising':a<1?'approaching':this.docking<1?'docking':'moored';
 }
}
