import React from "react";
import DarkPage from "src/components/hackeps/Layout/DarkPage.js";
import LoginPage from "src/components/hackeps/Login/Login";
import { useLocation } from "react-router-dom";

const Login = (props) => {
  let nextScreen = "/home";
  const { state } = useLocation();
  if (state) {
    nextScreen = state.nextScreen;
  }
  return (
    <DarkPage>
      <LoginPage nextScreen={nextScreen} />
    </DarkPage>
  );
};

export default Login;
