import { useEffect, useState } from "react";

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  
  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    if (typeof window !== 'undefined') {
      const updateSize = () => {
        setSize([window.innerWidth, window.innerHeight]);
      };
      
      // Set initial size
      updateSize();
      
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);
  
  return size;
};

export default useWindowSize;
