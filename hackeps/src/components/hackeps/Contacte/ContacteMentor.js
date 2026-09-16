import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { contacte } from "src/services/AuthenticationService";
import SuccessFeedback from "src/components/hackeps/Feedbacks/SuccesFeedback";
import FailFeedback from "src/components/hackeps/Feedbacks/FailFeedback";
import "src/components/hackeps/Forms/PublicFormLayout.css";
import marracoMentor from "src/assets/img/home10/marraco-mentor-raw.png";

const fieldClass = (hasError) =>
  `mt-1 block min-h-[38px] w-full border-0 bg-white px-3 font-space-mono text-[16px] text-[#2e2e2e] outline-none ${
    hasError ? "bg-pink-100" : ""
  }`;

const ContacteMentorPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [mailSended, setMailSended] = useState(false);
  const [mailStatus, setMailStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleButtonClick = () => {
    window.location.reload();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formattedData = {
        name: data.name,
        title: `Proposta de Mentor - ${data.name}`,
        email: data.email,
        message: `
        Àrea d'especialització: ${data.specialization}
        Anys d'experiència: ${data.experience}
        Empresa/Organització: ${data.company || "No especificat"}
        Experiència prèvia com a mentor: ${data.mentorExperience}
        Motivació: ${data.motivation}
        Disponibilitat: ${data.availability}
      `,
      };

      const success = await contacte(formattedData);
      setMailStatus(success);
      setMailSended(true);
    } catch (error) {
      setMailStatus(false);
      setMailSended(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (mailSended) {
    window.scrollTo(0, 0);
    return !mailStatus ? (
      <FailFeedback
        title={`Error enviant el teu missatge.`}
        text={`Sembla que algo ha fallat mentre registravem el teu missatge.`}
        hasButton={true}
        buttonLink={`/contacte`}
        buttonText={`Intentar novament`}
        italic={`Torna a intentar-ho novament. En cas que segueixi fallant, contacta amb nosaltres utilitzant \n les nostres xarxes socials que trobarás a la part inferior de la pantalla.`}
        onButtonClick={handleButtonClick}
      />
    ) : (
      <SuccessFeedback
        title="Missatge enviat correctament."
        text={`Gracies per contactar amb LleidaHack. El teu missatge s'ha enviat correctament. \n En cas que necesitesim ficar-nos en contacte amb tu, ho fariem amb el correu que ens has proporcionat.`}
        hasButton={true}
        buttonLink="/#home"
        buttonText="Tornar al inici"
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-8 pt-4 text-white sm:px-6 md:px-10 lg:px-[72px]">
      <h1 className="mb-6 mt-0 text-center font-space-mono text-[32px] font-bold leading-none tracking-[-0.64px] md:mb-8 md:text-[40px] md:tracking-[-0.8px]">
        Aplicar com a Mentor
      </h1>

      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-10">
        <div className="flex w-full items-center justify-center lg:w-[32%]">
          <img
            src={marracoMentor}
            alt="MENTOR"
            width={526}
            height={523}
            className="h-auto w-[144px] max-w-full object-contain md:w-[200px] lg:w-full"
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="public-form grid w-full min-w-0 grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 lg:w-[64%]"
        >
          <label className="font-space-mono text-[15px]">
            Nom complet
            <input
              className={fieldClass(errors.name)}
              placeholder="El teu nom complet"
              {...register("name", {
                required: "El nom no pot estar buit",
              })}
              disabled={isLoading}
            />
            {errors.name && (
              <span className="text-sm text-red-400">
                {errors.name.message}
              </span>
            )}
          </label>

          <label className="font-space-mono text-[15px]">
            Correu electrònic
            <input
              className={fieldClass(errors.email)}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="el_teu_correu@exemple.com"
              {...register("email", {
                required: "Et falta indicar-nos el teu correu de contacte",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "El correu no és vàlid",
                },
              })}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="text-sm text-red-400">
                {errors.email.message}
              </span>
            )}
          </label>

          <label className="font-space-mono text-[15px]">
            Àrea d'especialització
            <select
              className={`${fieldClass(errors.specialization)} appearance-none`}
              {...register("specialization", {
                required:
                  "Si us plau, selecciona la teva àrea d'especialització",
              })}
              disabled={isLoading}
            >
              <option value="">Selecciona una àrea...</option>
              <option value="frontend">Desenvolupament Frontend</option>
              <option value="backend">Desenvolupament Backend</option>
              <option value="fullstack">Full Stack</option>
              <option value="mobile">Desenvolupament Mòbil</option>
              <option value="ai">Intel·ligència Artificial</option>
              <option value="data">Data Science</option>
              <option value="ux">UX/UI Design</option>
              <option value="devops">DevOps/Infrastructure</option>
              <option value="blockchain">Blockchain</option>
              <option value="iot">Internet of Things</option>
              <option value="other">Altres</option>
            </select>
            {errors.specialization && (
              <span className="text-sm text-red-400">
                {errors.specialization.message}
              </span>
            )}
          </label>

          <label className="font-space-mono text-[15px]">
            Anys d'experiència
            <select
              className={`${fieldClass(errors.experience)} appearance-none`}
              {...register("experience", {
                required: "Si us plau, indica els teus anys d'experiència",
              })}
              disabled={isLoading}
            >
              <option value="">Selecciona...</option>
              <option value="0-1">0-1 anys</option>
              <option value="2-3">2-3 anys</option>
              <option value="4-5">4-5 anys</option>
              <option value="6-10">6-10 anys</option>
              <option value="10+">Més de 10 anys</option>
            </select>
            {errors.experience && (
              <span className="text-sm text-red-400">
                {errors.experience.message}
              </span>
            )}
          </label>

          <label className="font-space-mono text-[15px] md:col-span-2">
            Empresa / organització / formació (opcional)
            <input
              className={fieldClass(false)}
              placeholder="On treballes o estudies actualment"
              {...register("company")}
              disabled={isLoading}
            />
          </label>

          <label className="font-space-mono text-[15px]">
            Experiència prèvia com a mentor
            <textarea
              className={`${fieldClass(errors.mentorExperience)} min-h-[64px] py-2`}
              placeholder="Has fet de mentor abans? En quin context?"
              {...register("mentorExperience", {
                required:
                  "Si us plau, explica'ns la teva experiència com a mentor",
              })}
              disabled={isLoading}
            />
            {errors.mentorExperience && (
              <span className="text-sm text-red-400">
                {errors.mentorExperience.message}
              </span>
            )}
          </label>

          <label className="font-space-mono text-[15px]">
            Motivació
            <textarea
              className={`${fieldClass(errors.motivation)} min-h-[64px] py-2`}
              placeholder="Què et motiva a ser mentor a HackEPS?"
              {...register("motivation", {
                required: "Si us plau, explica'ns la teva motivació",
              })}
              disabled={isLoading}
            />
            {errors.motivation && (
              <span className="text-sm text-red-400">
                {errors.motivation.message}
              </span>
            )}
          </label>

          <label className="font-space-mono text-[15px] md:col-span-2">
            Disponibilitat
            <textarea
              className={`${fieldClass(errors.availability)} min-h-[56px] py-2`}
              placeholder="Horaris, dies i modalitat (presencial / online)"
              {...register("availability", {
                required: "Si us plau, indica la teva disponibilitat",
              })}
              disabled={isLoading}
            />
            {errors.availability && (
              <span className="text-sm text-red-400">
                {errors.availability.message}
              </span>
            )}
          </label>

          <button
            className={`mt-1 min-h-[42px] w-full border-0 font-space-mono text-[18px] font-bold text-[#2e2e2e] md:col-span-2 ${
              isLoading
                ? "cursor-not-allowed bg-gray-400"
                : "cursor-pointer bg-[#ff7430] hover:bg-[#ff8a52]"
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Enviant candidatura..." : "Enviar candidatura"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContacteMentorPage;
