import React from 'react';
import About from '../components/home/About';
import Works from '../components/home/Works';
import BetterFeedback from '../components/home/BetterFeedback';
import Archive from '../components/home/Archive';
import Testimonial from '../components/home/Testimonial';
import Support from '../components/home/Support';
import KeepEveryone from '../components/home/KeepEveryone';
import Visibility from '../components/home/Visibility';
import Footer from '../components/home/Footer';

export default function Home() {
  return (
    <div>

      <About />
      <Works />
      <BetterFeedback />
      <Archive />
      <Testimonial />
      <Support />
      <KeepEveryone />
      <Visibility />
      <Footer />


      {/* Footer or additional components can be added here */}

    </div>
  )
}
