import React, { useEffect, useState } from "react";
import { getHackeps, getEventSponsors } from "src/services/EventService";
import HomeFooter from "src/components/hackeps/Home/HomeFooter.js";
import Firework from "src/components/hackeps/Home/Firework.js";
import lleidaHackLogo from "src/assets/img/home10/isotip.svg";
import sponsorSlot from "src/assets/img/home10/sponsor-slot.svg";
import firework1 from "src/assets/img/home10/firework-1.svg";
import firework2 from "src/assets/img/home10/firework-2.svg";
import firework3 from "src/assets/img/home10/firework-3.svg";
import seuVella from "src/assets/img/home10/seu-vella.svg";
import waveBack from "src/assets/img/home10/wave-back.svg";
import waveFront from "src/assets/img/home10/wave-front.svg";

function asCompanyList(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object" || data.errCode != null) return [];
  if (Array.isArray(data.results)) return data.results;
  if (Array.isArray(data.companies)) return data.companies;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

function redirectToURL(url) {
  if (!url) return;
  if (/^https?:\/\//i.test(url)) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  const path = "/" + url.replace(/^\/+/, "");
  window.open(
    `${window.location.origin}${path}`,
    "_blank",
    "noopener,noreferrer",
  );
}

const Slot = ({ company }) => (
  <button
    aria-label={company?.name || "Veure patrocinador"}
    type="button"
    className="relative aspect-[358/198] w-[min(100%,320px)] border-0 bg-transparent p-0 md:w-[358px]"
    onClick={() => company && redirectToURL(`sponsors/${company.id}`)}
  >
    <img
      loading="lazy"
      decoding="async"
      src={sponsorSlot}
      alt=""
      width={358}
      height={198}
      className="absolute inset-0 h-full w-full"
    />
    {company?.image ? (
      <img
        loading="lazy"
        decoding="async"
        src={company.image}
        alt={company.name}
        width={358}
        height={198}
        className="absolute inset-0 h-full w-full object-contain p-4 md:p-6"
      />
    ) : (
      <img
        loading="lazy"
        decoding="async"
        src={lleidaHackLogo}
        alt=""
        width={75}
        height={48}
        className="absolute inset-0 m-auto h-auto w-[45%]"
      />
    )}
  </button>
);

// Render only the real sponsors of the row; a tier that does not fill three
// slots (e.g. a single Supreme) shows just its sponsors, no empty placeholders.
const SlotRow = ({ companies }) => (
  <div className="flex flex-wrap justify-center gap-4 md:gap-7">
    {companies.map((company) => (
      <Slot key={`company-${company.id}`} company={company} />
    ))}
  </div>
);

// Sponsor tiers agreed with the admin panel and the backend: 0 = highest.
const TIER_SECTIONS = [
  { tier: 0, title: "Supreme" },
  { tier: 1, title: "Challenger" },
  { tier: 2, title: "Premium" },
  { tier: 3, title: "Supporter" },
  { tier: 4, title: "Col·laboradors" },
];

function chunk(list, size) {
  const rows = [];
  for (let i = 0; i < list.length; i += size) rows.push(list.slice(i, i + size));
  return rows;
}

const Sponsors = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const event = await getHackeps();
        if (!event?.id) return;
        const list = asCompanyList(await getEventSponsors(event.id));
        if (cancelled) return;
        setCompanies(list);
      } catch (error) {
        console.error("Error fetching sponsors data:", error);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  // The backend returns sponsors already ordered by display_order; filtering
  // per tier keeps that order. Empty tiers are not rendered.
  const sections = TIER_SECTIONS.map((section) => ({
    ...section,
    rows: chunk(
      companies.filter((company) => Number(company.tier) === section.tier),
      3,
    ),
  })).filter((section) => section.rows.length > 0);

  return (
    <div
      id="sponsors"
      className="relative w-full overflow-hidden bg-transparent px-4 pt-8 md:px-8 md:pt-0"
    >
      <div className="relative w-full">
        <h2 className="relative z-10 m-0 pt-0 text-center font-space-mono text-[32px] font-bold leading-normal tracking-[-0.64px] text-white md:text-[44px] lg:text-[51px] lg:tracking-[-1.02px]">
          SPONSORS
        </h2>

        <Firework
          phase={0}
          src={firework3}
          width={348}
          height={318}
          className="right-[8%] top-[8%] z-0 h-[90px] w-[100px] -rotate-[19.78deg] md:h-[140px] md:w-[150px] lg:h-[220px] lg:w-[240px]"
        />
        <Firework
          phase={1}
          src={firework1}
          width={190}
          height={188}
          className="left-[2%] top-[22%] z-0 hidden h-[100px] w-[100px] rotate-[19.31deg] md:block"
        />
        <Firework
          phase={2}
          src={firework3}
          width={262}
          height={239}
          className="left-[4%] top-[48%] z-0 hidden h-[120px] w-[130px] rotate-[12.02deg] lg:block"
        />
        <Firework
          phase={3}
          src={firework2}
          width={205}
          height={178}
          className="right-[6%] top-[58%] z-0 hidden h-[110px] w-[120px] -rotate-[14.03deg] lg:block"
        />
        <Firework
          phase={4}
          src={firework3}
          width={158}
          height={145}
          className="right-[12%] bottom-[8%] z-0 hidden h-[90px] w-[100px] rotate-[17.19deg] md:block"
        />

        {sections.map((section, index) => (
          <div key={section.tier} className="relative z-10">
            <h3
              className={`relative z-10 mb-5 text-center font-space-mono text-[24px] font-bold leading-none tracking-[-0.48px] text-white md:mb-6 md:text-[40px] lg:text-[51px] ${
                index === 0 ? "mt-20 md:mt-28" : "mt-8 md:mt-12"
              }`}
            >
              {section.title}
            </h3>
            <div
              className={`relative z-10 flex flex-col gap-6 md:gap-12 ${
                index === sections.length - 1
                  ? "pb-12 md:pb-20"
                  : "mb-8 md:mb-12"
              }`}
            >
              {section.rows.map((row, i) => (
                <SlotRow key={`${section.tier}-${i}`} companies={row} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SeuVellaFooter = () => {
  return (
    <div className="relative w-full overflow-hidden bg-[#2e2e2e]">
      <div className="relative h-[320px] w-full overflow-hidden bg-transparent sm:h-[400px] md:h-[520px]">
        <img
        loading="lazy"
        decoding="async"
          src={waveBack}
          sizes="100vw"
          width="2048"
          height="784"
          className="absolute left-0 top-[42%] z-10 h-auto w-full sm:top-[48%] md:top-[50%]"
          alt=""
        />
        <img
        loading="lazy"
        decoding="async"
          src={waveFront}
          sizes="100vw"
          width="2048"
          height="594"
          className="absolute left-0 top-[68%] z-20 h-auto w-full sm:top-[72%] md:top-[75%]"
          alt=""
        />
        <img
        loading="lazy"
        decoding="async"
          src={seuVella}
          sizes="(max-width: 768px) 42vw, 25vw"
          width="1024"
          height="1036"
          className="absolute bottom-[18%] right-[6%] z-30 h-auto w-[42%] max-w-[180px] sm:bottom-[14%] sm:w-[32%] sm:max-w-[240px] md:bottom-[8%] md:right-[10%] md:w-[25%] md:max-w-none"
          alt="La Seu Vella de Lleida"
        />
      </div>
      <div className="relative z-40 -mt-[56px] sm:-mt-[64px] md:-mt-[80px]">
        <HomeFooter tone="green" />
      </div>
    </div>
  );
};

export default Sponsors;
