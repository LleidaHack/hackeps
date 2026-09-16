import hackerIllustration from "src/assets/img/home10/marraco-hacker-raw.png";
import FormLayout from "src/components/hackeps/Forms/FormLayout";
import { useState } from "react";
import { signupHacker } from "src/services/HackerService";
import FileBase from "react-file-base64";
import userIcon from "src/icons/user2.png";
import FailFeedback from "../Feedbacks/FailFeedback";
import SuccessFeedback from "../Feedbacks/SuccesFeedback";
import TitleGeneralized from "../TitleGeneralized/TitleGeneralized";
import BirthdatePicker from "./BirthdatePicker";
import PasswordInput from "./PasswordInput";
import { Controller, useForm } from "react-hook-form";
import Button from "src/components/buttons/Button";
import { ROUTES } from "src/config/routes";
import "./HackerFormLayout.css";

import { isAtLeastAge } from "src/modules/ageValidation";

const MINIMUM_ACCOUNT_AGE = 14;

export const HackerStepperForm = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });
  const [pfpImage, setImage] = useState("");
  const [isPfpTooLarge, setPfpTooLarge] = useState(false);
  // Error message for last page of the form
  const [errorMsg, setErrorMsg] = useState("");
  //Feedback component
  const [submiting, setSubmiting] = useState(false); //si es false, encara no s'ha donat al submit, pero si es true, es mostra el feedback
  const [statusSubmit, setStatusSubmit] = useState(false); //si es false, error, si es true tot esta correcte
  const [errCause, setCauseError] = useState(""); //si es false, error, si es true tot esta correcte
  const [step, setStep] = useState(1);
  const [hideSubmit, setHideSubmit] = useState(false);

  const onSubmit = async (values) => {
    if (hideSubmit) return;
    setErrorMsg("");
    setHideSubmit(true);
    const hacker = {
      name: [values.firstName, values.lastName].join(" "),
      nickname: values.nickname,
      password: values.password,
      birthdate: values.birthdate,
      food_restrictions: "",
      email: values.email,
      config: {
        recive_notifications: values.notifications,
        default_lang: "cat",
        comercial_notifications: values.notifications,
        terms_and_conditions: true,
      },
      telephone: values.phone.replace(/\s+/g, ""),
      address: "",
      image: pfpImage,
      github: "",
      linkedin: "",
    };
    if (values.termsConditions) {
      const res = await signupHacker(hacker);
      if (res?.errCode) {
        setStatusSubmit(false);
        let causeError = "";
        if (res.errMssg === "Email already exists") {
          causeError = "El correu que has introduit es troba registrat.";
        } else if (res.errMssg === "Nickname already exists") {
          causeError = "El nickname que has introduit es troba registrat.";
        } else if (res.errMssg === "Telephone already exists") {
          causeError = "El telefon que has introduit es troba registrat.";
        } else {
          causeError = isPfpTooLarge
            ? "La foto de perfil introduida és massa gran"
            : "No hem pogut crear el compte. Torna-ho a provar.";
        }
        setCauseError(causeError);
        setErrorMsg(causeError);
        setHideSubmit(false);
        return;
      } else if (res?.detail) {
        setStatusSubmit(false);
        setCauseError(res.detail[0].msg);
        setErrorMsg(res.detail[0].msg);
        setHideSubmit(false);
      } else if (res?.success === true) {
        setStatusSubmit(true);
        setSubmiting(true);
        setHideSubmit(false);
      } else {
        setErrorMsg("No hem pogut crear el compte. Torna-ho a provar.");
        setHideSubmit(false);
      }
    } else {
      setHideSubmit(false);
      setErrorMsg("Has d'acceptar els termes i condicions");
    }
  };

  const handleImageChange = (event) => {
    setErrorMsg("");
    setPfpTooLarge(parseFloat(event.size) > 1024);
    setImage(event.base64);
  };
  const handleImageUrlChange = (event) => {
    setErrorMsg("");
    setImage(event.target.value.trim());
    setPfpTooLarge(false);
  };

  const handleButtonClick = () => {
    window.location.reload();
  };

  const password = watch("password");

  return (
    <>
      <div id="hackerForm" className="hacker-signup text-white">
        {!submiting ? (
          <FormLayout image={hackerIllustration} imageAlt="Hacker">
                <div key={step} className="hacker-signup-step">
                {step === 1 ? (
                  <>
                    <TitleGeneralized alignText={"left"} primary>
                      {" "}
                      Informació Personal
                    </TitleGeneralized>
                    <form className="flex flex-col gap-3">
                      <label>
                        Nom:
                        <input
                          className={`${errors.firstName ? "bg-pink-100" : "bg-white"} min-h-10 px-2 text-base mt-4`}
                          autoComplete="given-name"
                          placeholder="Nom"
                          {...register("firstName", {
                            required: "El nom no pot estar buit",
                          })}
                        />
                        {errors.firstName && (
                          <span className="text-red-400">
                            {errors.firstName.message}
                          </span>
                        )}
                      </label>

                      <label>
                        Cognoms:
                        <input
                          className={`${errors.lastName ? "bg-pink-100" : "bg-white"} min-h-10 px-2 text-base mt-4`}
                          autoComplete="family-name"
                          placeholder="Cognoms"
                          {...register("lastName", {
                            required: "Els cognoms no pot estar buit",
                          })}
                        />
                        {errors.lastName && (
                          <span className="text-red-400">
                            {errors.lastName.message}
                          </span>
                        )}
                      </label>

                      <label>
                        Contrasenya:
                        <PasswordInput
                          visibilityLabel="la contrasenya"
                          autoComplete="new-password"
                          className={`${errors.password ? "bg-pink-100" : "bg-white"} min-h-10 px-2 text-base mt-2`}
                          placeholder="Contrasenya"
                          {...register("password", {
                            required: "La contrasenya no pot estar buida",
                            minLength: {
                              value: 8,
                              message: "Ha de tenir almenys 8 caràcters",
                            },

                            validate: {
                              hasUpperCase: (value) =>
                                /[A-Z]/.test(value) ||
                                "Ha de tenir almenys una majúscula",
                              hasLowerCase: (value) =>
                                /[a-z]/.test(value) ||
                                "Ha de tenir almenys una minúscula",
                              hasNumber: (value) =>
                                /\d/.test(value) ||
                                "Ha de tenir almenys un número",
                            },
                          })}
                        />
                        <span className="text-xs text-gray-400">
                          La contrasenya ha de tenir almenys 8 caràcters, una
                          majúscula, una minúscula i un número.
                        </span>
                        <br />
                        {errors.password && (
                          <span className="text-red-400">
                            {errors.password.message}
                          </span>
                        )}
                      </label>

                      <label>
                        Confirma la contrasenya:
                        <PasswordInput
                          visibilityLabel="la confirmació de la contrasenya"
                          autoComplete="new-password"
                          className={`${errors.confirmPassword ? "bg-pink-100" : "bg-white"} min-h-10 px-2 text-base mt-2`}
                          placeholder="Confirma la contrasenya"
                          {...register("confirmPassword", {
                            required: "Has de confirmar la contrasenya",
                            validate: (value) =>
                              value === password ||
                              "Les contrasenyes no coincideixen",
                          })}
                        />
                        {errors.confirmPassword && (
                          <span className="text-red-400">
                            {errors.confirmPassword.message}
                          </span>
                        )}
                      </label>

                      <div>
                        <label htmlFor="birthdate">Data de naixement:</label>
                        <Controller
                          name="birthdate"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: "La data de naixement és obligatòria",
                            validate: (value) =>
                              isAtLeastAge(value, MINIMUM_ACCOUNT_AGE) ||
                              "Has de tenir almenys 14 anys",
                          }}
                          render={({ field }) => (
                            <BirthdatePicker
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              invalid={Boolean(errors.birthdate)}
                            />
                          )}
                        />
                        {errors.birthdate && (
                          <span
                            id="birthdate-error"
                            className="mt-2 block text-red-400"
                          >
                            {errors.birthdate.message}
                          </span>
                        )}
                      </div>

                      <Button
                        orange
                        disabled={!isValid}
                        className={`min-h-10 ${!isValid ? "opacity-50" : ""}`}
                        onClick={() => setStep(2)}
                      >
                        Següent
                      </Button>
                    </form>
                  </>
                ) : null}
                {step === 2 ? (
                  <>
                    <TitleGeneralized alignText={"left"} primary>
                      Contacte{" "}
                    </TitleGeneralized>
                    <form className="flex flex-col gap-3">
                      <label>
                        Telèfon:
                        <input
                          type="tel"
                          autoComplete="tel"
                          className={`${errors.phone ? "bg-pink-100" : "bg-white"} min-h-10 px-2 text-base mt-2`}
                          placeholder="Telèfon"
                          {...register("phone", {
                            required: "El telèfon és obligatori",
                            pattern: {
                              value: /^ *(\+ *(\d *){1,2})?(\d *){9}$/,
                              message: "Nombre de telèfon no vàlid",
                            },
                          })}
                        />
                        {errors.phone && (
                          <span className="text-red-400">
                            {errors.phone.message}
                          </span>
                        )}
                      </label>

                      <label>
                        Correu electrònic:
                        <input
                          type="email"
                          autoComplete="email"
                          className={`${errors.email ? "bg-pink-100" : "bg-white"} min-h-10 px-2 text-base mt-2`}
                          placeholder="Correu electrònic"
                          {...register("email", {
                            required: "El correu electrònic és obligatori",
                            pattern: {
                              value:
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                              message: "El correu ha de tenir un format vàlid",
                            },
                          })}
                        />
                        {errors.email && (
                          <span className="text-red-400">
                            {errors.email.message}
                          </span>
                        )}
                      </label>

                      <label className="hacker-signup-consent">
                        <input
                          type="checkbox"
                          className="shrink-0"
                          {...register("notifications")}
                        />
                        Accepto rebre notificacions electròniques de caràcter
                        informatiu, comercial i promocional.
                      </label>

                      <div className="buttonsBox flex flex-wrap gap-3">
                        <Button
                          orange
                          className="min-h-10"
                          onClick={() => setStep(1)}
                        >
                          Anterior
                        </Button>
                        <Button
                          orange
                          disabled={!isValid}
                          className={`min-h-10 ${!isValid ? "opacity-50" : ""}`}
                          onClick={() => setStep(3)}
                        >
                          Següent
                        </Button>
                      </div>
                    </form>
                  </>
                ) : null}
                {step === 3 ? (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                      <img
                        src={pfpImage || userIcon}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <TitleGeneralized alignText={"left"} primary>
                      Avatar
                    </TitleGeneralized>
                    <form className="flex flex-col gap-3">
                      <label>
                        Àlies:
                        <input
                          className={`${errors.nickname ? "bg-pink-100" : "bg-white"} min-h-10 px-2 text-base mt-2`}
                          placeholder="Àlies"
                          {...register("nickname", {
                            required: "El nickname és obligatori",
                          })}
                        />
                        {errors.nickname && (
                          <span className="text-red-400">
                            {errors.nickname.message}
                          </span>
                        )}
                      </label>

                      <label>
                        URL de la imatge:
                        <input
                          className={`${errors.imageUrl ? "bg-pink-100" : "bg-white"} min-h-10 px-2 text-base mt-2`}
                          placeholder="URL de la imatge"
                          {...register("imageUrl")}
                          onChange={handleImageUrlChange}
                        />
                        {errors.imageUrl && (
                          <span className="text-red-400">
                            {errors.imageUrl.message}
                          </span>
                        )}
                      </label>
                      <div className="image-input-container">
                        <FileBase
                          id="avatarInput"
                          type="file"
                          multiple={false}
                          onDone={handleImageChange}
                        />
                      </div>
                      {isPfpTooLarge && (
                        <span className="text-red-400">
                          La foto de perfil introduida és massa gran
                        </span>
                      )}

                      <label className="hacker-signup-consent">
                        <input
                          type="checkbox"
                          className="shrink-0"
                          {...register("termsConditions", {
                            required: "Has d'acceptar els termes i condicions",
                          })}
                        />
                        <p>
                          Acceptes els nostres{" "}
                          <a href={ROUTES.terms} className="text-[#ff7430]">
                            termes i condicions
                          </a>
                          .
                        </p>
                      </label>

                      <div className="buttonsBox flex flex-wrap gap-3">
                        <Button
                          orange
                          className="min-h-10"
                          onClick={() => setStep(2)}
                        >
                          Anterior
                        </Button>
                        <Button
                          orange
                          disabled={
                            !isValid || !watch("termsConditions") || hideSubmit
                          }
                          className={`form-submit-action ${!isValid || !watch("termsConditions") || hideSubmit ? "opacity-50" : ""}`}
                          onClick={handleSubmit(onSubmit)}
                        >
                          Enviar
                        </Button>
                      </div>
                      {errorMsg && (
                        <span className="text-red-400">{errorMsg}</span>
                      )}
                    </form>
                  </div>
                ) : null}
                </div>
          </FormLayout>
        ) : (
          <>
            {!statusSubmit ? (
              <>
                <FailFeedback
                  title={`Error al registrar el teu compte`}
                  text={`Sembla que alguna cosa ha fallat mentre enregistràvem el teu compte al sistema.`}
                  hasButton={true}
                  buttonLink={`/hacker-form`}
                  buttonText={`Intentar novament`}
                  italic={errCause}
                  onButtonClick={handleButtonClick}
                />
              </>
            ) : (
              <>
                <SuccessFeedback
                  title="T'has registrat correctament"
                  text={`El teu registre s'ha realitzat correctament. \n T'hem enviat un correu electrònic per a que confirmis el registre.`}
                  hasButton={true}
                  buttonLink="/login"
                  buttonText="Inicia sessió"
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
