import {env} from 'cloudflare:workers';
export async function GET(){const e=env as unknown as Record<string,string>;return Response.json({url:e.SUPABASE_URL||'',key:e.SUPABASE_PUBLISHABLE_KEY||'',google:e.GOOGLE_AUTH_ENABLED==='true',vk:e.VK_AUTH_ENABLED==='true'},{headers:{'Cache-Control':'no-store'}})}
