const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS so the React app can talk to this service
app.use(cors());
app.use(express.json());

// In-memory storage for alerts
let alertHistory = [];

// 1. Endpoint for the Python Worker to send new alerts
app.post('/notify', (req, res) => {
    const newAlert = {
        id: Date.now(),
        patientName: req.body.patientName,
        room: req.body.room,
        heartRate: req.body.heartRate,
        time: new Date().toLocaleTimeString()
    };

    alertHistory.unshift(newAlert); // Add to the top of the list
    
    // Keep only the latest 10 alerts
    if (alertHistory.length > 10) alertHistory.pop();

    console.log(`🚨 ALERT RECEIVED: ${newAlert.patientName} (HR: ${newAlert.heartRate})`);
    res.status(200).json({ message: "Alert logged" });
});

// 2. Endpoint for the React Frontend to fetch the history (THIS WAS MISSING)
app.get('/alerts', (req, res) => {
    res.status(200).json(alertHistory);
});

const PORT = 6001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`-----------------------------------------`);
    console.log(`Alert Notification Service is LIVE`);
    console.log(`Listening on: http://localhost:${PORT}`);
    console.log(`-----------------------------------------`);
});