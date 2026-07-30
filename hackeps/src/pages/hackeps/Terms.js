import React from "react";
import LaunchHeader from "src/components/hackeps/LaunchHeader/LaunchHeader";
import LaunchFooter from "src/components/hackeps/LaunchFooter/LaunchFooter";
import TermsComponent from "src/components/hackeps/Terms/Terms";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col font-space-mono">
      <LaunchHeader />
      <TermsComponent />
      <LaunchFooter />
    </div>
  );
};

export default Terms;
