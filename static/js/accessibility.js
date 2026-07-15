(function() {
    const translations = {
        'nl': {
            title: 'Toegankelijkheid',
            tts: '🔊 Voorlezen',
            grayscale: '🔘 Grijstinten',
            highContrast: '🌓 Hoog contrast',
            negative: '🔄 Negatief',
            bright: '☀️ Helder',
            sepia: '📜 Sepia',
            lowSat: '🔅 Lage verzadiging',
            highSat: '🔆 Hoge verzadiging',
            night: '🌙 Nachtstand',
            textInc: '➕ Tekst groter',
            textDec: '➖ Tekst kleiner',
            dyslexic: '📖 Dyslexie font',
            bigCursor: '🖱️ Grote cursor',
            links: '🔗 Links markeren',
            headers: '📑 Titels markeren',
            spacing: '↔️ Tekstafstand',
            lineHeight: '↕️ Regelafstand',
            guide: '📏 Leesliniaal',
            mask: '🎭 Leesmasker',
            stopAnim: '🚫 Geen animatie',
            readable: '🖋️ Leesbaar font',
            alignLeft: '⬅️ Links uitlijnen',
            alignCenter: '↔️ Centreren',
            alignRight: '➡️ Rechts uitlijnen',
            alignJustify: '↔️ Uitvullen',
            reset: '🔄 Reset alles'
        },
        'en': {
            title: 'Accessibility',
            tts: '🔊 Read Aloud',
            grayscale: '🔘 Grayscale',
            highContrast: '🌓 High Contrast',
            negative: '🔄 Negative',
            bright: '☀️ Brightness',
            sepia: '📜 Sepia',
            lowSat: '🔅 Low Saturation',
            highSat: '🔆 High Saturation',
            night: '🌙 Night Mode',
            textInc: '➕ Increase Text',
            textDec: '➖ Decrease Text',
            dyslexic: '📖 Dyslexic Font',
            bigCursor: '🖱️ Big Cursor',
            links: '🔗 Highlight Links',
            headers: '📑 Highlight Headers',
            spacing: '↔️ Text Spacing',
            lineHeight: '↕️ Line Height',
            guide: '📏 Reading Guide',
            mask: '🎭 Reading Mask',
            stopAnim: '🚫 Stop Animations',
            readable: '🖋️ Readable Font',
            alignLeft: '⬅️ Align Left',
            alignCenter: '↔️ Align Center',
            alignRight: '➡️ Align Right',
            alignJustify: '↔️ Justify',
            reset: '🔄 Reset All'
        }
    };

    const langCode = (document.documentElement.lang || 'nl').split('-')[0].toLowerCase();
    const t = translations[langCode] || translations['nl'];

    const widget = document.createElement('div');
    widget.className = 'accessibility-widget';
    widget.innerHTML = `
        <div class="accessibility-btn" title="${t.title}">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M15,9V14.5L13,14.2V21H11V14.2L9,14.5V9C8.45,9 8,8.55 8,8V7H16V8C16,8.55 15.55,9 15,9Z"/>
                <path d="M4,9C4,9 8,7 12,7C16,7 20,9 20,9" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>
        <div class="accessibility-panel">
            <div class="accessibility-header">
                <h3>${t.title}</h3>
                <span class="close-acc accessibility-close">&times;</span>
            </div>
            <div class="accessibility-content">
                <div class="acc-option" data-action="tts"><span>${t.tts}</span></div>
                <div class="acc-option" data-action="grayscale"><span>${t.grayscale}</span></div>
                <div class="acc-option" data-action="high-contrast"><span>${t.highContrast}</span></div>
                <div class="acc-option" data-action="negative"><span>${t.negative}</span></div>
                <div class="acc-option" data-action="bright"><span>${t.bright}</span></div>
                <div class="acc-option" data-action="sepia"><span>${t.sepia}</span></div>
                <div class="acc-option" data-action="low-sat"><span>${t.lowSat}</span></div>
                <div class="acc-option" data-action="high-sat"><span>${t.highSat}</span></div>
                <div class="acc-option" data-action="night"><span>${t.night}</span></div>
                <div class="acc-option" data-action="text-inc"><span>${t.textInc}</span></div>
                <div class="acc-option" data-action="text-dec"><span>${t.textDec}</span></div>
                <div class="acc-option" data-action="dyslexic"><span>${t.dyslexic}</span></div>
                <div class="acc-option" data-action="big-cursor"><span>${t.bigCursor}</span></div>
                <div class="acc-option" data-action="links"><span>${t.links}</span></div>
                <div class="acc-option" data-action="headers"><span>${t.headers}</span></div>
                <div class="acc-option" data-action="spacing"><span>${t.spacing}</span></div>
                <div class="acc-option" data-action="line-height"><span>${t.lineHeight}</span></div>
                <div class="acc-option" data-action="guide"><span>${t.guide}</span></div>
                <div class="acc-option" data-action="mask"><span>${t.mask}</span></div>
                <div class="acc-option" data-action="stop-anim"><span>${t.stopAnim}</span></div>
                <div class="acc-option" data-action="readable"><span>${t.readable}</span></div>
                <div class="acc-option" data-action="align-left"><span>${t.alignLeft}</span></div>
                <div class="acc-option" data-action="align-center"><span>${t.alignCenter}</span></div>
                <div class="acc-option" data-action="align-right"><span>${t.alignRight}</span></div>
                <div class="acc-option" data-action="align-justify"><span>${t.alignJustify}</span></div>
                <div class="acc-option" data-action="reset"><span>${t.reset}</span></div>
            </div>
        </div>
        <div class="acc-reading-guide" id="acc-guide"></div>
        <div class="acc-reading-mask" id="acc-mask"></div>
        <div id="acc-night-overlay"></div>
    `;
    (document.getElementById('wrapper') || document.body).appendChild(widget);

    const btn = widget.querySelector('.accessibility-btn');
    const panel = widget.querySelector('.accessibility-panel');
    const closeBtn = widget.querySelector('.close-acc');
    const guide = widget.querySelector('#acc-guide');
    const mask = widget.querySelector('#acc-mask');
    const nightOverlay = widget.querySelector('#acc-night-overlay');

    btn.onclick = () => panel.classList.toggle('active');
    closeBtn.onclick = () => panel.classList.remove('active');

    let fontSize = 100;
    let isReading = false;
    const synth = window.speechSynthesis;

    document.addEventListener('mousemove', (e) => {
        if (guide.style.display === 'block') {
            guide.style.top = e.clientY + 'px';
        }
        if (mask.style.display === 'block') {
            mask.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, transparent 150px, rgba(0,0,0,0.7) 155px)`;
        }
    });

    widget.querySelectorAll('.acc-option').forEach(opt => {
        opt.onclick = function() {
            const action = this.dataset.action;
            const body = document.body;
            const html = document.documentElement;

            switch(action) {
                case 'tts':
                    if (isReading) {
                        synth.cancel();
                        isReading = false;
                        this.classList.remove('active');
                    } else {
                        const utterance = new SpeechSynthesisUtterance(document.body.innerText);
                        utterance.lang = langCode === 'en' ? 'en-US' : 'nl-NL';
                        utterance.onend = () => { isReading = false; this.classList.remove('active'); };
                        synth.speak(utterance);
                        isReading = true;
                        this.classList.add('active');
                    }
                    break;
                case 'grayscale': html.classList.toggle('acc-grayscale'); this.classList.toggle('active'); break;
                case 'high-contrast': html.classList.toggle('acc-high-contrast'); this.classList.toggle('active'); break;
                case 'negative': html.classList.toggle('acc-negative'); this.classList.toggle('active'); break;
                case 'bright': html.classList.toggle('acc-bright'); this.classList.toggle('active'); break;
                case 'sepia': html.classList.toggle('acc-sepia'); this.classList.toggle('active'); break;
                case 'low-sat': html.classList.toggle('acc-low-sat'); this.classList.toggle('active'); break;
                case 'high-sat': html.classList.toggle('acc-high-sat'); this.classList.toggle('active'); break;
                case 'night': 
                    nightOverlay.classList.toggle('acc-night-mode'); 
                    this.classList.toggle('active'); 
                    break;
                case 'text-inc': fontSize += 10; body.style.fontSize = fontSize + '%'; break;
                case 'text-dec': fontSize -= 10; body.style.fontSize = fontSize + '%'; break;
                case 'dyslexic': body.classList.toggle('acc-dyslexic'); this.classList.toggle('active'); break;
                case 'big-cursor': html.classList.toggle('acc-big-cursor'); this.classList.toggle('active'); break;
                case 'links': body.classList.toggle('acc-highlight-links'); this.classList.toggle('active'); break;
                case 'headers': body.classList.toggle('acc-highlight-headers'); this.classList.toggle('active'); break;
                case 'spacing': body.classList.toggle('acc-text-spacing'); this.classList.toggle('active'); break;
                case 'line-height': body.classList.toggle('acc-line-height'); this.classList.toggle('active'); break;
                case 'guide': 
                    guide.style.display = (guide.style.display === 'block' ? 'none' : 'block'); 
                    this.classList.toggle('active');
                    break;
                case 'mask': 
                    mask.style.display = (mask.style.display === 'block' ? 'none' : 'block'); 
                    this.classList.toggle('active');
                    break;
                case 'stop-anim': body.classList.toggle('acc-stop-animations'); this.classList.toggle('active'); break;
                case 'readable': body.style.fontFamily = (body.style.fontFamily === 'Arial, sans-serif' ? '' : 'Arial, sans-serif'); this.classList.toggle('active'); break;
                case 'align-left': body.style.textAlign = 'left'; break;
                case 'align-center': body.style.textAlign = 'center'; break;
                case 'align-right': body.style.textAlign = 'right'; break;
                case 'align-justify': body.style.textAlign = 'justify'; break;
                case 'reset':
                    body.className = body.className.split(' ').filter(c => !c.startsWith('acc-')).join(' ');
                    html.className = html.className.split(' ').filter(c => !c.startsWith('acc-')).join(' ');
                    body.style.fontSize = '';
                    body.style.fontFamily = '';
                    body.style.textAlign = '';
                    fontSize = 100;
                    guide.style.display = 'none';
                    mask.style.display = 'none';
                    nightOverlay.classList.remove('acc-night-mode');
                    synth.cancel();
                    isReading = false;
                    widget.querySelectorAll('.acc-option').forEach(o => o.classList.remove('active'));
                    break;
            }
        };
    });
})();
