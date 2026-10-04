import {env} from 'cloudflare:workers';

type BugReport={kind?:'manual'|'automatic';message?:string;stack?:string;page?:string;userAgent?:string;contact?:string};
const limits=new Map<string,{count:number;reset:number}>();
const clean=(value:unknown,max:number)=>typeof value==='string'?value.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max):'';

export async function POST(request:Request){
 const origin=request.headers.get('origin');
 if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Недопустимый источник запроса'},{status:403});
 const ip=request.headers.get('x-real-ip')||request.headers.get('cf-connecting-ip')||'unknown';
 const now=Date.now(),current=limits.get(ip);
 if(!current||current.reset<now)limits.set(ip,{count:1,reset:now+10*60_000});
 else if(current.count>=5)return Response.json({error:'Слишком много сообщений. Попробуйте позже.'},{status:429});
 else current.count++;
 let input:BugReport;
 try{input=await request.json() as BugReport}catch{return Response.json({error:'Некорректный запрос'},{status:400})}
 const message=clean(input.message,1500),stack=clean(input.stack,1800),page=clean(input.page,500),agent=clean(input.userAgent,500),contact=clean(input.contact,200);
 if(!message)return Response.json({error:'Опишите ошибку'},{status:400});
 const settings=env as unknown as Record<string,string>,token=settings.TELEGRAM_BOT_TOKEN,chatId=settings.TELEGRAM_CHAT_ID;
 if(!token||!chatId)return Response.json({error:'Отправка отчётов ещё не настроена'},{status:503});
 const title=input.kind==='automatic'?'Автоматическая ошибка':'Сообщение пользователя';
 const text=[`🐞 Ogoanime · ${title}`,`Описание: ${message}`,contact&&`Контакт: ${contact}`,page&&`Страница: ${page}`,agent&&`Браузер: ${agent}`,stack&&`Технические данные:\n${stack}`].filter(Boolean).join('\n\n').slice(0,4000);
 const result=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chatId,text,disable_web_page_preview:true})});
 if(!result.ok)return Response.json({error:'Не удалось отправить сообщение'},{status:502});
 return Response.json({ok:true});
}
