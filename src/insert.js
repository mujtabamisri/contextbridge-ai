/* Runs only after the user requests a transfer. Never clicks Send. */
(() => {
  const key = '__contextBridgeInsert';
  if (window[key]) return;
  window[key] = true;
  const selectors = [
    '#prompt-textarea',
    '[data-testid="composer-input"]',
    '[data-testid="chat-input"]',
    'div[contenteditable="true"][role="textbox"]',
    'div[contenteditable="true"][data-placeholder]',
    'div[contenteditable="true"]',
    'textarea[placeholder]',
    'textarea'
  ];
  const visible = el => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
  };
  function findComposer() {
    for (const selector of selectors) {
      const candidates = [...document.querySelectorAll(selector)].filter(visible);
      const input = candidates.find(el => !el.closest('[data-contextbridge-banner]') && !el.disabled && !el.readOnly);
      if (input) return input;
    }
    return null;
  }
  function insert(el, text) {
    el.focus();
    if (el.matches('textarea, input')) {
      const setter = Object.getOwnPropertyDescriptor(el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value')?.set;
      if (setter) setter.call(el, text); else el.value = text;
      el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(el);
      selection.removeAllRanges();
      selection.addRange(range);
      // insertText fires editor input handling in many ProseMirror/Lexical editors.
      const ok = document.execCommand('insertText', false, text);
      if (!ok) {
        el.textContent = text;
        el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
      }
    }
    return (el.matches('textarea,input') ? el.value : el.innerText).trim().length > 0;
  }
  function notice(message) {
    const old = document.querySelector('[data-contextbridge-banner]');
    if (old) old.remove();
    const b = document.createElement('div');
    b.dataset.contextbridgeBanner = '1';
    Object.assign(b.style, { position:'fixed', right:'16px', bottom:'20px', zIndex:'2147483647', padding:'12px 16px', background:'#172554', color:'#fff', borderRadius:'10px', boxShadow:'0 3px 18px #0006', font:'13px system-ui', maxWidth:'350px' });
    b.textContent = message;
    const close = document.createElement('button');
    close.textContent = ' ×';
    Object.assign(close.style,{ marginLeft:'12px',color:'white',background:'transparent',border:0,cursor:'pointer' });
    close.onclick=()=>b.remove();
    b.append(close);
    document.body.append(b);
  }
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'CONTEXTBRIDGE_INSERT') return;
    try {
      const composer = findComposer();
      if (!composer) { sendResponse({ok:false,reason:'Composer not ready'}); return; }
      const ok = insert(composer, message.text);
      notice(ok ? 'ContextBridge inserted the conversation. Review it before sending.' : 'Could not insert automatically. Paste with Ctrl+V.');
      sendResponse({ok});
    } catch(e) { sendResponse({ok:false,reason:String(e)}); }
  });
})();
