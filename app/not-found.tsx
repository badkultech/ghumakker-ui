"use client";

import { AppHeader } from "@/components/app-header";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const HEADER_PX = 72; // adjust if your header is different

  return (
    <div className="relative min-h-screen bg-white">
      {/* fixed header */}
      <div className="fixed top-0 left-0 w-full z-40">
        <AppHeader showAvatar={false} showLogo={true} />
      </div>

      {/* main area exactly remaining viewport height */}
      <main
        className="w-full flex items-center justify-center"
        style={{ height: `calc(100vh - ${HEADER_PX}px)` }}
      >
        <div className="w-full max-w-4xl px-6">
          <div className="mx-auto w-full flex flex-col items-center">
            {/* ===== wrapper controls visible area =====
                - height uses vh so it's responsive
                - increase maxHeight/minHeight to show more image
            */}
            <div
              className="relative w-full sm:w-[720px] md:w-[880px] mx-auto rounded-md overflow-hidden"
              style={{
                height: "52vh", // <-- increase this to show more of the image
                maxHeight: "560px",
                minHeight: "320px",
              }}
              aria-hidden
            >
              {/* ===== Default: show most of image without heavy crop =====
                  - object-contain keeps whole image visible (no cropping), keeps watermark visible though
                  - use 'fill' so image scales to wrapper nicely
              */}
              <Image
                src="/images/404.jpg"
                alt="404 illustration"
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 880px"
                className="object-contain object-center"
                priority
              />

              {/*
                ============ Optional variants (toggle by replacing the Image above) ============

                1) Less crop but still cover (keeps image filling area, reduces cut):
                   className="object-cover object-center -translate-y-2"
                   and keep height: "52vh" or increase to "56vh" or "60vh"

                2) Hide watermark (original approach): crop bottom by using object-top + smaller height:
                   style: { height: "40vh", maxHeight: "420px", minHeight: "240px" }
                   className="object-cover object-top"
                   (this will hide more bottom area)

                3) If you want to show entire image and still hide watermark by CSS overlay:
                   - Use object-contain to show full image, then overlay a small white gradient at bottom to visually hide watermark.
                   Example: add a <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white/95 to-transparent" />

              */}
            </div>

            {/* ===== Optional gradient overlay to mask watermark while keeping full image visible =====
                Uncomment the next block if you use object-contain and want to visually hide the watermark
            */}
            {/* 
            <div className="relative w-full sm:w-[720px] md:w-[880px] mx-auto -mt-16 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-full h-14 bg-gradient-to-t from-white to-transparent" />
            </div>
            */}

            {/* Text */}
            <h1 className="mt-8 text-center text-lg sm:text-2xl font-medium text-gray-800 max-w-xl leading-snug">
              The page you were
              <br />
              looking for does not exist
            </h1>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 rounded-md bg-[#ff8a5b] hover:bg-[#ff6b34] text-white px-5 py-2.5 text-sm font-medium shadow-sm transition"
              >
                ⤺ Go Home
              </button>

              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white text-gray-700 px-4 py-2 text-sm transition hover:bg-gray-100"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
