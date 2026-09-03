import React, { useEffect, useState } from "react";
import "src/components/hackeps/Contacte/Contacte.css";
import logo from "src/assets/img/home10/logonaranja.png";
import instagramLogo from "src/assets/img/home10/icon-instagram.svg";
import linkedinLogo from "src/assets/img/home10/icon-linkedin.svg";
import twitterLogo from "src/assets/img/home10/icon-x.svg";
import { useForm } from "react-hook-form";
import { contacte } from "src/services/AuthenticationService";
import SuccessFeedback from "src/components/hackeps/Feedbacks/SuccesFeedback";
import FailFeedback from "src/components/hackeps/Feedbacks/FailFeedback";

const inputClass = (hasError) =>
  `mt-1 block min-h-[38px] w-full border-0 bg-white px-3 font-space-mono text-[16px] text-[#2e2e2e] outline-none ${
    hasError ? "bg-pink-100" : ""
  }`;

const ContactePage = () => {
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
      const success = await contacte(data);
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
        text={`Gracies per contactar amb LleidaHack. El teu missatge s'ha enviat correctament. \n En cas que necesitesim ficar-nos en contacte amb tu, ho fariem amb el correu 
                que ens has proporcionat.`}
        hasButton={true}
        buttonLink="/#home"
        buttonText="Tornar al inici"
      />
    );
  }

  return (
    <div className="px-[72px] pb-8 pt-4 text-white">
      <h1 className="mb-4 mt-0 text-center font-space-mono text-[40px] font-bold leading-none tracking-[-0.8px]">
        Contacte
      </h1>
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex w-full flex-col items-center lg:w-[38%]">
          <img
            src={logo}
            alt="HackEPS 10a edició"
            className="h-auto w-[260px] max-w-full object-contain"
          />
          <p className="mt-3 mb-2 text-center font-space-mono text-[16px] leading-normal tracking-[-0.32px]">
            Esdeveniment ofert per LleidaHack
          </p>
          <div className="flex flex-row items-center gap-4">
            <a
              href="https://www.instagram.com/lleidahack/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <img src={instagramLogo} alt="" className="h-7 w-7" />
            </a>
            <a
              href="https://www.linkedin.com/company/lleidahack"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <img src={linkedinLogo} alt="" className="h-7 w-7" />
            </a>
            <a
              href="https://twitter.com/lleidahack"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
            >
              <img src={twitterLogo} alt="" className="h-7 w-7" />
            </a>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-2 lg:w-[54%]"
        >
          <label className="font-space-mono text-[16px]">
            Nom:
            <input
              className={inputClass(errors.name)}
              placeholder="Nom i cognoms"
              {...register("name", {
                required: "El nom no pot estar buit",
              })}
              disabled={isLoading}
            />
            {errors.name && (
              <span className="text-sm text-red-400">{errors.name.message}</span>
            )}
          </label>

          <label className="font-space-mono text-[16px]">
            E-mail:
            <input
              className={inputClass(errors.email)}
              placeholder="johndoe@example.com"
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
              <span className="text-sm text-red-400">{errors.email.message}</span>
            )}
          </label>

          <label className="font-space-mono text-[16px]">
            Títol:
            <input
              className={inputClass(errors.title)}
              placeholder="Títol de l'anunci"
              {...register("title", {
                required: "El titol no pot estar buit",
              })}
              disabled={isLoading}
            />
            {errors.title && (
              <span className="text-sm text-red-400">{errors.title.message}</span>
            )}
          </label>

          <label className="font-space-mono text-[16px]">
            Missatge:
            <textarea
              className={`${inputClass(errors.message)} min-h-[72px] py-2`}
              placeholder="Explica'ns de què ens vols parlar."
              {...register("message", {
                required: "El missatge no pot estar buit",
              })}
              disabled={isLoading}
            />
            {errors.message && (
              <span className="text-sm text-red-400">
                {errors.message.message}
              </span>
            )}
          </label>

          <button
            className={`mt-1 min-h-[42px] w-full border-0 font-space-mono text-[18px] font-bold text-[#2e2e2e] ${
              isLoading
                ? "cursor-not-allowed bg-gray-400"
                : "cursor-pointer bg-[#ff7430] hover:bg-[#ff8a52]"
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Enviant..." : "Següent"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactePage;
