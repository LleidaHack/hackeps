import DarkPage from "src/components/hackeps/Layout/DarkPage.js";
import IfSponsors from "src/components/hackeps/Sponsors/IfSponsors.js";
import React from "react";
import { useParams } from "react-router-dom";

const Sponsors = () => {
  const { ids } = useParams();
  const sponsorId = ids || 0;

  return (
    <DarkPage minHeight={1100}>
      <IfSponsors id={sponsorId} />
    </DarkPage>
  );
};

export default Sponsors;
