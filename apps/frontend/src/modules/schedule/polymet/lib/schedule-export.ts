/**
 * Exportación del horario a PNG y PDF sin dependencias externas.
 *
 * Se dibuja una hoja limpia en <canvas> a partir de los mismos datos del mapa
 * semanal (no es una captura de pantalla), y para PDF se incrusta esa imagen en
 * un documento A4 válido escrito a mano (una página, imagen JPEG/DCTDecode).
 */
import type { TimeMapBlock, TimeMapColumn } from "@/modules/schedule/polymet/lib/schedule-view";
import { formatClock, formatDuration, formatHours, formatRange, fromMinutes } from "@/modules/schedule/polymet/lib/schedule-time";

export type ExportFormat = "pdf" | "png";

export type ExportOptions = {
  columns: TimeMapColumn[];
  title: string;
  subtitle: string;
  includeFree: boolean;
  includeRooms: boolean;
  orientation: "landscape" | "portrait";
};

const INK = "#1f2a3d";
const MUTED = "#677388";
const FAINT = "#9aa5b5";
const LINE = "#e3e9f1";
const PAPER = "#ffffff";
const SOFT = "#f1f5fb";
const PRIMARY = "#2b96ee";
const WARNING = "#fbbf24";
const FONT = "Poppins, ui-sans-serif, system-ui, sans-serif";

/* ───────────────────────── Utilidades de dibujo ───────────────────────── */

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Mezcla un color con blanco (percent = proporción del color). */
function mixWhite(hex: string, percent: number) {
  const [r, g, b] = hexToRgb(hex);
  const p = percent / 100;
  const ch = (c: number) => Math.round(c * p + 255 * (1 - p));
  return `rgb(${ch(r)}, ${ch(g)}, ${ch(b)})`;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (maxWidth <= 0) return "";
  if (ctx.measureText(text).width <= maxWidth) return text;
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (ctx.measureText(text.slice(0, mid) + "…").width <= maxWidth) lo = mid;
    else hi = mid - 1;
  }
  return lo > 0 ? text.slice(0, lo).trimEnd() + "…" : "";
}

function font(weight: number, size: number) {
  return `${weight} ${size}px ${FONT}`;
}

function hatch(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, color: string) {
  ctx.save();
  roundRect(ctx, x, y, w, h, r);
  ctx.clip();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let i = -h; i < w + h; i += 8) {
    ctx.beginPath();
    ctx.moveTo(x + i, y + h);
    ctx.lineTo(x + i + h, y);
    ctx.stroke();
  }
  ctx.restore();
}

async function ensureFonts() {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  try {
    await Promise.all([
      document.fonts.load(font(400, 14)),
      document.fonts.load(font(500, 14)),
      document.fonts.load(font(600, 14)),
    ]);
  } catch {
    /* Si la fuente no carga se usa la tipografía del sistema. */
  }
}

/* ───────────────────────── Bloques ───────────────────────── */

function drawBlock(ctx: CanvasRenderingContext2D, block: TimeMapBlock, x: number, y: number, w: number, h: number, opts: ExportOptions) {
  const minutes = block.endMin - block.startMin;

  if (block.kind === "rest" || block.kind === "gap") {
    if (block.kind === "rest") {
      ctx.fillStyle = SOFT;
      roundRect(ctx, x, y, w, h, 8);
      ctx.fill();
    }
    hatch(ctx, x, y, w, h, 8, block.kind === "rest" ? "rgba(103,115,136,0.12)" : "rgba(103,115,136,0.08)");
    if (h >= 12) {
      ctx.fillStyle = MUTED;
      ctx.font = font(500, Math.min(12, Math.max(9, h - 6)));
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(fitText(ctx, `${block.name} · ${formatDuration(minutes)}`, w - 12), x + w / 2, y + h / 2);
      ctx.textAlign = "left";
    }
    return;
  }

  if (block.kind === "free") {
    if (!opts.includeFree) return;
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = "#c9d3e0";
    ctx.lineWidth = 1.2;
    roundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, 10);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = FAINT;
    ctx.textBaseline = "middle";
    ctx.font = font(500, 12);
    const label = h >= 40 ? `${block.name} · libre` : "Libre";
    ctx.fillText(fitText(ctx, label, w - 20), x + 12, y + h / 2);
    return;
  }

  const subject = block.subject!;
  ctx.fillStyle = mixWhite(subject.accent, 11);
  roundRect(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.fillStyle = subject.accent;
  roundRect(ctx, x + 5, y + 6, 4, Math.max(4, h - 12), 2);
  ctx.fill();

  const tx = x + 16;
  const tw = w - 24;
  ctx.textBaseline = "alphabetic";
  if (h < 40) {
    ctx.font = font(600, 12.5);
    ctx.fillStyle = INK;
    ctx.textBaseline = "middle";
    const name = fitText(ctx, subject.name, tw * 0.6);
    ctx.fillText(name, tx, y + h / 2);
    ctx.font = font(400, 11.5);
    ctx.fillStyle = MUTED;
    ctx.fillText(fitText(ctx, subject.detail.split(" · ")[0], tw - ctx.measureText(name).width - 8), tx + ctx.measureText(name).width + 14, y + h / 2);
  } else {
    const lines: Array<{ text: string; f: string; c: string; lh: number }> = [
      { text: subject.name, f: font(600, 14), c: INK, lh: 18 },
      { text: subject.detail, f: font(400, 11.5), c: MUTED, lh: 15 },
    ];
    if (h >= 62) {
      const room = opts.includeRooms && subject.room ? ` · ${subject.room}` : "";
      lines.push({ text: `${formatRange(block.startTime, block.endTime)}${room}`, f: font(500, 11), c: MUTED, lh: 15 });
    }
    const total = lines.reduce((s, l) => s + l.lh, 0);
    let cy = y + (h - total) / 2 + 13;
    lines.forEach((l) => {
      ctx.font = l.f;
      ctx.fillStyle = l.c;
      ctx.fillText(fitText(ctx, l.text, tw), tx, cy);
      cy += l.lh;
    });
  }

  if (block.flagged) {
    ctx.fillStyle = WARNING;
    ctx.beginPath();
    ctx.arc(x + w - 10, y + 10, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ───────────────────────── Hoja completa ───────────────────────── */

export async function renderScheduleSheet(opts: ExportOptions, scale = 2): Promise<HTMLCanvasElement> {
  await ensureFonts();
  const landscape = opts.orientation === "landscape";
  const W = landscape ? 1754 : 1240;
  const H = landscape ? 1240 : 1754;
  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");
  ctx.scale(scale, scale);

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);

  const pad = 64;

  /* Encabezado */
  ctx.fillStyle = PRIMARY;
  roundRect(ctx, pad, pad, 34, 34, 10);
  ctx.fill();
  ctx.fillStyle = PAPER;
  ctx.font = font(700, 18);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("A", pad + 17, pad + 18);
  ctx.textAlign = "left";
  ctx.fillStyle = INK;
  ctx.font = font(600, 17);
  ctx.fillText("AulaBase", pad + 46, pad + 18);

  const generated = new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
  ctx.textAlign = "right";
  ctx.fillStyle = MUTED;
  ctx.font = font(400, 13);
  ctx.fillText(`Generado el ${generated}`, W - pad, pad + 18);
  ctx.textAlign = "left";

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = INK;
  ctx.font = font(600, 36);
  ctx.fillText(opts.title, pad, pad + 98);
  ctx.fillStyle = MUTED;
  ctx.font = font(400, 16);
  ctx.fillText(fitText(ctx, opts.subtitle, W - pad * 2), pad, pad + 128);

  /* Métricas */
  const allBlocks = opts.columns.flatMap((c) => c.blocks);
  const classes = allBlocks.filter((b) => b.kind === "class");
  const teaching = classes.reduce((s, b) => s + (b.endMin - b.startMin), 0);
  const chips = [
    `${classes.length} ${classes.length === 1 ? "clase" : "clases"}`,
    `${formatHours(teaching)} lectivas`,
    `${opts.columns.length} ${opts.columns.length === 1 ? "día" : "días"}`,
  ];
  let chipX = pad;
  ctx.font = font(500, 13);
  chips.forEach((chip) => {
    const w = ctx.measureText(chip).width + 28;
    ctx.fillStyle = SOFT;
    roundRect(ctx, chipX, pad + 152, w, 30, 15);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.textBaseline = "middle";
    ctx.fillText(chip, chipX + 14, pad + 167);
    chipX += w + 8;
  });

  /* Cuadrícula */
  const visible = allBlocks.filter((b) => opts.includeFree || b.kind !== "free");
  const startMin = visible.length ? Math.floor(Math.min(...visible.map((b) => b.startMin)) / 60) * 60 : 7 * 60;
  const endMin = visible.length ? Math.ceil(Math.max(...visible.map((b) => b.endMin)) / 60) * 60 : 13 * 60;
  const gutter = 64;
  const gridTop = pad + 222;
  const headerH = 52;
  const footerH = 64;
  const bodyTop = gridTop + headerH;
  const bodyH = H - bodyTop - pad - footerH;
  const ppm = bodyH / Math.max(60, endMin - startMin);
  const gridLeft = pad + gutter;
  const gridW = W - pad - gridLeft;
  const colW = gridW / Math.max(1, opts.columns.length);

  // Líneas horarias
  ctx.textBaseline = "middle";
  for (let m = startMin; m <= endMin; m += 60) {
    const y = bodyTop + (m - startMin) * ppm;
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(gridLeft, y);
    ctx.lineTo(W - pad, y);
    ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.font = font(500, 12);
    ctx.textAlign = "right";
    ctx.fillText(formatClock(fromMinutes(m)), gridLeft - 14, y);
    ctx.textAlign = "left";
  }

  opts.columns.forEach((col, i) => {
    const cx = gridLeft + i * colW;
    ctx.strokeStyle = LINE;
    ctx.beginPath();
    ctx.moveTo(cx, bodyTop);
    ctx.lineTo(cx, bodyTop + bodyH);
    ctx.stroke();

    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = INK;
    ctx.font = font(600, 16);
    ctx.fillText(fitText(ctx, col.label, colW - 16), cx + 8, gridTop + 22);
    const count = col.blocks.filter((b) => b.kind === "class").length;
    ctx.fillStyle = MUTED;
    ctx.font = font(400, 12);
    ctx.fillText(`${count} ${count === 1 ? "clase" : "clases"}`, cx + 8, gridTop + 40);

    col.blocks.forEach((block) => {
      const y = bodyTop + (block.startMin - startMin) * ppm;
      const h = Math.max(10, (block.endMin - block.startMin) * ppm);
      drawBlock(ctx, block, cx + 6, y + 2, colW - 12, h - 4, opts);
    });
  });

  /* Pie con leyenda */
  const fy = H - pad - 18;
  ctx.textBaseline = "middle";
  ctx.font = font(400, 12);
  let lx = pad;
  const legend: Array<[string, (x: number) => void]> = [
    ["Clase", (x) => { ctx.fillStyle = mixWhite(PRIMARY, 14); roundRect(ctx, x, fy - 7, 22, 14, 4); ctx.fill(); }],
    ["Descanso", (x) => { ctx.fillStyle = SOFT; roundRect(ctx, x, fy - 7, 22, 14, 4); ctx.fill(); hatch(ctx, x, fy - 7, 22, 14, 4, "rgba(103,115,136,0.2)"); }],
  ];
  if (opts.includeFree) legend.push(["Libre", (x) => { ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = "#c9d3e0"; roundRect(ctx, x, fy - 7, 22, 14, 4); ctx.stroke(); ctx.restore(); }]);
  if (allBlocks.some((b) => b.flagged)) legend.push(["Requiere revisión", (x) => { ctx.fillStyle = WARNING; ctx.beginPath(); ctx.arc(x + 11, fy, 5, 0, Math.PI * 2); ctx.fill(); }]);
  legend.forEach(([label, draw]) => {
    draw(lx);
    ctx.fillStyle = MUTED;
    ctx.fillText(label, lx + 30, fy);
    lx += 30 + ctx.measureText(label).width + 24;
  });
  ctx.textAlign = "right";
  ctx.fillStyle = FAINT;
  ctx.fillText("Exportado desde AulaBase · Horario docente", W - pad, fy);
  ctx.textAlign = "left";

  return canvas;
}

/* ───────────────────────── Salida ───────────────────────── */

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("No se pudo generar la imagen"))), type, quality);
  });
}

/** PDF mínimo de una página con la hoja incrustada como JPEG. */
async function canvasToPdf(canvas: HTMLCanvasElement, landscape: boolean): Promise<Blob> {
  const jpeg = new Uint8Array(await (await canvasToBlob(canvas, "image/jpeg", 0.94)).arrayBuffer());
  const pageW = landscape ? 841.89 : 595.28;
  const pageH = landscape ? 595.28 : 841.89;
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (chunk: string | Uint8Array) => {
    const bytes = typeof chunk === "string" ? enc.encode(chunk) : chunk;
    parts.push(bytes);
    length += bytes.length;
  };
  const obj = (n: number, body: string) => {
    offsets[n] = length;
    push(`${n} 0 obj\n${body}\nendobj\n`);
  };

  push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
  obj(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  obj(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  offsets[4] = length;
  push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
  push(jpeg);
  push("\nendstream\nendobj\n");
  const content = `q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ`;
  obj(5, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  obj(6, "<< /Producer (AulaBase) /Title (Horario docente) >>");

  const xref = length;
  let table = `xref\n0 7\n0000000000 65535 f \n`;
  for (let i = 1; i <= 6; i++) table += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  push(table);
  push(`trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(parts.map(part => new Uint8Array(part).buffer), { type: "application/pdf" });
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function exportFilename(scopeLabel: string, format: ExportFormat) {
  const slug = scopeLabel
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `horario-${slug || "semana"}.${format}`;
}

export async function exportSchedule(opts: ExportOptions, format: ExportFormat, filename: string) {
  const canvas = await renderScheduleSheet(opts, format === "png" ? 2 : 1.6);
  const blob = format === "png" ? await canvasToBlob(canvas, "image/png") : await canvasToPdf(canvas, opts.orientation === "landscape");
  download(blob, filename);
  return { size: blob.size };
}
