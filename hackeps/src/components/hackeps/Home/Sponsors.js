import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "src/components/hackeps/Home/Sponsors.css";
import Button from "src/components/buttons/Button";
import LogoSponsors from "../Sponsors/LogoSponsors";
import TitleGeneralized from "../TitleGeneralized/TitleGeneralized";
import { getCompanyByTier } from "src/services/CompanyService";

function redirectToURL(url) {
  if (!url) return;

  if (/^https?:\/\//i.test(url)) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  const path = "/" + url.replace(/^\/+/, "");
  const absoluteUrl = `${window.location.origin}${path}`;
  window.open(absoluteUrl, "_blank", "noopener,noreferrer");
}

const SponsorRow = ({ title, companies, size, loading, emptyLabel }) => (
  <section className="justify-center w-full mt-10 md:mt-16">
    <h2 className="font-space-mono text-white text-xl md:text-2xl text-center m-0">
      {title}
    </h2>
    <div className="flex flex-wrap justify-center gap-4 p-4 mt-4">
      {loading ? (
        <div className="text-center text-white/80 py-8 text-base font-space-mono">
          {emptyLabel.loading}
        </div>
      ) : companies.length > 0 ? (
        companies.map((company, index) => (
          <div
            key={company.id || index}
            className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
            onClick={() => redirectToURL(`sponsors/${company.id}`)}
          >
            <LogoSponsors
              image={company.image}
              name={company.name || `Empresa ${index + 1}`}
              size={size}
            />
          </div>
        ))
      ) : (
        <div className="text-center text-white/80 py-8 text-base font-space-mono">
          {emptyLabel.empty}
        </div>
      )}
    </div>
  </section>
);

const Sponsors = () => {
  const [gold, setGold] = useState([]);
  const [silver, setSilver] = useState([]);
  const [bronze, setBronze] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const event = localStorage.getItem("event");

    async function fetchData() {
      if (!event) {
        setLoading(false);
        return;
      }

      setLoading(true);

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const [tier2, tier1, tier3] = await Promise.all([
            getCompanyByTier(2),
            getCompanyByTier(1),
            getCompanyByTier(3),
          ]);

          const dataIsEmpty =
            (tier2 || []).length === 0 &&
            (tier1 || []).length === 0 &&
            (tier3 || []).length === 0;

          if (dataIsEmpty && attempt < 2) {
            continue;
          }

          setGold(tier2 || []);
          setSilver(tier1 || []);
          setBronze(tier3 || []);

          setLoading(false);
          return;
        } catch (error) {
          console.error("Error fetching data:", error);
          break;
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="sponsors bg-gradient-to-b from-nightNavy to-nightNavyDeep px-6 md:px-16 pt-16 pb-8">
      <div className="gostHunter" id="sponsors"></div>
      <TitleGeneralized
        padTop="0"
        textNone
        className="text-white font-space-mono font-bold uppercase tracking-tight"
      >
        Sponsors
      </TitleGeneralized>

      <SponsorRow
        title="Patrocinadors or"
        companies={gold}
        size="gold"
        loading={loading}
        emptyLabel={{
          loading: "Carregant reptes de sponsors...",
          empty: "No hi ha reptes disponibles actualment.",
        }}
      />
      <SponsorRow
        title="Patrocinadors plata"
        companies={silver}
        size="silver"
        loading={loading}
        emptyLabel={{
          loading: "Carregant sponsors...",
          empty: "No hi ha sponsors disponibles actualment.",
        }}
      />
      <SponsorRow
        title="Patrocinadors bronze"
        companies={bronze}
        size="bronze"
        loading={loading}
        emptyLabel={{
          loading: "Carregant sponsors...",
          empty: "No hi ha sponsors disponibles actualment.",
        }}
      />

      <p className="text-white">
        T&apos;agradaria ser un dels nostres col·laboradors o presentar un
        repte?
      </p>
      <p className="text-white">No ho dubtis, contacta amb nosaltres!</p>
      <Link to={"/contacte"}>
        <Button className="bg-primaryLanding text-[#2e2e2e] border-none font-space-mono" lg>
          Contacta
        </Button>
      </Link>
      <br />
    </div>
  );
};

export default Sponsors;
