import {createClient} from '@supabase/supabase-js';
export function mountSettings({onSession=()=>{}}={}){
 const $=id=>document.getElementById(id),controller=new AbortController();let stopped=false,authSubscription,sessionTimer,lastUserId;
 const media=window.matchMedia('(prefers-color-scheme: dark)');
 let theme='system';try{const saved=localStorage.getItem('urbo-theme');if(['system','light','dark'].includes(saved))theme=saved;}catch{}
 const applyTheme=()=>{const dark=theme==='dark'||theme==='system'&&media.matches;document.documentElement.classList.toggle('dark',dark);document.documentElement.dataset.theme=dark?'dark':'light';document.documentElement.style.colorScheme=dark?'dark':'light';};
 $('theme-select').value=theme;applyTheme();media.addEventListener('change',applyTheme);
 $('theme-select').addEventListener('change',e=>{theme=e.target.value;try{localStorage.setItem('urbo-theme',theme);}catch{}applyTheme();},{signal:controller.signal});
 const notice=(text,status='neutral')=>{if(stopped)return;$('auth-message').hidden=!text;$('auth-message').textContent=text;$('auth-message').dataset.status=status;};
 const url=import.meta.env.VITE_SUPABASE_URL,key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
 let client=null;try{if(url&&key)client=createClient(url,key);}catch{notice('Configuration Google invalide.','warning');}
 if(!client){$('google-login').disabled=true;notice('Connexion Google à configurer.','warning');return()=>{stopped=true;clearTimeout(sessionTimer);controller.abort();media.removeEventListener('change',applyTheme);};}
 const showUser=user=>{if(stopped)return;if(lastUserId!==(user?.id||null)){lastUserId=user?.id||null;clearTimeout(sessionTimer);sessionTimer=setTimeout(()=>{if(!stopped)onSession({client,user:user||null});},0);}$('account-status').textContent=user?.email||'Non connecté';$('google-login').hidden=Boolean(user);$('google-logout').hidden=!user;$('google-login').disabled=false;$('google-logout').disabled=false;};
 $('google-login').addEventListener('click',async()=>{notice('');$('google-login').disabled=true;try{const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin}});if(error)throw error;}catch{notice('Connexion impossible. Réessayez.','danger');if(!stopped)$('google-login').disabled=false;}},{signal:controller.signal});
 $('google-logout').addEventListener('click',async()=>{notice('');$('google-logout').disabled=true;try{const {error}=await client.auth.signOut();if(error)throw error;showUser(null);}catch{notice('Déconnexion impossible. Réessayez.','danger');if(!stopped)$('google-logout').disabled=false;}},{signal:controller.signal});
 client.auth.getSession().then(({data,error})=>{if(error){notice('Compte indisponible. Réessayez.','warning');showUser(null);}else showUser(data.session?.user);}).catch(()=>{notice('Compte indisponible. Réessayez.','warning');showUser(null);});
 const {data}=client.auth.onAuthStateChange((_event,session)=>{showUser(session?.user);});authSubscription=data.subscription;
 const params=new URLSearchParams(window.location.hash.slice(1)||window.location.search.slice(1));if(params.has('error_description'))notice('Google a refusé la connexion. Vérifiez la configuration.','danger');
 return()=>{stopped=true;clearTimeout(sessionTimer);controller.abort();media.removeEventListener('change',applyTheme);authSubscription?.unsubscribe();};
}
