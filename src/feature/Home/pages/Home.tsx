import '../styles/home.scss';
import Header from '../components/header/Header';
import Banner from '../components/Banner/Banner';
import Sections from '../components/Sections/Sections';
import FooterTop from '../components/Footer/FooterTop'
import FooterBottom from '../components/Footer/FooterBottom';


function Home() {
  
  return (
    <div className="home__container  mx-auto">
     <Header />
     <Banner />
     <Sections />
     <FooterTop />
     <FooterBottom />
    </div>
  );
}

export default Home;
