import Phaser from 'phaser';
export type Ctx = CanvasRenderingContext2D;
export function random(seed:number){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export function polygon(c:Ctx,points:number[][],fill:string,stroke?:string){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.stroke();}}
export function line(c:Ctx,x:number,y:number,x2:number,y2:number,color:string,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke();}
export function ellipse(c:Ctx,x:number,y:number,rx:number,ry:number,color:string){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
export function glow(c:Ctx,x:number,y:number,r:number,color:string){const gr=c.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,color);gr.addColorStop(1,'transparent');c.fillStyle=gr;c.fillRect(x-r,y-r,r*2,r*2);}
export function label(c:Ctx,text:string,x:number,y:number,size:number,color:string,font='sans-serif',spacing=0){c.font=`${size}px ${font}`;c.fillStyle=color;if(!spacing){c.fillText(text,x,y);return;}for(const ch of text){c.fillText(ch,x,y);x+=c.measureText(ch).width+spacing;}}
export function texture(scene:Phaser.Scene,key:string,w:number,h:number,draw:(c:Ctx)=>void){if(scene.textures.exists(key))return;const tex=scene.textures.createCanvas(key,w,h)!;draw(tex.context);tex.refresh();}
