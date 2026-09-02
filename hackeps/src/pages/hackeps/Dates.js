import React from "react";
import HomeFrame from "src/components/hackeps/Home/HomeFrame.js";
import HomeHeader from "src/components/hackeps/Home/HomeHeader.js";
import HomeFooter from "src/components/hackeps/Home/HomeFooter.js";
import DatesContent from "src/components/hackeps/Dates/DatesContent.js";

const DatesPage = () => {
  return (
    <div className="w-full overflow-x-hidden bg-[#94cbf5]">
      <HomeHeader />
      <HomeFrame>
        <DatesContent />
        <HomeFooter />
      </HomeFrame>
    </div>
  );
};

export default DatesPage;
