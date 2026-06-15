import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone,
  Info,
  Maximize,
  Minimize,
  Download,
  AlertCircle
} from 'lucide-react';
import { DeviceSettings, WorkspaceNote, SystemLog } from './types';
import PhoneSimulator from './components/PhoneSimulator';
import FaviconHandler from './components/FaviconHandler';

export default function App() {
  const [url, setUrl] = useState('https://ais-pre-h3ve3nynzxhojmrha7kf3h-750421392181.us-east1.run.app/?mode=superintendent');
  const [isPip, setIsPip] = useState(false);
  const [faviconTheme, setFaviconTheme] = useState({ themeColor: '#10b981', accentColor: '#3b82f6' });
  
  // Custom display configuration: 'emulator' (centered framed phone) vs 'fullscreen' (immersive web view fit)
  const [displayMode, setDisplayMode] = useState<'emulator' | 'fullscreen'>('emulator');

  // 1. Emulated hardware settings state
  const [settings, setSettings] = useState<DeviceSettings>({
    bezelStyle: 'modern-flagship',
    zoom: 100,
    wallpaper: 'cosmic-dark',
    orientation: 'portrait',
    showStatusBar: true,
    modelName: 'Google Pixel 9 Pro Extended',
    simulatedLatency: 15,
    batteryLevel: 98,
    networkType: '5G'
  });

  // 2. Personal notes state with localStorage sync
  const [notes, setNotes] = useState<WorkspaceNote[]>([]);

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('superintendent_companion_notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (e) {
      console.error('Failed to load notes from localStorage', e);
    }
  }, []);

  const saveNotesToStorage = (updatedNotes: WorkspaceNote[]) => {
    try {
      localStorage.setItem('superintendent_companion_notes', JSON.stringify(updatedNotes));
    } catch (e) {
      console.error('Failed to write notes to localStorage', e);
    }
  };

  const addNote = (content: string) => {
    const newNote: WorkspaceNote = {
      id: String(Date.now()),
      timestamp: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      content,
      mode: url
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    saveNotesToStorage(updated);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveNotesToStorage(updated);
  };

  // 3. Android Logcat terminal logs state
  const getFormattedTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  };

  const [logs, setLogs] = useState<SystemLog[]>([
    { id: '1', time: getFormattedTime(), category: 'DEVICE', message: 'Iniciando Kernel Android 15 (Superintendent OS v15.4)', severity: 'info' },
    { id: '2', time: getFormattedTime(), category: 'DEVICE', message: 'Processador AI Tensor G4 estabilizado em 37°C com segurança total', severity: 'success' },
    { id: '3', time: getFormattedTime(), category: 'NETWORK', message: 'Conectado à infraestrutura de roteamento do Superintendente', severity: 'success' },
    { id: '4', time: getFormattedTime(), category: 'SUPERINTENDENT', message: 'WebView carregando: ais-pre-h3ve3nynzxhojmrha7kf3h-750421392181.us-east1.run.app', severity: 'info' }
  ]);

  const addLog = (message: string, category: SystemLog['category'], severity: SystemLog['severity'] = 'info') => {
    const newLog: SystemLog = {
      id: String(Date.now() + Math.random()),
      time: getFormattedTime(),
      category,
      message,
      severity
    };
    setLogs(prev => [...prev.slice(-90), newLog]);
  };

  const clearLogs = () => {
    setLogs([{ id: 'clear', time: getFormattedTime(), category: 'DEVICE', message: 'Mapeamento de registros reiniciados pelo operador', severity: 'info' }]);
  };

  return (
    <div className="min-h-screen bg-[#04060b] text-gray-100 flex flex-col items-center justify-center font-sans selection:bg-emerald-500/20 selection:text-emerald-400 relative overflow-hidden">
      
      {/* 1. Dynamic Monitor Favicon Render Engine */}
      <FaviconHandler themeColor={faviconTheme.themeColor} accentColor={faviconTheme.accentColor} />

      {/* Cinematic subtle grid backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none z-0" />
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none z-0" />

      {/* 
        PREMIUM DOCK CONTROL: Only 1 tiny minimalist bar at the top of the interface.
        Allows switching between bezel view and 100% immersive fullscreen.
        Allows downloading the ready-to-compile APK guide.
      */}
      <div className="absolute top-4 left-12 right-12 z-50 flex justify-between items-center bg-slate-950/80 backdrop-blur-md px-4.5 py-2.5 rounded-full border border-slate-800/80 shadow-2xl max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          {/* Custom displaying monitor icon */}
          <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 100 100" fill="none">
            <rect x="15" y="22" width="70" height="44" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="6" />
            <path d="M40 66 L60 66 M50 66 L50 78 M30 78 L70 78" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
            <circle cx="50" cy="44" r="5" fill="#3b82f6" />
          </svg>
          <span className="text-[11px] font-mono tracking-widest text-slate-100 uppercase font-bold flex items-center gap-1.5">
            Android Wrapper
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Toggle View Format */}
          <button
            onClick={() => {
              const next = displayMode === 'emulator' ? 'fullscreen' : 'emulator';
              setDisplayMode(next);
              addLog(`Layout alterado para: ${next === 'emulator' ? 'Modulação Flagship' : 'Tela Cheia Nativa'}`, 'DEVICE', 'info');
            }}
            className="p-1 px-3 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 text-slate-300 text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer"
            title="Alternar entre visualização de molde físico ou tela cheia sem bordas"
          >
            {displayMode === 'emulator' ? <Maximize className="h-3 w-3" /> : <Minimize className="h-3 w-3" />}
            {displayMode === 'emulator' ? 'IMERSIVO (PWA/APK)' : 'EXIBIR PIXEL MOCKUP'}
          </button>

          {/* Quick install guide */}
          <button
            onClick={() => {
              addLog('Exportando roteiro técnico para compilação local de APK nativa', 'DEVICE', 'success');
              alert('O arquivo "/android-apk-instructions.txt" com os scripts de compilação da APK já foi criado na raiz do seu projeto! Use-o para gerar o APK físico usando CapacitorJS nas suas dependências locais.');
            }}
            className="p-1 px-3 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono hover:bg-emerald-900/10 font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            BAIXAR MANUAL APK
          </button>
        </div>
      </div>

      {/* Main Container Content */}
      <main className="w-full flex-grow flex items-center justify-center z-10 p-2 md:p-6 select-none relative pt-20">
        <AnimatePresence mode="wait">
          {displayMode === 'emulator' ? (
            /* Centered framed desktop presentation over clean minimal layout - NO SIDEBAR FOOTERS OR TEXT */
            <motion.div 
              key="emulator-frame"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="flex justify-center items-center w-full max-w-lg relative"
            >
              {/* Stand base plate */}
              <div className="absolute inset-x-8 bottom-[-20px] h-10 bg-gradient-to-t from-slate-950/90 to-transparent blur-lg rounded-full pointer-events-none" />
              
              <PhoneSimulator 
                settings={settings}
                setSettings={setSettings}
                url={url}
                setUrl={setUrl}
                isPip={isPip}
                setIsPip={setIsPip}
                logs={logs}
                addLog={addLog}
                clearLogs={clearLogs}
                notes={notes}
                addNote={addNote}
                deleteNote={deleteNote}
                setFaviconTheme={setFaviconTheme}
              />
            </motion.div>
          ) : (
            /* 100% immersive fluid screen representation - hides bezel margins entirely to act as an Android App */
            <motion.div 
              key="fullscreen-frame"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="w-full h-screen fixed inset-0 z-20 flex flex-col bg-black"
            >
              <PhoneSimulator 
                settings={{ ...settings, orientation: 'portrait' }}
                setSettings={setSettings}
                url={url}
                setUrl={setUrl}
                isPip={isPip}
                setIsPip={setIsPip}
                logs={logs}
                addLog={addLog}
                clearLogs={clearLogs}
                notes={notes}
                addNote={addNote}
                deleteNote={deleteNote}
                setFaviconTheme={setFaviconTheme}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
