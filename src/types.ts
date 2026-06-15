export type PhoneBezelStyle = 'modern-flagship' | 'dark-titanium' | 'classic-bezel';
export type PhoneWallpaper = 'cosmic-dark' | 'electric-green' | 'neon-cyan' | 'material-you' | 'abyss-pulse';
export type PhoneOrientation = 'portrait' | 'landscape';

export interface DeviceSettings {
  bezelStyle: PhoneBezelStyle;
  zoom: number;
  wallpaper: PhoneWallpaper;
  orientation: PhoneOrientation;
  showStatusBar: boolean;
  modelName: string;
  simulatedLatency: number;
  batteryLevel: number;
  networkType: '5G' | 'Wi-Fi' | 'LTE';
}

export interface WorkspaceNote {
  id: string;
  timestamp: string;
  content: string;
  mode: string;
}

export interface SystemLog {
  id: string;
  time: string;
  category: 'DEVICE' | 'SUPERINTENDENT' | 'NETWORK' | 'PIP';
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
}

export interface PresetMode {
  name: string;
  url: string;
  description: string;
  badge: string;
}
