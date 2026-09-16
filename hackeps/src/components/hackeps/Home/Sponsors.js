import React, { useEffect, useState } from "react";
import { getCompanyByTier } from "src/services/CompanyService";
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

const Slot = ({ company }) =>
  !company ? (
    <div
      aria-hidden="true"
      className="relative aspect-[358/198] w-[min(100%,320px)] md:w-[358px]"
    >
      <img
        src={sponsorSlot}
        alt=""
        width={358}
        height={198}
        className="h-full w-full"
      />
      <img
        src={lleidaHackLogo}
        alt=""
        width={75}
        height={48}
        className="absolute inset-0 m-auto h-auto w-[45%]"
      />
    </div>
  ) : (
    <button
      aria-label={company?.name || "Veure patrocinador"}
      type="button"
      className="relative aspect-[358/198] w-[min(100%,320px)] border-0 bg-transparent p-0 md:w-[358px]"
      onClick={() => company && redirectToURL(`sponsors/${company.id}`)}
    >
      <img
        src={sponsorSlot}
        alt=""
        width={358}
        height={198}
        className="absolute inset-0 h-full w-full"
      />
      {company?.image ? (
        <img
          src={company.image}
          alt={company.name}
          width={358}
          height={198}
          className="absolute inset-0 h-full w-full object-contain p-4 md:p-6"
        />
      ) : (
        <img
          src={lleidaHackLogo}
          alt=""
          width={75}
          height={48}
          className="absolute inset-0 m-auto h-auto w-[45%]"
        />
      )}
    </button>
  );

const SlotRow = ({ companies }) => {
  const cells = [0, 1, 2].map((i) => companies[i] || null);
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-7">
      {cells.map((company, i) => (
        <Slot
          key={company ? `company-${company.id}` : `placeholder-${i}`}
          company={company}
        />
      ))}
    </div>
  );
};

const Sponsors = () => {
  const [gold, setGold] = useState([]);
  const [silver, setSilver] = useState([]);
  const [bronze, setBronze] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [tier2, tier1, tier3] = await Promise.all([
          getCompanyByTier(2),
          getCompanyByTier(1),
          getCompanyByTier(3),
        ]);
        if (cancelled) return;
        setGold(asCompanyList(tier2));
        setSilver(asCompanyList(tier1));
        setBronze(asCompanyList(tier3));
      } catch (error) {
        console.error("Error fetching sponsors data:", error);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const silverRows = [silver.slice(0, 3), silver.slice(3, 6)];
  const bronzeRows = [bronze.slice(0, 3), bronze.slice(3, 6)];

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

        <h3 className="relative z-10 mb-5 mt-20 text-center font-space-mono text-[24px] font-bold leading-none tracking-[-0.48px] text-white md:mb-6 md:mt-28 md:text-[40px] lg:text-[51px]">
          Patrocinadors or
        </h3>
        <div className="relative z-10 mb-10 md:mb-20">
          <SlotRow companies={gold} />
        </div>

        <h3 className="relative z-10 mb-5 text-center font-space-mono text-[24px] font-bold leading-none tracking-[-0.48px] text-white md:mb-6 md:text-[40px] lg:text-[51px]">
          Patrocinadors plata
        </h3>
        <div className="relative z-10 mb-8 flex flex-col gap-6 md:mb-12 md:gap-12">
          {silverRows.map((row, i) => (
            <SlotRow key={`s-${i}`} companies={row} />
          ))}
        </div>

        <h3 className="relative z-10 mb-5 mt-8 text-center font-space-mono text-[24px] font-bold leading-none tracking-[-0.48px] text-white md:mb-6 md:mt-12 md:text-[40px] lg:text-[51px]">
          Patrocinadors bronze
        </h3>
        <div className="relative z-10 flex flex-col gap-6 pb-12 md:gap-12 md:pb-20">
          {bronzeRows.map((row, i) => (
            <SlotRow key={`b-${i}`} companies={row} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const SeuVellaFooter = () => {
  return (
    <div className="relative w-full overflow-hidden bg-[#2e2e2e]">
      <div className="relative h-[320px] w-full overflow-hidden bg-transparent sm:h-[400px] md:h-[520px]">
        <img
          src={waveBack}
          sizes="100vw"
          width="2048"
          height="784"
          className="absolute left-0 top-[42%] z-10 h-auto w-full sm:top-[48%] md:top-[50%]"
          alt=""
        />
        <img
          src={waveFront}
          sizes="100vw"
          width="2048"
          height="594"
          className="absolute left-0 top-[68%] z-20 h-auto w-full sm:top-[72%] md:top-[75%]"
          alt=""
        />
        <img
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
