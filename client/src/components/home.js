import React from 'react';
import Hero from './hero.js';
import Features from './features.js';
import QuoteRibbon from './quoteribbon.js'
import LastSection from './lastsection.js';

const Home = () => {
  return (
    <div>
      <Hero />
      <Features/>
      <QuoteRibbon/>
      <LastSection/>
    </div>
  );
};

export default Home;
