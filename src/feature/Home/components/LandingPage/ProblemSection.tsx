import { SECTION_CONTENT_CLASS, SECTION_PADDING_Y } from "./sectionLayout";

const ProblemSection = () => {
  return (
    <section className={`${SECTION_PADDING_Y} bg-[#373737] relative overflow-hidden min-h-[180px] flex items-center`}>
      <div className={`${SECTION_CONTENT_CLASS} w-full`}>
        <div className="flex flex-col gap-2 md:gap-3 items-center justify-center text-center py-8 md:py-12">
          <p className="font-medium leading-tight text-lg sm:text-2xl md:text-3xl lg:text-4xl min-[900px]:text-[45px] tracking-[0px]">
            <span className="text-primary-400">The Problem:</span>{" "}
            <span className="text-[#e5e5e5]">Your stories are scattered.</span>
          </p>
          <p className="text-[#b3b3b3] text-base sm:text-lg md:text-xl lg:text-2xl">Your voice is consumed, not published.</p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;

