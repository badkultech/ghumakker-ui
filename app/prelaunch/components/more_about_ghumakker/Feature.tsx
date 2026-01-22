import Image from "next/image";
import React from "react";
import styles from "../../prelaunch.module.css";

export default function Feature({ img, title, description }: { img: string, title: string, description: string }): React.JSX.Element {
  return (
    <div className="rounded-2xl border-1 border-[#e4e4e4] p-4 md:p-6 md:pb-[2rem] text-[#575757]">
      <Image src={img} alt="Feature Image showing a unique icon related to feature" width={300} height={300} className="w-[60px] h-auto rounded-lg" />
      <h3 className={`text-[1.35rem] ${styles.barlow} font-[600] mt-8  `}>{title}</h3>
      <p className={`${styles.barlow}  text-[1.15rem] font-[500] mt-4`}>{description}</p>
    </div>
  )
}

    