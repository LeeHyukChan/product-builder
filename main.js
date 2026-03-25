
class UserInputForm extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <style>
                /* Form styling */
            </style>
            <form id="user-info-form">
                <label for="age">Age:</label>
                <input type="number" id="age" name="age" required><br><br>
                <label for="weight">Weight (kg):</label>
                <input type="number" id="weight" name="weight" required><br><br>
                <label for="height">Height (cm):</label>
                <input type="number" id="height" name="height" required><br><br>
                <label for="activity-level">Activity Level:</label>
                <select id="activity-level" name="activity-level">
                    <option value="1.2">Sedentary (little or no exercise)</option>
                    <option value="1.375">Lightly active (light exercise/sports 1-3 days/week)</option>
                    <option value="1.55">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                    <option value="1.725">Very active (hard exercise/sports 6-7 days a week)</option>
                    <option value="1.9">Extra active (very hard exercise/sports & physical job or 2x training)</option>
                </select><br><br>
                <button type="submit">Generate Diet Plan</button>
            </form>
        `;

        shadow.appendChild(wrapper);

        shadow.querySelector('#user-info-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const age = shadow.querySelector('#age').value;
            const weight = shadow.querySelector('#weight').value;
            const height = shadow.querySelector('#height').value;
            const activityLevel = shadow.querySelector('#activity-level').value;

            const calories = this.calculateCalories(age, weight, height, activityLevel);
            this.generateDietPlan(calories);
        });
    }

    calculateCalories(age, weight, height, activityLevel) {
        // Using Mifflin-St Jeor Equation for BMR
        const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // for men
        // const bmr = 10 * weight + 6.25 * height - 5 * age - 161; // for women
        return bmr * activityLevel;
    }

    generateDietPlan(calories) {
        const dietPlanElement = document.querySelector('#diet-plan');
        dietPlanElement.innerHTML = `
            <h2>Your Daily Diet Plan</h2>
            <p><strong>Daily Calorie Target:</strong> ${Math.round(calories)} calories</p>
            <h3>Breakfast (25% of calories)</h3>
            <ul>
                <li>Scrambled eggs with spinach and a slice of whole-wheat toast.</li>
            </ul>
            <h3>Lunch (35% of calories)</h3>
            <ul>
                <li>Grilled chicken salad with mixed greens, vegetables, and a light vinaigrette.</li>
            </ul>
            <h3>Dinner (25% of calories)</h3>
            <ul>
                <li>Baked salmon with quinoa and steamed broccoli.</li>
            </ul>
            <h3>Snacks (15% of calories)</h3>
            <ul>
                <li>Greek yogurt with berries.</li>
                <li>A handful of almonds.</li>
            </ul>
        `;
    }
}

customElements.define('user-input-form', UserInputForm);
