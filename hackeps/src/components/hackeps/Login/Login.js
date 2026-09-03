import React from "react";
import logo from "src/assets/img/home10/logonaranja.png";
import LoginForm from "src/components/loginForm/LoginForm";

const LoginPage = ({ nextScreen }) => {
  return (
    <div className="flex w-full items-center justify-center px-8 py-10">
      <div className="flex w-full max-w-[520px] flex-col items-center">
        <img
          src={logo}
          className="mb-3 block h-auto w-40 md:w-56"
          alt="Logo"
        />
        <h2 className="mb-0 flex items-center text-center font-space-mono text-3xl text-white md:text-5xl">
          Hola de nou!
        </h2>
        <LoginForm nextScreen={nextScreen} />
      </div>
    </div>
  );
};

export default LoginPage;
