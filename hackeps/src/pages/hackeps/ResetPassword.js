import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DarkPage from "src/components/hackeps/Layout/DarkPage.js";
import { confirmResetPassword } from "src/services/AuthenticationService";
import FailFeedback from "src/components/hackeps/Feedbacks/FailFeedback";
import Button from "src/components/buttons/Button";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // if (params.get("token") == null) {
    //   navigate("/");
    // }
  }, [params]);

  const [firstPassword, setFirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const [errorMsg, setErrorMsg] = useState();
  const [errMesage, setFeedErr] = useState();
  const [sended, setSended] = useState(false);

  async function handleResetPassword(e) {
    e.preventDefault();

    if (isSubmitting) return;
    if (!params.get("token")) {
      setErrorMsg("L’enllaç de recuperació no és vàlid.");
      return;
    }
    if (firstPassword !== secondPassword) {
      setErrorMsg("Les contrassenyes no coincideixen");
      return;
    }

    setSubmitting(true);
    const servicePassword = await confirmResetPassword(
      params.get("token"),
      secondPassword,
    );

    setSubmitting(false);
    if (servicePassword?.success !== true) {
      setFeedErr(
        "No hem pogut restablir la contrasenya. Sol·licita un enllaç nou o torna-ho a provar.",
      );
      setSended(true);
    } else {
      navigate("/");
    }
  }

  return (
    <DarkPage>
      {!sended ? (
        <div className="flex w-full items-center justify-center px-8 py-10">
          <form
            onSubmit={(e) => handleResetPassword(e)}
            className="flex w-full max-w-[520px] flex-col"
          >
            <h2 className="mb-6 text-center font-space-mono text-3xl text-white md:text-5xl">
              Restablir contrasenya
            </h2>
            <label className="mb-3 w-full text-base text-white">
              <p className="mb-1">Nova contrasenya</p>
              <input
                type="password"
                required
                autoComplete="new-password"
                onChange={(e) => setFirstPassword(e.target.value)}
                value={firstPassword}
                className="min-h-10 w-full bg-white px-2 text-base text-black"
                pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$"
              />
            </label>
            <label className="mb-3 w-full text-base text-white">
              <p className="mb-1">Confirmar contrasenya</p>
              <input
                type="password"
                required
                autoComplete="new-password"
                onChange={(e) => setSecondPassword(e.target.value)}
                value={secondPassword}
                className="min-h-10 w-full bg-white px-2 text-base text-black"
                pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$"
              />
            </label>
            <ul className="mb-3 text-white">
              <li>Majúscules, Minúscules, Números</li>
              <li>8 caràcters mínim</li>
            </ul>
            <small className="mb-3 block text-center text-red-400">
              {errorMsg}
            </small>
            <Button
              orange
              lg
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              Restablir contrasenya
            </Button>
          </form>
        </div>
      ) : (
        <FailFeedback
          title={`Error restablint la contrasenya`}
          text={`${errMesage}`}
          hasButton={false}
          italic={``}
        />
      )}
    </DarkPage>
  );
}
