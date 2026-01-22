import Image from "next/image";
import React from "react";
import styles from "../prelaunch.module.css"
/**
 * Feature Card Component
 * Displays service offerings with icon, heading, and bullet points
 * Used in the main offerings section
 */
const Card = ({img, heading, listItems}:{img: string, heading: string, listItems: string[]}) => {
  return (
    <div className={`${styles.box_shadow} card p-4 md:p-6 rounded-2xl`}>
      <div className=" flex justify-start items-start">
        <Image src={img} alt="card title Image showing a unique icon related to title" width={1000} height={1000}    className=" align-start w-[3.5rem] h-[3.5rem] object-contain" />
      </div>
        <div className="content mt-6 leading-normal">
            <h3 className="text-[1.5rem] md:text-[2rem] poppins font-[500] sub-txt leading-normal pb-4">{heading}</h3>
            <ul className="text-[1rem] md:text-[1.25rem] font-[400] text-[#575757] list-disc pl-6 space-y-4">
                {listItems.map((item, index) => (
                    <li key={index} className="tracking-[0.15%] leading-[1.8]">{item} </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default Card;
