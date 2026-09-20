import React, { useEffect, useState } from "react";
import "src/components/hackeps/Sponsors/IfSponsors.css";
import { getHackeps, getEventSponsors } from "src/services/EventService";
import cloudWave from "src/assets/img/home10/cloud-wave.webp";

const InfoSponsors = ({ id }) => {
  const [infoCompany, setInfoCompany] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setInfoCompany(null);
    setFailed(false);
    getHackeps().then(async event => {
      if (!event?.id) return null;
      const sponsors = await getEventSponsors(event.id);
      return Array.isArray(sponsors) ? sponsors.find(company => String(company.id) === String(id)) : null;
    }).then((data) => {
        if (cancelled) return;
        if (!data || data.errCode != null || !data.name) setFailed(true);
        else setInfoCompany(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (failed)
    return (
      <p role="alert" className="p-6 text-center text-white">
        No hem pogut carregar el patrocinador.
      </p>
    );

  if (!infoCompany) {
    return (
      <div className="flex min-h-[600px] items-center justify-center font-space-mono text-[24px] text-white">
        Carregant...
      </div>
    );
  }

  if (Object.keys(infoCompany) && Object.keys(infoCompany).length > 0) {
    const SpnName = infoCompany.name;
    const linkedintag = infoCompany.linkdin;
    const webtag = infoCompany.website;
    const imgLogo = infoCompany.image;
    const description = infoCompany.description;
    const xarxes = Boolean(webtag && webtag.length > 0);

    return (
      <div className="relative pb-24 pt-12 text-white">
        <h1 className="m-0 mb-10 px-6 text-center font-space-mono text-[clamp(32px,8vw,64px)] font-bold leading-tight tracking-[-1.28px] [overflow-wrap:anywhere]">
          -{SpnName}-
        </h1>

        <div className="sponsor-logo-stage relative mx-auto h-[280px] w-full max-w-[1728px] sm:h-[321px]">
          <img
            src={cloudWave}
            alt=""
            aria-hidden="true"
            width={1728}
            height={321}
            className="absolute inset-0 z-10 block h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center px-8">
            <img
              src={imgLogo}
              alt={`Logo de ${SpnName}`}
              className="max-h-[180px] w-auto max-w-full object-contain sm:max-w-[55%]"
            />
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-[980px] px-8 text-center">
          <h2 className="m-0 mb-6 font-space-mono text-[32px] font-bold tracking-[-0.64px] text-[#ff7430]">
            Contacte de l'empresa
          </h2>
          <div className="mb-10 flex items-center justify-center gap-8 text-[40px] text-[#ff7430]">
            {linkedintag ? (
              <a
                href={linkedintag}
                target="_blank"
                rel="noreferrer"
                className="text-[#ff7430] no-underline hover:text-[#ff8a52]"
                aria-label="LinkedIn"
              >
                <i className="fa-brands fa-linkedin" />
              </a>
            ) : null}
            {xarxes ? (
              <a
                href={webtag}
                target="_blank"
                rel="noreferrer"
                className="text-[#ff7430] no-underline hover:text-[#ff8a52]"
                aria-label="Web"
              >
                <i className="fa-solid fa-globe" />
              </a>
            ) : null}
          </div>
          <p className="m-0 whitespace-pre-line text-left font-space-mono text-[20px] leading-relaxed tracking-[-0.4px]">
            {description}
          </p>
        </div>
      </div>
    );
  }


  let errorImages = [
    "https://media.tenor.com/Wv6zVQPZFtcAAAAC/error.gif",
    "https://media.tenor.com/hI4TN7nt06oAAAAC/error.gif",
    "https://media.tenor.com/89X5kccfNy0AAAAC/theoffice-michaelscott.gif",
    "https://media.tenor.com/JKPJy9fQiAAAAAAi/cat-diragana.gif",
    "https://media.tenor.com/nKPZSs1a6WMAAAAC/back-pocket-skadi.gif",
    "https://media.tenor.com/ENxVWo1KcnsAAAAC/error.gif",
  ];
  let errorImage = errorImages[Math.floor(Math.random() * errorImages.length)];

  return (
    <div className="flex min-h-[700px] flex-col items-center px-8 py-16 text-center text-white">
      <h1 className="font-space-mono text-[40px]">
        Oh No, Alguna cosa ha fallat.
      </h1>
      <img className="mt-8 max-h-[280px]" src={errorImage} alt="Gif" />
      <h1 className="mt-8 font-space-mono text-[32px]">
        No s’ha trobat el patrocinador
      </h1>
    </div>
  );
};

export default InfoSponsors;
