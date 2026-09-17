import React, { useState } from "react";
import LoginUnverified from "src/components/hackeps/LoginUnverified/LoginUnverified";
import { hasSessionCredentials } from "src/modules/session";
import "src/components/hackeps/Forms/PublicFormLayout.css";
import { login } from "src/services/AuthenticationService";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "src/components/buttons/Button";

const LoginForm = ({ nextScreen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });
  const navigate = useNavigate();
  const [pendingCredentials, setPendingCredentials] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const submit = async (values) => {
    if (isSubmitting) return;
    setErrorText("");
    setSubmitting(true);
    try {
      let a = await login(values);
      if (process.env.REACT_APP_DEBUG === "true") console.log(a);
      if (a?.errMssg === "Email verification required") {
        setPendingCredentials(values);
      } else if (hasSessionCredentials(a)) {
        if (process.env.REACT_APP_DEBUG === "true")
          console.log("Login successful");
        if (nextScreen) {
          navigate(nextScreen);
        } else navigate("/perfil");
      } else {
        setErrorText(
          [401, 404].includes(a?.errCode)
            ? "Contrasenya o correu incorrectes"
            : "No hem pogut iniciar la sessió. Torna-ho a provar.",
        );
      }
    } catch (error) {
      setErrorText("No hem pogut iniciar la sessió. Torna-ho a provar.");
    } finally {
      setSubmitting(false);
    }
  };
  if (pendingCredentials) return <LoginUnverified email={pendingCredentials.email} credentials={pendingCredentials} nextScreen={nextScreen || "/perfil"} />;
  return (
    <div className="w-full min-w-0">
      <form className="public-form" onSubmit={handleSubmit(submit)}>
        <div className="text-base mt-7 w-full">
          <label className="w-full text-base">
            <p className="text-white mb-2">Correu:</p>
            <input
              className={`${errors.email ? "bg-pink-100" : "bg-white"} min-h-10 px-2 text-base`}
              type="email"
              inputMode="email"
              autoComplete="username"
              placeholder="Correu"
              {...register("email", {
                required: "E-mail obligatori",
              })}
            />
          </label>
          {errors.email && (
            <span className="text-red-400">{errors.email.message}</span>
          )}
        </div>

        <div className="text-base mt-3">
          <label className="w-full text-base">
            <p className="text-white mb-2">Contrasenya:</p>
            <input
              type="password"
              autoComplete="current-password"
              className={`${errors.password ? "bg-pink-100" : "bg-white"} min-h-10 px-2 text-base`}
              placeholder="Contrasenya"
              {...register("password", {
                required: "La contrasenya és obligatòria",
              })}
            />
          </label>
          {errors.password && (
            <span className="text-red-400">{errors.password.message}</span>
          )}
        </div>

        <div className="my-3 md:my-7 text-base md:text-xl text-center">
          <p className="mb-1">
            <Link to="/forgot-password" className="text-[#ff7430]">
              Has oblidat les teves credencials?
            </Link>
          </p>
        </div>
        <div className="flex flex-col justify-center mt-3">
          <Button
            type="submit"
            orange
            lg
            className={!isValid ? "opacity-50" : ""}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Iniciant sessió..." : "Inicia sessió"}
          </Button>
          <p role="alert" className="text-red-400 mt-2">
            {errorText}
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
