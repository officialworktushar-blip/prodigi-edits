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

interface VisibilityRange {
  enter: number;
  exit: number;
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
  const [visibilityRange, setVisibilityRange] = useState<VisibilityRange>({
    enter: 0.4,
    exit: 0.6,
  });
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });
  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(max-width: 1023px)');
    const updateSettings = () => {
      setSettings(
        mobileQuery.matches
          ? MOBILE_SETTINGS
          : tabletQuery.matches
            ? TABLET_SETTINGS
            : DESKTOP_SETTINGS
      );
    };

    updateSettings();
    mobileQuery.addEventListener('change', updateSettings);
    tabletQuery.addEventListener('change', updateSettings);

    return () => {
      mobileQuery.removeEventListener('change', updateSettings);
      tabletQuery.removeEventListener('change', updateSettings);
    };
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateVisibilityRange = () => {
      const frameHeight = frame.offsetHeight;
      const viewportHeight = window.innerHeight;

      if (frameHeight <= 0 || viewportHeight <= 0 || frameHeight >= viewportHeight) {
        setVisibilityRange({ enter: 0.4, exit: 0.6 });
        return;
      }

      const totalTravel = frameHeight + viewportHeight;
      setVisibilityRange({
        enter: frameHeight / totalTravel,
        exit: viewportHeight / totalTravel,
      });
    };

    const resizeObserver = new ResizeObserver(updateVisibilityRange);
    resizeObserver.observe(frame);
    updateVisibilityRange();
    window.addEventListener('resize', updateVisibilityRange, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateVisibilityRange);
    };
  }, []);

  const transitionStart = Math.max(0, visibilityRange.enter - 0.1);
  const transitionEnd = Math.min(1, visibilityRange.exit + 0.1);
  const scrollStops = [
    0,
    transitionStart,
    visibilityRange.enter,
    visibilityRange.exit,
    transitionEnd,
    1,
  ];
  const rotateX = useTransform(
    scrollYProgress,
    scrollStops,
    prefersReducedMotion
      ? [0, 0, 0, 0, 0, 0]
      : [settings.tilt, settings.tilt, 0, 0, settings.tilt, settings.tilt]
  );
  const scale = useTransform(
    scrollYProgress,
    scrollStops,
    prefersReducedMotion
      ? [1, 1, 1, 1, 1, 1]
      : [
          settings.initialScale,
          settings.initialScale,
          1,
          1,
          settings.initialScale,
          settings.initialScale,
        ]
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
        <HeroProductWindow />
      </motion.div>
    </div>
  );
}
