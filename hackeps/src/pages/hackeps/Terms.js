import React from "react";
// Needed here too: while the launch is pending this page is the only bootstrap
// consumer, and index.js no longer ships bootstrap in the initial bundle.
import "bootstrap/dist/css/bootstrap.css";
import Header from "src/components/hackeps/Header/Header";
import Footer from "src/components/hackeps/Footer/Footer";
import TermsComponent from "src/components/hackeps/Terms/Terms";

const Terms = () => {
  return (
    <div>
      <Header />
      <TermsComponent />
      <Footer />
    </div>
  );
};

export default Terms;
