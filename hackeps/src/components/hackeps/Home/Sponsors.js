import React, { useEffect, useState } from "react";
import { getHackeps, getEventSponsors } from "src/services/EventService";
import HomeFooter from "src/components/hackeps/Home/HomeFooter.js";
import Firework from "src/components/hackeps/Home/Firework.js";
import lleidaHackLogo from "src/assets/img/home10/isotip.svg";
import sponsorSlot from "src/assets/img/home10/sponsor-slot.svg";
import firework1 from "src/assets/img/home10/firework-1.svg";
import firework2 from "src/assets/img/home10/firework-2.svg";
import firework3 from "src/assets/img/home10/firework-3.svg";

import SeuVellaScene from "./SeuVellaScene";

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

const Slot = ({ company, tier }) => (
  <button
    aria-label={company?.name || "Veure patrocinador"}
    type="button"
    className="relative aspect-[358/198] max-w-full border-0 bg-transparent p-0"
    style={{ width: `${[86, 70, 56, 44, 44][tier]}vw`, maxWidth: [440, 350, 270, 200, 200][tier] }}
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
        loading="eager"
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
const SlotRow = ({ companies, tier }) => (
  <div className="flex flex-wrap justify-center gap-4 md:gap-7">
    {companies.map((company) => (
      <Slot key={`company-${company.id}`} company={company} tier={tier} />
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
          <div key={section.tier} className="relative z-10 mt-10 md:mt-14">
            {section.tier === 4 && <h3 className="mb-6 mt-12 text-center font-space-mono text-2xl font-bold text-white md:text-4xl">Col·laboradors</h3>}
            <div
              className={`relative z-10 flex flex-col gap-6 md:gap-12 ${
                index === sections.length - 1
                  ? "pb-12 md:pb-20"
                  : "mb-8 md:mb-12"
              }`}
            >
              {section.rows.map((row, i) => (
                <SlotRow key={`${section.tier}-${i}`} companies={row} tier={section.tier} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SeuVellaFooter = () => (
  <div className="w-full overflow-hidden bg-[#2e2e2e]">
    <SeuVellaScene />
    <HomeFooter tone="green" />
  </div>
);

export default Sponsors;
