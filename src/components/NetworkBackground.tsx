import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type NodeType = "contact" | "active" | "milestone";

interface NetNode {
  x: number; y: number; vx: number; vy: number;
  radius: number; opacity: number; pulsePhase: number;
  type: NodeType;
}

interface ConstellationEvent {
  nodes: number[]; frame: number; maxFrames: number;
}

interface FloatingLabel {
  text: string; x: number; y: number; vy: number;
  phase: number; totalFrames: number; side: "left" | "right";
}

const LABELS = [
  "+1 reconnection", "47 days → active", "Sarah joined Stripe",
  "Follow-up sent", "Network warming", "3 nudges this week",
  "Context matched", "Relationship: warm"
];

const OPACITY_MAP: Record<string, number> = {
  "/": 0.55, "/why-pulse": 0.45, "/signin": 0.35, "/signup": 0.35,
  "/dashboard": 0.30, "/contacts": 0.30, "/draft": 0.30, "/sent": 0.30,
  "/pricing": 0.40, "/privacy": 0.40,
};

function rand(a: number, b: number) { return a + Math.random() * (b - a); }

function spawnX(w: number) {
  const r = Math.random();
  if (r < 0.4) return rand(0, w * 0.18);
  if (r < 0.8) return rand(w * 0.82, w);
  return rand(0, w);
}

function createNode(w: number, h: number): NetNode {
  const r = Math.random();
  const type: NodeType = r < 0.7 ? "contact" : r < 0.9 ? "active" : "milestone";
  return {
    x: spawnX(w), y: rand(0, h),
    vx: rand(-0.28, 0.28), vy: rand(-0.28, 0.28),
    radius: rand(2.5, 5.5), opacity: rand(0.3, 0.8),
    pulsePhase: rand(0, Math.PI * 2), type,
  };
}

function nodeColor(t: NodeType, o: number): string {
  if (t === "active") return `rgba(45,158,107,${o})`;
  if (t === "milestone") return `rgba(255,255,255,${o * 0.6})`;
  return `rgba(26,107,74,${o})`;
}

function createLabel(w: number, h: number, idx: number): FloatingLabel {
  const side = Math.random() < 0.5 ? "left" : "right";
  return {
    text: LABELS[idx % LABELS.length],
    x: side === "left" ? rand(w * 0.02, w * 0.12) : rand(w * 0.88, w * 0.97),
    y: rand(h * 0.05, h * 0.95), vy: -0.18,
    phase: 0, totalFrames: 300, side,
  };
}

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const opacity = OPACITY_MAP[location.pathname] ?? (isMobile ? 0.25 : 0.45);
  const finalOpacity = isMobile ? Math.min(opacity, 0.25) : opacity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth, h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    const mobile = w < 768;
    const NODE_COUNT = mobile ? 28 : 52;

    const nodes: NetNode[] = Array.from({ length: NODE_COUNT }, () => createNode(w, h));
    const labels: FloatingLabel[] = mobile ? [] : Array.from({ length: 8 }, (_, i) => createLabel(w, h, i));
    const constellations: ConstellationEvent[] = [];
    let frame = 0;
    let rafId = 0;
    let running = true;

    function wrap(n: NetNode) {
      if (n.x < -20) n.x = w + 10;
      else if (n.x > w + 20) { n.x = -10; n.x = spawnX(w); }
      if (n.y < -20) n.y = h + 10;
      else if (n.y > h + 20) n.y = -10;
    }

    function tick() {
      if (!running) return;
      ctx!.clearRect(0, 0, w, h);
      const time = frame * 0.016;

      // Move nodes
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        wrap(n);
        if (frame % 180 === 0) {
          n.vx = Math.max(-0.35, Math.min(0.35, n.vx + rand(-0.03, 0.03)));
          n.vy = Math.max(-0.35, Math.min(0.35, n.vy + rand(-0.03, 0.03)));
        }
      }

      // Edges — cap to nearest 20
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        // simple approx: check all but skip early
        let checked = 0;
        for (let j = i + 1; j < nodes.length && checked < 20; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            checked++;
            const lo = (1 - dist / 140) * 0.18;
            let color: string;
            if (a.type === "active" && b.type === "active") color = `rgba(45,158,107,${lo * 1.4})`;
            else if (a.type === "milestone" || b.type === "milestone") color = `rgba(255,255,255,${lo * 0.8})`;
            else color = `rgba(26,107,74,${lo})`;
            ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = color; ctx!.lineWidth = 0.6; ctx!.stroke();
            if (dist < 60) {
              ctx!.beginPath();
              ctx!.arc((a.x + b.x) / 2, (a.y + b.y) / 2, 1.2, 0, Math.PI * 2);
              ctx!.fillStyle = color.replace(/[\d.]+\)$/, `${lo * 0.5})`);
              ctx!.fill();
            }
          }
        }
      }

      // Constellation
      if (frame % 400 === 0 && frame > 0) {
        for (let i = 0; i < nodes.length - 2; i++) {
          const a = nodes[i];
          const near: number[] = [];
          for (let j = i + 1; j < nodes.length && near.length < 2; j++) {
            const dx = a.x - nodes[j].x, dy = a.y - nodes[j].y;
            if (Math.sqrt(dx * dx + dy * dy) < 200) near.push(j);
          }
          if (near.length === 2) {
            constellations.push({ nodes: [i, ...near], frame: 0, maxFrames: 120 });
            break;
          }
        }
      }

      for (let ci = constellations.length - 1; ci >= 0; ci--) {
        const c = constellations[ci];
        c.frame++;
        if (c.frame > c.maxFrames) { constellations.splice(ci, 1); continue; }
        let alpha: number;
        if (c.frame < 40) alpha = c.frame / 40;
        else alpha = Math.max(0, 1 - (c.frame - 40) / 80);
        const [n0, n1, n2] = c.nodes.map(i => nodes[i]);
        ctx!.beginPath(); ctx!.moveTo(n0.x, n0.y); ctx!.lineTo(n1.x, n1.y);
        ctx!.lineTo(n2.x, n2.y); ctx!.closePath();
        ctx!.fillStyle = `rgba(26,107,74,${0.04 * alpha})`;
        ctx!.fill();
        ctx!.strokeStyle = `rgba(26,107,74,${0.12 * alpha})`;
        ctx!.lineWidth = 0.8; ctx!.stroke();
      }

      // Nodes
      for (const n of nodes) {
        ctx!.beginPath(); ctx!.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx!.fillStyle = nodeColor(n.type, n.opacity); ctx!.fill();
        // outer ring
        const pr = n.radius * (1.8 + 0.4 * Math.sin(time * 1.2 + n.pulsePhase));
        ctx!.beginPath(); ctx!.arc(n.x, n.y, pr, 0, Math.PI * 2);
        ctx!.strokeStyle = nodeColor(n.type, n.opacity * 0.3);
        ctx!.lineWidth = 0.8; ctx!.stroke();
        // active halo
        if (n.type === "active") {
          ctx!.beginPath(); ctx!.arc(n.x, n.y, n.radius * 3.2, 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(45,158,107,${n.opacity * 0.08})`;
          ctx!.lineWidth = 0.5; ctx!.stroke();
        }
      }

      // Labels
      if (!mobile) {
        for (const l of labels) {
          l.phase++;
          l.y += l.vy;
          let alpha: number;
          if (l.phase < 60) alpha = (l.phase / 60) * 0.18;
          else if (l.phase < 240) alpha = 0.18;
          else if (l.phase < 300) alpha = ((300 - l.phase) / 60) * 0.18;
          else {
            // reset
            Object.assign(l, createLabel(w, h, LABELS.indexOf(l.text)));
            l.phase = 0; alpha = 0;
          }
          if (alpha > 0) {
            ctx!.font = "500 11px Inter, -apple-system, sans-serif";
            ctx!.textAlign = l.side === "left" ? "left" : "right";
            ctx!.fillStyle = `rgba(26,107,74,${alpha})`;
            ctx!.fillText(l.text, l.x, l.y);
          }
        }
      }

      frame++;
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    const onResize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w; canvas.height = h;
      for (const n of nodes) {
        if (n.x > w) n.x = rand(0, w);
        if (n.y > h) n.y = rand(0, h);
      }
    };

    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(rafId); }
      else { running = true; rafId = requestAnimationFrame(tick); }
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        zIndex: 0, pointerEvents: "none",
        opacity: finalOpacity,
      }}
    />
  );
}
