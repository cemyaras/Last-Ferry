import Phaser from 'phaser';
export type AmbientChannel='rain'|'water'|'ferry-horn'|'seagulls'|'city';
export type AmbientManifest=Partial<Record<AmbientChannel,{url:string;volume:number;loop:boolean}>>;
/** Optional future original/licensed audio. Empty manifest deliberately means silence.
 * Add entries in config, call preload() in scene.preload(), then start() after a gesture.
 * One-shots (horn/gulls) are triggered explicitly through play().
 */
export class Ambience{
 private sounds=new Map<AmbientChannel,Phaser.Sound.BaseSound>();
 constructor(private scene:Phaser.Scene,private manifest:AmbientManifest={}){}
 preload(){for(const [channel,entry] of Object.entries(this.manifest))this.scene.load.audio(`ambience-${channel}`,entry.url);}
 start(){for(const [channel,entry] of Object.entries(this.manifest)){
  if(!this.scene.cache.audio.exists(`ambience-${channel}`)||this.sounds.has(channel as AmbientChannel))continue;
  const sound=this.scene.sound.add(`ambience-${channel}`,{volume:entry.volume,loop:entry.loop});this.sounds.set(channel as AmbientChannel,sound);if(entry.loop)sound.play();
 }}
 play(channel:AmbientChannel){this.sounds.get(channel)?.play();}
 destroy(){for(const sound of this.sounds.values())sound.destroy();this.sounds.clear();}
}
