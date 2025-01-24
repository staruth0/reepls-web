import React from "react";
import { ArrowRight } from "lucide-react";

const SeeMore: React.FC = () => {
  return (
    <div className="flex justify-center items-center text-[14px] py-2 text-neutral-50 gap-1 cursor-pointer">
      <span>See more</span>
      <ArrowRight size={18} />
    </div>
  );
};

export default SeeMore;
