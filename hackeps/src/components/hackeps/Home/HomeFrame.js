import { useEffect, useRef, useState } from "react";
import { useSiteTheme } from "src/hooks/useSiteTheme";

const FRAME_WIDTH = 1728;

const HomeFrame = ({ children, canvasBg }) => {
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState("auto");
  const { sky } = useSiteTheme();
  const backgroundColor = canvasBg || sky;

  useEffect(() => {
    const update = () => {
      const nextScale = window.innerWidth / FRAME_WIDTH;
      setScale(nextScale);
      if (innerRef.current) {
        setHeight(`${innerRef.current.offsetHeight * nextScale}px`);
      }
    };

    update();
    const observer = new ResizeObserver(update);
    if (innerRef.current) {
      observer.observe(innerRef.current);
    }
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="w-full overflow-hidden" style={{ height, backgroundColor }}>
      <div
        ref={innerRef}
        className="font-space-mono"
        style={{
          width: FRAME_WIDTH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default HomeFrame;
