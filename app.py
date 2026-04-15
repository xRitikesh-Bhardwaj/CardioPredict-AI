import os
import joblib
import numpy as np
from flask import Flask, render_template, request, jsonify

app = Flask(__name__, static_folder='.', static_url_path='', template_folder='.')

MODEL_PATH = 'model.pkl'
SCALER_PATH = 'scaler.pkl'

if not os.path.exists(MODEL_PATH):
    raise Exception("❌ model.pkl NOT FOUND! Please add your trained model file.")

model = joblib.load(MODEL_PATH)
print("✅ Model loaded successfully")

scaler = None
if os.path.exists(SCALER_PATH):
    scaler = joblib.load(SCALER_PATH)
    print("✅ Scaler loaded successfully")
else:
    print("⚠️ No scaler found (continuing without scaling)")


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/guide')
def guide():
    return render_template('guide.html')


@app.route('/powerbi')
def powerbi():
    return render_template('powerbi.html')



@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        if not data or not isinstance(data, dict):
            return jsonify({'success': False, 'error': 'Invalid request payload'}), 400

        def parse_value(key, allowed=None, minimum=None, maximum=None, default=None):
            if key not in data or data[key] is None or data[key] == "":
                if default is not None:
                    return default
                raise ValueError(f'Missing or empty value for {key}')
            try:
                value = float(data[key])
            except (ValueError, TypeError):
                raise ValueError(f'Invalid numeric value for {key}')

            if allowed is not None and int(value) not in allowed:
                raise ValueError(f'Invalid value for {key}. Expected one of {sorted(allowed)}')
            if minimum is not None and value < minimum:
                raise ValueError(f'{key} must be at least {minimum}')
            if maximum is not None and value > maximum:
                raise ValueError(f'{key} must be at most {maximum}')
            return value

        age = parse_value('age', minimum=1, maximum=120, default=55)
        sex = parse_value('sex', allowed={0, 1}, default=1)
        cp = parse_value('cp', allowed={0, 1, 2, 3}, default=0)
        trestbps = parse_value('trestbps', minimum=50, maximum=250, default=130)
        chol = parse_value('chol', minimum=100, maximum=600, default=240)
        fbs = parse_value('fbs', allowed={0, 1}, default=0)
        restecg = parse_value('restecg', allowed={0, 1, 2}, default=1)
        thalach = parse_value('thalach', minimum=60, maximum=220, default=150)
        exang = parse_value('exang', allowed={0, 1}, default=0)
        oldpeak = parse_value('oldpeak', minimum=0.0, maximum=10.0, default=1.0)
        slope = parse_value('slope', allowed={0, 1, 2}, default=1)
        ca = parse_value('ca', allowed={0, 1, 2, 3, 4}, default=0)
        thal = parse_value('thal', allowed={0, 1, 2, 3}, default=2)

        features = np.asarray([[
            age, sex, cp, trestbps, chol,
            fbs, restecg, thalach, exang,
            oldpeak, slope, ca, thal
        ]], dtype=float)

        if scaler is not None:
            features = scaler.transform(features)

        prediction = model.predict(features)[0]

        probability = 0.0
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(features)
            if hasattr(proba, '__getitem__') and len(proba[0]) > 1:
                probability = float(proba[0][int(prediction)]) * 100

        message = (
            '⚠️ This patient may have heart disease. Please consult a doctor.'
            if int(prediction) == 1
            else '✅ This patient is likely safe. Maintain a healthy lifestyle.'
        )

        return jsonify({
            'success': True,
            'prediction': int(prediction),
            'probability': round(probability, 2),
            'message': message
        })

    except ValueError as ve:
        return jsonify({'success': False, 'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': f'Unexpected server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)