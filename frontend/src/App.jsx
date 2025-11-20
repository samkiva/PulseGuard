import React, { useState, useEffect, useRef } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  Activity, Heart, Wind, AlertTriangle, CheckCircle, 
  Bell, User, Home, BarChart2, Settings, LogOut,
  ChevronRight, Search, Lock, Mail, Smartphone, Loader2, 
  Plus, X, Moon, Sun, Fingerprint, MessageSquare, Send
} from 'lucide-react';

// --- CONFIGURATION ---
const API_URL = "https://pulseguard-api.onrender.com"; // Replace with your backend URL

function App() {
  // --- GLOBAL STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); 
  const [darkMode, setDarkMode] = useState(false);
  const [showToast, setShowToast] = useState(null); 

  // --- SETTINGS STATE ---
  const [settings, setSettings] = useState({
    criticalAlerts: true,
    emailReports: false,
    biometricLogin: true,
  });

  // --- DATA STATE ---
  const [patientsList, setPatientsList] = useState([
    { id: '049-A', name: 'Sarah Connor', age: 34, status: 'Critical', condition: 'Arrhythmia', lastVisit: '2 mins ago' },
    { id: '082-B', name: 'John Doe', age: 45, status: 'Stable', condition: 'Hypertension', lastVisit: '1 day ago' },
    { id: '091-C', name: 'Elena Fisher', age: 29, status: 'Stable', condition: 'Routine Check', lastVisit: '3 days ago' },
  ]);

  const triggerToast = (message, type = 'success') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleLoginSuccess = (name) => {
    setCurrentUser(name);
    setIsLoggedIn(true);
    triggerToast(`Welcome back, Dr. ${name.split(' ')[0]}`);
  };

  const appClasses = darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800';

  return (
    <div className={`${appClasses} w-screen h-screen transition-colors duration-500 overflow-hidden`}>
      
      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-right duration-300">
          <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${
            showToast.type === 'error' ? 'bg-red-500 text-white' : 
            showToast.type === 'info' ? 'bg-blue-500 text-white' : 
            'bg-emerald-500 text-white'
          }`}>
            {showToast.type === 'error' ? <AlertTriangle size={20}/> : <CheckCircle size={20}/>}
            <span className="font-bold">{showToast.message}</span>
          </div>
        </div>
      )}

      {!isLoggedIn ? (
        <LoginPage 
          onLogin={handleLoginSuccess} 
          darkMode={darkMode} 
          biometricEnabled={settings.biometricLogin}
          triggerToast={triggerToast}
        />
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onLogout={() => setIsLoggedIn(false)} 
            currentUser={currentUser}
            darkMode={darkMode}
          />
          
          <main className="flex-1 overflow-y-auto relative">
            <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
              {activeTab === 'overview' && <OverviewTab darkMode={darkMode} settings={settings} />}
              {activeTab === 'analytics' && <AnalyticsTab darkMode={darkMode} />}
              {activeTab === 'patients' && <PatientsTab patients={patientsList} setPatients={setPatientsList} darkMode={darkMode} triggerToast={triggerToast} />}
              {activeTab === 'settings' && <SettingsTab settings={settings} setSettings={setSettings} darkMode={darkMode} setDarkMode={setDarkMode} triggerToast={triggerToast} />}
            </div>
            
            {/* DR. AI CHATBOT */}
            <ChatBot darkMode={darkMode} currentUser={currentUser} />
          </main>

          <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
        </div>
      )}
    </div>
  );
}

// ---------------- LOGIN PAGE (Biometric + Centered) ----------------
function LoginPage({ onLogin, biometricEnabled, triggerToast }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bioScanning, setBioScanning] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const endpoint = isSignUp ? '/register' : '/login';
    const payload = isSignUp ? { email, password, name } : { email, password };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Auth Failed");
      onLogin(data.name);
    } catch (err) {
      triggerToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometric = () => {
    setBioScanning(true);
    setTimeout(() => {
      setBioScanning(false);
      onLogin("Biometric User");
    }, 2000);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Subtle Gradient Accent */}
      <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 15% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 85% 70%, rgba(79, 70, 229, 0.15) 0%, transparent 50%)',
          animation: 'gradientShift 15s ease-in-out infinite'
      }}></div>
      <style>{`
        @keyframes gradientShift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, 10px); }
        }
      `}</style>
      
      <div className="relative z-10 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">PulseGuard AI</h1>
          <p className="text-slate-400 text-sm mt-2">Secure Medical Access</p>
        </div>

        {bioScanning ? (
           <div className="flex flex-col items-center justify-center py-10 space-y-4">
             <Fingerprint size={80} className="text-emerald-400 animate-pulse" />
             <p className="text-emerald-400 font-mono text-sm tracking-widest">SCANNING BIOMETRICS...</p>
           </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <input type="text" placeholder="Full Name" className="bg-slate-800 text-white w-full p-3 rounded-xl border border-white/10 focus:border-blue-500 outline-none" value={name} onChange={e=>setName(e.target.value)} required />
            )}
            <input type="email" placeholder="Email" className="bg-slate-800 text-white w-full p-3 rounded-xl border border-white/10 focus:border-blue-500 outline-none" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="bg-slate-800 text-white w-full p-3 rounded-xl border border-white/10 focus:border-blue-500 outline-none" value={password} onChange={e=>setPassword(e.target.value)} required />

            <button disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="animate-spin"/> : (isSignUp ? 'Create Account' : 'Secure Login')}
            </button>

            {!isSignUp && biometricEnabled && (
              <button type="button" onClick={handleBiometric} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5">
                <Fingerprint className="text-emerald-400" /> FaceID / Fingerprint
              </button>
            )}
          </form>
        )}

        <div className="mt-6 text-center">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-blue-400 hover:text-blue-300">
            {isSignUp ? "Back to Login" : "Create New Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- 2. OVERVIEW TAB (Live Monitor) ----------------
function OverviewTab({ darkMode }) {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
      const fetchLive = async () => {
          try {
              const activities = ['low', 'moderate', 'high'];
              const activity = activities[Math.floor(Math.random() * activities.length)];
              const hrBase = activity === 'high' ? 130 : activity === 'moderate' ? 90 : 70;
              const isBadTime = Math.random() > 0.96; 
              const hr = isBadTime ? 148 : Math.floor(hrBase + (Math.random() * 20 - 10)); 
              const spo2 = isBadTime ? 89 : Math.floor(95 + (Math.random() * 5));
              const activityToSend = isBadTime ? 'low' : activity;

              const res = await fetch(`${API_URL}/analyze`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ heart_rate: hr, blood_oxygen: spo2, activity_level: activityToSend })
              });
              
              const data = await res.json();
              const timestamp = new Date().toLocaleTimeString([], { hour12: false });
              const newData = { heart_rate: hr, blood_oxygen: spo2, activity_level: activityToSend, ...data, timestamp };
              
              setLatest(newData);
              setHistory(prev => [...prev.slice(-19), newData]);
          } catch {
              const fallback = { heart_rate: 72, blood_oxygen: 98, activity_level: 'low', is_anomaly: false, recommendation: "Demo Mode - Server Disconnected", timestamp: new Date().toLocaleTimeString() };
              setLatest(fallback);
              setHistory(prev => [...prev.slice(-19), fallback]);
          }
      };

      fetchLive();
      const interval = setInterval(fetchLive, 2000);
      return () => clearInterval(interval);
  }, []);

  if (!latest) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  const isCritical = latest.is_anomaly;
  const cardBg = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';

  return (
      <div className="space-y-6 animate-in fade-in duration-700">
          <div className={`relative overflow-hidden rounded-3xl p-8 transition-all duration-500 ${isCritical ? 'bg-red-600 text-white' : `${cardBg} shadow-sm border`}`}>
               <div className="flex items-center gap-2 mb-4">
                 {isCritical ? <AlertTriangle className="animate-bounce" /> : <CheckCircle className="text-emerald-500" />}
                 <span className="font-bold tracking-widest text-xs uppercase opacity-70">AI Diagnosis</span>
               </div>
               <h3 className="text-4xl font-bold mb-2">{isCritical ? 'CRITICAL ANOMALY' : 'Stable Condition'}</h3>
               <p className="opacity-90 text-lg">{latest.recommendation}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Heart Rate" value={latest.heart_rate} unit="bpm" color="rose" icon={<Heart/>} darkMode={darkMode} />
              <MetricCard label="SpO2" value={latest.blood_oxygen} unit="%" color="sky" icon={<Wind/>} darkMode={darkMode} />
              <MetricCard label="Activity" value={latest.activity_level} unit="" color="indigo" icon={<Activity/>} capitalize darkMode={darkMode} />
              <MetricCard label="Response" value="45" unit="ms" color="emerald" icon={<Smartphone/>} darkMode={darkMode} />
          </div>

          <div className={`p-6 rounded-3xl shadow-sm border h-80 ${cardBg}`}>
              <h4 className={`font-bold mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Real-time ECG</h4>
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                      <defs>
                          <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={isCritical ? "#ef4444" : "#3b82f6"} stopOpacity={0.2}/>
                              <stop offset="95%" stopColor={isCritical ? "#ef4444" : "#3b82f6"} stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#f1f5f9'} />
                      <XAxis dataKey="timestamp" hide />
                      <YAxis domain={[40, 160]} hide />
                      <Tooltip contentStyle={{backgroundColor: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none'}} itemStyle={{color: darkMode ? '#fff' : '#000'}} />
                      <Area type="monotone" dataKey="heart_rate" stroke={isCritical ? "#ef4444" : "#3b82f6"} strokeWidth={3} fill="url(#colorHr)" />
                  </AreaChart>
              </ResponsiveContainer>
          </div>
      </div>
  );
}

// ---------------- 3. ANALYTICS TAB (Detailed) ----------------
function AnalyticsTab({ darkMode }) {
  const data = [
      { name: 'Mon', score: 85, stress: 12 }, { name: 'Tue', score: 92, stress: 8 },
      { name: 'Wed', score: 88, stress: 15 }, { name: 'Thu', score: 95, stress: 5 },
      { name: 'Fri', score: 78, stress: 22 }, { name: 'Sat', score: 90, stress: 10 },
      { name: 'Sun', score: 96, stress: 4 },
  ];
  const pieData = [
    { name: 'Resting', value: 400 }, { name: 'Walking', value: 300 },
    { name: 'Exercise', value: 100 }, { name: 'Sleep', value: 200 },
  ];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];
  const cardBg = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';
  const textMain = darkMode ? 'text-slate-200' : 'text-slate-800';

  return (
      <div className="space-y-6 animate-in fade-in duration-500">
          <header>
              <h2 className="text-2xl font-bold">Health Analytics</h2>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Deep Dive Insights</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-3xl shadow-sm border ${cardBg}`}>
                  <h4 className={`font-bold mb-6 ${textMain}`}>Weekly Health Score</h4>
                  <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#f1f5f9'}/>
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none'}} />
                              <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              <div className={`p-6 rounded-3xl shadow-sm border ${cardBg}`}>
                  <h4 className={`font-bold mb-6 ${textMain}`}>Activity Distribution</h4>
                  <div className="h-64">
                       <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{backgroundColor: darkMode ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none'}} />
                          <Legend />
                        </PieChart>
                       </ResponsiveContainer>
                  </div>
              </div>
          </div>
      </div>
  );
}

// ---------------- 4. PATIENTS TAB (Add Toggle) ----------------
function PatientsTab({ patients, setPatients, darkMode, triggerToast }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', condition: '' });

  const handleAddPatient = (e) => {
    e.preventDefault();
    const id = Math.floor(100 + Math.random() * 900) + "-X";
    const p = { id, ...newPatient, status: 'Stable', lastVisit: 'Just now' };
    setPatients([p, ...patients]);
    setShowAddModal(false);
    setNewPatient({ name: '', age: '', condition: '' });
    triggerToast(`${p.name} added to registry`);
  };

  const cardBg = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';
  const textMain = darkMode ? 'text-slate-200' : 'text-slate-800';
  const inputBg = darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900';

  return (
      <div className="space-y-6 animate-in fade-in duration-500 relative">
          <header className="flex justify-between items-center">
              <div>
                  <h2 className="text-2xl font-bold">Patient Registry</h2>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Ward A - Cardiology</p>
              </div>
              <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all">
                  <Plus size={18} /> Add Patient
              </button>
          </header>

          {/* ADD PATIENT MODAL */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className={`${cardBg} p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-300`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-bold ${textMain}`}>New Patient Record</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-red-500"><X size={24}/></button>
                </div>
                <form onSubmit={handleAddPatient} className="space-y-4">
                  <input type="text" placeholder="Full Name" required className={`w-full p-3 rounded-xl border outline-none focus:border-blue-500 mt-1 ${inputBg}`} value={newPatient.name} onChange={e=>setNewPatient({...newPatient, name: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Age" required className={`w-full p-3 rounded-xl border outline-none focus:border-blue-500 mt-1 ${inputBg}`} value={newPatient.age} onChange={e=>setNewPatient({...newPatient, age: e.target.value})} />
                    <input type="text" placeholder="Condition" required className={`w-full p-3 rounded-xl border outline-none focus:border-blue-500 mt-1 ${inputBg}`} value={newPatient.condition} onChange={e=>setNewPatient({...newPatient, condition: e.target.value})} />
                  </div>
                  <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-blue-500">Save Record</button>
                </form>
              </div>
            </div>
          )}

          <div className="space-y-3">
              {patients.map((patient, i) => (
                  <div key={i} className={`${cardBg} p-4 rounded-2xl shadow-sm border flex justify-between items-center hover:shadow-md transition-shadow cursor-pointer`}>
                      <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                              {patient.name.charAt(0)}
                          </div>
                          <div>
                              <h4 className={`font-bold ${textMain}`}>{patient.name}</h4>
                              <p className="text-xs text-slate-400">ID: {patient.id} • {patient.age} yrs • {patient.condition}</p>
                          </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${patient.status === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{patient.status}</span>
                  </div>
              ))}
          </div>
      </div>
  );
}

// ---------------- 5. SETTINGS TAB (Real Toggles) ----------------
function SettingsTab({ settings, setSettings, darkMode, setDarkMode, triggerToast }) {
  const toggleSetting = (key) => {
    const newVal = !settings[key];
    setSettings({ ...settings, [key]: newVal });
    if (key === 'emailReports') triggerToast(newVal ? "Weekly reports enabled" : "Weekly reports disabled", "info");
    if (key === 'criticalAlerts') triggerToast(newVal ? "Alerts active" : "Alerts muted");
  };

  const cardBg = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';
  const textMain = darkMode ? 'text-slate-200' : 'text-slate-800';

  return (
      <div className="space-y-6 animate-in fade-in duration-500">
          <header>
              <h2 className="text-2xl font-bold">Settings</h2>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>App Preferences</p>
          </header>
          <div className={`${cardBg} rounded-3xl shadow-sm border overflow-hidden`}>
              <div className={`p-6 border-b ${darkMode ? 'border-slate-800' : 'border-slate-50'}`}>
                  <h4 className={`font-bold mb-4 ${textMain}`}>Notifications</h4>
                  <div className="space-y-6">
                      <SettingRow label="Critical Alerts" desc="Push notifications for red anomalies" active={settings.criticalAlerts} onClick={() => toggleSetting('criticalAlerts')} />
                      <SettingRow label="Email Reports" desc="Weekly PDF summaries sent to admin" active={settings.emailReports} onClick={() => toggleSetting('emailReports')} />
                  </div>
              </div>
              <div className="p-6">
                  <h4 className={`font-bold mb-4 ${textMain}`}>System</h4>
                  <div className="space-y-6">
                      <SettingRow label="Dark Mode" desc="Switch to dark interface" active={darkMode} onClick={() => setDarkMode(!darkMode)} />
                      <SettingRow label="Biometric Login" desc="Enable FaceID/Fingerprint on login" active={settings.biometricLogin} onClick={() => toggleSetting('biometricLogin')} />
                  </div>
              </div>
          </div>
      </div>
  );
}

// ---------------- 6. CHATBOT (Dr. AI) ----------------
function ChatBot({ darkMode, currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ id: 1, text: `Hello Dr. ${currentUser.split(' ')[0]}, how can I help you today?`, sender: 'bot' }]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), text: input, sender: 'user' }]);
    setInput('');
    setTimeout(() => {
      let response = "I can help you track patient vitals.";
      if (input.toLowerCase().includes('heart')) response = "The patient's heart rate spiked twice in the last hour.";
      if (input.toLowerCase().includes('alert')) response = "Critical alerts are active for Sarah Connor.";
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'bot' }]);
    }, 1000);
  };

  const bg = darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200';
  
  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex flex-col items-end">
      {isOpen && (
        <div className={`${bg} border shadow-2xl rounded-2xl w-80 h-96 mb-4 flex flex-col overflow-hidden`}>
          <div className="bg-blue-600 p-3 flex justify-between text-white font-bold"><span>Dr. AI</span><button onClick={()=>setIsOpen(false)}><X size={16}/></button></div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2" ref={scrollRef}>
            {messages.map(m => (
              <div key={m.id} className={`p-2 rounded-xl text-sm max-w-[80%] ${m.sender==='user' ? 'bg-blue-600 text-white ml-auto' : `bg-slate-100 ${darkMode ? 'text-slate-900' : 'text-slate-800'}`}`}>{m.text}</div>
            ))}
          </div>
          <form onSubmit={handleSend} className={`p-2 border-t flex gap-2 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
            <input className="flex-1 bg-transparent outline-none text-sm" placeholder="Ask AI..." value={input} onChange={e=>setInput(e.target.value)} />
            <button type="submit"><Send size={16} className="text-blue-600"/></button>
          </form>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110"><MessageSquare/></button>
    </div>
  );
}

// --- UI HELPERS ---
function Sidebar({ activeTab, setActiveTab, onLogout, currentUser, darkMode }) {
  const bg = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const text = darkMode ? 'text-slate-100' : 'text-slate-800';
  return (
    <aside className={`hidden md:flex flex-col w-72 ${bg} border-r h-screen sticky top-0 z-20 transition-colors`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg"><Activity className="text-white w-6 h-6" /></div>
          <span className={`text-xl font-bold tracking-tight ${text}`}>PulseGuard</span>
        </div>
        <div className="space-y-1">
          <SidebarBtn icon={<Home/>} label="Live Monitor" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} darkMode={darkMode} />
          <SidebarBtn icon={<BarChart2/>} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} darkMode={darkMode} />
          <SidebarBtn icon={<User/>} label="Patients" active={activeTab === 'patients'} onClick={() => setActiveTab('patients')} darkMode={darkMode} />
          <SidebarBtn icon={<Settings/>} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} darkMode={darkMode} />
        </div>
      </div>
      <div className={`mt-auto p-6 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">{currentUser.charAt(0)}</div>
          <div><p className={`text-sm font-bold truncate ${text}`}>{currentUser}</p><p className="text-xs text-slate-400">Clinician</p></div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 p-2 rounded-lg w-full text-sm font-medium transition-colors"><LogOut size={16} /> Sign Out</button>
      </div>
    </aside>
  );
}

function MobileNav({ activeTab, setActiveTab, darkMode }) {
  const bg = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  return (
    <div className={`md:hidden fixed bottom-0 inset-x-0 ${bg} border-t z-50 flex justify-around p-3 pb-safe transition-colors`}>
      <MobileNavBtn icon={<Home/>} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} darkMode={darkMode} />
      <MobileNavBtn icon={<BarChart2/>} active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} darkMode={darkMode} />
      <div className="w-12 h-12 bg-blue-600 rounded-full -mt-8 flex items-center justify-center shadow-lg shadow-blue-500/30 border-4 border-transparent"><Activity className="text-white w-6 h-6" /></div>
      <MobileNavBtn icon={<User/>} active={activeTab === 'patients'} onClick={() => setActiveTab('patients')} darkMode={darkMode} />
      <MobileNavBtn icon={<Settings/>} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} darkMode={darkMode} />
    </div>
  );
}

function MetricCard({ label, value, unit, icon, color, capitalize, darkMode }) {
    const colors = { rose: "text-rose-500 bg-rose-500/10", sky: "text-sky-500 bg-sky-500/10", indigo: "text-indigo-500 bg-indigo-500/10", emerald: "text-emerald-500 bg-emerald-500/10" };
    const cardBg = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';
    const textMain = darkMode ? 'text-slate-200' : 'text-slate-800';
    return (
        <div className={`${cardBg} p-4 rounded-2xl shadow-sm border`}>
            <div className="flex items-center gap-3 mb-2"><div className={`p-2 rounded-xl ${colors[color]}`}>{React.cloneElement(icon, {size:18})}</div><span className="text-xs font-bold text-slate-400 uppercase">{label}</span></div>
            <div className="flex items-baseline gap-1"><span className={`text-2xl font-bold ${textMain} ${capitalize ? 'capitalize' : ''}`}>{value}</span><span className="text-xs font-medium text-slate-400">{unit}</span></div>
        </div>
    );
}

function SidebarBtn({ icon, label, active, onClick, darkMode }) {
    const activeClass = active ? 'bg-blue-500/10 text-blue-500 font-bold' : `text-slate-400 hover:bg-slate-500/5 ${darkMode ? 'hover:text-slate-200' : 'hover:text-slate-700'}`;
    return (<button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeClass}`}>{React.cloneElement(icon, {size:20})}<span className="text-sm">{label}</span>{active && <ChevronRight size={16} className="ml-auto"/>}</button>);
}

function MobileNavBtn({ icon, active, onClick }) {
    const color = active ? 'text-blue-500 bg-blue-500/10' : 'text-slate-400';
    return (<button onClick={onClick} className={`p-2 rounded-xl transition-colors ${color}`}>{React.cloneElement(icon, {size:24})}</button>);
}

function SettingRow({ label, desc, active, onClick }) {
    return (
        <div className="flex items-center justify-between cursor-pointer" onClick={onClick}>
            <div><p className={`text-sm font-bold ${active ? 'text-slate-200' : 'text-slate-800'}`}>{label}</p><p className="text-xs text-slate-400">{desc}</p></div>
            <div className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${active ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}><div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm ${active ? 'left-6' : 'left-1'}`}></div></div>
        </div>
    );
}

export default App;

