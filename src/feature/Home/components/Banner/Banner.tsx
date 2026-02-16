import { Pics } from "../../../../assets/images";
import LeftContent from "./LeftContent";

const Banner = () => {
  return (
    <div className="banner bg-neutral-700 px-5 py-5 md:p-[64px] rounded-3xl mx-5  my-5 md:my-10">
      
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10">
          <div className="flex-1">
            <LeftContent />
          </div>

          <div className="flex-1 max-w-[450px]">
            <img
              src={Pics.heroImage}
              alt="Hero Image"
              className="rounded-lg w-full h-auto"
            />
          </div>
        </div>
  
    </div>
  );
};

export default Banner;
