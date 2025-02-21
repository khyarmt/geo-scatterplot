import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

const initialCenter = [-74.0242, 40.6941];
const initialZoom = 10.12;

function GeoScatterplotContent({ width, height }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [center, setCenter] = useState(initialCenter);
  const [zoom, setZoom] = useState(initialZoom);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia2h5YXJtdCIsImEiOiJjbGh5ODIxbWYwcmN3M2xwaWRtb3A1Z25iIn0.aLNbg04hNzdx-664l2P9Yw";
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
    });
    mapRef.current.on("move", () => {
      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    mapRef.current.resize();
  });

  const handleButtonClick = () => {
    mapRef.current.flyTo({
      center: initialCenter,
      zoom: initialZoom,
    });
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          margin: "12px",
          borderRadius: "4px",
          backgroundColor: "rgb(35 55 75 / 90%)",
          color: "#fff",
          padding: "6px 12px",
          fontFamily: "monospace",
          zIndex: 1,
        }}
      >
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
      <button
        style={{
          position: "absolute",
          top: "50px",
          left: "12px",
          zIndex: 1,
          padding: "4px 10px",
          borderRadius: "10px",
          cursor: "pointer",
        }}
        onClick={handleButtonClick}
      >
        Reset
      </button>
      <div ref={mapContainerRef} style={{ width: width, height: height }}></div>
    </div>
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

  return (
    <div
      ref={wrapperRef}
      style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
    >
      <GeoScatterplotContent width={size.width} height={size.height} />
    </div>
  );
}

function App() {
  return (
    <div>
      <GeoScatterplot />
    </div>
  );
}

export default App;
