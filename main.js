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
                    gap: 1rem;
                    color: var(--text-color);
                }
                label {
                    font-weight: bold;
                    margin-bottom: 0.2rem;
                }
                input, select {
                    padding: 0.8rem;
                    border-radius: 8px;
                    border: 1px solid var(--input-border);
                    background-color: var(--card-bg-color);
                    color: var(--text-color);
                    font-size: 1rem;
                }
                button {
                    padding: 1rem;
                    border-radius: 8px;
                    border: none;
                    background-color: var(--accent-color);
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 1rem;
                    margin-top: 1rem;
                    transition: opacity 0.3s;
                }
                button:hover {
                    opacity: 0.9;
                }
            </style>
            <form id="user-info-form">
                <label for="age">나이:</label>
                <input type="number" id="age" name="age" required placeholder="예: 25">
                
                <label for="weight">몸무게 (kg):</label>
                <input type="number" id="weight" name="weight" required placeholder="예: 70">
                
                <label for="height">키 (cm):</label>
                <input type="number" id="height" name="height" required placeholder="예: 175">
                
                <label for="activity-level">활동량:</label>
                <select id="activity-level" name="activity-level">
                    <option value="1.2">비활동적 (운동 거의 없음)</option>
                    <option value="1.375">가벼운 활동 (주 1-3일 가벼운 운동)</option>
                    <option value="1.55">적당한 활동 (주 3-5일 중강도 운동)</option>
                    <option value="1.725">매우 활동적 (주 6-7일 고강도 운동)</option>
                    <option value="1.9">매우 활발함 (선수급 운동 또는 신체 활동이 많은 직업)</option>
                </select>
                
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
            <h2 style="margin-top: 0;">당신의 하루 맞춤 식단</h2>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">
                <strong>일일 권장 칼로리:</strong> ${Math.round(calories)} kcal
            </p>
            
            <div style="display: grid; gap: 1.5rem;">
                <section>
                    <h3 style="color: var(--accent-color);">🍳 아침 (25%)</h3>
                    <ul style="padding-left: 1.2rem;">
                        <li>스크램블 에그와 시금치, 통밀 토스트 한 조각</li>
                        <li>방울토마토 5~6개</li>
                    </ul>
                </section>
                
                <section>
                    <h3 style="color: var(--accent-color);">🥗 점심 (35%)</h3>
                    <ul style="padding-left: 1.2rem;">
                        <li>구운 닭가슴살  salad와 다양한 채소</li>
                        <li>올리브 오일 드레싱과 현미밥 반 공기</li>
                    </ul>
                </section>
                
                <section>
                    <h3 style="color: var(--accent-color);">🍣 저녁 (25%)</h3>
                    <ul style="padding-left: 1.2rem;">
                        <li>구운 연어 스테이크와 퀴노아</li>
                        <li>데친 브로콜리와 아스파라거스</li>
                    </ul>
                </section>
                
                <section>
                    <h3 style="color: var(--accent-color);">🍎 간식 (15%)</h3>
                    <ul style="padding-left: 1.2rem;">
                        <li>그릭 요거트와 블루베리 한 줌</li>
                        <li>아몬드 10알</li>
                    </ul>
                </section>
            </div>
            
            <button onclick="window.print()" style="margin-top: 2rem; padding: 0.8rem 1.5rem; border: 1px solid var(--accent-color); background: transparent; color: var(--accent-color); border-radius: 8px; cursor: pointer; font-weight: bold;">
                식단 인쇄/저장하기
            </button>
        `;
        
        dietPlanElement.scrollIntoView({ behavior: 'smooth' });
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
                :host {
                    display: block;
                    background: var(--card-bg-color);
                    color: var(--text-color);
                }
                h2 {
                    margin-top: 0;
                    color: var(--accent-color);
                    font-size: 1.8rem;
                    margin-bottom: 1rem;
                }
                p {
                    margin-bottom: 2rem;
                    opacity: 0.9;
                }
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.2rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                label {
                    font-weight: bold;
                    font-size: 0.95rem;
                }
                input, textarea {
                    padding: 0.9rem;
                    border-radius: 8px;
                    border: 1px solid var(--input-border);
                    background-color: var(--bg-color);
                    color: var(--text-color);
                    font-size: 1rem;
                    font-family: inherit;
                    transition: border-color 0.3s, box-shadow 0.3s;
                }
                input:focus, textarea:focus {
                    outline: none;
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
                }
                textarea {
                    resize: vertical;
                    min-height: 120px;
                }
                button {
                    padding: 1.2rem;
                    border-radius: 8px;
                    border: none;
                    background-color: var(--accent-color);
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 1.1rem;
                    margin-top: 1rem;
                    transition: transform 0.2s, opacity 0.3s;
                }
                button:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                }
                button:active {
                    transform: translateY(0);
                }
            </style>
            <h2>🤝 서비스 제휴 문의</h2>
            <p>함께 성장할 파트너를 찾고 있습니다. 궁금하신 점이나 제안 사항을 남겨주세요.</p>
            <form action="https://formspree.io/f/xjgpvzog" method="POST">
                <div class="form-group">
                    <label for="name">성함 또는 기업명</label>
                    <input type="text" id="name" name="name" required placeholder="예: 홍길동 (주식회사 식단)">
                </div>
                
                <div class="form-group">
                    <label for="email">회신 받을 이메일</label>
                    <input type="email" id="email" name="_replyto" required placeholder="contact@example.com">
                </div>
                
                <div class="form-group">
                    <label for="message">문의 및 제안 내용</label>
                    <textarea id="message" name="message" required placeholder="제휴하고 싶은 내용이나 궁금한 점을 상세히 적어주세요."></textarea>
                </div>
                
                <button type="submit">제휴 제안 보내기</button>
            </form>
        `;
    }
}

class DisqusComments extends HTMLElement {
    constructor() {
        super();
        // Note: Disqus does not work well inside Shadow DOM due to how its scripts access the document.
        // We will use a regular DOM approach for the container but style it.
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
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    margin-top: 2rem;
                    transition: background-color 0.3s;
                }
                #disqus_thread {
                    width: 100%;
                }
            </style>
            <h2 style="color: var(--accent-color); margin-top: 0; margin-bottom: 1.5rem;">💬 댓글</h2>
            <div id="disqus_thread"></div>
            <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
        `;
    }

    loadDisqus() {
        const d = document, s = d.createElement('script');
        s.src = 'https://productbuilder-bjcdbvc0zk.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    }
}

// Register components
customElements.define('user-input-form', UserInputForm);
customElements.define('partnership-form', PartnershipForm);
customElements.define('disqus-comments', DisqusComments);
