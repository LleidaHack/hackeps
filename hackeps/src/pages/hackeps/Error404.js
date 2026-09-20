import React from "react";
import DarkPage from "src/components/hackeps/Layout/DarkPage.js";
import Error404Container from "src/components/hackeps/Error404/Error404Container";

const Error404 = () => {
  return (
    <DarkPage minHeight={780}>
      <Error404Container />
    </DarkPage>
  );
};

export default Error404;
