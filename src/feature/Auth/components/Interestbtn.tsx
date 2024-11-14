import React, { useState } from "react";
import '../styles/interest.scss';
import { useTranslation } from "react-i18next";

type interestProp = {
  interest: string
  handleInterest:(value:string)=>void
};

const Interestbtn: React.FC<interestProp> = ({ interest,handleInterest }) => {
  const [isSelected, setIsSelected] = useState<boolean>(false)
  const {t} = useTranslation()
  
  const handleClick = (value:string) => {
    setIsSelected(!isSelected)
    handleInterest(value);
  }
  
  return (
    <button className={`interest__btn ${isSelected ? 'selected': null}`} onClick={()=>{handleClick(interest)}}>
      {t(interest)}
    </button>
  )
}

export default Interestbtn
