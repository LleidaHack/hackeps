import React from "react";
import LinkAccounts from "src/components/hackeps/UserEnters/UserEnter";
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
      {state?.showLogin ? <LoginPage nextScreen={nextScreen} /> : <LinkAccounts />}
    </DarkPage>
  );
};

export default Login;
