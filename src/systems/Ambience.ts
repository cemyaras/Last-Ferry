import Phaser from 'phaser';
export type AmbientChannel='rain'|'water'|'ferry-horn'|'seagulls'|'city';
export type AmbientManifest=Partial<Record<AmbientChannel,{url:string;volume:number;loop:boolean}>>;
/** Optional future original/licensed audio. An empty manifest is silent unless the procedural arrival horn is enabled.
 * Add entries in config, call preload() in scene.preload(), then start() after a gesture.
 * One-shots (horn/gulls) are triggered explicitly through play().
 */
export class Ambience{
 private sounds=new Map<AmbientChannel,Phaser.Sound.BaseSound>();
 private hornContext?:AudioContext;
 private hornPlayed=false;
 constructor(private scene:Phaser.Scene,private manifest:AmbientManifest={},private generatedHorn=false){}
 preload(){for(const [channel,entry] of Object.entries(this.manifest))this.scene.load.audio(`ambience-${channel}`,entry.url);}
 start(){
  if(this.generatedHorn&&!this.hornContext)this.hornContext=new AudioContext();
  if(this.hornContext?.state==='suspended')void this.hornContext.resume().catch(()=>{});
  for(const [channel,entry] of Object.entries(this.manifest)){
  if(!this.scene.cache.audio.exists(`ambience-${channel}`)||this.sounds.has(channel as AmbientChannel))continue;
  const sound=this.scene.sound.add(`ambience-${channel}`,{volume:entry.volume,loop:entry.loop});this.sounds.set(channel as AmbientChannel,sound);if(entry.loop)sound.play();
 }}
 play(channel:AmbientChannel){
  const sound=this.sounds.get(channel);if(sound){sound.play();return;}
  if(channel!=='ferry-horn'||!this.generatedHorn||this.hornPlayed)return;
  this.hornPlayed=true;
  const context=this.hornContext;if(!context||context.state!=='running')return;
  // An original, quiet two-tone ship horn with a soft attack and distant decay.
  const t=context.currentTime,gain=context.createGain();gain.connect(context.destination);
  gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.025,t+.45);
  gain.gain.setValueAtTime(.025,t+1.15);gain.gain.exponentialRampToValueAtTime(.0001,t+2.8);
  for(const frequency of [130.81,155.56]){const tone=context.createOscillator();tone.type='sine';tone.frequency.setValueAtTime(frequency,t);tone.connect(gain);tone.start(t);tone.stop(t+2.9);tone.onended=()=>tone.disconnect();}
  this.scene.time.delayedCall(3100,()=>gain.disconnect());
 }
 destroy(){for(const sound of this.sounds.values())sound.destroy();this.sounds.clear();if(this.hornContext){void this.hornContext.close().catch(()=>{});this.hornContext=undefined;}}
}
