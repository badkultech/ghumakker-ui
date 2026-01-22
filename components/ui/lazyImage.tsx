import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const LazyImage = ({
  src,
  alt = "",
  className = "",
  width = 400,
  height = 400,
  fill,
  ...rest
}: {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    let cancel = false;
    setLoaded(false);

    const imgEl = imgRef.current;

    const finish = () => {
      if (cancel) return;

      // delay loader fade for smooth effect
      setTimeout(() => {
        if (!cancel) setLoaded(true);
      }, 200);
    };

    if (imgEl && imgEl.complete) {
      finish();
      return () => {
        cancel = true;
      };
    }

    const onLoad = () => finish();
    imgEl?.addEventListener("load", onLoad);

    return () => {
      cancel = true;
      imgEl?.removeEventListener("load", onLoad);
    };
  }, [src]);

  // Determine Image props based on fill mode
  const imageProps = fill
    ? { fill: true }
    : { width, height };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Mini loader */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-0 bg-gray-100">
          <div
            className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: "#FFB27D", // peach
              borderTopColor: "#FF7A00", // orange
            }}
          />
        </div>
      )}

      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        unoptimized
        loading="lazy"
        className={`object-cover transition-opacity duration-500 z-10 ${fill ? "absolute inset-0 w-full h-full" : ""
          } ${loaded ? "opacity-100" : "opacity-0"}`}
        {...imageProps}
        {...rest}
      />
    </div>
  );
};
