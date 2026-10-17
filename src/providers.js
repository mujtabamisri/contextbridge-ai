export const providers=[
{id:'chatgpt',name:'ChatGPT',hosts:['chatgpt.com','chat.openai.com'],url:'https://chatgpt.com/'},
{id:'claude',name:'Claude',hosts:['claude.ai'],url:'https://claude.ai/new'},
{id:'gemini',name:'Gemini',hosts:['gemini.google.com'],url:'https://gemini.google.com/app'},
{id:'grok',name:'Grok',hosts:['grok.com'],url:'https://grok.com/'},
{id:'perplexity',name:'Perplexity',hosts:['perplexity.ai','www.perplexity.ai'],url:'https://www.perplexity.ai/'},
{id:'deepseek',name:'DeepSeek',hosts:['chat.deepseek.com'],url:'https://chat.deepseek.com/'}];
export function detect(url){try{let h=new URL(url).hostname;return providers.find(p=>p.hosts.includes(h))||null}catch{return null}}
