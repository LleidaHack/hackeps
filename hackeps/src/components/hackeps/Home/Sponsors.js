import React, { useEffect, useState } from "react";
import { getCompanyByTier } from "src/services/CompanyService";
import HomeFooter from "src/components/hackeps/Home/HomeFooter.js";
import sponsorSlot from "src/assets/img/home10/sponsor-slot.svg";
import firework1 from "src/assets/img/home10/firework-1.png";
import firework2 from "src/assets/img/home10/firework-2.png";
import firework3 from "src/assets/img/home10/firework-3.png";
import seuVella from "src/assets/img/home10/seu-vella.png";
import arbre from "src/assets/img/home10/arbre.png";
import arbre2 from "src/assets/img/home10/arbre-2.png";

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
  window.open(`${window.location.origin}${path}`, "_blank", "noopener,noreferrer");
}

const Slot = ({ company }) => (
  <button
    type="button"
    className="relative h-[248px] w-[448px] border-0 bg-transparent p-0"
    onClick={() => company && redirectToURL(`sponsors/${company.id}`)}
  >
    <img
      src={sponsorSlot}
      alt=""
      width={448}
      height={248}
      className="absolute inset-0 h-[248px] w-[448px] max-w-none"
    />
    {company?.image ? (
      <img
        src={company.image}
        alt={company.name}
        width={448}
        height={248}
        className="absolute inset-0 h-[248px] w-[448px] object-contain p-8"
      />
    ) : null}
  </button>
);

const SlotRow = ({ companies }) => {
  const cells = [0, 1, 2].map((i) => companies[i] || null);
  return (
    <div className="flex justify-center gap-[36px]">
      {cells.map((company, i) => (
        <Slot key={company?.id || i} company={company} />
      ))}
    </div>
  );
};

const Sponsors = () => {
  const [gold, setGold] = useState([]);
  const [silver, setSilver] = useState([]);
  const [bronze, setBronze] = useState([]);

  useEffect(() => {
    const event = localStorage.getItem("event");
    if (!event) return;
    async function fetchData() {
      try {
        const [tier2, tier1, tier3] = await Promise.all([
          getCompanyByTier(2),
          getCompanyByTier(1),
          getCompanyByTier(3),
        ]);
        setGold(asCompanyList(tier2));
        setSilver(asCompanyList(tier1));
        setBronze(asCompanyList(tier3));
      } catch (error) {
        console.error("Error fetching sponsors data:", error);
      }
    }
    fetchData();
  }, []);

  const silverRows = [silver.slice(0, 3), silver.slice(3, 6)];
  const bronzeRows = [bronze.slice(0, 3), bronze.slice(3, 6)];

  return (
    <div
      id="sponsors"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#2c465e] via-[#1a2f42] to-[#15202b] pt-0"
    >
      <div className="relative min-h-[2067px] w-full">
        <h2 className="relative z-10 m-0 pt-[0px] text-center font-space-mono text-[64px] font-bold leading-normal tracking-[-1.28px] text-white">
          SPONSORS
        </h2>

        <img
          src={firework3}
          alt=""
          aria-hidden="true"
          width={435}
          height={398}
          className="pointer-events-none absolute left-[1043px] top-[243px] h-[398px] w-[435px] max-w-none -rotate-[19.78deg] object-cover"
        />
        <img
          src={firework1}
          alt=""
          aria-hidden="true"
          width={238}
          height={235}
          className="pointer-events-none absolute left-[45px] top-[615px] h-[235px] w-[238px] max-w-none rotate-[19.31deg] object-cover"
        />
        <img
          src={firework3}
          alt=""
          aria-hidden="true"
          width={327}
          height={299}
          className="pointer-events-none absolute left-[104px] top-[921px] h-[299px] w-[327px] max-w-none rotate-[12.02deg] object-cover"
        />
        <img
          src={firework2}
          alt=""
          aria-hidden="true"
          width={256}
          height={222}
          className="pointer-events-none absolute left-[1292px] top-[1194px] h-[222px] w-[256px] max-w-none -rotate-[14.03deg] object-cover"
        />
        <img
          src={firework3}
          alt=""
          aria-hidden="true"
          width={198}
          height={181}
          className="pointer-events-none absolute left-[1079px] top-[1894px] h-[181px] w-[198px] max-w-none rotate-[17.19deg] object-cover"
        />

        <h3 className="relative z-10 mt-[70px] mb-8 text-center font-space-mono text-[64px] font-bold leading-none tracking-[-1.28px] text-white">
          Patrocinadors or
        </h3>
        <div className="relative z-10 mb-[121px]">
          <SlotRow companies={gold} />
        </div>

        <h3 className="relative z-10 mb-8 text-center font-space-mono text-[64px] font-bold leading-none tracking-[-1.28px] text-white">
          Patrocinadors plata
        </h3>
        <div className="relative z-10 mb-[61px] flex flex-col gap-[61px]">
          {silverRows.map((row, i) => (
            <SlotRow key={`s-${i}`} companies={row} />
          ))}
        </div>

        <h3 className="relative z-10 mb-8 mt-[61px] text-center font-space-mono text-[64px] font-bold leading-none tracking-[-1.28px] text-white">
          Patrocinadors bronze
        </h3>
        <div className="relative z-10 flex flex-col gap-[61px]">
          {bronzeRows.map((row, i) => (
            <SlotRow key={`b-${i}`} companies={row} />
          ))}
        </div>
      </div>

      <div className="relative w-full bg-[#78c6bd]">
        <div className="relative h-[1224px] w-full bg-[#15202b] leading-[0]">
          <img
            src={seuVella}
            alt=""
            width={1728}
            height={1224}
            className="absolute bottom-0 left-0 block h-[1224px] w-full max-w-none object-cover object-bottom"
          />
          <img
            src={firework2}
            alt=""
            aria-hidden="true"
            width={447}
            height={387}
            className="pointer-events-none absolute left-[45px] top-[42px] h-[387px] w-[447px] max-w-none -rotate-[19.48deg] object-cover"
          />
          <img
            src={arbre}
            alt=""
            aria-hidden="true"
            width={365}
            height={451}
            className="pointer-events-none absolute left-[380px] top-[330px] h-[451px] w-[365px] max-w-none object-cover"
          />
          <img
            src={arbre2}
            alt=""
            aria-hidden="true"
            width={229}
            height={283}
            className="pointer-events-none absolute left-[67px] top-[352px] h-[283px] w-[229px] max-w-none -scale-y-100 rotate-180 object-cover"
          />
        </div>
        <HomeFooter />
      </div>
    </div>
  );
};

export default Sponsors;
