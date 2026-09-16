import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { registerHackerToEvent } from "src/services/EventService";
import { getHackeps } from "src/services/EventService";
import FailFeedback from "src/components/hackeps/Feedbacks/FailFeedback";
import SuccessFeedback from "src/components/hackeps/Feedbacks/SuccesFeedback";
import Button from "src/components/buttons/Button";
import FileBase from "react-file-base64";
import { getHackerById } from "src/services/HackerService";
import { getEventIsHackerRegistered } from "src/services/EventService";
import { updateHacker } from "src/services/HackerService";
import FormLayout from "../Forms/FormLayout";
import "./Inscripcio.css";
import { ROUTES } from "src/config/routes";

const InscripcioForm = () => {
  const {
    register,
    handleSubmit,

    formState: { errors, isValid },

  } = useForm({
    mode: "onChange",
  });
  const sizeOptions = [
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
    { value: "XXXL", label: "XXXL" },
  ];

  const meetOptions = [
    { value: "nan", label: "Selecciona una opció" },
    { value: "Xarxes socials", label: "Xarxes socials" },
    { value: "Un amic", label: "Un amic" },
    { value: "Altres edicions", label: "Altres edicions" },
    { value: "Cartells publicitaris", label: "Cartells publicitaris" },
    { value: "Altre mitjà", label: "Altre mitjà" },
  ];
  const [sending, setSending] = useState(false);
  const [disabledRestrictions, setDisabledRestrictions] = useState(true);
  const [cvFile, setCvFile] = useState("");
  const [hackepsEvent, setHackepsEvent] = useState(null);
  const [isCvTooLarge, setCvTooLarge] = useState(false);
  const [previousRegistration, setPreviousRegistration] = useState({
    studies: "",
    center: "",
    location: "",
    size: "",
    food: "",
    cvinfo: "",
    meet: "",
    linkedin: "",
    github: "",
    devpost: "",
    checkboxterms: "",
    food_restrictions: "",
  });
  const [registered, setRegistered] = useState(false);

  //FeedbackStates
  const [submittRegister, setsubmittRegister] = useState(false); // Si se da al boton de Succes, se vuelve true, es decir, que le toca al feedback
  const [stateRegister, setStateRegister] = useState(false); //Muestra si el registro es correcto (true) o hay error (false)
  const [errRegister, setErrRegister] = useState(""); //Estado que almacena el tipo de error

  useEffect(() => {
    const fetchData = async () => {
      const hackepsEvent = await getHackeps();
      const me = await getHackerById(localStorage.getItem("userID"));
      setCvFile(me.cv);
      getEventIsHackerRegistered(hackepsEvent.id, me.id).then((response) => {

        if (response === true) {
          setRegistered(true);
        } else {
          setRegistered(false);
        }
      });
      setHackepsEvent(hackepsEvent);
      setPreviousRegistration(me);
      if (process.env.REACT_APP_DEBUG === "true") console.log(me);
    };

    fetchData();
  }, []);

  const submit = async (values) => {
    if (sending || isCvTooLarge || !hackepsEvent?.id) return;
    setSending(true);
    const data = {
      shirt_size: values.size === undefined ? "" : values.size,
      food_restrictions: disabledRestrictions ? "" : values.food,
      cv: cvFile,
      description: values.cvinfo_links,
      github: values.github,
      linkedin: values.linkedin,
      studies: values.studies,
      study_center: values.center,
      location: values.location,
      how_did_you_meet_us: values.meet,
      wants_credit: values.checkboxcredit,
      update_user: true,
      terms_accepted: values.checkboxterms,
    };

    let registration;
    if (registered) {
      data.id = parseInt(previousRegistration.id, 10);
      registration = await updateHacker(data);
    } else {
      registration = await registerHackerToEvent(
        parseInt(hackepsEvent.id, 10),
        parseInt(localStorage.getItem("userID"), 10),
        data,
      );
    }
    setSending(false);
    if (!registration || registration.errCode || registration.success === false) {
      setErrRegister("");
      if (registration?.errCode === 400) {
        setErrRegister(
          "Ja estas registrat a aquest esdeveniment. En cas que es tracti d'un error, contacta amb nosatres.",
        );
      }

      setStateRegister(false);
    } else if (registration.detail) {
      setErrRegister(registration.detail);
      setStateRegister(false);
    } else {
      setStateRegister(true);
    }

    setsubmittRegister(true);
  };

  const handleButtonClick = () => {
    window.location.reload();
  };

  const handleFileChange = (event) => {
    let file = event.base64;
    setCvTooLarge(parseFloat(event.size) > 1024);
    setCvFile(file);
  };

  const clearFile = () => {
    setCvFile("");
    setCvTooLarge(false);
    // Clear the input field to allow selecting the same file again
    const inputElement = document.getElementById("cvinfo_file");
    if (inputElement) {
      inputElement.value = "";
    }
  };

  return (
    <div className="event-registration text-white">
      {!submittRegister ? (
        <FormLayout title="Inscripció HackEPS 2026">
              <p className="event-registration-intro">Completa les dades per participar-hi el 28 i 29 de novembre.</p>
              <form className="public-form flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
                <label className="mb-3">
                  Què estudies o has estudiat?
                  <input
                    className={`${errors.studies ? "bg-pink-100" : "bg-white"} py-2 min-h-10 px-2 text-base mt-2`}
                    placeholder="Estudis"
                    {...register("studies", {
                      required: "Aquest camp és obligatori",
                    })}
                  />
                </label>
                {errors.studies && (
                  <span className="text-red-400">{errors.studies.message}</span>
                )}

                <label className="mb-3">
                  Centre d'estudis:
                  <input
                    className={`${errors.center ? "bg-pink-100" : "bg-white"} py-2 min-h-10 px-2 text-base mt-2`}
                    placeholder="UdL"
                    {...register("center", {
                      required: "Aquest camp és obligatori",
                    })}
                  />
                </label>
                {errors.center && (
                  <span className="text-red-400">{errors.center.message}</span>
                )}

                <label className="mb-3">
                  D'on vens?
                  <input
                    className={`${errors.location ? "bg-pink-100" : "bg-white"} py-2 min-h-10 px-2 text-base mt-2`}
                    placeholder="Lleida, Barcelona, etc."
                    {...register("location", {
                      required: "Aquest camp és obligatori",
                    })}
                  />
                </label>
                {errors.location && (
                  <span className="text-red-400">
                    {errors.location.message}
                  </span>
                )}

                <label className="mb-3">
                  Talla de samarreta:
                  <select
                    className={`${errors.size ? "bg-pink-100" : "bg-white"} py-2 min-h-10 px-2 text-base mt-2`}
                    {...register("size", {
                      required: "Aquest camp és obligatori",
                    })}
                  >
                    {sizeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                {errors.size && (
                  <span className="text-red-400">{errors.size.message}</span>
                )}

                <label className="mb-3">
                  Tens alguna restricció alimentària o alèrgia?
                  <select
                    className={`${errors.meets ? "bg-pink-100" : "bg-white"} py-2 min-h-10 px-2 text-base ml-2`}
                    {...register("meets", {
                      required: "Aquest camp és obligatori",
                      validate: (value) =>
                        value !== "nan" || "Selecciona una opció vàlida",
                    })}
                    onChange={(e) => {
                      register("meets").onChange(e);
                      const value = e.target.value;
                      const box = document.getElementById("foodTextArea");
                      if (value === "yes") {
                        setDisabledRestrictions(false);
                      } else if (value === "no") {
                        setDisabledRestrictions(true);
                      } else {
                        setDisabledRestrictions(true);
                      }
                      if (box) {
                        box.value = "";
                      }
                    }}
                  >
                    <option value="nan">Selecciona una opció</option>
                    <option value="yes">Sí, en tinc</option>
                    <option value="no">No en tinc</option>
                  </select>
                </label>

                <label>
                  {!disabledRestrictions && (
                    <div id="foodTextArea">
                      Quines restriccions o alèrgies tens?
                      <input
                        className={`${errors.food && !disabledRestrictions ? "bg-pink-100" : "bg-white"} ${``} py-2 min-h-10 px-2 text-base mt-2`}
                        placeholder="Lactosa, gluten, etc."
                        defaultValue={""}
                        {...register("food", {
                          required:
                            !disabledRestrictions &&
                            "Indicans les teves restriccions o alergies.",
                        })}
                      />
                      {errors.food && !disabledRestrictions && (
                        <span className="text-red-400">
                          {errors.food.message}
                        </span>
                      )}
                    </div>
                  )}
                </label>

                <label className="mb-3">
                  Com ens has conegut?
                  <select
                    className={`${errors.meet ? "bg-pink-100" : "bg-white"} py-2 min-h-10 px-2 text-base ml-2`}
                    {...register("meet", {
                      required: "Aquest camp és obligatori",
                      validate: (value) =>
                        value !== "nan" || "Selecciona una opció vàlida",
                    })}
                  >
                    {meetOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                {errors.meet && (
                  <span className="text-red-400">{errors.meet.message}</span>
                )}

                <hr className="my-4" />

                <div className="flex flex-col w-full">
                  <p className="text-xl">
                    Vols que les empreses de Lleida et coneguin? (Opcional)
                  </p>
                  <label className="mb-3">
                    <p className="text-sm">
                      Tens experiència en altres hackatons? Algun projecte
                      personal que vulguis compartir? Explica'ns què t'apassiona
                      i deixa aquí els enllaços de les teves xarxes socials
                    </p>
                    <textarea
                      className={`${errors.cvinfo_links ? "bg-pink-100" : "bg-white"} px-2 text-base mt-2`}
                      placeholder="Explica'ns què t'apassiona i deixa aquí els enllaços de les teves xarxes socials"
                      {...register("cvinfo_links")}
                    />
                  </label>

                  <label className="mb-3">
                    Github:
                    <input
                      className={`py-2 min-h-10 px-2 text-base mt-2`}
                      placeholder="Github"
                      {...register("github")}
                    />
                  </label>

                  <label className="mb-3">
                    Linkedin:
                    <input
                      className={`py-2 min-h-10 px-2 text-base mt-2`}
                      placeholder="Linkedin"
                      {...register("linkedin")}
                    />
                  </label>

                  <label className="">
                    Adjunta el teu CV (Opcional)
                    <div className="flex flex-col md:flex-row gap-3 mt-2 image-input-container">
                      <FileBase
                        type="file"
                        id="avatarInput"
                        multiple={false}
                        accept="application/pdf"
                        onDone={handleFileChange}
                      />
                      <Button
                        type="button"
                        onClick={clearFile}
                        className="event-registration-remove"
                      >
                        Esborra
                      </Button>
                    </div>
                    {isCvTooLarge && (
                      <span className="text-red-400">
                        El fitxer és massa gran. Màxim 1MB.
                      </span>
                    )}
                  </label>

                  <label className="event-registration-consent">
                    <input
                      type="checkbox"
                      className="w-fit mr-5"
                      {...register("checkboxterms", {
                        required: "Aquest camp és obligatori",
                      })}
                    />
                    <p>
                      Accepto els{" "}
                      <a href={ROUTES.terms} className="event-registration-link">
                        termes i condicions
                      </a>
                    </p>
                  </label>

                  <label className="event-registration-consent">
                    <input
                      type="checkbox"
                      className="w-fit mr-5"
                      {...register("checkboxcredit")}
                    />
                    <p>
                      Vull 1 crèdit ECTS de matèria transversal (només aplicable
                      a alumnes de la UdL)
                    </p>
                  </label>
                </div>
                <div className="flex flex-col mt-4">
                  <Button
                    type="submit"
                    orange
                    disabled={!isValid || sending || isCvTooLarge || !hackepsEvent?.id}
                    className="event-registration-submit"
                  >
                    {sending ? "Enviant…" : "Enviar"}
                  </Button>
                </div>
              </form>
        </FormLayout>
      ) : (
        <>
          {!stateRegister ? (
            <>
              <FailFeedback
                title={`Error al registrar la teva participació.`}
                text={`Sembla que alguna cosa ha fallat mentre enregistràvem la teva participació al sistema`}
                hasButton={true}
                buttonLink={ROUTES.inscription}
                buttonText={`Intentar novament`}
                italic={errRegister}
                onButtonClick={handleButtonClick}
              />
            </>
          ) : (
            <>
              {registered ? (
                <SuccessFeedback
                  title="La teva informació ha estat actualitzada correctament!"
                  text={`El teu registre s'ha actualitzat correctament. Si hi ha algun canvi, rebràs les notificacions corresponents.`}
                  hasButton={true}
                  buttonLink={ROUTES.profile}
                  buttonText="Tornar al perfil"
                />
              ) : (
                <SuccessFeedback
                  title="T'has registrat correctament a l'esdeveniment!"
                  text={`El teu registre s'ha realitzat correctament. Quan siguis acceptat a l'esdeveniment, rebràs un correu per confirmar la teva assistència. Estigues atent! Tindrás 5 dies per confirmar-ho.`}
                  hasButton={true}
                  buttonLink={ROUTES.profile}
                  buttonText="Tornar al perfil"
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default InscripcioForm;
