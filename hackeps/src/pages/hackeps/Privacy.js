import React from "react";
import LaunchHeader from "src/components/hackeps/LaunchHeader/LaunchHeader";
import LaunchFooter from "src/components/hackeps/LaunchFooter/LaunchFooter";
import PrivacyComponent from "src/components/hackeps/Privacy/Privacy";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col font-space-mono">
      <LaunchHeader />
      <PrivacyComponent />
      <LaunchFooter />
    </div>
  );
};

export default Privacy;
