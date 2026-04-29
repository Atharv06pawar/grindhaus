// Workout.js
import React from 'react';
import WorkHero from './workhero.js';
import PreWork from './premadeworkouts.js'
import AIPlanning from './aiplanning.js';

const Workout = () => {
  return (
    <div>
      {/* Hero section */}
      <WorkHero />
      <PreWork />
      <AIPlanning/>
    </div>
  );
};

export default Workout;
