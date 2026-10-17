// IMPORTANT: This function is serialized and executed in the AI tab by chrome.scripting.
// It must not reference imports or variables outside its own body.
export function extractConversation(selectionOnly = false) {
  const host = location.hostname;
  const provider = host.includes('chatgpt.com') || host === 'chat.openai.com' ? 'chatgpt' : host === 'claude.ai' ? 'claude' : host === 'gemini.google.com' ? 'gemini' : host === 'grok.com' ? 'grok' : host.includes('perplexity.ai') ? 'perplexity' : host === 'chat.deepseek.com' ? 'deepseek' : 'unknown';
  const result = (messages, strategy, warning='') => ({provider, title:document.title,url:location.href,messages, strategy, warning});
  if (selectionOnly) {
    const text = getSelection()?.toString()?.trim() || '';
    return result(text ? [{role:'transcript',text}] : [], 'selection', text ? 'Selected text captured. Review it before transferring.' : 'Select the conversation text on the page before clicking this button.');
  }
  const visible = e => !!(e.getClientRects().length) && getComputedStyle(e).visibility !== 'hidden';
  // Dedicated extractors use the message structures observed on Grok and Perplexity.
  // Keep these separate from the already-working providers.
  if (provider === 'grok') {
    const transcript = document.querySelector('[data-testid="chat-transcript-scroller"]');
    if (transcript) {
      const messages = [...transcript.querySelectorAll('[data-testid="user-message"], [data-testid="assistant-message"]')]
        .filter(visible)
        .map(el => ({
          role: el.getAttribute('data-testid') === 'user-message' ? 'user' : 'assistant',
          text: (el.querySelector('.response-content-markdown')?.innerText || el.innerText || '').trim()
        }))
        .filter(m => m.text);
      if (messages.length) return result(messages, 'Grok message bubbles',
        'Review the transcript before transferring. Unloaded messages and non-text attachments may be missing.');
    }
  }
  if (provider === 'perplexity') {
    const main = document.querySelector('main');
    if (main) {
      // User bubbles observed with these stable utility-class tokens; do not capture sidebar items.
      const userCandidates = [...main.querySelectorAll('div')].filter(el =>
        el.classList.contains('flex') && el.classList.contains('flex-col') &&
        el.classList.contains('flex-1') && el.classList.contains('min-w-0') &&
        el.classList.contains('gap-1') && visible(el));
      // A top-level prose block represents a full answer; nested list items are not messages.
      const answerCandidates = [...main.querySelectorAll('div.prose')].filter(el =>
        el.classList.contains('leading-relaxed') && visible(el) &&
        !el.parentElement?.closest('div.prose.leading-relaxed'));
      const entries = [
        ...userCandidates.map(el => ({el, role:'user'})),
        ...answerCandidates.map(el => ({el, role:'assistant'}))
      ].filter(x => !x.el.closest('nav,aside'));
      entries.sort((a,b) => a.el === b.el ? 0 :
        (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      const messages = entries.map(({el,role}) => {
        let text = (el.innerText || '').trim();
        if (role === 'user') text = text.replace(/^\d{1,2}:\d{2}(?:\s*[AP]M)?\s*/i, '').trim();
        return {role,text};
      }).filter(m => m.text);
      if (messages.length) return result(messages, 'Perplexity user bubbles and prose answers',
        'Review the capture. Citation labels, unloaded messages, image-only replies and attachments may not transfer perfectly.');
    }
  }
  if (provider === 'deepseek') {
    // DeepSeek's current UI uses ds-message rather than data-role/message-row.
    // Inspect only top-level message blocks to avoid duplicating nested markdown.
    const blocks = [...document.querySelectorAll('.ds-message')]
      .filter(el => visible(el) && !el.parentElement?.closest('.ds-message'));
    const messages = blocks.map(el => {
      // User messages use ds-collapsible-text; assistant messages render answer
      // content separately, often with reasoning and code blocks.
      const userBody = el.querySelector('.ds-collapsible-text');
      const isUser = !!userBody;
      const content = isUser ? (userBody || el) : el;
      const copy = content.cloneNode(true);
      copy.querySelectorAll('button, svg, script, style, textarea, input, [role="toolbar"], .ds-think-content, .md-code-block button').forEach(n => n.remove());
      // Preserve preformatted code without copying its Copy/Download controls.
      const text = (copy.textContent || '').replace(/\u00a0/g, ' ').trim();
      return {role: isUser ? 'user' : 'assistant', text};
    }).filter(m => m.text);
    if (messages.length >= 2 && messages.some(m => m.role === 'user') && messages.some(m => m.role === 'assistant')) {
      return result(messages, 'DeepSeek ds-message blocks',
        'Review the capture. Reasoning panels are excluded; unloaded messages, attachments and some formatting may be missing.');
    }
  }
  const selectors = {
    chatgpt: ['[data-message-author-role]','[data-testid^="conversation-turn"]','[class~="group/conversation-turn"]'],
    claude: ['[data-testid="user-message"], [data-testid="assistant-message"]','.font-user-message, .font-claude-response'],
    gemini: ['user-query, model-response','[data-test-id="user-query"], [data-test-id="model-response"]'],
    grok: ['[data-role="user"], [data-role="assistant"]','[data-testid="message"]'],
    perplexity: ['[data-testid="query"], [data-testid="answer"]'],
    deepseek: ['[data-role="user"], [data-role="assistant"]','[class*="message-row"]']
  };
  const role = el => {
    const a = [el.tagName, el.getAttribute('data-message-author-role'),el.getAttribute('data-role'),el.getAttribute('data-testid'),el.getAttribute('data-test-id'),typeof el.className==='string'?el.className:''].filter(Boolean).join(' ').toLowerCase();
    if (/user-query|user-message|font-user|\buser\b|\bhuman\b|\bquery\b/.test(a)) return 'user';
    if (/model-response|assistant|claude-response|agent-turn|\banswer\b/.test(a)) return 'assistant';
    const nested=el.querySelector('[data-message-author-role],[data-role],user-query,model-response');
    return nested ? role(nested) : null;
  };
  const extractText = el => {
    const content = el.querySelector('[data-testid="message-content"],.markdown,.prose,.whitespace-pre-wrap') || el;
    const clone=content.cloneNode(true);
    clone.querySelectorAll('button,nav,svg,script,style,[role="toolbar"],input,textarea').forEach(n=>n.remove());
    // innerText is unavailable on detached clones in some browsers; textContent is reliable.
    return (content.innerText || clone.textContent || '').trim();
  };
  for (const sel of (selectors[provider]||[])) {
    let els=[];try{els=[...document.querySelectorAll(sel)].filter(visible);}catch{continue;}
    const raw=els.map(el=>({el,role:role(el),text:extractText(el)})).filter(x=>x.role&&x.text);
    const unique=raw.filter((x,i)=>!raw.some((y,j)=>j!==i&&y.el.contains(x.el)&&y.role===x.role));
    unique.sort((a,b)=>a.el===b.el?0:(a.el.compareDocumentPosition(b.el)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1));
    const messages=unique.map(({role,text})=>({role,text}));
    if(messages.length>=2) return result(messages,`DOM: ${sel}`,'Review the capture. Older messages that have not loaded and file attachments may be missing.');
  }
  // ChatGPT has an alternate accessible layout with "You said:" and "ChatGPT said:".
  // Choose the main region that actually contains the active conversation, not all main regions.
  if(provider==='chatgpt') {
    const mains=[...document.querySelectorAll('main')].filter(visible);
    const scored=mains.map(el=>{
      const t=el.innerText||'';
      const labels=(t.match(/(?:^|\n)\s*(?:You said:|ChatGPT said:)/g)||[]).length;
      const active=(/Loading older messages|\bShare\b/.test(t.slice(0,200))?2:0);
      return {el,t,score:labels*10+active,labels};
    }).filter(x=>x.labels>0).sort((a,b)=>b.score-a.score);
    const target=scored[0];
    if(target) {
      const lines=target.t.split('\n');const messages=[];let current=null;
      const marker=/^\s*(You said:|ChatGPT said:)\s*(.*)$/;
      for(const line of lines){
        const m=line.match(marker);
        if(m){if(current?.text.trim())messages.push({role:current.role,text:current.text.trim()});current={role:m[1]==='You said:'?'user':'assistant',text:m[2]||''};}
        else if(current)current.text+='\n'+line;
      }
      if(current?.text.trim())messages.push({role:current.role,text:current.text.trim()});
      if(messages.length) return result(messages,'ChatGPT accessible text markers',`Captured ${messages.length} sections from the most likely conversation container. Review carefully: text labels inside messages can cause imperfect splits, interface controls may appear, and older messages may still be loading.`);
    }
  }
  return result([],'none','No recognizable messages found. Scroll to load the conversation and retry, or select conversation text on the page and use “Capture selected text instead”.');
}
