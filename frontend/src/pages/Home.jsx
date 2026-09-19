import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import WhyCareerly from '../components/WhyCareerly.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import FeaturedJobs from '../components/FeaturedJobs.jsx'
import CareerlyStats from '../components/CareerlyStats.jsx'
import Footer from '../components/Footer.jsx'

function Home(){
  return(
    <>
    <Navbar/>
    <Hero/>
    <WhyCareerly/>
    <HowItWorks/>
    <FeaturedJobs/>
    <CareerlyStats/>
    <Footer/>
    </>
  )
}
export default Home;