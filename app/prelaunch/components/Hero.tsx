import Image from "next/image";
import Link from "next/link";
import styles from "../prelaunch.module.css";

export default function Hero(): React.JSX.Element {
  return (
    <>
      {/* Main Hero Section */}
      <section className="hero_section w-full flex flex-col md:flex-row justify-between items-center relative overflow-hidden pb-[2rem] md:pb-[4rem]">
        {/* LEFT CONTENT */}
        <div
          className={`${styles.barlow} content mt-1 md:mt-[3rem] max-md:text-center md:w-[55%]`}
        >
          <h1 className="text-[1.75rem] md:text-[2.5rem] font-[500] leading-tight">
            Are you a{" "}
            <span className="font-[600] italic text-[2.25rem] md:text-[3.5rem] text-[#111]">
              Trip Organizer
            </span>
          </h1>
          <h1 className="text-[1.75rem] md:text-[2.5rem] font-[500] leading-tight">
            or a{" "}
            <span className="font-[600] italic text-[2.25rem] md:text-[2.5rem] text-[#111]">
              Trip Leader
            </span>
          </h1>
          <h1 className="text-[1.85rem] md:text-[2rem] font-[500] leading-tight mb-2 mt-4">
            that organizes fixed departure group trips?
          </h1>

          <div
            className={`${styles.poppins} text-[#575757] max-lg:mt-[5rem] lg:w-full z-1`}
          >
            <h2 className="text-[1.5rem] md:text-[1.85rem] font-[500] pb-2">
              We’ve got an offer you’ll love 🧡
            </h2>
            <p className="text-[1rem] md:text-[1.3rem] font-[400]">
              At ghumakker, we are launching a platform that{" "}
              <span className="font-[600] italic sub-txt tracking-[0.15%]">
                (exclusively)
              </span>{" "}
              lists fixed departure group trips.
            </p>
            <p className="text-[1rem] md:text-[1.3rem] font-[400] pt-3 pb-3">
              Whether you run treks, expeditions, weekend getaways, creative
              workshops, wellness retreats, cultural tours, or adventure camps,{" "}
              <span className="font-[600] italic sub-txt tracking-[0.15%]">
                ghumakker can be your digital partner to build community and
                maximize growth.
              </span>
              <br />
            </p>
            <h2 className="text-[1.75rem] md:text-[1.85rem] font-[500]">
              Become one of our first partners and get lifetime perks of being
              our Day 1s
            </h2>
            <div className="max-lg:justify-center flex">
              <Link href="/organizer/join-as-partner" className="max-md:w-full">
                <button
                  className={`${styles.btn} text-[1rem] md:text-[1.5rem] rounded-full font-[500] max-md:flex-1 w-full px-6 py-3 mt-4 poppins`}
                ></button>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center items-center md:w-[45%] mt-8 md:mt-0">
          <div className="w-[85%] md:w-full max-w-[600px] rounded-2xl overflow-hidden ">
            <Image
              src="/prelaunch-page-imgs/hero-1.jpg"
              alt="Hero Image showing a traveler looking for destinations"
              width={1200}
              height={800}
              className="w-full h-auto object-cover rounded-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="intro_section w-full grid grid-cols-1 md:grid-cols-2 gap-[2rem] md:gap-[5rem] mt-[3rem] md:mt-[5rem]">
        <div className="img order-2 md:order-1 flex justify-center">
          <Image
            src="/prelaunch-page-imgs/intro-hero.webp"
            alt="Image showing travellers having fun"
            width={2412}
            height={1996}
            className="w-[90%] sm:w-[80%] md:w-full h-auto"
          />
        </div>

        <div className="content max-md:text-center order-1 md:order-2">
          <h1
            className={`${styles.barlow} text-[2.25rem] md:text-[3rem] font-[700] pb-5`}
          >
            What is <span className={`${styles.grad_txt} pr-[7px]`}> ghumakker?</span>
          </h1>
          <h2 className="text-[1.25rem] md:text-[1.5rem] text-[#333333] font-[600] italic pt-5">
            ghumakker is India’s first search and discovery platform that
            exclusively lists fixed departure group trips.
          </h2>
          <p className="text-[1rem] md:text-[1.25rem] font-[400] text-[#575757] pt-4">
            ghumakker is designed to showcase your group trips, help you reach the
            right audience, and provide actionable insights to grow your
            business.
          </p>
        </div>
      </section>
    </>
  );
}
