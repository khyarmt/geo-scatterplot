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
    mapboxgl.accessToken = "";
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-74.0242, 40.6941],
      zoom: 10.12,
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

  const handleButtonClick = () => {
    mapRef.current.flyTo({
      center: initialCenter,
      zoom: initialZoom,
    });
  };

  useEffect(() => {
    mapRef.current.resize();
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: width,
        height: height,
      }}
    >
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
      <button className="reset-button" onClick={handleButtonClick}>
        Reset
      </button>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          width: width,
          height: height,
        }}
        id="map-container"
        ref={mapContainerRef}
      ></div>
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
    <div ref={wrapperRef} className="geo-scatterplot-wrapper">
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
