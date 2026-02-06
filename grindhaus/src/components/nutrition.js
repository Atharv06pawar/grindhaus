// nutrition.js
import React from "react";
import NutriHero from "./nutrihero.js";
import Macronutrients from "./macronutrients.js";
import DietPlans from "./dietplan.js";
import CustomDiet from "./aicustomdiet.js";

const Nutrition = () => {
  return (
    <>
      <NutriHero />
      <Macronutrients />
      {/* Diet Plans + AI Section will follow */}
      <DietPlans/>
      <CustomDiet/>
    </>
  );
};

export default Nutrition;
