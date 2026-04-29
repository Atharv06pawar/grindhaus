import React from "react";

import { LoaderLogo, LoaderOverlay, LoaderPulse } from "../styles/ui";

function BootLoader() {
  return (
    <LoaderOverlay role="status" aria-live="polite" aria-label="Loading GrindHaus">
      <LoaderPulse>
        <LoaderLogo src="/grindhaus-logo.png" alt="GrindHaus" />
      </LoaderPulse>
    </LoaderOverlay>
  );
}

export default BootLoader;
