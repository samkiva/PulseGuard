import sqlite3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
import os

app = FastAPI()

# --- CORS (Allow Mobile/Web Access) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATABASE SETUP (SQLite) ---
# This creates a file named 'users.db' inside backend/app/ or backend/
conn = sqlite3.connect('users.db', check_same_thread=False)
c = conn.cursor()
# Create table if it doesn't exist
c.execute('''CREATE TABLE IF NOT EXISTS users 
             (email text PRIMARY KEY, password text, name text)''')
conn.commit()

# --- AI MODEL LOADING ---
MODEL_PATH = "../model_data/health_model.joblib"
# Also try local path just in case running from inside app folder
if not os.path.exists(MODEL_PATH):
    MODEL_PATH = "model_data/health_model.joblib"

model = None
try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully")
except:
    print("⚠️ WARNING: AI Model not found. Run 'python app/model_train.py' first.")

# --- DATA MODELS ---
class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class HealthData(BaseModel):
    heart_rate: float
    blood_oxygen: float
    activity_level: str

# --- AUTH ENDPOINTS (The missing parts) ---

@app.post("/register")
def register(user: UserRegister):
    print(f"📝 Registering user: {user.email}")
    try:
        c.execute("INSERT INTO users VALUES (?, ?, ?)", (user.email, user.password, user.name))
        conn.commit()
        return {"status": "success", "message": "User created", "name": user.name}
    except sqlite3.IntegrityError:
        print("❌ Duplicate email")
        raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
def login(user: UserLogin):
    print(f"🔑 Logging in: {user.email}")
    c.execute("SELECT name FROM users WHERE email=? AND password=?", (user.email, user.password))
    result = c.fetchone()
    if result:
        return {"status": "success", "name": result[0]}
    else:
        raise HTTPException(status_code=401, detail="Invalid email or password")

# --- AI ENDPOINT ---
@app.post("/analyze")
def analyze(data: HealthData):
    if not model:
        return {"is_anomaly": False, "recommendation": "System needs training"}
    
    features = pd.DataFrame([[data.heart_rate, data.blood_oxygen]], 
                            columns=['heart_rate', 'blood_oxygen'])
    
    pred = model.predict(features)[0]
    is_anomaly = True if pred == -1 else False
    
    rec = "Vitals stable."
    if is_anomaly:
        if data.heart_rate > 120 and data.activity_level == 'low':
            rec = "CRITICAL: Tachycardia at rest. Sit down immediately."
        elif data.blood_oxygen < 90:
            rec = "CRITICAL: Hypoxia detected. Seek oxygen/medical help."
        else:
            rec = "Irregular rhythm detected. Consult a cardiologist."
    
    return {"is_anomaly": is_anomaly, "recommendation": rec}