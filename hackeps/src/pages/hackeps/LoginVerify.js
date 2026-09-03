import React from "react";
import DarkPage from "src/components/hackeps/Layout/DarkPage.js";
import LoginUnverified from "src/components/hackeps/LoginUnverified/LoginUnverified";
import { useLocation } from "react-router-dom";

const LoginVerify = (props) => {
  let email = "";
  const { state } = useLocation();
  if (state) email = state.email;

  return (
    <DarkPage>
      <LoginUnverified email={email} />
    </DarkPage>
  );
};

export default LoginVerify;
