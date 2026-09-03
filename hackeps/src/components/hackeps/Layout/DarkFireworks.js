import Firework from "src/components/hackeps/Home/Firework.js";
import firework1 from "src/assets/img/home10/firework-1.png";
import firework2 from "src/assets/img/home10/firework-2.png";
import firework3 from "src/assets/img/home10/firework-3.png";

const DarkFireworks = () => (
  <>
    <Firework
      src={firework3}
      width={220}
      height={200}
      className="left-[4%] top-[12%] z-0 h-[180px] w-[200px] -rotate-[12deg]"
    />
    <Firework
      src={firework1}
      width={180}
      height={170}
      className="left-[6%] bottom-[18%] z-0 h-[160px] w-[170px] rotate-[18deg]"
    />
    <Firework
      src={firework2}
      width={200}
      height={170}
      className="right-[6%] top-[10%] z-0 h-[160px] w-[190px] -rotate-[8deg]"
    />
    <Firework
      src={firework3}
      width={170}
      height={150}
      className="right-[8%] bottom-[16%] z-0 h-[140px] w-[160px] rotate-[14deg]"
    />
  </>
);

export default DarkFireworks;
