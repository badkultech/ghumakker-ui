import React from "react";

/**
 * Content Component for How It Works Section
 * Displays step-by-step content with flexible positioning
 */
export default function Content({Heading, content, direction, optional = ''}: {Heading: string, content: string | React.JSX.Element , direction ?: "left" | "right", optional?: string}): React.JSX.Element {
  
  const isString = typeof content === "string";
  return (
    <div className={`flex flex-col justify-center max-md:pl-8 ${optional} ${direction === "left" ? "items-start pl-8" : "items-center"}`}>
      <div className={isString ? "sm:max-w-[350px]" : "w-full"}>
        <h3 className="text-[1.75rem] md:text-[2.5rem] font-[500] mb-4">{Heading}</h3>
        <p className="text-[1.25rem] md:text-[1.5rem] text-[#575757]">{content}</p>
      </div>
      </div>
  );
}
