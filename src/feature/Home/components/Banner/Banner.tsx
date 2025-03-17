import LeftContent from "./LeftContent";

const Banner = () => {
  return (
    <div className="banner bg-neutral-700 py-20 px-5 rounded-3xl mx-4 md:mx-20 my-5"> 
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-10"> 
          {/* Left Content */}
          <div className="flex-1">
            <LeftContent />
          </div>

          {/* Hero Image */}
          <div className="flex-1 max-w-[450px]"> 
            <img
              src="/src/assets/images/HEROIMAGE.png"
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