'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import defaultLogo from '../../assets/projects/logo.jpg';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_TAGS = [
  { text: 'ML Enthusiast', background: '#0284c7', color: '#ffffff' },
  { text: 'Web Developer', background: '#db2777', color: '#ffffff' },
  { text: 'Creative Tech', background: '#4f46e5', color: '#ffffff' },
  { text: 'Always Learning', background: '#10b981', color: '#ffffff' },
];

export const HeroScrollVideoReveal = ({
  topText = (
    <>
      Crafting digital experiences,
      <br />
      one scroll at a time
    </>
  ),
  headingText = (
    <>
      Driven by curiosity. <br />
      Shaping ideas into reality.
    </>
  ),
  tags = DEFAULT_TAGS,
  subText = 'Bridging modern technology, design aesthetics, and real-world impact...',
  videoSrc = null,
  bottomText = (
    <>
      Let's explore what lies ahead
      <br />
      and build the future
    </>
  ),
  badgeImgSrc = defaultLogo,
  className = '',
}) => {
  const benefitRef = useRef(null);
  const videoWrapperRef = useRef(null);
  const videoBoxRef = useRef(null);
  const badgeRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const paraRef = useRef(null);
  const tagRefs = useRef([]);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // ── High-Performance Interactive Blue Aurora & Particle Canvas Background ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes for ambient floating network
    const particleCount = 45;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        color: i % 3 === 0 ? 'rgba(56, 189, 248, ' : i % 3 === 1 ? 'rgba(99, 102, 241, ' : 'rgba(236, 72, 153, ',
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Deep Oceanic Blue Gradient Base
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      bgGrad.addColorStop(0, '#0c1a3a');
      bgGrad.addColorStop(0.35, '#071128');
      bgGrad.addColorStop(0.7, '#040918');
      bgGrad.addColorStop(1, '#020409');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Animated Luminous Aurora Waves
      const waveCount = 4;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const baseHeight = height * (0.4 + w * 0.15);
        const amplitude = 40 + w * 18;
        const frequency = 0.0025 + w * 0.001;
        const speed = time * (0.8 + w * 0.3);

        ctx.moveTo(0, height);
        ctx.lineTo(0, baseHeight);

        for (let x = 0; x <= width; x += 15) {
          const y =
            baseHeight +
            Math.sin(x * frequency + speed) * amplitude +
            Math.cos(x * frequency * 0.5 + speed * 0.7) * (amplitude * 0.5);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const waveGrad = ctx.createLinearGradient(0, baseHeight - 50, 0, height);
        if (w === 0) {
          waveGrad.addColorStop(0, 'rgba(14, 165, 233, 0.22)');
          waveGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.12)');
          waveGrad.addColorStop(1, 'rgba(3, 7, 18, 0.8)');
        } else if (w === 1) {
          waveGrad.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
          waveGrad.addColorStop(0.6, 'rgba(147, 51, 234, 0.08)');
          waveGrad.addColorStop(1, 'rgba(3, 7, 18, 0.85)');
        } else if (w === 2) {
          waveGrad.addColorStop(0, 'rgba(6, 182, 212, 0.16)');
          waveGrad.addColorStop(0.7, 'rgba(37, 99, 235, 0.06)');
          waveGrad.addColorStop(1, 'rgba(3, 7, 18, 0.9)');
        } else {
          waveGrad.addColorStop(0, 'rgba(236, 72, 153, 0.14)');
          waveGrad.addColorStop(0.8, 'rgba(79, 70, 229, 0.05)');
          waveGrad.addColorStop(1, 'rgba(3, 7, 18, 0.95)');
        }

        ctx.fillStyle = waveGrad;
        ctx.fill();
      }

      // 3. Floating Bioluminescent Energy Particles & Network Lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#38bdf8';
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 110) * 0.18})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // 4. Center Glowing Blue Energy Orb Pulse
      const centerOrbGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        240 + Math.sin(time * 2) * 25
      );
      centerOrbGrad.addColorStop(0, 'rgba(14, 165, 233, 0.35)');
      centerOrbGrad.addColorStop(0.4, 'rgba(59, 130, 246, 0.18)');
      centerOrbGrad.addColorStop(0.8, 'rgba(99, 102, 241, 0.05)');
      centerOrbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = centerOrbGrad;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 280, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // ── GSAP Bidirectional Scroll Pin Timeline (Expand on Scroll Down, Shrink on Scroll Up) ──
  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }

    // Kinetic word split reveal animation helper
    let words = [];
    if (paraRef.current) {
      const textNodes = paraRef.current.innerText || '';
      if (!paraRef.current.querySelector('.reveal-word')) {
        const wordsArray = textNodes.split(' ');
        paraRef.current.innerHTML = wordsArray
          .map((w) => `<span class="reveal-word inline-block origin-left mr-[0.25em] will-change-transform">${w}</span>`)
          .join(' ');
      }
      words = Array.from(paraRef.current.querySelectorAll('.reveal-word'));
    }

    if (words && words.length > 0) {
      gsap.set(words, { opacity: 0, rotate: 8, yPercent: 30 });
    }

    // Reveal timeline for headline & tag badges
    const revealTl = gsap.timeline({
      scrollTrigger: {
        trigger: benefitRef.current,
        start: 'top 70%',
        end: 'top -10%',
        scrub: 1.2,
      },
    });

    if (words && words.length > 0) {
      revealTl.to(words, {
        stagger: 0.2,
        opacity: 1,
        rotate: 0,
        yPercent: 0,
        ease: 'power1.inOut',
      });
    }

    tagRefs.current.forEach((tagEl) => {
      if (tagEl) {
        revealTl.to(
          tagEl,
          {
            duration: 1,
            opacity: 1,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            ease: 'circ.out',
          },
          '>-0.4'
        );
      }
    });

    const applyPinnedBg = (self) => {
      if (self.spacer) self.spacer.style.backgroundColor = '#07080d';
      if (self.pin) self.pin.style.backgroundColor = '#07080d';
    };

    // ── Responsive MatchMedia for Small, Mid, and Large screens ─────────────
    const mm = gsap.matchMedia();

    // 1. Small Screens (Mobile < 640px): Expand on Scroll Down -> Shrink on Scroll Up
    mm.add('(max-width: 639.9px)', () => {
      gsap.set(videoBoxRef.current, { clipPath: 'circle(22% at 50% 50%)' });
      if (badgeRef.current) gsap.set(badgeRef.current, { scale: 0.95, opacity: 1 });

      const vpTl = gsap.timeline({
        scrollTrigger: {
          trigger: videoWrapperRef.current,
          start: 'top top',
          end: '+=1500',
          scrub: 1.0, // Buttery smooth bidirectional scrub
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onRefresh: applyPinnedBg,
          onToggle: applyPinnedBg,
        },
      });

      vpTl
        .fromTo(
          videoBoxRef.current,
          { clipPath: 'circle(22% at 50% 50%)' },
          { clipPath: 'circle(150% at 50% 50%)', ease: 'power1.inOut' },
          0
        )
        .fromTo(
          badgeRef.current,
          { scale: 0.95, opacity: 1 },
          { scale: 1.15, opacity: 0.95, ease: 'power1.inOut' },
          0
        );
    });

    // 2. Mid Screens (Tablets 640px - 1023.9px)
    mm.add('(min-width: 640px) and (max-width: 1023.9px)', () => {
      gsap.set(videoBoxRef.current, { clipPath: 'circle(14% at 50% 50%)' });
      if (badgeRef.current) gsap.set(badgeRef.current, { scale: 1, opacity: 1 });

      const vpTl = gsap.timeline({
        scrollTrigger: {
          trigger: videoWrapperRef.current,
          start: 'top top',
          end: '+=2000',
          scrub: 1.0,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onRefresh: applyPinnedBg,
          onToggle: applyPinnedBg,
        },
      });

      vpTl
        .fromTo(
          videoBoxRef.current,
          { clipPath: 'circle(14% at 50% 50%)' },
          { clipPath: 'circle(150% at 50% 50%)', ease: 'power1.inOut' },
          0
        )
        .fromTo(
          badgeRef.current,
          { scale: 1, opacity: 1 },
          { scale: 1.2, opacity: 0.95, ease: 'power1.inOut' },
          0
        );
    });

    // 3. Large Screens (Desktop >= 1024px)
    mm.add('(min-width: 1024px)', () => {
      gsap.set(videoBoxRef.current, { clipPath: 'circle(10% at 50% 50%)' });
      if (badgeRef.current) gsap.set(badgeRef.current, { scale: 1, opacity: 1 });

      const vpTl = gsap.timeline({
        scrollTrigger: {
          trigger: videoWrapperRef.current,
          start: 'top top',
          end: '+=2400',
          scrub: 1.0, // 100% synchronized continuous scrub in both scroll directions
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onRefresh: applyPinnedBg,
          onToggle: applyPinnedBg,
        },
      });

      vpTl
        .fromTo(
          videoBoxRef.current,
          { clipPath: 'circle(10% at 50% 50%)' },
          { clipPath: 'circle(150% at 50% 50%)', ease: 'power1.inOut' },
          0
        )
        .fromTo(
          badgeRef.current,
          { scale: 1, opacity: 1 },
          { scale: 1.25, opacity: 0.95, ease: 'power1.inOut' },
          0
        );
    });

    return () => {
      revealTl.kill();
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [videoSrc]);

  return (
    <div
      className={`w-full min-h-screen bg-[#07080d] text-[#f3f4f6] font-sans overflow-x-hidden ${className}`}
      style={{ backgroundColor: '#07080d', color: '#f3f4f6' }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .pin-spacer {
              background-color: #07080d !important;
            }
          `,
        }}
      />

      {/* ── Section 1: Intro Text ────────────────────────────────────────── */}
      <section
        className="w-full py-16 sm:py-24 flex justify-center items-center text-center px-4 sm:px-8 text-[clamp(1.8rem,4vw,3.5rem)] font-bold tracking-tight leading-tight text-white relative z-10 bg-[#07080d]"
        style={{ backgroundColor: '#07080d' }}
      >
        {topText}
      </section>

      {/* ── Section 2: Benefit & Headline Section ─────────────────────────── */}
      <section
        ref={benefitRef}
        className="relative w-full min-h-[140vh] md:min-h-[160vh] pb-16 md:pb-20 bg-[#07080d]"
        style={{ backgroundColor: '#07080d' }}
      >
        <div
          className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24 flex flex-col items-center text-center relative z-10 bg-[#07080d]"
          style={{ backgroundColor: '#07080d' }}
        >
          {/* Animated Kinetic Headline */}
          <div className="w-full mb-8 sm:mb-12 md:mb-14">
            <p
              ref={paraRef}
              className="text-[clamp(2rem,5vw,5rem)] font-extrabold tracking-tight leading-tight text-white overflow-visible font-heading"
            >
              {headingText}
            </p>
          </div>

          {/* Staggered Clip-Path Tag Badges */}
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4 max-w-4xl mx-auto my-4 sm:my-6 mb-8 sm:mb-14">
            {tags.map((tag, idx) => (
              <div
                key={tag.id || `tag-${idx}`}
                ref={(el) => {
                  tagRefs.current[idx] = el;
                }}
                className="px-5 sm:px-8 py-2.5 sm:py-4 rounded-full text-[clamp(0.95rem,2vw,1.8rem)] font-semibold tracking-tight opacity-0 shadow-2xl will-change-[clip-path,opacity]"
                style={{
                  backgroundColor: tag.background,
                  color: tag.color || '#ffffff',
                  clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                }}
              >
                {tag.text}
              </div>
            ))}
          </div>

          {subText && (
            <p className="text-[clamp(0.95rem,1.5vw,1.35rem)] text-zinc-400 font-normal max-w-xl mt-2 sm:mt-4 px-4">
              {subText}
            </p>
          )}
        </div>

        {/* ── Video / Canvas Pin Section ───────────────────────────────────────────── */}
        <div className="relative w-full bg-[#07080d]" style={{ backgroundColor: '#07080d' }}>
          <div
            ref={videoWrapperRef}
            className="w-full h-screen flex justify-center items-center relative overflow-hidden bg-[#07080d]"
            style={{ backgroundColor: '#07080d' }}
          >
            {/* Absolute solid dark underlay behind the expansion circle */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none bg-[#07080d]"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#07080d',
                zIndex: 1,
              }}
            />

            <div
              ref={videoBoxRef}
              className="relative w-full h-full overflow-hidden flex justify-center items-center bg-[#07080d] will-change-[clip-path] transform-gpu"
              style={{ backgroundColor: '#07080d', zIndex: 2 }}
            >
              {/* Dynamic Luminous Blue Aurora Canvas Engine */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
              />

              {/* Cyber Ambient Glowing Grid Overlay */}
              <div
                className="absolute inset-0 z-[1] pointer-events-none opacity-25"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(56, 189, 248, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.15) 1px, transparent 1px)',
                  backgroundSize: '48px 48px',
                }}
              />

              {/* Glowing Vignette & Edge Lighting */}
              <div className="absolute inset-0 pointer-events-none z-[2] bg-radial-vignette" />

              {/* Rotating Circular Holographic Logo Badge */}
              {badgeImgSrc && (
                <div
                  ref={badgeRef}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 z-20 pointer-events-none flex items-center justify-center will-change-transform"
                >
                  {/* Outer Pulsing Aura Glow */}
                  <div className="absolute inset-[-14px] sm:inset-[-20px] rounded-full bg-gradient-to-r from-sky-500/40 via-blue-600/40 to-pink-500/40 blur-xl animate-pulse pointer-events-none" />

                  {/* Outer Counter-Rotating Dashed Cyber Ring */}
                  <div className="absolute inset-[-6px] sm:inset-[-8px] rounded-full border-2 border-dashed border-sky-400/60 animate-[spin_24s_linear_infinite_reverse]" />

                  {/* Inner Fast-Rotating Gradient Ring */}
                  <div className="w-full h-full rounded-full p-1 sm:p-1.5 bg-gradient-to-tr from-pink-500 via-indigo-500 to-sky-400 animate-[spin_12s_linear_infinite] shadow-[0_0_45px_rgba(56,189,248,0.55)]">
                    <img
                      src={badgeImgSrc}
                      alt="Nia Portfolio Logo"
                      className="w-full h-full rounded-full object-cover border-2 border-slate-950/90 select-none shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* Optional Custom Video Component with Smooth Fallback */}
              {videoSrc && (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  crossOrigin="anonymous"
                  onLoadedData={() => setVideoLoaded(true)}
                  onError={() => setVideoLoaded(false)}
                  className={`w-full h-full object-cover z-[3] transition-opacity duration-700 ${
                    videoLoaded ? 'opacity-80 mix-blend-screen' : 'opacity-0'
                  }`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Bottom Outro Text ─────────────────────────────────── */}
      <section
        className="w-full py-16 sm:py-24 flex justify-center items-center text-center px-4 sm:px-8 text-[clamp(1.8rem,4vw,3.5rem)] font-bold tracking-tight leading-tight text-white relative z-10 bg-[#07080d]"
        style={{ backgroundColor: '#07080d' }}
      >
        {bottomText}
      </section>
    </div>
  );
};

export default HeroScrollVideoReveal;
