import React from 'react'
import { Link } from 'react-router-dom';
interface TrendingLinkProps { 
    title: string;  
}


const TrendingLink:React.FC<TrendingLinkProps> = ({ title }) => {

 
  
    return (
      <div >
        <Link
          to={`/search/results?query=${title}`}
          className=" py-3 text-neutral-50 text-[14px]  font-semibold hover:underline hover:text-primary-400"
        >
          #{title}
        </Link>
      </div>
    );
}

export default TrendingLink