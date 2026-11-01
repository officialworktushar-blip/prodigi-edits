'use client';

import type { ReactNode, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  once?: boolean;
  className?: string;
  onViewportEnter?: () => void;
}

export function Reveal({
  children,
  delay = 0,
  stagger = 0,
  once = true,
  className,
  onViewportEnter,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          onViewportEnter?.();
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [once, onViewportEnter]);

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={reduceMotion || isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.35, delay: delay + stagger, ease: 'easeOut' }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
