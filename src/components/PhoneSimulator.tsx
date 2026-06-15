import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCw, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Wifi, 
  Signal, 
  Battery, 
  Info, 
  Maximize2, 
  Minimize2, 
  ArrowLeft, 
  Home, 
  Menu,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { DeviceSettings, SystemLog } from '../types';

interface PhoneSimulatorProps {
  settings: DeviceSettings;
  setSettings: (settings: DeviceSettings) => void;
  url: string;
  isPip: boolean;
  setIsPip: (pip: boolean) => void;
  addLog: (msg: string, cat: SystemLog['category'], sev: SystemLog['severity']) => void;
}

export function PhoneSimulator({ 
  settings, 
  setSettings, 
  url, 
  isPip, 
  setIsPip, 
  addLog 
}: PhoneSimulatorProps) {
  const [localTime, setLocalTime] = useState('12:00');
  const [iframeKey, setIframeKey] = useState(0);
  const [volume, setVolume] = useState(70);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isScreenSaving, setIsScreenSaving] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const volumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync real device clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setLocalTime(`${hrs}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000) as any;
    return () => clearInterval(timer);
  }, []);

  // Handle hardware physical volume adjustments
  const handleVolumeChange = (direction: 'up' | 'down') => {
    addLog(`Volume Rocker Pressed (${direction})`, 'DEVICE', 'info');
    setVolume(prev => {
      const step = 10;
      const next = direction === 'up' ? Math.min(prev + step, 100) : Math.max(prev - step, 0);
      return next;
    });
    setShowVolumeSlider(true);

    if (volumeTimerRef.current) {
      clearTimeout(volumeTimerRef.current);
    }
    volumeTimerRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 2500);
  };

  const reloadIframe = () => {
    addLog('Hard reloading companion Android application webview', 'NETWORK', 'info');
    setIframeLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleIframeLoad = () => {
    setIframeLoading(false);
    addLog('Android WebApp process loaded successfully inside Sandbox', 'NETWORK', 'success');
  };

  // Device styling definitions
  const bezelThemes = {
    'modern-flagship': 'border-gray-800 bg-gray-900 ring-4 ring-neutral-400 ring-offset-4 ring-offset-slate-900',
    'dark-titanium': 'border-zinc-700 bg-zinc-800 ring-4 ring-zinc-500 ring-offset-4 ring-offset-zinc-900',
    'classic-bezel': 'border-slate-900 bg-slate-950 ring-2 ring-slate-800 rounded-[3rem]'
  };

  const wallpapers = {
    'cosmic-dark': 'bg-gradient-to-tr from-slate-950 via-[#1e1b4b] to-indigo-950',
    'electric-green': 'bg-gradient-to-tr from-black via-[#064e3b] to-indigo-950',
    'neon-cyan': 'bg-gradient-to-tr from-[#020617] via-[#083344] to-[#111827]',
    'material-you': 'bg-gradient-to-tr from-teal-950 via-[#2d224d] to-indigo-950',
    'abyss-pulse': 'bg-gradient-to-tr from-[#030712] via-[#111827] to-[#1f2937]'
  };

  // Dimensions based on orientation
  const isLandscape = settings.orientation === 'landscape';
  const widthClass = isLandscape ? 'h-[440px] w-[880px]' : 'w-[390px] h-[780px]';

  // Floating Pip scale sizes
  const pipStyles = isPip 
    ? "fixed bottom-6 right-6 z-50 shadow-2xl drop-shadow-[0_25px_25px_rgba(16,185,129,0.2)] border border-emerald-500/30 rounded-[2.5rem] bg-slate-950 overflow-hidden transform scale-75 origin-bottom-right"
    : "";

  return (
    <div id="phone-container-wrapper" className={`${pipStyles} transition-all duration-300`}>
      {isPip && (
        <div className="absolute top-2 left-0 right-0 z-50 flex justify-between items-center px-6 py-2 bg-gradient-to-b from-black/80 to-transparent text-xs text-emerald-400">
          <span className="flex items-center gap-1 font-mono text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            PIP COMPATIBLE VIEW
          </span>
          <button 
            onClick={() => {
              setIsPip(false);
              addLog('Disabled Android Picture-in-Picture simulator overlay', 'PIP', 'success');
            }} 
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-emerald-400 transition"
            title="Maxmize Simulator"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Screen Physical Frame */}
      <div 
        className={`relative ${widthClass} rounded-[2.8rem] border-[12px] ${bezelThemes[settings.bezelStyle]} flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 select-none`}
        style={{ transform: `scale(${isPip ? 0.9 : settings.zoom / 100})`, transformOrigin: 'center center' }}
      >
        {/* Physical hardware buttons representation */}
        {/* Power Button */}
        <button 
          onClick={() => {
            setIsLocked(!isLocked);
            addLog(isLocked ? 'Device screen unlocked' : 'Device screen locked/put to sleep', 'DEVICE', 'info');
          }}
          className={`absolute ${isLandscape ? 'top-[-12px] right-24 h-[4px] w-12' : 'right-[-12px] top-28 w-[4px] h-12'} bg-neutral-600 rounded-full hover:bg-neutral-500 active:scale-95 transition-all z-40`}
          title="Fisiacal lock / sleep button"
        />

        {/* Volume Up */}
        <button 
          onClick={() => handleVolumeChange('up')}
          className={`absolute ${isLandscape ? 'top-[-12px] right-44 h-[4px] w-10' : 'left-[-12px] top-24 w-[4px] h-10'} bg-neutral-600 rounded-full hover:bg-neutral-500 active:scale-95 transition-all z-40`}
          title="Volume rock + button"
        />

        {/* Volume Down */}
        <button 
          onClick={() => handleVolumeChange('down')}
          className={`absolute ${isLandscape ? 'top-[-12px] right-56 h-[4px] w-10' : 'left-[-12px] top-36 w-[4px] h-10'} bg-neutral-600 rounded-full hover:bg-neutral-500 active:scale-95 transition-all z-40`}
          title="Volume rock - button"
        />

        {/* Wallpaper background layer */}
        <div className={`absolute inset-0 z-0 ${wallpapers[settings.wallpaper]} transition-all duration-700`} />

        {/* Active Application / Lock Screen wrapper */}
        <div className="relative w-full h-full flex flex-col justify-between z-10 overflow-hidden">
          
          {/* 1. Android Status Bar */}
          {settings.showStatusBar && (
            <div className={`w-full flex justify-between items-center px-6 pt-3 pb-2 z-30 transition-all duration-200 ${isLandscape ? 'px-8 bg-black/40' : 'bg-black/20 backdrop-blur-[1px]'}`}>
              {/* Left Side: Clock */}
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-semibold text-xs text-slate-100 tracking-wide">{localTime}</span>
                <span className="text-[10px] scale-90 font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">{settings.networkType}</span>
              </div>

              {/* Punch hole Camera Notch (Simulator Centerpiece) */}
              {!isLandscape && (
                <div className="w-4 h-4 rounded-full bg-slate-950 border-2 border-neutral-800 shadow-inner flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-900/40"></div>
                </div>
              )}

              {/* Right Side Status Elements */}
              <div className="flex items-center gap-2 text-slate-100">
                <div className="flex items-center gap-0.5" title="5G Cellular Status">
                  <Signal className="h-3.5 w-3.5 text-neutral-200" />
                  <span className="text-[9px] font-bold text-slate-200">5G</span>
                </div>
                <Wifi className="h-3.5 w-3.5 text-slate-100" />
                <div className="flex items-center gap-1">
                  <Battery className="h-3.5 w-3.5 text-slate-100" />
                  <span className="text-[10px] font-mono text-slate-200">{settings.batteryLevel}%</span>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATED HARDWARE HUD: Volume Overlay */}
          <AnimatePresence>
            {showVolumeSlider && (
              <motion.div 
                initial={{ opacity: 0, x: isLandscape ? 0 : -30, y: isLandscape ? -30 : 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: isLandscape ? 0 : -20, y: isLandscape ? -20 : 0 }}
                className={`absolute z-50 bg-slate-900/90 backdrop-blur-md rounded-2xl flex items-center gap-2.5 p-3.5 border border-slate-700/60 shadow-xl ${
                  isLandscape 
                    ? 'top-4 left-1/2 -translate-x-1/2 w-48' 
                    : 'left-4 top-40 w-12 flex-col h-40 justify-between'
                }`}
              >
                {volume > 0 ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4 text-rose-500" />}
                <div className={`relative bg-slate-800 rounded-full flex-grow overflow-hidden ${isLandscape ? 'h-1.5 w-full' : 'w-1.5 h-full'}`}>
                  <div 
                    className="bg-emerald-500 rounded-full transition-all duration-100" 
                    style={isLandscape ? { width: `${volume}%`, height: '100%' } : { height: `${volume}%`, width: '100%', position: 'absolute', bottom: 0 }}
                  />
                </div>
                <span className="text-[10px] font-mono text-zinc-300 font-bold">{volume}%</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN WEB VIEW AREA / IFRAME DISPLAY */}
          <div className="relative flex-grow w-full h-full bg-slate-900 overflow-hidden">
            <AnimatePresence mode="wait">
              {isLocked ? (
                /* Sleep Screen Locked Mode */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40 bg-slate-950 flex flex-col justify-center items-center text-slate-400"
                >
                  <p className="font-display font-light text-4xl text-slate-200 tracking-wide">{localTime}</p>
                  <p className="text-xs text-neutral-400 mt-2">Segunda-feira, 15 de Junho</p>
                  <div className="mt-20 w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center animate-pulse">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <button 
                    onClick={() => {
                      setIsLocked(false);
                      addLog('Simulator unlocked', 'DEVICE', 'success');
                    }}
                    className="mt-6 px-4 py-1.5 text-xs font-medium text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-full transition cursor-pointer border border-slate-700"
                  >
                    Desbloquear
                  </button>
                </motion.div>
              ) : (
                /* Active Android Iframe Web Loader */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full relative"
                >
                  {iframeLoading && (
                    <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col justify-center items-center p-8 text-center">
                      <div className="relative flex items-center justify-center mb-4">
                        <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
                        <Laptop className="h-5 w-5 text-emerald-400 absolute" />
                      </div>
                      <span className="font-display font-medium text-sm text-slate-200">Inicializando WebView Android</span>
                      <span className="text-[10px] font-mono text-zinc-500 mt-1 max-w-[210px] block truncate">{url}</span>
                    </div>
                  )}

                  <iframe 
                    key={iframeKey}
                    id="simulated-webview"
                    src={url}
                    onLoad={handleIframeLoad}
                    className="w-full h-full border-none bg-slate-950"
                    title="Simulated Android App Sandbox"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Bottom Android Navigation Controls */}
          {!isLocked && (
            <div className="w-full flex justify-around items-center py-2.5 bg-black/60 border-t border-slate-900/60 z-30">
              <button 
                onClick={() => {
                  reloadIframe();
                  addLog('Android Simulator Back-trigger: Reloading WebView context', 'DEVICE', 'info');
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-100 transition active:scale-90"
                title="Voltar / Recarregar"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={() => {
                  addLog('Android Home button pressed, returning to superintendent default homepage', 'DEVICE', 'success');
                  setIframeLoading(true);
                  setSettings({ ...settings, showStatusBar: true });
                  setIframeKey(p => p + 1);
                }}
                className="p-1 rounded-full text-slate-100 hover:text-emerald-400 transition active:scale-90"
                title="Google Smart Home"
              >
                <Home className="h-4 w-4" />
              </button>
              <button 
                onClick={() => {
                  addLog('App Switcher pressed. Showing virtual sandbox memory metrics.', 'DEVICE', 'info');
                  alert(`Memória do Applet simulador está saudável. IFrame sandbox está rodando a URL do Superintendente: ${url}`);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-100 transition active:scale-90"
                title="Recent Apps List"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default PhoneSimulator;
