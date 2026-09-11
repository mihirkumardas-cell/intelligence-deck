document.addEventListener('DOMContentLoaded', () => {
    // ── UI Elements ────────────────────────────────────────────
    const form            = document.getElementById('code-form');
    const textarea        = document.getElementById('editor-textarea');
    const modeButtons     = document.querySelectorAll('.mode-btn');
    const hiddenModeInput = document.getElementById('hidden-mode');
    const modePill        = document.querySelector('.mode-pill');
    const outputContainer = document.getElementById('output-container');
    const emptyState      = document.getElementById('empty-state');
    const skeletonLoader  = document.getElementById('skeleton-loader');
    const markdownOutput  = document.getElementById('markdown-output');
    const rawResponseEl   = document.getElementById('raw-response');
    const serverStatusEl  = document.getElementById('server-status');
    const submitBtn       = document.getElementById('btn-submit');
    const submitSpinner   = submitBtn.querySelector('.spinner');
    const submitText      = submitBtn.querySelector('.btn-text');
    const historyList     = document.getElementById('history-list');
    const newChatBtn      = document.getElementById('btn-new-chat');
    const clearHistoryBtn = document.getElementById('btn-clear-history');
    const lineNumbers     = document.querySelector('.line-numbers');
    const charCount       = document.getElementById('char-count');
    const heroFocusBtn    = document.getElementById('hero-focus-editor');
    const heroScrollBtn   = document.getElementById('hero-scroll-output');
    const quickCards      = document.querySelectorAll('.quick-card');
    const tiltSurfaces    = document.querySelectorAll('.glass-panel');
    const copyBtn         = document.getElementById('btn-copy');
    const downloadBtn     = document.getElementById('btn-download');
    const toggleViewBtn   = document.getElementById('btn-toggle-view');
    const activeModeLabel = document.getElementById('active-mode-label');

    // ── State ──────────────────────────────────────────────────
    let currentMode      = 'generate';
    let rawResponseText  = '';
    let isShowingRaw     = false;
    let chatHistory      = [];
    let serverConnected  = false;

    const placeholders = {
        generate: 'Describe the logic or code structure you want to generate on the pulse engine...\n\nExample: "Write a high-performance Python parser for neon JSON structures, with docstrings and type annotations."',
        explain:  'Paste the code logic you would like the pulse engine to explain...\n\nExample:\ndef compute_pulse(rate, density):\n    return math.sqrt(rate * density) ** 1.85',
        debug:    'Paste the broken code and its debugger crash logs to solve fast...\n\nExample:\nCode:\nresponse = fetch("https://api.example.com/run")\nprint(response.json()["tokens"])\n\nError:\nTypeError: \'NoneType\' object is not subscriptable'
    };

    const modeHints = {
        generate: 'Compose your prompt to generate glowing architecture.',
        explain: 'Our neural core will deconstruct the internal logic and Big-O bounds for you.',
        debug: 'Diagnosing runtime regressions and repairing code in real-time.'
    };

    // ── Smart Presets & Recommendations Catalog ────────────────
    const recommendations = {
        generate: [
            {
                icon: '⚡',
                title: 'Production REST API Endpoint',
                tag: 'Flask / FastAPI',
                desc: 'CRUD route with Pydantic validation, status codes, and JSON error handling.',
                prompt: 'Create a production-grade REST API in Python (Flask/FastAPI) featuring structured JSON error handling, input validation with Pydantic, proper HTTP status codes, and clean docstrings.'
            },
            {
                icon: '🚀',
                title: 'Optimized Custom React Hook',
                tag: 'TypeScript / React',
                desc: 'Zero-dependency useDebounce & useThrottle with cleanup and TypeScript generics.',
                prompt: 'Write a zero-dependency useDebounce and useThrottle React hook in TypeScript with generic types, cancel callbacks, and exhaustive dependency handling.'
            },
            {
                icon: '🔒',
                title: 'Secure JWT Auth Middleware',
                tag: 'Security / Auth',
                desc: 'Bearer token verification, refresh token rotation, and RBAC permission scopes.',
                prompt: 'Implement secure JWT authentication middleware in Python with Bearer token decoding, refresh token rotation strategy, and role-based access control (RBAC).'
            },
            {
                icon: '📦',
                title: 'Async Data Ingestion Pipeline',
                tag: 'Asyncio / Queue',
                desc: 'High-throughput concurrent worker pool with retry backoff and rate limits.',
                prompt: 'Build a high-performance concurrent worker queue in Python using asyncio.Queue, exponential backoff retries, and rate-limiting controls.'
            }
        ],
        explain: [
            {
                icon: '🔍',
                title: 'Big-O Complexity Deconstruction',
                tag: 'Algorithmic Audit',
                desc: 'Detailed mathematical breakdown of time & space bounds with bottleneck analysis.',
                prompt: 'Perform a comprehensive Big-O algorithmic audit on this code. Break down worst-case, average-case, and space complexity, and pinpoint architectural bottlenecks.'
            },
            {
                icon: '🌊',
                title: 'Data Flow & Lifecycle Breakdown',
                tag: 'Architecture',
                desc: 'Step-by-step walkthrough of state transitions, memory lifecycle, and side-effects.',
                prompt: 'Explain the internal lifecycle and step-by-step data flow of this logic. Clarify how variables mutate, how memory is allocated, and how side-effects behave.'
            },
            {
                icon: '🛡️',
                title: 'Security & Race Condition Review',
                tag: 'Vulnerability Scan',
                desc: 'Identifies SQLi/XSS risks, concurrency deadlocks, and unhandled edge scenarios.',
                prompt: 'Audit this code for security vulnerabilities, concurrency race conditions, unhandled exceptions, and critical edge cases that could cause silent failures in production.'
            },
            {
                icon: '💡',
                title: 'Clean Architecture & SOLID Refactor',
                tag: 'Design Patterns',
                desc: 'Transform complex procedures into decoupled, testable, modular components.',
                prompt: 'Explain how to refactor this code to strictly adhere to SOLID principles and Clean Architecture. Show before/after modular breakdown.'
            }
        ],
        debug: [
            {
                icon: '🛠️',
                title: 'Null / Undefined Pointer Exception',
                tag: 'Runtime Crash',
                desc: 'Fix "TypeError: NoneType object is not subscriptable" or undefined variable crashes.',
                prompt: 'Here is a runtime crash error: TypeError: \'NoneType\' object is not subscriptable. Find the exact origin of null dereference, add defensive guards, and provide the fixed code.'
            },
            {
                icon: '⚡',
                title: 'Async Race Condition & Deadlock',
                tag: 'Concurrency',
                desc: 'Diagnose unresolved Promises, hanging asyncio tasks, or mutable state collisions.',
                prompt: 'Debug this asynchronous concurrency problem: tasks are intermittently dropping requests or hanging. Identify race conditions, missing awaits, and shared state collisions.'
            },
            {
                icon: '💾',
                title: 'Memory Leak & Connection Drain',
                tag: 'Resource Leak',
                desc: 'Resolve unclosed database connections, lingering event listeners, and memory spikes.',
                prompt: 'Diagnose and fix a memory leak / resource leak in this code where connections remain open and memory grows unboundedly under load.'
            },
            {
                icon: '🔌',
                title: 'CORS & Unhandled 500 Server Error',
                tag: 'HTTP / Network',
                desc: 'Resolve preflight CORS header rejections and unhandled internal server exceptions.',
                prompt: 'Debug and resolve CORS policy preflight rejections and unhandled 500 internal server exceptions occurring between the frontend client and backend service.'
            }
        ]
    };

    // ── Boot ───────────────────────────────────────────────────
    init();

    function init() {
        const defaultActiveBtn = document.querySelector('.mode-btn.active');
        if (defaultActiveBtn) {
            setMode(defaultActiveBtn.dataset.mode);
        } else {
            setMode('generate');
        }

        syncEditorChrome();
        loadHistoryFromStorage();
        renderHistoryList();

        // Server check — use GET to avoid 405 from Flask
        checkServerConnection();

        // Handle Flask-rendered initial response (page POST reload)
        if (rawResponseEl && rawResponseEl.textContent.trim()) {
            rawResponseText = rawResponseEl.textContent.trim();
            displayResponse(rawResponseText);
            saveToHistory(textarea.value.trim() || `Prompt (${currentMode})`, currentMode, rawResponseText);
        }

        setupEventListeners();
        setupScrollAnimationObserver();
        startTelemetrySimulation();
        setupTerminalSimulation();
    }

    // ── Dynamic Mode Switching ─────────────────────────────────
    function setMode(mode) {
        currentMode = mode;
        hiddenModeInput.value = currentMode;
        document.body.dataset.mode = currentMode;

        // Update mode toggle buttons
        modeButtons.forEach(btn => {
            const isMatch = btn.dataset.mode === mode;
            btn.classList.toggle('active', isMatch);
            btn.classList.toggle('opacity-50', !isMatch);
            if (isMatch) {
                updateModePill(btn);
            }
        });

        textarea.placeholder = placeholders[mode];
        if (activeModeLabel) {
            activeModeLabel.textContent = mode;
        }

        const modeHint = document.getElementById('mode-hint');
        if (modeHint && modeHints[mode]) {
            modeHint.textContent = modeHints[mode];
        }

        const recCat = document.getElementById('recommendations-category');
        if (recCat) {
            recCat.textContent = `${mode} Mode`;
        }

        renderRecommendations();
        syncEditorChrome();
    }

    // ── Render Recommendations Hub ─────────────────────────────
    function renderRecommendations() {
        const container = document.getElementById('recommendation-chips');
        if (!container) return;
        container.innerHTML = '';

        const list = recommendations[currentMode] || recommendations.generate;
        list.forEach(rec => {
            const card = document.createElement('div');
            card.className = 'rec-card';
            card.innerHTML = `
                <div class="rec-icon">${rec.icon}</div>
                <div class="rec-content">
                    <div class="rec-title">
                        <span>${escapeHtml(rec.title)}</span>
                        <span class="rec-tag">${escapeHtml(rec.tag)}</span>
                    </div>
                    <div class="rec-desc">${escapeHtml(rec.desc)}</div>
                </div>
            `;
            card.addEventListener('click', () => {
                textarea.value = rec.prompt;
                syncEditorChrome();
                textarea.focus();
                showToast(`✓ Preset Loaded: ${rec.title}`);
            });
            container.appendChild(card);
        });
    }

    // ── Event Listeners ────────────────────────────────────────
    function setupEventListeners() {
        // Mode selector
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                setMode(btn.dataset.mode);
            });
        });

        // Quick Directives / Modifier Buttons
        document.querySelectorAll('.mod-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                const mod = btn.dataset.modifier;
                if (!mod) return;
                if (textarea.value.trim().length > 0) {
                    textarea.value = textarea.value.trim() + ' ' + mod.trim();
                } else {
                    textarea.value = mod.trim().replace(/^\+\s*/, '');
                }
                syncEditorChrome();
                textarea.focus();
                showToast(`✓ Added directive: ${btn.textContent.trim()}`);
            });
        });

        window.addEventListener('resize', () => {
            const activeBtn = document.querySelector('.mode-btn.active');
            if (activeBtn) updateModePill(activeBtn);
        });

        form.addEventListener('submit', e => { e.preventDefault(); executeRequest(); });

        textarea.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); executeRequest(); }
        });

        textarea.addEventListener('input', syncEditorChrome);
        textarea.addEventListener('scroll', () => { lineNumbers.scrollTop = textarea.scrollTop; });

        newChatBtn.addEventListener('click', startNewChat);
        clearHistoryBtn.addEventListener('click', clearAllHistory);
        copyBtn.addEventListener('click', copyOutputToClipboard);
        downloadBtn.addEventListener('click', downloadOutputAsFile);
        toggleViewBtn.addEventListener('click', toggleRawRenderedView);

        heroFocusBtn?.addEventListener('click', () => {
            textarea.focus();
            document.getElementById('section-cockpit').scrollIntoView({ behavior: 'smooth', block: 'start' });
            addRipple(heroFocusBtn);
        });

        heroScrollBtn?.addEventListener('click', () => {
            outputContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            addRipple(heroScrollBtn);
        });

        quickCards.forEach(card => {
            card.addEventListener('click', () => {
                const mode = card.dataset.quickMode;
                if (mode) {
                    setMode(mode);
                    textarea.focus();
                    document.getElementById('section-cockpit').scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                addRipple(card);
            });
        });

        setupTiltInteractions();
        addButtonRipples();
        animateFooterOnLoad();
    }

    // ── Mode Pill ──────────────────────────────────────────────
    function updateModePill(btn) {
        if (!modePill || !btn) return;
        modePill.style.left  = `${btn.offsetLeft}px`;
        modePill.style.width = `${btn.offsetWidth}px`;
    }

    // ── Editor Chrome ──────────────────────────────────────────
    function syncEditorChrome() {
        const value     = textarea.value || '';
        const lineCount = Math.max(10, value.split('\n').length);
        lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, i) =>
            `<div>${i + 1}</div>`).join('');
        if (charCount) {
            const n = value.length;
            charCount.textContent = `${n.toLocaleString()} ${n === 1 ? 'char' : 'chars'}`;
        }
    }

    // ── 3D Tilt Interactions ───────────────────────────────────
    function setupTiltInteractions() {
        const canHover    = window.matchMedia('(hover: hover)').matches;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!canHover || reduceMotion) return;

        // CRITICAL FIX: Restrict tilt to non-reading interactive cards (.quick-card, .hero-visual-floating).
        // NEVER tilt the editor form (#code-form) or the output panel (#output-container)
        // because pointermove 3D rotateX/rotateY moves the text down and away from the user's cursor while hovering/reading!
        const tiltElements = document.querySelectorAll('.quick-card, .hero-visual-floating');

        tiltElements.forEach(surface => {
            surface.addEventListener('pointermove', e => {
                const rect = surface.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width  - 0.5;
                const y = (e.clientY - rect.top)  / rect.height - 0.5;
                surface.style.transform =
                    `perspective(950px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-2px)`;
            });
            surface.addEventListener('pointerleave', () => {
                surface.style.transform = '';
            });
        });
    }

    // ── Ripple Effect ──────────────────────────────────────────
    function addRipple(el) {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position:absolute; border-radius:50%; transform:scale(0); pointer-events:none;
            width:60px; height:60px; margin-top:-30px; margin-left:-30px;
            top:50%; left:50%;
            background:rgba(255,255,255,0.18);
            animation:rippleAnim 0.6s linear;
        `;
        el.style.position = el.style.position || 'relative';
        el.style.overflow = el.style.overflow  || 'hidden';
        el.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    }

    // Inject ripple keyframes once
    if (!document.getElementById('ripple-style')) {
        const s = document.createElement('style');
        s.id = 'ripple-style';
        s.textContent = `@keyframes rippleAnim { to { transform:scale(4); opacity:0; } }`;
        document.head.appendChild(s);
    }

    function addButtonRipples() {
        const rippleBtns = document.querySelectorAll('.btn-submit, .btn-new-chat, .hero-action, .btn-lic-action');
        rippleBtns.forEach(btn => {
            btn.addEventListener('click', e => {
                const rect   = btn.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size   = Math.max(rect.width, rect.height);
                ripple.style.cssText = `
                    position:absolute; border-radius:50%; transform:scale(0); pointer-events:none;
                    width:${size}px; height:${size}px;
                    top:${e.clientY - rect.top  - size/2}px;
                    left:${e.clientX - rect.left - size/2}px;
                    background:rgba(255,255,255,0.14);
                    animation:rippleAnim 0.7s linear;
                `;
                btn.style.position = 'relative';
                btn.style.overflow = 'hidden';
                btn.appendChild(ripple);
                ripple.addEventListener('animationend', () => ripple.remove());
            });
        });
    }

    // ── Footer animate-in ──────────────────────────────────────
    function animateFooterOnLoad() {
        const footer = document.querySelector('.app-footer');
        if (!footer) return;
        footer.style.opacity = '0';
        footer.style.transform = 'translateY(10px)';
        footer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        requestAnimationFrame(() => {
            setTimeout(() => {
                footer.style.opacity = '1';
                footer.style.transform = 'translateY(0)';
            }, 300);
        });
    }

    // ── Server Connection ─────────────────────────────────────
    async function checkServerConnection() {
        if (!serverStatusEl) return;

        if (window.location.protocol === 'file:') {
            updateServerStatus('Local sandbox file', false);
            disableInterface();
            return;
        }

        const controller = new AbortController();
        const timeoutId  = setTimeout(() => controller.abort(), 6000);
        const apiUrl     = `${window.location.origin}/`;

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                cache: 'no-store',
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok || response.status < 500) {
                updateServerStatus('Server active', true);
                serverConnected = true;
                enableInterface();
            } else {
                updateServerStatus(`Server offline (${response.status})`, false);
                serverConnected = false;
                disableInterface();
            }
        } catch (err) {
            clearTimeout(timeoutId);
            updateServerStatus('Offline mode', false);
            serverConnected = false;
            disableInterface();
        }
    }

    function updateServerStatus(message, connected) {
        if (!serverStatusEl) return;
        serverStatusEl.textContent = message;
        serverStatusEl.classList.toggle('online',  connected);
        serverStatusEl.classList.toggle('offline', !connected);
    }

    function disableInterface() {
        submitBtn.disabled       = true;
        textarea.disabled        = false; // allow typing, just can't submit to API
        newChatBtn.disabled      = true;
        clearHistoryBtn.disabled = true;
        submitText.textContent   = 'Pulse Core Offline';
    }

    function enableInterface() {
        submitBtn.disabled       = false;
        textarea.disabled        = false;
        newChatBtn.disabled      = false;
        clearHistoryBtn.disabled = false;
        submitText.textContent   = 'Run Assistant';
        textarea.placeholder     = placeholders[currentMode];
    }

    // ── Execute AI Request ─────────────────────────────────────
    async function executeRequest() {
        const promptText = textarea.value.trim();
        if (!promptText) { showToast('Please enter a prompt first.'); return; }

        if (!serverConnected) {
            showToast('Flask backend appears offline. Double-click start.bat and refresh this tab.');
            return;
        }

        setLoadingState(true);

        const formData = new FormData();
        formData.append('prompt', promptText);
        formData.append('mode',   currentMode);

        const controller  = new AbortController();
        const reqTimeout  = setTimeout(() => controller.abort(), 60000);
        const apiUrl      = `${window.location.origin}/`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body:   formData,
                signal: controller.signal
            });

            const html = await response.text();

            if (!response.ok) {
                throw new Error(buildServerErrorMessage(response, html));
            }

            const parser        = new DOMParser();
            const doc           = parser.parseFromString(html, 'text/html');
            const responseDataEl = doc.getElementById('raw-response');

            if (responseDataEl) {
                rawResponseText = responseDataEl.textContent.trim();
                displayResponse(rawResponseText);
                saveToHistory(promptText, currentMode, rawResponseText);
            } else {
                throw new Error('Could not parse response from server template.');
            }
        } catch (error) {
            console.error('Request failed:', error);
            const detail = error.name === 'AbortError'
                ? 'The request timed out after 60 seconds. Check your Groq API key and internet connection.'
                : error.message;

            displayResponse(`### ⚠ Engine Error\nAn error occurred while communicating with the AI backend.\n\n**Details:** ${detail}`);
        } finally {
            clearTimeout(reqTimeout);
            setLoadingState(false);
        }
    }

    function buildServerErrorMessage(response, html) {
        const details   = extractErrorDetails(html);
        const statusTxt = response.statusText ? ` ${response.statusText}` : '';
        return `Backend returned HTTP ${response.status}${statusTxt}${details ? `: ${details}` : ''}`;
    }

    function extractErrorDetails(html) {
        if (!html) return '';
        const parser    = new DOMParser();
        const doc       = parser.parseFromString(html, 'text/html');
        const rawResp   = doc.getElementById('raw-response')?.textContent.trim();
        const preText   = doc.querySelector('pre')?.textContent.trim();
        const titleText = doc.querySelector('title')?.textContent.trim();
        const bodyText  = doc.body?.textContent.trim();
        const detail    = rawResp || preText || titleText || bodyText || html;
        return detail.replace(/\s+/g, ' ').slice(0, 500);
    }

    // ── Loading State ──────────────────────────────────────────
    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled            = true;
            submitSpinner.classList.remove('hidden');
            submitText.textContent        = 'Processing...';
            emptyState.classList.add('hidden');
            markdownOutput.classList.add('hidden');
            skeletonLoader.style.display  = 'flex';
            copyBtn.classList.add('hidden');
            downloadBtn.classList.add('hidden');
            toggleViewBtn.classList.add('hidden');
        } else {
            submitBtn.disabled          = !serverConnected;
            submitSpinner.classList.add('hidden');
            submitText.textContent      = serverConnected ? 'Run Assistant' : 'Pulse Core Offline';
            skeletonLoader.style.display = 'none';
        }
    }

    // ── Display Response ───────────────────────────────────────
    function displayResponse(text) {
        rawResponseText = text;
        emptyState.classList.add('hidden');
        skeletonLoader.style.display = 'none';
        markdownOutput.classList.remove('hidden');

        copyBtn.classList.remove('hidden');
        downloadBtn.classList.remove('hidden');
        toggleViewBtn.classList.remove('hidden');

        isShowingRaw = false;
        toggleViewBtn.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
            </svg> Show Raw`;

        renderMarkdown(text);
        outputContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderMarkdown(text) {
        if (window.marked) {
            window.marked.setOptions({
                highlight: (code, lang) => {
                    if (window.Prism && window.Prism.languages[lang]) {
                        return window.Prism.highlight(code, window.Prism.languages[lang], lang);
                    }
                    return code;
                },
                breaks: true,
                gfm:    true
            });
            markdownOutput.innerHTML = `<div class="markdown-body">${window.marked.parse(text)}</div>`;

            if (window.Prism) window.Prism.highlightAllUnder(markdownOutput);
            decorateCodeBlocks();
        } else {
            markdownOutput.innerHTML = `<pre><code>${escapeHtml(text)}</code></pre>`;
            decorateCodeBlocks();
        }
    }

    function decorateCodeBlocks() {
        markdownOutput.querySelectorAll('pre').forEach((pre, i) => {
            const code     = pre.querySelector('code');
            const langClass = Array.from(code?.classList || []).find(c => c.startsWith('language-'));
            const lang     = langClass ? langClass.replace('language-', '') : 'snippet';
            pre.dataset.codeTitle = `${lang} · block ${i + 1}`;
        });
    }

    // ── Toggle Raw/Rendered ────────────────────────────────────
    function toggleRawRenderedView() {
        if (isShowingRaw) {
            renderMarkdown(rawResponseText);
            toggleViewBtn.innerHTML = `
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
                </svg> Show Raw`;
            isShowingRaw = false;
        } else {
            markdownOutput.innerHTML = `<pre style="white-space:pre-wrap;font-family:var(--font-mono);color:var(--text-secondary);font-size:0.85rem;"><code>${escapeHtml(rawResponseText)}</code></pre>`;
            toggleViewBtn.innerHTML = `
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                </svg> Rendered`;
            isShowingRaw = true;
        }
    }

    // ── Copy ───────────────────────────────────────────────────
    async function copyOutputToClipboard() {
        if (!rawResponseText) return;
        try {
            await navigator.clipboard.writeText(rawResponseText);
            showToast('✓ Copied response payload.');
        } catch (err) {
            showToast('Copy failed: ' + err);
        }
    }

    // ── Download ───────────────────────────────────────────────
    function downloadOutputAsFile() {
        if (!rawResponseText) return;

        let ext = 'md';
        if (currentMode === 'generate') {
            const match = rawResponseText.match(/```(\w+)/);
            if (match && match[1]) {
                const map = { python:'py', py:'py', javascript:'js', js:'js', typescript:'ts', ts:'ts',
                              html:'html', css:'css', cpp:'cpp', c:'c', java:'java', go:'go', rust:'rs' };
                ext = map[match[1].toLowerCase()] || 'txt';
            }
        }

        const blob = new Blob([rawResponseText], { type: 'text/plain' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `peachpulse_${Date.now()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✓ Solution file downloaded.');
    }

    // ── New Chat ───────────────────────────────────────────────
    function startNewChat() {
        textarea.value = '';
        syncEditorChrome();
        rawResponseText       = '';
        markdownOutput.innerHTML = '';

        emptyState.classList.remove('hidden');
        markdownOutput.classList.add('hidden');
        copyBtn.classList.add('hidden');
        downloadBtn.classList.add('hidden');
        toggleViewBtn.classList.add('hidden');

        document.querySelectorAll('.history-item').forEach(el => el.classList.remove('active'));
        textarea.focus();
        showToast('✓ Cleared active workspace.');
    }

    // ── History ────────────────────────────────────────────────
    function loadHistoryFromStorage() {
        try {
            const data = localStorage.getItem('pulse_history') || localStorage.getItem('genius_history');
            chatHistory = data ? JSON.parse(data) : [];
        } catch { chatHistory = []; }
    }

    function saveToHistory(prompt, mode, response) {
        if (chatHistory.some(item => item.response === response)) return;

        chatHistory.unshift({
            id:        'hist_' + Date.now(),
            prompt,
            mode,
            response,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        if (chatHistory.length > 15) chatHistory.pop();
        localStorage.setItem('pulse_history', JSON.stringify(chatHistory));
        renderHistoryList();
    }

    function renderHistoryList() {
        historyList.innerHTML = '';

        if (chatHistory.length === 0) {
            historyList.innerHTML = '<li class="history-item" style="cursor:default;color:var(--text-muted);font-size:0.78rem;text-align:center;justify-content:center;">No runs cached</li>';
            return;
        }

        chatHistory.forEach(item => {
            const li      = document.createElement('li');
            li.className  = 'history-item';
            li.dataset.id = item.id;

            const title = item.prompt.length > 25 ? item.prompt.slice(0, 25) + '…' : item.prompt;

            li.innerHTML = `
                <span class="item-text" title="${escapeHtml(item.prompt)}">${escapeHtml(title)}</span>
                <button class="btn-delete-item" title="Delete session" aria-label="Delete history item">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            `;

            li.addEventListener('click', e => {
                if (e.target.closest('.btn-delete-item')) {
                    e.stopPropagation();
                    deleteHistoryItem(item.id);
                    return;
                }
                restoreHistoryItem(item);
            });

            historyList.appendChild(li);
        });
    }

    function restoreHistoryItem(item) {
        document.querySelectorAll('.history-item').forEach(el =>
            el.classList.toggle('active', el.dataset.id === item.id));

        textarea.value = item.prompt;
        syncEditorChrome();

        const matchBtn = Array.from(modeButtons).find(b => b.dataset.mode === item.mode);
        if (matchBtn) matchBtn.click();

        rawResponseText = item.response;
        displayResponse(rawResponseText);
        showToast('✓ Console run restored.');
    }

    function deleteHistoryItem(id) {
        chatHistory = chatHistory.filter(item => item.id !== id);
        localStorage.setItem('pulse_history', JSON.stringify(chatHistory));
        renderHistoryList();
        showToast('History record removed.');
    }

    function clearAllHistory() {
        if (confirm('Wipe dashboard history database?')) {
            chatHistory = [];
            localStorage.removeItem('pulse_history');
            localStorage.removeItem('genius_history');
            renderHistoryList();
            showToast('Cache wiped.');
        }
    }

    // ── Toast ──────────────────────────────────────────────────
    function showToast(message) {
        document.querySelector('.toast')?.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span class="toast-success-icon">●</span><span>${message}</span>`;
        document.body.appendChild(toast);

        toast.offsetHeight; // force browser layout reflow
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 350);
        }, 3000);
    }

    // ── Scroll Animation Observer & Sidebar Nav Highlight ─────────
    function setupScrollAnimationObserver() {
        const sections = document.querySelectorAll('.workspace-section');
        const navItems = document.querySelectorAll('.nav-item');

        const observerOptions = {
            root: null,
            rootMargin: '-25% 0px -35% 0px',
            threshold: 0.08
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const sectionId = entry.target.id;
                    const navTarget = sectionId.replace('section-', '');
                    
                    navItems.forEach(item => {
                        item.classList.toggle('active', item.dataset.nav === navTarget);
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            // First run, triggers visible class if already scrolled
            if (section.getBoundingClientRect().top < window.innerHeight * 0.85) {
                section.classList.add('visible');
            }
            observer.observe(section);
        });

        // Smooth scroll sidebar buttons
        navItems.forEach(nav => {
            nav.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = nav.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    navItems.forEach(item => item.classList.remove('active'));
                    nav.classList.add('active');
                }
            });
        });
    }

    // ── Diagnostics Telemetry Simulation ──────────────────────
    function startTelemetrySimulation() {
        const bars = document.querySelectorAll('.diag-bar');
        if (bars.length === 0) return;

        setInterval(() => {
            bars.forEach(bar => {
                // Change height randomly slightly to simulate live feed
                const currentHeight = parseInt(bar.style.height) || 50;
                const change = Math.floor(Math.random() * 21) - 10; // -10% to +10%
                let newHeight = Math.max(20, Math.min(100, currentHeight + change));
                bar.style.height = `${newHeight}%`;
            });
        }, 3000);
    }

    // ── Terminal CLI Typing Simulation ─────────────────────────
    function setupTerminalSimulation() {
        const termBody = document.getElementById('terminal-body');
        if (!termBody) return;

        const mockCommands = [
            { cmd: "check --model", out: "[engine] Active Llama-3-70B pipeline is operational. 28.6GB VRAM cached." },
            { cmd: "tokens --stats", out: "[engine] Token total: 1,845k. Today's capacity: 99.85% free." },
            { cmd: "ping groq", out: "[network] connected to groq-api-endpoint. RTT: 34ms." },
            { cmd: "sysinfo", out: "[system] Platform: Flask/Python 3.11. Core temperature: 38C." }
        ];

        let index = 0;

        // Interactive: click terminal to execute custom mock command
        termBody.addEventListener('click', () => {
            const data = mockCommands[index];
            index = (index + 1) % mockCommands.length;

            // Remove last prompt blinking line
            const lines = termBody.querySelectorAll('.term-line');
            const lastLine = lines[lines.length - 1];
            lastLine.remove();

            // Append mock input line
            const inputLine = document.createElement('div');
            inputLine.className = 'term-line';
            inputLine.innerHTML = `
                <span class="term-prompt">guest@peach_pulse:~$</span>
                <span class="term-input">${data.cmd}</span>
            `;
            termBody.appendChild(inputLine);

            // Append output line
            setTimeout(() => {
                const outLine = document.createElement('div');
                outLine.className = 'term-line';
                outLine.innerHTML = `<span class="term-out">${data.out}</span>`;
                termBody.appendChild(outLine);

                // Re-append blink prompt line
                const blinkLine = document.createElement('div');
                blinkLine.className = 'term-line';
                blinkLine.innerHTML = `
                    <span class="term-prompt">guest@peach_pulse:~$</span>
                    <span class="term-input"><span class="blink-cursor">_</span></span>
                `;
                termBody.appendChild(blinkLine);
                termBody.scrollTop = termBody.scrollHeight;
            }, 300);
        });

        // Add CSS keyframe style for cursor blinking
        if (!document.getElementById('cursor-style')) {
            const style = document.createElement('style');
            style.id = 'cursor-style';
            style.textContent = `
                .blink-cursor { animation: blink 1s step-end infinite; }
                @keyframes blink { 50% { opacity: 0; } }
            `;
            document.head.appendChild(style);
        }
    }

    // ── Helpers ────────────────────────────────────────────────
    function escapeHtml(unsafe) {
        return (unsafe || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
