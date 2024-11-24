import React from 'react';
import '../molecules/left_nav/leftNav.scss'

interface NavlinkTypes  {
    icontype: string,
    text: string
}

const LeftNavLinks = (props: NavlinkTypes) => {
  return (
    <a className='Left-nav-links' href='/'>
      <div className="icon">
        <img src={props.icontype} alt="Brain Icon" />
      </div>
      <span>{props.text}</span>
    </a>
  )
}

export default LeftNavLinks
