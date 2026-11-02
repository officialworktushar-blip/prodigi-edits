import type { ReactNode } from 'react';
import styles from './review-delivery-section.module.css';

interface ReviewDeliveryCard {
  title: string;
  description: string;
  media: ReactNode;
}

const barHeights: number[] = [
  12, 18, 10, 22, 16, 26, 19, 30, 23, 17, 28, 34, 25, 21, 31, 37, 32, 24, 35,
  27, 20, 33, 40, 34, 26, 38, 29, 22, 36, 28,
];

const barChartPoints = barHeights
  .map((height, index) => `${index * 10 + 5},${57 - height * 0.92}`)
  .join(' ');

function ProgressRings() {
  return (
    <div className={styles.ringRow}>
      <div className={styles.ringItem}>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle
            className={styles.ringTrack}
            cx="50"
            cy="50"
            r="40"
            strokeWidth="3"
          />
          <circle
            className={`${styles.ringStroke} ${styles.ringFull}`}
            cx="50"
            cy="50"
            r="40"
            strokeWidth="3"
            strokeDasharray="251.33"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <text
            className={styles.ringNumber}
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
          >
            100%
          </text>
        </svg>
        <span className={styles.ringLabel}>Brief approved</span>
      </div>

      <div className={styles.ringItem}>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle
            className={styles.ringTrack}
            cx="50"
            cy="50"
            r="40"
            strokeWidth="3"
          />
          <circle
            className={`${styles.ringStroke} ${styles.ringPartial}`}
            cx="50"
            cy="50"
            r="40"
            strokeWidth="3"
            strokeDasharray="251.33"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <text
            className={styles.ringNumber}
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
          >
            72%
          </text>
        </svg>
        <span className={styles.ringLabel}>Edit progress</span>
      </div>
    </div>
  );
}

function ProgressMedia() {
  return (
    <div className={styles.progressFrame}>
      <div className={styles.progressPanel}>
        <div>
          <p className={styles.progressTitle}>Launch Film Cut 02</p>
          <p className={styles.progressSubtitle}>
            Here is where the review stands today
          </p>
        </div>
        <ProgressRings />
      </div>
    </div>
  );
}

function NotesMedia() {
  return (
    <div className={styles.notesMedia}>
      <svg
        className={styles.notesBackdrop}
        viewBox="0 0 640 360"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <filter
            id="rv-notes-orange"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter
            id="rv-notes-pink"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter
            id="rv-notes-violet"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="20" />
          </filter>
        </defs>

        <rect width="640" height="360" fill="#05060F" />

        <g filter="url(#rv-notes-orange)" opacity="0.9">
          <path
            d="M-60 330 L330 34"
            stroke="#FF7A18"
            strokeWidth="26"
            strokeLinecap="round"
          />
          <path
            d="M40 390 L440 18"
            stroke="#FF7A18"
            strokeWidth="9"
            opacity="0.7"
          />
        </g>

        <g filter="url(#rv-notes-pink)" opacity="0.85">
          <path
            d="M110 410 L540 26"
            stroke="#FF2E88"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M250 390 L630 70"
            stroke="#FF2E88"
            strokeWidth="8"
            opacity="0.8"
          />
        </g>

        <g filter="url(#rv-notes-violet)" opacity="0.9">
          <path
            d="M220 420 L700 86"
            stroke="#7B3FF2"
            strokeWidth="32"
            strokeLinecap="round"
          />
        </g>

        <path
          d="M150 360 L508 32"
          stroke="#FFB15C"
          strokeWidth="2.5"
          opacity="0.7"
        />
        <path
          d="M320 380 L648 112"
          stroke="#FF7AC0"
          strokeWidth="2"
          opacity="0.55"
        />

        <g transform="translate(356 242) skewX(-12)" opacity="0.95">
          {Array.from({ length: 3 }).map((_, row) => (
            <g key={row}>
              {Array.from({ length: 7 }).map((_, column) => (
                <rect
                  key={column}
                  x={column * 36}
                  y={row * 27}
                  width="30"
                  height="20"
                  rx="4"
                  fill="rgba(255, 255, 255, 0.035)"
                  stroke="rgba(255, 255, 255, 0.16)"
                  strokeWidth="1"
                />
              ))}
            </g>
          ))}
        </g>
      </svg>

      <div className={styles.notesContent}>
        <span className={styles.notesLabel}>New Upload</span>
        <p className={styles.notesTitle}>
          Launch Film /
          <br />
          Review Round
        </p>
      </div>

      <div className={styles.notesAvatar} aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" fill="#2A2041" />
          <path
            d="M14 100c3-20 17-29 36-29s33 9 36 29H14Z"
            fill="#172A46"
          />
          <circle cx="50" cy="47" r="26" fill="#F2C9A6" />
          <path
            d="M24 47c0-19 10-29 26-29s26 10 26 29c-4-12-13-17-26-17s-22 5-26 17Z"
            fill="#1D1729"
          />
          <circle cx="41" cy="49" r="1.8" fill="#1D1729" />
          <circle cx="59" cy="49" r="1.8" fill="#1D1729" />
          <path
            d="M43 58c2 2 5 3 7 3s5-1 7-3"
            fill="none"
            stroke="#9C5B44"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className={styles.notesTimeline} aria-hidden="true">
        <span className={`${styles.notePin} ${styles.pinOrange}`} />
        <span className={`${styles.notePin} ${styles.pinPink}`} />
        <span className={`${styles.notePin} ${styles.pinViolet}`} />
      </div>
    </div>
  );
}

function DeliveryMedia() {
  return (
    <div className={styles.deliveryFrame}>
      <div className={styles.deliveryPanel}>
        <div className={styles.deliveryHeader}>DELIVERY</div>

        <div className={styles.deliveryTop}>
          <div className={styles.turnaroundTile}>
            <span className={styles.turnaroundValue}>24-48h</span>
            <span className={styles.turnaroundLabel}>FIRST CUT</span>
          </div>

          <div className={styles.chartPanel}>
            <svg
              viewBox="0 0 240 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line
                x1="0"
                y1="24"
                x2="240"
                y2="24"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="0"
                y1="48"
                x2="240"
                y2="48"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="0"
                y1="72"
                x2="240"
                y2="72"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="60"
                y1="0"
                x2="60"
                y2="100"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="120"
                y1="0"
                x2="120"
                y2="100"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="180"
                y1="0"
                x2="180"
                y2="100"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />

              <text x="3" y="13" fill="rgba(255, 255, 255, 0.45)" fontSize="6">
                10K
              </text>
              <text x="3" y="39" fill="rgba(255, 255, 255, 0.45)" fontSize="6">
                5K
              </text>
              <text x="3" y="91" fill="rgba(255, 255, 255, 0.45)" fontSize="6">
                0
              </text>

              <polyline
                points="0,62 28,62 50,60 74,61 96,58 118,60 136,58 145,16 154,62 176,60 198,59 220,57 240,58"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.4"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>

        <div className={styles.statRow}>
          <div className={styles.statTile}>
            <span className={styles.statValue}>4.9/5</span>
            <span className={styles.statLabel}>AVERAGE REVIEW</span>
          </div>
          <div className={styles.statTile}>
            <span className={styles.statValue}>1,200+</span>
            <span className={styles.statLabel}>VIDEOS SHIPPED</span>
          </div>
          <div className={styles.statTile}>
            <span className={styles.statValue}>87%</span>
            <span className={styles.statLabel}>REORDER</span>
          </div>
          <div className={`${styles.statTile} ${styles.donutTile}`}>
            <svg
              className={styles.donut}
              viewBox="0 0 40 40"
              aria-hidden="true"
            >
              <circle
                cx="20"
                cy="20"
                r="14"
                fill="none"
                stroke="rgba(255, 255, 255, 0.16)"
                strokeWidth="3"
              />
              <circle
                cx="20"
                cy="20"
                r="14"
                fill="none"
                stroke="#18B4F2"
                strokeWidth="3"
                strokeDasharray="87.96"
                strokeDashoffset="11.43"
                strokeLinecap="round"
                transform="rotate(-90 20 20)"
              />
              <text
                x="20"
                y="20"
                fill="#FFFFFF"
                fontSize="8"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="central"
              >
                87%
              </text>
            </svg>
          </div>
          <div className={styles.statTile}>
            <span className={styles.statValue}>300+</span>
            <span className={styles.statLabel}>DELIVERIES</span>
          </div>
        </div>

        <div className={styles.barPanel}>
          <svg
            viewBox="0 0 300 60"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {barHeights.map((height, index) => (
              <rect
                key={index}
                x={index * 10 + 2}
                y={60 - height}
                width="6"
                height={height}
                rx="1.4"
                fill="#18B4F2"
                opacity={index % 3 === 0 ? 0.95 : 0.72}
              />
            ))}
            <polyline
              points={barChartPoints}
              fill="none"
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth="1"
              strokeDasharray="2 3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

const cards: ReviewDeliveryCard[] = [
  {
    title: 'Live progress you can see',
    description:
      'Follow every order from brief to final cut with clear percentages, so you always know what is done and what is next.',
    media: <ProgressMedia />,
  },
  {
    title: 'Timecoded notes that get answered',
    description:
      'Leave precise feedback on the exact frame. Your editor replies, revises, and keeps every round organized in one place.',
    media: <NotesMedia />,
  },
  {
    title: 'Delivery you can publish',
    description:
      'Download every format you need, share with your team, and see how fast each delivery landed.',
    media: <DeliveryMedia />,
  },
];

export function ReviewDeliverySection() {
  return (
    <section
      className={styles.section}
      aria-labelledby="review-delivery-heading"
    >
      <div className={styles.container}>
        <div className={styles.intro}>
          <h2 id="review-delivery-heading" className={styles.heading}>
            Keep every review calm and every deadline visible
          </h2>
          <p className={styles.introText}>
            Track drafts, leave timecoded notes, and approve with confidence, or
            hand off publishing to us.
          </p>
        </div>

        <div className={styles.grid}>
          {cards.map((card) => (
            <article key={card.title} className={styles.card}>
              <div className={styles.cardMedia} aria-hidden="true">
                {card.media}
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
