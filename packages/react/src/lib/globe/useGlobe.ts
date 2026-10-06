import { useContext } from "react";
import { GlobeContext } from "./GlobeContext";

// The globe the nearest `Globe` above put within reach. It comes back undefined until that globe
// has been built, which is what anything turning or telling a globe something waits on
export const useGlobe = () => useContext(GlobeContext);
