import React, { useEffect, useState } from "react";
import { getCompanyByTier } from "src/services/CompanyService";
import HomeFooter from "src/components/hackeps/Home/HomeFooter.js";
import Firework from "src/components/hackeps/Home/Firework.js";
import sponsorSlot from "src/assets/img/home10/sponsor-slot.svg";
import firework1 from "src/assets/img/home10/firework-1.png";
import firework2 from "src/assets/img/home10/firework-2.png";
import firework3 from "src/assets/img/home10/firework-3.png";
import seuVellaSolo512 from "src/assets/img/seuvella-solo-512.webp";
import seuVellaSolo1024 from "src/assets/img/seuvella-solo-1024.webp";
import olaInterior1280 from "src/assets/img/ola-interior-1280.webp";
import olaInterior2048 from "src/assets/img/ola-interior-2048.webp";
import olaExterior1280 from "src/assets/img/ola-exterior-1280.webp";
import olaExterior2048 from "src/assets/img/ola-exterior-2048.webp";

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
    className="relative h-[198px] w-[358px] border-0 bg-transparent p-0"
    onClick={() => company && redirectToURL(`sponsors/${company.id}`)}
  >
    <img
      src={sponsorSlot}
      alt=""
      width={358}
      height={198}
      className="absolute inset-0 h-[198px] w-[358px] max-w-none"
    />
    {company?.image ? (
      <img
        src={company.image}
        alt={company.name}
        width={358}
        height={198}
        className="absolute inset-0 h-[198px] w-[358px] object-contain p-6"
      />
    ) : null}
  </button>
);

const SlotRow = ({ companies }) => {
  const cells = [0, 1, 2].map((i) => companies[i] || null);
  return (
    <div className="flex justify-center gap-[29px]">
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
      className="relative w-full overflow-hidden bg-transparent pt-0"
    >
      <div className="relative min-h-[1654px] w-full">
        <h2 className="relative z-10 m-0 pt-0 text-center font-space-mono text-[51px] font-bold leading-normal tracking-[-1.02px] text-white">
          SPONSORS
        </h2>

        <Firework
          src={firework3}
          width={348}
          height={318}
          className="left-[834px] top-[194px] z-0 h-[318px] w-[348px] -rotate-[19.78deg]"
        />
        <Firework
          src={firework1}
          width={190}
          height={188}
          className="left-[36px] top-[492px] z-0 h-[188px] w-[190px] rotate-[19.31deg]"
        />
        <Firework
          src={firework3}
          width={262}
          height={239}
          className="left-[83px] top-[737px] z-0 h-[239px] w-[262px] rotate-[12.02deg]"
        />
        <Firework
          src={firework2}
          width={205}
          height={178}
          className="left-[1034px] top-[955px] z-0 h-[178px] w-[205px] -rotate-[14.03deg]"
        />
        <Firework
          src={firework3}
          width={158}
          height={145}
          className="left-[863px] top-[1515px] z-0 h-[145px] w-[158px] rotate-[17.19deg]"
        />

        <h3 className="relative z-10 mb-6 mt-[56px] text-center font-space-mono text-[51px] font-bold leading-none tracking-[-1.02px] text-white">
          Patrocinadors or
        </h3>
        <div className="relative z-10 mb-[97px]">
          <SlotRow companies={gold} />
        </div>

        <h3 className="relative z-10 mb-6 text-center font-space-mono text-[51px] font-bold leading-none tracking-[-1.02px] text-white">
          Patrocinadors plata
        </h3>
        <div className="relative z-10 mb-[49px] flex flex-col gap-[49px]">
          {silverRows.map((row, i) => (
            <SlotRow key={`s-${i}`} companies={row} />
          ))}
        </div>

        <h3 className="relative z-10 mb-6 mt-[49px] text-center font-space-mono text-[51px] font-bold leading-none tracking-[-1.02px] text-white">
          Patrocinadors bronze
        </h3>
        <div className="relative z-10 flex flex-col gap-[49px] pb-[64px]">
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
    <div className="relative w-full overflow-hidden">
      <div className="relative h-[520px] w-full bg-transparent">
        <img
          src={olaInterior1280}
          srcSet={`${olaInterior1280} 1280w, ${olaInterior2048} 2048w`}
          sizes="100vw"
          width="2048"
          height="784"
          className="absolute left-0 top-[50%] z-10 w-full h-auto"
          alt=""
        />
        <img
          src={seuVellaSolo512}
          srcSet={`${seuVellaSolo512} 512w, ${seuVellaSolo1024} 1024w`}
          sizes="25vw"
          width="1024"
          height="1036"
          className="absolute bottom-[5%] right-[10%] z-20 h-auto w-[25%]"
          alt="La Seu Vella de Lleida"
        />
        <img
          src={olaExterior1280}
          srcSet={`${olaExterior1280} 1280w, ${olaExterior2048} 2048w`}
          sizes="100vw"
          width="2048"
          height="594"
          className="absolute left-0 top-[75%] z-30 w-full h-auto"
          alt=""
        />
      </div>
      <div className="relative z-40 -mt-[80px]">
        <HomeFooter />
      </div>
    </div>
  );
};

export default Sponsors;
