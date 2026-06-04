import time
import os
import requests

# Use 127.0.0.1 for local Mac testing to avoid "localhost" resolution lag
API_URL = os.getenv("API_URL", "http://127.0.0.1:5000/api")
NOTIFY_URL = os.getenv("NOTIFY_URL", "http://127.0.0.1:6001")

def analyze_vitals():
    print(f"--- Diagnostic Cycle Started ---")
    try:
        # 1. Try to get patients
        print(f"Checking Patients at {API_URL}/patients...")
        response = requests.get(f"{API_URL}/patients", timeout=2)
        patients = response.json()
        print(f"Found {len(patients)} patients.")

        for p in patients:
            # AI Logic: Heart Rate > 110 is Critical
            if p['heartRate'] > 110:
                print(f"!! CRITICAL: {p['name']} (HR: {p['heartRate']}) !!")
                
                # Update Status in .NET Backend
                requests.post(f"{API_URL}/patients/{p['id']}/status", json={"status": "CRITICAL"})
                
                # Send to Node.js Alert Service
                print(f"Sending Emergency Log to {NOTIFY_URL}/notify...")
                requests.post(f"{NOTIFY_URL}/notify", json={
                    "patientName": p['name'],
                    "room": p['room'],
                    "heartRate": p['heartRate']
                })
            else:
                # Reset to stable if BPM is normal
                if p['status'] == "CRITICAL":
                    requests.post(f"{API_URL}/patients/{p['id']}/status", json={"status": "STABLE"})

    except requests.exceptions.ConnectionError:
        print("ERROR: Cannot connect to Backend (Port 5000) or Alert Service (Port 6001).")
    except Exception as e:
        print(f"ERROR: Cannot connect to Backend or Alert Service. Check URLs: {API_URL}, {NOTIFY_URL}")

if __name__ == "__main__":
    print("HealthPulse AI Engine Online. Starting monitoring...")
    while True:
        analyze_vitals()
        print("Cycle complete. Waiting 10 seconds...")
        time.sleep(10)