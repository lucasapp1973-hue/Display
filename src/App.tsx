import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Laptop, 
  Smartphone, 
  Layers, 
  Settings, 
  HelpCircle, 
  Flame,
  Info
} from 'lucide-react';
import { DeviceSettings, WorkspaceNote, SystemLog } from './types';
import PhoneSimulator from './components/PhoneSimulator';
import Dashboard from './components/Dashboard';
import FaviconHandler from './components/FaviconHandler';

export default function App() {
  const [url, setUrl] = useState('https://ais-pre-h3ve3nynzxhojmrha7kf3h-750421392181.us-east1.run.app/?mode=superintendent');
  const [isPip, setIsPip] = useState(false);
  const [faviconTheme, setFaviconTheme] = useState({ themeColor: '#10b981', accentColor: '#3b82f6' });

  // 1. Emulated hardware settings state
  const [settings, setSettings] = useState<DeviceSettings>({
    bezelStyle: 'modern-flagship',
    zoom: 100,
    wallpaper: 'cosmic-dark',
    orientation: 'portrait',
    showStatusBar: true,
    modelName: 'AI Studio Superintendent Pro',
    simulatedLatency: 28,
    batteryLevel: 95,
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
    { id: '2', time: getFormattedTime(), category: 'DEVICE', message: 'Processador AI Tensor G4 ativando barramento térmico estável', severity: 'success' },
    { id: '3', time: getFormattedTime(), category: 'NETWORK', message: 'Conectando à torre móvel virtual ... Conectado com sucesso (LTE/5G)', severity: 'success' },
    { id: '4', time: getFormattedTime(), category: 'SUPERINTENDENT', message: 'Workspace pronto. Preparando exibição para: https://ais-pre-h3ve3nynzxhojmrha7kf3h-750421392181.us-east1.run.app/?mode=superintendent', severity: 'info' }
  ]);

  const addLog = (message: string, category: SystemLog['category'], severity: SystemLog['severity'] = 'info') => {
    const newLog: SystemLog = {
      id: String(Date.now() + Math.random()),
      time: getFormattedTime(),
      category,
      message,
      severity
    };
    setLogs(prev => [...prev.slice(-90), newLog]); // Keep last 100 logs
  };

  const clearLogs = () => {
    setLogs([{ id: 'clear', time: getFormattedTime(), category: 'DEVICE', message: 'Mapeamento de registros reiniciados pelo operador', severity: 'info' }]);
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-gray-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      
      {/* 1. Canvas Dynamic Tab Icon/Favicon controller */}
      <FaviconHandler themeColor={faviconTheme.themeColor} accentColor={faviconTheme.accentColor} />

      {/* Background vector styling elements */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none z-0" />

      {/* Main Grid Wrapper */}
      <main className="flex-grow max-w-[1500px] mx-auto w-full p-4 lg:p-6 flex flex-col justify-between z-10 relative">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start h-full">
          
          {/* Dashboard Left Wing (12 Columns in low resolutions, splits on XL) */}
          <section className={`transition-all duration-300 xl:col-span-8 flex flex-col gap-6 ${isPip ? 'xl:col-span-12' : ''}`}>
            
            <Dashboard 
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

            {/* Quick Informational Guide */}
            <div className="bg-slate-900/20 border border-slate-800/80 p-4 rounded-xl flex items-start gap-3 mt-4">
              <Info className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-400 leading-relaxed">
                <span className="font-semibold text-slate-200 block mb-1">Como funciona o Sistema de Picture-in-Picture?</span>
                No seu computador ou smartphone de trabalho, o modo flutuante é perfeito para manter o monitoramento de canais no canto da tela enquanto realiza vistorias administrativas secundárias na parte principal do companion. Se preferir desencaixar o telefone em uma janela real do Windows ou macOS, ative o <span className="text-cyan-400 font-semibold font-mono">PiP Nativo</span> clicando no botão para utilizar o suporte nativo do Google Chrome!
              </div>
            </div>
          </section>

          {/* Stand/Pedestal and Right-Wing Android Simulator frame */}
          {!isPip ? (
            /* Desktop presentation of the device: mounted inside gorgeous physical glass glow pedestal */
            <section id="phone-mount-point" className="xl:col-span-4 flex justify-center items-center h-full xl:sticky xl:top-6 min-h-[700px] w-full self-start">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full flex justify-center items-center relative"
              >
                {/* Visual Glass Base Platform */}
                <div className="absolute inset-x-4 bottom-[-16px] h-8 bg-gradient-to-t from-slate-950/90 to-transparent blur-md rounded-2xl border-b border-slate-800 pointer-events-none" />
                <div className="absolute -inset-10 bg-gradient-to-tr from-emerald-500/10 via-transparent to-cyan-500/10 blur-[64px] rounded-full pointer-events-none" />
                
                <PhoneSimulator 
                  settings={settings}
                  setSettings={setSettings}
                  url={url}
                  isPip={isPip}
                  setIsPip={setIsPip}
                  addLog={addLog}
                />
              </motion.div>
            </section>
          ) : (
            /* Draggable floating picture-in-picture mode fallback container */
            <AnimatePresence>
              <motion.div 
                id="phone-mount-point"
                drag
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={{ left: 20, right: window.innerWidth - 340, top: 20, bottom: window.innerHeight - 500 }}
                className="fixed bottom-6 right-6 z-50 rounded-[2.5rem] bg-slate-950/90 shadow-2xl border border-emerald-500/40 glow-active select-none"
              >
                <div className="p-1 cursor-grab active:cursor-grabbing">
                  <PhoneSimulator 
                    settings={settings}
                    setSettings={setSettings}
                    url={url}
                    isPip={isPip}
                    setIsPip={setIsPip}
                    addLog={addLog}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          )}

        </div>
      </main>

      {/* Full-width aesthetic bottom status line */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-3.5 text-center text-[11px] font-mono text-zinc-500 tracking-wider flex flex-col md:flex-row justify-between items-center px-6 gap-2">
        <span>ANDROID PORTAL TERMINAL • ACTIVE SECURED CONNECTION</span>
        <span className="text-zinc-600 flex items-center gap-1.5 uppercase">
          <Flame className="h-3 w-3 text-emerald-500" /> AI Studio Superintendent Android Companion © 2026
        </span>
      </footer>
    </div>
  );
}
