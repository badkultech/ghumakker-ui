import React from 'react'
import Image from 'next/image'

const WhyghumakkerCard = ({ icon, heading, description }: { icon: string, heading: string, description: string }) => {
  return (
    <div className="flex-1 rounded-xl flex flex-col max-md:mx-[2.5rem] text-center max-md:mb-[2.5rem] gap-4 md:gap-5 justify-center p-2 md:p-4">
      <div className='mx-auto'>
        <Image src={icon} alt='image for card' width={50} height={50} className='w-[50px] h-[50px]' />
      </div>

      <h3 className="font-[500]  text-[1.5rem]">
        {heading}
      </h3>
      <p className="font-[300] text-[#575757] text-[1rem] md:text-[1.25rem]">
        {description}
      </p>
    </div>
  )
}

export default WhyghumakkerCard