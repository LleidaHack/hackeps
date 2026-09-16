import Firework from "src/components/hackeps/Home/Firework.js";
import firework1 from "src/assets/img/home10/firework-1.svg";
import firework2 from "src/assets/img/home10/firework-2.svg";
import firework3 from "src/assets/img/home10/firework-3.svg";

const DarkFireworks = () => (
  <>
    <Firework
      src={firework3}
      width={220}
      height={200}
      className="left-[2%] top-[10%] z-0 hidden h-[90px] w-[100px] -rotate-[12deg] sm:block sm:h-[140px] sm:w-[160px] lg:h-[180px] lg:w-[200px]"
    />
    <Firework
      src={firework1}
      width={180}
      height={170}
      className="bottom-[14%] left-[3%] z-0 h-[70px] w-[80px] rotate-[18deg] sm:h-[120px] sm:w-[130px] lg:h-[160px] lg:w-[170px]"
    />
    <Firework
      src={firework2}
      width={200}
      height={170}
      className="right-[3%] top-[8%] z-0 h-[70px] w-[85px] -rotate-[8deg] sm:h-[120px] sm:w-[140px] lg:h-[160px] lg:w-[190px]"
    />
    <Firework
      src={firework3}
      width={170}
      height={150}
      className="bottom-[12%] right-[4%] z-0 hidden h-[70px] w-[80px] rotate-[14deg] sm:block sm:h-[110px] sm:w-[130px] lg:h-[140px] lg:w-[160px]"
    />
  </>
);

export default DarkFireworks;
