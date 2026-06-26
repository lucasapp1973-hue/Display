import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  Signal, 
  Battery, 
  ArrowLeft, 
  Home, 
  Menu,
  Volume2, 
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Terminal,
  Bookmark,
  Share2,
  ChevronDown,
  ChevronUp,
  Cpu,
  RefreshCw,
  Layers,
  Settings,
  Info,
  Smartphone,
  ExternalLink,
  Laptop,
  AlertCircle,
  X
} from 'lucide-react';
import { DeviceSettings, SystemLog, WorkspaceNote } from '../types';

interface PhoneSimulatorProps {
  settings: DeviceSettings;
  setSettings: (settings: DeviceSettings) => void;
  url: string;
  setUrl: (url: string) => void;
  isPip: boolean;
  setIsPip: (pip: boolean) => void;
  logs: SystemLog[];
  addLog: (msg: string, cat: SystemLog['category'], sev: SystemLog['severity']) => void;
  clearLogs: () => void;
  notes: WorkspaceNote[];
  addNote: (content: string) => void;
  deleteNote: (id: string) => void;
  setFaviconTheme: (theme: { themeColor: string; accentColor: string }) => void;
}

export function PhoneSimulator({ 
  settings, 
  setSettings, 
  url, 
  setUrl,
  isPip, 
  setIsPip, 
  logs,
  addLog,
  clearLogs,
  notes,
  addNote,
  deleteNote,
  setFaviconTheme
}: PhoneSimulatorProps) {
  const [localTime, setLocalTime] = useState('12:00');
  const [iframeKey, setIframeKey] = useState(0);
  const [volume, setVolume] = useState(70);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isShadeOpen, setIsShadeOpen] = useState(false);

  // Quick state overrides
  const [cpuUsage, setCpuUsage] = useState(19);
  const [localPing, setLocalPing] = useState(15);
  const [noteInput, setNoteInput] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState(url);

  // Stopwatch (Cronômetro) State inside the Android App
  const [cronTime, setCronTime] = useState(0); // in deciseconds (100ms steps)
  const [cronActive, setCronActive] = useState(false);
  const [cronCollapsed, setCronCollapsed] = useState(false);
  const [laps, setLaps] = useState<string[]>([]);
  const cronIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Native PWA support
  const [pwaPrompt, setPwaPrompt] = useState<any>(null);
  const [showInstallSuccess, setShowInstallSuccess] = useState(false);
  const [showFrameWarning, setShowFrameWarning] = useState(true);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setPwaPrompt(e);
      addLog('Dispositivo Android detectou capacidade de instalação nativa do PWA!', 'DEVICE', 'success');
    });
  }, []);

  // Sync real device clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setLocalTime(`${hrs}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic system telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsage(Math.round(15 + Math.random() * 12));
      setLocalPing(Math.round(12 + Math.random() * 6));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Stopwatch timer logic
  useEffect(() => {
    if (cronActive) {
      cronIntervalRef.current = setInterval(() => {
        setCronTime(prev => prev + 1);
      }, 100);
    } else {
      if (cronIntervalRef.current) clearInterval(cronIntervalRef.current);
    }
    return () => {
      if (cronIntervalRef.current) clearInterval(cronIntervalRef.current);
    };
  }, [cronActive]);

  const handleVolumeChange = (direction: 'up' | 'down') => {
    addLog(`Volume Físico Ajustado: ${direction === 'up' ? '+' : '-'}`, 'DEVICE', 'info');
    setVolume(prev => {
      const step = 10;
      return direction === 'up' ? Math.min(prev + step, 100) : Math.max(prev - step, 0);
    });
    setShowVolumeSlider(true);
    setTimeout(() => setShowVolumeSlider(false), 2000);
  };

  const reloadIframe = () => {
    addLog('Hard-resetting live superintendent webview process', 'NETWORK', 'info');
    setIframeLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleIframeLoad = () => {
    setIframeLoading(false);
    addLog('WebApp carregado e integrado com segurança de renderização', 'NETWORK', 'success');
  };

  const triggerPwaInstall = async () => {
    if (pwaPrompt) {
      addLog('Disparando modal nativo do Android para instalação do Applet', 'DEVICE', 'info');
      pwaPrompt.prompt();
      const { outcome } = await pwaPrompt.userChoice;
      if (outcome === 'accepted') {
        addLog('Instalação completa! Applet agora roda como aplicativo nativo standalone!', 'DEVICE', 'success');
        setShowInstallSuccess(true);
        setTimeout(() => setShowInstallSuccess(false), 4000);
      }
      setPwaPrompt(null);
    } else {
      addLog('Iniciando empacotamento simulado para PWA / APK standalone do dispositivo', 'DEVICE', 'info');
      setShowInstallSuccess(true);
      setTimeout(() => setShowInstallSuccess(false), 4000);
    }
  };

  const formatCronTime = (time: number) => {
    const minutes = Math.floor(time / 600);
    const seconds = Math.floor((time % 600) / 10);
    const milis = time % 10;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${milis}s`;
  };

  const handleAddLap = () => {
    const newLap = formatCronTime(cronTime);
    setLaps(prev => [newLap, ...prev.slice(0, 9)]);
    addLog(`Lap do Temporizador gravada: ${newLap}`, 'SUPERINTENDENT', 'success');
  };

  // Device layout theme bezel class
  const isLandscape = settings.orientation === 'landscape';
  const widthClass = isLandscape ? 'h-[430px] w-[860px]' : 'w-[385px] h-[780px]';

  const wallpapers = {
    'cosmic-dark': 'bg-gradient-to-tr from-[#05070e] via-[#111322] to-[#1a1730]',
    'electric-green': 'bg-gradient-to-tr from-black via-[#041a15] to-[#111b24]',
    'neon-cyan': 'bg-gradient-to-tr from-[#02050c] via-[#041525] to-[#12161f]',
    'material-you': 'bg-gradient-to-tr from-[#0f0b18] via-[#1a1329] to-[#0d1624]',
    'abyss-pulse': 'bg-gradient-to-tr from-[#020306] via-[#090b11] to-[#161a22]'
  };

  return (
    <div className="relative">
      {/* 
        FLUID EMULATOR VIEW:
        We scale this so that it auto-fills the screen on true mobile layouts (via absolute inset-0), 
        while on widescreen desktop it appears inside a beautiful, floating bezel stand with glass-glow.
      */}
      <div 
        className={`relative ${widthClass} md:mx-auto rounded-[3.2rem] border-[12px] border-zinc-800 bg-black flex flex-col justify-between overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-slate-900 transition-all duration-500 ring-2 ring-slate-800/80`}
        style={{ transformOrigin: 'center center' }}
      >
        
        {/* Physical hardware simulator triggers */}
        <button 
          onClick={() => setIsLocked(!isLocked)}
          className={`absolute ${isLandscape ? 'top-[-12px] right-24 h-[4px] w-12' : 'right-[-12px] top-28 w-[4px] h-12'} bg-zinc-600 rounded-full hover:bg-emerald-400 active:scale-95 transition-all z-40`}
          title="Botão de Ligar / Desligar Tela"
        />
        <button 
          onClick={() => handleVolumeChange('up')}
          className={`absolute ${isLandscape ? 'top-[-12px] right-44 h-[4px] w-10' : 'left-[-12px] top-24 w-[4px] h-10'} bg-zinc-600 rounded-full hover:bg-emerald-400 active:scale-95 transition-all z-40`}
          title="Botão de Volume +"
        />
        <button 
          onClick={() => handleVolumeChange('down')}
          className={`absolute ${isLandscape ? 'top-[-12px] right-56 h-[4px] w-10' : 'left-[-12px] top-36 w-[4px] h-10'} bg-zinc-600 rounded-full hover:bg-emerald-400 active:scale-95 transition-all z-40`}
          title="Botão de Volume -"
        />

        {/* Wallpaper background stack */}
        <div className={`absolute inset-0 z-0 ${wallpapers[settings.wallpaper]} transition-all duration-500`} />

        {/* Core application body container */}
        <div className="relative w-full h-full flex flex-col justify-between z-10 overflow-hidden">
          
          {/* 1. Android Top Status Bar (Swipe Down Trigger) */}
          {settings.showStatusBar && (
            <div 
              onClick={() => {
                setIsShadeOpen(!isShadeOpen);
                addLog('Slide-down: Abrindo cortina de notificações do Android', 'DEVICE', 'info');
              }}
              className={`w-full flex justify-between items-center px-6 pt-3 pb-2.5 z-30 transition-all duration-200 cursor-pointer hover:bg-white/5 active:bg-white/10 ${
                isLandscape ? 'px-8 bg-black/60' : 'bg-black/30 backdrop-blur-[2px]'
              }`}
            >
              {/* Clock & Target Badge */}
              <div className="flex items-center gap-1.5 focus:outline-none">
                <span className="font-sans font-semibold text-[11.5px] text-slate-100 tracking-wide">{localTime}</span>
                <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest leading-none font-bold">5G ULTRA</span>
              </div>

              {/* Punch-hole notch device camera */}
              {!isLandscape && (
                <div className="w-4.5 h-4.5 rounded-full bg-slate-950 border-2 border-neutral-800 flex items-center justify-center shadow-inner">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-900/30"></div>
                </div>
              )}

              {/* Status symbols */}
              <div className="flex items-center gap-2 text-slate-200">
                <Signal className="h-3 w-3 text-neutral-300" />
                <Wifi className="h-3 w-3 text-neutral-300" />
                <div className="flex items-center gap-0.5">
                  <Battery className="h-3 w-3 text-emerald-400" />
                  <span className="text-[10px] font-mono font-medium">{settings.batteryLevel}%</span>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATED HARDWARE HUD: Floating Volume Slider */}
          <AnimatePresence>
            {showVolumeSlider && (
              <motion.div 
                initial={{ opacity: 0, x: isLandscape ? 0 : -35 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLandscape ? 0 : -20 }}
                className={`absolute z-50 bg-slate-950/90 backdrop-blur-md rounded-2xl flex items-center p-3 border border-slate-800 shadow-2xl ${
                  isLandscape 
                    ? 'top-4 left-1/2 -translate-x-1/2 w-48 gap-2.5' 
                    : 'left-4 top-40 w-11 flex-col h-36 justify-between gap-2'
                }`}
              >
                {volume > 0 ? <Volume2 className="h-3.5 w-3.5 text-emerald-400" /> : <VolumeX className="h-3.5 w-3.5 text-rose-500" />}
                <div className={`relative bg-slate-800 rounded-full flex-grow overflow-hidden ${isLandscape ? 'h-1.5 w-full' : 'w-1.5 h-full'}`}>
                  <div 
                    className="bg-emerald-400 rounded-full transition-all duration-100" 
                    style={isLandscape ? { width: `${volume}%`, height: '100%' } : { height: `${volume}%`, width: '100%', position: 'absolute', bottom: 0 }}
                  />
                </div>
                <span className="text-[9px] font-mono text-zinc-300 font-bold">{volume}%</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 
            LIVE ANDROID NOTIFICATION SHADE (Material You Hub)
            Contains developer options, system URL overrides, APK download instructions, PWA installer, logs, notes.
          */}
          <AnimatePresence>
            {isShadeOpen && (
              <motion.div 
                initial={{ y: '-100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-lg flex flex-col justify-between overflow-y-auto"
              >
                {/* Header of Shade */}
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 tracking-wider block font-bold">ANDROID STATUS: CONNECTED</span>
                    <h3 className="font-display font-semibold text-sm text-slate-100 uppercase tracking-widest flex items-center gap-1.5">
                      Painel do Sistema Android
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsShadeOpen(false)}
                    className="p-1 px-3 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 font-semibold font-mono text-xs cursor-pointer border border-emerald-500/20"
                  >
                    Fechar
                  </button>
                </div>

                {/* Main scrollable body of system notifications */}
                <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-grow custom-scrollbar">
                  
                  {/* PWA & APK Installation Block */}
                  <div className="bg-gradient-to-br from-emerald-950/20 to-teal-950/10 border border-emerald-500/30 p-4 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                    <span className="absolute right-[-10px] bottom-[-10px] text-emerald-500/10 opacity-30 select-none pointer-events-none transform rotate-12">
                      <Smartphone className="h-24 w-24" />
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-950/50 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded w-fit uppercase font-bold tracking-wider">PREMIUM APK GENERATOR</span>
                    <h4 className="font-display font-bold text-slate-100 text-xs mt-1">Como instalar como App Nativo</h4>
                    <p className="text-[10.5px] text-zinc-400 leading-relaxed">
                      Transforme este companion em um aplicativo real no seu celular Android. Clique abaixo para registrar o PWA ou consulte as instruções para gerar o APK local via Capacitor!
                    </p>
                    <div className="flex gap-2.5 mt-2">
                      <button 
                        onClick={triggerPwaInstall}
                        className="flex-grow bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-slate-950 font-bold py-2 rounded-xl text-xs transition cursor-pointer font-sans"
                      >
                        ✓ Instalar App (PWA)
                      </button>
                      <button 
                        onClick={() => {
                          addLog('Iniciando transferência das diretrizes de compilação da APK nativa...', 'DEVICE', 'info');
                          alert('Instruções detalhadas exportadas! Veja os arquivos "/android-apk-instructions.txt" e "/manifest.json" no explorador de arquivos principal do IDE.');
                        }}
                        className="bg-slate-800 hover:bg-slate-700 hover:text-emerald-400 text-zinc-300 py-2 px-3.5 rounded-xl text-xs transition font-semibold cursor-pointer border border-slate-700"
                      >
                        Guia APK (.txt)
                      </button>
                    </div>

                    <AnimatePresence>
                      {showInstallSuccess && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-2.5 p-2 px-3 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono flex items-center gap-1.5"
                        >
                          <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                          Aplicativo instalado para a sua Tela Inicial com sucesso!
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Dynamic target input: switch superintendent workspace */}
                  <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                      <Sliders className="h-3 w-3 text-emerald-400" /> Endereço do Superintendente
                    </span>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        placeholder="Insira a URL alternativa do superintendente"
                        className="flex-grow bg-slate-950 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-[10px] font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 transition"
                      />
                      <button 
                        onClick={() => {
                          if (customUrlInput.trim()) {
                            addLog('System update: Alternando o link de visualização', 'SUPERINTENDENT', 'warning');
                            setUrl(customUrlInput.trim());
                            setIsShadeOpen(false);
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 rounded-xl text-[10px] transition cursor-pointer"
                      >
                        OK
                      </button>
                    </div>

                    {/* Presets Grid */}
                    <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                      {[
                        { label: 'Superintendent Mode', url: 'https://ais-pre-h3ve3nynzxhojmrha7kf3h-750421392181.us-east1.run.app/?mode=superintendent' },
                        { label: 'Inspector diagnostics', url: 'https://ais-pre-h3ve3nynzxhojmrha7kf3h-750421392181.us-east1.run.app/?mode=inspector' }
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => {
                            setUrl(preset.url);
                            setCustomUrlInput(preset.url);
                            addLog(`Switching simulation perspective to: ${preset.label}`, 'SUPERINTENDENT', 'info');
                            setIsShadeOpen(false);
                          }}
                          className={`p-2 rounded-xl text-left border text-[9.5px] transition leading-tight ${
                            url === preset.url 
                              ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-300' 
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hardware Emulator Variables */}
                  <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex flex-col gap-3">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Simular Parâmetros de Hardware</span>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {/* Simulated Battery Slider */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono text-zinc-500">Bateria ({settings.batteryLevel}%)</label>
                        <input 
                          type="range" 
                          min="5" 
                          max="100" 
                          value={settings.batteryLevel}
                          onChange={(e) => setSettings({ ...settings, batteryLevel: Number(e.target.value) })}
                          className="w-full h-1 accent-emerald-500 bg-slate-950 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Screen Wallpaper Selector */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-mono text-zinc-500">Wallpaper do Fundo</label>
                        <select 
                          value={settings.wallpaper} 
                          onChange={(e) => setSettings({ ...settings, wallpaper: e.target.value as any })}
                          className="bg-slate-950 border border-slate-800 rounded-lg p-1 text-[10px] text-zinc-300 focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="cosmic-dark">Cosmic Dark</option>
                          <option value="electric-green">Electric Green</option>
                          <option value="neon-cyan">Neon Cyan</option>
                          <option value="material-you">Material You</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Superintendent Notes (Anotações Administrador) */}
                  <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                      <Bookmark className="h-3 w-3 text-amber-400" /> Notas Administrativas Locais
                    </span>
                    <div className="flex gap-2">
                      <textarea 
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Escreva notas de vistorias..."
                        rows={2}
                        className="flex-grow bg-slate-950 border border-slate-800 rounded-xl p-2 text-[10px] outline-none focus:border-amber-500 resize-none text-slate-200"
                      />
                      <button 
                        onClick={() => {
                          if (noteInput.trim()) {
                            addNote(noteInput.trim());
                            setNoteInput('');
                            addLog('Canais avaliados e notas de vistoria salvas localmente', 'SUPERINTENDENT', 'success');
                          }
                        }}
                        className="bg-amber-600 hover:bg-amber-500 font-bold px-3 text-slate-950 rounded-xl text-[10px] transition cursor-pointer"
                      >
                        Salvar
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5 max-h-[100px] overflow-y-auto custom-scrollbar pt-1">
                      {notes.length === 0 ? (
                        <div className="text-[9.5px] text-zinc-500 text-center py-2 italic">Nenhuma anotação gravada</div>
                      ) : (
                        notes.map((note) => (
                          <div key={note.id} className="p-2 bg-slate-950/60 rounded-lg border border-slate-800 flex justify-between gap-2 text-[9.5px]">
                            <span className="text-zinc-300">{note.content}</span>
                            <button 
                              onClick={() => deleteNote(note.id)}
                              className="text-red-500 hover:text-red-400 font-bold cursor-pointer"
                            >
                              X
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Android Logcat Shell Drawer */}
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 p-3 flex flex-col gap-1.5 h-[160px]">
                    <div className="flex justify-between items-center text-[10px] border-b border-slate-900 pb-1.5">
                      <span className="font-mono text-zinc-400 uppercase flex items-center gap-1">
                        <Terminal className="h-3 w-3 text-cyan-400" /> Logcat do Android Shell
                      </span>
                      <button 
                        onClick={clearLogs} 
                        className="text-[9px] hover:text-red-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded transition border border-slate-800 border-dashed"
                      >
                        Limpar
                      </button>
                    </div>
                    <div className="flex-grow overflow-y-auto text-[9px] font-mono leading-relaxed space-y-1 custom-scrollbar">
                      {logs.map((log) => {
                        const styleMap = {
                          'info': 'text-cyan-400',
                          'success': 'text-emerald-400',
                          'warning': 'text-amber-400',
                          'error': 'text-rose-500'
                        };
                        return (
                          <div key={log.id} className="flex gap-1.5 font-mono select-text truncate">
                            <span className="text-zinc-500 font-bold">[{log.time}]</span>
                            <span className={`px-1 rounded text-[8.5px] ${
                              log.category === 'SUPERINTENDENT' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-900 text-slate-300'
                            }`}>{log.category}</span>
                            <span className={styleMap[log.severity] + " break-all"}>{log.message}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Footer of Shade */}
                <div className="p-4 border-t border-slate-900 bg-slate-900/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>DISPOSITIVO: AI TENSOR G4 • PORTAL COMPANION</span>
                  <button 
                    onClick={() => {
                      setIsShadeOpen(false);
                      setIsLocked(true);
                      addLog('Simulator put to sleep from dropdown options', 'DEVICE', 'info');
                    }}
                    className="p-1 px-3 text-zinc-300 hover:text-emerald-400 cursor-pointer"
                  >
                    Bloquear Tela
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN WEB VIEW PORTAL AREA (SANDBOX TARGET SCREEN) */}
          <div className="relative flex-grow w-full h-full bg-slate-950 overflow-hidden">
            <AnimatePresence mode="wait">
              {isLocked ? (
                /* Sleek lockscreen layout */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40 bg-slate-950/95 flex flex-col justify-between items-center text-slate-400 p-8 py-16"
                >
                  <p className="font-display font-light text-5xl text-slate-200 tracking-wider mt-4">{localTime}</p>
                  <p className="text-xs text-neutral-400 mt-2 font-mono uppercase tracking-widest">Segunda-feira, 15 de Junho</p>
                  
                  <div className="w-16 h-16 rounded-full border border-slate-800/80 hover:border-emerald-500/40 hover:bg-emerald-950/10 flex items-center justify-center animate-pulse transition-all cursor-pointer">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setIsLocked(false);
                      addLog('Dispositivo Desbloqueado com sucesso', 'DEVICE', 'success');
                    }}
                    className="px-6 py-2 text-xs font-semibold tracking-wider text-slate-100 bg-slate-900 border border-slate-700/80 hover:border-emerald-500 hover:text-emerald-400 rounded-full transition-all cursor-pointer"
                  >
                    Desbloquear
                  </button>
                </motion.div>
              ) : (
                /* Live Embedded Superintendent Web Frame */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full relative flex flex-col"
                >
                  {/* Real-time Android Browser Chrome Address Bar */}
                  <div className="w-full bg-[#111625] border-b border-slate-800/80 px-2.5 py-1.5 flex items-center justify-between gap-1.5 z-25 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                    <div className="bg-slate-950 border border-slate-800/80 rounded-lg px-2 py-1 flex items-center justify-between gap-1.5 flex-grow max-w-[240px]">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className="text-emerald-400 text-[10px]" title="Conexão Segura">🔒</span>
                        <span className="text-[9px] font-mono text-zinc-400 truncate tracking-tight">{url}</span>
                      </div>
                      <button 
                        onClick={reloadIframe}
                        className="text-zinc-500 hover:text-emerald-400 transition"
                        title="Recarregar"
                      >
                        <RefreshCw className="h-2.5 w-2.5" />
                      </button>
                    </div>

                    <a 
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-slate-950 text-[10px] font-mono font-bold transition flex items-center gap-1 shadow-md cursor-pointer shrink-0"
                      title="Abrir diretamente em nova aba"
                    >
                      <span>ABRIR ↗</span>
                    </a>
                  </div>

                  {/* Inside layout containing iframe and notifications */}
                  <div className="relative flex-grow w-full bg-slate-950 overflow-hidden">
                    {iframeLoading && (
                      <div className="absolute inset-0 bg-slate-950/95 z-20 flex flex-col justify-center items-center p-8 text-center bg-[#070a13]">
                        <div className="relative flex items-center justify-center mb-4">
                          <div className="w-14 h-14 rounded-full border-2 border-emerald-500/10 border-t-emerald-400 animate-spin"></div>
                          <Smartphone className="h-5 w-5 text-emerald-400 absolute" />
                        </div>
                        <span className="font-display font-medium text-sm text-slate-200">WebView Android</span>
                        <span className="text-[9.5px] font-mono text-zinc-500 mt-1.5 truncate max-w-[220px]">{url}</span>
                      </div>
                    )}

                    <iframe 
                      key={iframeKey}
                      id="simulated-webview"
                      src={url}
                      onLoad={handleIframeLoad}
                      className="w-full h-full border-none bg-slate-950"
                      title="Android App Container Layer"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      referrerPolicy="no-referrer"
                    />

                    {/* Clever dynamic helper if iframe fails or is blocked by X-Frame-Options */}
                    <AnimatePresence>
                      {showFrameWarning && (
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 30 }}
                          className="absolute bottom-4 left-3.5 right-3.5 z-30 bg-slate-900/95 backdrop-blur-md border border-amber-500/40 p-3 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.6)] flex gap-2.5 items-start"
                        >
                          <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-grow">
                            <h4 className="text-[10px] font-sans font-semibold text-slate-100 flex justify-between items-center leading-none">
                              <span>Sua Conexão foi Recusada?</span>
                              <button 
                                onClick={() => setShowFrameWarning(false)}
                                className="text-zinc-500 hover:text-slate-200 cursor-pointer"
                                title="Dispensar aviso"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </h4>
                            <p className="text-[8.5px] text-zinc-400 leading-normal mt-1">
                              Servidores privados de visualização do Google AI Studio bloqueiam aninhamento em iframes (erro <code>X-Frame-Options</code>). Toque no botão verde <b>ABRIR ↗</b> no topo do celular para usar sem limites!
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 
                    EXTREMELY ADVANCED SWIPE DOWN / EXPAND BUTTON BAR
                    A sleek pill button that reminds users they can pull down to customize.
                  */}
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
                    <button 
                      onClick={() => {
                        setIsShadeOpen(!isShadeOpen);
                        addLog('Opening Android Notification drawer shortcuts', 'DEVICE', 'info');
                      }}
                      className="group bg-slate-950/90 hover:bg-slate-900/90 text-zinc-500 hover:text-emerald-400 transition-all border border-slate-800/80 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-xl text-[9px] font-mono"
                      title="Menu de Ajustes do Aplicativo"
                    >
                      <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                      <span>MENU SISTEMA</span>
                      <ChevronDown className="h-3 w-3 group-hover:translate-y-0.5 transition" />
                    </button>
                  </div>

                  {/* 
                    GORGEOUS FLOATING STOPWATCH / CRONÔMETRO APP OVERLAY WIDGET
                    As requested: "mantendo exatamente o cronômetro como está. Crie um favicon bonito; use um display como ícon do favicon para o app e garanta que ele seja compatível como o picture-in-picture."
                  */}
                  <motion.div 
                    drag
                    dragMomentum={false}
                    dragConstraints={{ left: 10, right: 210, top: 20, bottom: 500 }}
                    className="absolute z-30 bottom-16 right-4 p-3.5 bg-slate-950/95 backdrop-blur-md rounded-2xl border border-emerald-500/30 shadow-[0_12px_24px_rgba(0,0,0,0.8)] glow-active text-[11px] text-slate-100 flex flex-col gap-2.5 w-[155px] cursor-grab active:cursor-grabbing font-sans"
                    initial={{ x: 0, y: 0 }}
                  >
                    {/* Widget Drag-bar Header */}
                    <div className="flex justify-between items-center select-none border-b border-slate-900 pb-1.5">
                      <span className="font-display font-medium text-[9.5px] uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        CRONÔMETRO
                      </span>
                      <button 
                        onClick={() => setCronCollapsed(!cronCollapsed)}
                        className="p-0.5 hover:bg-slate-900 rounded-md text-zinc-500 hover:text-emerald-400"
                        title={cronCollapsed ? "Expandir cronômetro" : "Recolher cronômetro"}
                      >
                        {cronCollapsed ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    </div>

                    {!cronCollapsed ? (
                      <>
                        {/* Interactive Large Monospace Clock readout */}
                        <div className="text-center py-1 bg-slate-900 border border-slate-800/80 rounded-xl">
                          <p className="font-mono font-bold text-lg text-slate-200 tracking-wide select-all">
                            {formatCronTime(cronTime)}
                          </p>
                        </div>

                        {/* Timing Control button row */}
                        <div className="flex justify-between items-center gap-1 px-0.5">
                          {/* Play/Pause */}
                          <button
                            onClick={() => {
                              setCronActive(!cronActive);
                              addLog(cronActive ? 'Cronômetro pausado' : 'Cronômetro iniciado', 'SUPERINTENDENT', 'info');
                            }}
                            className={`p-1.5 rounded-lg flex-grow flex justify-center cursor-pointer transition ${
                              cronActive 
                                ? 'bg-amber-950/30 text-amber-500 border border-amber-500/20 hover:bg-amber-900/30' 
                                : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-900/40'
                            }`}
                          >
                            {cronActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-emerald-400" />}
                          </button>

                          {/* Split lap list recorder if active, or Reset if paused */}
                          {cronActive ? (
                            <button
                              onClick={handleAddLap}
                              className="p-1.5 rounded-lg bg-cyan-950/30 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-900/30 flex justify-center flex-grow cursor-pointer"
                              title="Gravar volta (Lap)"
                            >
                              <Layers className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setCronTime(0);
                                setLaps([]);
                                addLog('Cronômetro zerado e laps limpas', 'SUPERINTENDENT', 'info');
                              }}
                              className="p-1.5 rounded-lg bg-slate-900 text-zinc-400 border border-slate-800 hover:text-rose-400 hover:border-rose-500/20 flex justify-center flex-grow cursor-pointer"
                              title="Zerar cronômetro"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Recent laps mini logger list */}
                        {laps.length > 0 && (
                          <div className="flex flex-col gap-1 border-t border-slate-900 pt-2.5 max-h-[50px] overflow-y-auto custom-scrollbar">
                            {laps.map((lap, idx) => (
                              <div key={idx} className="flex justify-between text-[8px] font-mono text-zinc-500">
                                <span>VOLTA {laps.length - idx}</span>
                                <span className="text-zinc-300 font-bold">{lap}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      /* Collapsed display mini-badge counter */
                      <div className="text-center font-mono font-black text-xs text-emerald-400 bg-slate-900/50 py-1 rounded-xl border border-slate-900">
                        ⏱ {formatCronTime(cronTime).split('.')[0]}s
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Android System Bottom Navigation buttons */}
          {!isLocked && (
            <div className="w-full flex justify-around items-center py-3 bg-black/80 border-t border-slate-900/60 z-30">
              <button 
                onClick={() => {
                  reloadIframe();
                  addLog('Back click: Reiniciando canal de renderização do iFrame', 'DEVICE', 'info');
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-100 transition active:scale-90"
                title="Voltar / Recarregar canal"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
              
              <button 
                onClick={() => {
                  addLog('Home pressed: Retornando à homepage administrativa', 'DEVICE', 'success');
                  setIframeLoading(true);
                  setSettings({ ...settings, showStatusBar: true });
                  setIframeKey(p => p + 1);
                }}
                className="p-1 rounded-full text-slate-100 hover:text-emerald-400 transition active:scale-90"
                title="Ir à Home"
              >
                <Home className="h-4.5 w-4.5" />
              </button>

              <button 
                onClick={() => {
                  setIsShadeOpen(!isShadeOpen);
                  addLog('App Switcher pressed. Abrindo configurações no drawer principal', 'DEVICE', 'info');
                }}
                className={`p-1 rounded-full transition active:scale-90 ${isShadeOpen ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-100'}`}
                title="Lista de tarefas / Drawer de Ajustes"
              >
                <Menu className="h-4.5 w-4.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default PhoneSimulator;
