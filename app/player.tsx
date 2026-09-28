'use client';
import {useEffect,useRef,useState} from 'react';
import Hls from 'hls.js';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
import type {Anime,Episode,Entry} from '@/lib/anime';
export default function Player({anime,entry,onProgress}:{anime:Anime;entry?:Entry;onProgress:(episode:number,position:number,ended:boolean)=>void}){
 const video=useRef<HTMLVideoElement>(null),callback=useRef(onProgress);callback.current=onProgress;
 const episodes=(anime.episodes||[]).filter(e=>e.hls_1080||e.hls_720||e.hls_480).sort((a,b)=>a.ordinal-b.ordinal);
 const [ordinal,setOrdinal]=useState(entry?.episode||episodes[0]?.ordinal||1),[quality,setQuality]=useState('720'),[error,setError]=useState(''),[subtitle,setSubtitle]=useState(''),[subsName,setSubsName]=useState(''),[retry,setRetry]=useState(0);
 const episode=episodes.find(e=>e.ordinal===ordinal)||episodes[0];const resume=useRef({episode:entry?.episode,position:entry?.position||0});
 useEffect(()=>{if(!episode||!video.current)return;setError('');const el=video.current;const src=episode[('hls_'+quality) as keyof Episode] as string||episode.hls_720||episode.hls_480||episode.hls_1080!;
 let hls:Hls|undefined;const loaded=()=>{if(resume.current.episode===episode.ordinal)el.currentTime=resume.current.position;};el.addEventListener('loadedmetadata',loaded);
 if(el.canPlayType('application/vnd.apple.mpegurl'))el.src=src;else if(Hls.isSupported()){hls=new Hls();hls.loadSource(src);hls.attachMedia(el);hls.on(Hls.Events.ERROR,(_,data)=>{if(data.fatal)setError('Источник не ответил. Попробуйте другое качество или повторите загрузку.');});}else setError('Этот браузер не поддерживает воспроизведение HLS.');
 let last=0;const save=(ended=false)=>{const finished=ended||el.ended;if(el.currentTime>0)callback.current(episode.ordinal,finished?0:el.currentTime,finished)};const tick=()=>{if(el.currentTime-last>=15){last=el.currentTime;save()}};const pause=()=>save();const end=()=>{save(true)};
 el.addEventListener('timeupdate',tick);el.addEventListener('pause',pause);el.addEventListener('ended',end);window.addEventListener('pagehide',pause);
 return()=>{save();hls?.destroy();el.removeEventListener('loadedmetadata',loaded);el.removeEventListener('timeupdate',tick);el.removeEventListener('pause',pause);el.removeEventListener('ended',end);window.removeEventListener('pagehide',pause)};
 },[episode?.id,quality,retry]);
 useEffect(()=>()=>{if(subtitle)URL.revokeObjectURL(subtitle)},[subtitle]);
 if(anime.is_blocked_by_geo||anime.is_blocked_by_copyrights)return <div className="empty">Источник ограничил доступ к этому аниме. Воспроизведение недоступно.</div>;
 if(!episode)return <div className="empty">Серии пока не доступны у источника. Добавьте аниме в «Хочу посмотреть».</div>;
 return <div className="player"><video key={episode.id} ref={video} controls playsInline preload="metadata" crossOrigin="anonymous" onError={()=>setError('Не удалось воспроизвести видео. Попробуйте другое качество.')} poster={episode.preview?.src?'https://api.anilibria.app'+episode.preview.src:undefined}>{subtitle&&<track key={subtitle} src={subtitle} kind="subtitles" srcLang="ru" label={subsName||'Мои субтитры'} default/>}</video>
 {error&&<div role="alert" className="notice">{error}<button onClick={()=>setRetry(retry+1)}>Повторить</button></div>}
 <div className="player-controls"><span>Серия {episode.ordinal} · AniLiberty · Русский</span><Select value={quality} onValueChange={v=>{if(v){resume.current={episode:episode.ordinal,position:video.current?.currentTime||0};setQuality(v)}}}><SelectTrigger aria-label="Качество видео" className="w-28"><SelectValue/></SelectTrigger><SelectContent>{['1080','720','480'].filter(q=>episode[('hls_'+q) as keyof Episode]).map(q=><SelectItem key={q} value={q}>{q}p</SelectItem>)}</SelectContent></Select>
 <label className="sub-upload">{subsName?'Заменить субтитры':'+ Субтитры .vtt'}<input type="file" accept=".vtt" onChange={e=>{const f=e.target.files?.[0];if(f){if(f.size>5*1024*1024){setError('Файл субтитров должен быть меньше 5 МБ');return}setSubtitle(URL.createObjectURL(f));setSubsName(f.name)}}}/></label></div>
 <p className="muted small">У этого источника одна озвучка. Можно добавить свой файл субтитров WebVTT и включить его в меню плеера.</p>
 <div className="episodes">{episodes.map(e=><button key={e.id} className={e.id===episode.id?'selected':''} onClick={()=>{resume.current={episode:e.ordinal,position:0};setOrdinal(e.ordinal);setSubtitle('');setSubsName('')}}>{e.ordinal}</button>)}</div></div>
}

