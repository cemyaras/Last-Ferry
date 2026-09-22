import Phaser from 'phaser';
import { PierScene } from './scenes/PierScene';
import './style.css';
import {SCENE_TIME} from './scenes/config';
document.title=`SON VAPUR — Kadıköy, ${SCENE_TIME}`;
export const game = new Phaser.Game({ type: Phaser.AUTO, parent: 'game', backgroundColor: '#101e27', width:1280,height:720,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},render:{antialias:true,roundPixels:false},scene:[PierScene] });
