export const mockupCss = `
.pem {
  container-type: inline-size;
  --pem-accent: #4cc9ff;
  --pem-g1: #4a4468;
  --pem-g2: #3a3558;
  --pem-g3: #2a2644;
}

.pem-win {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 40px 120px -20px rgba(34, 170, 235, 0.45);
  background: linear-gradient(to bottom right, var(--pem-g1), var(--pem-g2), var(--pem-g3));
}

@media (min-width: 640px) {
  .pem-win {
    border-radius: 28px;
  }
}

.pem-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #1b1f2b;
  padding: 0 12px;
}

@media (min-width: 640px) {
  .pem-top {
    height: 56px;
    padding: 0 16px;
  }
}

.pem-rail {
  display: none;
  width: 48px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  background: #232327;
  flex-direction: column;
  justify-content: center;
  padding-top: 12px;
}

@media (min-width: 640px) {
  .pem-rail {
    display: flex;
  }
}

.pem-rail-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  color: rgb(203, 213, 225);
}

.pem-rail-divider {
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.pem-canvas {
  flex: 1;
  padding: 12px;
}

@media (min-width: 640px) {
  .pem-canvas {
    padding: 24px;
  }
}

.pem-pop {
  position: absolute;
  right: 8px;
  top: 36px;
  width: 112px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.95);
  padding: 10px;
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
}

@media (min-width: 640px) {
  .pem-pop {
    right: 12px;
    top: 36px;
    width: 112px;
    padding: 10px;
  }
}

.pem-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  border-radius: 9999px;
  background: var(--pem-accent);
  color: #062033;
  font-weight: 600;
  font-size: 11px;
  line-height: 1.5;
  padding: 8px 16px;
  white-space: nowrap;
}

@media (min-width: 640px) {
  .pem-btn {
    font-size: 12px;
    padding: 10px 20px;
  }
}

.pem-cursor {
  position: absolute;
  bottom: 34%;
  left: 52%;
  z-index: 10;
}

@media (prefers-reduced-motion: no-preference) {
  .pem-cursor {
    animation: pe-cursor-move 7s ease-in-out infinite;
  }
}

@media (prefers-reduced-motion: no-preference) {
  @keyframes pe-cursor-move {
    0%,
    100% {
      transform: translate3d(0, 0, 0);
    }
    25% {
      transform: translate3d(14px, -10px, 0);
    }
    50% {
      transform: translate3d(28px, 6px, 0);
    }
    75% {
      transform: translate3d(10px, 14px, 0);
    }
  }
}
`;
