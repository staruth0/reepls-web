import React from 'react'
import { LuBadgeCheck } from 'react-icons/lu';

const AuthorSugestionComponent:React.FC = () => {
  return (
      <div>
         
      <header className="flex gap-2">
        <span className="flex justify-center items-center bg-purple-200 text-purple-800 text-base font-medium rounded-full w-11 h-11 text-center">
          {"E"}
        </span>

        <div className="flex flex-col justify-center items-start gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold m-0 line-clamp-1 text-[15px]">
              {"ENEO"}
            </h2>
            <LuBadgeCheck
              className="text-primary-500 size-5"
              strokeWidth={2.5}
            />

            <div className="text-primary-500 text-[14px] ml-4">Follow</div>
          </div>

          <p
            className={`text-neutral-50 text-xs whitespace-nowrap overflow-hidden text-ellipsis line-clamp-1`}
          >
            {"Writer @ CMR FA magazine company..."}
          </p>
        </div>
      </header>
    </div>
  );
}

export default AuthorSugestionComponent