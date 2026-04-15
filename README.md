<div align="center">

# ❤️ Cardio ML - Neural Cardiology Assessment

[![Python Version](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-Web%20Framework-lightgrey.svg)](https://flask.palletsprojects.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Machine%20Learning-orange.svg)](https://scikit-learn.org/)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()

<br>
<img src="Documents/Heart_Disease_Dashboard.png" alt="Cardio ML Dashboard Dashboard Preview" width="800"/>
<br>

**A full-stack, "Bento-style" Web Application and Machine Learning solution predicting the likelihood of heart disease in patients based on 13 critical medical metrics.**

[Explore the Code](#-architecture-overview) · [Installation](#-setup--installation-how-to-run) · [Usage](#💻-how-the-code-works-step-by-step-flow)

</div>

---

## 🔍 About the Project

> **📊 ML MODEL IN GOOGLE COLAB (PDF):** [ML MODEL IN GOOGLE COLAB](Documents/Heart%20Disease%20Prediction.ipynb%20-%20Colab.pdf)

**Cardio ML Intelligence** is an end-to-end, academic-grade machine learning project designed for diagnostic assistance. It perfectly integrates a heavily optimized predictive backend with a beautiful, fully responsive "Bento-grid" styled user interface. 

The application utilizes a scikit-learn binary classification model, exposed through a lightweight Python Flask API. It handles missing patient data via dynamic median imputation calculations, providing not just binary predictions, but specific **mathematical probability confidence scores** directly to the clinician.


<table align="center">
  <tr>
    <td align="center"><img src="Front%20page.png" alt="Front page 1" width="100%"/></td>
    <td align="center"><img src="secondFront%20page%20.png" alt="Front page 2" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><img src="Dashboard%20page.png" alt="Dashboard page" width="100%"/></td>
    <td align="center"><img src="Contact%20page.png" alt="Contact page" width="100%"/></td>
  </tr>
</table>

---

## ✨ Key Features

* 🧠 **Machine Learning Engine**: High-accuracy predictive binary classification (`model.pkl`) using tested algorithms.
* ⚡ **Asynchronous Web Interface**: No page reloads! A responsive, cyber-medical UI built with vanilla JS `fetch()` requests and smooth transition animations.
* 🩺 **Resilient Data Processing**: Users missing certain test results (like specific blood panels) won't break the system. The Flask backend applies robust dynamic median imputations.
* 📊 **Power BI Integration**: Includes an embedded Power BI Analytics Dashboard (`Heart_Disease_Analysis_Dashboard.pbix`) with visual distribution data of the patient demographic.
* 📱 **Mobile-First Responsiveness**: Hand-crafted CSS media queries ensure perfect degradation to one-column layouts on phones and tablets.
* 📨 **Secure Contact Module**: Fully functional submission form powered by GetForm integration.

---

## 🛠️ Tech Stack

### Frontend
- **HTML5:** Semantic architecture
- **CSS3:** Custom Variables, Flexbox, CSS Grid (Bento Layout), Interactive Animations
- **JavaScript (ES6):** Async form handling, DOM manipulation without frameworks

### Backend
- **Python 3:** Core logic execution
- **Flask:** Lightweight API server routing
- **Numpy & Pandas:** Vectorized math and array manipulation

### Machine Learning
- **Scikit-Learn:** Model execution and Probability evaluation `predict_proba()`
- **Joblib:** Engine serialization (Loading `model.pkl`)

---

## 📂 Repository Structure

```text
📁 Project Directory
├── 📄 app.py                  # The Flask Server / Backend API engine
├── 📄 model.pkl               # The trained scikit-learn ML model
├── 📄 index.html              # Primary Dashboard / Form Interface
├── 📄 script.js               # Frontend JS handling API requests & UI updates
├── 📄 style.css               # Main application stylesheet
├── 📄 guide.html / css        # Clinical terms reference guide for patients
├── 📄 powerbi.html            # Landing page for Power BI Dashboard analytics
├── 📄 contact.html            # GetForm contact page
├── 📁 Documents
│   ├── 📄 heart.csv               # Medical dataset used for training/imputations
│   ├── 📄 Heart_Disease_Prediction.ipynb # Jupyter Notebook for ML training
│   ├── 📄 Heart Disease Prediction.ipynb - Colab.pdf # ML Model PDF
│   └── 📊 Heart_Disease_Dashboard.png      # Power BI Dashboard preview image
├── 📄 requirements.txt        # Python dependency manifest
└── 📊 Heart_Disease_Analysis_Dashboard.pbix # PowerBI analytics file
```

---

## 💻 How the Code Works (Step-by-Step Flow)

### 1. User Input & Extraction (Frontend)
Users fill out clinical inputs on `index.html`. We decoupled from strict HTML `required` attributes so unknown fields can gracefully be handled. `script.js` interrupts the form submission, extracting fields via `FormData()`, and initiates a `fetch()` POST containing JSON to the backend API. A visual loading spinner overlays the screen.

### 2. Data Imputation & Standardization (Backend)
When the payload hits the Flask server (`/predict` route), `app.py` triggers an imputation pipeline. If a value is missing (e.g., patient is missing `Resting Blood Pressure`), our function parses the global `heart.csv` file, calculates the feature's median, and injects it to preserve array integrity without throwing exceptions. The final values are constructed into a multidimensional Numpy array.

### 3. AI Inference & Probabilities
The array is fed to `model.predict()`. We simultaneously calculate `model.predict_proba()` to evaluate the exact confidence percentage. The backend constructs a structured JSON response with the binary verdict (0 or 1), probability percentage, and dynamically crafted medical assessments, piping it back to the client.

### 4. DOM Injection
The frontend receives the payload and executes dynamic UI class toggles. Based on the `0` or `1` outcome, circular progress rings match corresponding UI colors (Cyan for Negative / Pink for Positive) alongside dynamic text updates. No page refresh ever occurs.

---

## 🚀 Setup & Installation (How to Run)

The application can be easily run on any local environment.

**1. Clone the repository:**
```bash
git clone https://github.com/your-username/Cardio-ML-Assessment.git
cd Cardio-ML-Assessment
```

**2. Install dependencies:**
Make sure you have Python 3.8+ installed. You can install all required packages using pip:
```bash
pip install -r requirements.txt
```

**3. Run the Flask application:**
Start the backend server engine by executing the main script:
```bash
python app.py
```

**4. Access the web application:**
Once the terminal displays that the server is running, open your web browser and navigate to:
```text
http://127.0.0.1:5000/
```

*(Note: The server will automatically serve the initial `index.html` file.)*

---

## 📝 License & Usage
This internal project is designed primarily for educational and academic purposes. The models provided here are predictive tools built via standard algorithms on dataset distributions and are **not a licensed medical diagnostics tool**. 

Please see the [LICENSE]() file for further usage details.

---

## 👨‍💻 Author

**Ritikesh Bhardwaj** 
* GitHub: [RitikesH-28](https://github.com/RitikesH-28)
* LinkedIn: [Ritikesh Bhardwaj](www.linkedin.com/in/ritikesh-bhardwaj-274a48254)

*If you like this project, please consider giving it a ⭐!*
