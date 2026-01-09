import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

function GeoScatterplotContent({ width, height }) {
  const mapRef = useRef();
  const mapContainerRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken = "";
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        height: 0,
        left: 0,
        width: width,
        height: height,
        backgroundColor: "lightgrey",
      }}
      ref={mapContainerRef}
    ></div>
  );
}

function GeoScatterplot() {
  const wrapperRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      setSize({
        width: wrapperRef.current.clientWidth,
        height: wrapperRef.current.clientHeight,
      });
    });
    observer.observe(wrapperRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);
  console.log(size.width, size.height);

  return (
    <div
      style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      ref={wrapperRef}
    >
      <GeoScatterplotContent width={size.width} height={size.height} />
    </div>
  );
}

function App() {
  return (
    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}>
      <GeoScatterplot />
    </div>
  );
}

export default App;
