import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import os

# Ensure directory exists for saving model
os.makedirs("../model_data", exist_ok=True)

def generate_synthetic_data(n=3000):
    """Generates realistic wearable data."""
    np.random.seed(42)
    
    # 1. Simulate Activity (0: Low, 1: Moderate, 2: High)
    activity_probs = [0.6, 0.3, 0.1]
    activity = np.random.choice(['low', 'moderate', 'high'], size=n, p=activity_probs)
    
    # 2. Simulate Heart Rate based on activity
    # Base HR + Activity Boost + Random Noise
    base_hr = np.random.normal(70, 5, n)
    activity_map = {'low': 0, 'moderate': 20, 'high': 50}
    hr_boost = np.array([activity_map[a] for a in activity])
    heart_rate = base_hr + hr_boost + np.random.normal(0, 2, n)
    
    # 3. Simulate SpO2 (Blood Oxygen)
    # Mostly 95-100, drops occasionally
    blood_oxygen = np.random.normal(98, 1, n)
    blood_oxygen = np.clip(blood_oxygen, 90, 100)
    
    # Create DataFrame
    df = pd.DataFrame({
        'heart_rate': heart_rate,
        'blood_oxygen': blood_oxygen,
        'activity_level': activity
    })
    
    # 4. Inject Anomalies (for evaluation purposes, remove for training if pure unsupervised)
    # We will train on 'mostly normal' data, but let's leave the noise in.
    return df

def train_and_save():
    print("Generating data...")
    df = generate_synthetic_data()
    
    # Feature selection
    features = ['heart_rate', 'blood_oxygen']
    X = df[features]
    
    print("Training IsolationForest...")
    # Contamination=0.05 means we expect ~5% of data to be anomalous
    model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
    model.fit(X)
    
    # Save Model
    model_path = "../model_data/health_model.joblib"
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_and_save()