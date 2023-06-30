import { useCallback, useEffect, useState } from "react";
import throttle from "../functions/throttle";
const useResize = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    windowWidth: window.innerWidth,
    windowHeigth: window.innerHeight,
  });

  const resize = useCallback(() => {
    throttle(() => {
      setWindowDimensions({
        windowWidth: window.innerWidth,
        windowHeigth: window.innerHeight,
      });
    }, 1000);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return windowDimensions;
};
export default useResize;
