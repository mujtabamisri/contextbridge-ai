## Installation — Chrome & Microsoft Edge

ContextBridge AI is currently available for free through GitHub. You can install it manually without paying for anything.

### Step 1 — Download ContextBridge AI

1. Open the [ContextBridge AI GitHub repository](https://github.com/mujtabamisri/contextbridge-ai).
2. Click the green **Code** button.
3. Select **Download ZIP**.
4. Extract the downloaded ZIP to a folder on your computer.

Alternatively, download the latest packaged extension from the repository's **Releases** page, if available.

### Step 2 — Install the Extension

**For Google Chrome:**

1. Open Google Chrome.
2. Enter `chrome://extensions` in the address bar.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked**.
5. Select the extracted folder.

**For Microsoft Edge:**

1. Open Microsoft Edge.
2. Enter `edge://extensions` in the address bar.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the extracted folder.

### Step 3 — Pin the Extension

1. Click the Extensions (puzzle-piece) icon in your browser toolbar.
2. Find **ContextBridge AI**.
3. Pin it to your toolbar for easy access.
4. Refresh any already-open AI chatbot tabs.

Your extension is now ready!

---

## How to Use ContextBridge AI

### Step 1 — Open Your AI Conversation

Open an existing conversation on any supported platform:

- ChatGPT
- Claude
- Google Gemini
- Grok
- Perplexity
- DeepSeek

For example, suppose you've been working on a coding project in ChatGPT and reached your usage limit.

### Step 2 — Capture Your Conversation

1. Click the **ContextBridge AI** extension icon.
2. Click **Capture conversation**.
3. ContextBridge AI will extract the available conversation messages.
4. Review the captured text in the preview.

**Tip:** If older messages are missing, scroll up in the conversation to load them, then capture again.

### Step 3 — Choose Another AI

Select the AI assistant where you want to continue your conversation.

For example:

**ChatGPT → Claude**

You can also transfer between other supported platforms.

### Step 4 — Transfer Your Conversation

1. Click **Copy & open destination** (or the transfer button displayed in your installed version).
2. ContextBridge AI copies your conversation context to the clipboard.
3. It opens your selected AI assistant in a new tab.
4. It attempts to paste the continuation prompt into the destination chat input automatically.

If automatic pasting doesn't work, click the destination message box and press `Ctrl + V` (`Cmd + V` on macOS).

### Step 5 — Continue Where You Left Off

1. Review the transferred conversation text.
2. Remove any sensitive information you don't want to share.
3. Click **Send** manually.

The destination AI can now use the transferred conversation as context to help you continue your work.

**Important:** ContextBridge AI does not automatically send messages.

---

## Limitations

- ContextBridge AI captures conversation text available in the loaded webpage, not necessarily the entire chat history.
- Older messages may need to be loaded by scrolling.
- Images, attachments, hidden reasoning, and internal AI memory are not transferred.
- Automatic insertion may stop working if an AI provider changes its website.
- Long conversations may exceed the destination AI's context limits.
- If automatic capture fails, use **Capture selected text instead** or paste text manually into the preview.

## Privacy & Security

ContextBridge AI does not operate its own conversation analytics or collection service.

The extension captures conversation text when requested and can copy it to the clipboard or insert it into another AI assistant.

Always review your conversation before transferring it. When you submit the text, the destination AI provider processes it under its own privacy policy.

Read the full [Privacy Policy](PRIVACY.md) for details.

## License

This project is licensed under the [MIT License](LICENSE).

Copyright © 2026 Mujtaba Misri.

## Disclaimer

ContextBridge AI is an independent open-source project and is not affiliated with or endorsed by OpenAI, Anthropic, Google, xAI, Perplexity, or DeepSeek.