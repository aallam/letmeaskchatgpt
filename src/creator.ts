export function initCreator(): void {
  const app = document.getElementById('app')!;

  app.innerHTML = `
    <div class="creator">
      <div class="creator-content">
        <h1 class="creator-title">Let Me Ask ChatGPT</h1>
        <p class="creator-subtitle">For when someone asks you something they could just ask ChatGPT</p>
        <textarea
          class="creator-textarea"
          placeholder="Type the question they should've asked ChatGPT..."
          rows="4"
        ></textarea>
        <button class="creator-generate">Generate Link</button>
        <div class="creator-result hidden">
          <div class="creator-result-label">Share this link</div>
          <div class="creator-url-row">
            <input class="creator-url" readonly />
            <button class="creator-copy">Copy</button>
          </div>
        </div>
      </div>
      <p class="creator-crosslink">Looking for <a href="https://letmeaskclaude.aallam.com" target="_blank" rel="noopener">Claude version</a>?</p>
    </div>
  `;

  const textarea = app.querySelector<HTMLTextAreaElement>('.creator-textarea')!;
  const generateBtn = app.querySelector<HTMLButtonElement>('.creator-generate')!;
  const result = app.querySelector<HTMLDivElement>('.creator-result')!;
  const urlInput = app.querySelector<HTMLInputElement>('.creator-url')!;
  const copyBtn = app.querySelector<HTMLButtonElement>('.creator-copy')!;

  generateBtn.addEventListener('click', () => {
    const question = textarea.value.trim();
    if (!question) {
      textarea.classList.add('shake');
      textarea.addEventListener('animationend', () => textarea.classList.remove('shake'), { once: true });
      textarea.focus();
      return;
    }

    const url = `${window.location.origin}/?q=${encodeURIComponent(question)}`;
    urlInput.value = url;
    result.classList.remove('hidden');
    urlInput.focus();
    urlInput.select();
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(urlInput.value).then(() => {
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    });
  });
}
