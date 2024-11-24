import LeftNavLinks from '../../atoms/LeftNavLinks';
import './leftNav.scss';
import HomeIcon from '../../../assets/icons/home.svg'

const LeftNav = () => {
  return (
    <div>
      <LeftNavLinks 
      icontype={HomeIcon}
      text={'Home'}/>
    </div>
  )
}

export default LeftNav
