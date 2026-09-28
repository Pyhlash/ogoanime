export async function GET(request:Request){
 const input=new URL(request.url);const mode=input.searchParams.get('mode')||'latest';
 let path='/anime/releases/latest?limit=24';
 if(mode==='search'){const q=input.searchParams.get('q')||'';const page=Math.max(1,Math.min(1000,Number(input.searchParams.get('page'))||1));path='/anime/catalog/releases?limit=24&page='+page+'&f[search]='+encodeURIComponent(q)+'&f[sorting]=RATING_DESC';}
 if(mode==='list'){const ids=input.searchParams.get('ids')||'';if(!/^\d+(,\d+){0,99}$/.test(ids))return Response.json({error:'Некорректный список'},{status:400});path='/anime/releases/list?ids='+ids;}
 try{const result=await fetch('https://api.anilibria.app/api/v1'+path,{signal:AbortSignal.timeout(15000)});if(!result.ok)throw Error('upstream');let data:any=await result.json();if(mode==='list'){data=(data.data||data).map((a:any)=>{const episodes=a.episodes||[];const latest=episodes.reduce((best:any,e:any)=>!best||e.ordinal>best.ordinal?e:best,null);const {episodes:removed,torrents,members,sponsors,...rest}=a;return {...rest,latest_episode:latest}})}return Response.json(data,{headers:{'Cache-Control':'public, max-age=120'}})}catch{return Response.json({error:'Каталог временно недоступен. Попробуйте ещё раз.'},{status:502})}
}
