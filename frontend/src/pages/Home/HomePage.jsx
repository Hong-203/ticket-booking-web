import React from 'react'
import HeroSection from '../../components/Home/HeroSection'
import HomeCollection from '../../components/Home/HomeCollection'
import MovieSlider from '../../components/MovieSlider/MovieSlider'
import AdBanner from '../../components/Banner/AdBanner'

const HomePage = () => {
  return (
    <div>
      <AdBanner />
      <HomeCollection />
      <MovieSlider />
      <HeroSection />
    </div>
  )
}

export default HomePage
