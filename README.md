# ✈️ Flight Satisfaction AI Predictor

A machine learning web application that predicts passenger satisfaction based on flight experience data using Azure ML.

## 🌐 Live Demo

**Website:** https://flight-satisfaction-predictor-pink.vercel.app/

## 📋 Features

- Real-time satisfaction prediction using Azure Machine Learning
- Interactive form with input validation
- Probability breakdown for predictions
- Modern, responsive UI design
- Secure API key management via Vercel Functions

## 🏗️ Project Structure
```
├── index.html             # Frontend interface
├── train.csv              # Dataset
├── package.json           # Dependencies
└── api/
    └── predict.js         # Secure API backend
```

## 🚀 How It Works

1. User fills out flight experience data
2. Frontend validates all inputs
3. Data sent to Vercel Function (`/api/predict`)
4. Function securely calls Azure ML endpoint
5. Prediction results displayed with probability scores

## 🔧 Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **API Gateway:** Vercel Serverless Functions (securely forwards requests)
- **Server/Backend:** Azure Machine Learning Endpoint
- **Hosting:** Vercel (with GitHub auto-deploy)

## 📊 Azure ML Pipeline

Built using Azure ML Designer with:
- Two-Class Logistic Regression model
- Features: Customer demographics, service ratings, flight details
- Output: Satisfaction prediction with probability scores

## 🔐 Security

- API keys stored as Netlify environment variables
- No sensitive data exposed in client-side code
- Secure serverless function architecture

## 📝 License

This project is for educational purposes. AI has been extensively used for its completion.

---

**Created for Azure ML learning and demonstration**
