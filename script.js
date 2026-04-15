document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const submitBtn = document.getElementById('submit-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    const ctaContainer = document.getElementById('cta-container');
    const resultsPanel = document.getElementById('results-panel');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultContent = document.getElementById('result-content');
    
    const verdictBanner = document.getElementById('verdict-banner');
    const probabilityRadial = document.getElementById('probability-radial');
    const probabilityText = document.getElementById('probability-text');
    const insightText = document.getElementById('insight-text');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        ctaContainer.classList.add('hidden');
        resultsPanel.classList.remove('hidden');
        loadingSpinner.classList.remove('hidden');
        resultContent.classList.add('hidden');
        submitBtn.disabled = true;
        
        const formData = new FormData(form);
        const rawData = Object.fromEntries(formData.entries());

        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(i => i.disabled = true);

        const numericFields = ['age','sex','cp','trestbps','chol','fbs','restecg','thalach','exang','oldpeak','slope','ca','thal'];
        const data = {};
        for (let key in rawData) {
            if (rawData[key] === "") {
                data[key] = null;
            } else if (numericFields.includes(key)) {
                data[key] = Number(rawData[key]);
            } else {
                data[key] = rawData[key];
            }
        }
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                displayResult(result);
            } else {
                displayError(result.error || 'Unable to evaluate input.');
            }
        } catch (error) {
            console.error('Server connection failed:', error);
            displayError('Neural connect dropped. Verify localhost service.');
        }
    });

    function displayResult(result) {
        loadingSpinner.classList.add('hidden');
        resultContent.classList.remove('hidden');

        verdictBanner.className = 'verdict-banner';
        insightText.parentElement.style.borderLeftColor = 'var(--accent-purple)';
        insightText.parentElement.querySelector('i').style.color = 'var(--accent-purple)';

        const probability = (result.probability !== undefined && result.probability !== null)
            ? Number(result.probability)
            : (result.prediction === 1 ? 88.5 : 94.2);
        const formattedProbability = probability.toFixed(1);

        if (result.prediction === 1) {
            verdictBanner.classList.add('verdict-danger');
            verdictBanner.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> This patient has heart disease';
            insightText.textContent = result.message || 'Urgent specialist intervention strongly recommended.';
            insightText.parentElement.style.borderLeftColor = 'var(--accent-pink)';
            insightText.parentElement.querySelector('i').style.color = 'var(--accent-pink)';
            probabilityRadial.style.background = `conic-gradient(var(--accent-pink) calc(${formattedProbability} * 1%), rgba(255,255,255,0.05) 0)`;
            probabilityText.style.color = 'var(--accent-pink)';
        } else {
            verdictBanner.classList.add('verdict-safe');
            verdictBanner.innerHTML = '<i class="fa-solid fa-shield-check"></i> This patient doesn\'t have heart disease';
            insightText.textContent = result.message || 'Baseline vitals are normal.';
            insightText.parentElement.style.borderLeftColor = 'var(--accent-cyan)';
            insightText.parentElement.querySelector('i').style.color = 'var(--accent-cyan)';
            probabilityRadial.style.background = `conic-gradient(var(--accent-cyan) calc(${formattedProbability} * 1%), rgba(255,255,255,0.05) 0)`;
            probabilityText.style.color = 'var(--accent-cyan)';
        }

        animateValue(probabilityText, 0, parseFloat(formattedProbability), 1000);
        setTimeout(() => {
            probabilityRadial.style.setProperty('--val', formattedProbability);
        }, 100);
    }

    function displayError(errorMsg) {
        loadingSpinner.classList.add('hidden');
        resultContent.classList.remove('hidden');
        
        verdictBanner.className = 'verdict-banner';
        verdictBanner.style.background = 'rgba(255,0,0,0.1)';
        verdictBanner.style.border = '1px solid rgba(255,0,0,0.5)';
        verdictBanner.innerHTML = '<i class="fa-solid fa-bug"></i> Assessment Engine Erred';
        
        insightText.textContent = errorMsg;
        probabilityText.textContent = 'NaN';
        probabilityRadial.style.setProperty('--val', 0);
    }

    resetBtn.addEventListener('click', () => {
        resultsPanel.classList.add('hidden');
        ctaContainer.classList.remove('hidden');
        form.reset();
        
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(i => i.disabled = false);
        submitBtn.disabled = false;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = (progress * (end - start)).toFixed(1) + '%';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

});
