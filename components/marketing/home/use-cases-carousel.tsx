'use client';

import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
} from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from '../../shared/reveal';
import styles from './use-cases-carousel.module.css';

type CardLayout = 'text-left' | 'art-left';

interface UseCase {
  id: string;
  title: string;
  label: string;
  description: string;
  href: string;
  background: string;
  textColor: string;
  artWash: string;
  layout: CardLayout;
  Art: () => ReactElement;
}

interface CarouselMetrics {
  track: HTMLDivElement;
  stride: number;
  setWidth: number;
}

function YouTubersArt() {
  return (
    <svg
      className={styles.artSvg}
      viewBox="0 0 280 340"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect
        x="52"
        y="58"
        width="176"
        height="128"
        rx="22"
        fill="currentColor"
        opacity="0.18"
      />
      <rect
        x="52"
        y="58"
        width="176"
        height="128"
        rx="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.35"
      />
      <circle cx="140" cy="122" r="31" fill="currentColor" opacity="0.85" />
      <path d="M132 106 L156 122 L132 138 Z" fill="#7DF9B0" />
      <rect
        x="52"
        y="214"
        width="176"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.18"
      />
      <rect
        x="52"
        y="214"
        width="96"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.55"
      />
      <circle cx="148" cy="217" r="7" fill="currentColor" />
      <rect
        x="52"
        y="244"
        width="52"
        height="46"
        rx="12"
        fill="currentColor"
        opacity="0.12"
      />
      <rect
        x="114"
        y="244"
        width="52"
        height="46"
        rx="12"
        fill="currentColor"
        opacity="0.18"
      />
      <rect
        x="176"
        y="244"
        width="52"
        height="46"
        rx="12"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M70 258h16M70 268h24M132 258h16M132 268h24M194 258h16M194 268h24"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

function BusinessesArt() {
  return (
    <svg
      className={styles.artSvg}
      viewBox="0 0 280 340"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect
        x="36"
        y="62"
        width="208"
        height="210"
        rx="24"
        fill="rgba(255,255,255,0.05)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
      />
      <rect x="58" y="86" width="74" height="8" rx="4" fill="#00C2FF" />
      <rect
        x="58"
        y="108"
        width="122"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.24"
      />
      <rect
        x="58"
        y="132"
        width="164"
        height="102"
        rx="16"
        fill="currentColor"
        opacity="0.06"
      />
      <path
        d="M74 210 L104 182 L132 196 L160 162 L192 178 L216 146"
        fill="none"
        stroke="#00C2FF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="104" cy="182" r="5" fill="#E8C730" />
      <circle cx="160" cy="162" r="5" fill="#FF3D00" />
      <circle cx="216" cy="146" r="5" fill="#CDB8FF" />
      <rect
        x="58"
        y="250"
        width="64"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.18"
      />
      <rect x="132" y="250" width="42" height="8" rx="4" fill="#E8C730" />
      <circle cx="224" cy="92" r="11" fill="#CDB8FF" />
    </svg>
  );
}

function PodcastersArt() {
  const bars = [18, 30, 44, 26, 54, 38, 64, 48, 70, 44, 58, 32, 46, 28];

  return (
    <svg
      className={styles.artSvg}
      viewBox="0 0 280 340"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect
        x="104"
        y="52"
        width="72"
        height="136"
        rx="36"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.35"
      />
      <path
        d="M112 82h56M112 102h56M112 122h56M112 142h56"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.18"
      />
      <path
        d="M140 188v34"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M112 198v10c0 18 13 30 28 30s28-12 28-30v-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M140 238v22M116 260h48"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />
      {bars.map((height, index) => (
        <rect
          key={index}
          x={48 + index * 14}
          y={312 - height / 2}
          width="6"
          height={height}
          rx="3"
          fill="currentColor"
          opacity={index % 2 === 0 ? 0.45 : 0.24}
        />
      ))}
    </svg>
  );
}

function RealtorsArt() {
  return (
    <svg
      className={styles.artSvg}
      viewBox="0 0 280 340"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <path
        d="M54 190 L140 112 L226 190"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <path
        d="M76 176 V270 H204 V176"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
        opacity="0.38"
      />
      <rect
        x="118"
        y="220"
        width="44"
        height="50"
        rx="8"
        fill="currentColor"
        opacity="0.18"
      />
      <rect
        x="118"
        y="220"
        width="44"
        height="50"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.35"
      />
      <circle cx="150" cy="246" r="3" fill="currentColor" />
      <path
        d="M204 94c-15 0-27 12-27 27 0 21 27 45 27 45s27-24 27-45c0-15-12-27-27-27z"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.4"
      />
      <circle cx="204" cy="121" r="8" fill="currentColor" opacity="0.7" />
      <rect
        x="54"
        y="286"
        width="172"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.18"
      />
      <rect
        x="54"
        y="286"
        width="110"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  );
}

function CourseCreatorsArt() {
  return (
    <svg
      className={styles.artSvg}
      viewBox="0 0 280 340"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect
        x="42"
        y="48"
        width="196"
        height="118"
        rx="18"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.24"
      />
      <rect
        x="62"
        y="70"
        width="88"
        height="9"
        rx="4"
        fill="currentColor"
        opacity="0.45"
      />
      <rect
        x="62"
        y="90"
        width="132"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.2"
      />
      <circle
        cx="202"
        cy="112"
        r="22"
        fill="currentColor"
        opacity="0.16"
      />
      <path
        d="M196 102 L212 112 L196 122 Z"
        fill="currentColor"
        opacity="0.7"
      />
      <rect
        x="62"
        y="130"
        width="118"
        height="5"
        rx="2.5"
        fill="currentColor"
        opacity="0.15"
      />
      <rect
        x="62"
        y="130"
        width="72"
        height="5"
        rx="2.5"
        fill="currentColor"
        opacity="0.55"
      />
      <rect
        x="54"
        y="188"
        width="172"
        height="106"
        rx="18"
        fill="currentColor"
        fillOpacity="0.07"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.22"
      />
      <rect
        x="74"
        y="208"
        width="70"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="74"
        y="228"
        width="118"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.18"
      />
      <circle
        cx="82"
        cy="266"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.45"
      />
      <rect
        x="100"
        y="262"
        width="68"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.25"
      />
      <path
        d="M156 248 L163 255 L176 241"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}

function DoctorsArt() {
  return (
    <svg
      className={styles.artSvg}
      viewBox="0 0 280 340"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <circle
        cx="140"
        cy="132"
        r="62"
        fill="currentColor"
        opacity="0.08"
      />
      <path
        d="M148 196C132 180 96 158 96 126c0-20 15-35 34-35 7 0 14 3 18 9 4-6 11-9 18-9 19 0 34 15 34 35 0 32-36 54-52 70z"
        fill="currentColor"
        opacity="0.42"
      />
      <rect
        x="208"
        y="58"
        width="14"
        height="44"
        rx="7"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="193"
        y="73"
        width="44"
        height="14"
        rx="7"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M42 258 H88 L102 232 L118 288 L134 252 L148 266 H238"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <rect
        x="42"
        y="292"
        width="196"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.1"
      />
      <rect
        x="42"
        y="292"
        width="112"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}

function LawyersArt() {
  return (
    <svg
      className={styles.artSvg}
      viewBox="0 0 280 340"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <circle
        cx="140"
        cy="70"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.45"
      />
      <path
        d="M140 80 V246"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M74 112 H206"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M74 112 L44 182 H104 Z"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeOpacity="0.4"
      />
      <path
        d="M206 112 L176 182 H236 Z"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeOpacity="0.4"
      />
      <path
        d="M106 224 H174 M140 224 V252 M110 270 H170"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M58 284 H222"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.3"
      />
      <rect
        x="62"
        y="296"
        width="38"
        height="10"
        rx="5"
        fill="currentColor"
        opacity="0.12"
      />
      <rect
        x="180"
        y="296"
        width="38"
        height="10"
        rx="5"
        fill="currentColor"
        opacity="0.12"
      />
    </svg>
  );
}

const useCases: UseCase[] = [
  {
    id: 'youtubers',
    title: 'YouTubers',
    label: 'Use case',
    description: 'Daily uploads without the editing bottleneck.',
    href: '/use-cases/youtubers',
    background: '#7DF9B0',
    textColor: '#0B2A1D',
    artWash: 'rgba(255, 255, 255, 0.24)',
    layout: 'text-left',
    Art: YouTubersArt,
  },
  {
    id: 'businesses',
    title: 'Businesses',
    label: 'Use case',
    description: 'Brand films that convert and teams that trust.',
    href: '/use-cases/businesses',
    background: '#1B1B1B',
    textColor: '#FFFFFF',
    artWash: 'rgba(255, 255, 255, 0.055)',
    layout: 'art-left',
    Art: BusinessesArt,
  },
  {
    id: 'podcasters',
    title: 'Podcasters',
    label: 'Use case',
    description: 'Show-ready audio and video from raw recordings.',
    href: '/use-cases/podcasters',
    background: 'linear-gradient(135deg, #FFB9A8 0%, #FFC9BC 100%)',
    textColor: '#0B2A1D',
    artWash: 'rgba(255, 255, 255, 0.28)',
    layout: 'text-left',
    Art: PodcastersArt,
  },
  {
    id: 'realtors',
    title: 'Realtors',
    label: 'Use case',
    description: 'Property videos that move listings faster.',
    href: '/use-cases/realtors',
    background: 'linear-gradient(135deg, #C2622D 0%, #E39A66 100%)',
    textColor: '#1A0B04',
    artWash: 'rgba(255, 255, 255, 0.18)',
    layout: 'art-left',
    Art: RealtorsArt,
  },
  {
    id: 'course-creators',
    title: 'Course creators',
    label: 'Use case',
    description: 'Polished lessons that students finish.',
    href: '/use-cases/course-creators',
    background: 'linear-gradient(135deg, #CDB8FF 0%, #E6DBFF 100%)',
    textColor: '#0B2A1D',
    artWash: 'rgba(255, 255, 255, 0.3)',
    layout: 'text-left',
    Art: CourseCreatorsArt,
  },
  {
    id: 'doctors',
    title: 'Doctors',
    label: 'Use case',
    description: 'Patient education videos that build trust.',
    href: '/use-cases/doctors',
    background: 'linear-gradient(135deg, #BFE6FF 0%, #DDF1FF 100%)',
    textColor: '#0B2A1D',
    artWash: 'rgba(255, 255, 255, 0.32)',
    layout: 'art-left',
    Art: DoctorsArt,
  },
  {
    id: 'lawyers',
    title: 'Lawyers',
    label: 'Use case',
    description: 'Firm videos that communicate authority.',
    href: '/use-cases/lawyers',
    background: 'linear-gradient(135deg, #25246B 0%, #3B3AA0 100%)',
    textColor: '#FFFFFF',
    artWash: 'rgba(255, 255, 255, 0.075)',
    layout: 'text-left',
    Art: LawyersArt,
  },
];

const USE_CASE_COUNT = useCases.length;

function readMetrics(track: HTMLDivElement | null): CarouselMetrics | null {
  if (!track) return null;

  const cards = track.querySelectorAll<HTMLElement>('[data-use-case-card]');
  if (cards.length < 2) return null;

  const stride =
    cards[1].getBoundingClientRect().left -
    cards[0].getBoundingClientRect().left;

  if (!Number.isFinite(stride) || stride <= 0) return null;

  return {
    track,
    stride,
    setWidth: stride * USE_CASE_COUNT,
  };
}

function normalizeTrack(track: HTMLDivElement | null) {
  const metrics = readMetrics(track);
  if (!metrics) return;

  const { setWidth } = metrics;
  const { scrollLeft } = metrics.track;

  if (scrollLeft < setWidth * 0.5) {
    metrics.track.scrollTo({
      left: scrollLeft + setWidth,
      behavior: 'auto',
    });
  } else if (scrollLeft > setWidth * 1.5) {
    metrics.track.scrollTo({
      left: scrollLeft - setWidth,
      behavior: 'auto',
    });
  }
}

export function UseCasesCarousel() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const normalizeTimerRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);
  const isFocusWithinRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isTouchingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const metrics = readMetrics(trackRef.current);
      if (!metrics) return;

      metrics.track.scrollTo({
        left: metrics.setWidth,
        behavior: 'auto',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    return () => {
      if (normalizeTimerRef.current !== null) {
        window.clearTimeout(normalizeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let resizeTimer: number | null = null;
    let lastViewportWidth = window.innerWidth;

    const handleResize = () => {
      if (window.innerWidth === lastViewportWidth) return;

      lastViewportWidth = window.innerWidth;

      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }

      resizeTimer = window.setTimeout(() => {
        resizeTimer = null;
        if (isDraggingRef.current || isTouchingRef.current) return;

        const metrics = readMetrics(trackRef.current);
        if (!metrics) return;

        metrics.track.scrollTo({
          left: metrics.setWidth,
          behavior: 'auto',
        });
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const interval = window.setInterval(() => {
      if (
        isHoveringRef.current ||
        isFocusWithinRef.current ||
        isDraggingRef.current ||
        isTouchingRef.current ||
        document.hidden
      ) {
        return;
      }

      const metrics = readMetrics(trackRef.current);
      if (!metrics) return;

      metrics.track.scrollBy({
        left: metrics.stride,
        behavior: 'smooth',
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  const handleScroll = () => {
    if (normalizeTimerRef.current !== null) {
      window.clearTimeout(normalizeTimerRef.current);
    }

    normalizeTimerRef.current = window.setTimeout(() => {
      normalizeTimerRef.current = null;
      if (isDraggingRef.current || isTouchingRef.current) return;
      normalizeTrack(trackRef.current);
    }, 180);
  };

  const scrollByStep = (direction: -1 | 1) => {
    const metrics = readMetrics(trackRef.current);
    if (!metrics) return;

    metrics.track.scrollBy({
      left: direction * metrics.stride,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') {
      hasDraggedRef.current = false;
      isTouchingRef.current = true;
      return;
    }

    if (event.pointerType !== 'mouse' || event.button !== 0) return;

    const track = trackRef.current;
    if (!track) return;

    hasDraggedRef.current = false;
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = event.clientX;
    dragStartScrollRef.current = track.scrollLeft;
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const track = trackRef.current;
    if (!track) return;

    const delta = event.clientX - dragStartXRef.current;
    if (Math.abs(delta) > 4) {
      hasDraggedRef.current = true;

      if (!track.hasPointerCapture(event.pointerId)) {
        track.setPointerCapture(event.pointerId);
      }
    }

    track.scrollLeft = dragStartScrollRef.current - delta;
  };

  const finishDrag = (event?: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    const track = trackRef.current;
    if (track && event && track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    if (hasDraggedRef.current) {
      const metrics = readMetrics(track);
      if (metrics) {
        const snappedLeft =
          Math.round(metrics.track.scrollLeft / metrics.stride) *
          metrics.stride;

        metrics.track.scrollTo({
          left: snappedLeft,
          behavior: reduceMotion ? 'auto' : 'smooth',
        });
      }

      window.setTimeout(() => {
        hasDraggedRef.current = false;
      }, 250);
    }
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    isTouchingRef.current = false;
    finishDrag(event);
  };

  const handlePointerLeave = () => {
    if (isDraggingRef.current && !hasDraggedRef.current) {
      finishDrag();
    }
  };

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!hasDraggedRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    hasDraggedRef.current = false;
  };

  const handleFocus = () => {
    isFocusWithinRef.current = true;
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      isFocusWithinRef.current = false;
    }
  };

  return (
    <section
      className={styles.section}
      aria-labelledby="use-cases-heading"
      onMouseEnter={() => {
        isHoveringRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveringRef.current = false;
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <Reveal className={styles.intro}>
        <h2 id="use-cases-heading" className={styles.heading}>
          Edits tailored for every team.
        </h2>
        <p className={styles.subtext}>
          Kick off your next upload with a workflow built for your audience.
          Every edit style comes with the same crew, the same dashboard and the
          same clear process.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/use-cases/youtubers" className={styles.cta}>
            Explore use cases
          </Link>
        </div>
      </Reveal>

      <div
        className={styles.carousel}
        role="region"
        aria-roledescription="carousel"
        aria-label="Use cases"
      >
        <div
          ref={trackRef}
          id="use-case-track"
          className={`${styles.track}${isDragging ? ` ${styles.trackDragging}` : ''}`}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onPointerLeave={handlePointerLeave}
          onClickCapture={handleClickCapture}
          onDragStart={(event) => event.preventDefault()}
        >
          {[0, 1, 2].map((setIndex) => {
            const isClone = setIndex !== 1;

            return (
              <ul
                key={setIndex}
                className={styles.set}
                aria-hidden={isClone ? true : undefined}
              >
                {useCases.map((useCase) => {
                  const Art = useCase.Art;
                  const isArtFirst = useCase.layout === 'art-left';

                  return (
                    <li
                      key={`${setIndex}-${useCase.id}`}
                      className={styles.item}
                    >
                      <Link
                        href={useCase.href}
                        className={`${styles.card} ${
                          isArtFirst ? styles.cardArtLeft : styles.cardTextLeft
                        }`}
                        style={{
                          background: useCase.background,
                          color: useCase.textColor,
                        }}
                        draggable={false}
                        tabIndex={isClone ? -1 : undefined}
                        data-use-case-card="true"
                      >
                        <div className={styles.content}>
                          <span className={styles.label}>{useCase.label}</span>
                          <h3 className={styles.title}>{useCase.title}</h3>
                          <p className={styles.description}>
                            {useCase.description}
                          </p>
                        </div>
                        <div
                          className={`${styles.art} ${
                            isArtFirst ? styles.artLeft : styles.artRight
                          }`}
                          style={{ background: useCase.artWash }}
                          aria-hidden="true"
                        >
                          <Art />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            );
          })}
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.control}
            aria-label="Previous use case"
            aria-controls="use-case-track"
            onClick={() => scrollByStep(-1)}
          >
            <ChevronLeft aria-hidden="true" size={20} />
          </button>
          <button
            type="button"
            className={styles.control}
            aria-label="Next use case"
            aria-controls="use-case-track"
            onClick={() => scrollByStep(1)}
          >
            <ChevronRight aria-hidden="true" size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
