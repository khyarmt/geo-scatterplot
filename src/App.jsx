import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

function GeoScatterplotContent({ width, height }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  const initialCenter = [135, 35];
  const initialZoom = 8;

  const [center, setCenter] = useState(initialCenter);
  const [zoom, setZoom] = useState(initialZoom);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia2h5YXJtdCIsImEiOiJjbGh5ODIxbWYwcmN3M2xwaWRtb3A1Z25iIn0.aLNbg04hNzdx-664l2P9Yw";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
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
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
      <button className="reset-button" onClick={handleButtonClick}>
        Reset
      </button>
      <div
        ref={mapContainerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: width,
          height: height,
        }}
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
