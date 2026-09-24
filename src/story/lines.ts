/** "Kayıp: Ay" — every story line in one place. No Phaser imports, so configs and node tests can use it. */
const inner=(line:string)=>`“${line}”`;
const spoken=(line:string)=>`— ${line}`;

/** The night moves on between locations; Kadıköy keeps the shared SCENE_TIME. */
export const STORY_TIMES={ferry:'23:55',karakoy:'00:20',bridge:'01:10'};

export const POSTER={
 title:'KAYIP: AY',
 body:['Her gece çıkıp gidiyor.','Gören olursa lütfen','haber versin.'],
 signature:'— Defne (8 yaş)',
};

/** Observation texts (Interaction adds the quotation marks). */
export const LOOKS={
 kadikoyBench:'Çocukken bu bankta simit yerdik.',
 karakoyTerminal:'Son vapur arkamda kaldı. Çocukken bu saatte uyuyor olurdum.',
 karakoyShop:'Kepenk inmiş. Önünde boş bir mama kabı, taşlarda küçük pati izleri.',
 karakoyUphill:"Sokak Galata'ya doğru yükseliyor. Bu yokuşu koşarak çıkardık.",
 bridgeRailing:'Karşı kıyı düşündüğümden daha yakın.',
 bridgeMiddle:'Gökteki ay yerinde. Öbürü bir yerlerde.',
 bridgeFisher:'Bu saatte balık değil, sabır tutulur.',
};

export const FERRY_LINES={
 intro:inner('Kadıköy kıyıda kalıyor.'),
 railing:inner('Martılara simit atardık. Hepsi kavga ederdi.'),
 cabin:'Salon kapısı kapalı. Biraz daha güvertede kal.',
 cup:inner('Bankın altında boş bir süt bardağı. Biri ona süt bırakmış.'),
 exitUnderway:'Karaköy’ün ışıkları yaklaşıyor.',
 arrival:'Karaköy’e yanaştık.',
};

/** Sequences that arrive by themselves; `sawPoster` lets the traveller connect the clues. */
export const BEATS={
 poster:()=>[inner("Ay'ı mı kaybetmiş?"),inner('Gökte duruyor ama.')],
 ferryPassenger:(sawPoster:boolean)=>[spoken('Beyaz bir şey atladı vapura.'),spoken('Kedi miydi, neydi?'),inner(sawPoster?"Defne'nin Ay'ı mı?":'Son vapurda bir kedi.')],
 karakoyResident:(sawPoster:boolean)=>[spoken('Beyaz kediyi mi arıyorsun? Her gece son vapurdan iner.'),spoken('Saatçinin önünde mamasını yer, sonra köprüye yürür.'),inner(sawPoster?'Demek Ay bir kedi.':'Son vapurla gelen bir kedi.')],
 bridgeFisher:()=>[spoken('Beyaz kedi mi? Her gece bir balık kapar benden.'),spoken("Eminönü'ne yürür, sabahı bekler.")],
 bridgeBarrier:(sawPoster:boolean)=>[inner('Pati izleri bariyerin altından geçiyor.'),inner(sawPoster?'Ay benden önce karşıya geçmiş.':'Kedi benden önce karşıya geçmiş.')],
};
