import React, { useRef, useEffect, useState } from "react";

// SlidingRows.tsx — React + Tailwind + TypeScript
// - Tailwind-friendly single-file component
// - Measures track width and computes animation duration so loop speed is consistent
// - Duplicates the items block for a seamless loop
// - Two rows, opposite directions, pause-on-hover

export type SlidingRowsProps = {
  height?: number; // px
  gap?: number; // px gap between items
  speed?: number; // pixels per second (affects animation duration)
  row1Items?: Array<string | React.ReactNode>;
  row2Items?: Array<string | React.ReactNode>;
};

export default function SlidingRows({
  height = 500,
  gap = 20,
  speed = 120,
  row1Items,
  row2Items,
}: SlidingRowsProps): React.JSX.Element {
  // default content if none provided
  const defaultRow1: Array<string> = [
    "Card A",
    "Card B",
    "Card C",
    "Card D",
    "Card E",
  ];
  const defaultRow2: Array<string> = [
    "Product 1",
    "Product 2",
    "Product 3",
    "Product 4",
  ];
  const r1 = row1Items ?? defaultRow1;
  const r2 = row2Items ?? defaultRow2;

  // refs to measure width
  const trackRef1 = useRef<HTMLDivElement | null>(null);
  const trackRef2 = useRef<HTMLDivElement | null>(null);
  const [dur1, setDur1] = useState<number>(16); // seconds
  const [dur2, setDur2] = useState<number>(26);

  useEffect(() => {
    // compute duration dynamically: duration = (width_of_one_block) / speed
    // each track contains two identical blocks; measure the first block's width
    function compute() {
      if (trackRef1.current) {
        const firstBlock =
          trackRef1.current.querySelector<HTMLDivElement>(".items-block");
        if (firstBlock) {
          const w = firstBlock.getBoundingClientRect().width;
          // ensure a minimum duration so it's not too fast on narrow screens
          setDur1(Math.max(8, Math.round(w / speed)));
        }
      }
      if (trackRef2.current) {
        const firstBlock =
          trackRef2.current.querySelector<HTMLDivElement>(".items-block");
        if (firstBlock) {
          const w = firstBlock.getBoundingClientRect().width;
          setDur2(Math.max(10, Math.round(w / (speed * 0.7)))); // make row2 a bit slower by default
        }
      }
    }

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [r1, r2, speed]);

  // helper to render a block of items (used twice for duplication)
  const ItemsBlock: React.FC<{ items: Array<string | React.ReactNode> }> = ({
    items,
  }) => (
    <div
      className="items-block flex gap-[var(--gap)] items-center"
      aria-hidden="false"
    >
      {items.map((t, i) => (
        <div
          key={i}
          className="item flex-none w-[220px] h-[140px] rounded-lg p-3 shadow-md flex items-center justify-center font-semibold text-[#0b3550] bg-gradient-to-br from-white to-[#f2f8ff]"
          style={{ transformOrigin: "center" }}
        >
          {typeof t === "string" ? <span>{t}</span> : t}
        </div>
      ))}
    </div>
  );

  return (
    <section className="w-[100vw]" aria-label="Sliding rows" style={{ height }}>
      {/* Inline CSS for keyframes + small utilities. Tailwind alone doesn't let us define runtime keyframes here. */}
      <style>{`
        :root{ --gap: ${gap}px; }

        .fixed-section{ height: ${height}px; overflow: hidden; display:flex; flex-direction:column; gap: ${gap}px; padding: 18px; background: linear-gradient(180deg,#f7fbff,#eef6ff); }
        .row{ position:relative; height: calc((${height}px - ${gap}px) / 2); border-radius: 10px; overflow:hidden; background: rgba(255,255,255,0.6); display:flex; align-items:center; padding: 12px 0; }
        .row-label{ position:absolute; left:12px; top:12px; font-size:13px; color:#16495f; background: rgba(255,255,255,0.5); padding:4px 8px; border-radius:8px; backdrop-filter: blur(2px); }

        .track{ display:flex; align-items:center; gap: var(--gap); will-change: transform; animation-timing-function: linear; animation-iteration-count: infinite; }
        .row:hover .track{ animation-play-state: paused; }

        .item{ animation: float 3s ease-in-out infinite; }
        .item:nth-child(3n){ animation-delay: -0.5s; }
        .item:nth-child(4n){ animation-delay: -1s; }
        @keyframes float{ 0%{ transform: translateY(0);} 50%{ transform: translateY(-8px);} 100%{ transform: translateY(0);} }

        @keyframes slide-left{ 0%{ transform: translateX(0);} 100%{ transform: translateX(-50%);} }
        @keyframes slide-right{ 0%{ transform: translateX(-50%);} 100%{ transform: translateX(0);} }

        /* ensure duplicated blocks sit inline */
        .items-block{ display:flex; gap: var(--gap); align-items:center; }
      `}</style>

      <div className="fixed-section w-screen relative left-0 right-1/2  -mx-[50vw]">
        {/* ROW 1 (leftwards) */}
        <div className="row">
          <div className="row-label">Trending</div>

          <div
            className="track"
            ref={trackRef1}
            style={{
              animationName: "slide-left",
              animationDuration: `${dur1}s`,
            }}
          >
            <ItemsBlock items={r1} />
            <ItemsBlock items={r1} />
          </div>
        </div>

        {/* ROW 2 (rightwards) */}
        <div className="row">
          <div className="row-label">Featured</div>

          <div
            className="track"
            ref={trackRef2}
            style={{
              animationName: "slide-left",
              animationDuration: `${dur1}s`,
            }}
          >
            <ItemsBlock items={r2} />
            <ItemsBlock items={r2} />
          </div>
        </div>
      </div>
    </section>
  );
}
