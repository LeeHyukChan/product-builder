// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const themeToggle = document.querySelector('#theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.textContent = '라이트 모드';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = 'light';
            if (!document.body.hasAttribute('data-theme')) {
                document.body.setAttribute('data-theme', 'dark');
                themeToggle.textContent = '라이트 모드';
                theme = 'dark';
            } else {
                document.body.removeAttribute('data-theme');
                themeToggle.textContent = '다크 모드';
                theme = 'light';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // Tab Switching Logic
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            
            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update content
            document.querySelectorAll('#content-area > div').forEach(div => {
                div.classList.remove('active');
            });
            document.getElementById(target).classList.add('active');
        });
    });
});

class UserInputForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.2rem;
                    color: var(--text-color);
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                label {
                    font-weight: 600;
                    font-size: 0.95rem;
                }
                input, select {
                    padding: 0.9rem;
                    border-radius: 10px;
                    border: 1px solid var(--input-border);
                    background-color: var(--bg-color);
                    color: var(--text-color);
                    font-size: 1rem;
                    transition: border-color 0.3s;
                }
                input:focus, select:focus {
                    outline: none;
                    border-color: var(--accent-color);
                }
                button {
                    padding: 1.1rem;
                    border-radius: 12px;
                    border: none;
                    background-color: var(--accent-color);
                    color: white;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 1.1rem;
                    margin-top: 1rem;
                    transition: all 0.3s;
                    box-shadow: 0 4px 6px rgba(108, 92, 231, 0.2);
                }
                button:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                }
            </style>
            <h2 style="margin-top: 0; color: var(--accent-color);">🥗 맞춤 식단 추천</h2>
            <p style="margin-bottom: 1.5rem; opacity: 0.8;">신체 정보를 입력하면 최적의 칼로리와 식단을 계산해 드립니다.</p>
            <form id="user-info-form">
                <div class="input-group">
                    <label for="age">나이 (세)</label>
                    <input type="number" id="age" name="age" required placeholder="예: 25">
                </div>
                
                <div class="input-group">
                    <label for="weight">몸무게 (kg)</label>
                    <input type="number" id="weight" name="weight" required placeholder="예: 70">
                </div>
                
                <div class="input-group">
                    <label for="height">키 (cm)</label>
                    <input type="number" id="height" name="height" required placeholder="예: 175">
                </div>
                
                <div class="input-group">
                    <label for="activity-level">활동량</label>
                    <select id="activity-level" name="activity-level">
                        <option value="1.2">비활동적 (운동 거의 없음)</option>
                        <option value="1.375">가벼운 활동 (주 1-3일 가벼운 운동)</option>
                        <option value="1.55">적당한 활동 (주 3-5일 중강도 운동)</option>
                        <option value="1.725">매우 활동적 (주 6-7일 고강도 운동)</option>
                        <option value="1.9">매우 활발함 (선수급 운동 등)</option>
                    </select>
                </div>
                
                <button type="submit">식단 생성하기</button>
            </form>
        `;

        this.shadowRoot.querySelector('#user-info-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const age = this.shadowRoot.querySelector('#age').value;
            const weight = this.shadowRoot.querySelector('#weight').value;
            const height = this.shadowRoot.querySelector('#height').value;
            const activityLevel = this.shadowRoot.querySelector('#activity-level').value;

            const calories = this.calculateCalories(age, weight, height, activityLevel);
            this.generateDietPlan(calories);
        });
    }

    calculateCalories(age, weight, height, activityLevel) {
        const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        return bmr * activityLevel;
    }

    generateDietPlan(calories) {
        const dietPlanElement = document.querySelector('#diet-plan');
        if (!dietPlanElement) return;
        
        dietPlanElement.innerHTML = `
            <h2 style="margin-top: 0; color: var(--accent-color);">당신의 하루 맞춤 식단</h2>
            <div style="background: var(--bg-color); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
                <span style="font-size: 0.9rem; opacity: 0.7;">일일 권장 칼로리</span>
                <div style="font-size: 2rem; font-weight: 800; color: var(--accent-color);">${Math.round(calories)} <span style="font-size: 1rem;">kcal</span></div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                <section style="background: var(--card-bg-color); border: 1px solid var(--input-border); padding: 1.2rem; border-radius: 12px;">
                    <h3 style="margin-top: 0; font-size: 1.1rem;">🍳 아침 (25%)</h3>
                    <ul style="padding-left: 1.2rem; font-size: 0.95rem; opacity: 0.9;">
                        <li>스크램블 에그</li>
                        <li>통밀 토스트</li>
                        <li>방울토마토</li>
                    </ul>
                </section>
                
                <section style="background: var(--card-bg-color); border: 1px solid var(--input-border); padding: 1.2rem; border-radius: 12px;">
                    <h3 style="margin-top: 0; font-size: 1.1rem;">🥗 점심 (35%)</h3>
                    <ul style="padding-left: 1.2rem; font-size: 0.95rem; opacity: 0.9;">
                        <li>구운 닭가슴살 샐러드</li>
                        <li>현미밥 반 공기</li>
                        <li>견과류 드레싱</li>
                    </ul>
                </section>
                
                <section style="background: var(--card-bg-color); border: 1px solid var(--input-border); padding: 1.2rem; border-radius: 12px;">
                    <h3 style="margin-top: 0; font-size: 1.1rem;">🍣 저녁 (25%)</h3>
                    <ul style="padding-left: 1.2rem; font-size: 0.95rem; opacity: 0.9;">
                        <li>연어 스테이크</li>
                        <li>데친 브로콜리</li>
                        <li>퀴노아 샐러드</li>
                    </ul>
                </section>
                
                <section style="background: var(--card-bg-color); border: 1px solid var(--input-border); padding: 1.2rem; border-radius: 12px;">
                    <h3 style="margin-top: 0; font-size: 1.1rem;">🍎 간식 (15%)</h3>
                    <ul style="padding-left: 1.2rem; font-size: 0.95rem; opacity: 0.9;">
                        <li>그릭 요거트</li>
                        <li>블루베리</li>
                        <li>아몬드 10알</li>
                    </ul>
                </section>
            </div>
            
            <button onclick="window.print()" style="margin-top: 2.5rem; width: 100%; padding: 1rem; border: 2px solid var(--accent-color); background: transparent; color: var(--accent-color); border-radius: 12px; cursor: pointer; font-weight: bold; transition: all 0.3s;">
                식단 결과 저장하기 (PDF)
            </button>
        `;
        
        dietPlanElement.scrollIntoView({ behavior: 'smooth' });
    }
}

class PersonalColorAnalyzer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.diagnosisData = {
            'spring': {
                name: '봄 웜톤 (Spring Warm)',
                description: '생기 있고 밝은 에너지가 느껴지는 따뜻한 톤입니다.',
                colors: ['#FF7F50', '#FFD700', '#98FB98', '#FF69B4'],
                makeup: ['코랄 립스틱', '피치 블러셔', '웜 브라운 아이섀도우'],
                accent: '#FF7F50'
            },
            'summer': {
                name: '여름 쿨톤 (Summer Cool)',
                description: '청량하고 깨끗하며 부드러운 느낌의 시원한 톤입니다.',
                colors: ['#87CEEB', '#DDA0DD', '#F08080', '#E6E6FA'],
                makeup: ['딸기우유 립스틱', '라벤더 블러셔', '로즈 그레이 섀도우'],
                accent: '#87CEEB'
            },
            'autumn': {
                name: '가을 웜톤 (Autumn Warm)',
                description: '지적이고 차분하며 그윽한 분위기의 따뜻한 톤입니다.',
                colors: ['#8B4513', '#DAA520', '#556B2F', '#CD5C5C'],
                makeup: ['말린 장미 립스틱', '테라코타 블러셔', '딥 브라운 섀도우'],
                accent: '#8B4513'
            },
            'winter': {
                name: '겨울 쿨톤 (Winter Cool)',
                description: '선명하고 강렬하며 도시적인 느낌의 시원한 톤입니다.',
                colors: ['#FF00FF', '#0000FF', '#800080', '#000000'],
                makeup: ['버건디 립스틱', '푸시아 핑크 블러셔', '그레이시 퍼플 섀도우'],
                accent: '#800080'
            }
        };
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                .container { display: flex; flex-direction: column; gap: 1.5rem; }
                h2 { margin-top: 0; color: var(--accent-color); }
                .upload-area {
                    border: 2px dashed var(--input-border);
                    padding: 3rem 2rem;
                    border-radius: 15px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    background: var(--bg-color);
                }
                .upload-area:hover { border-color: var(--accent-color); background: rgba(108, 92, 231, 0.05); }
                #image-preview {
                    max-width: 100%;
                    max-height: 400px;
                    border-radius: 12px;
                    display: none;
                    margin: 0 auto;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                .analyze-btn {
                    padding: 1.1rem;
                    border-radius: 12px;
                    border: none;
                    background-color: var(--accent-color);
                    color: white;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 1.1rem;
                    transition: all 0.3s;
                    display: none;
                }
                .result-card {
                    margin-top: 2rem;
                    padding: 2rem;
                    border-radius: 15px;
                    background: var(--bg-color);
                    display: none;
                    animation: slideUp 0.5s ease-out;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .color-palette {
                    display: flex;
                    gap: 0.8rem;
                    margin: 1.5rem 0;
                }
                .color-swatch {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                .makeup-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .makeup-item {
                    background: var(--card-bg-color);
                    padding: 1rem;
                    border-radius: 10px;
                    text-align: center;
                    font-size: 0.9rem;
                    font-weight: 600;
                    border: 1px solid var(--input-border);
                }
                input[type="file"] { display: none; }
            </style>
            <div class="container">
                <h2>🎨 퍼스널 컬러 진단</h2>
                <p style="opacity: 0.8;">얼굴 사진을 업로드하면 피부톤을 분석하여 가장 잘 어울리는 컬러를 찾아드립니다.</p>
                
                <div class="upload-area" id="drop-zone">
                    <p id="upload-text">📸 사진을 클릭하여 업로드하거나 드래그하세요</p>
                    <img id="image-preview">
                    <input type="file" id="file-input" accept="image/*">
                </div>

                <button class="analyze-btn" id="analyze-btn">진단 시작하기</button>

                <div class="result-card" id="result-card">
                    <div id="result-content"></div>
                </div>
            </div>
            <canvas id="analysis-canvas" style="display: none;"></canvas>
        `;

        const dropZone = this.shadowRoot.querySelector('#drop-zone');
        const fileInput = this.shadowRoot.querySelector('#file-input');
        const preview = this.shadowRoot.querySelector('#image-preview');
        const uploadText = this.shadowRoot.querySelector('#upload-text');
        const analyzeBtn = this.shadowRoot.querySelector('#analyze-btn');

        dropZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) this.handleImage(file);
        });

        analyzeBtn.addEventListener('click', () => this.analyzeColor());
    }

    handleImage(file) {
        const reader = new FileReader();
        const preview = this.shadowRoot.querySelector('#image-preview');
        const uploadText = this.shadowRoot.querySelector('#upload-text');
        const analyzeBtn = this.shadowRoot.querySelector('#analyze-btn');

        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
            uploadText.style.display = 'none';
            analyzeBtn.style.display = 'block';
            this.shadowRoot.querySelector('#result-card').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

    analyzeColor() {
        const img = this.shadowRoot.querySelector('#image-preview');
        const canvas = this.shadowRoot.querySelector('#analysis-canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        // Sample pixels from the center (face area)
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const size = Math.min(canvas.width, canvas.height) * 0.2;
        const imageData = ctx.getImageData(centerX - size/2, centerY - size/2, size, size);
        const data = imageData.data;

        let r = 0, g = 0, b = 0;
        for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i+1];
            b += data[i+2];
        }
        r /= (data.length / 4);
        g /= (data.length / 4);
        b /= (data.length / 4);

        const season = this.classifySeason(r, g, b);
        this.showResult(season);
    }

    classifySeason(r, g, b) {
        // Simplified classification logic
        const r_norm = r / 255;
        const g_norm = g / 255;
        const b_norm = b / 255;

        const max = Math.max(r_norm, g_norm, b_norm);
        const min = Math.min(r_norm, g_norm, b_norm);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r_norm: h = (g_norm - b_norm) / d + (g_norm < b_norm ? 6 : 0); break;
                case g_norm: h = (b_norm - r_norm) / d + 2; break;
                case b_norm: h = (r_norm - g_norm) / d + 4; break;
            }
            h /= 6;
        }

        // Hue logic: 0-0.1 (Warm/Red), 0.1-0.2 (Warm/Yellow), 0.8-1.0 (Cool/Pinkish)
        const isWarm = (h < 0.15 || h > 0.95) ? (r > b * 1.2) : (h < 0.5); // Very simple heuristic
        const isLight = l > 0.6;
        const isClear = s > 0.4;

        if (isWarm) {
            return isLight ? 'spring' : 'autumn';
        } else {
            return isLight ? 'summer' : 'winter';
        }
    }

    showResult(seasonId) {
        const resultCard = this.shadowRoot.querySelector('#result-card');
        const resultContent = this.shadowRoot.querySelector('#result-content');
        const data = this.diagnosisData[seasonId];

        resultContent.innerHTML = `
            <div style="text-align: center;">
                <span style="display: inline-block; padding: 0.5rem 1.5rem; background: ${data.accent}; color: white; border-radius: 20px; font-weight: bold; margin-bottom: 1rem;">진단 결과</span>
                <h3 style="font-size: 2rem; margin: 0 0 1rem 0;">${data.name}</h3>
                <p style="font-size: 1.1rem; opacity: 0.9; max-width: 500px; margin: 0 auto 2rem auto;">${data.description}</p>
            </div>

            <div style="margin-top: 2rem;">
                <h4 style="margin-bottom: 1rem;">✨ 당신에게 베스트인 컬러 팔레트</h4>
                <div class="color-palette">
                    ${data.colors.map(color => `<div class="color-swatch" style="background: ${color}"></div>`).join('')}
                </div>
            </div>

            <div style="margin-top: 2rem;">
                <h4 style="margin-bottom: 1rem;">💄 추천 화장품 색상 및 제품</h4>
                <div class="makeup-list">
                    ${data.makeup.map(item => `<div class="makeup-item">${item}</div>`).join('')}
                </div>
            </div>

            <button onclick="window.location.reload()" style="margin-top: 2.5rem; width: 100%; padding: 1rem; border: none; background: var(--accent-color); color: white; border-radius: 12px; cursor: pointer; font-weight: bold; transition: all 0.3s;">
                다시 진단하기
            </button>
        `;

        resultCard.style.display = 'block';
        resultCard.scrollIntoView({ behavior: 'smooth' });
    }
}

class PartnershipForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                h2 { margin-top: 0; color: var(--accent-color); font-size: 1.8rem; margin-bottom: 1rem; }
                p { margin-bottom: 2rem; opacity: 0.8; }
                form { display: flex; flex-direction: column; gap: 1.2rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                label { font-weight: 600; font-size: 0.95rem; }
                input, textarea {
                    padding: 0.9rem;
                    border-radius: 10px;
                    border: 1px solid var(--input-border);
                    background-color: var(--bg-color);
                    color: var(--text-color);
                    font-size: 1rem;
                    font-family: inherit;
                    transition: border-color 0.3s;
                }
                input:focus, textarea:focus { outline: none; border-color: var(--accent-color); }
                textarea { resize: vertical; min-height: 120px; }
                button {
                    padding: 1.2rem;
                    border-radius: 12px;
                    border: none;
                    background-color: var(--accent-color);
                    color: white;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 1.1rem;
                    margin-top: 1rem;
                    transition: all 0.3s;
                }
                button:hover { opacity: 0.9; transform: translateY(-2px); }
            </style>
            <h2>🤝 서비스 제휴 문의</h2>
            <p>비즈니스 파트너십 제안이나 궁금하신 점을 남겨주세요.</p>
            <form action="https://formspree.io/f/xjgpvzog" method="POST">
                <div class="form-group">
                    <label for="name">성함 또는 기업명</label>
                    <input type="text" id="name" name="name" required placeholder="예: 홍길동 (주식회사 뷰티)">
                </div>
                
                <div class="form-group">
                    <label for="email">회신 받을 이메일</label>
                    <input type="email" id="email" name="_replyto" required placeholder="contact@example.com">
                </div>
                
                <div class="form-group">
                    <label for="message">문의 및 제안 내용</label>
                    <textarea id="message" name="message" required placeholder="내용을 상세히 적어주세요."></textarea>
                </div>
                
                <button type="submit">제휴 제안 보내기</button>
            </form>
        `;
    }
}

class DisqusComments extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.loadDisqus();
    }

    render() {
        this.innerHTML = `
            <style>
                disqus-comments {
                    display: block;
                    background: var(--card-bg-color);
                    padding: 2.5rem;
                    border-radius: 20px;
                    border: 1px solid var(--input-border);
                    margin-top: 2rem;
                }
            </style>
            <h2 style="color: var(--accent-color); margin-top: 0; margin-bottom: 1.5rem;">💬 댓글 피드백</h2>
            <div id="disqus_thread"></div>
        `;
    }

    loadDisqus() {
        if (window.DISQUS) return;
        const d = document, s = d.createElement('script');
        s.src = 'https://productbuilder-bjcdbvc0zk.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    }
}

// Register components
customElements.define('user-input-form', UserInputForm);
customElements.define('personal-color-analyzer', PersonalColorAnalyzer);
customElements.define('partnership-form', PartnershipForm);
customElements.define('disqus-comments', DisqusComments);
