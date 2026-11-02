'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { HeroProductWindow } from './hero-product-window';

interface FrameMotionSettings {
  tilt: number;
  initialScale: number;
  perspective: number;
}

const DESKTOP_SETTINGS: FrameMotionSettings = {
  tilt: 10,
  initialScale: 0.94,
  perspective: 1400,
};

const TABLET_SETTINGS: FrameMotionSettings = {
  tilt: 7,
  initialScale: 0.96,
  perspective: 1200,
};

const MOBILE_SETTINGS: FrameMotionSettings = {
  tilt: 4,
  initialScale: 0.985,
  perspective: 1000,
};

export function HomeVideoFrameMotion() {
  const frameRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [settings, setSettings] = useState(DESKTOP_SETTINGS);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    const updateSettings = () => {
      if (window.matchMedia('(max-width: 767px)').matches) {
        setSettings(MOBILE_SETTINGS);
      } else if (window.matchMedia('(max-width: 1023px)').matches) {
        setSettings(TABLET_SETTINGS);
      } else {
        setSettings(DESKTOP_SETTINGS);
      }
    };

    updateSettings();
    window.addEventListener('resize', updateSettings, { passive: true });

    return () => window.removeEventListener('resize', updateSettings);
  }, []);

  const rotateX = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [settings.tilt, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [settings.initialScale, 1]
  );

  return (
    <div ref={frameRef} className="home-video-frame-scene mx-auto w-full">
      <motion.div
        className="home-video-frame-motion mx-auto w-full"
        style={{
          rotateX,
          scale,
          transformPerspective: settings.perspective,
          transformOrigin: 'center center',
        }}
      >
        <div className="home-video-frame-border mx-auto w-full rounded-[24px] p-[2px] sm:rounded-[30px]">
          <HeroProductWindow />
        </div>
      </motion.div>
    </div>
  );
}
