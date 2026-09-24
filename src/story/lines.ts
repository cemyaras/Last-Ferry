/** "Kayıp: Ay" — every story line in one place. No Phaser imports, so configs and node tests can use it. */
const inner=(line:string)=>`“${line}”`;
const spoken=(line:string)=>`— ${line}`;

/** The night moves on between locations; Kadıköy keeps the shared SCENE_TIME. */
export const STORY_TIMES={ferry:'23:55',karakoy:'00:20',bridge:'01:10',eminonu:'01:35',dawn:'05:50',morning:'06:25'};

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
 eminonuBoat:'Babam burada balık ekmek alırdı. Tekne sallanır, biz gülerdik.',
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
 bridgeStairs:(sawPoster:boolean)=>[inner('Pati izleri merdivenden aşağı iniyor.'),inner(sawPoster?'Ay alt kattan karşıya geçmiş.':'Kedi alt kattan karşıya geçmiş.')],
 eminonuGate:()=>[inner('İzler kapının altından iskeleye giriyor.'),inner('Orada bir yerde. Sabahı bekliyor.')],
 eminonuWait:()=>[inner('Bu saatte balık değil, sabır tutulur.')],
 eminonuGateOpens:()=>[spoken("İlk vapur Kadıköy'e. Buyrun.")],
 eminonuReveal:()=>[inner('Beyaz. Bir kulağı kara.'),inner('Ay.')],
 eminonuPickUp:()=>[inner('Hadi. Eve gidiyoruz.')],
 defneNotices:()=>[spoken('Ay!')],
 defneGive:()=>[spoken("Ay'ı buldum."),spoken('Her gece nereye gidiyor bu?'),spoken('Karşıya. Sabahı beklemeye.')],
};

export const PROMPTS={stairs:'[E]  Aşağı in',wait:'[E]  Bekle',pickUp:'[E]  Kucakla',board:'[E]  Kadıköy vapuruna bin',give:'[E]  Ver'};
export const CLOSING={title:'S O N   V A P U R',lines:['Her gece çıkıp gidiyor.','Her sabah dönüyor.'],hint:'Yeniden oynamak için sayfayı yenileyin.'};
