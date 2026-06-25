import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

import HeroSlider from './Hero'
import PropertyListings from './Property'
import PropertyCategories from './PropertyCategories'
import ChooseUs from './ChooseUs'
import TestimonialSection from './Testimonial'
import Welcome from './Welcome'
import ProjectsSection from './Projects'
import BlogsSpotlight from './Blogs'
import ProjectLogoCarousel from './ProjectLogoCarousel'
import Counter from './Counter'

function Home() {

  useEffect(() => {
    AOS.init({
      duration: 2000,     // Animation speed
      offset: 100,       // How early the animation triggers
      easing: 'ease-in-out',
      once: true         // Animation runs only once
    });
  }, []);

  return (
    <>

      <HeroSlider />
      <ProjectLogoCarousel />
      <Welcome />
      <ProjectsSection />
      <ChooseUs />
      <Counter/>
      {/* <PropertyListings /> */}
      {/* <BlogsSpotlight />  */}
      <TestimonialSection />

    </>
  )
}

export default Home
