import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const RouteLoader = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Simulate page asset load timing
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // adjust (500–900 feels premium)

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "white",
        fontSize: "24px",
        fontFamily: "Bangers, cursive"
      }}>
        Loading...
      </div>
    );
  }

  return children;
};

export default RouteLoader;
