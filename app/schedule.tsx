'use client';
import {useEffect,useMemo,useState} from 'react';
import {Bell,CalendarDays,Check,LoaderCircle,Play} from 'lucide-react';
import {catalog,poster,type Anime,type Entry} from '@/lib/anime';
const days=['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];
export default function Schedule({library,onOpen,onFollow}:{library:Record<number,Entry>;onOpen:(anime:Anime)=>void;onFollow:(anime:Anime,following:boolean)=>void}){
 const [items,setItems]=useState<Anime[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
 useEffect(()=>{let active=true;catalog('schedule').then(data=>{if(active)setItems(data)}).catch(()=>{if(active)setError('Не удалось загрузить расписание. Попробуйте ещё раз.')}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
 const grouped=useMemo(()=>days.map((day,index)=>({day,items:items.filter(item=>item.publish_day?.value===index+1)})).filter(group=>group.items.length),[items]);
 if(loading)return <div className="loading"><LoaderCircle className="spin"/> Собираем расписание…</div>;
 if(error)return <div className="notice">{error}</div>;
 return <section className="schedule"><div className="schedule-intro"><span className="pill"><CalendarDays size={14}/> ОНГОИНГИ</span><h2>Когда выходят новые серии</h2><p>Подпишись на тайтл, чтобы он всегда был в твоей библиотеке и не потерялся после новой серии.</p></div>{grouped.map(group=><div className="schedule-day" key={group.day}><h3>{group.day}<span>{group.items.length}</span></h3><div className="schedule-grid">{group.items.map(anime=>{const following=library[anime.id]?.following;return <article key={anime.id} className="schedule-card"><button className="schedule-open" onClick={()=>onOpen(anime)}><img src={poster(anime)} alt=""/><div><p>{anime.latest_episode?`${anime.latest_episode.ordinal} серия доступна`:'Онгоинг'}</p><h4>{anime.name.main}</h4><span>{anime.genres?.[0]?.name||'Аниме'} · {anime.age_rating?.label}</span></div><Play size={18} fill="currentColor"/></button><button className={following?'following':''} aria-pressed={Boolean(following)} onClick={()=>onFollow(anime,!following)}>{following?<><Check size={15}/> Подписан</>:<><Bell size={15}/> Подписаться</>}</button></article>})}</div></div>)}</section>
}
