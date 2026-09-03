import HomeHeader from "src/components/hackeps/Home/HomeHeader.js";
import HomeFooter from "src/components/hackeps/Home/HomeFooter.js";
import HomeFrame from "src/components/hackeps/Home/HomeFrame.js";
import DarkFireworks from "src/components/hackeps/Layout/DarkFireworks.js";

export const DARK_BG = "#2e2e2e";

const DarkPage = ({ children, minHeight }) => {
  return (
    <div className="w-full overflow-x-hidden" style={{ backgroundColor: DARK_BG }}>
      <HomeHeader showMlh={false} />
      <HomeFrame canvasBg={DARK_BG}>
        <div
          className="relative overflow-hidden"
          style={{
            backgroundColor: DARK_BG,
            ...(minHeight ? { minHeight } : {}),
          }}
        >
          <DarkFireworks />
          <div className="relative z-10">{children}</div>
        </div>
        <HomeFooter compact />
      </HomeFrame>
    </div>
  );
};

export default DarkPage;
