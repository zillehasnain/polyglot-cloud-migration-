import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Heart, Activity, AlertCircle, ShieldCheck,Bell } from 'lucide-react';

const API_URL = "http://localhost:5000/api";
const ALERT_URL = "http://localhost:6001";

const PatientCard = ({ patient }) => {
  const [chartData, setChartData] = useState(new Array(20).fill(0).map(() => ({ val: 70 })));

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => [...prev.slice(1), { val: patient.heartRate + (Math.random() * 6 - 3) }]);
    }, 1000);
    return () => clearInterval(interval);
  }, [patient.heartRate]);

  const isCritical = patient.status === "CRITICAL";

  return (
    <div className={`rounded-xl border bg-slate-900 p-4 transition-all duration-500 ${isCritical ? 'border-red-500 ring-1 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-slate-800'}`}>
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-md font-bold text-white uppercase">{patient.name}</h3>
          <p className="text-[10px] text-slate-500 font-mono">{patient.room}</p>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${isCritical ? 'bg-red-600 text-white animate-pulse' : 'bg-green-900/40 text-green-400'}`}>
          {patient.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Heart size={14} className={isCritical ? "text-red-500 animate-ping" : "text-rose-500"} />
            <span className="text-[9px] text-slate-500 uppercase">BPM</span>
          </div>
          <p className="text-xl font-black font-mono">{Math.round(patient.heartRate)}</p>
        </div>
        <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={14} className="text-blue-400" />
            <span className="text-[9px] text-slate-500 uppercase">SpO2</span>
          </div>
          <p className="text-xl font-black font-mono">{patient.spO2}%</p>
        </div>
      </div>

      <div className="h-16 w-full bg-black/40 rounded border border-slate-800/50">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            <Line type="monotone" dataKey="val" stroke={isCritical ? "#ef4444" : "#22c55e"} strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function App() {
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await fetch(`${API_URL}/patients`);
        setPatients(await pRes.json());
        
        const aRes = await fetch(`${ALERT_URL}/alerts`);
        setAlerts(await aRes.json());
      } catch (e) { console.error("Sync Error"); }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-900 pb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter">HEALTH<span className="text-red-600">PULSE</span></h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">ICU Central Command</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {patients.map(p => <PatientCard key={p.id} patient={p} />)}
        </div>
      </div>

      {/* Right Sidebar: Notification Logs */}
      <aside className="w-80 border-l border-slate-900 bg-slate-900/20 p-5 flex flex-col">
        <h2 className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <Bell size={14} /> Critical Logs
        </h2>
        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          {alerts.map(alert => (
            <div key={alert.id} className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between text-[9px] font-bold text-red-400 mb-1">
                <span>{alert.time}</span>
                <span>{alert.room}</span>
              </div>
              <p className="text-xs font-bold text-white leading-tight">{alert.patientName}</p>
              <p className="text-[10px] text-slate-500 mt-1 italic font-mono">HR: {alert.heartRate} BPM - Paged Team</p>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center py-10 opacity-20">
              <Activity className="mx-auto mb-2" />
              <p className="text-[10px] uppercase font-bold">No active alerts</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}