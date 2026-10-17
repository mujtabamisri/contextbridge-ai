const pending = new Map();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== 'CONTEXTBRIDGE_OPEN') return;
  (async () => {
    const tab = await chrome.tabs.create({url: message.url, active:true});
    pending.set(tab.id, {text:message.text,attempts:0});
    sendResponse({ok:true});
    setTimeout(()=>tryInsert(tab.id),1200);
  })().catch(e=>sendResponse({ok:false,error:String(e)}));
  return true;
});
chrome.tabs.onUpdated.addListener((id, change) => {
  if (pending.has(id) && change.status === 'complete') setTimeout(()=>tryInsert(id),700);
});
chrome.tabs.onRemoved.addListener(id=>pending.delete(id));
async function tryInsert(id) {
  const job = pending.get(id);
  if (!job || job.busy) return;
  job.busy=true;
  try {
    await chrome.scripting.executeScript({target:{tabId:id},files:['src/insert.js']});
    const result = await chrome.tabs.sendMessage(id,{type:'CONTEXTBRIDGE_INSERT',text:job.text});
    if(result?.ok){pending.delete(id);return;}
  } catch(e) { /* Login pages and loading editors may not be ready yet. */ }
  finally {job.busy=false;}
  if(++job.attempts >= 18){pending.delete(id);return;}
  setTimeout(()=>tryInsert(id),1000);
}
