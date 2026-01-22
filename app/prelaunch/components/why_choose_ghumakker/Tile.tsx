import Image from "next/image";
import React from "react";
import styles from "../../prelaunch.module.css"


export default function Tile({ img, title }: { img: string, title: string}): React.JSX.Element {
  return (
    <div className={`${styles.box_shadow} flex items-center gap-x-4 md:gap-x-6 rounded-[100px] p-4  md:p-6 mb-6`}>
      <Image src={img} alt="Feature Image showing a unique icon related to feature" width={200} height={200} className="w-[60px] h-auto" />
      <h3 className="text-[1rem] md:text-[1.25rem] text-[#575757] font-[400] ">{title}</h3>
    </div>
  )
}
