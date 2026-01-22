export default function AutoScrollCarousel() {
  const images = [
    "/prelaunch-page-imgs/carousel-img1.png",
    "/prelaunch-page-imgs/carousel-img2.png",
    "/prelaunch-page-imgs/carousel-img3.png",
    "/prelaunch-page-imgs/carousel-img4.png",
    "/prelaunch-page-imgs/carousel-img5.png",
    "/prelaunch-page-imgs/carousel-img6.png",
    "/prelaunch-page-imgs/carousel-img7.png",
  ];

  return (
    <div className="overflow-hidden w-full py-6 group">
      {/* Track */}
      <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
        {[...images, ...images, ...images].map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-1/3 md:w-1/5 p-2 transition-transform duration-700 ease-in-out"
          >
            <img
              src={src}
              alt=""
              className="w-[90%] mx-auto rounded-xl transition-transform duration-700 ease-in-out hover:scale-125 hover:z-10 hover:shadow-2xl"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 15s linear infinite;
        }

        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
