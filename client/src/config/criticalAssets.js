import homeHero from "../assets/home/hero.png";
import workoutMen from "../assets/workouts/men.png";
import workoutWomen from "../assets/workouts/women.png";
import workoutPush from "../assets/workouts/push.png";
import workoutPull from "../assets/workouts/pull.png";
import workoutLegs from "../assets/workouts/legs.png";
import techniqueHero from "../assets/technique/techero.png";
import nutritionHero from "../assets/nutrition/nhero.png";

export const criticalAssetsByRoute = {
  "/": [homeHero],
  "/workout": [workoutMen, workoutWomen, workoutPush, workoutPull, workoutLegs],
  "/technique": [techniqueHero],
  "/nutrition": [nutritionHero],
  // other routes might not have critical assets, returning empty array is fine
};

export const getCriticalAssetsForRoute = (pathname) => {
  return criticalAssetsByRoute[pathname] || [];
};
