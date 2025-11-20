from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "running"

def test_anomaly_prediction():
    # Normal case
    payload = {"heart_rate": 75, "blood_oxygen": 98, "activity_level": "low"}
    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    assert response.json()["is_anomaly"] == False