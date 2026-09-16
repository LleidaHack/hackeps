import React, { useState } from "react";
import { useForm } from "react-hook-form";
import logo from "src/assets/img/home10/logonaranja.png";
import { resetPassword } from "src/services/AuthenticationService";
import SuccessFeedback from "../Feedbacks/SuccesFeedback";
import Button from "src/components/buttons/Button";

const ForgetPassword = ({ nextScreen }) => {
  const [status, setStatus] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await resetPassword(data.email);
      if (result?.success === true) setStatus(true);
      else setError("No hem pogut tramitar la sol·licitud. Torna-ho a provar.");
    } catch {
      setError("No hem pogut tramitar la sol·licitud. Torna-ho a provar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {!status ? (
        <div className="flex w-full items-center justify-center px-8 py-10">
          <div className="flex w-full max-w-[520px] flex-col items-center">
            <img
              src={logo}
              alt="logo"
              className="mb-3 block h-auto w-40 md:w-56"
            />
            <p className="mb-4 text-center font-space-mono text-3xl text-white md:text-4xl">
              Necesites ajuda per a iniciar sessió?
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-3"
            >
              <label className="text-white">
                Introdueix el teu correu electrònic
                <input
                  className={`${errors.email ? "bg-pink-100" : "bg-white"} mt-3 min-h-10 w-full px-2 text-base text-black`}
                  placeholder="Correu electrònic"
                  {...register("email", {
                    required: "Et falta indicar-nos el teu correu de contacte",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "El correu no és vàlid",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-red-400">{errors.email.message}</span>
                )}
              </label>
              {error && (
                <p role="alert" className="text-red-400">
                  {error}
                </p>
              )}
              <Button
                orange
                lg
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviant..." : "Enviar enllaç de recuperació"}
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <SuccessFeedback
          title="Sol·licitud rebuda"
          text={`Si el correu correspon a un compte verificat, rebràs un enllaç per recuperar-lo.`}
          italics="Si no ho reps, comproba la bustia de spam."
          hasButton={true}
          buttonLink="/"
          buttonText="Tornar a l'Inici"
        />
      )}
    </>
  );
};

export default ForgetPassword;
