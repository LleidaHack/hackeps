import HomeHeader from "src/components/hackeps/Home/HomeHeader.js";
import HomeFooter from "src/components/hackeps/Home/HomeFooter.js";
import DarkFireworks from "src/components/hackeps/Layout/DarkFireworks.js";

export const DARK_BG = "#2e2e2e";

const DarkPage = ({ children, minHeight }) => {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip" style={{ backgroundColor: DARK_BG }}>
      <HomeHeader />
      <div className="flex w-full flex-1 flex-col font-space-mono">
        <div
          className="relative flex-1 overflow-hidden"
          style={{
            backgroundColor: DARK_BG,
            ...(minHeight ? { minHeight } : {}),
          }}
        >
          <DarkFireworks />
          <div className="relative z-10">{children}</div>
        </div>
        <HomeFooter compact />
      </div>
    </div>
  );
};

export default DarkPage;
