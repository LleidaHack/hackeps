import RequiredMark from "src/components/hackeps/Forms/RequiredMark";
import React, { useState } from "react";
import "src/components/hackeps/Contacte/Contacte.css";
import "src/components/hackeps/Forms/PublicFormLayout.css";
import { ReactComponent as InstagramIcon } from "src/assets/img/home10/icon-instagram.svg";
import { ReactComponent as LinkedInIcon } from "src/assets/img/home10/icon-linkedin.svg";
import { ReactComponent as XIcon } from "src/assets/img/home10/icon-x.svg";
import { useForm } from "react-hook-form";
import { contacte } from "src/services/AuthenticationService";

const CONTACT_EMAIL = "contacte@lleidahack.dev";

const inputClass = (hasError) =>
  `mt-1 block min-h-[38px] w-full border-0 bg-white px-3 font-space-mono text-[16px] text-[#2e2e2e] outline-none ${
    hasError ? "bg-pink-100" : ""
  }`;

// Home section: the contact form, with its result shown in place.
const ContactSection = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [status, setStatus] = useState(null); // null | "sent" | "failed"
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await contacte(data);
      setStatus(result?.success === true ? "sent" : "failed");
      if (result?.success === true) reset();
    } catch (error) {
      setStatus("failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="contacte"
      className="relative w-full px-4 pb-16 pt-12 font-space-mono text-white md:px-8 md:pb-24 md:pt-20"
    >
      <h2 className="m-0 mb-8 text-center text-[32px] font-bold leading-tight tracking-[-0.64px] md:mb-12 md:text-[48px] lg:text-[64px] lg:tracking-[-1.28px]">
        CONTACTE
      </h2>
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-10 md:grid-cols-[2fr_3fr] md:gap-14">
        <div className="text-center md:text-left">
          <p className="mt-0 text-[16px] leading-relaxed md:text-[18px]">
            Tens algun dubte que no surt a les FAQs, vols col·laborar o
            patrocinar la HackEPS? Escriu-nos i et respondrem tan aviat com
            puguem.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="break-all text-[16px] font-bold text-[#ff7430] underline underline-offset-4 md:text-[18px]"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="mb-2 mt-8 text-[16px] leading-normal tracking-[-0.32px]">
            Esdeveniment ofert per LleidaHack
          </p>
          <div className="contact-social-links md:justify-start">
            <a
              href="https://www.instagram.com/lleidahack/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              style={{ color: "#ff354b" }}
            >
              <InstagramIcon aria-hidden="true" className="contact-social-icon" />
            </a>
            <a
              href="https://www.linkedin.com/company/lleidahack"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              style={{ color: "#3478f6" }}
            >
              <LinkedInIcon aria-hidden="true" className="contact-social-icon" />
            </a>
            <a
              href="https://twitter.com/lleidahack"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              style={{ color: "#00c9a7" }}
            >
              <XIcon aria-hidden="true" className="contact-social-icon" />
            </a>
          </div>
        </div>

        {status ? (
          <div role="status" className="flex flex-col items-center justify-center gap-4 rounded-[12px] bg-white/10 p-8 text-center">
            <p className="m-0 text-[20px] font-bold md:text-[24px]">
              {status === "sent" ? "Missatge enviat correctament." : "Error enviant el teu missatge."}
            </p>
            <p className="m-0 text-[15px] leading-relaxed md:text-[16px]">
              {status === "sent"
                ? "Gràcies per contactar amb LleidaHack. Si cal, et respondrem al correu que ens has indicat."
                : `Torna-ho a provar. Si segueix fallant, escriu-nos a ${CONTACT_EMAIL} o per xarxes socials.`}
            </p>
            <button
              type="button"
              onClick={() => setStatus(null)}
              className="min-h-[42px] border-0 bg-[#ff7430] px-6 font-bold text-[#2e2e2e] hover:bg-[#ff8a52]"
            >
              {status === "sent" ? "Enviar un altre missatge" : "Intentar novament"}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="public-form flex w-full min-w-0 flex-col gap-5"
          >
            <label className="text-[16px]">
              <RequiredMark /> Nom:
              <input
                aria-required="true"
                className={inputClass(errors.name)}
                placeholder="Nom i cognoms"
                {...register("name", {
                  required: "El nom no pot estar buit",
                })}
                disabled={isLoading}
              />
              {errors.name && <span className="text-sm text-red-300">{errors.name.message}</span>}
            </label>

            <label className="text-[16px]">
              <RequiredMark /> E-mail:
              <input
                aria-required="true"
                className={inputClass(errors.email)}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="nom@exemple.cat"
                {...register("email", {
                  required: "Et falta indicar-nos el teu correu de contacte",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "El correu no és vàlid",
                  },
                })}
                disabled={isLoading}
              />
              {errors.email && <span className="text-sm text-red-300">{errors.email.message}</span>}
            </label>

            <label className="text-[16px]">
              <RequiredMark /> Títol:
              <input
                aria-required="true"
                className={inputClass(errors.title)}
                placeholder="De què ens vols parlar?"
                {...register("title", {
                  required: "El titol no pot estar buit",
                })}
                disabled={isLoading}
              />
              {errors.title && <span className="text-sm text-red-300">{errors.title.message}</span>}
            </label>

            <label className="text-[16px]">
              <RequiredMark /> Missatge:
              <textarea
                aria-required="true"
                className={`${inputClass(errors.message)} min-h-[72px] py-2`}
                placeholder="Explica'ns de què ens vols parlar."
                {...register("message", {
                  required: "El missatge no pot estar buit",
                })}
                disabled={isLoading}
              />
              {errors.message && <span className="text-sm text-red-300">{errors.message.message}</span>}
            </label>

            <button
              className={`mt-2 min-h-[42px] w-full border-0 text-[18px] font-bold text-[#2e2e2e] ${
                isLoading ? "cursor-not-allowed bg-gray-400" : "cursor-pointer bg-[#ff7430] hover:bg-[#ff8a52]"
              }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Enviant..." : "Enviar"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
