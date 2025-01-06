import React from 'react'
import { thumb } from '../../../assets/icons'

const NotificationContainer:React.FC = () => {
  return (
    <div className="flex gap-2 w-full items-start border-b-[1px] border-neutral-500 pb-3 ">
      <img src={thumb} alt="thumb" className="w-[25px] mt-1" />
      <div className="flex-1 flex flex-col gap-1">
        <div className="text-xl font-roboto font-bold text-neutral-50 flex items-center gap-3 w-full">
          Eneo
          <div className="flex justify-between items-center w-full ">
            <div className="text-[15px] font-normal">posted a communique</div>
            <div className="text-[15px] font-normal">13:34</div>
          </div>
        </div>
        <p className='text-[14px] text-neutral-100'>
          ‘The Tangue’, alongside a number of other historic artwork from the
          fatherland have not found home ye...
        </p>
        <p></p>
      </div>
    </div>
  );
}

export default NotificationContainer