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
      className="relative w-full overflow-hidden px-4 pb-16 pt-10 md:px-12 md:pb-24 md:pt-12 lg:px-20 lg:pb-32 lg:pt-[48px] xl:px-[180px]"
      style={{ backgroundColor: sky }}
    >
      <img
        src={cloud5}
        alt=""
        aria-hidden="true"
        width={360}
        height={160}
        className="pointer-events-none absolute right-[-16%] top-[24px] hidden h-auto w-[36%] max-w-[260px] object-contain sm:block md:right-[-40px] md:top-[40px] md:w-[360px] md:max-w-none lg:h-[160px]"
      />
      <img
        src={cloud2}
        alt=""
        aria-hidden="true"
        width={380}
        height={190}
        className="pointer-events-none absolute left-[-18%] top-[46%] hidden h-auto w-[40%] max-w-[280px] object-contain md:block md:left-[-60px] md:w-[380px] md:max-w-none lg:h-[190px]"
      />
      <img
        src={cloud5}
        alt=""
        aria-hidden="true"
        width={340}
        height={150}
        className="pointer-events-none absolute bottom-[40px] right-[-12%] hidden h-auto w-[34%] max-w-[240px] object-contain md:block md:bottom-[80px] md:right-[-20px] md:w-[340px] md:max-w-none lg:h-[150px]"
      />

      <h2
        className="relative z-10 m-0 mb-10 text-center font-space-mono text-[32px] font-bold leading-tight tracking-[-0.64px] md:mb-14 md:text-[48px] lg:mb-[64px] lg:text-[64px] lg:tracking-[-1.28px]"
        style={{ color: text }}
      >
        HORARI
      </h2>

      <div className="relative z-10 mx-auto max-w-[920px]">
        <div className="absolute bottom-6 left-[31px] top-6 w-[3px] bg-[#2c4a7c] md:bottom-8 md:left-[47px] md:top-8" />
        <ol className="relative m-0 list-none p-0">
          {SCHEDULE.map((item, index) => (
            <li
              key={`${item.title}-${index}`}
              className="mb-10 flex items-start last:mb-0 md:mb-14"
            >
              <div className="relative z-10 mr-4 h-16 w-16 shrink-0 overflow-hidden bg-transparent md:mr-10 md:h-[96px] md:w-[96px]">
                <img
                  src={item.head}
                  alt=""
                  width={96}
                  height={96}
                  className="h-16 w-16 object-contain md:h-[96px] md:w-[96px]"
                />
              </div>
              <div className="min-w-0 pt-1 md:pt-2">
                <h3
                  className="m-0 font-sans text-[20px] font-bold leading-none md:text-[32px]"
                  style={{ color: text }}
                >
                  {item.title}
                </h3>
                <p
                  className="mb-0 mt-2 max-w-[620px] font-space-mono text-[14px] leading-snug md:mt-3 md:text-[18px]"
                  style={{ color: text }}
                >
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
