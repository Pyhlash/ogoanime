export type Episode={id:string;ordinal:number;name:string|null;duration:number;hls_480?:string;hls_720?:string;hls_1080?:string;preview?:{src:string};opening?:{start:number|null;stop:number|null}};
export type Anime={id:number;name:{main:string;english?:string};poster:{src:string;optimized?:{src:string}};description:string;year:number;type?:{value:string};genres?:{id:number;name:string}[];age_rating?:{label:string};mal?:{rating:number};shikimori?:{rating:number};episodes_total:number|null;latest_episode?:Episode;episodes?:Episode[];is_ongoing:boolean;is_blocked_by_geo:boolean;is_blocked_by_copyrights:boolean;fresh_at:string};
export type Entry={anime_id:number;status:'watching'|'watched'|'planned'|null;favorite:boolean;episode:number;position:number;skipped_episodes:number[];dismissed:boolean;updated_at?:string;anime:Anime};
export type HistoryEntry={anime_id:number;episode:number;position:number;watched_at:string;anime:Anime};
export const poster=(a:Anime)=>'https://api.anilibria.app'+(a.poster.optimized?.src||a.poster.src);
export const compact=(a:Anime):Anime=>{const {episodes,latest_episode,...rest}=a;return rest};
export async function catalog(mode='latest',q='',page=1):Promise<Anime[]>{const r=await fetch('/api/catalog?mode='+mode+'&q='+encodeURIComponent(q)+'&page='+page);if(!r.ok)throw Error('Не удалось загрузить каталог');const j=await r.json() as Anime[]|{data:Anime[]};return Array.isArray(j)?j:j.data||[]}

