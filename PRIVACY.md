# Privacy Policy — ContextBridge AI

**Last updated:** October 17, 2026

ContextBridge AI is a browser extension for Google Chrome and Microsoft Edge that helps users transfer available conversation text between supported AI assistants. This policy describes how the extension handles information.

## 1. Information the extension accesses

When you choose **Capture conversation** or **Capture selected text instead**, ContextBridge AI reads conversation text available on the active, supported AI website. This may include messages you wrote and responses from the AI assistant. You can review and edit the captured text in the extension's preview before transferring it.

ContextBridge AI also accesses the active tab's URL to identify the supported AI service and uses browser tab and scripting permissions to capture or insert text on supported websites.

## 2. How conversation text is used

The extension uses captured text only to prepare a continuation prompt for your selected destination AI assistant.

- **Preview:** Captured text is displayed in the extension popup so you can review or edit it.
- **Clipboard:** When you select Copy or Transfer, the continuation prompt is copied to your system clipboard.
- **Destination input:** When you select Transfer, the extension opens the destination AI website and attempts to insert the prompt into its message input. If automatic insertion fails, you can paste from the clipboard manually.
- **Sending:** The extension does **not** automatically submit the message. You decide whether to send it.

## 3. Storage and retention

The current extension does not intentionally save conversation transcripts to browser extension storage, a database, or a remote server. Captured text is held temporarily in the extension's popup or in memory while a transfer is being attempted. The clipboard copy remains subject to your device's clipboard behavior, including any operating-system clipboard history or synchronization features you have enabled.

## 4. Data sharing and external services

The current extension does not include its own analytics, advertising trackers, or developer-operated server endpoints for collecting conversations.

When you open a destination AI website, your browser connects to that provider. If you choose to submit the transferred prompt, that AI provider receives and processes the text according to its own terms and privacy policy. ContextBridge AI does not control the destination provider's data practices.

## 5. Browser permissions

ContextBridge AI requests permissions needed for its core functionality:

- **activeTab:** To work with the active supported conversation tab when you request capture.
- **scripting:** To extract conversation text and attempt insertion into the destination's input field.
- **tabs:** To identify the active tab and open the selected destination AI website.
- **clipboardWrite:** To copy the continuation prompt to your clipboard.
- **Host access to supported AI domains:** To support capture and insertion on ChatGPT, Claude, Gemini, Grok, Perplexity, and DeepSeek.

You can review the exact domains and permissions in [`manifest.json`](manifest.json).

## 6. Sensitive information

AI conversations can contain personal, confidential, or otherwise sensitive information. **Review the preview and remove information you do not want to share before transferring it.** Avoid transferring passwords, access tokens, private keys, financial details, medical information, or confidential work material unless you understand the consequences.

## 7. Children

ContextBridge AI is a general-purpose productivity tool, not specifically designed for children. It does not intentionally collect information about children through a developer-operated service.

## 8. Changes to this policy

This policy may be updated if the extension's features or data-handling practices change. The latest version will be published in this repository, with its updated date.

## 9. Contact

For privacy questions or concerns, open an issue in the [ContextBridge AI GitHub repository](https://github.com/mujtabamisri/contextbridge-ai/issues).

---

**Project:** [ContextBridge AI](https://github.com/mujtabamisri/contextbridge-ai)

**Developer:** Mujtaba Ali Misri
