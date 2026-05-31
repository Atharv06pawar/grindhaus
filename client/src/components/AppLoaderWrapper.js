import React, { useEffect, useState } from "react";
import GlobalLoader, { INITIAL_LOADER_DURATION_MS } from "./GlobalLoader";

export default function AppLoaderWrapper({ children }) {
  const [isBootLoading, setIsBootLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsBootLoading(false);
    }, INITIAL_LOADER_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  if (isBootLoading) return <GlobalLoader label="Loading REDAESTH" />;

  return children;
}
