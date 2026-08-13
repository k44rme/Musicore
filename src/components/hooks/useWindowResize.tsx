import { useState, useEffect } from "react";

function useWindowResize() {
    
    const getWindowSize = () => {
        const innerWidth = window.innerWidth;
		return innerWidth;
	};
    const [windowSize, setWindowSize] = useState(getWindowSize);
    
    useEffect(() => {
		function handleWindowResize() {
			setWindowSize(getWindowSize());
		}
	
		window.addEventListener("resize", handleWindowResize);
	
		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	}, []);
        
    return {
        getWindowSize,
        windowSize
    }
}

export default useWindowResize;