import React from 'react'
import { Pics } from '../../../assets/images';

const PostDetail:React.FC = () => {
  return (
    <div className="w-[580px] px-5 flex flex-col gap-4">
      <h1 className="font-roboto font-bold text-xl">
        The long, old case of looted art during German colonial rule
        resuscitates
      </h1>
      <div className="text-[18px] font-semibold">
        The Tangue, alongside a number of other historic artwork from the
        fatherland have not found home yet.
      </div>
      <div className="font-instrumentSerif text-[22px] leading-[28px] text-neutral-50">
        The Tangue people of Cameroon possess a rich cultural heritage,
        particularly renowned for their exquisite wooden sculptures. These
        sculptures, often depicting ancestral figures, spirits, and animals, are
        not only aesthetically pleasing but also hold deep spiritual
        significance within the Tangue culture.
        <br /> The repatriation of these looted Tangue sculptures is a pressing
        issue. Returning these artifacts to their rightful owners would allow
        the Tangue people to reconnect with their cultural heritage and to
        preserve their traditions for future generations. It would also
        contribute to a more just and
      </div>
      <div className="">
        <img className="thumbnail__image" src={Pics.blogPic} alt="" />
      </div>
    </div>
  );
}

export default PostDetail