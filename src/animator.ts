function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const NEARBY_KEYS: Record<string, string> = {
  a: 's', b: 'v', c: 'x', d: 'f', e: 'r', f: 'g', g: 'h',
  h: 'g', i: 'o', j: 'k', k: 'l', l: 'k', m: 'n', n: 'b',
  o: 'p', p: 'o', q: 'w', r: 't', s: 'd', t: 'y', u: 'i',
  v: 'c', w: 'e', x: 'z', y: 'u', z: 'x',
};

type Action =
  | { type: 'add'; char: string }
  | { type: 'delete' }
  | { type: 'pause'; ms: number };

function buildActions(text: string): Action[] {
  const actions: Action[] = [];
  let typoCount = 0;
  let charsSinceLastTypo = Infinity;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const lower = char.toLowerCase();
    const canTypo =
      typoCount < 2 &&
      charsSinceLastTypo >= 4 &&
      lower in NEARBY_KEYS &&
      Math.random() < 0.12;

    if (canTypo) {
      const wrongCount = 1 + (i + 1 < text.length && text[i + 1].toLowerCase() in NEARBY_KEYS ? Math.round(Math.random()) : 0);
      actions.push({ type: 'add', char: NEARBY_KEYS[lower] });
      if (wrongCount === 2 && i + 1 < text.length) {
        actions.push({ type: 'add', char: NEARBY_KEYS[text[i + 1].toLowerCase()] });
      }
      actions.push({ type: 'pause', ms: 300 });
      for (let d = 0; d < wrongCount; d++) {
        actions.push({ type: 'delete' });
      }
      actions.push({ type: 'pause', ms: 150 });

      typoCount++;
      charsSinceLastTypo = 0;
    }

    actions.push({ type: 'add', char });
    charsSinceLastTypo++;
  }

  return actions;
}

async function executeActions(element: HTMLTextAreaElement, actions: Action[]): Promise<void> {
  for (const action of actions) {
    switch (action.type) {
      case 'add':
        element.value += action.char;
        await sleep(120 + Math.random() * 80 - 40);
        break;
      case 'delete':
        element.value = element.value.slice(0, -1);
        await sleep(80);
        break;
      case 'pause':
        await sleep(action.ms);
        break;
    }
  }
}

async function runAnimation(
  textarea: HTMLTextAreaElement,
  inputBox: HTMLDivElement,
  sendBtn: HTMLButtonElement,
  query: string,
): Promise<void> {
  await sleep(800);

  inputBox.classList.add('focused');
  await sleep(200);

  const actions = buildActions(query);
  await executeActions(textarea, actions);

  await sleep(700);

  sendBtn.classList.add('active');
  await sleep(300);

  sendBtn.classList.add('pressed');
  await sleep(200);
  sendBtn.classList.remove('pressed');

  await sleep(1000);

  window.location.href = `https://chatgpt.com/?prompt=${encodeURIComponent(query)}`;
}

export function initAnimator(query: string): void {
  const app = document.getElementById('app')!;

  app.innerHTML = `
    <div class="animator">
      <div class="animator-sidebar">
        <button class="animator-sidebar-btn" aria-label="ChatGPT">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
          </svg>
        </button>
        <button class="animator-sidebar-btn" aria-label="New chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
        </button>
        <button class="animator-sidebar-btn" aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <button class="animator-sidebar-btn" aria-label="Projects">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </button>
        <div class="animator-sidebar-spacer"></div>
        <div class="animator-sidebar-avatar">HA</div>
      </div>
      <div class="animator-body">
        <div class="animator-top-bar">
          <div class="animator-model-selector">
            <span class="animator-model-label">ChatGPT 5.4 Thinking</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <div class="animator-top-right">
            <button class="animator-top-btn" aria-label="Share">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
            </button>
            <button class="animator-top-btn" aria-label="Menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
        <div class="animator-main">
          <div class="animator-greeting">Where should we begin?</div>
          <div class="animator-input-box">
            <textarea
              class="animator-textarea"
              readonly
              placeholder="Ask anything"
              rows="1"
            ></textarea>
            <div class="animator-toolbar">
              <div class="animator-toolbar-left">
                <button class="animator-attach" aria-label="Attach">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                <button class="animator-thinking-btn" aria-label="Extended thinking">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Extended thinking</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
              <div class="animator-toolbar-right">
                <button class="animator-mic" aria-label="Voice">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </button>
                <button class="animator-send" aria-label="Send">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94l18-8.25a.75.75 0 0 0 0-1.38l-18-8.56z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const textarea = app.querySelector<HTMLTextAreaElement>('.animator-textarea')!;
  const inputBox = app.querySelector<HTMLDivElement>('.animator-input-box')!;
  const sendBtn = app.querySelector<HTMLButtonElement>('.animator-send')!;

  runAnimation(textarea, inputBox, sendBtn, query);
}
