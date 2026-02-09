import React, { useEffect, useState } from "react";
import LoadingScreen from "./GlobalLoader";

export default function AppLoaderWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1400); // sweet spot for premium feel

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return children;
}
