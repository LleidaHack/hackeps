import React from "react";
import FormLayout from "src/components/hackeps/Forms/FormLayout";
import LoginForm from "src/components/loginForm/LoginForm";

const LoginPage = ({ nextScreen }) => (
  <FormLayout title="Hola de nou!">
    <LoginForm nextScreen={nextScreen} />
  </FormLayout>
);

export default LoginPage;
