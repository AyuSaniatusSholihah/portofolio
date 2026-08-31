'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface TagItem {
  id?: string;
  text: string;
  background: string;
  color?: string;
}

export interface HeroScrollVideoRevealProps {
  topText?: React.ReactNode;
  headingText?: React.ReactNode;
  tags?: TagItem[];
  subText?: string;
  videoSrc?: string;
  bottomText?: React.ReactNode;
  badgeImgSrc?: string;
  className?: string;
}

const DEFAULT_TAGS: TagItem[] = [
  { text: 'Quiet peaks', background: '#1B211A', color: '#ffffff' },
  { text: 'Pure air energy', background: '#628141', color: '#ffffff' },
  { text: 'Endlessly renewable', background: '#EBD5AB', color: '#444444' },
  { text: 'Clean as alpine snow', background: '#2F5755', color: '#ffffff' },
];

export const HeroScrollVideoReveal: React.FC<HeroScrollVideoRevealProps> = ({
  topText = (
    <>
      Built to flow with your story,
      <br />
      not fight it
    </>
  ),
  headingText = (
    <>
      Step into mountain calm <br />
      Nature tells the story.
    </>
  ),
  tags = DEFAULT_TAGS,
  subText = 'And the journey continues beyond the summit...',
  videoSrc = 'https://res.cloudinary.com/dsuwzuaxp/video/upload/856381-hd_1920_1080_30fps_gsq11b.mp4',
  bottomText = (
    <>
      Where every scroll feels
      <br />
      intentional
    </>
  ),
  badgeImgSrc = 'https://i.ibb.co/kgFKP37B/rotate-text.png',
  className = '',
}) => {
  const benefitRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Ensure video plays smoothly
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }

    // Word split kinetic reveal animation fallback
    let words: Element[] = [];
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
        scrub: 1.5,
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

    // Helper to safely apply background color to pin spacer & pinned element without TS error
    const applyPinnedBg = (self: unknown) => {
      const trigger = self as { spacer?: HTMLElement; pin?: HTMLElement };
      if (trigger.spacer?.style) trigger.spacer.style.backgroundColor = '#07080d';
      if (trigger.pin?.style) trigger.pin.style.backgroundColor = '#07080d';
    };

    // ── Responsive MatchMedia for Small, Mid, and Large screens ─────────────
    const mm = gsap.matchMedia();

    // 1. Small Screens (Mobile < 640px)
    mm.add('(max-width: 639.9px)', () => {
      gsap.set(videoBoxRef.current, { clipPath: 'circle(18% at 50% 50%)' });

      const vpTl = gsap.timeline({
        scrollTrigger: {
          trigger: videoWrapperRef.current,
          start: 'top top',
          end: '+=1500',
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onRefresh: applyPinnedBg,
          onToggle: applyPinnedBg,
        },
      });

      vpTl.fromTo(
        videoBoxRef.current,
        { clipPath: 'circle(18% at 50% 50%)' },
        { clipPath: 'circle(150% at 50% 50%)', ease: 'none' }
      );
    });

    // 2. Mid Screens (Tablets / Phablets 640px - 1023.9px)
    mm.add('(min-width: 640px) and (max-width: 1023.9px)', () => {
      gsap.set(videoBoxRef.current, { clipPath: 'circle(12% at 50% 50%)' });

      const vpTl = gsap.timeline({
        scrollTrigger: {
          trigger: videoWrapperRef.current,
          start: 'top top',
          end: '+=2000',
          scrub: 1.3,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onRefresh: applyPinnedBg,
          onToggle: applyPinnedBg,
        },
      });

      vpTl.fromTo(
        videoBoxRef.current,
        { clipPath: 'circle(12% at 50% 50%)' },
        { clipPath: 'circle(150% at 50% 50%)', ease: 'none' }
      );
    });

    // 3. Large Screens (Desktop >= 1024px)
    mm.add('(min-width: 1024px)', () => {
      gsap.set(videoBoxRef.current, { clipPath: 'circle(8% at 50% 50%)' });

      const vpTl = gsap.timeline({
        scrollTrigger: {
          trigger: videoWrapperRef.current,
          start: 'top top',
          end: '+=2500',
          scrub: 1.5,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onRefresh: applyPinnedBg,
          onToggle: applyPinnedBg,
        },
      });

      vpTl.fromTo(
        videoBoxRef.current,
        { clipPath: 'circle(8% at 50% 50%)' },
        { clipPath: 'circle(150% at 50% 50%)', ease: 'none' }
      );
    });

    return () => {
      revealTl.kill();
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

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
            body, html {
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
              className="text-[clamp(2rem,5vw,5rem)] font-extrabold tracking-tight leading-tight text-white overflow-visible"
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

        {/* ── Video Pin Section ───────────────────────────────────────────── */}
        <div className="relative w-full bg-[#07080d]" style={{ backgroundColor: '#07080d' }}>
          <div
            ref={videoWrapperRef}
            className="w-full h-screen flex justify-center items-center relative overflow-hidden bg-[#07080d]"
            style={{ backgroundColor: '#07080d' }}
          >
            {/* Absolute solid dark underlay behind the video expansion circle */}
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
              className="relative w-full h-full overflow-hidden flex justify-center items-center bg-[#07080d] will-change-[clip-path]"
              style={{ backgroundColor: '#07080d', zIndex: 2 }}
            >
              {/* Rotating Circular Text Badge */}
              {badgeImgSrc && (
                <img
                  src={badgeImgSrc}
                  alt="rotating badge"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 z-20 pointer-events-none animate-[spin_18s_linear_infinite] opacity-90 select-none"
                />
              )}

              {/* Drone Video */}
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                crossOrigin="anonymous"
                className="w-full h-full object-cover bg-[#07080d]"
                style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#07080d' }}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>

              {/* Centered Glassmorphic Play Icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex justify-center items-center shadow-xl">
                  <img
                    src="https://i.ibb.co/Q3RY2jTB/play-icon.png"
                    alt="play"
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 object-contain"
                  />
                </div>
              </div>
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
