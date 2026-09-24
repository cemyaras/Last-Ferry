import type Phaser from 'phaser';

/** Story memory for the whole night; it only varies lines and never appears as UI. */
export type StoryFlag='sawPoster';
export const hasFlag=(scene:Phaser.Scene,flag:StoryFlag)=>scene.game.registry.get(`story:${flag}`)===true;
export const setFlag=(scene:Phaser.Scene,flag:StoryFlag)=>{scene.game.registry.set(`story:${flag}`,true);};
