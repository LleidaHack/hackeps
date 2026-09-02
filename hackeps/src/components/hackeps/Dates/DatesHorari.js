import cabeza1 from "src/assets/img/home10/cabeza1.png";
import cabeza2 from "src/assets/img/home10/cabeza2.png";
import cabeza3 from "src/assets/img/home10/cabeza3.png";
import cabeza4 from "src/assets/img/home10/cabeza4.png";
import cabeza5 from "src/assets/img/home10/cabeza5.png";
import cabeza6 from "src/assets/img/home10/cabeza6.png";
import cloud2 from "src/assets/img/home10/cloud-2.png";
import cloud5 from "src/assets/img/home10/cloud-5.png";
import { useSiteTheme } from "src/hooks/useSiteTheme";

const SCHEDULE = [
  {
    head: cabeza1,
    title: "Exemple",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
  },
  {
    head: cabeza2,
    title: "Exemple",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
  },
  {
    head: cabeza3,
    title: "Exemple",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
  },
  {
    head: cabeza4,
    title: "Exemple",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
  },
  {
    head: cabeza5,
    title: "Exemple",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
  },
  {
    head: cabeza6,
    title: "Exemple",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
  },
];

const DatesHorari = () => {
  const { sky, text } = useSiteTheme();
  return (
    <section
      id="horari"
      className="relative w-full overflow-hidden px-[180px] pb-[280px] pt-[48px]"
      style={{ backgroundColor: sky }}
    >
      <img
        src={cloud5}
        alt=""
        aria-hidden="true"
        width={360}
        height={160}
        className="pointer-events-none absolute right-[-40px] top-[40px] h-[160px] w-[360px] max-w-none object-contain"
      />
      <img
        src={cloud2}
        alt=""
        aria-hidden="true"
        width={380}
        height={190}
        className="pointer-events-none absolute left-[-60px] top-[46%] h-[190px] w-[380px] max-w-none object-contain"
      />
      <img
        src={cloud5}
        alt=""
        aria-hidden="true"
        width={340}
        height={150}
        className="pointer-events-none absolute bottom-[80px] right-[-20px] h-[150px] w-[340px] max-w-none object-contain"
      />

      <h2
        className="relative z-10 m-0 mb-[64px] text-center font-space-mono text-[64px] font-bold leading-normal tracking-[-1.28px]"
        style={{ color: text }}
      >
        HORARI
      </h2>

      <div className="relative z-10 mx-auto max-w-[920px]">
        <div className="absolute bottom-8 left-[47px] top-8 w-[3px] bg-[#2c4a7c]" />
        <ol className="relative m-0 list-none p-0">
          {SCHEDULE.map((item, index) => (
            <li key={`${item.title}-${index}`} className="mb-14 flex items-start last:mb-0">
              <div className="relative z-10 mr-10 h-[96px] w-[96px] shrink-0 overflow-hidden bg-transparent">
                <img
                  src={item.head}
                  alt=""
                  width={96}
                  height={96}
                  className="h-[96px] w-[96px] object-contain"
                />
              </div>
              <div className="pt-2">
                <h3 className="m-0 font-sans text-[32px] font-bold leading-none" style={{ color: text }}>
                  {item.title}
                </h3>
                <p className="mt-3 mb-0 max-w-[620px] font-space-mono text-[18px] leading-snug" style={{ color: text }}>
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default DatesHorari;
