import LeftContent from "./LeftContent";

const Banner = () => {
  return (
    <div className="banner bg-neutral-700 py-20 px-16 rounded-3xl mx-5 md:mx-20 my-5 md:my-10">
      <div className="">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-10">
          <div className="flex-1">
            <LeftContent />
          </div>

          <div className="flex-1 max-w-[450px]">
            <img
              src="/src/assets/images/HEROIMAGE2.png"
              alt="Hero Image"
              className="rounded-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
