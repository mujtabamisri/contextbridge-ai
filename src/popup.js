import {providers,detect} from './providers.js';
import {extractConversation} from './extractor.js';
const $=id=>document.getElementById(id);
let source=null;
const feedback=(s,bad=false)=>{$('feedback').textContent=s;$('feedback').style.color=bad?'#fca5a5':'#a7f3d0'};
function show(c){$('preview').value=(c.messages||[]).map(m=>`[${m.role.toUpperCase()}]\n${m.text}`).join('\n\n');$('count').textContent=`${c.messages?.length||0} sections`}
async function capture(selectionOnly=false){try{const [tab]=await chrome.tabs.query({active:true,currentWindow:true});source=detect(tab?.url);if(!tab?.id||!source)throw Error('Open a supported AI conversation in the active tab.');const out=await chrome.scripting.executeScript({target:{tabId:tab.id},func:extractConversation,args:[selectionOnly]});const c=out?.[0]?.result;if(!c)throw Error('The page did not return a capture result.');show(c);feedback(c.warning||'Captured. Review before transferring.',!c.messages?.length)}catch(e){feedback(`Capture failed: ${e.message||e}`,true)}}
const handoff=()=>`Continue the conversation below from another AI assistant. Use the prior discussion to understand the work completed and the next step. Do not invent missing files or details.\n\n--- BEGIN CONVERSATION ---\n${$('preview').value.trim()}\n--- END CONVERSATION ---`;
async function copy(){if(!$('preview').value.trim()){feedback('Capture or paste a conversation first.',true);return false;}try{await navigator.clipboard.writeText(handoff());feedback('Copied. Paste into the destination chat.');return true}catch(e){feedback('Clipboard failed. Select the preview and copy it manually.',true);return false}}
$('capture').onclick=()=>capture(false);$('selection').onclick=()=>capture(true);
$('copy').onclick=copy;
$('transfer').onclick=async()=>{
  if(!await copy())return;
  const dest=providers.find(p=>p.id===$('destination').value);
  if(!dest)return;
  try {
    const result=await chrome.runtime.sendMessage({type:'CONTEXTBRIDGE_OPEN',url:dest.url,text:handoff()});
    if(!result?.ok)throw Error(result?.error||'Could not open destination');
    feedback('Opening destination and attempting to insert. If it fails, use Ctrl+V.');
  } catch(e){feedback(`Automatic insertion unavailable: ${e.message}. The text is copied; paste with Ctrl+V.`,true);await chrome.tabs.create({url:dest.url});}
};
$('clear').onclick=()=>{show({messages:[]});feedback('Preview cleared.');};
$('preview').oninput=()=>{$('count').textContent=`${$('preview').value.length.toLocaleString()} characters`;};
(async()=>{try{const [tab]=await chrome.tabs.query({active:true,currentWindow:true});source=detect(tab?.url);$('status').textContent=source?`Detected: ${source.name}`:'Open a supported AI chat';$('destination').replaceChildren(...providers.filter(p=>p.id!==source?.id).map(p=>{const o=document.createElement('option');o.value=p.id;o.textContent=p.name;return o;}));}catch(e){feedback(String(e),true)}})();
