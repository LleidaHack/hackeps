import { HACKEPS_YEAR } from "src/config/edition";
import { formatEditionDates } from "src/hooks/useEdition";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { registerHackerToEvent } from "src/services/EventService";
import { getHackeps } from "src/services/EventService";
import FailFeedback from "src/components/hackeps/Feedbacks/FailFeedback";
import SuccessFeedback from "src/components/hackeps/Feedbacks/SuccesFeedback";
import Button from "src/components/buttons/Button";
import { readUpload } from "src/modules/uploads";
import { getHackerById } from "src/services/HackerService";
import { getEventIsHackerRegistered, getEventRegistration } from "src/services/EventService";
import { updateRregisterHackerToEvent } from "src/services/EventService";
import "../Forms/FormLayout.css";
import "../Forms/PublicFormLayout.css";
import "./Inscripcio.css";
import { ROUTES } from "src/config/routes";

const InscripcioForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,

    formState: { errors, isValid },

  } = useForm({
    mode: "onChange",
  });
  const sizeOptions = [
    { value: "", label: "Selecciona una talla" },
    { value: "XS", label: "XS" },
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
  const [loadError, setLoadError] = useState(false);
  const [sending, setSending] = useState(false);
  const [disabledRestrictions, setDisabledRestrictions] = useState(true);
  const [cvFile, setCvFile] = useState("");
  const [hackepsEvent, setHackepsEvent] = useState(null);
  const [fileError, setFileError] = useState("");
  const [readingFile, setReadingFile] = useState(false);
  const [cvChanged, setCvChanged] = useState(false);
  const cvInput = useRef(null);
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
      if (!hackepsEvent?.id) { setLoadError(true); return; }
      const account = await getHackerById(localStorage.getItem("userID"));
      if (!account?.id) { setLoadError(true); return; }
      const response = await getEventIsHackerRegistered(hackepsEvent.id, account.id);
      if (typeof response !== "boolean") { setLoadError(true); return; }
      let me = account;
      if (response) {
        const registration = await getEventRegistration(hackepsEvent.id, account.id);
        if (!registration || registration.errCode || registration.event_id !== hackepsEvent.id) { setLoadError(true); return; }
        me = { ...account, ...registration };
      }
      setRegistered(response);
      setCvFile(me.cv || "");
      reset({ studies: me.studies || "", center: me.study_center || "", location: me.location || "",
        size: me.shirt_size || "", meets: me.food_restrictions ? "yes" : "no", food: me.food_restrictions || "",
        github: me.github || "", linkedin: me.linkedin || "", meet: me.how_did_you_meet_us || "nan",
        cvinfo_links: me.description || "", checkboxterms: false, checkboxcredit: me.wants_credit || false });
      setDisabledRestrictions(!me.food_restrictions);
      setHackepsEvent(hackepsEvent);
      setPreviousRegistration(me);
      if (process.env.REACT_APP_DEBUG === "true") console.log(me);
    };

    fetchData().catch(() => setLoadError(true));
  }, [reset]);

  const submit = async (values) => {
    if (sending || readingFile || Boolean(fileError) || loadError || !hackepsEvent?.id || (!registered && !hackepsEvent.is_open)) return;
    setSending(true);
    const data = {
      shirt_size: values.size === undefined ? "" : values.size,
      food_restrictions: disabledRestrictions ? "" : values.food,
      ...((cvChanged || !registered) && cvFile !== undefined ? { cv: cvFile } : {}),
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
      registration = await updateRregisterHackerToEvent(hackepsEvent.id, previousRegistration.id, data);
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

  const handleFileChange = async (event) => {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;
    setReadingFile(true); setFileError("");
    try { setCvFile(await readUpload(file, "cv")); setCvChanged(true); }
    catch (error) { setFileError(error.message); input.value = ""; }
    finally { setReadingFile(false); }
  };
  const clearFile = () => {
    setCvFile(""); setCvChanged(true); setFileError("");
    if (cvInput.current) cvInput.current.value = "";
  };

  return (
    <div className="event-registration text-white">
      {!submittRegister ? (
        <section className="event-registration-layout shared-form-fields">
              <h1 className="shared-form-title">Inscripció HackEPS {HACKEPS_YEAR}</h1>
              <p className="event-registration-intro">Completa les dades per participar-hi. {formatEditionDates(hackepsEvent)}.</p>
              {loadError && <p role="alert">No hem pogut carregar aquesta edició. Torna-ho a provar més tard.</p>}
              {hackepsEvent && !hackepsEvent.is_open && !registered && <p role="status">Les inscripcions d’aquesta edició estan tancades.</p>}
              <form className="public-form event-registration-grid" onSubmit={handleSubmit(submit)}>
                <fieldset className="event-registration-section" disabled={!hackepsEvent || sending}>
                  <legend>Dades de participació</legend>
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

                      if (value === "yes") {
                        setDisabledRestrictions(false);
                      } else if (value === "no") {
                        setDisabledRestrictions(true);
                      } else {
                        setDisabledRestrictions(true);
                      }
                      if (value !== "yes") setValue("food", "");
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
                    {previousRegistration.how_did_you_meet_us && !meetOptions.some(option => option.value === previousRegistration.how_did_you_meet_us) && <option value={previousRegistration.how_did_you_meet_us}>{previousRegistration.how_did_you_meet_us}</option>}
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

                </fieldset>
                <fieldset className="event-registration-section" disabled={!hackepsEvent || sending}>
                  <legend>Perfil professional <span>(opcional)</span></legend>
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

                  <div className="event-registration-cv">
                    <div className="event-registration-cv-heading">
                      <label htmlFor="cvinfo_file">Adjunta el teu CV (opcional)</label>
                      <button type="button" onClick={clearFile} disabled={readingFile || (!cvFile && !fileError)} className="event-registration-remove">Esborra</button>
                    </div>
                    <input ref={cvInput} id="cvinfo_file" type="file" accept="application/pdf,.pdf" onChange={handleFileChange} disabled={readingFile || sending} />
                    <small>PDF. Màxim 1 MB.{cvFile && !cvInput.current?.files?.length ? " Ja tens un CV desat; el conservarem." : ""}</small>
                    {fileError && <p role="alert" className="text-red-400">{fileError}</p>}
                  </div>

                </fieldset>
                <div className="event-registration-footer">
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
                <div className="event-registration-actions">
                  <Button
                    type="submit"
                    orange
                    disabled={!isValid || sending || readingFile || Boolean(fileError) || loadError || !hackepsEvent?.id || (!registered && !hackepsEvent.is_open)}
                    className="event-registration-submit"
                  >
                    {sending ? "Enviant…" : "Enviar"}
                  </Button>
                </div>
              </form>
        </section>
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
