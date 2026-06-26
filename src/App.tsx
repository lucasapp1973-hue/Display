import React, { useState, useEffect } from 'react';
import { Smartphone, RefreshCw, ArrowLeft, Home, Menu, Wifi, Signal, Battery, ExternalLink } from 'lucide-react';
// @ts-ignore
import superintendentIcon from './assets/images/superintendent_icon_1782443595694.jpg';

export default function App() {
  const targetUrl = 'https://ais-pre-h3ve3nynzxhojmrha7kf3h-750421392181.us-east1.run.app/?mode=superintendent';
  const [localTime, setLocalTime] = useState('12:00');
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Sync clock to current local time
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

  // Programmatically hide browser URL bar / navigation bar in mobile PWAs instantly on mount
  useEffect(() => {
    const hideAddressBar = () => {
      window.scrollTo(0, 1);
    };

    // Capture actual early human taps to guarantee address bar collapse safely (trusted events)
    const handleInitialInteraction = () => {
      hideAddressBar();
      document.removeEventListener('touchstart', handleInitialInteraction);
      document.removeEventListener('click', handleInitialInteraction);
    };

    // Trigger on load
    hideAddressBar();

    document.addEventListener('touchstart', handleInitialInteraction, { passive: true });
    document.addEventListener('click', handleInitialInteraction, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleInitialInteraction);
      document.removeEventListener('click', handleInitialInteraction);
    };
  }, []);

  const handleReload = () => {
    setIframeLoading(true);
    setIframeKey(p => p + 1);
  };

  return (
    <div className="w-full h-full bg-[#060813] text-gray-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Futuristic Background Glow Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none z-0" />

      {/* Pure Native Android Shell Wrapper (Centered with sleek flagship dimensions) */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Physical Smartphone Frame Layout */}
        <div className="relative w-[380px] h-[760px] rounded-[3.2rem] border-[12px] border-zinc-800 bg-black flex flex-col justify-between overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] ring-2 ring-slate-800/60">
          
          {/* Punch-hole camera physical sensor */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-neutral-800 z-50 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-900/30"></div>
          </div>

          {/* 1. Android Status Bar */}
          <div className="w-full flex justify-between items-center px-6 pt-3.5 pb-2.5 z-30 bg-black/40 backdrop-blur-[1px]">
            {/* Left side info */}
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-semibold text-[11.5px] text-slate-100 tracking-wide">{localTime}</span>
              <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest font-bold leading-none">5G ULTRA</span>
            </div>
            {/* Right side icons */}
            <div className="flex items-center gap-2 text-slate-200">
              <Signal className="h-3 w-3 text-neutral-300" />
              <Wifi className="h-3 w-3 text-neutral-300" />
              <div className="flex items-center gap-0.5">
                <Battery className="h-3 w-3 text-emerald-400" />
                <span className="text-[10px] font-mono font-medium">98%</span>
              </div>
            </div>
          </div>

          {/* 2. Embedded Web Content viewport */}
          <div className="relative flex-grow w-full h-full bg-slate-950 overflow-hidden">
            {iframeLoading && (
              <div className="absolute inset-0 bg-[#070a13] z-20 flex flex-col justify-center items-center p-8 text-center">
                <div className="relative flex flex-col items-center justify-center mb-5">
                  {/* Glowing Launcher Icon Frame */}
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(59,130,246,0.35)] border border-blue-500/30 mb-4 animate-pulse">
                    <img 
                      src={superintendentIcon} 
                      alt="Superintendent Launcher Icon"
                      className="w-full h-full object-cover select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Minimal native circular loading ring below icon */}
                  <div className="w-6 h-6 rounded-full border-2 border-blue-500/10 border-t-blue-400 animate-spin"></div>
                </div>
                <span className="font-sans font-semibold text-sm text-slate-100 tracking-wide">Iniciando Portal Superintendente</span>
                <span className="text-[9.5px] font-mono text-blue-400/70 mt-1 uppercase tracking-wider font-bold">Conexão Segura Ativa</span>
              </div>
            )}

            <iframe 
              key={iframeKey}
              src={targetUrl}
              onLoad={() => setIframeLoading(false)}
              className="w-full h-full border-none bg-slate-950"
              title="Android Embedded View"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* 3. Standard Android Navigation Keys */}
          <div className="w-full flex justify-around items-center py-3 bg-black/90 border-t border-slate-900/60 z-30">
            <button 
              onClick={handleReload}
              className="p-1 rounded-full text-slate-400 hover:text-slate-100 transition active:scale-90"
              title="Voltar / Recarregar"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={handleReload}
              className="p-1 rounded-full text-slate-100 hover:text-emerald-400 transition active:scale-90"
              title="Ir para a Home"
            >
              <Home className="h-4 w-4" />
            </button>
            <button 
              onClick={handleReload}
              className="p-1 rounded-full text-slate-400 hover:text-slate-100 transition active:scale-90"
              title="Recarregar"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
