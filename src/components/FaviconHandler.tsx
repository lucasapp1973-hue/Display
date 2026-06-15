import { useEffect } from 'react';

interface FaviconHandlerProps {
  themeColor: string; // Hex color for the display glow
  accentColor: string; // Hex color for internal target
}

export function FaviconHandler({ themeColor, accentColor }: FaviconHandlerProps) {
  useEffect(() => {
    // Create an offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 64, 64);

    // 1. Draw outer glowing outline (monitor bezel)
    ctx.shadowColor = themeColor;
    ctx.shadowBlur = 4;
    
    ctx.fillStyle = '#0f172a'; // Deep slate screen background
    ctx.strokeStyle = themeColor; // Monitor outline
    ctx.lineWidth = 4;

    // Rounded rectangle for screen
    const x = 6;
    const y = 8;
    const w = 52;
    const h = 36;
    const r = 6;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;

    // 2. Monitor Stand/Base
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    // Vertical Stand
    ctx.beginPath();
    ctx.moveTo(32, 44);
    ctx.lineTo(32, 54);
    ctx.stroke();

    // Horizontal Base Flange
    ctx.beginPath();
    ctx.moveTo(20, 54);
    ctx.lineTo(44, 54);
    ctx.stroke();

    // Bottom Base Line
    ctx.beginPath();
    ctx.moveTo(14, 54);
    ctx.lineTo(50, 54);
    ctx.stroke();

    // 3. Inner Screen Content - Superintendent Radar/Crosshair
    // Radar concentric circles
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(32, 26, 6, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshair lines
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Horizontal
    ctx.moveTo(20, 26);
    ctx.lineTo(44, 26);
    // Vertical
    ctx.moveTo(32, 14);
    ctx.lineTo(32, 38);
    ctx.stroke();

    // Small blinking status indicator blip
    ctx.fillStyle = '#ef4444'; // Red alarm dot
    ctx.beginPath();
    ctx.arc(44, 18, 2, 0, Math.PI * 2);
    ctx.fill();

    // Green indicator blip
    ctx.fillStyle = '#10b981'; // Green status safe dot
    ctx.beginPath();
    ctx.arc(19, 34, 2, 0, Math.PI * 2);
    ctx.fill();

    // Convert canvas to Data URL
    const iconUrl = canvas.toDataURL('image/png');

    // Update document favicon elements
    const links = document.querySelectorAll("link[rel*='icon']");
    links.forEach((link) => {
      const el = link as HTMLLinkElement;
      el.href = iconUrl;
    });

  }, [themeColor, accentColor]);

  return null; // Side-effect purely
}
export default FaviconHandler;
