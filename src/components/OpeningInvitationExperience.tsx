import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WeddingData } from '../types/wedding';
import { Volume2, VolumeX, ArrowRight, RotateCcw } from 'lucide-react';

interface OpeningInvitationExperienceProps {
  wedding: WeddingData;
  onComplete: () => void;
  onStartAudio?: () => void;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
}

export const OpeningInvitationExperience: React.FC<OpeningInvitationExperienceProps> = ({
  wedding,
  onComplete,
  onStartAudio,
  isAudioPlaying,
  onToggleAudio
}) => {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'ready' | 'resetting' | 'completing'>('closed');
  const [turned, setTurned] = useState(false);
  const [hasInteractedAudio, setHasInteractedAudio] = useState(false);

  // Couple and event details
  const brideName = wedding.partner2 || 'Kevine';
  const groomName = wedding.partner1 || 'Samson';
  const brideFirst = brideName.split(' ')[0];
  const groomFirst = groomName.split(' ')[0];
  const monogram = `${brideFirst.charAt(0)}&${groomFirst.charAt(0)}`;
  const weddingDate = wedding.date || 'Sunday, 20 December 2026';
  const venueTitle = wedding.venue || 'Lion Voice Tabernacle & Rooftop 39';
  const locationCity = wedding.city || 'Cape Town, Western Cape';
  const attireInfo = wedding.dressCodeSummary || 'Vintage Wear (Church) · Gala Wear (Dining)';
  const rsvpDate = wedding.rsvpDeadline || 'By 1 December 2026';

  // Refs
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const flapRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLButtonElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rotRef = useRef<HTMLDivElement | null>(null);
  const flipRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation timers and pointer state
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ptrRef = useRef({ x: 0, y: 0 });
  const curRef = useRef({ rx: 0, ry: 0, y: 0 });
  const cardCurRef = useRef({ rx: 0, ry: 0 });
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    size: number;
    c: string;
    rot: number;
  }>>([]);
  const dustRafRef = useRef<number>(0);

  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  // Ensure timers are purged on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  const addTimer = (ms: number, fn: () => void) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
  };

  // Start music upon first touch / gesture
  const triggerAudioStart = useCallback(() => {
    if (!hasInteractedAudio && onStartAudio) {
      setHasInteractedAudio(true);
      onStartAudio();
    }
  }, [hasInteractedAudio, onStartAudio]);

  // Canvas size and particle tick
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sizeCanvas = () => {
      const d = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * d);
      canvas.height = Math.round(window.innerHeight * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };

    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    return () => {
      window.removeEventListener('resize', sizeCanvas);
      if (dustRafRef.current) cancelAnimationFrame(dustRafRef.current);
    };
  }, []);

  const tickDust = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.13;
      p.vx *= 0.985;
      p.life -= 0.013;
      p.rot += 0.12;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 1.4);
      ctx.lineTo(p.size, 0);
      ctx.lineTo(0, p.size * 1.4);
      ctx.lineTo(-p.size, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    if (particlesRef.current.length) {
      dustRafRef.current = requestAnimationFrame(tickDust);
    } else {
      dustRafRef.current = 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }, []);

  // Burst 80 gold diamond particles on wax seal break
  const burstSeal = useCallback(() => {
    const seal = sealRef.current;
    if (!seal) return;
    const r = seal.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const colors = ['#ecd597', '#c9a45c', '#f6e7b8', '#a98340'];

    for (let i = 0; i < 80; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 1.5 + Math.random() * 6;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 2.2,
        life: 1,
        size: 1.4 + Math.random() * 3,
        c: colors[i % colors.length],
        rot: Math.random() * 3
      });
    }

    if (!dustRafRef.current) {
      dustRafRef.current = requestAnimationFrame(tickDust);
    }
  }, [tickDust]);

  // Layout the lifted card perfectly in the viewport
  const layoutLiftedCard = useCallback(() => {
    if (!tiltRef.current || !sceneRef.current || !cardRef.current) return;
    const r = tiltRef.current.getBoundingClientRect();
    const em = parseFloat(getComputedStyle(sceneRef.current).fontSize);
    const cw = 46 * em;
    const ch = 29 * em;
    const baseCx = r.left + 25 * em;
    const baseCy = r.top + 16.5 * em;
    const barH = 76;
    const s = Math.min((window.innerWidth - 32) / cw, (window.innerHeight - barH - 28) / ch, 2.1);
    const tx = window.innerWidth / 2;
    const ty = (window.innerHeight - barH) / 2 + 6;
    const dx = tx - baseCx;
    const dy = ty - baseCy;
    cardRef.current.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
  }, []);

  // 3D Sway & Tilt Render Loop
  useEffect(() => {
    let rafId: number;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const frame = (t: number) => {
      let tx = 0, ty = 0, tb = 0;
      if (phase === 'closed') {
        tx = -ptrRef.current.y * 6;
        ty = ptrRef.current.x * 9;
        if (!prefersReduced) {
          tx += Math.sin(t / 2300) * 1.6;
          ty += Math.sin(t / 1900) * 2.2;
          tb = Math.sin(t / 1500) * 0.35;
        }
      }

      curRef.current.rx += (tx - curRef.current.rx) * 0.07;
      curRef.current.ry += (ty - curRef.current.ry) * 0.07;
      curRef.current.y += (tb - curRef.current.y) * 0.07;

      if (tiltRef.current) {
        tiltRef.current.style.transform = `translateY(${curRef.current.y.toFixed(3)}em) rotateX(${curRef.current.rx.toFixed(3)}deg) rotateY(${curRef.current.ry.toFixed(3)}deg)`;
      }

      if (phase === 'ready' && rotRef.current) {
        const crx = prefersReduced ? 0 : -ptrRef.current.y * 5;
        const cry = prefersReduced ? 0 : ptrRef.current.x * 7;
        cardCurRef.current.rx += (crx - cardCurRef.current.rx) * 0.08;
        cardCurRef.current.ry += (cry - cardCurRef.current.ry) * 0.08;
        rotRef.current.style.transform = `perspective(110em) rotateX(${cardCurRef.current.rx.toFixed(3)}deg) rotateY(${cardCurRef.current.ry.toFixed(3)}deg)`;
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    const handlePointerMove = (e: PointerEvent) => {
      ptrRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      ptrRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      if (phase === 'ready') layoutLiftedCard();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [phase, layoutLiftedCard]);

  // Smooth fade-out transition to wedding website
  const handleEnterCelebration = useCallback(() => {
    clearAllTimers();
    triggerAudioStart();
    setPhase('completing');
    const scene = sceneRef.current;
    if (scene) scene.classList.add('fading');
    setTimeout(() => {
      onComplete();
    }, 700);
  }, [triggerAudioStart, onComplete]);

  // Main unsealing sequence: invitation appears, then fades out in 5 seconds to enter website
  const openIt = useCallback(() => {
    if (phase !== 'closed') return;
    triggerAudioStart();
    setPhase('opening');

    const scene = sceneRef.current;
    const flap = flapRef.current;
    const seal = sealRef.current;
    const card = cardRef.current;
    if (!scene || !flap || !seal || !card) return;

    scene.classList.add('is-opening');
    seal.classList.add('broken');
    burstSeal();

    // 1. Flap lifts open in 3D
    addTimer(350, () => {
      flap.classList.add('open');
    });

    // 2. Flap slides behind
    addTimer(750, () => {
      scene.classList.add('flap-behind');
    });

    // 3. Card emerges and slides up out of envelope pocket
    addTimer(1100, () => {
      card.classList.add('moving');
      card.style.transform = 'translateY(-22em)';
    });

    // 4. Envelope parts discard downward; card centers and scales in viewport
    addTimer(1900, () => {
      scene.classList.add('discard');
      card.classList.add('lifted');
      layoutLiftedCard();
    });

    addTimer(2600, () => {
      card.classList.remove('moving');
      setPhase('ready');
    });

    // 5. Exactly 5 seconds after breaking the seal, trigger the fade-out transition to enter the website
    addTimer(5000, () => {
      handleEnterCelebration();
    });
  }, [phase, triggerAudioStart, burstSeal, layoutLiftedCard, handleEnterCelebration]);

  // Auto-unseal softly after initial viewing if untouched
  useEffect(() => {
    const autoTimer = setTimeout(() => {
      if (phase === 'closed') {
        openIt();
      }
    }, 3000);

    return () => clearTimeout(autoTimer);
  }, [phase, openIt]);

  // Toggle card flip (front <-> back details)
  const toggleFlip = () => {
    if (phase !== 'ready') return;
    triggerAudioStart();
    const nextTurned = !turned;
    setTurned(nextTurned);
    if (flipRef.current) {
      flipRef.current.classList.toggle('turned', nextTurned);
    }
  };

  // Replay animation
  const resetExperience = () => {
    clearAllTimers();
    setPhase('resetting');
    const scene = sceneRef.current;
    const flap = flapRef.current;
    const seal = sealRef.current;
    const card = cardRef.current;
    const rot = rotRef.current;
    const flip = flipRef.current;

    if (scene) scene.classList.add('fading');

    setTimeout(() => {
      if (scene) {
        ['is-opening', 'flap-behind', 'discard'].forEach((c) => scene.classList.remove(c));
      }
      if (flap) flap.classList.remove('open');
      if (seal) seal.classList.remove('broken');
      if (card) {
        card.classList.remove('moving', 'lifted');
        card.style.transform = '';
      }
      if (rot) rot.style.transform = '';
      if (flip) flip.classList.remove('turned');
      setTurned(false);

      if (scene) {
        scene.classList.add('instant');
        void scene.offsetWidth;
        scene.classList.remove('instant');
        scene.classList.remove('fading');
      }
      setPhase('closed');
    }, 380);
  };

  return (
    <div
      className={`fixed inset-0 z-100 flex flex-col justify-between overflow-hidden select-none bg-[#0b1714] text-[#efe6d0] envelope-experience font-['Jost',sans-serif] transition-opacity duration-700 ease-out ${
        phase === 'completing' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Component-scoped CSS for 3D Envelope & Proportional Units */}
      <style>{`
        .envelope-experience {
          --ground: #0b1714;
          --ground-lit: #1b3a30;
          --emerald: #1f5244;
          --emerald-lo: #153a30;
          --emerald-hi: #2d6e5b;
          --gold: #c9a45c;
          --gold-rgb: 201, 164, 92;
          --gold-hi: #ecd597;
          --gold-ink: #7a5c24;
          --champagne: #e3d3a9;
          --paper: #f5eedd;
          --paper-hi: #fbf7ea;
          --ink: #1b3a31;
          --ink-soft: #476259;
          --text: #efe6d0;
          --display: "Bodoni Moda", "Didot", Georgia, serif;
          --script: "Pinyon Script", "Alex Brush", cursive;
          --body: "Jost", "Plus Jakarta Sans", system-ui, sans-serif;
        }

        .stage {
          height: 100%;
          display: grid;
          place-items: center;
          padding-bottom: 2rem;
          box-sizing: border-box;
          position: relative;
          z-index: 10;
        }

        .scene {
          --w: min(calc(100vw - 32px), 640px, 78vh, 78dvh);
          font-size: calc(var(--w) / 50);
          position: relative;
          width: 50em;
          height: 53em;
          transition: opacity .35s ease;
        }
        .scene.fading { opacity: 0; }
        .scene.instant, .scene.instant * { transition: none !important; }

        .headline {
          position: absolute; left: 0; right: 0; top: 3.5em;
          text-align: center;
          transition: opacity .6s ease, transform .6s ease;
        }
        .headline .eyebrow {
          margin: 0 0 .8em;
          font: 500 1.4em/1.2 var(--body);
          letter-spacing: .34em; text-transform: uppercase; color: var(--gold);
        }
        .headline .script {
          margin: 0;
          font: 400 6.6em/1 var(--script);
          color: var(--paper);
        }
        .is-opening .headline { opacity: 0; transform: translateY(-1.5em); }

        .float { position: absolute; left: 0; top: 20em; width: 50em; height: 33em; perspective: 120em; }
        .tilt { position: absolute; inset: 0; perspective: 120em; will-change: transform; }

        .shadow {
          position: absolute; left: 3em; bottom: -3em; width: 44em; height: 6em; z-index: 0;
          background: radial-gradient(closest-side, rgba(0,0,0,.6), rgba(0,0,0,0));
          filter: blur(.5em);
        }

        .back {
          position: absolute; inset: 0; z-index: 1; border-radius: .5em;
          background:
            repeating-linear-gradient(45deg, rgba(122,92,36,.22) 0 1px, transparent 1px 1.7em),
            repeating-linear-gradient(-45deg, rgba(122,92,36,.22) 0 1px, transparent 1px 1.7em),
            var(--champagne);
          box-shadow: inset 0 1.4em 2em rgba(40,28,8,.35);
        }

        .pocket {
          position: absolute; inset: 0; width: 100%; height: 100%; z-index: 3;
          clip-path: inset(0 round .5em);
          display: block;
        }

        .flap {
          position: absolute; left: 0; top: 0; width: 50em; height: 20em; z-index: 4;
          transform-origin: 50% 0;
          transform-style: preserve-3d;
          transition: transform 1s cubic-bezier(.5,.05,.25,1);
        }
        .flap.open { transform: rotateX(180deg); }
        .flap-behind .flap { z-index: 1; }
        .flap .ff, .flap .fb {
          position: absolute; inset: 0; width: 100%; height: 100%; display: block;
          backface-visibility: hidden;
        }
        .flap .ff { filter: drop-shadow(0 .6em .7em rgba(0,0,0,.4)); }
        .flap .fb {
          transform: rotateX(180deg);
          clip-path: polygon(0 100%, 100% 100%, 50% 0);
          background:
            repeating-linear-gradient(45deg, rgba(122,92,36,.28) 0 1px, transparent 1px 1.7em),
            repeating-linear-gradient(-45deg, rgba(122,92,36,.28) 0 1px, transparent 1px 1.7em),
            linear-gradient(0deg, #d7c493, var(--champagne));
        }

        .seal {
          position: absolute; left: 50%; top: 100%;
          width: 8em; height: 8em; margin: -4em 0 0 -4em; padding: 0;
          border: 0; background: none; cursor: pointer;
          transform: translateZ(.25em);
          backface-visibility: hidden;
          filter: drop-shadow(0 .4em .5em rgba(0,0,0,.45));
          -webkit-tap-highlight-color: transparent;
        }
        .seal::after {
          content: ""; position: absolute; inset: -.5em; border-radius: 50%;
          border: 1px solid rgba(var(--gold-rgb), .8);
          animation: ring 2.4s ease-out infinite;
          pointer-events: none;
        }
        .seal.broken::after { display: none; }
        .seal:focus-visible { outline: 2px solid var(--gold-hi); outline-offset: .5em; border-radius: 50%; }
        @keyframes ring { 0% { transform: scale(.92); opacity: .9; } 100% { transform: scale(1.55); opacity: 0; } }
        .seal .half { position: absolute; inset: 0; transition: transform .8s cubic-bezier(.5,0,.8,.5), opacity .7s ease .1s; }
        .seal .l { clip-path: polygon(0 0, 56% 0, 46% 22%, 58% 46%, 44% 71%, 54% 100%, 0 100%); }
        .seal .r { clip-path: polygon(56% 0, 100% 0, 100% 100%, 54% 100%, 44% 71%, 58% 46%, 46% 22%); }
        .seal.broken { pointer-events: none; }
        .seal.broken .l { transform: translate(-1.6em, 2.2em) rotate(-20deg); opacity: 0; }
        .seal.broken .r { transform: translate(1.6em, 2.8em) rotate(16deg); opacity: 0; }
        .seal .disc {
          position: absolute; inset: 0; border-radius: 50%;
          background: radial-gradient(circle at 34% 28%, var(--gold-hi), var(--gold) 46%, #8f6f33 100%);
          display: grid; place-items: center;
          font: italic 600 2.5em/1 var(--display);
          color: #5b4216;
          text-shadow: 0 1px 0 rgba(255,244,205,.5);
        }
        .seal .disc::before {
          content: ""; position: absolute; inset: .9em; border-radius: 50%;
          border: 1px solid rgba(91,66,22,.55);
        }

        .card {
          position: absolute; left: 2em; top: 2em; width: 46em; height: 29em; z-index: 2;
          transform-origin: 50% 50%;
          cursor: pointer;
        }
        .card.moving { transition: transform 1.25s cubic-bezier(.22,.8,.2,1); }
        .card.lifted { z-index: 6; }
        .rot { position: absolute; inset: 0; transform-style: preserve-3d; }
        .flip { position: absolute; inset: 0; transform-style: preserve-3d; transition: transform .95s cubic-bezier(.3,.1,.2,1); }
        .flip.turned { transform: rotateY(180deg); }
        .face {
          position: absolute; inset: 0; border-radius: .5em;
          backface-visibility: hidden;
          background:
            repeating-linear-gradient(0deg, rgba(60,40,10,.014) 0 1px, transparent 1px 3px),
            radial-gradient(120% 95% at 28% 18%, var(--paper-hi), var(--paper));
          box-shadow: 0 1.4em 3em rgba(0,0,0,.5), 0 .2em .6em rgba(0,0,0,.3);
          color: var(--ink);
        }
        .face.back-face { transform: rotateY(180deg); }
        .face::before { content: ""; position: absolute; inset: 1.2em; border: 1px solid rgba(var(--gold-rgb), .85); pointer-events: none; }
        .face::after { content: ""; position: absolute; inset: 1.7em; border: 1px solid rgba(var(--gold-rgb), .4); pointer-events: none; }
        .copy {
          position: absolute; inset: 2.2em 2.8em;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: .9em; text-align: center;
        }
        .copy .eyebrow { margin: 0; font: 500 1.3em/1.3 var(--body); letter-spacing: .26em; text-transform: uppercase; color: var(--gold-ink); }
        .names {
          margin: 0; display: flex; flex-wrap: wrap; justify-content: center; align-items: baseline; gap: 0 .3em;
          font: italic 500 4.6em/1.05 var(--display);
          font-optical-sizing: auto;
          color: var(--ink);
        }
        .names .amp { font: 400 1.15em/1 var(--script); color: var(--gold-ink); }
        .line { margin: 0; font: 300 1.6em/1.4 var(--body); color: var(--ink-soft); letter-spacing: .02em; }
        .orn { width: 12em; height: 1.2em; color: var(--gold-ink); display: block; }
        .date { margin: 0; font: 500 1.4em/1.3 var(--body); letter-spacing: .2em; text-transform: uppercase; color: var(--gold-ink); }
        .script-head { margin: 0 0 .1em; font: 400 4.2em/1 var(--script); color: var(--gold-ink); }
        .grid { margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 1.2em 2.4em; width: 100%; text-align: left; }
        .grid > div { min-width: 0; display: flex; flex-direction: column; gap: .3em; }
        .grid dt { font: 500 1.2em/1.2 var(--body); letter-spacing: .24em; text-transform: uppercase; color: var(--gold-ink); }
        .grid dd { margin: 0; font: 400 1.6em/1.25 var(--display); color: var(--ink); overflow-wrap: anywhere; }
        .grid dd + dd { font: 300 1.35em/1.3 var(--body); color: var(--ink-soft); }

        .discard .back, .discard .pocket, .discard .flap, .discard .shadow {
          opacity: 0; pointer-events: none; transition: opacity .9s ease, translate .9s ease;
        }
        .discard .back, .discard .pocket { translate: 0 7em; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { transition-duration: .01ms !important; animation: none !important; }
        }
      `}</style>

      {/* Atmospheric Background with Photo in Ground & Velvet Emerald Lighting */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Couple photograph in the ground with soft depth of field */}
        <img
          src="/src/assets/images/IMG-20261107-WA0181.jpg"
          alt="Amanda & James"
          className="w-full h-full object-cover object-center filter blur-xs scale-105 opacity-20 transition-transform duration-[14000ms] ease-out"
        />
        {/* Dark velvet room lighting */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(120% 90% at 50% 38%, #1b3a30 0%, #0b1714 62%) #0b1714'
          }}
        />
      </div>

      {/* Gold Dust Particles Canvas */}
      <canvas ref={canvasRef} id="dust" className="fixed inset-0 w-full h-full z-25 pointer-events-none" />

      {/* Top Header: Audio Atmosphere & Minimal Navigation */}
      <header className="relative z-30 px-6 sm:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c9a45c]/85">
            Aurelia Bespoke Invitation
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onToggleAudio && (
            <button
              type="button"
              onClick={onToggleAudio}
              className="px-2.5 py-1 rounded-xs bg-[#0b1714]/70 hover:bg-[#1b3a30] text-[#efe6d0] text-[10px] font-sans flex items-center gap-1.5 border border-[#c9a45c]/50 backdrop-blur-md transition-all"
              title="Toggle Number One"
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 className="w-3 h-3 text-[#ecd597]" />
                  <span className="hidden sm:inline tracking-wider uppercase text-[9px]">Number One</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3 text-neutral-400" />
                  <span className="hidden sm:inline tracking-wider uppercase text-[9px]">Muted</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleEnterCelebration}
            className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#efe6d0]/75 hover:text-[#ecd597] px-2 py-1 transition-colors flex items-center gap-1"
          >
            <span>Enter Site</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* CENTER: The Emerald & Gold Envelope Stage */}
      <div className="stage flex-1">
        <div className="scene" id="scene" ref={sceneRef}>
          {/* Eyebrow & Script Title (fades on open) */}
          <div className="headline" aria-hidden="true">
            <p className="eyebrow">A letter for you</p>
            <p className="script">You are invited</p>
          </div>

          <div className="float">
            <div className="tilt" id="tilt" ref={tiltRef}>
              <div className="shadow" />
              <div className="back" />

              {/* THE INVITATION CARD (Sliding & Lifting) */}
              <div
                className="card"
                id="card"
                ref={cardRef}
                onClick={toggleFlip}
                role="button"
                tabIndex={0}
                aria-label="Wedding Invitation Card (Click to turn over)"
              >
                <div className="rot" id="rot" ref={rotRef}>
                  <div className="flip" id="flip" ref={flipRef}>
                    {/* CARD FRONT FACE */}
                    <div className="face front-face">
                      <div className="copy">
                        <p className="eyebrow">Together with their families</p>
                        <h2 className="names">
                          <span>{brideName}</span>
                          <span className="amp">&amp;</span>
                          <span>{groomName}</span>
                        </h2>

                        <p className="line">
                          request the pleasure of your company<br />
                          at their wedding celebration
                        </p>

                        {/* Geometric Gold Filigree Ornament */}
                        <svg
                          className="orn"
                          viewBox="0 0 120 10"
                          aria-hidden="true"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth=".7"
                        >
                          <path d="M0 5H50M70 5H120" />
                          <path d="M60 1L64 5L60 9L56 5Z" />
                          <circle cx="51.5" cy="5" r=".9" fill="currentColor" />
                          <circle cx="68.5" cy="5" r=".9" fill="currentColor" />
                        </svg>

                        <p className="date">{weddingDate}</p>
                      </div>
                    </div>

                    {/* CARD BACK FACE: Details */}
                    <div className="face back-face">
                      <div className="copy">
                        <p className="script-head">The details</p>
                        <dl className="grid">
                          <div>
                            <dt>When</dt>
                            <dd>{weddingDate}</dd>
                            <dd>Benediction 13:00 · Gala 18:00</dd>
                          </div>
                          <div>
                            <dt>Where</dt>
                            <dd>{venueTitle}</dd>
                            <dd>{locationCity}</dd>
                          </div>
                          <div>
                            <dt>Attire</dt>
                            <dd>{attireInfo}</dd>
                          </div>
                          <div>
                            <dt>Kindly reply</dt>
                            <dd>{rsvpDate}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SVG POCKET (Geometric Emerald Triangular Flaps with Gold Foil Stroke) */}
              <svg className="pocket" viewBox="0 0 50 33" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="gl" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="var(--emerald-lo)" />
                    <stop offset="1" stopColor="var(--emerald)" />
                  </linearGradient>
                  <linearGradient id="gr" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0" stopColor="var(--emerald-lo)" />
                    <stop offset="1" stopColor="var(--emerald)" />
                  </linearGradient>
                  <linearGradient id="gb" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0" stopColor="var(--emerald)" />
                    <stop offset="1" stopColor="var(--emerald-hi)" />
                  </linearGradient>
                </defs>
                <polygon points="0,0 27,17 0,33" fill="url(#gl)" />
                <polygon points="50,0 23,17 50,33" fill="url(#gr)" />
                <polygon points="0,33 25,13.5 50,33" fill="url(#gb)" />
                <polyline
                  points="0,33 25,13.5 50,33"
                  fill="none"
                  stroke="#c9a45c"
                  strokeOpacity=".6"
                  strokeWidth=".8"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* 3D FOLDING FLAP & CRACKING WAX SEAL */}
              <div className="flap" id="flap" ref={flapRef}>
                {/* Front face of flap */}
                <svg className="ff" viewBox="0 0 50 20" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="var(--emerald)" />
                      <stop offset="1" stopColor="var(--emerald-hi)" />
                    </linearGradient>
                  </defs>
                  <polygon points="0,0 50,0 25,20" fill="url(#gf)" />
                  <polyline
                    points="0,0 25,20 50,0"
                    fill="none"
                    stroke="#c9a45c"
                    strokeOpacity=".7"
                    strokeWidth=".9"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polyline
                    points="3.4,1.2 25,17.2 46.6,1.2"
                    fill="none"
                    stroke="#c9a45c"
                    strokeOpacity=".35"
                    strokeWidth=".7"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* Back face of flap (revealed on open) */}
                <div className="fb" />

                {/* Wax seal split in two halves with cracked polygon clip-path */}
                <button
                  className="seal"
                  id="seal"
                  ref={sealRef}
                  type="button"
                  aria-label="Break the seal and open the invitation"
                  onClick={openIt}
                >
                  <span className="half l">
                    <span className="disc">
                      <span className="ini">{monogram}</span>
                    </span>
                  </span>
                  <span className="half r">
                    <span className="disc">
                      <span className="ini">{monogram}</span>
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROLS BAR: Refined, Smaller Luxury Sizing */}
      <footer className="relative z-30 flex justify-center items-center flex-wrap gap-2.5 pb-6 px-4">
        {phase === 'closed' ? (
          <button
            type="button"
            onClick={openIt}
            className="px-4 py-2 bg-[#c9a45c] hover:bg-[#ecd597] text-[#14211d] text-[11px] font-medium tracking-[0.18em] uppercase rounded-xs transition-colors shadow-lg cursor-pointer"
          >
            Break the seal
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={toggleFlip}
              className="px-3.5 py-2 bg-[#0b1714]/80 hover:bg-[#1b3a30] text-[#efe6d0] hover:text-[#ecd597] border border-[#c9a45c]/55 text-[10px] font-medium tracking-[0.18em] uppercase rounded-xs transition-colors shadow-md backdrop-blur-md cursor-pointer"
            >
              {turned ? 'See the front' : 'Turn over for details'}
            </button>

            <button
              type="button"
              onClick={handleEnterCelebration}
              className="px-4 py-2 bg-[#c9a45c] hover:bg-[#ecd597] text-[#14211d] text-[11px] font-semibold tracking-[0.18em] uppercase rounded-xs transition-all shadow-xl flex items-center gap-1.5 cursor-pointer"
            >
              <span>Enter Celebration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={resetExperience}
              className="p-2 bg-[#0b1714]/70 hover:bg-[#1b3a30] text-[#efe6d0]/80 hover:text-[#ecd597] border border-[#c9a45c]/40 rounded-xs transition-colors shadow-xs"
              title="Replay Envelope Animation"
              aria-label="Replay invitation envelope unsealing"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </footer>
    </div>
  );
};
