import React from 'react'
import { Pics } from '../../../assets/images';


interface PostDetailProps { 
  content?: string;
  title: string;
}


const PostDetail:React.FC<PostDetailProps> = ({content, title}) => {
  return (
    <div className="w-[620px] px-5 flex flex-col gap-4">
      <h1 className="font-roboto font-bold text-xl px-1">
        {title}
      </h1>
      {/* <div className="text-[16px] font-semibold">
        The Tangue, alongside a number of other historic artwork from the
        fatherland have not found home yet.
      </div> */}
      <div className="font-instrumentSerif text-[15px] leading-[28px] text-neutral-50 text-justify px-1">
        {content}
      </div>
      <div className="">
        <img className="thumbnail__image" src={Pics.blogPic} alt="" />
      </div>
    </div>
  );
}

export default PostDetail