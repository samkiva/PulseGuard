# PulseGuard AI 💓
> An AI-powered patient health monitoring and early-warning system for clinical environments.

![Python](https://img.shields.io/badge/Python-3.10-blue?style=flat-square)
![Machine Learning](https://img.shields.io/badge/ML-Scikit--learn-orange?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## What It Does
PulseGuard AI monitors patient vitals and clinical indicators to flag individuals at elevated risk — enabling earlier intervention before a critical event occurs. It is designed for resource-constrained clinical settings where continuous specialist oversight is not always available.

---

## Features
- 🚨 Risk scoring based on patient vitals and history
- 🌲 Machine learning model (Random Forest / classification)
- 📋 Interpretable predictions — clinicians see *why* a flag was raised
- 📊 Patient dashboard for monitoring multiple cases
- 🏥 Built with low-resource clinical environments in mind

---

## Tech Stack
| Layer | Technology |
|---|---|
| Model | Scikit-learn |
| Data Processing | Pandas, NumPy |
| Explainability | Feature importance / SHAP |
| Interface | Streamlit / FastAPI |

---

## Run Locally
```bash
git clone https://github.com/samkiva/PulseGuard.git
cd PulseGuard
pip install -r requirements.txt
streamlit run app.py
```

---

## Clinical Motivation
Preventable deterioration is one of the leading causes of adverse outcomes in under-resourced hospitals. PulseGuard AI acts as an always-on second pair of eyes — surfacing high-risk patients so care teams can prioritise.

> ⚠️ **Disclaimer:** This is a research/portfolio project and is not approved for clinical use.

---

## Roadmap
- [ ] Integrate real-time vitals feed via FHIR API
- [ ] Expand training data with East African clinical datasets
- [ ] Deploy as a mobile-first PWA for ward nurses

---

## Author
**Samuel Kivairu** — [@samkiva](https://github.com/samkiva)  
Statistics & Data Science | University of Nairobi  
Focus: AI for Healthcare | Precision Medicine

