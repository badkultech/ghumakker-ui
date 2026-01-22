import React from "react";
import styles from "../prelaunch.module.css"

/**
 * Reusable Section Component
 * Provides consistent section layout with heading and content
 */
const Section = ({
  child,
  heading,
}: {
  child: React.JSX.Element;
  heading: string | React.JSX.Element;
}) => {
  return (
    <section
      className={`${styles.poppins} my-[2.5rem] md:my-[5rem] w-full`}
    >
      <h2
        className={`${styles.barlow} text-[1.75rem] md:text-[2.6rem] text-center font-[800] pb-[2rem] md:pb-[3.5rem] text-black`}
      >
        {heading}
      </h2>
      {child}
    </section>
  );
};

export default Section;
