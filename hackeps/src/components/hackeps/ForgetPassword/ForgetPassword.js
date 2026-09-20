import RequiredMark from "src/components/hackeps/Forms/RequiredMark";
import FormLayout from "src/components/hackeps/Forms/FormLayout";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
        <FormLayout title="Necessites ajuda per iniciar sessió?">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="public-form flex w-full flex-col gap-3"
            >
              <label className="text-white">
                <RequiredMark /> Introdueix el teu correu electrònic
                <input aria-required="true"
                  className={`${errors.email ? "bg-pink-100" : "bg-white"} mt-2 min-h-10 w-full px-2 text-base text-black`}
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
        </FormLayout>
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
