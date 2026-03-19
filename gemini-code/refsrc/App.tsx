import React, { useState, useEffect, useRef } from 'react';
import { Lock, User, X, Loader2 } from 'lucide-react';
import { labExams as initialLabExams, LabExam, labProfiles as initialLabProfiles, LabProfile } from './data';
import BudgetView from './components/BudgetView';
import AdminView from './components/AdminView';

export default function App() {
  const [currentView, setCurrentView] = useState<'budget' | 'admin'>('budget');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [labExams, setLabExams] = useState<LabExam[]>(initialLabExams);
  const [labProfiles, setLabProfiles] = useState<LabProfile[]>(initialLabProfiles || []);
  const [lastUpdated, setLastUpdated] = useState<string>("22/12/2025");
  
  const [isLoaded, setIsLoaded] = useState(false);
  const isFirstRender = useRef(true);

  // Fetch data on mount
  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        if (data.labExams) setLabExams(data.labExams);
        if (data.labProfiles) setLabProfiles(data.labProfiles);
        if (data.lastUpdated) setLastUpdated(data.lastUpdated);
        setIsLoaded(true);
      })
      .catch(err => {
        console.error("Failed to fetch data, falling back to initial data", err);
        setIsLoaded(true);
      });
  }, []);

  // Save data on change
  useEffect(() => {
    if (!isLoaded) return;
    
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ labExams, labProfiles, lastUpdated })
    }).catch(err => console.error("Failed to save data", err));
  }, [labExams, labProfiles, lastUpdated, isLoaded]);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setCurrentView('admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded credentials for demonstration
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
      setCurrentView('admin');
      setUsername('');
      setPassword('');
      setLoginError('');
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {currentView === 'budget' ? (
        <BudgetView 
          labExams={labExams} 
          labProfiles={labProfiles}
          lastUpdated={lastUpdated} 
          onNavigateToAdmin={handleAdminClick} 
        />
      ) : (
        <AdminView 
          labExams={labExams} 
          setLabExams={setLabExams}
          labProfiles={labProfiles}
          setLabProfiles={setLabProfiles}
          lastUpdated={lastUpdated}
          setLastUpdated={setLastUpdated}
          onNavigateBack={() => setCurrentView('budget')} 
        />
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Acceso Administrador
              </h2>
              <button 
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setLoginError('');
                }} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    placeholder="admin"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-2"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
