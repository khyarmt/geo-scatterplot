import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import * as d3 from "d3";

const INITIAL_CENTER = [-74.0242, 40.6941];
const INITIAL_ZOOM = 10.12;

function GeoScatterplotContent({ width, height }) {
  const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  useEffect(() => {
    mapboxgl.accessToken = mapboxAccessToken;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
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
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
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
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          width: width,
          height: height,
        }}
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
    <div
      style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      ref={wrapperRef}
    >
      <GeoScatterplotContent width={size.width} height={size.height} />
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await fetch("data/airports.csv");
      const data = d3.csvParse(await response.text());
      for (const item of data) {
        item.airportId = Number(item.airport_id);
        item.altitude = Number(item.altitude);
        item.latitude = Number(item.latitude);
        item.longitude = Number(item.longitude);
        item.tzDatabaseTimezone = item.tz_database_timezone;
        delete item.airport_id;
        delete item.tz_database_timezone;
      }

      // array to GeoJSON
      const geoJson = {};
      geoJson.type = "FeatureCollection";
      geoJson.features = [];
      for (const item of data) {
        const feature = {};
        feature.type = "Feature";
        feature.geometry = {
          type: "Point",
          coordinates: [item.longitude, item.latitude],
        };
        feature.properties = {};
      }
      console.log(geoJson);

      setData(data);
    })();
  }, []);
  console.log(data);

  return (
    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}>
      <GeoScatterplot />
    </div>
  );
}

export default App;
