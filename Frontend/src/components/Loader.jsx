import React from "react";
import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";

const Loader = ({
  loading,
  size = "40",
  className="loaderWrapper",
  color = "oklch(0.55 0.25 262.87)",
  speed = "1.75",
  style = {
    height: "100%",
    width: "100%",
  },
}) => {
  return (
    loading && (
      <div className={className} style={style}>
        <Spiral size={size} speed={speed} color={color} />
      </div>
    )
  );
};

export default Loader;
