import React, { useState, useEffect, useRef } from 'react';
import { 
  Laptop, 
  Settings, 
  Smartphone, 
  Maximize2, 
  Minimize2, 
  Layers, 
  RefreshCw, 
  Activity, 
  Terminal, 
  Plus, 
  Trash2, 
  Sliders, 
  Sparkles, 
  Bookmark, 
  ExternalLink,
  Cpu,
  Radio,
  Play,
  Share2
} from 'lucide-react';
import { DeviceSettings, WorkspaceNote, SystemLog, PresetMode } from '../types';

interface DashboardProps {
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

export function Dashboard({
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
}: DashboardProps) {
  const [newNoteText, setNewNoteText] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState(url);
  const [cpuUsage, setCpuUsage] = useState(24);
  const [wifiPing, setWifiPing] = useState(28);
  const [nativePipSupport, setNativePipSupport] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Check Document Picture-in-Picture support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setNativePipSupport('documentPictureInPicture' in window);
    }
  }, []);

  // Fluctuating values for cool stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.round(20 + Math.random() * 15));
      setWifiPing(Math.round(24 + Math.random() * 8));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      addLog(`Superintendent targets manual override to: ${customUrlInput}`, 'SUPERINTENDENT', 'warning');
      setUrl(customUrlInput.trim());
    }
  };

  const presetModes: PresetMode[] = [
    { 
      name: 'Superintendente', 
      url: 'https://ais-pre-h3ve3nynzxhojmrha7kf3h-750421392181.us-east1.run.app/?mode=superintendent',
      description: 'Painel de gerenciamento principal de canais com telemetria total',
      badge: 'Superintendent'
    },
    { 
      name: 'Inspector Mode', 
      url: 'https://ais-pre-h3ve3nynzxhojmrha7kf3h-750421392181.us-east1.run.app/?mode=inspector',
      description: 'Configuração com foco em diagnósticos e auditorias automáticas',
      badge: 'Inspector'
    },
    { 
      name: 'Admin Operator', 
      url: 'https://ais-pre-h3ve3nynzxhojmrha7kf3h-750421392181.us-east1.run.app/?mode=admin',
      description: 'Acesso direto do operador com chaves de depuração estendidas',
      badge: 'Admin'
    },
    { 
      name: 'Standard Portal', 
      url: 'https://ais-pre-h3ve3nynzxhojmrha7kf3h-750421392181.us-east1.run.app/',
      description: 'Interface web móvel nativa de controle comum e visualização',
      badge: 'Public'
    }
  ];

  const faviconPalettes = [
    { name: 'Emerald Glow (Padrão)', main: '#10b981', accent: '#3b82f6', classes: 'border-emerald-500 text-emerald-400 bg-emerald-950/20' },
    { name: 'Amber Warning', main: '#eab308', accent: '#ef4444', classes: 'border-amber-500 text-amber-400 bg-amber-950/20' },
    { name: 'Neon Electric', main: '#06b6d4', accent: '#a855f7', classes: 'border-cyan-500 text-cyan-400 bg-cyan-950/20' },
    { name: 'Crimson Ops', main: '#ef4444', accent: '#ffffff', classes: 'border-rose-500 text-rose-400 bg-rose-950/20' },
  ];

  const launchNativePip = async () => {
    addLog('Requesting system native window Picture-in-Picture mode...', 'PIP', 'info');
    if (!nativePipSupport) {
      addLog('Native browser PiP unsupported or blocked. Launching internal PiP layout fallback.', 'PIP', 'warning');
      setIsPip(true);
      return;
    }

    try {
      // Create a Document Picture-in-Picture window
      const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
        width: 400,
        height: 740,
      });

      addLog('Native document Picture-in-Picture window opened successfully!', 'PIP', 'success');

      // Link stylesheets so tailwind renders inside the floating window
      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
          const style = document.createElement('style');
          style.textContent = cssRules;
          pipWindow.document.head.appendChild(style);
        } catch (e) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = styleSheet.href || '';
          pipWindow.document.head.appendChild(link);
        }
      });

      // Simple body background for native window
      pipWindow.document.body.className = "bg-[#0b0f19] flex items-center justify-center min-h-screen p-4 overflow-hidden";
      
      // Move phone container structure into pipWindow
      const containerNode = document.getElementById('phone-container-wrapper');
      if (containerNode) {
        pipWindow.document.body.appendChild(containerNode);
      }

      // Restore elements on pip closed
      pipWindow.addEventListener('pagehide', () => {
        addLog('Native Picture-in-Picture window closed. Retransmitting node focus to desktop layout.', 'PIP', 'info');
        const originalParent = document.getElementById('phone-mount-point');
        if (originalParent && containerNode) {
          originalParent.appendChild(containerNode);
        }
      });

    } catch (err: any) {
      addLog(`Native PiP initialization failed: ${err.message}. Turning on custom widget overlay.`, 'PIP', 'error');
      setIsPip(true);
    }
  };

  const submitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteText.trim()) {
      addNote(newNoteText.trim());
      addLog('Superintendent notes entry added to local database storage', 'SUPERINTENDENT', 'success');
      setNewNoteText('');
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 text-sm text-slate-300">
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-950 border border-emerald-500/30 overflow-hidden shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" viewBox="0 0 100 100">
              <rect x="12" y="20" width="76" height="48" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="6"/>
              <path d="M35 68 L65 68 M50 68 L50 82 M25 82 L75 82" stroke="#10b981" strokeWidth="6" strokeLinecap="round"/>
              <rect x="24" y="32" width="52" height="24" rx="4" fill="#1e293b"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Superintendent Companion
              <span className="text-[9px] font-mono font-normal tracking-widest text-[#0e7490] px-2 py-0.5 bg-cyan-950/50 rounded-full border border-cyan-800/60 shadow-inner uppercase">Android Workspace</span>
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">Controlador de simulação avançada e monitoramento de canais</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2 font-mono text-[11px]">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LATENCY: <span className="text-emerald-400 font-bold">{wifiPing} ms</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2 font-mono text-[11px]">
            <Cpu className="h-3 w-3 text-cyan-400" />
            CPU LOAD: <span className="text-cyan-400 font-bold">{cpuUsage}%</span>
          </div>
          <button 
            onClick={() => {
              addLog('Simulated superintendent workspace cache flushed', 'SUPERINTENDENT', 'info');
              alert('Companion State configurado com canal ativo. Tudo operando normalmente!');
            }}
            className="p-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium text-xs text-slate-200 transition border border-slate-700 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
          >
            <Radio className="h-3 w-3" /> Status
          </button>
        </div>
      </header>

      {/* Main Grid: Left Controls (Inputs, Presets) + Settings Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PANEL LEFT: URLs & PRESETS */}
        <section className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-5 justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <span className="text-sm font-semibold text-slate-100 flex items-center gap-1.5 font-display uppercase tracking-wider">
                <Laptop className="h-4 w-4 text-emerald-400" /> WebApp Android Target
              </span>
              <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-mono uppercase">ONLINE LINK</span>
            </div>

            {/* Custom URL Input field */}
            <form onSubmit={handleCustomUrlSubmit} className="flex gap-2">
              <input 
                type="text" 
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="Insira a URL alternativa do superintendente..." 
                className="flex-grow bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-lg text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 transition shadow-inner"
              />
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 rounded-lg text-xs transition cursor-pointer flex items-center gap-1"
              >
                <Play className="h-3.5 w-3.5 fill-black" /> Link
              </button>
            </form>

            {/* Preset Modes */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Modos Operacionais Rápidos</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {presetModes.map((p, idx) => {
                  const isActive = url === p.url;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        addLog(`Switching simulation perspective to: ${p.name}`, 'SUPERINTENDENT', 'info');
                        setUrl(p.url);
                        setCustomUrlInput(p.url);
                      }}
                      className={`text-left p-3 rounded-lg border transition text-xs flex flex-col justify-between h-[90px] cursor-pointer ${
                        isActive 
                          ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300' 
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="font-semibold">{p.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider ${
                          isActive ? 'bg-emerald-900/60 text-emerald-400' : 'bg-slate-800 text-zinc-400'
                        }`}>{p.badge}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Picture in Picture Instructions */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-2.5 mt-2">
            <span className="text-xs font-medium text-slate-100 flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-cyan-400" /> Compatibilidade com Picture-in-Picture
            </span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              O modo Picture-in-Picture (PiP) permite desencaixar a simulação e mantê-la flutuando em sua tela enquanto você estuda relatórios e logs!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {/* Custom PiP Toggle */}
              <button
                onClick={() => {
                  setIsPip(!isPip);
                  addLog(isPip ? 'Disabled internal PiP mode' : 'Enabled internal PiP widget overlay', 'PIP', 'info');
                }}
                className={`py-2 px-3 rounded-lg border font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  isPip 
                    ? 'bg-amber-950/20 border-amber-500/80 text-amber-400 hover:bg-amber-900/20' 
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 hover:text-emerald-400'
                }`}
              >
                {isPip ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                {isPip ? 'Fechar PiP Interno' : 'Ativar PiP Interno'}
              </button>

              {/* Native Document PiP Trigger */}
              <button
                onClick={launchNativePip}
                className="py-2 px-3 rounded-lg border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 hover:bg-cyan-900/20 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Share2 className="h-3.5 w-3.5" />
                Lançar PiP Nativo
              </button>
            </div>
            {nativePipSupport ? (
              <span className="text-[9px] font-mono text-cyan-500/80 border border-cyan-500/20 bg-cyan-950/10 px-2 py-0.5 rounded text-center">
                ✓ Seu navegador suporta a API de Picture-in-Picture de Documentos nativa!
              </span>
            ) : (
              <span className="text-[9px] font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded text-center">
                ℹ Navegador atual usará PiP interno de HTML flutuante como alternativa.
              </span>
            )}
          </div>
        </section>

        {/* SETTINGS CUSTOMIZATOR PANEL */}
        <section className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <span className="text-sm font-semibold text-slate-100 flex items-center gap-1.5 font-display uppercase tracking-wider">
              <Sliders className="h-4 w-4 text-emerald-400" /> Configuração do Dispositivo Android
            </span>
            <span className="text-[10px] font-mono text-neutral-400">HARDWARE EMULATION</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Bezel Style */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Molde Físico (Borda)</label>
              <select 
                value={settings.bezelStyle}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setSettings({ ...settings, bezelStyle: val });
                  addLog(`Phone bezel style changed to: ${val}`, 'DEVICE', 'info');
                }}
                className="bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="modern-flagship">Google Pixel Slim Premium</option>
                <option value="dark-titanium">Titanium Space Grey</option>
                <option value="classic-bezel">Android Classic Matte Black</option>
              </select>
            </div>

            {/* Screen Zoom */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Zoom do Display ({settings.zoom}%)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="range" 
                  min="80" 
                  max="120" 
                  value={settings.zoom}
                  onChange={(e) => setSettings({ ...settings, zoom: Number(e.target.value) })}
                  className="flex-grow accent-emerald-500 h-1 rounded-lg bg-slate-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Wallpaper selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Plano de Fundo (Wallpaper)</label>
              <select 
                value={settings.wallpaper}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setSettings({ ...settings, wallpaper: val });
                  addLog(`Wallpaper changed in phone desktop`, 'DEVICE', 'info');
                }}
                className="bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="cosmic-dark">Cosmic Violet Warp</option>
                <option value="electric-green">Emerald Lattice Grid</option>
                <option value="neon-cyan">Neon Cyan Abisso</option>
                <option value="material-you">Dynamic Material You</option>
                <option value="abyss-pulse">Abstract Graphite Slate</option>
              </select>
            </div>

            {/* Simulated orientation selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Rotação do Giroscópio (Tela)</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSettings({ ...settings, orientation: 'portrait' });
                    addLog('Gyroscope tilted to Portrait mode', 'DEVICE', 'info');
                  }}
                  className={`py-1.5 rounded-lg border font-medium text-xs transition cursor-pointer ${
                    settings.orientation === 'portrait'
                      ? 'bg-emerald-950/30 border-emerald-500 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  Retrato (Vertical)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSettings({ ...settings, orientation: 'landscape' });
                    addLog('Gyroscope tilted to Landscape mode', 'DEVICE', 'info');
                  }}
                  className={`py-1.5 rounded-lg border font-medium text-xs transition cursor-pointer ${
                    settings.orientation === 'landscape'
                      ? 'bg-emerald-950/30 border-emerald-500 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  Paisagem (Horizontal)
                </button>
              </div>
            </div>

            {/* Battery Emulate Slider */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Bateria Simulada ({settings.batteryLevel}%)</label>
              <input 
                type="range"
                min="5"
                max="100"
                value={settings.batteryLevel}
                onChange={(e) => setSettings({ ...settings, batteryLevel: Number(e.target.value) })}
                className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Simulated Network Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Rede Móvel de Comunicação</label>
              <div className="grid grid-cols-3 gap-1">
                {(['5G', 'Wi-Fi', 'LTE'] as const).map((net) => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => {
                      setSettings({ ...settings, networkType: net });
                      addLog(`Network protocol altered: Joined simulated network ${net}`, 'DEVICE', 'info');
                    }}
                    className={`p-1.5 rounded-lg border font-mono text-[10px] transition cursor-pointer ${
                      settings.networkType === net
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-400 font-bold'
                        : 'bg-slate-900 border-slate-800 text-neutral-400 hover:border-slate-700'
                    }`}
                  >
                    {net}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAVICON INTERACTIVE DESIGN PANEL */}
          <div className="mt-2 bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-100 flex items-center gap-1.5 font-display uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" /> Customizador de Favicon de Display
            </span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              O favicon deste applet é desenhado com uma tela de monitor integrada. Escolha sua cor favorita ou padrão de monitor superintendent:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {faviconPalettes.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setFaviconTheme({ themeColor: item.main, accentColor: item.accent });
                    addLog(`Active tab display Favicon color configured: ${item.name}`, 'SUPERINTENDENT', 'success');
                  }}
                  className={`p-2 rounded-lg border text-[10px] font-mono leading-tight cursor-pointer text-center transition flex flex-col items-center justify-center gap-1 ${item.classes}`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.main }} />
                  {item.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* LOWER SECTION: Superintendent Notes & Live Logcat Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* NOTES MANAGER (5 Columns Wide) */}
        <section className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 lg:col-span-5 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
            <span className="text-sm font-semibold text-slate-100 flex items-center gap-1.5 font-display uppercase tracking-wider">
              <Bookmark className="h-4 w-4 text-amber-400" /> Notas Administrativas
            </span>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono uppercase">PERSISTENT DB</span>
          </div>

          <form onSubmit={submitNote} className="flex flex-col gap-2">
            <textarea 
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Digite observações importantes sobre os canais carregados no superintendente..." 
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-xs leading-relaxed outline-none focus:border-amber-500 transition shadow-inner resize-none text-slate-200"
            />
            <button 
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2 rounded-lg text-xs tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="h-4 w-4 stroke-[3px]" /> Salvar Nota
            </button>
          </form>

          {/* Note List display scroll */}
          <div className="flex-grow overflow-y-auto max-h-[160px] h-full flex flex-col gap-2 pr-1 custom-scrollbar">
            {notes.length === 0 ? (
              <div className="text-center py-6 text-neutral-500 text-xs border border-dashed border-slate-800 rounded-lg flex flex-col justify-center items-center">
                <span>Nenhuma nota gravada.</span>
                <span className="text-[10px] mt-0.5">Use o campo acima para salvar suas vistorias.</span>
              </div>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/60 flex justify-between gap-3 text-xs">
                  <div className="flex flex-col gap-1 flex-grow">
                    <p className="text-slate-200 leading-relaxed break-words">{n.content}</p>
                    <span className="text-[9px] font-mono text-zinc-500">{n.timestamp}</span>
                  </div>
                  <button 
                    onClick={() => {
                      deleteNote(n.id);
                      addLog('Superintendent notes entry deleted', 'SUPERINTENDENT', 'warning');
                    }}
                    className="text-neutral-500 hover:text-red-400 transition h-fit p-1 self-start cursor-pointer"
                    title="Excluir nota"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* LOGCAT TERMINAL (7 Columns Wide) */}
        <section className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 lg:col-span-7 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
            <span className="text-sm font-semibold text-slate-100 flex items-center gap-1.5 font-display uppercase tracking-wider">
              <Terminal className="h-4 w-4 text-cyan-400 animate-pulse" /> Logcat do Terminal Android
            </span>
            <button 
              onClick={() => {
                clearLogs();
                addLog('Android Logcat database registry cleared', 'DEVICE', 'info');
              }}
              className="text-[10px] font-mono hover:text-red-400 bg-slate-900 px-2 py-1 rounded transition border border-slate-800 border-dashed"
            >
              Limpar Logs
            </button>
          </div>

          <div className="flex-grow bg-slate-950 rounded-xl p-3 border border-slate-800/80 font-mono text-[10.5px] leading-relaxed overflow-y-auto max-h-[250px] min-h-[180px] flex flex-col gap-1.5 shadow-inner">
            {logs.map((item) => {
              const types = {
                'info': 'text-cyan-400',
                'success': 'text-emerald-400',
                'warning': 'text-amber-400',
                'error': 'text-rose-500'
              };
              const badges = {
                'DEVICE': 'bg-slate-900 border border-slate-800 text-slate-300',
                'SUPERINTENDENT': 'bg-emerald-950/40 border border-emerald-500/25 text-emerald-400',
                'NETWORK': 'bg-blue-950/40 border border-blue-500/25 text-blue-400',
                'PIP': 'bg-cyan-950/40 border border-cyan-500/25 text-cyan-400'
              };

              return (
                <div key={item.id} className="flex flex-col sm:flex-row items-start font-mono gap-1.5 border-b border-slate-900/30 pb-1">
                  <span className="text-zinc-500 select-none font-bold">[{item.time}]</span>
                  <span className={`text-[9px] px-1 font-mono uppercase tracking-wider rounded ${badges[item.category]}`}>
                    {item.category}
                  </span>
                  <span className={`${types[item.severity]} flex-grow break-words`}>
                    {item.message}
                  </span>
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>
        </section>

      </div>
    </div>
  );
}
export default Dashboard;
