import React from "react";
import HomeFrame from "src/components/hackeps/Home/HomeFrame.js";
import HomeHeader from "src/components/hackeps/Home/HomeHeader.js";
import HomeFooter from "src/components/hackeps/Home/HomeFooter.js";
import DatesContent from "src/components/hackeps/Dates/DatesContent.js";
import { useSiteTheme } from "src/hooks/useSiteTheme";

const DatesPage = () => {
  const { sky } = useSiteTheme();
  return (
    <div className="w-full overflow-x-hidden" style={{ backgroundColor: sky }}>
      <HomeHeader />
      <HomeFrame>
        <DatesContent />
        <HomeFooter />
      </HomeFrame>
    </div>
  );
};

export default DatesPage;
