import React from "react";

const Section = ({
  heading,
  child,
}: {
  heading?: string;
  child: React.JSX.Element;
}) => {
  return (
    <>
      <section className="md:py-20">
        {heading ? (
          <h1 className="font-barlow text-5xl text-center font-medium italic mb-20">
            {heading}
          </h1>
        ) : null}
        <div>{child}</div>
      </section>
    </>
  );
};
export default Section;
