import React from 'react'
import { Link } from 'react-router-dom';
interface TrendingLinkProps { 
    title: string;  
}

const TrendingLink:React.FC<TrendingLinkProps> = ({ title }) => {
    return (
      <div >
        <Link
          to="#"
          className=" py-3 text-neutral-50  font-semibold hover:underline "
        >
          #{title}
        </Link>
      </div>
    );
}

export default TrendingLink