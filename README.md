PULSEGUARD AI: INTELLIGENT HEALTH MONITORING SYSTEM 🛡️💓

"Saving lives through real-time, context-aware biometric analysis."

PulseGuard AI is an enterprise-grade health monitoring platform that leverages machine learning to detect cardiac anomalies in real-time. Unlike traditional trackers that only record data, PulseGuard understands the context of the patient (e.g., resting vs. exercising) to provide accurate, life-saving alerts.

🚀 Live Demo

Frontend (App Dashboard): https://pulse-guard-olive.vercel.app/

Backend (AI API): https://pulseguard-api.onrender.com/docs

✨ Key Features

🧠 AI-Powered Diagnostics

Anomaly Detection: Utilizes an Isolation Forest machine learning model to identify irregular heart patterns in real-time.

Contextual Intelligence: Distinguishes between healthy elevated heart rates (exercise) and dangerous spikes (resting tachycardia).

💻 Clinical Dashboard

Live ECG Stream: Real-time visualization of heart rate and SpO2 levels with <50ms latency.

Dr. AI Assistant: An integrated chatbot that summarizes patient data and answers medical queries.

Patient Registry: centralized management for patient profiles, risk status, and history.

📱 Cross-Platform PWA

Installable: Works as a native app on iOS, Android, Windows, and Mac without an App Store.

Biometric Security: Simulated FaceID/Fingerprint login for secure clinician access.

Dark Mode: Optimized "Night Shift" interface for low-light hospital environments.

📸 Screenshots

Live Dashboard

Secure Login





Real-time monitoring & AI Alerts

Secure Biometric Access

🛠️ Tech Stack

Frontend (Client)

Framework: React 18 (Vite)

Styling: Tailwind CSS (Responsive & Dark Mode)

Visualization: Recharts (High-performance data graphing)

Icons: Lucide React

PWA: Vite Plugin PWA (Offline capabilities & Installation)

Backend (Server)

API: Python FastAPI (Asynchronous & High Speed)

ML Engine: Scikit-Learn (Isolation Forest), Pandas, NumPy

Database: SQLite (User authentication & Patient logs)

Server: Uvicorn

DevOps & Deployment

Frontend Hosting: Vercel (Global CDN)

Backend Cloud: Render (Containerized Python Environment)

Version Control: Git & GitHub

⚡ Installation & Local Setup

Follow these steps to run the full system on your local machine.

1. Clone the Repository

git clone [https://github.com/YOUR_USERNAME/PulseGuard.git](https://github.com/YOUR_USERNAME/PulseGuard.git)
cd PulseGuard


2. Setup the Backend (The Brain)

cd backend
python -m venv venv

# Windows
source venv/Scripts/activate
# Mac/Linux
# source venv/bin/activate

pip install -r requirements.txt

# Train the AI Model
python app/model_train.py

# Start the Server
uvicorn app.main:app --reload --port 8000


3. Setup the Frontend (The App)

Open a new terminal window:

cd frontend
npm install
npm run dev


Open your browser to http://localhost:5173

📱 How to Install on Mobile

PulseGuard is a Progressive Web App (PWA). You don't need the App Store to install it.

Visit the Website: Open the Vercel link on your phone.

Android: Tap the "Install App" button on the login screen OR Chrome Menu (⋮) -> "Install App".

iOS: Tap the Share button (squares with arrow) -> Scroll down -> "Add to Home Screen".

🔒 Security & Compliance

Encryption: All data in transit is encrypted via HTTPS (TLS 1.3).

Authentication: JWT-ready architecture with biometric simulation.

Data Privacy: Designed with GDPR/HIPAA principles (minimal data retention).

🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

License: MIT License
Author: Samuel Kivairu

